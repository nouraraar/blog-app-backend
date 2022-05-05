import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { recordResponse } from 'src/models/recordResponse';
import { ProfileResponse, UserResponse } from 'src/models/user.model';
import { UserService } from './user.service';



@Controller('profile')
export class ProfileController {

    constructor(private userService: UserService) {}


@Get(':username')
async findProfile(@Param('username') username: string,@Body() user: UserEntity): Promise<recordResponse<"profile",ProfileResponse>>
{
    const profile = await this.userService.findByUsername(username,user);
    if (!profile) {
      throw new NotFoundException();
    }
    return {profile} ;
}


@ApiOkResponse({ description: 'Follow user' })
@ApiUnauthorizedResponse()
@Post(':username/follow')
@HttpCode(200)
@UseGuards(AuthGuard())
async followUser(@User() user: UserEntity,@Param('username') username: string): Promise<recordResponse<"profile",ProfileResponse>>
  {
    const profile = await this.userService.followUser(user, username);
    return {profile};
  }
  


@ApiOkResponse({ description: 'Unfollow user' })
@ApiUnauthorizedResponse()
@Delete(':username/follow')
@UseGuards(AuthGuard())
async unfollowUser(@User() user: UserEntity,@Param('username') username: string): Promise<recordResponse<"profile",ProfileResponse>>
  {
    const profile = await this.userService.unfollowUser(user, username);
    return {profile};
  }


@Get(':username/followers')
async showFollowers(@Param('username') username: string): Promise<recordResponse<'followers',UserResponse[]> & recordResponse<'followersCount',number>>
  {
      const followers = await this.userService.showFollowers(username);
      if (!followers) {
        throw new NotFoundException();
      }
      return {followers,followersCount:followers.length} ;
  }
}
