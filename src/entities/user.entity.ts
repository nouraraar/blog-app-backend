import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { CommentEntity } from "./comment.entity";
import { classToPlain, Exclude } from "class-transformer";
import { UserResponse } from "src/models/user.model";
import { ArticleEntity } from "./article.entity";

@Entity('user')
export class UserEntity {
    @Exclude()
    @PrimaryGeneratedColumn('uuid') 
    id: string;  

    @Column({ 
        type: 'varchar', 
        nullable: false, 
        unique:true
    }) 
    username: string;

    @Column({ 
      type: 'varchar', 
      nullable: false 
     }) 
     email: string;

    @Column({ 
      type: 'varchar', 
      nullable: false 
  }) 
    @Exclude()
    password: string;  

    @Column({ default: '' })
    bio: string;

    @Column({ default: '' })
    gender: string;
 
    @Column({ default: '' })
    phone: string;
      
    @Column({ 
        default: null, 
        nullable: true 
    })
    image: string | null;


    @ManyToMany(type => UserEntity,user => user.following)
    @JoinTable()
    followers: UserEntity[];

    @ManyToMany(type => UserEntity,user => user.followers)
    following: UserEntity[];
  
    @OneToMany(type => CommentEntity,comment => comment.author)
    comments: CommentEntity[];
  
    @OneToMany(type => ArticleEntity,article => article.author)
    articles: ArticleEntity[];

    @ManyToMany(type => CommentEntity,comment => comment.favoritedBy)
    commentFavorites: CommentEntity[];

    @ManyToMany(type => ArticleEntity,article => article.favoritedBy)
    favorites: ArticleEntity[];

    @BeforeInsert()  
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);  
    }
    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password);
      }
    
    toJSON(): UserResponse{
        return <UserResponse>classToPlain(this);
      }

    toProfile(user?: UserEntity) {
        let following = null;
        if (user) {
          following = this.followers.includes(user);
        }
        const profile: any = this.toJSON();
        delete profile.followers;
        return { ...profile, following };
      }
}


