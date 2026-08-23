import {test, expect} from '../fixtures/pageFixtures';
import eventhubData from '../testData/eventhubData.json'
import {TEST_DATA} from '../data/testData'


test('E2E Event Creation Test with POM', async ({page,loginPage,homePage,adminEventsPage,eventsPage,bookingPage,myBookingsPage}) => {
    //Step 1 - Using the storage state to authenticate the user
    await page.goto(process.env.baseurl!)

    //Step 2 - Create a new event
    await page.getByRole('navigation').getByText('Admin').click()
    await page.getByRole('navigation').getByRole('link',{name:'Manage Events'}).click()
    await expect(page).toHaveURL(process.env.baseurl + '/admin/events')
    await page.screenshot({ path: 'screenshots/ManageEvents.png', fullPage: true })
    await adminEventsPage.createEvent(eventhubData.eventName, eventhubData.category, eventhubData.city, eventhubData.venue, '2026-09-25T14:30', eventhubData.price, eventhubData.totalSeats)
    await expect(adminEventsPage.eventCreatedToast).toBeVisible()
    const eventCreatedToastMsg = await adminEventsPage.getEventToastMessage()
    console.log({eventCreatedToastMsg})

    //Step 3 - Find the event card and capture seats
    await page.getByRole('navigation').getByRole('link',{name:'Events'}).click()
    await expect(eventsPage.eventCards.filter({hasText:'NFL League'})).toBeVisible({timeout: 5000})
    const totalSeatsText = await eventsPage.getTotalSeatsFromEventCard(eventhubData.eventName)
    console.log({totalSeatsText})
    
    const beforeSeatBooking = Number(totalSeatsText?.split(' ')[0] || '0')
    console.log({beforeSeatBooking})

    //Step 4 - Book the event
    const eventCard = await eventsPage.getEventCardByTitle(eventhubData.eventName);
    await eventCard.getByText('Book Now').click()

     //Step 5 - Fill the booking form
    await bookingPage.fillBookingForm(TEST_DATA.contactInformation.fullName,TEST_DATA.loginCredentials.username,TEST_DATA.contactInformation.phoneNumber)

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
    await expect(bookingCards.filter({hasText:bookingRef})).toContainText(eventhubData.eventName)

    //Step 8 — Verify seat reduction
    await page.getByRole('navigation').getByRole('link',{name:'Events'}).click()
    await page.waitForTimeout(3000) // Wait for the page to load and render the event cards
    const seatsAfterBooking = await eventsPage.getNumberOfSeatsAvailable(eventhubData.eventName)
    console.log({seatsAfterBooking})
    expect(seatsAfterBooking).toBeLessThanOrEqual(beforeSeatBooking - 1)

    //Step 9 - Delete the event
    await page.getByRole('navigation').getByText('Admin').click()
    await page.getByRole('navigation').getByRole('link',{name:'Manage Events'}).click()
    await adminEventsPage.deleteEvent(eventhubData.eventName)
    await expect(adminEventsPage.deletedEventToast).toBeVisible()
    const eventDeletedToastMsg = await adminEventsPage.deletedEventToast.textContent()
    console.log({eventDeletedToastMsg})
})