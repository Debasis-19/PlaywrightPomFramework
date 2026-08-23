import {test, expect} from '@playwright/test';
import eventhubData from '../testData/eventhubData.json'
import {LoginPage} from '../pages/loginPage'
import {HomePage} from '../pages/homePage'
import {AdminEventsPage} from '../pages/adminEventsPage'
import {EventsPage} from '../pages/EventsPage'
import {BookingPage} from '../pages/bookingPage'
import {MyBookingsPage} from '../pages/myBookingsPage'

test('E2E Event Creation Test with POM', async ({browser}) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    const loginPage = new LoginPage(page)
    const homePage = new HomePage(page)
    const adminEventsPage = new AdminEventsPage(page)
    const eventsPage = new EventsPage(page)
    const bookingPage = new BookingPage(page)
    const myBookingsPage = new MyBookingsPage(page)

    //Step 1 - Login
    await page.goto(process.env.baseurl! + '/login')
    await loginPage.loginAction(process.env.email!, process.env.password!)
    await expect(homePage.browseEventsLink).toBeVisible()

    //Step 2 - Create a new event
    await page.getByRole('navigation').getByText('Admin').click()
    await page.getByRole('navigation').getByRole('link',{name:'Manage Events'}).click()
    await adminEventsPage.createEvent('NFL League', eventhubData.category, eventhubData.city, eventhubData.venue, '2026-09-25T14:30', eventhubData.price, eventhubData.totalSeats)
    await expect(adminEventsPage.eventCreatedToast).toBeVisible()
    const eventCreatedToastMsg = await adminEventsPage.getEventToastMessage()
    console.log({eventCreatedToastMsg})

    //Step 3 - Find the event card and capture seats
    await page.getByRole('navigation').getByRole('link',{name:'Events'}).click()
    await expect(eventsPage.eventCards.filter({hasText:'NFL League'})).toBeVisible({timeout: 5000})
    const totalSeatsText = await eventsPage.getTotalSeatsFromEventCard('NFL League')
    console.log({totalSeatsText})
    
    const beforeSeatBooking = Number(totalSeatsText?.split(' ')[0] || '0')
    console.log({beforeSeatBooking})

    //Step 4 - Book the event
    const eventCard = await eventsPage.getEventCardByTitle('NFL League');
    await eventCard.getByText('Book Now').click()

     //Step 5 - Fill the booking form
    await bookingPage.fillBookingForm(eventhubData.fullName,process.env.email!,eventhubData.phoneNumber)

     //Step 6 — Verify booking confirmation
    const bookingConfirmationText = await bookingPage.getBookingConfirmation()
    console.log({bookingConfirmationText})
    expect(bookingConfirmationText).toContain('Booking Confirmed!')
    const bookingRef = await bookingPage.getBookingReference()
    if (!bookingRef) {
        throw new Error('Booking reference not found')
    }
    console.log({bookingRef})

    //Step 7 — Verify in My Bookings
    await bookingPage.clickViewMyBookings()
    await expect(page).toHaveURL(process.env.baseurl + '/bookings')
    const bookingCards = myBookingsPage.bookingCards
    await expect(bookingCards.filter({hasText:bookingRef})).toBeVisible({timeout: 5000})
    await expect(bookingCards.filter({hasText:bookingRef})).toContainText('NFL League')

    //Step 8 — Verify seat reduction
    await page.getByRole('navigation').getByRole('link',{name:'Events'}).click()
    await page.waitForTimeout(3000) // Wait for the page to load and render the event cards
    const seatsAfterBooking = await eventsPage.getNumberOfSeatsAvailable('NFL League')
    console.log({seatsAfterBooking})
    expect(seatsAfterBooking).toBeLessThanOrEqual(beforeSeatBooking - 1)

    //Step 9 - Delete the event
    await page.getByRole('navigation').getByText('Admin').click()
    await page.getByRole('navigation').getByRole('link',{name:'Manage Events'}).click()
    await adminEventsPage.deleteEvent('NFL League')
    await expect(adminEventsPage.deletedEventToast).toBeVisible()
    const eventDeletedToastMsg = await adminEventsPage.deletedEventToast.textContent()
    console.log({eventDeletedToastMsg})
})