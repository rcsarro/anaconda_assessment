// e2e/fixtures/testFixtures.ts
// Custom Playwright fixtures scaffold

import { test as base } from '@playwright/test';

import { BasePage } from '../pages/BasePage';
import { ChallengeOnePage } from '../pages/ChallengeOnePage';
import { ChallengeTwoPage } from '../pages/ChallengeTwoPage';
import { ChallengeThreePage } from '../pages/ChallengeThreePage';
import { ChallengeFourPage } from '../pages/ChallengeFourPage';

const test = base.extend<{
  basePage: BasePage;
  challengeOnePage: ChallengeOnePage;
  challengeTwoPage: ChallengeTwoPage;
  challengeThreePage: ChallengeThreePage;
  challengeFourPage: ChallengeFourPage;
}>({
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
  challengeOnePage: async ({ page }, use) => {
    await use(new ChallengeOnePage(page));
  },
  challengeTwoPage: async ({ page }, use) => {
    await use(new ChallengeTwoPage(page));
  },
  challengeThreePage: async ({ page }, use) => {
    await use(new ChallengeThreePage(page));
  },
  challengeFourPage: async ({ page }, use) => {
    await use(new ChallengeFourPage(page));
  },
});

export { test };
