import { IsNotEmpty, IsNumber } from "class-validator";

export class JoinRoomPayloadDto {
  @IsNumber()
  @IsNotEmpty()
  universityId: number
}