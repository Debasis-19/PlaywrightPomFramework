import {Page,Locator} from '@playwright/test'

export class HomePage{
    page : Page;
    browseEventsLink : Locator;

    constructor(page: Page){
        this.page = page;
        this.browseEventsLink = page.getByText('Browse Events →')
    }

    async verifyBrowseEventsLinkVisible(){
        await this.browseEventsLink.waitFor({state:'visible',timeout:5000})
    }
}