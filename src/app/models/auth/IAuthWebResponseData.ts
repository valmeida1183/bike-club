import { User } from '../user.model';

export interface IAuthWebResponseData {
    user: User;
    token: string;
    expiresIn: Date;
}
