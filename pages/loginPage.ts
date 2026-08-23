import {Page,Locator} from '@playwright/test'

export class LoginPage{
    page: Page;
    emailInput: Locator;
    passwordInput: Locator;
    signInButton: Locator;
    
    constructor(page: Page){
        this.page = page;
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