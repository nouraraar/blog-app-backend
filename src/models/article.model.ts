import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ProfileResponse } from './user.model';

export class createArticleDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  description: string;
  
  @IsString({ each: true })
  categories:string[];

}

export class UpdateArticleDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  body: string;

  @IsString()
  @IsOptional()
  description: string;
  
  @IsString({ each: true })
  @IsOptional()
  categories:string[];

}

export class CreateArticleBody {
  article: createArticleDTO;
}

export class UpdateArticleBody {

  article: UpdateArticleDTO;
}



export interface FindAllQuery {
  categories?: string[];
  author?: string;
  favorited?: string;
}

export interface ArticleResponse {
  slug: string;
  title: string;
  description: string;
  body: string;
  categories: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  favorited: boolean | null;
  likes: number;
  author: ProfileResponse;
}