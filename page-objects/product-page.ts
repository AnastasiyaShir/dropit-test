import { expect, Locator, Page } from '@playwright/test';
import { AbstractPageObject } from './abstract-page-object';

export class ProductPage extends AbstractPageObject {

    readonly title: Locator;
    readonly minusButton: Locator;
    readonly quantityInput: Locator;
    readonly plusButton: Locator;
    readonly addToCartButton: Locator;

    readonly cartNotification: CartNotification;


    constructor(page: Page) {
        super(page);
        this.title = this.page.locator('[id^="ProductInfo-"]').locator('h1');
        this.minusButton = this.page.locator('//button[@name="minus"]');
        this.quantityInput = this.page.locator('//input[@name="quantity"]');
        this.plusButton = this.page.locator('//button[@name="plus"]');
        this.addToCartButton = this.page.locator('//button[@name="add"]');

        this.cartNotification = new CartNotification(page);
    }

    async selectSize(size: ProductSize | string) {
        await this.page.getByText(size).click();
    }

    async setQuantity(targetQuantity: number) {
        const currentQuantity = await this.getCurrentQuantity();
        const difference = targetQuantity - currentQuantity;
        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                await this.plusButton.click();
            }
        } else if (difference < 0) {
            for (let i = 0; i < Math.abs(difference); i++) {
                await this.minusButton.click();
            }
        }

    }

    async addProduct(size: ProductSize | string, targetQuantity: number) {
        await this.selectSize(size)
        await this.setQuantity(targetQuantity);
        // await this.addToCartButton.waitFor({ state: 'enabled' });
         await this.page.waitForTimeout(500);
        await expect(this.addToCartButton).toBeEnabled()
       
        await this.addToCartButton.click();
        await this.cartNotification.close();
    }

    private async getCurrentQuantity(): Promise<number> {
        const value = await this.quantityInput.inputValue();
        return parseInt(value, 10);
    }

}

export enum ProductSize {
    SMALL = "Small",
    MEDIUM = "Medium",
    LARGE = "Large",
}

class CartNotification extends AbstractPageObject {

    readonly continueShoppingButton: Locator;

    
    constructor(page: Page) {
        super(page);
        this.continueShoppingButton = this.page.locator('#cart-notification').getByRole('button', { name: 'Continue shopping' });
    }

    async close() {
        await this.continueShoppingButton.click();
    }

}
