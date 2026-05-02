import { ErrorTypeEnum } from '../enums/error-type';

export class Error {
	code: string;
	description: string;
	type: ErrorTypeEnum;

	constructor(code: string, description: string, type: ErrorTypeEnum) {
		this.code = code;
		this.description = description;
		this.type = type;
	}
}
