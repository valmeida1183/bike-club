---
name: responsiveness
description: This skill demonstrates how to implement css responsive mechanism.
---

# Responsiveness

This skill guide agent in how to deal with css responsiveness in this project.

## Pattern: Responsiveness

- Responsives is made with mixins inside the `src/styles.scss` file.
- Use the `respond-above` mixin when you want a rule that will be applied when a minimun width reaches.
- Use the `respond-below` mixin when you want a rule that will be applied when a maximun width reaches.
- Use the `respond-between` mixin when you want a rule that will be applied when a certain interval of width reaches.
- This mixins receives an breackpoint parameter that shold be a value of `$breakpoints`object variable in the `src/_variables.scss` file.

## Related Files

- `shop-item.component.scss` - Complete implementation example
