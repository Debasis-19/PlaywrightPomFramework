import { Page } from '@playwright/test';

export async function takeScreenshotFileName(page: Page, fileName: string): Promise<Buffer> {
    return page.screenshot({ path: `screenshots/${fileName}`, fullPage: true })
}