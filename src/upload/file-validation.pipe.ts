import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File) {
        if(!file){
            throw new BadRequestException('No file uploaded!')
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
        if(!allowedMimeTypes.includes(file.mimetype)){
            throw new BadRequestException('Only JPEG, PNG and WebP files are allowed')
        }

        const maxSize = 5 * 1024 * 1024; //5MB
        if(file.size > maxSize){
            throw new BadRequestException('File size must be under 5MB')
        }

        return file;
    }
}