import { Address } from './address.model';

export class User {
    constructor(public userId: string,
                public name: string,
                public lastName: string,
                public email: string,
                public password: string,
                public gender: string,
                public phone: string,
                public userType: string) { }

    get address() {
        return this.address;
    }

    set address(value: Address) {
        this.address = value;
    }

    /* get currentToken() {
        if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
            return null;
        }

        return this.token;
    }

    set currentToken(value: string) {
        this.token = value;
    }

    set currentTokenExpirationDate(value: Date) {
        this.tokenExpirationDate = value;
    } */
}
