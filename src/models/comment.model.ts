import { ApiProperty } from '@nestjs/swagger/dist';
import { IsString } from 'class-validator';
import { UserEntity } from 'src/entities/user.entity';
import { ProfileResponse } from './user.model';

export class CreateCommentDTO {
  @IsString()
  body: string;
}

export class CreateCommentBody {
  @ApiProperty()
  comment: CreateCommentDTO;
}
export class CommentResponse {
  id: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  body: string;
  likes:number;
  favorited:boolean;
  author: ProfileResponse | UserEntity;
}