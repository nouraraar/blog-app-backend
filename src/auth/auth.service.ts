import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { UserEntity } from 'src/entities/user.entity';
import { AuthResponse,loginUserDTO, registerUserDTO, UpdateUserDTO, UserResponse } from 'src/models/user.model';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  
    constructor(
    @InjectRepository(UserEntity) private userRepo:Repository<UserEntity>,
    private jwtService: JwtService,
              ){}



async findCurrentUser(username: string): Promise<AuthResponse> 
    {
      const user = await this.userRepo.findOne({ where: { username } });
      const payload = { username };
      const token = this.jwtService.sign(payload);
      return { ...user.toJSON(), token };
    }

  
async register(data:registerUserDTO):Promise<AuthResponse>{
  try {
    const user = this.userRepo.create(data);
    await this.userRepo.save(user);
    const payload = { username: user.username };
    const token = this.jwtService.sign(payload);
    return { ...user.toJSON(),token};
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new ConflictException('Username has already been taken');
    }
    else{
      throw new InternalServerErrorException();
    }
}
     
}

async login({ username , password }:loginUserDTO): Promise<AuthResponse> 
{    
  try {
    const user = await this.userRepo.findOne({ where:  {username} });
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username };
    const token = this.jwtService.sign(payload);
    return { ...user.toJSON(), token };
  } catch (err) {
    throw new UnauthorizedException('Invalid credentials');
  }
}


  async updateUser(data: UpdateUserDTO,id:string): Promise<UserResponse> 
  { 
      const user = await this.userRepo.findOne({ where: { id } });
      await this.userRepo.update({ id }, data);
      return { ...user.toJSON()};
 
  }
}
