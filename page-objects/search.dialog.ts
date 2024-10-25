import { Locator, Page } from '@playwright/test';
import { AbstractPageObject } from './abstract-page-object';

export class SearchDialog extends AbstractPageObject {

    readonly root: Locator;
    readonly searchField: Locator;

    
    constructor(page: Page) {
        super(page);
        this.root = this.page.getByRole("dialog", { name: 'Search' });
        this.searchField = this.page.locator('#Search-In-Modal');
    }

    searchResult(searchResult: string | RegExp) {
        return this.page.locator('#predictive-search-results-list').getByText(searchResult);
    }

}
