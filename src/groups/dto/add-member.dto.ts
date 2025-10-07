import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class AddMemberDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  groupId: number

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  userId: number
}