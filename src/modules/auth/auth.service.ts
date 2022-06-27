import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { UsersService } from '../users/users.service';
import { User } from 'src/models/user.model';
import * as md5 from 'md5';

@Injectable()
export class AuthService {
    constructor(private usersService:UsersService){
        try {
        } catch (error) {
            console.log(error);
        }
    }

    close(){
        this.usersService.close();
    }

    async validateCredentials(userId:string, name:string, password:string): Promise<User>{
        let user:User = await this.usersService.get(userId);
        if (!user) 
            return null;
        if (user.name == name && user.password == md5(password))
            return user
        else  
            return null;
    }

    async validateLogin(name:string, password:string) : Promise<User>{
        let user:User = await this.usersService.getFromUserName(name);
        if (!user) 
            return null;
        
        //I wouldn't use md5 in production, but since it's not within the scope of the exercise.
        if (user.password == md5(password))
            return user
        else  
            return null;
    }

}
