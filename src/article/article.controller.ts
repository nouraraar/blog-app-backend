import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger/dist/decorators';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { ArticleResponse, CreateArticleBody, createArticleDTO, FindAllQuery, UpdateArticleBody, UpdateArticleDTO } from 'src/models/article.model';
import { recordResponse } from 'src/models/recordResponse';
import { ArticleService } from './article.service';




@Controller('article')
export class ArticleController {
    
  constructor(private articleService: ArticleService,) {}

@UseGuards(AuthGuard())
@ApiOkResponse({ description: 'List all articles' })
@Get()
async findAll(
@User() user: UserEntity,
@Query() query: FindAllQuery): Promise<recordResponse<'articles', ArticleResponse[]> & recordResponse<'articlesCount', number>>
 {
      const articles = await this.articleService.findAll(user, query);
      return {
        articles,
        articlesCount: articles.length,
      };
  }
  


@ApiBearerAuth()
@ApiOkResponse({ description: 'List all articles of users feed' })
@ApiUnauthorizedResponse()
@Get('/feed')
@UseGuards(AuthGuard())
async findFeed(
@User() user: UserEntity,
@Query() query: FindAllQuery): Promise<recordResponse<'articles', ArticleResponse[]> & recordResponse<'articlesCount', number>> 
  {
      const articles = await this.articleService.findFeed(user, query);
      return { articles, articlesCount: articles.length };
  }
  


@ApiOkResponse({ description: 'Article with slug :slug' })
@Get('/:slug')
async findBySlug(
@Param('slug') slug: string,
@User() user: UserEntity):Promise<recordResponse<'article', ArticleResponse>> 
  {
      const article = await this.articleService.findBySlug(slug);
      return { article: article.toArticle(user) };
  }
  


@ApiBearerAuth()
@ApiCreatedResponse({ description: 'Create article' })
@ApiUnauthorizedResponse()
@ApiBody({ type: CreateArticleBody })
@UseGuards(AuthGuard())
@Post()
async createArticle(
@User() user: UserEntity,
@Body('article', ValidationPipe) data: createArticleDTO): Promise<recordResponse<'article', ArticleResponse>>
  {
      const article = await this.articleService.createArticle(user, data);
      return { article };
  }
  


@ApiBearerAuth()
@ApiOkResponse({ description: 'Update article' })
@ApiUnauthorizedResponse()
@ApiBody({ type: UpdateArticleBody })
@UseGuards(AuthGuard())
@Put('/:slug')
async updateArticle(
@Param('slug') slug: string,
@User() user: UserEntity,
@Body('article', ValidationPipe) data: UpdateArticleDTO): Promise<recordResponse<'article', ArticleResponse>> 
  {
      const article = await this.articleService.updateArticle(slug, user, data);
      return { article };
  }
  


@ApiBearerAuth()
@ApiOkResponse({ description: 'Delete article' })
@ApiUnauthorizedResponse()
@Delete('/:slug')
@UseGuards(AuthGuard())
async deleteArticle(
@Param() slug: string,
@User() user: UserEntity): Promise<recordResponse<'article', ArticleResponse>>  
  {
      const article = await this.articleService.deleteArticle(slug, user);
      return { article };
  }
    
    
    
@ApiBearerAuth()
@ApiCreatedResponse({ description: 'Favorite article' })
@ApiUnauthorizedResponse()
@Post('/:slug/favorite')
@UseGuards(AuthGuard())
async favoriteArticle(
@Param('slug') slug: string,
@User() user: UserEntity,): Promise<recordResponse<'article', ArticleResponse>> 
  {
      const article = await this.articleService.favoriteArticle(slug, user);
      return { article };
  }
  


@ApiBearerAuth()
@ApiOkResponse({ description: 'Unfavorite article' })
@ApiUnauthorizedResponse()
@Delete('/:slug/favorite')
@UseGuards(AuthGuard())
async unfavoriteArticle(
@Param('slug') slug: string,
@User() user: UserEntity): Promise<recordResponse<'article', ArticleResponse>> 
  {
      const article = await this.articleService.unfavoriteArticle(slug, user);
      return { article };
  }

}

