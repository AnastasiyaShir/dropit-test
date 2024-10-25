import { Locator, Page } from '@playwright/test';
import { AbstractPageObject } from './abstract-page-object';

export class LoginPage extends AbstractPageObject {
   
    readonly passwordFild: Locator;
    readonly enterButton: Locator;

    
    constructor(page: Page) {
        super(page);
        this.passwordFild = page.getByLabel('Enter store password');
        this.enterButton = page.getByRole('button', { name: 'Enter' });
    }

    async logIn(password: string) {
        await this.page.goto('/password');
        await this.passwordFild.fill(password);
        await this.enterButton.click();
        await this.page.waitForLoadState('load');
    }

}
