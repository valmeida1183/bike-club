# BikeClub - AI Copilot Instructions

## Architecture Overview

**BikeClub** is an Angular 21+ e-commerce application for bikes built with standalone components, routing, and state management using NgRx Signals.

### Key Architecture Layers

1. **Core Layer** (`src/app/core/`) - Singleton services, guards, interceptors

   - `auth/` - Authentication store (NgRx Signals), API service, guards, interceptors
   - `errors/` - Global error handling interceptor
   - `cart/` - Shopping cart state management
   - `layout/` - HTTP interceptors for request params, loading state

2. **Features Layer** (`src/app/features/`) - Feature modules with standalone components

   - `shopping/` - Bike catalog with filters, services, NgRx actions/effects/reducers
   - `account/` - Auth forms (login/signup) with child routes
   - `club/` - Club-related features
   - `home/`, `about/` - Static pages

3. **Shared Layer** (`src/app/shared/`) - Reusable components, services, validators, resolvers

4. **Main Layer** (`src/app/main/`) - Layout shell with navigation (`main-nav`)

5. **Store Layer** (`src/app/store/`) - Root-level NgRx state
   - `shoppingList` reducer - Bikes data from API
   - `shopCart` reducer - User's shopping cart items

### Routing Pattern

- **Lazy-loaded features** via `loadChildren` in `app.routes.ts`
- Routes defined in feature-level route files (e.g., `features/account/account.routes.ts`)
- Auth guard (`authGuard`) protects authenticated routes

## State Management

### NgRx Signals (Modern Pattern)

- **Auth Store** (`core/auth/store/auth.store.ts`) - User session, token, expiration
  - Methods: `signUp()`, `signIn()`, `autoSignIn()`, `logout()`
  - Computeds: `isAuthenticated()`, `userFullName()`, `userRole()`
  - Persists to `localStorage` under key `bikeClubAuthUserData`

### Classic NgRx (Store)

- **Shopping List** - Bikes list loaded from API
  - Actions: `loadBikes`, `loadBikesSuccess`, `loadBikesFailed`
  - Selector selects from `shoppingList` state slice
- **Shop Cart** - Items user adds to cart

## HTTP Interceptors Chain

All requests flow through in order:

1. `requestParamsInterceptor` - Adds query parameters
2. `authInterceptor` - Injects `Authorization: Bearer ${token}` if authenticated
3. `loadingInterceptor` - Manages loading state
4. `errorHandlingInterceptor` - Global error handling

**Location**: Registered in `app.config.ts` with `provideHttpClient(withInterceptors([...]))`

## API Integration Pattern

### Service Structure

```typescript
// Example: src/app/features/shopping/services/shop.api.service.ts
@Injectable()
export class ShopApiService {
	private http = inject(HttpClient);
	private bikesEndpointUrl = `${environment.baseApiUrl}/bikes`;

	getBikes(filter: any): Observable<Bike[]> {
		return this.http.get<Bike[]>(this.bikesEndpointUrl, { params: filter });
	}
}
```

- Services use dependency injection with `inject()`
- Methods return `Observable` (not promises)
- API base URLs from `environment` files

## Component Patterns

### Standalone Components

- All components are **standalone: true** in `@Component()`
- Import Material modules inline in `imports` array
- Use Angular 21 signals API with `input()`, `output()`, `signal()`

### Dependency Injection

- Constructor injection via `inject()`: `private authStore = inject(AuthStore)`
- Inject directly in methods: `const http = inject(HttpClient)`

### View Children

- Use `viewChild()` for Material components like sidenavs: `readonly drawer = viewChild<MatSidenav>('drawer')`

## Key Models

All in `src/app/models/`:

- `Bike` - Product model with `id`, `categoryId`, `model`, `price`, `image`, etc.
- `ShopCart` - User's cart
- `User` - Auth user data
- `Category`, `Gender` - Enums for bike attributes
- `AuthResponse` - Login/signup response with `token`, `expiresIn`, `user`

## Development Commands

```bash
npm start              # ng serve - dev server on http://localhost:4200
npm test              # ng test - Jasmine/Karma unit tests
npm run build         # ng build - compile to dist/bike-club
npm run lint          # tslint checks
npm run e2e           # Protractor end-to-end tests
```

## File Naming Conventions

- Components: `kebab-case.component.ts` (e.g., `main-nav.component.ts`)
- Services: `kebab-case.service.ts` (e.g., `auth.api.service.ts`)
- Styles: `.scss` preprocessor (component styles alongside .ts)
- Selectors: `bc-*` prefix (e.g., `<bc-main-nav>`)

## Common Tasks

### Adding a New Feature Component

1. Create folder in `features/` with `.routes.ts`
2. Use standalone component with Material imports in `imports`
3. Add feature route to parent routes file using `loadChildren`

### Connecting to Shopping List Store

1. Dispatch `loadBikes` action with query params
2. Subscribe to `store.select(state => state.shoppingList.bikes)`
3. Handle `loadBikesSuccess` and `loadBikesFailed` cases

### Adding Auth to Component

1. Inject `AuthStore`: `private authStore = inject(AuthStore)`
2. Access computed signals: `authStore.isAuthenticated()`, `authStore.userRole()`
3. Use in template with `| async` pipe or as signals directly

## Testing

- Unit tests: `*.spec.ts` files run via Karma
- Test structure mirrors component structure
- Use Jasmine syntax with `describe`, `it`, `expect`

## Environment Configuration

- Dev: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`
- Contains: `baseApiUrl`, `apiUrl`, `apiVersion` for backend endpoints

## Current Active Branch

Branch `folder-refactoring` - Ongoing structural improvements to codebase organization.
