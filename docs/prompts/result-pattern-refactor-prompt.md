<task>I want research the best approach to connect this SPA with a Vertical slice architeture REST Api.</task>

<role>As a Senior Frontend developer you are responsible to create a plan to analyze this project and think the best way make a refactor.</role>

<requirements>
  ### Business

- Research a way to handle the changes made in the REST that this SPA Angular application make requests.
- Mantain the actual business logic without break it.
- The main focus is to create a plan, not the implementation.
- The api routes should be preserved used in "api" services.
- The api objects returns is that was changed on the Api side.

### Technical

- Find an elegant solution to handle the objects that the api are returning now.
- All the success returning objects are wrapped inside a Result pattern object.
- Consider the possibility to create an interceptor to extract the data from "value" property.
- We already has in this project a Result<T> typescript class that represents the onject that is returned by the backend api.
- At this point this Angular app has one place that is handling manually the Result object at the AuthApiService and AuthStore.
- We should handle the possible Error object that can be inside the Result pattern, we should handle it in the errorHandlingInterceptor that is made for this purpose.
- Check the <backend-examples> the understand better how result pattern ins implemented in the backend.
- We need to handle the Result object variant called "ValidationResult" used when a payload validation fails in the backend, this should be handled at errorHandlingInterceptor too.
  </requirements>

<backend-examples>

```csharp
public class Result
{
    protected Result(bool isSuccess, Error error)
    {
        if (isSuccess && error != Error.None)
        {
            throw new InvalidOperationException("Cannot create successful result with an error");
        }

        if (!isSuccess && error == Error.None)
        {
            throw new InvalidOperationException("Cannot create failed result without an error");
        }

        IsSuccess = isSuccess;
        Error = error;
    }

    public bool IsSuccess { get; }

    public bool IsFailure => !IsSuccess;

    public Error Error { get; }

    public static Result Success() => new(true, Error.None);

    public static Result Failure(Error error) => new(false, error);

    public static Result<TValue> Success<TValue>(TValue value) =>
        new(value, true, Error.None);

    public static Result<TValue> Failure<TValue>(Error error) =>
        new(default, false, error);

    public static Result Create(bool condition, Error error) =>
        condition ? Success() : Failure(error);

    public static Result<TValue> Create<TValue>(TValue? value, Error error) =>
        value is not null ? Success(value) : Failure<TValue>(error);
}

public class Result<TValue> : Result
{
    private readonly TValue? _value;

    protected internal Result(TValue? value, bool isSuccess, Error error)
        : base(isSuccess, error)
    {
        _value = value;
    }

    public TValue? Value => IsSuccess ? _value : default;

    public static implicit operator Result<TValue>(TValue? value) =>
        value is not null ? Success(value) : Failure<TValue>(Error.NullValue);

    public static implicit operator Result<TValue>(Error error) =>
        Failure<TValue>(error);
}
```

```csharp
public interface IValidationResult
{
    public static readonly Error ValidationError = new(
        "Validation.Error",
        "One or more validation errors occurred",
        ErrorType.Validation);

    Error[] Errors { get; }
}

public sealed class ValidationResult : Result, IValidationResult
{
    private ValidationResult(Error[] errors)
        : base(false, IValidationResult.ValidationError)
    {
        Errors = errors;
    }

    public Error[] Errors { get; }

    public static ValidationResult WithErrors(Error[] errors) => new(errors);
}

public sealed class ValidationResult<TValue> : Result<TValue>, IValidationResult
{
    private ValidationResult(Error[] errors)
        : base(default, false, IValidationResult.ValidationError)
    {
        Errors = errors;
    }

    public Error[] Errors { get; }

    public static ValidationResult<TValue> WithErrors(Error[] errors) => new(errors);
}
```

```csharp
public enum ErrorType
{
    Failure,
    Validation,
    NotFound,
    Conflict,
    Unauthorized,
    Forbidden
}

public record Error(string Code, string Description, ErrorType Type = ErrorType.Failure)
{
    public static readonly Error None = new(string.Empty, string.Empty);

    public static readonly Error NullValue = new("Error.NullValue", "A null value was provided");

    public static Error FromException(Exception exception) =>
        new("Error.Exception", exception.Message);

    public static implicit operator string(Error error) => error.Code;

    public override string ToString() => Code;
}
```

</backend-examples>

<api-return-example>

### Example of the return of endpoint "GET" for /v1/roles

#### Before

```json
[
    {
        "name": "Cyclist",
        "description": "Cyclist is the common user"
    },
    {
        "name": "Monitor",
        "description": "Monitor, responsible for managing the tours"
    }
],
```

#### Now

```json
{
	"value": [
		{
			"name": "Cyclist",
			"description": "Cyclist is the common user"
		},
		{
			"name": "Monitor",
			"description": "Monitor, responsible for managing the tours"
		}
	],
	"isSuccess": true,
	"isFailure": false,
	"error": {
		"code": "",
		"description": "",
		"type": 0
	}
}
```

#### Validation result error:

```json
{
	"errors": [
		{
			"code": "Name",
			"description": "Name field is required",
			"type": 1
		}
	],
	"value": null,
	"isSuccess": false,
	"isFailure": true,
	"error": {
		"code": "Validation.Error",
		"description": "One or more validation errors occurred",
		"type": 1
	}
}
```

</api-return-example>

<critical>

    ### Ask if needed
    USE ASK USER QUESTION TOOL if somenthing is not clear or any information missing is detected.

</critical>

<references>

### References of util files:

- ./src/app/core/api/models/result.ts
- ./src/app/core/auth/services/auth.api.service.ts
- ./src/app/core/auth/store/auth.store.ts

### References about Result pattern

- https://www.milanjovanovic.tech/blog/functional-error-handling-in-dotnet-with-the-result-pattern
  <references>
