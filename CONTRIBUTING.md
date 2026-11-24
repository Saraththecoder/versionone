# Contributing

Thank you for your interest in contributing to the AITS Smart College Bus Tracking System!

## Architecture & Conventions

This project strictly adheres to a **Repository-Service-Hook** architecture to keep Firebase logic decoupled from React components.

1. **Repositories (`src/repositories/`)**: The only files allowed to import from `firebase/firestore` or `firebase/database`. They handle raw database calls.
2. **Services (`src/services/`)**: Orchestrate business logic and connect multiple repositories if necessary.
3. **Hooks (`src/hooks/`)**: React hooks that interface with the Services and manage component state.
4. **Components (`src/components/`)**: Pure UI components.
5. **Portals (`src/app/(portals)/`)**: Route groups defining the three main access tiers: Admin, Driver, and Student.

## Code Style

- Use **TypeScript** for all new files.
- Enforce strict typing. Do not use `any`. Use the Zod schemas in `src/lib/schemas/index.ts` for data validation.
- Format code using the configured Prettier instance. Run `npm run format` before committing.

## Submitting a Pull Request

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Ensure `npm run lint` and `npx tsc --noEmit` pass.
6. Ensure the test suite passes via `npm run test`.
7. Submit a pull request.
