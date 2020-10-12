import { User } from '../user.model';

export class AuthWebUserData {
    constructor(public user: User, public expiresIn: Date, private token: string){}

    currentToken() {
        if (!this.expiresIn || new Date() > this.expiresIn) {
            return null;
        }

        return this.token;
    }
}
