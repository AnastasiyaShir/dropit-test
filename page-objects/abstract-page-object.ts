import { Page } from '@playwright/test';

export class AbstractPageObject {
   
    readonly page: Page;

    
    constructor(page: Page) {
        this.page = page;
    }

}