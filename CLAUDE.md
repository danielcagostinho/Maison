# Maison — coding guidelines

Conventions that apply across the monorepo. Add to this list as new ones come up.

## TypeScript

1. **Prefer `type` over `interface`.** Use `type` by default for object shapes,
   props, unions, and contract types. Reach for `interface` only when its
   specific features are genuinely needed:
   - **Declaration merging** (e.g. augmenting `Window`, third-party module
     types, or `globalThis`).
   - **Class implementation contracts** where `implements SomeShape` reads
     better than a type alias.
   - Public extensible API types where downstream consumers should be able
     to merge fields.
   If none of those apply, write `type`.
