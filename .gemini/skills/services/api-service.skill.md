---
name: api-service
description: This skill demonstrates how to implement an Api services that comunicates with backed REST Api server.
---

# Api Server

This skill guide agent in how to create an api service that comunicates with backend REST Api in this project.

## Pattern: Api Server

- Always use the following pattern to name the service file (e.g `foo.api.service.ts`).
- Always uses `HttpClient` injected via `inject()` into a private property with named as`http` to build the serice.
- If is an Api service inside a `src/app/features/` folder, always use `@Injectable()` without three shakable provider.
- Ask the user about the base route that this service will reach in the REST Api.
- Create a private property with base route that user gives to you and concatenates with suffix `EndpointUrl` (e.g. `foosEndpointUrl`. for base route `foos`) and sets the value with the baseApiUrl of environment (e.g `${environment.baseApiUrl}/foos`).
- Every method in this service should return an Observable<T>, never subscribe the observable returned by HttpClient.

## Related Files

- `shopping-list.api.service.ts` - Complete implementation example
