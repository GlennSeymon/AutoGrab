# Tech Stack

The technologies used in this project and why each was chosen. Versions are the major lines in use; see each workspace's `package.json` for exact versions.

## Runtime & Repository

| Choice         | Version | Why                                                                                                                                  |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Node.js        | 24 LTS  | Current LTS; pinned in `.nvmrc` and `engines`                                                                                        |
| npm workspaces | npm 10+ | `client/`, `server/` and `shared/` in one repo with no extra tooling                                                                 |
| TypeScript     | 6.0.x   | Used throughout. Stays on 6.x rather than 7.x (the new native compiler) until typescript-eslint and editor tooling fully support 7  |
| concurrently   | 10.x    | One `npm run dev` starts the client and server together                                                                              |

## Client

| Choice                                                     | Version  | Why                                                                                                           |
| ---------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| React                                                      | 19.x     | Required by the brief                                                                                          |
| Vite                                                       | 8.x      | Fast dev server and build; proxies `/api` to the server during development                                    |
| Material UI (`@mui/material`, `@emotion/react`, `@emotion/styled`) | 9.x | Ready-made, accessible form components. Starts with the default theme; an AutoGrab-inspired theme comes later. Emotion is a required peer dependency |
| `@mui/icons-material`                                      | 9.x      | Optional: upload and clear icons                                                                               |
| React Router (`react-router`)                              | 8.x      | Routes `/` (form) and `/upload` (result), and passes the result between them. Declarative mode only            |
| `fetch` + `FormData`                                       | built-in | A single multipart POST doesn't justify an HTTP client library                                                 |

## Server

| Choice      | Version      | Why                                                                                                          |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| Express     | 5.x          | Widely known; errors thrown in `async` handlers reach the error handler without wrappers                      |
| Multer      | 2.x          | Multipart handling for the logbook; memory storage with a 1 MB limit, nothing written to disk                 |
| tsx         | 4.x          | Runs the TypeScript server directly (watch mode in development); no server build step                        |
| Validation  | hand-written | Checking three fields against `vehicles.json` is a few lines; a schema library isn't needed                   |

## Shared

| Choice                    | Why                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `shared/` workspace package | Single source for `vehicles.json`, vehicle types, lookup/validation helpers and API contract types   |
| Consumed as TypeScript source | Vite and tsx both handle `.ts` directly, so the package needs no build step                      |

## Planned for Later (Theme & Branding)

Not installed in the initial build. An AutoGrab-inspired theme (colours, fonts and logo) is planned once the core app is complete.

| Choice                                                 | Version | Why                                                                     |
| ------------------------------------------------------ | ------- | ----------------------------------------------------------------------- |
| MUI `createTheme`                                      | 9.x     | One theme file for AutoGrab-inspired colours, fonts and corner radius   |
| `@fontsource/plus-jakarta-sans`, `@fontsource/unbounded` | 5.x   | Self-hosted fonts matching AutoGrab's site; no Google Fonts request     |

## Testing & Code Quality

| Choice                                                                   | Version      | Why                                                       |
| ------------------------------------------------------------------------ | ------------ | --------------------------------------------------------- |
| Vitest                                                                   | 5.x          | Shares Vite's config; TypeScript works without setup      |
| React Testing Library, `@testing-library/user-event`, `@testing-library/jest-dom` | 16.x / 14.x / 7.x | Tests the form the way a user drives it      |
| jsdom                                                                    | 30.x         | Browser environment for client tests                      |
| Supertest (+ `@types/supertest`)                                         | 7.x          | Tests the Express app in memory without starting a server |
| ESLint + typescript-eslint                                               | 10.x / 8.x   | Linting across all workspaces, configured at the root     |
| Prettier                                                                 | 3.x          | Consistent formatting                                     |

## Deliberately Not Used

| Not used                                       | Reason                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Redux, Zustand or other state libraries        | `useReducer` plus router navigation state covers everything                                |
| TanStack Query, axios                          | One request, no caching                                                                    |
| Next.js / React Router framework mode          | The brief asks for a separate Node backend; server rendering adds complexity with no benefit |
| Zod or other schema libraries                  | Validation is small enough to write by hand; easy to add later if the API grows            |
| Docker, databases, Playwright end-to-end tests | Out of scope for this challenge                                                            |

## Known Risks

- **TypeScript 7:** before upgrading, confirm typescript-eslint supports it.
- **Shared TypeScript source with no build step:** works with Vite and tsx. If the server ever needs compiling with `tsc`, `shared/` will need its own build step or TypeScript project references.
