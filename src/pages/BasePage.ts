import type { Page } from '@playwright/test';

export class BasePage {
  constructor(readonly page: Page) {}

  async navigate(path: string): Promise<void> {
    // domcontentloaded fires after HTML is parsed and defer scripts execute — React's main
    // bundle runs synchronously here, so all components are mounted by this point.
    // Using 'load' or 'networkidle' risks a 30s timeout on slow QA environments (Firefox)
    // where images/fonts/analytics delay those events.
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }
}
