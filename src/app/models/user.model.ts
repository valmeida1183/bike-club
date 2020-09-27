import { Address } from './address.model';
import { Role } from './auth/role.model';

export class User {
    constructor(public id: number,
                public name: string,
                public lastName: string,
                public email: string,
                public password: string,
                public genderCode: string,
                public phone: string,
                public roleName: Role) { }

    get address() {
        return this.address;
    }

    set address(value: Address) {
        this.address = value;
    }
}
