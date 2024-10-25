import { Locator, Page } from '@playwright/test';
import { AbstractPageObject } from './abstract-page-object';

export class CartPage extends AbstractPageObject {
   
    readonly checkoutButton: Locator;
    readonly subtotalValue: Locator;


    constructor(page: Page) {
        super(page);
        this.checkoutButton = this.page.locator('#checkout');
        this.subtotalValue = this.page.locator('//*[@id="main-cart-footer"]//p')
    }

}
