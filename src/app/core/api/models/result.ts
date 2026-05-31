import { Error } from '../../errors/models/error';

export class Result<T> {
	value?: T;
	isSuccess: boolean;
	isFailure: boolean;
	error: Error;

	constructor(isSuccess: boolean, error: Error, value?: T) {
		this.value = value;
		this.isSuccess = isSuccess;
		this.isFailure = !isSuccess;
		this.error = error;
	}
}

export class ValidationResult<T> extends Result<T> {
	errors: Error[];

	constructor(errors: Error[], error: Error) {
		super(false, error);
		this.errors = errors;
	}
}
