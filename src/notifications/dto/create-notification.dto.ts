import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { NotificationType } from "../entity/notification.entity";

export class CreateNotificationDto {
  @IsNumber()
  userId: number // id of the receiver

  @IsNumber()
  actorId: number // id of the actor

  @IsEnum(NotificationType)
  type: NotificationType

  @IsString()
  @IsOptional()
  refrenceId?: number

  @IsString()
  message: string

  @IsOptional()
  meta?: Record<string, any>
}