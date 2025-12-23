import { IsArray, IsNumber } from "class-validator";

export class NotificationIdsDto {
  @IsArray()
  @IsNumber({}, {each: true})
  notificationIds: number[]
}