export class AuthUserData {
    constructor(public email: string,
                public id: string,
                public userType: string,
                private token: string,
                private tokenExpirationDate: Date) { }

    get currentToken() {
        if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
            return null;
        }

        return this.token;
    }
}
