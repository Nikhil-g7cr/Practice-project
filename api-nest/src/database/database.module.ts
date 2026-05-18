import { Module } from '@nestjs/common';
import { mongooseProvider } from './mongoose/connection/connection.mongodb';
import { MongoDbModelsProvider } from './mongoose/connection/models.connection';
import { AuthAbstract } from './mongoose/abstract/auth.abstract';
import { AuthMongoDao } from './mongoose/dao/auth.dao';
import { UserAbstractDao } from './mongoose/abstract/user.abstract';
import { UserDao } from './mongoose/dao/users.dao';
import { DatabaseService } from './database.service';


@Module({
  providers: [
    ...mongooseProvider,
    ...MongoDbModelsProvider,
    DatabaseService,
    {
      provide: AuthAbstract,
      useClass: AuthMongoDao,
    },
    {
      provide: UserAbstractDao,
      useClass: UserDao,
    },
  ],
  exports: [
    DatabaseService,
    ...MongoDbModelsProvider,
    {
      provide: AuthAbstract,
      useClass: AuthMongoDao,
    },
    {
      provide: UserAbstractDao,
      useClass: UserDao,
    },
  ],
})
export class DatabaseModule {}
