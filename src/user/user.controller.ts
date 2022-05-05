import { Body, Controller, Get, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { recordResponse } from 'src/models/recordResponse';
import { UpdateUserDTO, UserResponse } from 'src/models/user.model';



@Controller('user')
export class UserController {
    
  constructor(private authService: AuthService) {}
      

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(@User() { username }: UserEntity): Promise<recordResponse<"user",UserResponse>>
  {
    const user = await this.authService.findCurrentUser(username);
    return {user};
  }


  @Put('update')
  @UseGuards(AuthGuard())
  async update(
  @User() { id }: UserEntity,
  @Body('user',new ValidationPipe({ transform: true, whitelist: true })) data: UpdateUserDTO): Promise<recordResponse<"user",UserResponse>>
      {
        const user = await this.authService.updateUser(data, id);
        return {user};
      }
}
