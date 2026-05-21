# Maison — coding guidelines

Conventions for this monorepo. Adapted from
[bulletproof-react](https://github.com/alan2207/bulletproof-react) for our
stack: **Next.js 15 (App Router) + Expo + tRPC + Prisma + Clerk**, pnpm + Turbo.

---

## TypeScript

1. **Prefer `type` over `interface`** for object shapes, props, and contract
   types. Reach for `interface` only when its specific features are
   genuinely needed:
   - Declaration merging (augmenting `Window`, third-party module types,
     `globalThis`).
   - Class implementation contracts where `implements Shape` reads better.
   - Public extensible API types where downstream consumers should be able
     to merge fields.

2. **Don't import React unless you need the namespace.** With the JSX
   transform, `import React from 'react'` is dead weight. Import the bits
   you need: `import { useState, useEffect } from 'react'`.

3. **Don't use `React.ReactNode`, `React.HTMLAttributes`, etc.** Import the
   type directly: `import type { ReactNode } from 'react'`.

4. **`type` imports are explicit.** `import type { Foo }` for types,
   `import { foo }` for values. Mixed imports are fine but mark types:
   `import { foo, type Foo } from 'mod'`.

---

## Project structure

```
maison/
├── apps/
│   ├── web/                       # Next.js 15 (App Router)
│   │   └── src/
│   │       ├── app/               # Routes, layouts, route handlers
│   │       ├── components/        # Shared app-level components
│   │       ├── features/          # Feature modules (see below)
│   │       ├── hooks/             # Shared hooks
│   │       ├── lib/               # Pre-configured libs (trpc client, etc.)
│   │       ├── trpc/              # tRPC client + provider
│   │       ├── server/            # Server-only utilities (tRPC handler, ...)
│   │       ├── fonts/             # next/font/local sources
│   │       └── middleware.ts      # Clerk route protection
│   └── mobile/                    # Expo + React Native (forthcoming)
├── packages/
│   ├── api/                       # tRPC routers — shared by web + mobile
│   ├── db/                        # Prisma schema, migrations, client
│   └── shared/                    # Cross-platform Zod schemas + pure logic
├── legacy/                        # Reference only — original codebase
└── CLAUDE.md
```

### Import rules

Data flows in one direction: `packages` → app shared modules → `features` → `app/`.

- **Features cannot import from other features.** This is the most
  important rule. Cross-feature dependencies are a smell — promote shared
  pieces up to `components/`, `hooks/`, or a workspace package.
- Features import only from shared modules and workspace packages.
- Use the `@/` alias (maps to `src/`). Never deep relative imports
  (`../../../`).

---

## Feature architecture

Each feature is a self-contained module under
`apps/{web,mobile}/src/features/{name}/`:

```
src/features/household/
├── api/                  # Client-side tRPC hooks + query option builders
├── components/           # Feature-specific components
├── hooks/                # Feature-specific hooks
└── types/                # Feature-specific types
```

**Maison-specific note:** the *server-side* API logic lives in
`packages/api/src/routers/`. The `features/*/api/` folder on the client
holds React-Query / tRPC hook wrappers, not server handlers.

---

## Naming conventions

### Files and folders

- **All files and folders are `kebab-case`.** Including component files:
  `create-household-dialog.tsx`, not `CreateHouseholdDialog.tsx`.
- Exception: Next.js / Expo router convention files keep their names
  (`page.tsx`, `layout.tsx`, `error.tsx`, `route.ts`).
- Exception: `__tests__/` folder for colocated tests.

### Code

| Type                  | Convention                | Example                       |
| --------------------- | ------------------------- | ----------------------------- |
| React components      | `PascalCase`              | `HouseholdCard`, `BillRow`    |
| Hooks                 | `use` prefix, `camelCase` | `useDisclosure`, `useBills`   |
| Types / type aliases  | `PascalCase`              | `Household`, `CreateBillInput`|
| Constants             | `UPPER_SNAKE_CASE`        | `MAX_HOUSEHOLD_MEMBERS`       |
| Functions / variables | `camelCase`               | `formatMoney`, `householdId`  |
| Boolean variables     | `is` / `has` / `should` prefix | `isOpen`, `hasUnpaid`     |

### Import order

1. React / Next.js / Expo built-ins
2. External packages
3. Workspace packages (`@maison/api`, `@maison/db`, `@maison/shared`)
4. Internal app modules (`@/lib`, `@/components`, `@/hooks`, `@/utils`)
5. Feature-local imports (`./`, `../`)

---

## Components and styling

### Tailwind

- **Never use margin or padding to space siblings.** Spacing between
  siblings is *exclusively* the parent's job, via `gap-*` on a flex or
  grid container. If different groups of siblings need different
  spacing, **nest them in their own flex container** with its own gap —
  don't reach for `mt-*` / `mb-*` / `ml-*` / `mr-*` on individual
  children. Padding belongs to a box's *internal chrome* (the gap
  between the box's edge and its own content), not as spacing between
  separate elements.

  ```tsx
  // ❌ Bad — margin doing flex spacing
  <div>
    <h2>Title</h2>
    <p className="mt-2">Description</p>
    <p className="mt-8">A different group, far below</p>
  </div>

  // ❌ Also bad — padding doing flex spacing
  <div>
    <h2>Title</h2>
    <p className="pt-2">Description</p>
  </div>

  // ✅ Good — single flex column, single gap
  <div className="flex flex-col gap-2">
    <h2>Title</h2>
    <p>Description</p>
  </div>

  // ✅ Good — nested containers when groups need different spacing
  <div className="flex flex-col gap-8">
    <div className="flex flex-col gap-2">
      <h2>Title</h2>
      <p>Description</p>
    </div>
    <p>A different group, far below</p>
  </div>
  ```

- **Use design tokens from `globals.css` `@theme`**, never hardcoded
  values. `bg-primary`, not `bg-[#4900a7]`. The same tokens get mirrored
  into NativeWind for the mobile app — keep them flat (hex / rgba), never
  CSS-only color functions.

- **Class merging:** use `cn()` from `@/lib/cn` (which wraps `clsx` +
  `tailwind-merge`). Don't string-concatenate Tailwind classes by hand.

### Component guidelines

- **Default to Server Components** in Next.js App Router. Add
  `'use client'` only when interactivity (state, effects, refs, browser
  APIs) demands it. Push the client boundary to the smallest leaf.
- **Prefer composition over configuration:**

  ```tsx
  // ✅ Composition
  <Dialog>
    <Dialog.Header>Title</Dialog.Header>
    <Dialog.Body>Content</Dialog.Body>
  </Dialog>

  // ❌ Configuration
  <Dialog title="Title" content={<Content />} footer={<Footer />} />
  ```

- **Avoid nested render functions.** Extract them into separate
  components.
- **Limit props.** If a component has many, use composition via `children`
  or slot props.
- **Colocate** styles, state, and small utilities next to the component
  using them.

### Comments

- **No obvious comments.** Don't restate what well-named code already
  says (`{/* Sidebar */}` above `<Sidebar />` is noise).
- **No phase/TODO comments in shipped code.** Placeholder UI text is fine
  ("Coming soon"); placeholder *comments* like `{/* added in Phase 2 */}`
  are not.
- Comment **why**, not what — and only when the why isn't obvious.

---

## API layer (tRPC)

All data flows through `packages/api` tRPC routers. Web and mobile share
the same `AppRouter` type for full end-to-end type safety.

### Three-part pattern

Every operation has three layers:

1. **Zod schema** in `@maison/shared/schemas` — defines the input
   contract.
2. **Procedure** in `@maison/api/src/routers/{feature}.ts` — validates,
   authorizes, performs the query.
3. **Client hook** via `trpc.{feature}.{procedure}.useQuery()` /
   `useMutation()` — consumed in components.

### Procedure conventions

- `publicProcedure` — no auth required (rare; e.g. health checks).
- `protectedProcedure` — Clerk-authenticated; resolves `ctx.user` from the
  database (upsert against the profile snapshot supplied by the caller).
- `householdProcedure` — extends `protectedProcedure`; requires
  `householdId` input and verifies the user is a member.

### Mutation invalidation

After a successful mutation, invalidate the affected queries via
`trpc.useUtils()`:

```ts
const utils = trpc.useUtils();
const createBill = trpc.bill.create.useMutation({
  onSuccess: () => {
    utils.bill.list.invalidate({ householdId });
    utils.settlement.forHousehold.invalidate({ householdId });
  },
});
```

---

## State management

| Category             | Tool                            | When                          |
| -------------------- | ------------------------------- | ----------------------------- |
| Server cache         | tRPC + React Query              | Any data from the API         |
| Component state      | `useState`, `useReducer`        | Local UI state                |
| Form state           | React Hook Form (when added)    | Form inputs & validation      |
| URL state            | `useSearchParams`, `useParams`  | Filters, active tab, paging   |
| Global app state     | Zustand (when needed)           | Theme, modal manager, toasts  |

### Rules

- **Server state is not app state.** Never duplicate tRPC data into
  Zustand or another store. Read from tRPC.
- **Keep state as close to where it's used as possible.** Lift only when
  necessary.
- **URL is state.** Persist filter/sort/active-view in query params where
  it makes sense.

---

## Forms and validation

When forms land in the app, use **React Hook Form + Zod**.

- Define the Zod schema once in `@maison/shared/schemas` and reuse in the
  form, the tRPC procedure input, and anywhere else.
- Validate at system boundaries (user input, external APIs). Trust
  internal code.
- Wire schema to form via `zodResolver(schema)`.

---

## Error handling

- Use **route-level `error.tsx`** in the App Router for scoped error
  boundaries — multiple, not one global. Each feature route can have its
  own.
- For mutation-specific failures, handle in React Query's `onError` (or
  inline using `mutation.error`).
- Inline errors live near the input that caused them. Use a toast for
  global / unscoped errors.

---

## Authentication and authorization

### Authentication

- **Clerk** handles identity (sign-in, sessions, profile).
- Server-side (web): `auth()` and `currentUser()` from
  `@clerk/nextjs/server`. The tRPC context creator pulls the verified
  Clerk user id + a profile snapshot and passes it into `AuthContext`.
- The `@maison/api` package itself stays Clerk-agnostic — it accepts an
  identity from any caller.

### Authorization

- **Route-level:** Clerk middleware (`apps/web/src/middleware.ts`) gates
  protected route trees.
- **API-level:** `protectedProcedure` / `householdProcedure` enforce auth
  + membership before any logic runs.
- **UI-level** authorization (showing/hiding controls based on role) is a
  presentation concern only — *never* the sole check. The server must
  always enforce.

---

## Money and time

- **Money is always integer cents.** Storage, transport, math. Convert at
  the display layer with `formatMoney()` from `@maison/shared`. Never do
  floating-point arithmetic on currency.
- **Currency is per-household.** Don't assume a global default.
- **Dates use ISO 8601 strings on the wire** (Zod's `z.coerce.date()`).
  Convert to `Date` at the boundary. Don't pass `Date` objects through
  JSON.

---

## Testing

Focus on **integration tests** that exercise real user workflows. Don't
over-unit-test.

| Level       | Tool                     | What                                            |
| ----------- | ------------------------ | ----------------------------------------------- |
| Unit        | Vitest                   | Pure functions: settle-up, money helpers, Zod   |
| Integration | Vitest + Testing Library | Feature flows — render, interact, assert        |
| E2E         | Playwright               | Critical journeys (sign-in, create-house, bill) |

- Colocate tests in `__tests__/` next to the code under test.
- For tRPC calls in integration tests, mock at the network layer with
  **MSW**, not by stubbing tRPC hooks directly.

---

## Performance

- **Server Components by default.** `'use client'` is opt-in, pushed to
  leaves.
- **`next/dynamic`** for heavy client components not needed on initial
  paint.
- **Prefetch on hover** for likely navigation:
  ```ts
  onMouseEnter={() => utils.household.get.prefetch({ householdId })}
  ```
- Tailwind is build-time only — no runtime CSS-in-JS overhead. Stay there.
- Avoid unnecessary context providers; they can trigger broad re-renders.

---

## Security

1. **No secrets in the browser.** `CLERK_SECRET_KEY`, `POSTGRES_*` URLs,
   etc. stay server-side. Anything with `NEXT_PUBLIC_` / `EXPO_PUBLIC_` is
   publicly readable — treat the value accordingly.
2. **Validate inputs at boundaries** with Zod. Client (for UX) and server
   (for authority). Never trust the wire.
3. **Row-level scoping in tRPC.** Procedures must filter by the
   authenticated user's id / household membership. Never trust a
   client-supplied scope without server verification.
4. **No `dangerouslySetInnerHTML`** without explicit sanitization.
5. **httpOnly cookies** for auth. Clerk handles this for us — don't store
   tokens in `localStorage`.
6. **CSP headers** when we add them — configured in `next.config.ts` or
   via middleware.

---

## Cross-platform (mobile)

- `apps/mobile` is **Expo (SDK 52+) + React Native + NativeWind**.
- Tailwind tokens from `apps/web/src/app/globals.css` `@theme` are
  mirrored in `apps/mobile`'s NativeWind config so palette, spacing, and
  typography stay consistent across web and mobile.
- Mobile feature folders follow the same structure as web
  (`src/features/{name}/`).
- The mobile tRPC client points at the web app's `/api/trpc` endpoint
  (configured via `EXPO_PUBLIC_API_URL`).

---

## Quick reference — essential libraries

| Purpose      | Library                                     |
| ------------ | ------------------------------------------- |
| Framework    | Next.js 15 (App Router) + React 19          |
| Mobile       | Expo (SDK 52+) + React Native + NativeWind  |
| Styling      | Tailwind v4 (CSS-first `@theme`)            |
| Server cache | tRPC v11 + TanStack React Query             |
| Auth         | Clerk (`@clerk/nextjs`, `@clerk/expo`)       |
| Database     | Neon Postgres + Prisma                      |
| Validation   | Zod                                         |
| Forms        | React Hook Form (when added)                |
| Testing      | Vitest + Testing Library + Playwright + MSW |
| Monorepo     | Turborepo + pnpm                            |

### Checklist for a new feature

- [ ] `packages/shared/src/schemas.ts` — add Zod input schemas
- [ ] `packages/api/src/routers/{name}.ts` — add tRPC procedures
- [ ] Register the router in `packages/api/src/index.ts`'s `appRouter`
- [ ] `apps/web/src/features/{name}/api/` — client-side hook wrappers
- [ ] `apps/web/src/features/{name}/components/` — UI components
- [ ] `apps/web/src/app/{route}/page.tsx` — route entry (if it has one)
- [ ] `apps/mobile/src/features/{name}/` — mirror for mobile
- [ ] Tests in `__tests__/` next to the code
