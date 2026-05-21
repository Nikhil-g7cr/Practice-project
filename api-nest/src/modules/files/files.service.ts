import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';

import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

import { AppConfigService } from '../../config/appconfig.service';

@Injectable()
export class UploadService implements OnModuleInit {
  private containerClient: ContainerClient;

  constructor(private readonly appConfigService: AppConfigService) {
    const blobConfig = this.appConfigService.get('blobStorage');

    if (!blobConfig?.blobAccountConnectionString) {
      throw new Error(
        'Azure Storage connection string is not configured. Please set AZURE_STORAGE_CONNECTION_STRING in environment variables.',
      );
    }

    if (!blobConfig?.blobUploadContainer) {
      throw new Error(
        'Azure Storage container name is not configured. Please set AZURE_STORAGE_CONTAINER_NAME or BLOB_UPLOAD_CONTAINER in environment variables.',
      );
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      blobConfig.blobAccountConnectionString,
    );

    this.containerClient = blobServiceClient.getContainerClient(
      blobConfig.blobUploadContainer,
    );
  }

  // Runs automatically when module starts
  async onModuleInit() {
    try {
      await this.containerClient.createIfNotExists();
      // Only set access: 'blob' if you are 100% sure the storage account allows it.
      console.log('Azure Blob Container Ready');
    } catch (error: any) {
      console.error(
        'Failed to initialize Azure Blob Container:',
        error.message,
      );
    }
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not found');
    }

    try {
      // Replace spaces with dashes and remove special characters
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

      return {
        message: 'File uploaded successfully',
        fileName,
        url: blockBlobClient.url,
      };
    } catch (error) {
      console.error('Azure Upload Error:', error);
      throw new InternalServerErrorException(
        'Failed to upload file to storage',
      );
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
