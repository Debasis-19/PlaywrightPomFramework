import {Locator,Page} from '@playwright/test'
import {BasePage} from './BasePage'

export class BookingPage extends BasePage{
    readonly fullNameInput:Locator;
    readonly emailInput:Locator;
    readonly phoneNumberInput:Locator;
    readonly confirmBookingButton:Locator;
    readonly bookingConfirmedText:Locator
    readonly bookingRefernce:Locator
    readonly viewMyBookingsButton:Locator

    constructor(page:Page){
        super(page)
        this.fullNameInput = page.getByRole('textbox',{name:'Full Name'})
        this.emailInput = page.getByRole('textbox',{name:'Email'})
        this.phoneNumberInput = page.getByRole('textbox',{name:'Phone Number'})
        this.confirmBookingButton = page.getByText('Confirm Booking')
        this.bookingConfirmedText = page.getByText('Booking Confirmed!')
        this.bookingRefernce = page.locator('.booking-ref')
        this.viewMyBookingsButton = page.getByRole('button',{name:'View My Bookings'})
    }

    async fillBookingForm(fullName:string,email:string,phoneNumber:string){
        await this.fullNameInput.fill(fullName)
        await this.emailInput.fill(email)
        await this.phoneNumberInput.fill(phoneNumber)
        await this.confirmBookingButton.click()
    }

    async getBookingConfirmation(){
        await this.bookingConfirmedText.waitFor({state:'visible'})
        return await this.bookingConfirmedText.textContent()
    }

    async getBookingReference(){
        await this.bookingRefernce.waitFor({state:'visible'})
        return await this.bookingRefernce.textContent()
    }

    async clickViewMyBookings(){
        await this.viewMyBookingsButton.click()
    }
}