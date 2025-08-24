# E2E Tests
This folder contains end-to-end (E2E) Playwright tests and related configuration for this project.

## Structure

```
e2e/
├── tests/           # Main test specs (e.g., flaky.spec.ts)
│   └── ...
├── pages/           # Page Object Models (POMs) for each challenge
│   ├── BasePage.ts              # Shared base class for all challenge pages
│   ├── ChallengeOnePage.ts      # POM for Challenge 1
│   ├── ChallengeTwoPage.ts      # POM for Challenge 2
│   ├── ChallengeThreePage.ts    # POM for Challenge 3
│   └── ChallengeFourPage.ts     # POM for Challenge 4
├── fixtures/        # Custom Playwright fixtures for test setup
│   └── testFixtures.ts          # Exposes page objects and helpers to tests
├── .env             # Environment variables for E2E tests (e.g., USER_PASSWORD)
└── README.md       
```

### Folder and File Descriptions

- **tests/**: Contains all Playwright test specs.
- **pages/**: Contains Page Object Model (POM) classes. Each challenge page has its own POM, all extending `BasePage` for shared logic and selectors.
- **fixtures/**: Contains custom Playwright fixtures, such as `testFixtures.ts`, which provides page objects and helpers to tests via dependency injection.
- **.env**: Stores environment variables used by tests (e.g., credentials). Should not be committed to version control if sensitive.
- **README.md**: This file, describing the E2E test setup and structure.

## Usage

1. **Set up environment variables:**
   - Copy `.env` and set required values (e.g., `USER_PASSWORD`).
2. **Run tests:**
   - Headless: `npm run test:chromium-headless`
   - Headed: `npm run test`
3. **View reports:**
   - After a run, open the HTML report: `npx playwright show-report`

## Notes
- All environment variables in `.env` are loaded automatically via `dotenv` in `playwright.config.ts`.
- Tests are written in TypeScript and use Playwright's fixtures and POM best practices.
