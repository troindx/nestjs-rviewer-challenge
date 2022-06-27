import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserListsModule } from './modules/user-lists/user-lists.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, UserListsModule, AuthModule],
})
export class AppModule {}
