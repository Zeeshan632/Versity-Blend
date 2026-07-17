import { Injectable } from '@nestjs/common';
import 'multer';
import { v2 as cloudinary } from 'cloudinary';

export type CloudinaryFolder = 'profiles' | 'posts' | 'messages'

@Injectable()
export class UploadService {
    async uploadImage(file: Express.Multer.File, folder: CloudinaryFolder): Promise<string>{
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: `versity-blend/${folder}`,
                transformation: [
                    {quality: 'auto'},
                    {fetch_format: 'auto'}
                ]
            }, (error, result) => {
                if(error) return reject(error)
                resolve(result.secure_url)
            });
            uploadStream.end(file.buffer)
        })
    }

    async deleteImage(publicId: string): Promise<void>{
        await cloudinary.uploader.destroy(publicId)
    }
}
