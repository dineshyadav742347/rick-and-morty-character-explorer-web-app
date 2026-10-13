# Rick & Morty Character Explorer Web Application

Rick & Morty Character Explorer Web Application built with **Angular 16** and **Bootstrap 5**

---

## 💡 Rationale for Solution & Technical Decisions

Per the assignment requirement to **provide rationale for your solution and decisions**, the comprehensive architectural choices are detailed below:

1. **Angular Signals (`AuthService` & Component State)**:
   * **Rationale**: Used for fine-grained, reactive state management across services and components (`signal()`), pairing natively with `OnPush` change detection to automatically update the UI without manual `ChangeDetectorRef` boilerplate.

2. **Preserved Selection State across Navigation**:
   * **Rationale**: Maintained `selectedCharacterId` in `CharacterService` so the last selected character remains visually highlighted when navigating between the list and detail views.

3. **Standalone Components & Routing**:
   * **Rationale**: Built without traditional `NgModule` files to reduce boilerplate, streamline file structure, and leverage modern Angular best practices.

4. **Route-Level Lazy Loading (`loadComponent`)**:
   * **Rationale**: The heavy `CharacterDetailComponent` is lazy-loaded via dynamic imports to minimize the initial main bundle size and ensure faster page load performance.

5. **Automatic Memory Leak Prevention (`takeUntilDestroyed`)**:
   * **Rationale**: Utilizes `takeUntilDestroyed()` with `DestroyRef` across all subscriptions (HTTP calls, route query params) to automatically unsubscribe when components unmount, preventing memory leaks cleanly.

6. **Centralized Constants & i18n Readiness (`app.constants.ts`)**:
   * **Rationale**: All hardcoded strings, UI labels, messages, and roles are extracted into a centralized constants file, adhering to the DRY principle and preparing the app for internationalization.

7. **Multi-Environment Configurations (`dev`, `qa`, `prod`)**:
   * **Rationale**: Configured distinct environment files with automated file replacement rules in `angular.json` to mirror real-world deployment pipelines.

8. **Reusable Components**:
   * **Rationale**: Extracted pagination logic into a standalone, reusable `PaginationComponent` to maintain separation of concerns and keep container components lean.

9. **Visual Loader & Asynchronous Feedback**:
   * **Rationale**: Integrated responsive loading spinners (`spinner-border`) and loading flags across list and detail views to provide immediate visual feedback during HTTP data fetching.

10. **Centralized Error Logger Interceptor (`error.interceptor.ts`)**:
    * **Rationale**: Implemented a functional HTTP interceptor (`HttpInterceptorFn`) that globally intercepts, handles, and logs communication errors, avoiding scattered error-handling code.

11. **Meaningful Domain-Driven Service Layer (`CharacterService` & `AuthService`)**:
    * **Rationale**: Services are cleanly separated and named after their core business domain (`CharacterService` encapsulates all entity data fetching and REST operations, while `AuthService` manages role-based permissions).

12. **DOM Diffing Optimization (`trackBy`)**:
    * **Rationale**: Implemented custom `trackBy` functions in `*ngFor` loops to optimize DOM element reuse during pagination and search filtering.
    
13. **Strict Immutability & Encapsulation (`readonly`)**:
    * **Rationale**: Utilized `readonly` and `protected readonly` access modifiers on service dependencies and configuration constants to enforce strict immutability.

---

## 🚀 How to Run and Build the Application

### Prerequisites
* Node.js (v16+ or v18+)
* Angular CLI (`npm install -g @angular/cli@16`)

### Installation & Local Development
1. Extract the project archive.
2. Open your terminal in the root directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm start
   ```
5. Open your browser at **`http://localhost:4200`**.

### Build Commands for Environments
* **Development Build**: `ng build`
* **QA Build**: `npm run build:qa`
* **Production Build**: `npm run build:prod`