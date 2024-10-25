import { Locator, Page } from '@playwright/test';
import { AbstractPageObject } from './abstract-page-object';

export class HomePage extends AbstractPageObject {

    readonly cartIcon: Locator;
    readonly cartCount: Locator;

    
    constructor(page: Page) {
        super(page);
        this.cartIcon = this.page.locator('#cart-icon-bubble');
        this.cartCount = this.page.locator('//div[@class="cart-count-bubble"]/span[1]');
    }

    async gotoPage(selectedPage: SelectedPage) {
        await this.page.getByRole('link', { name: selectedPage }).click();
    }

    async openSearchDialog() {
        await this.page.getByRole('button', { name: 'Search' }).click();
    }

}

export enum SelectedPage {
    HOME = "Home",
    CATALOG = "Catalog",
    CONTACT = "Contact",
}