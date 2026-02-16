import { Role } from '../../../models/auth/role.model';

export class User {
	constructor(
		public id: number,
		public name: string,
		public lastName: string,
		public email: string,
		public password: string,
		public genderCode: string,
		public phone: string,
		public roleName?: Role,
	) {}
}
