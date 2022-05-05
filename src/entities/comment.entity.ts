import { Entity, Column, ManyToOne, ManyToMany, JoinTable, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { classToPlain, Exclude } from 'class-transformer';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';
import { CommentResponse } from 'src/models/comment.model';


@Entity('comments')
export class CommentEntity {


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @PrimaryGeneratedColumn('uuid') 
  id: string; 

  @Column()
  body: string;

  @Column()
  likes:number;

  @ManyToOne(type => UserEntity,user => user.comments,{ eager: true },)
  author: UserEntity;
  
  @ManyToOne(type => ArticleEntity,article => article.comments)
  article: ArticleEntity;

  @ManyToMany(type => UserEntity,user => user.commentFavorites,{ eager: true })
  @JoinTable()
  favoritedBy: UserEntity[];
  
  toJSON() {
    return <CommentResponse>classToPlain(this);
  }

  toComment(user?: UserEntity): CommentResponse {
    let favorited = null;
    if (user) {
      favorited = this.favoritedBy.map(user => user.id).includes(user.id);
    }
    const comment: any = this.toJSON();
    delete comment.article;
    return { ...comment,favorited};
  }
}