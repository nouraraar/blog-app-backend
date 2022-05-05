import {Entity,Column,BeforeInsert,ManyToOne,ManyToMany,JoinTable,OneToMany, PrimaryGeneratedColumn} from 'typeorm';
  import { classToPlain } from 'class-transformer';
  import * as slugify from 'slug';
  import { UserEntity } from './user.entity';
  import { CommentEntity } from './comment.entity';
import { ArticleResponse} from 'src/models/article.model';

  
  @Entity('articles')
  export class ArticleEntity {
    @PrimaryGeneratedColumn('uuid') id: string; 
    @Column()
    slug: string;
  
    @Column()
    title: string;

    @Column("simple-array")
    categories:string[];

    @Column()
    description: string;
  
    @Column()
    body: string;

    @Column()
    likes:number;
  
    @ManyToMany(type => UserEntity,user => user.favorites,{ eager: true })
    @JoinTable()
    favoritedBy: UserEntity[];

    @OneToMany(type => CommentEntity,comment => comment.article)
    comments: CommentEntity[];
  
    @ManyToOne(type => UserEntity,user => user.articles,{eager:true })
    author: UserEntity;
  
    @BeforeInsert()
    generateSlug() {
      this.slug =slugify(this.title, { lower: true }) +'-' +((Math.random() * Math.pow(36, 6)) | 0).toString(36);}
  
    toJSON() {
      return classToPlain(this);
    }
    
  
    toArticle(user?: UserEntity): ArticleResponse {
      let favorited = null;
      if (user) {
        favorited = this.favoritedBy.map(user => user.id).includes(user.id);
      }
      const article: any = this.toJSON();
      return { ...article, favorited };
    }
  }