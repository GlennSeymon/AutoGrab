# Future improvements

Not required by the brief, so left for later if time permits.

## Data, users and security

These depend on each other: a database makes it possible to manage the vehicle data and keep results, and once results are saved they need owners and access rules.

- **Store submissions in a database.** Postgres through Prisma (or another ORM) for typed queries and migrations. The logbook contents would go in a text column, or in object storage if files get large.
- **Vehicle data in the database, served by an API.** Makes, models and badges move from `vehicles.json` into Make → Model → Badge tables, seeded from the JSON once. The client loads them from `GET /api/vehicles`, and the server validates submissions against the same tables, so the data can change without a redeploy.
- **Keep the result after a refresh.** The result is passed between pages in router navigation state, so refreshing `/upload` shows the empty state. With a database, `GET /api/uploads/:id` would give each result its own shareable URL.
- **Authentication and sessions with Better Auth.** Better Auth mounted in Express at `/api/auth/*splat`, using its Prisma adapter so users, accounts and sessions live in the same Postgres database. Users sign in with email and password or a social/OIDC provider, so each submission belongs to an account. Sessions are stored in the database and identified by an HTTP-only, secure, SameSite cookie, so they can expire and be revoked on logout. Protected routes call `auth.api.getSession` to find the user.
- **Authorisation.** The user ID from the Better Auth session decides which submissions are visible: users only see their own, with roles (e.g. an admin who can see everyone's) if needed. Checked on the server for every route.

## Product and UX

- **TanStack Query.** Today there is a single POST, so it isn't needed. Once there are several requests (vehicle data, a list of submissions, a result fetched by ID), it would handle caching, loading and error states, and retries.
- **Structured logbook entries.** Parse the logbook into dated service entries and show them as a table instead of raw text.
- **Better upload experience.** Drag-and-drop, a progress bar for slow connections, and a preview of the file before submitting.
- **Searchable dropdowns.** An autocomplete for Make and Model once the vehicle list grows beyond a handful of entries.
- **Accessibility pass.** A keyboard-only run through the whole flow, a screen-reader check of labels, errors, the submitting state and the result page, and a colour-contrast check against WCAG AA. MUI's components already give a reasonable baseline (labelled inputs, errors shown in an `Alert` with `role="alert"`), but this hasn't been audited.
- **Cancelling and timing out the upload.** Not needed today: there is one request, started only by Submit, every input is disabled while it runs, and it goes to a local server. Two edge cases remain. If the user presses the browser's Back button mid-submit, the late reply still navigates to `/upload`, and a server that never replies leaves the spinner running until Node's 5-minute request timeout. An `AbortController` passed to Axios as `signal` and aborted when the form unmounts would fix the first, and a client timeout of about 30 seconds would fix the second by showing the existing "can't reach the server" message.

## Production readiness

- **Production build and serving.** The server runs its TypeScript directly through `tsx`, and in development the client reaches it through Vite's `/api` proxy. A production setup would compile the server (`shared/` would then need its own build step) and have Express or a reverse proxy serve the built client.
- **Docker.** A Dockerfile and Compose file, so the app (and later the database) runs without a local Node install.
- **CI pipeline.** A GitHub Actions workflow that runs lint, tests and build on every push and pull request.
- **Security hardening.** `helmet` security headers, rate limiting on `POST /api/upload`, and an explicit CORS policy if the client is ever served from another origin.
- **Structured logging.** Replace `console.error` in the error handler with a structured logger (e.g. pino) that tags each log with a request ID.
- **Error logging to Sentry.** On the server, `@sentry/node` is initialised in an `instrument.ts` loaded before the app, and `Sentry.setupExpressErrorHandler(app)` reports unexpected (500) errors before the existing error middleware turns them into `ApiError` JSON. On the client, `@sentry/react` captures render errors and failed requests, with source maps uploaded at build time. The request ID links a Sentry event to the server logs.

## Testing

- **Browser end-to-end tests.** A Playwright test of the real flow against the running client and server, replacing the manual end-to-end check.
