
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleService } from 'src/article/article.service';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CommentResponse, CreateCommentDTO } from 'src/models/comment.model';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {

    constructor(
    @InjectRepository(CommentEntity) private commentRepo: Repository<CommentEntity>, 

    private articleService: ArticleService){}



//Authentication optional, returns multiple comments from an article
     async  findByArticleSlug(slug: string,user : UserEntity): Promise<CommentResponse[]> 
    {  
    const comments= await this.commentRepo.find({where: {article:{id:(await this.articleService.findBySlug(slug)).id}},relations: ['article']});
    return comments.map(comment=>comment.toComment(user))
    }
 


     findById(id: string): Promise<CommentEntity> 
    {
      return   this.commentRepo.findOne({ where: { id } });
    }



//Add comment to an article :: Authentication required, returns the created Comment
     async createComment(user: UserEntity,data: CreateCommentDTO,slug:string): Promise<CommentResponse> 
      {
        const comment = this.commentRepo.create(data);
        comment.article= (await this.articleService.findBySlug(slug));
        comment.author = user;
        await this.commentRepo.save(comment);
        return (await this.commentRepo.findOne({ where: { body: data.body } })).toJSON();

      }
     
  
//Authentication required
     async deleteComment(user: UserEntity, id: string): Promise<CommentResponse> 
     {
        const comment = await this.commentRepo.findOne({ where: { id, 'author.id': user.id }});
        await this.commentRepo.remove(comment);
        return comment.toJSON();
      }
 
      
//Authentication required, returns the Comment
      async favoriteComment(id:string, user: UserEntity): Promise<CommentResponse> 
      {
        const comment = await this.findById(id);
        comment.favoritedBy.push(user);
        comment.likes=comment.favoritedBy.length
        await this.commentRepo.save(comment);
        return comment.toComment(user);
      }
    

//Authentication required, returns the Comment
      async unfavoriteComment(id:string, user: UserEntity): Promise<CommentResponse> 
      {
        const comment = await this.findById(id);
        comment.favoritedBy = comment.favoritedBy.filter(fav => fav.id !== user.id);
        await this.commentRepo.save(comment);
        return comment.toComment(user);
      }
}