import {test as base,expect} from '@playwright/test'
import {LoginPage} from '../pages/loginPage'
import {HomePage} from '../pages/homePage'
import {AdminEventsPage} from '../pages/adminEventsPage'
import {EventsPage} from '../pages/EventsPage'
import {BookingPage} from '../pages/bookingPage'
import {MyBookingsPage} from '../pages/myBookingsPage'
import {HeaderNavComponent} from '../components/headerNavComponent'

type myFixture = {
    loginPage : LoginPage,
    homePage : HomePage,
    adminEventsPage : AdminEventsPage,
    eventsPage : EventsPage,
    bookingPage : BookingPage,
    myBookingsPage : MyBookingsPage,
    headerNavComponent : HeaderNavComponent
}

export const test = base.extend<myFixture>({
    loginPage : async({page},use) => {
        await use(new LoginPage(page))
    },
    homePage : async({page},use) => {
        await use(new HomePage(page))
    },
    adminEventsPage : async({page},use) => {
        await use(new AdminEventsPage(page))
    },
    eventsPage : async({page},use) => {
        await use(new EventsPage(page))
    },
    bookingPage : async({page},use) => {
        await use(new BookingPage(page))
    },
    myBookingsPage : async({page},use) => {
        await use(new MyBookingsPage(page))
    },
    headerNavComponent : async({page},use) => {
        await use(new HeaderNavComponent(page))
    }
})

test.afterEach(async ({page}, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page.screenshot({fullPage: true})
        await testInfo.attach('Failure Screenshot', {
            body: screenshot,
            contentType: 'image/png'
        })
    }
})

export {expect} from '@playwright/test'