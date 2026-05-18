// upload.service.ts

import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import {
  BlobServiceClient,
  ContainerClient,
} from '@azure/storage-blob';

import { AppConfigService } from '../../config/appconfig.service';

@Injectable()
export class UploadService implements OnModuleInit {
  private containerClient: ContainerClient;

  constructor(
    private readonly appConfigService: AppConfigService,
  ) {
    const blobConfig =
      this.appConfigService.get('blobStorage');

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(
        blobConfig.blobAccountConnectionString,
      );

    this.containerClient =
      blobServiceClient.getContainerClient(
        blobConfig.blobUploadContainer,
      );
  }

  // Runs automatically when module starts
  async onModuleInit() {
    await this.containerClient.createIfNotExists({
      access: 'blob',
    });

    console.log('Azure Blob Container Ready');
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('File not found');
    }

    const fileName =
      `${Date.now()}-${file.originalname}`;

    const blockBlobClient =
      this.containerClient.getBlockBlobClient(
        fileName,
      );

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
  }

  async deleteFile(fileName: string) {
    const blockBlobClient =
      this.containerClient.getBlockBlobClient(
        fileName,
      );

    await blockBlobClient.deleteIfExists();

    return {
      message: 'File deleted successfully',
    };
  }
}