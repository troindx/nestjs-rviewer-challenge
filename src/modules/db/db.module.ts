import { Module } from '@nestjs/common';
import { DbProviders } from './db.providers';
@Module({
  providers: [ ...DbProviders],
  exports: [...DbProviders]
})
export class DbModule {}