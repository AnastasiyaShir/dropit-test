import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';
import { CartPage } from '../page-objects/cart-page';
import { ProductPage, ProductSize } from '../page-objects/product-page';
import { HomePage, SelectedPage } from '../page-objects/home-page';
import { SearchDialog } from '../page-objects/search.dialog';
import { CheckoutsPage } from '../page-objects/checkouts-page';
import { ThankYouPage } from '../page-objects/thank-you-page';
import { convertToInternational, maskCardNumber } from '../helpers/helper';
import { customer, card } from '../test-data/custumer.json'

test.describe('Order Flow', () => {

    var loginPage: LoginPage;
    var homePage: HomePage;
    var cartPage: CartPage;
    var productPage: ProductPage;
    var searchDialog: SearchDialog;
    var checkoutsPage: CheckoutsPage;
    var thankYouPage: ThankYouPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        cartPage = new CartPage(page);
        productPage = new ProductPage(page);
        searchDialog = new SearchDialog(page);
        checkoutsPage = new CheckoutsPage(page);
        thankYouPage = new ThankYouPage(page);
    })

    test('general order flow', { tag: "@sanity" }, async ({ page }) => {

        const EXPECTED_SHIPPING_ADDRESS =
            customer.firstName + " " + customer.lastName +
            customer.addressLine1 +
            customer.addressLine2 +
            customer.postalCode + " " + customer.city +
            customer.country;

        const EXPECTED_BILLING_ADDRESS = EXPECTED_SHIPPING_ADDRESS;
        const EXPECTED_USER_PHONE = convertToInternational(customer.phoneNumber);
        const MASKED_CARD_NUMBER = maskCardNumber(card.curdNumber);

        const SUBTOTAL_PRICE = "£33.00";
        const SHIPPING_PRICE = "£23.99";
        const TOTAL_PRICE = "£56.99";

        await loginPage.logIn(process.env.CORRECT_PASSWORD!);

        await homePage.gotoPage(SelectedPage.CATALOG);
        await expect(homePage.page).toHaveTitle(/.*Products.*/, { timeout: 10000 });

        await homePage.openSearchDialog();
        await expect(searchDialog.root).toBeVisible();
        await searchDialog.searchField.fill('Dropit Hambur');
        await searchDialog.searchResult('Dropit Hamburger (QA Automation)').click();


        await expect(productPage.title).toHaveText('Dropit Hamburger (QA Automation)');
        await productPage.addProduct(ProductSize.MEDIUM, 2);
        await productPage.addProduct("So large you can\'t eat it", 1);
        await expect(homePage.cartCount).toHaveText('3');

        await homePage.openSearchDialog();
        await expect(searchDialog.root).toBeVisible();
        await searchDialog.searchField.fill('Dropit');
        await searchDialog.searchResult('Dropit Chips (QA Automation)').click();


        await expect(productPage.title).toHaveText('Dropit Chips (QA Automation)');
        await productPage.addProduct(ProductSize.LARGE, 2);
        await productPage.addProduct('Too much for you to handle', 1);
        await expect(homePage.cartCount).toHaveText('6');

        await homePage.cartIcon.click()

        await expect(cartPage.subtotalValue).toHaveText(SUBTOTAL_PRICE + " GBP");
        await cartPage.checkoutButton.click();

        await page.waitForLoadState('load');
        await expect(checkoutsPage.totalAmount).toHaveText(TOTAL_PRICE);


        await checkoutsPage.fillCustomer(customer);
        await checkoutsPage.fillCard(card);

        await checkoutsPage.payNowButton.click();


        await expect(thankYouPage.page).toHaveTitle(/.*Thank you for your purchase!.*/, { timeout: 30000 });
        await expect.soft(thankYouPage.confirmationNumber).toHaveText(/Confirmation #........./);
        await expect.soft(thankYouPage.cratitudeLable).toHaveText('Thank you' + ', ' + customer.firstName + '!');
        await expect.soft(thankYouPage.orderDetails.contactInformation).toHaveText(EXPECTED_USER_PHONE);
        await expect.soft(thankYouPage.orderDetails.shippingAddress).toHaveText(EXPECTED_SHIPPING_ADDRESS);
        await expect.soft(thankYouPage.orderDetails.shippingMethod).toHaveText('Standard International');
        await expect.soft(thankYouPage.orderDetails.paymentMethod).toHaveText(MASKED_CARD_NUMBER + ' · ' + TOTAL_PRICE);
        await expect.soft(thankYouPage.orderDetails.billingAddress).toHaveText(EXPECTED_BILLING_ADDRESS);

    });

    test('incorrect email and card number', async ({ page }) => {

        const INCORRECT_EMAIL = 'incorrect email';
        const INCORRECT_CARD_NUMBER = '4444';


        await loginPage.logIn(process.env.CORRECT_PASSWORD!);

        await homePage.gotoPage(SelectedPage.CATALOG);
        await expect(homePage.page).toHaveTitle(/.*Products>*/);

        await homePage.openSearchDialog();

        await expect(searchDialog.root).toBeVisible();
        await searchDialog.searchField.fill('Dropit Hambur');
        await searchDialog.searchResult('Dropit Hamburger (QA Automation)').click();

        await expect(productPage.title).toHaveText('Dropit Hamburger (QA Automation)');

        await productPage.addToCartButton.click();
        await productPage.cartNotification.close();

        await homePage.openSearchDialog();
        await expect(searchDialog.root).toBeVisible();

        await searchDialog.searchField.fill('Dropit');
        await searchDialog.searchResult('Dropit Chips (QA Automation)').click();
        await expect(productPage.title).toHaveText('Dropit Chips (QA Automation)');

        await productPage.addToCartButton.click();
        await productPage.cartNotification.close();

        await homePage.cartIcon.click()
        await cartPage.checkoutButton.click();

        await page.waitForLoadState('load');

        await checkoutsPage.fillCustomer(customer, { phoneNumber: INCORRECT_EMAIL });

        await checkoutsPage.fillCard(card);
        await checkoutsPage.payNowButton.click();

        await expect(checkoutsPage.page).toHaveTitle(/.*Checkout.*/);
        await expect(thankYouPage.page).not.toHaveTitle(/.*Thank you for your purchase!.*/);
        await expect(checkoutsPage.emailOrPhoneField).toBeInViewport();
        await expect(checkoutsPage.emailOrPhoneField).toHaveAttribute('aria-invalid', 'true');
        await expect(checkoutsPage.emailOrPhoneErrorMessage).toHaveText('Enter a valid email');

        await checkoutsPage.emailOrPhoneField.fill(customer.phoneNumber);
        await checkoutsPage.curdNumber.fill(INCORRECT_CARD_NUMBER);

        await checkoutsPage.payNowButton.click();

        await expect(checkoutsPage.page).toHaveTitle(/.*Checkout.*/);
        await expect(thankYouPage.page).not.toHaveTitle(/.*Thank you for your purchase!.*/);
        await expect(checkoutsPage.curdNumber).toBeInViewport();
        await expect(checkoutsPage.curdNumber).toHaveAttribute('aria-invalid', 'true');
        await expect(checkoutsPage.cordNumberMessage).toHaveText('Enter a valid card number');
        await expect(checkoutsPage.paymentErrorBanner).toHaveText('Your payment details couldn’t be verified. Check your card details and try again.');


    });

})

