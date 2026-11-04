# Future improvements

Not required by the brief, so left for later if time permits. These are the next steps for the form as it stands, not a wider vehicle platform.

## Product and UX

- **Accessibility pass.** A keyboard-only run through the whole flow, a screen-reader check of labels, errors, the submitting state and the result page, and a colour-contrast check against WCAG AA. MUI's components already give a reasonable baseline (labelled inputs, errors shown in an `Alert` with `role="alert"`), but this hasn't been audited.
- **Cancelling and timing out the upload.** Not needed today: there is one request, started only by Submit, every input is disabled while it runs, and it goes to a local server. Two edge cases remain. If the user presses the browser's Back button mid-submit, the late reply still navigates to `/upload`, and a server that never replies leaves the spinner running until Node's 5-minute request timeout. An `AbortController` passed to Axios as `signal` and aborted when the form unmounts would fix the first, and a client timeout of about 30 seconds would fix the second by showing the existing "can't reach the server" message.

## Production readiness

- **Production build and serving.** The server runs its TypeScript directly through `tsx`, and in development the client reaches it through Vite's `/api` proxy. A production setup would compile the server (`shared/` would then need its own build step) and have Express or a reverse proxy serve the built client.
- **CI pipeline.** A GitHub Actions workflow that runs lint, tests and build on every push and pull request.
- **Security hardening.** `helmet` security headers and rate limiting on `POST /api/upload`, since it accepts files from anyone who can reach it.
- **Error monitoring with Sentry.** Unexpected server errors are only written to the console by the Express error handler, and errors in the browser aren't reported at all. `@sentry/node`, initialised before the Express app loads, would capture server errors with their request context; by default its Express integration sends only 5xx errors, so the expected 400, 413 and 415 responses stay out. `@sentry/react` with its `ErrorBoundary` would capture client crashes and show a fallback instead of a blank page. The DSN would come from an environment variable, so local development and tests send nothing.

## Testing

- **Browser end-to-end tests.** A Playwright test of the real flow against the running client and server, replacing the manual end-to-end check.
