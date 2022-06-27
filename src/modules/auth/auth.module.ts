import {  Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { HTTPStrategy } from './http.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, HTTPStrategy],
  exports: [AuthService, HTTPStrategy]
})
export class AuthModule {}