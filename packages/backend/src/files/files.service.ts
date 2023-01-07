import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicFile } from './publicFile.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
  ) {}

  async uploadPublicFile(
    dataBuffer: Buffer,
    ext,
    folder,
    name = null,
    type = null,
  ) {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: dataBuffer,
        Key: `${folder}/${uuid()}.${ext}`,
      })
      .promise();

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
      name: name ? name : '',
      type: type ? type : '',
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }

  async upload(images, user) {
    const imgs: [{ url?: string; }?] = [];
    for (const image of images) {
      const block = image.url.split(';');
      if (block.length > 1) {
        const contentType = block[0].split(':')[1].split('/')[1];
        const realData = block[1].split(',')[1];
        const imageBuffer = Buffer.from(realData, 'base64');
        const file = await this.uploadPublicFile(
          imageBuffer,
          contentType,
          !user.owner ? user._id : user.owner,
          image.name,
          image.type,
        );
        imgs.push(file);
      } else if (image.key) {
        imgs.push(image);
      }
    }
    return imgs;
  }
}
