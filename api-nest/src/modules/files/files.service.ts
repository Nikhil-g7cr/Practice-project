import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

// Import the specific SAS generation tools
import { 
  BlobServiceClient, 
  ContainerClient, 
  BlobSASPermissions, 
  StorageSharedKeyCredential, 
  generateBlobSASQueryParameters 
} from '@azure/storage-blob';

import { AppConfigService } from '../../config/appconfig.service';

@Injectable()
export class UploadService implements OnModuleInit {
  private containerClient: ContainerClient;

  constructor(private readonly appConfigService: AppConfigService) {
    const blobConfig = this.appConfigService.get('blobStorage');
    console.log("Name:", blobConfig.blobAccountName);
    console.log("Key Length:", blobConfig.blobAccountKey?.length);
    console.log("String Length:", blobConfig.blobAccountConnectionString?.length);

    if (!blobConfig?.blobAccountConnectionString) {
      throw new Error('Azure Storage connection string is not configured.');
    }
    if (!blobConfig?.blobUploadContainer) {
      throw new Error('Azure Storage container name is not configured.');
    }
    if (!blobConfig?.blobAccountKey) {
      throw new Error('Azure Storage Account Name or Key is not configured in environment variables.');
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      blobConfig.blobAccountConnectionString,
    );

    this.containerClient = blobServiceClient.getContainerClient(
      blobConfig.blobUploadContainer,
    );
  }

  async onModuleInit() {
    try {
      await this.containerClient.createIfNotExists();
      console.log('Azure Blob Container Ready');
    } catch (error: any) {
      console.error('Failed to initialize Azure Blob Container:', error.message);
    }
  }

  // Updated SAS generation logic using explicit credentials
  async getSasUrl(fileName: string): Promise<string> {
    const blobConfig = this.appConfigService.get('blobStorage');
    
    // 1. Create a credential object using your explicit Account Name and Key
    const sharedKeyCredential = new StorageSharedKeyCredential(
      blobConfig.blobAccountName,
      blobConfig.blobAccountKey
    );


    // 2. Generate the SAS Token string
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: this.containerClient.containerName,
        blobName: fileName,
        permissions: BlobSASPermissions.parse("r"),
        // FIX: Subtract 5 minutes to prevent "Time Skew" authentication errors
        startsOn: new Date(new Date().valueOf() - 5 * 60 * 1000), 
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), 
      },
      sharedKeyCredential
    ).toString();

    // 3. Append the signed token to the standard blob URL
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    const finalUrl= `${blockBlobClient.url}?${sasToken}`;
    return finalUrl;
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not found');
    }

    try {
      const sanitizedOriginalName = file.originalname
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.\-]/g, '');
      const fileName = `${Date.now()}-${sanitizedOriginalName}`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });

      // 3. Generate SAS URL for the newly uploaded file
      const sasUrl = await this.getSasUrl(fileName);

      return {
        message: 'File uploaded successfully',
        fileName,
        url: sasUrl, // Return the SAS URL instead of blockBlobClient.url
      };
    } catch (error) {
      console.error('Azure Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload file to storage');
    }
  }

  async getFileStream(blobName: string) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    
    if (!(await blockBlobClient.exists())) {
      throw new NotFoundException('File not found in storage');
    }

    const downloadResponse = await blockBlobClient.download(0);
    
    return {
      stream: downloadResponse.readableStreamBody,
      contentType: downloadResponse.contentType, 
    };
  }

  async getAllFiles() {
    try {
      const files: any[] = [];
      
      for await (const blob of this.containerClient.listBlobsFlat()) {
        // 4. Generate SAS URL for each file in the list
        const sasUrl = await this.getSasUrl(blob.name);
        
        files.push({
          fileName: blob.name,
          url: sasUrl, // Return the SAS URL instead of blockBlobClient.url
          size: blob.properties.contentLength, 
          contentType: blob.properties.contentType,
          createdAt: blob.properties.createdOn,
        });
      }

      return files;
    } catch (error) {
      console.error('Failed to list files:', error);
      throw new InternalServerErrorException('Could not retrieve files from storage');
    }
  }

  async deleteFile(fileName: string) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.deleteIfExists();

    return {
      message: 'File deleted successfully',
    };
  }
}