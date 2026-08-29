import {Page,Locator} from '@playwright/test'
import {BasePage} from './BasePage' 

export class EventsPage extends BasePage{
    readonly eventCards:Locator;
    readonly bookEventButton:Locator;

    constructor(page:Page){
        super(page)
        this.eventCards = page.getByRole('article')
        this.bookEventButton = page.getByText('Book Event')
    }

    async getEventCardByTitle(title: string) {
        return this.eventCards.filter({ hasText: title });
    }

    async getTotalSeatsFromEventCard(title: string): Promise<string | null> {
        const eventCard = await this.getEventCardByTitle(title);
        const totalSeatsText = await eventCard.locator('.text-xs').last().textContent();
        return totalSeatsText;
    }

    async clickBookNowOnEventCard() {
        await this.bookEventButton.click();
    }

    async getNumberOfSeatsAvailable(title: string): Promise<number> {
        const totalSeatsText = await this.getTotalSeatsFromEventCard(title);
        const seatCountMatch = totalSeatsText?.match(/\d+/);
        return seatCountMatch ? Number(seatCountMatch[0]) : 0;
    }
}