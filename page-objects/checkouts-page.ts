import { Locator, Page } from '@playwright/test';
import { AbstractPageObject } from './abstract-page-object';

export class CheckoutsPage extends AbstractPageObject {

    readonly emailOrPhoneField: Locator;
    readonly emailOrPhoneErrorMessage: Locator;
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly addressLine1Field: Locator;
    readonly addressLine2Field: Locator;
    readonly postalCode: Locator;
    readonly cutyField: Locator;

    readonly totalAmount: Locator;

    readonly curdNumber: Locator;
    readonly cordNumberMessage: Locator;
    readonly expirationDate: Locator;
    readonly securityCode: Locator;
    readonly nameOnCard: Locator;

    readonly payNowButton: Locator;
    readonly paymentErrorBanner: Locator

    proposalRequestHandled: boolean = false;

    constructor(page: Page) {
        super(page);
        this.emailOrPhoneField = this.page.locator('#email');
        this.emailOrPhoneErrorMessage = this.page.locator('#error-for-email');

        this.firstNameField = this.page.locator('#TextField0');
        this.lastNameField = this.page.locator('#TextField1');
        this.addressLine1Field = this.page.locator('#TextField2');
        this.addressLine2Field = this.page.locator('#TextField3');
        this.postalCode = this.page.locator('#TextField4');
        this.cutyField = this.page.locator('#TextField5');

        this.curdNumber = this.page.locator('iframe[name^="card-fields-number"]').contentFrame().locator('#number');
        this.cordNumberMessage = this.page.locator('iframe[name^="card-fields-number"]').contentFrame().locator('#error-for-number');
        this.expirationDate = this.page.locator('iframe[name^="card-fields-expiry-"]').contentFrame().locator('#expiry');
        this.securityCode = this.page.locator('iframe[name^="card-fields-verification_value-"]').contentFrame().locator('#verification_value');
        this.nameOnCard = this.page.locator('iframe[name^="card-fields-name-"]').contentFrame().locator('#name');

        this.payNowButton = this.page.locator('#checkout-pay-button');
        this.paymentErrorBanner = this.page.locator('#PaymentErrorBanner');

        this.totalAmount = page.locator('div[role="rowheader"]:has-text("Total") + div[role="cell"] strong');


        this.initProposalRequestTracking();

    }

    async openSearchDialog() {
        await this.page.getByRole('button', { name: 'Search' }).click();
    }

    async fillCustomer(customer: Customer, overrides: Partial<Customer> = {}) {
        await this.resetFlagProposalRequestHandled();

        await this.emailOrPhoneField.fill(overrides.phoneNumber ?? customer.phoneNumber);
        await this.firstNameField.fill(overrides.firstName ?? customer.firstName);
        await this.lastNameField.fill(overrides.lastName ?? customer.lastName);
        await this.addressLine1Field.fill(overrides.addressLine1 ?? customer.addressLine1);
        await this.addressLine2Field.fill(overrides.addressLine2 ?? customer.addressLine2);
        await this.postalCode.fill(overrides.postalCode ?? customer.postalCode);
        await this.cutyField.fill(overrides.city ?? customer.city);

        await this.waitForProposalRequestDone();
    }

    private initProposalRequestTracking() {
        this.page.on('response', response => {
            if (response.url().includes("operationName=Proposal") &&
                response.status() === 200) {
                this.proposalRequestHandled = true;
            }
        });
    }

    private async resetFlagProposalRequestHandled() {
        await this.waitForProposalRequestDone();
        this.proposalRequestHandled = false;
    }

    private async waitForProposalRequestDone() {
        if (!this.proposalRequestHandled) {
            await this.page.waitForResponse(response =>
                response.url().includes("operationName=Proposal") &&
                response.status() === 200
            );
        }
    }

    async fillCard(card: Card) {
        await this.curdNumber.fill(card.curdNumber);
        await this.expirationDate.fill(card.expirationDate);
        await this.securityCode.fill(card.securityCode);
        await this.nameOnCard.fill(card.nameOnCard);
    }

}

export interface Customer {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2: string;
    postalCode: string;
    city: string;
}

export interface Card {
    curdNumber: string;
    expirationDate: string;
    securityCode: string;
    nameOnCard: string;
}
