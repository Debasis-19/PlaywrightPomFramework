import {test,expect} from '@playwright/test';
import eventhubData from '../testData/eventhubData.json'

// Reusable helper function to delete event
async function deleteEvent(page: any, eventName: string) {
    try {
        await page.getByRole('navigation').getByText('Admin').click()
        await page.getByRole('navigation').getByRole('link',{name:'Manage Events'}).click()
        await page.getByRole('table').getByRole('row',{name:new RegExp(eventName)}).getByRole('button',{name:'Delete'}).click()
        await page.getByRole('button',{name:'Delete event'}).click()
        await expect(page.getByText('Event deleted')).toBeVisible()
    } catch (error) {
        console.log(`Cleanup: Event "${eventName}" not found or already deleted`)
    }
}

test('E2E Event Creation Test',async({browser}) => {

    const context = await browser.newContext()
    const page = await context.newPage()
    //Step 1 - Login
    await page.goto(process.env.baseurl! + '/login')
    await page.getByRole('textbox',{name:'email'}).fill(process.env.email!)
    await page.getByRole('textbox',{name:'password'}).fill(process.env.password!)
    await page.getByRole('button',{name:'Sign In'}).click()
    await expect(page.getByText('Browse Events →')).toBeVisible()

    //Step 2 - Create a new event
    await page.getByRole('navigation').getByText('Admin').click()
    await page.getByRole('navigation').getByRole('link',{name:'Manage Events'}).click()
    await page.getByLabel('Title').fill('NFL League')
    await page.getByRole('combobox',{name:'Category'}).selectOption(eventhubData.category)
    await page.getByLabel('City').fill(eventhubData.city)
    await page.getByRole('textbox',{name:'Venue'}).fill(eventhubData.venue)
    await page.getByLabel('Event Date & Time').fill('2026-09-25T14:30')
    await page.getByLabel('Price').fill(eventhubData.price)
    await page.getByLabel('Total Seats').fill(eventhubData.totalSeats)
    await page.getByRole('button',{name:'Add Event'}).click()
    await expect(page.getByText('Event created!')).toBeVisible()
    const eventCreatedToastMsg = await page.locator('.pointer-events-auto').textContent()
    console.log({eventCreatedToastMsg})

    //Step 3 - Find the event card and capture seats
    await page.getByRole('navigation').getByRole('link',{name:'Events'}).click()
    const eventCard = page.getByRole('article').filter({hasText:'NFL League'})
    await expect(eventCard).toBeVisible({timeout: 5000})
    const totalSeatsText = await eventCard.getByText('1000 seats available').textContent()
    console.log({totalSeatsText})
    const beforeSeatBooking = Number(totalSeatsText?.split(' ')[0] || '0')
    console.log({beforeSeatBooking})

    //Step 4 - Book the event
    // "Book Now" is text/link, not a button role - use getByText instead
    await eventCard.getByText('Book Now').click()

    //Step 5 - Fill the booking form
    await page.getByRole('textbox',{name:'Full Name'}).fill(eventhubData.fullName)
    await page.getByRole('textbox',{name:'Email'}).fill(process.env.email!)
    await page.getByRole('textbox',{name:'Phone Number'}).fill(eventhubData.phoneNumber)
    await page.getByText('Confirm Booking').click()

    //Step 6 — Verify booking confirmation
    await expect(page.getByText('Booking Confirmed!')).toBeVisible()
    const bookingRef = await page.locator('.booking-ref').textContent()
    if (!bookingRef) {
        throw new Error('Booking reference not found')
    }
    console.log({bookingRef})

    //Step 7 — Verify in My Bookings
    await page.getByRole('button',{name:'View My Bookings'}).click()
    await expect(page).toHaveURL(process.env.baseurl + '/bookings')
    const bookingCards = page.getByTestId('booking-card')
    //await expect(bookingCards.first()).toBeVisible()
    await expect(bookingCards.filter({hasText:bookingRef})).toBeVisible()
    await expect(bookingCards.filter({hasText:bookingRef})).toContainText('NFL League')

    //Step 8 — Verify seat reduction
    await page.getByRole('navigation').getByRole('link',{name:'Events'}).click()
    await page.waitForTimeout(3000) // Wait for the page to load and render the event cards
    
    const seatsAfterBooking = await eventCard.getByText('seats available').textContent()
    const afterSeatBooking = Number(seatsAfterBooking?.split(' ')[0] || '0')
    console.log({afterSeatBooking})
    expect(afterSeatBooking).toBeLessThanOrEqual(beforeSeatBooking - 1)

    // Cleanup: Delete the event
    await deleteEvent(page, 'NFL League')
    
})

test('E2E Event Creation Test using storage state',async({browser}) => {
    const context = await browser.newContext({
        storageState:'login.json'
    })
    const page = await context.newPage()
    await page.goto(process.env.baseurl!)
    await expect(page.getByText('Browse Events →')).toBeVisible()

    //Step 2 - Create a new event
    await page.getByRole('navigation').getByText('Admin').click()
    await page.getByRole('navigation').getByRole('link',{name:'Manage Events'}).click()
    await page.getByLabel('Title').fill('NFL League')
    await page.getByRole('combobox',{name:'Category'}).selectOption('Sports')
    await page.getByLabel('City').fill('Charlotte')
    await page.getByRole('textbox',{name:'Venue'}).fill('Bank of America stadium')
    await page.getByLabel('Event Date & Time').fill('2026-09-25T14:30')
    await page.getByLabel('Price').fill('60')
    await page.getByLabel('Total Seats').fill('1000')
    await page.getByRole('button',{name:'Add Event'}).click()
    await expect(page.getByText('Event created!')).toBeVisible()
    const eventCreatedToastMsg = await page.locator('.pointer-events-auto').textContent()
    console.log({eventCreatedToastMsg})

    //Step 3 - Find the event card and capture seats
    await page.getByRole('navigation').getByRole('link',{name:'Events'}).click()
    const eventCard = page.getByRole('article').filter({hasText:'NFL League'})
    await expect(eventCard).toBeVisible({timeout: 5000})
    const totalSeatsText = await eventCard.getByText('1000 seats available').textContent()
    console.log({totalSeatsText})
    const beforeSeatBooking = Number(totalSeatsText?.split(' ')[0] || '0')
    console.log({beforeSeatBooking})

    //Step 4 - Book the event
    await eventCard.getByText('Book Now').click()

    //Step 5 - Fill the booking form
    await page.getByRole('textbox',{name:'Full Name'}).fill('Automation')
    await page.getByRole('textbox',{name:'Email'}).fill(process.env.email!)
    await page.getByRole('textbox',{name:'Phone Number'}).fill('2820902829')
    await page.getByText('Confirm Booking').click()

    //Step 6 — Verify booking confirmation
    await expect(page.getByText('Booking Confirmed!')).toBeVisible()
    const bookingRef = await page.locator('.booking-ref').textContent()
    if (!bookingRef) {
        throw new Error('Booking reference not found')
    }
    console.log({bookingRef})

    //Step 7 — Verify in My Bookings
    await page.getByRole('button',{name:'View My Bookings'}).click()
    await expect(page).toHaveURL(process.env.baseurl + '/bookings')
    const bookingCards = page.getByTestId('booking-card')
    await expect(bookingCards.first()).toBeVisible()
    await expect(bookingCards.filter({hasText:bookingRef})).toBeVisible()
    await expect(bookingCards.filter({hasText:bookingRef})).toContainText('NFL League')

    //Step 8 — Verify seat reduction
    await page.getByRole('navigation').getByRole('link',{name:'Events'}).click()
    await page.waitForTimeout(3000)
    
    const seatsAfterBooking = await eventCard.getByText('seats available').textContent()
    const afterSeatBooking = Number(seatsAfterBooking?.split(' ')[0] || '0')
    console.log({afterSeatBooking})
    expect(afterSeatBooking).toBeLessThanOrEqual(beforeSeatBooking - 1)

    // Cleanup: Delete the event
    await deleteEvent(page, 'NFL League')
    
    await context.close()
})

