import { IsEmail, IsNotEmpty ,IsOptional,MinLength} from 'class-validator';

export class registerUserDTO {
    @IsNotEmpty()  
    username: string;

    @IsNotEmpty()  
    @MinLength(4) 
    password: string;

    @IsNotEmpty() 
    @IsEmail()  
    email: string;
} //pass the information provided by the user upon registering a new account.

export class loginUserDTO {  
     @IsNotEmpty() 
     readonly username: string;
     @IsNotEmpty() 
     @MinLength(4)  
     readonly password: string;
} //verify the user's credentials when they are trying to login.

export class UpdateUserDTO {
    @IsOptional()
    @IsEmail()
    email: string;
    
    @IsOptional()
    username:string;
    
    @IsOptional()
    password: string;

    @IsOptional()
    image: string;
  
    @IsOptional()
    bio: string;
  }
  
export interface UserResponse {
    username: string;
    email: string;
    bio: string;
    image: string | null;
  }
export interface AuthResponse extends UserResponse {
    token: string;
  }
  
export interface ProfileResponse extends UserResponse {
    following: boolean | null;
  }

export interface AuthPayload {
    username: string;
  }