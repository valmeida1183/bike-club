# Project Specifications: BikeClub

This document serves as the central source of truth for the BikeClub project's context, architecture, development guidelines, and commands.

## Project Overview

BikeClub is an e-commerce application for bikes built with a modern version of Angular (v21+), TypeScript, and SCSS. It features user authentication, a shopping section, and general content pages.

### Key Frameworks & Libraries

- **Angular:** The core framework, utilizing standalone components.
- **Angular Material:** Used for rich UI components, ensuring a consistent design.
- **Bootstrap:** Included for layout and supplementary styling.
- **NgRx Signals:** The primary pattern for reactive state management.
- **RxJS:** Used extensively for handling asynchronous operations and data streams.

### Build & Tooling

- **Angular CLI:** Essential for development tasks like generating code, serving the application, building for deployment, and running tests.
- **TSLint & Codelyzer:** Employed for code linting to maintain quality and enforce Angular-specific best practices (note: TSLint is deprecated in newer Angular versions, but still present in this project's configuration).
- **Prettier:** Ensures consistent code formatting across the project.
- **Karma & Jasmine:** Used for comprehensive unit testing.
- **Protractor:** Utilized for end-to-end testing (note: Protractor is deprecated and might be replaced in future Angular versions).

## Architecture

The application is structured following modern Angular best practices, emphasizing modularity, clear separation of concerns, and performance.

### Key Architecture Layers

1. **Core Layer (`src/app/core/`)**: Houses singleton services, guards, and interceptors that are critical and used throughout the application.

   - `auth/`: Contains the `AuthStore` (NgRx Signals for user session, token management, and persistence to `localStorage`), `AuthApiService`, authentication guards (`auth.guard`, `auto-login.guard`), and an authentication interceptor (`auth.interceptor`).
   - `errors/`: Includes a global error handling interceptor (`error-handling.interceptor`).
   - `layout/`: Provides HTTP interceptors for managing request parameters (`request-params.interceptor`) and loading states (`loading.interceptor`).

2. **Features Layer (`src/app/features/`)**: Contains distinct business functionalities, typically lazy-loaded.

   - `shopping/`: Manages the bike catalog, filtering, and the `CartStore` for user shopping carts.
   - `account/`: Handles user authentication forms (login/signup) and related child routes.
   - `club/`: Contains features related to club management or activities.
   - `home/`, `about/`: Static informational pages.

3. **Shared Layer (`src/app/shared/`)**: A repository for reusable components, directives, pipes, services, validators, and resolvers that are utilized across multiple features. Examples include `BreakpointService` and `DialogService`.

4. **Main Layer (`src/app/main/`)**: Defines the main application layout shell, including global navigation elements.

### Routing Pattern

- **Lazy-loaded Features:** Feature modules are loaded asynchronously using `loadChildren` in `app.routes.ts` to optimize initial application load time.
- **Feature-level Routes:** Routes specific to a feature are defined within dedicated route files (e.g., `features/account/account.routes.ts`).
- **Authentication Protection:** `authGuard` is implemented to protect routes that require user authentication.

### State Management

The project uses a modern approach, with NgRx Signals Store.

- **NgRx Signals (Modern Pattern)**:

  - **Auth Store (`core/auth/store/auth.store.ts`)**: Manages user session, authentication tokens, expiration times. It provides methods like `signUp()`, `signIn()`, `autoSignIn()`, `logout()`, and computed signals such as `isAuthenticated()`, `userFullName()`, `userRole()`. User data is persisted to `localStorage` under the key `bikeClubAuthUserData`.
  - **Shopping List**: Manages the list of bikes loaded from the API. It provides methods like (`loadBikes`, `loadBikesSuccess`, `loadBikesFailed`) and selectors for accessing the `shoppingList` state slice.
  - **Shop Cart**: Manages items added to the user's shopping cart.

### HTTP Interceptors Chain

All outgoing HTTP requests are processed through a specific chain of interceptors, registered in `app.config.ts` using `provideHttpClient(withInterceptors([...]))`.

1. `requestParamsInterceptor`: Handle the query parameters to requests. Its removes from HttpParams object insconsistent query parameters values as "null", "undefined" and "".
2. `authInterceptor`: Injects the `Authorization: Bearer ${token}` header for authenticated requests.
3. `loadingInterceptor`: Manages and updates the application's global loading state.
4. `errorHandlingInterceptor`: Provides centralized handling for HTTP errors.

### API Integration Pattern

- **Service Structure**: API interaction logic resides inside each feature folder in dedicated services folder (e.g., `ShopApiService` in `src/app/features/shopping/shopping-list/`).
- **Dependency Injection**: Services use the `inject()` function for dependency injection.
- **Observables**: API methods consistently return `Observable` streams for asynchronous data handling.
- **Environment Configuration**: Base API URLs and versioning are configured in `src/environments/environment.ts` and `src/environments/environment.prod.ts`.

## Component Patterns

### Smart and Dumb components

- Inside each feature folder components are categorized in Smart and Dumb components.
- Smart components resides inside containers folder (e.g., `ShoppingDetailsComponent` in `src/app/features/shopping/shopping-details/`). If folder has more than one smart componet it should have a dedicated folder with component name for it.
- Dumb components resides inside components folder and each dumb component has your own folder. (e.g., `BikeDescriptionPanelComponent` in `src/app/features/shopping/shopping-details/components/bike-description-panel`).
- Smart component usually is the main component of a feature, but it is possible that a smart component has another smart components. Smart component handles store updates and retrieve data from store, injects services and at least the main smart component is accessible bu route.
- Dumb component is the components thats receive data from Smart components by input() and sends events to the Smart component by outputs(). Your purpose is to handle presententional concers.
- Dumb components can acess stores to, but in rare cases. usually to prevent that event emiters is bubbled out from component to reach the smart component when it is you grandparent. (e.g., `ShopItemComponent` in `src/app/features/shopping/shopping-list/components/shop-item`).

### Standalone Components

- All components are defined as `standalone: true` in their `@Component()` decorator.
- Angular Material modules and other dependencies are imported directly within the component's `imports` array.
- Utilizes Angular 21's signals API (`input()`, `output()`, `signal()`) for reactive component state and data flow.

### Dependency Injection

- Preferred method for injecting dependencies is via the `inject()` function, either in the constructor or directly within methods (e.g., `private authStore = inject(AuthStore)`).

### View Children

- `viewChild()` is used to obtain references to child components or DOM elements, particularly for Material components like `MatSidenav` (e.g., `readonly drawer = viewChild<MatSidenav>('drawer')`).

## Key Models

The primary data models are located in `src/app/models/` and its subdirectories:

- `Bike`: Represents a product, including `id`, `categoryId`, `model`, `price`, `image`, etc.
- `ShopCart`: Defines the structure of a user's shopping cart.
- `User`: Contains authenticated user data.
- `Category`, `Gender`: Enums for various bike attributes.
- `AuthResponse`: The data structure for responses from authentication (login/signup) API calls, including `token`, `expiresIn`, and `user` information.

## Development Commands

- **Run Development Server:** `npm start` or `ng serve` (access at `http://localhost:4200`)
- **Build for Production:** `npm run build` or `ng build` (output to `dist/bike-club`)
- **Run Unit Tests:** `npm test` or `ng test` (executes tests via Karma/Jasmine)
- **Run End-to-End Tests:** `npm run e2e` or `ng e2e` (executes tests via Protractor)
- **Lint Code:** `npm run lint` or `ng lint` (runs TSLint checks)

## File Naming Conventions

- **Components, Services:** `kebab-case.component.ts`, `kebab-case.service.ts` (e.g., `main-nav.component.ts`, `auth.api.service.ts`).
- **Styles:** SCSS is used, with component-specific styles typically located alongside their respective `.ts` files.
- **Selectors:** Components and directives use the `bc-` prefix for elements (e.g., `<bc-main-nav>`) and `bc` prefix for attributes (e.g., `bcMyDirective`).

## Common Tasks

### Adding a New Feature Component

1. Create a dedicated folder within `features/`, including its own `.routes.ts` file.
2. Define the new component as a standalone component, importing necessary Material modules inline.
3. Integrate the feature's routes into the parent routes file using `loadChildren`.

### Adding Authentication to a Component

1. Inject `AuthStore`: `private authStore = inject(AuthStore)`.
2. Access computed signals for authentication status: `authStore.isAuthenticated()`, `authStore.userRole()`.
3. Utilize these signals directly in the template.

## Testing

- **Unit Tests:** Located in `*.spec.ts` files, mirroring the component structure. Executed via Karma with Jasmine syntax (`describe`, `it`, `expect`).
- **End-to-End Tests:** Defined in the `e2e/` directory and run via Protractor.

## Environment Configuration

- **Development:** `src/environments/environment.ts`
- **Production:** `src/environments/environment.prod.ts`
- These files contain configuration variables such as `baseApiUrl`, `apiUrl`, and `apiVersion` for backend endpoints.
