import { Body, Controller, Delete, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiBearerAuth, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBody } from '@nestjs/swagger';
import { ArticleService } from 'src/article/article.service';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { CommentResponse, CreateCommentBody, CreateCommentDTO } from 'src/models/comment.model';
import { recordResponse } from 'src/models/recordResponse';
import { CommentsService } from './comments.service';



@Controller('comments')
export class CommentsController {
    constructor(
        private articleService: ArticleService,
        private readonly commentService: CommentsService) {}
 

@UseGuards(AuthGuard())
@ApiOkResponse({ description: 'List article comments' })
@Get('/:slug')
async findComments(
@User() user: UserEntity,
@Param('slug') slug: string): Promise<recordResponse<'comments', CommentResponse[]>>
    {
      const comments = await this.commentService.findByArticleSlug(slug,user);
      return { comments };
    }


@ApiCreatedResponse({ description: 'Create new comment' })
@UseGuards(AuthGuard())
@ApiBody({ type: CreateCommentBody })
@Post('/:slug')
async createComment(
@User() user: UserEntity,
@Param('slug') slug:string,
@Body('comment', ValidationPipe) data: CreateCommentDTO): Promise<recordResponse<'comment', CommentResponse>> 
    {
      const comment = await this.commentService.createComment(user, data ,slug);
      return { comment };
    }
  

@ApiBearerAuth()
@ApiOkResponse({ description: 'Delete comment' })
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard())
@Delete('/:slug/:id')
async deleteComment(
@User() user: UserEntity,
@Param('id') id: string): Promise<recordResponse<'comment', CommentResponse>>
    {
      const comment = await this.commentService.deleteComment(user,id);
      return { comment };
    }



@UseGuards(AuthGuard())
@ApiCreatedResponse({ description: 'Favorite comment' })
@ApiUnauthorizedResponse()
@Post('/:slug/:id/favorite')
async favoriteComment(@Param('id') id:string,@User() user: UserEntity): Promise<recordResponse<'comment', CommentResponse>> 
    {
      const comment = await this.commentService.favoriteComment(id,user);
      return { comment };
    }
    
  
@UseGuards(AuthGuard())
@ApiOkResponse({ description: 'Unfavorite comment' })
@ApiUnauthorizedResponse()
@Delete('/:slug/:id/favorite')
async unfavoriteComment(@Param('id') id: string,@User() user: UserEntity): Promise<recordResponse<'comment', CommentResponse>> 
    {
      const comment = await this.commentService.unfavoriteComment(id, user);
      return { comment };
    }
}
