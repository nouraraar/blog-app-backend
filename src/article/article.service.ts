import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import { FindAllQuery, ArticleResponse, UpdateArticleDTO, createArticleDTO } from 'src/models/article.model';
import { Repository} from 'typeorm';




@Injectable()
export class ArticleService {


    constructor(
      @InjectRepository(ArticleEntity) private articleRepo: Repository<ArticleEntity>,

      @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
      ) {}
    

//returns most recent articles globally by default, provide author or favorited query parameter to filter results
//Authentication optional, will return multiple articles, ordered by most recent first
      async findAll(user: UserEntity,query: FindAllQuery): Promise<ArticleResponse[]> 
      {
        let findOptions: any = {
          where: {},
        };
        if (query.author) {
          findOptions.where['author.username'] = query.author;
        }
        if (query.favorited) {
          findOptions.where['favoritedBy.username'] = query.favorited;
        }
        return (await this.articleRepo.find(findOptions)).map(article =>
          article.toArticle(user),
        );
      }
  

//Authentication required, will return multiple articles created by followed users, ordered by most recent first.
    async findFeed(user: UserEntity,query: FindAllQuery): Promise<ArticleResponse[]> 
    {
        const { following } = await this.userRepo.findOne({where: { id: user.id },relations: ['following']});
        const findOptions = {...query,where: following.map(follow => ({ author: follow.id }))};
        return (await this.articleRepo.find(findOptions)).map(article =>article.toArticle(user));
      }


      findBySlug(slug: string): Promise<ArticleEntity> 
      {
        return this.articleRepo.findOne({where: { slug }});
      }
    

      private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
        return article.author.id === user.id;
      }
    
  
//Authentication required, will return an Article :: Required fields: title, description, body
      async createArticle(user: UserEntity,data: createArticleDTO): Promise<ArticleResponse> 
      {
        const article = this.articleRepo.create(data);
        article.author = user;
        const { slug } = await this.articleRepo.save(article);
        return (await this.articleRepo.findOne({ slug })).toArticle(user);
      }
    

//Authentication required, returns the updated Article :: Optional fields: title, description, body
      async updateArticle(slug: string,user: UserEntity,data: UpdateArticleDTO): Promise<ArticleResponse> 
      {
        const article = await this.findBySlug(slug);
        if (!this.ensureOwnership(user, article)) 
        {
          throw new UnauthorizedException();
        }
        await this.articleRepo.update({ slug }, data);
        return article.toArticle(user);
      }



//Authentication required
      async deleteArticle(slug: string,user: UserEntity): Promise<ArticleResponse> 
      {
        const article = await this.findBySlug(slug);
        if (!this.ensureOwnership(user, article)) 
        {
          throw new UnauthorizedException();
        }
        await this.articleRepo.remove(article);
        return article.toArticle(user);
      }
    

//Authentication required, returns the Article
     async favoriteArticle(slug: string,user: UserEntity): Promise<ArticleResponse> 
     {
        const article = await this.findBySlug(slug);
        article.likes=article.favoritedBy.push(user);
        await this.articleRepo.save(article);
        return (await this.findBySlug(slug)).toArticle(user);
      }
    


//Authentication required, returns the Article
      async unfavoriteArticle(slug: string,user: UserEntity): Promise<ArticleResponse> 
      {
        const article = await this.findBySlug(slug);
        article.favoritedBy = article.favoritedBy.filter(fav => fav.id !== user.id);
        article.likes=article.favoritedBy.length;
        await this.articleRepo.save(article);
        return (await this.findBySlug(slug)).toArticle(user);
      }  
}
