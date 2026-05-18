import { Injectable } from '@nestjs/common';
import { AuthAbstract } from './mongoose/abstract/auth.abstract';
import { UserAbstractDao } from './mongoose/abstract/user.abstract';
;
@Injectable()
export class DatabaseService {
	constructor(
		public authMongoTxn: AuthAbstract,
		public userMongoTxn: UserAbstractDao
	) {}
}
