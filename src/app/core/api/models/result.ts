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
