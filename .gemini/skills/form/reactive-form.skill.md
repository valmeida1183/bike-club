---
name: reactive-form
description: This skill demonstrates how to implement reactive forms in Angular using `FormBuilder`, validation patterns, and component communication through Angular's
---

# Reactive Form

This skill guide agent in how to use reactive forms in this project.

## Pattern: Reactive Form

- Always uses `FormBuilder` injected via `inject()` to build the forms.
- Always use Typed forms of Angular Reactive forms

### Implementation Steps

1. **Define the Form Model**

- Asks user to point where is the model of this typed reactive form. (e.g., `ShopFilterForm`)
- Ensure that the model is correctly typed like `src/app/features/shopping/shopping-list/models/shop-filter-form.ts`. Using typescript type and is a derivative of FormGroup.
- Create a private function called configureForm() to handle te form creation logic
- Call the configureForm() function inside ngOnInit angular event.
- Use `fb.group()` with typed controls
- Create a typescript getter for each formControl inside the form. (e.g, `src/app/features/shopping/shopping-list/components/shop-filter/shop-filter.component.ts`)

## Related Files

- `shop-filter.component.ts` - Complete implementation example
- `shop-filter.component.html` - Template binding example
- `bike-search-filter` - Output model type
- `shop-filter-form` - Form type file.
