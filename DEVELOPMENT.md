# WIP!

This document is in early WIP stages.

## Authentication & sources of truth

- Authentication is done using Auth.js.

But here is a tricky part:

- Swynca is a client for external IdP via OAuth or OIDC. It is not an IdP itself.
- However, Swynca acts as source of truth for Members data. It acts as M2M application and manages Members data in IdP.
- Swynca store necessary data in its own database to be able to migrate between different IdPs.
  But, as Swynca is not an IdP, it does not store any authentication data like passwords or MFAs.

## API

Swynca is build using React Server Components and Next.js Server Actions. That means, that it doesn't have a REST or GraphQL API.

Instead, it relies on Server Components to fetch necessary data, and Server Actions to perform changes.
In terms of REST, Server Components are user instead of GET requests, and Server Actions are used instead of POST/PUT/etc.

Swynca still has a REST API for external integrations, but it should not be used inside Swynca itself.

### Layers

Swynca has 3 layers:

- `src/lib` - provides primitives and business logic
- `src/data` - interfaces to access data and actions (something like endpoints in conventional REST API)
- `src/app` - contains all the UI-related code (pages, components)

In data layer, you should **never ever** return any entities directly from the database.
Always define DTO types and manually convert entities to DTOs.

Example:

```ts
// Bad
export async function getAll() {
  return prisma.members.findMany();
}

// Good
export type GetAllDTO = {
  id: Member["id"];
  name: Member["name"];
}[];

export async function getAll(): Promise<GetAllDTO> {
  const members = await prisma.members.findMany();
  return members.map((member) => ({
    id: member.id,
    name: member.name,
  }));
}
```

Each action in data layer must check the authentication and authorization.
