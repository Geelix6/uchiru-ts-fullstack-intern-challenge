import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  @IsNotEmpty()
  cat_id: string;

  @IsUrl()
  @IsNotEmpty()
  cat_url: string;
}
