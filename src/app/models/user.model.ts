import { Address } from './address.model';
import { Role } from './auth/role.model';

export class User {
    constructor(public userId: string,
                public name: string,
                public lastName: string,
                public email: string,
                public password: string,
                public gender: string,
                public phone: string,
                public role: Role) { }

    get address() {
        return this.address;
    }

    set address(value: Address) {
        this.address = value;
    }
}
