import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OngsModule } from './ongs/ongs.module';
import { NeedsModule } from './needs/needs.module';
import { DonationsModule } from './donations/donations.module';
import { User } from './users/entities/user.entity';
import { Ong } from './ongs/entities/ong.entity';
import { Need } from './needs/entities/need.entity';
import { Donation } from './donations/entities/donation.entity';
import { Message } from './donations/entities/message.entity';
import { CollectionPointsModule } from './collection-points/collection-points.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CollectionPoint } from './collection-points/entities/collection-point.entity';
 
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,
    envFilePath: '.env',}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASS', '2504'),
        database: config.get('DB_NAME', 'ong_app'),
        entities: [User, Ong, Need, Donation, Message, CollectionPoint],
        synchronize: true,
        // Habilita extensão PostGIS ao conectar
        extra: {
          options: '-c search_path=public',
        },
      }),
    }),
    AuthModule,
    UsersModule,
    OngsModule,
    NeedsModule,
    DonationsModule,
    CollectionPointsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
