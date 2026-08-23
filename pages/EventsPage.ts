import {Page,Locator} from '@playwright/test'

export class EventsPage{
    page:Page;
    eventCards:Locator;
    bookEventButton:Locator;

    constructor(page:Page){
        this.page = page;
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