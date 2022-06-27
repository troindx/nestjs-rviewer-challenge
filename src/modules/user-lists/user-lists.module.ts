import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { UserListsController } from './user-lists.controller';
import { UserListsService } from './user-lists.service';

@Module({
  imports: [DbModule, AuthModule],
  controllers: [UserListsController],
  providers: [UserListsService],
  exports: [UserListsService]
})
export class UserListsModule {}