import { Locator, Page } from '@playwright/test';
import { AbstractPageObject } from './abstract-page-object';

export class ThankYouPage extends AbstractPageObject {

    readonly confirmationNumber: Locator;
    readonly cratitudeLable: Locator;

    readonly orderDetails: OrderDetails;

    
    constructor(page: Page) {
        super(page);
        this.confirmationNumber = this.page.locator('//*[@id="checkout-main"]//header//p');
        this.cratitudeLable = this.page.locator('//*[@id="checkout-main"]//header//h2');
        this.orderDetails = new OrderDetails(page);
    }

}


class OrderDetails extends AbstractPageObject {

    readonly contactInformation: Locator;
    readonly shippingAddress: Locator;
    readonly shippingMethod: Locator;
    readonly paymentMethod: Locator;
    readonly billingAddress: Locator;

    constructor(page: Page) {
        super(page);
        this.contactInformation = this.page.getByRole('heading', { name: 'Contact information' }).locator('xpath=..//p');
        this.shippingAddress = this.page.getByRole('heading', { name: 'Shipping address' }).locator('xpath=..//address');
        this.shippingMethod = this.page.getByRole('heading', { name: 'Shipping method' }).locator('xpath=..//p');
        this.paymentMethod = this.page.getByRole('heading', { name: 'Payment method' }).locator('xpath=..//p');
        this.billingAddress = this.page.getByRole('heading', { name: 'Billing address' }).locator('xpath=..//address');
    }

}
