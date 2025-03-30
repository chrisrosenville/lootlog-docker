import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { firebaseAdmin } from "firebase";
import { Image } from "src/entities/image.entity";
import { Repository } from "typeorm";

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepo: Repository<Image>,
  ) {}

  async getAllImages() {
    return await this.imageRepo.find();
  }

  async getImageById(id: number) {
    return await this.imageRepo.findOne({ where: { id } });
  }

  async getImageByName(name: string) {
    return await this.imageRepo.findOne({ where: { name } });
  }

  async uploadToStorage(
    image: Express.MulterFile,
  ): Promise<{ url: string; name: string }> {
    try {
      const sanitizedFilename = image.originalname.replace(
        /[^a-zA-Z0-9.\-_]/g,
        "",
      );
      const bucket = firebaseAdmin.storage().bucket();

      const newImagePath = bucket.file(`images/${sanitizedFilename}`);
      await newImagePath.save(image.buffer, {
        metadata: {
          contentType: image.mimetype,
        },
        public: true,
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/images/${sanitizedFilename}`;

      const getImage = newImagePath.get();

      console.log("Get image:", getImage);

      if (getImage)
        return {
          url: publicUrl,
          name: sanitizedFilename,
        };
      else return null;
    } catch (err) {
      console.error("Error uploading image to Firebase:", err);
      throw err;
    }
  }

  async deleteByName(imageName: string) {
    try {
      const image = await this.getImageByName(imageName);

      const bucket = firebaseAdmin.storage().bucket();
      const deletedFile = await bucket.file(`images/${imageName}`).delete();

      console.log("Attempting to delete image from storage:", deletedFile);

      return await this.imageRepo.delete(image);
    } catch (err) {
      console.error("Error deleting image from Firebase:", err);
      throw err;
    }
  }

  async create(image: Express.MulterFile): Promise<Image> {
    try {
      const firebaseImage = await this.uploadToStorage(image);

      const imageObject: Partial<Image> = {
        name: firebaseImage.name,
        type: image.mimetype,
        url: firebaseImage.url,
      };

      const createdImage = this.imageRepo.create(imageObject);
      return await this.imageRepo.save(createdImage);
    } catch (err) {
      console.error("Error uploading image:", err);
      throw new Error("Error uploading image");
    }
  }
}
