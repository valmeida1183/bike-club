import {
	AbstractControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';

/**
 * Custom validator to check if two fields match.
 * @param controlName The name of the control to validate.
 * @param matchingControlName The name of the control to match against.
 * @returns A ValidatorFn that returns an error map or null.
 */
export function matchValueValidator(
	controlName: string,
	matchingControlName: string,
): ValidatorFn {
	return (formGroup: FormGroup): ValidationErrors | null => {
		const control = formGroup.get(controlName);
		const matchingControl = formGroup.get(matchingControlName);

		if (controlsNotFound(control, matchingControl)) {
			return null;
		}

		if (hasAnotherErrorInMatchControl(matchingControl)) {
			return null;
		}

		if (control.value !== matchingControl.value) {
			matchingControl.setErrors({ mustMatch: true });
			return { mustMatch: true };
		} else {
			matchingControl.setErrors(null);
			return null;
		}
	};
}

function controlsNotFound(
	control: AbstractControl,
	matchingControl: AbstractControl,
) {
	return !control || !matchingControl;
}

function hasAnotherErrorInMatchControl(matchingControl: AbstractControl) {
	return matchingControl.errors && !matchingControl.getError('mustMatch');
}
