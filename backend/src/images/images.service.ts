import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "express";
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

  async deleteFromStorage(
    imageName: string,
  ): Promise<{ error: boolean; message: string }> {
    const bucket = firebaseAdmin.storage().bucket();
    try {
      await bucket.file(`images/${imageName}`).delete();
      console.log(`Image "${imageName}" deleted from Firebase Storage.`);
    } catch (firebaseError) {
      console.error(
        `Error deleting image "${imageName}" from Firebase Storage:`,
        firebaseError,
      );
      return {
        error: true,
        message: "Error deleting image from Firebase Storage",
      };
    }

    return {
      error: false,
      message: "Image deleted successfully",
    };
  }

  async create(
    image: Express.MulterFile,
  ): Promise<{ error: boolean; message: string; image: Image | null }> {
    try {
      const imageExists = await this.getImageByName(image.originalname);
      if (imageExists) {
        return {
          error: true,
          message: "An image with that name already exists",
          image: null,
        };
      }

      const firebaseImage = await this.uploadToStorage(image);
      if (!firebaseImage) {
        return {
          error: true,
          message: "Unexpected error while uploading image",
          image: null,
        };
      }

      const imageObject: Partial<Image> = {
        name: firebaseImage.name,
        type: image.mimetype,
        url: firebaseImage.url,
      };

      const imageInstance = this.imageRepo.create(imageObject);
      const savedImage = await this.imageRepo.save(imageInstance);
      return {
        error: false,
        message: "Image uploaded successfully",
        image: savedImage,
      };
    } catch (err) {
      return {
        error: true,
        message: "Unknown error uploading image",
        image: null,
      };
    }
  }
}
