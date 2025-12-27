import { User } from '../../core/auth/models/user.model';

export interface IAuthWebResponseData {
	user: User;
	token: string;
	expiresIn: Date;
}
