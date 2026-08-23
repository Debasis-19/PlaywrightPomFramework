import {test,Page,Locator} from '@playwright/test'

export class MyBookingsPage{
    page:Page
    bookingCards : Locator

    constructor(page:Page){
        this.page = page
        this.bookingCards = page.getByTestId('booking-card')
    }
}