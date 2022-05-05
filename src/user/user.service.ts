import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { ProfileResponse, UserResponse } from 'src/models/user.model';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {

    constructor(
      @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ) {}


    async findByUsername(username: string ,user?: UserEntity): Promise<ProfileResponse> 
          {
            return (
              await this.userRepo.findOne({where: { username },relations: ['followers']})
                   ).toProfile(user);
          }



    async followUser(currentUser: UserEntity,username: string): Promise<ProfileResponse> 
         {
            const user = await this.userRepo.findOne({where: { username },relations: ['followers']});
            user.followers.push(currentUser);
            await this.userRepo.save(user);
            return user.toProfile(currentUser);
          }


    async unfollowUser(currentUser: UserEntity,username: string): Promise<ProfileResponse> 
          {
            const user = await this.userRepo.findOne({where: { username },relations: ['followers']});
            user.followers = user.followers.filter(follower => follower !== currentUser);
            await this.userRepo.save(user);
            return user.toProfile(currentUser);
          }


    async showFollowers(username: string): Promise<UserResponse[]>
    {
           const user = await this.userRepo.findOne({where: { username },relations: ['followers']});
           return (user.followers).map(user=>user.toJSON());
    }

}
