import { Locator, Page } from '@playwright/test'

export class HeaderNavComponent {
    page: Page
    navigation: Locator
    adminMenuTrigger: Locator
    manageEventsLink: Locator
    eventsLink: Locator

    constructor(page: Page) {
        this.page = page
        this.navigation = page.getByRole('navigation')
        this.adminMenuTrigger = this.navigation.getByText('Admin')
        this.manageEventsLink = this.navigation.getByRole('link', { name: 'Manage Events' })
        this.eventsLink = this.navigation.getByRole('link', { name: 'Events' })
    }

    async goToAdminManageEvents() {
        await this.adminMenuTrigger.click()
        await this.manageEventsLink.click()
    }

    async goToEvents() {
        await this.eventsLink.click()
    }
}