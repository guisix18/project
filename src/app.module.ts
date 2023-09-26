import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TaskModule } from './tasks/task.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
    PrismaModule,
    UserModule,
    TaskModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
