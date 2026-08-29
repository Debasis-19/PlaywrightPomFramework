import {Page,Locator} from '@playwright/test'
import {BasePage} from './BasePage'

export class AdminEventsPage extends BasePage{
    readonly titleInput:Locator;
    readonly categoryDropdown:Locator;
    readonly cityInput:Locator;
    readonly venueInput:Locator;
    readonly eventDateTimeInput:Locator;
    readonly priceInput:Locator;
    readonly totalSeatsInput:Locator;
    readonly addEventButton:Locator;
    readonly eventCreatedToast:Locator;
    readonly deleteEventButton:Locator;
    readonly deletedEventToast:Locator;

    constructor(page:Page){
        super(page)
        this.titleInput = page.getByLabel('Title')
        this.categoryDropdown = page.getByRole('combobox',{name:'Category'})
        this.cityInput = page.getByLabel('City')
        this.venueInput = page.getByRole('textbox',{name:'Venue'})
        this.eventDateTimeInput = page.getByLabel('Event Date & Time')
        this.priceInput = page.getByLabel('Price')
        this.totalSeatsInput = page.getByLabel('Total Seats')
        this.addEventButton = page.getByRole('button',{name:'Add Event'})
        this.eventCreatedToast = page.getByText('Event created!')
        this.deleteEventButton = page.getByRole('button',{name:'Delete event'})
        this.deletedEventToast = page.getByText('Event deleted')
    }

    getDeleteButton(eventName: string): Locator {
        return this.page.getByRole('table').getByRole('row',{name:new RegExp(eventName)}).getByRole('button',{name:'Delete'})
    }

    async createEvent(title:string, category:string, city:string, venue:string, eventDateTime:string, price:string, totalSeats:string){
        await this.titleInput.fill(title)
        await this.categoryDropdown.selectOption(category)
        await this.cityInput.fill(city)
        await this.venueInput.fill(venue)
        await this.eventDateTimeInput.fill(eventDateTime)
        await this.priceInput.fill(price)
        await this.totalSeatsInput.fill(totalSeats)
        await this.addEventButton.click()
    }

    async getEventToastMessage(): Promise<string | null> {
        return await this.eventCreatedToast.textContent();
    }

    async deleteEvent(eventName: string) {
        await this.getDeleteButton(eventName).click()
        await this.deleteEventButton.click()
        await this.deletedEventToast.waitFor({state:'visible'})
    }
}