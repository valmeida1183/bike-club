export class AuthRequestData {
    constructor(public email: string, public password: string, public returnSecureToken = true) {}
}
