# Tech Stack

The technologies used in this project and why each was chosen. Versions are the major lines in use; see each workspace's `package.json` for exact versions.

## Runtime & Repository

| Choice         | Version | Why                                                                                                                                |
| -------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Node.js        | 24 LTS  | Current LTS; pinned in `.nvmrc` and `engines`                                                                                      |
| npm workspaces | npm 10+ | `client/`, `server/` and `shared/` in one repo with no extra tooling                                                               |
| TypeScript     | 6.0.x   | Used throughout. Stays on 6.x rather than 7.x (the new native compiler) until typescript-eslint and editor tooling fully support 7 |
| concurrently   | 10.x    | One `npm run dev` starts the client and server together                                                                            |

## Client

| Choice                                                             | Version | Why                                                                                                                                                             |
| ------------------------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React                                                              | 19.x    | Required by the brief                                                                                                                                           |
| Vite                                                               | 8.x     | Fast dev server and build; proxies `/api` to the server during development                                                                                      |
| Material UI (`@mui/material`, `@emotion/react`, `@emotion/styled`) | 9.x     | Ready-made, accessible form components, with an AutoGrab-inspired theme (`createTheme`) in light and dark colour schemes. Emotion is a required peer dependency |
| `@mui/icons-material`                                              | 9.x     | Icons for the System / Light / Dark theme switcher                                                                                                              |
| React Router (`react-router`)                                      | 8.x     | Routes `/` (form) and `/upload` (result), and passes the result between them. Declarative mode only                                                             |
| React Hook Form (`react-hook-form`)                                | 7.x     | Form state, validation timing, submitting state and mapping server errors onto fields. MUI inputs are wired with `Controller`                                   |
| `@hookform/resolvers`                                              | 7.x     | Connects the shared Zod schema to React Hook Form (`zodResolver`)                                                                                               |
| Axios                                                              | 1.x     | Posts the multipart `FormData`; parses JSON replies and tells server errors apart from network failures (`isAxiosError`)                                        |

## Server

| Choice     | Version              | Why                                                                                                                               |
| ---------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Express    | 5.x                  | Widely known; errors thrown in `async` handlers reach the error handler without wrappers                                          |
| Multer     | 2.x                  | Multipart handling for the logbook; memory storage with a 1 MB limit, nothing written to disk                                     |
| tsx        | 4.x                  | Runs the TypeScript server directly (watch mode in development); no server build step                                             |
| Validation | Zod (from `shared/`) | The same schema the form uses validates `make`, `model` and `badge`. Logbook byte checks (UTF-8, NUL bytes) stay a plain function |

## Shared

| Choice                        | Why                                                                                                                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/` workspace package   | Single source for `vehicles.json`, lookup helpers, validation schemas and API contract types                                                                                                  |
| Zod 4.x                       | One schema validates the selection on both client and server, so both give identical messages. API request/response types are inferred from the schemas (`z.infer`) rather than written twice |
| Consumed as TypeScript source | Vite and tsx both handle `.ts` directly, so the package needs no build step                                                                                                                   |

## Theme & Branding

| Choice                         | Why                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| MUI `createTheme` (`theme.ts`) | One file for AutoGrab-inspired colours, fonts and corner radius, with System / Light / Dark modes through `colorSchemes` |
| System font stacks             | A system UI stack for body text and a Verdana stack for headings. No font packages or Google Fonts requests              |

## Testing & Code Quality

| Choice                                                                            | Version           | Why                                                       |
| --------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------- |
| Vitest                                                                            | 5.x               | Shares Vite's config; TypeScript works without setup      |
| React Testing Library, `@testing-library/user-event`, `@testing-library/jest-dom` | 16.x / 14.x / 7.x | Tests the form the way a user drives it                   |
| jsdom                                                                             | 30.x              | Browser environment for client tests                      |
| Supertest (+ `@types/supertest`)                                                  | 7.x               | Tests the Express app in memory without starting a server |
| `axios-mock-adapter`                                                              | 2.x               | Mocks the client's HTTP calls at the Axios adapter        |
| ESLint + typescript-eslint                                                        | 10.x / 8.x        | Linting across all workspaces, configured at the root     |
| Prettier                                                                          | 3.x               | Consistent formatting                                     |

## Deliberately Not Used

| Not used                                | Reason                                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| Redux, Zustand or other state libraries | React Hook Form plus router navigation state covers everything                               |
| TanStack Query                          | One request, no caching                                                                      |
| Next.js / React Router framework mode   | The brief asks for a separate Node backend; server rendering adds complexity with no benefit |
| `react-hook-form-mui`                   | An extra wrapper library; React Hook Form's `Controller` with MUI components is enough       |
| Docker, databases                       | Out of scope for this challenge                                                              |
| Playwright end-to-end tests             | Out of scope for this challenge (see [Future improvements](future-improvements.md))          |
| Prisma or another ORM, Better Auth      | No database or users in this challenge                                                       |

## Known Risks

- **TypeScript 7:** before upgrading, confirm typescript-eslint supports it.
- **`zodResolver` types:** let `useForm` infer its types from the resolver (or pass input, context and output generics). A single `useForm<T>` generic conflicts with Zod schemas whose input and output types differ.
- **Shared TypeScript source with no build step:** works with Vite and tsx. If the server ever needs compiling with `tsc`, `shared/` will need its own build step or TypeScript project references.
