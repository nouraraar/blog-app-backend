import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule } from '@nestjs/config';
require('dotenv').config();


@Module({
  
  imports: [
    ConfigModule.forRoot({
    isGlobal: true, // no need to import into other modules
      }),
    AuthModule, UserModule, ArticleModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password:'',
      database: process.env.DATABASE_NAME,
      entities: ["dist/**/*.entity{ .ts,.js}"],
      synchronize: true,
      migrationsTableName: "custom_migration_table",
      migrations: ["migration/*.js"],
      cli: {"migrationsDir": "migration"}}), CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
