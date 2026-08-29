import {Page,Locator} from '@playwright/test'
import {BasePage} from './BasePage'

export class LoginPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    
    constructor(page: Page){
        super(page)
        this.emailInput = page.getByRole('textbox',{name:'email'})
        this.passwordInput = page.getByRole('textbox',{name:'password'})
        this.signInButton = page.getByRole('button',{name:'Sign In'})
    }

    async loginAction(email: string, password: string){
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.signInButton.click()
    }
}