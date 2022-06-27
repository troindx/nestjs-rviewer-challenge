import { BasicStrategy as Strategy }  from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/models/user.model';
import { Request } from 'express';

@Injectable()
export class HTTPStrategy extends PassportStrategy(Strategy, "spotlist") {
  constructor(private readonly authService: AuthService) {
    super({ passReqToCallback: true });
  }

  async validate( req:Request , username: string, password: string): Promise<User> {
    if (typeof req.params.userid === undefined){
      throw new NotFoundException("You need a userid")
    }
    const user = await this.authService.validateCredentials(req.params.userid, username, password);
    if (!user) {
      throw new UnauthorizedException("User not found with this id (or user is not the one authenticated)");
    }
    return user;
  }
}