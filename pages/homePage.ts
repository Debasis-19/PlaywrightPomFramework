import {Page,Locator} from '@playwright/test'
import {BasePage} from './BasePage'

export class HomePage extends BasePage{
   readonly browseEventsLink : Locator;

    constructor(page: Page){
        super(page)
        this.browseEventsLink = page.getByText('Browse Events →')
    }

    async verifyBrowseEventsLinkVisible(){
        await this.browseEventsLink.waitFor({state:'visible',timeout:5000})
    }
}