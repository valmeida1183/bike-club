import { User } from '../../auth/models/user.model';

export interface AuthState {
	user: User | null;
	token: string | null;
	expiresIn: Date | null;
	logoutTimerId: any;
}
