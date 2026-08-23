import { TEST_DATA } from "../data/testData";
import {test, expect} from '../fixtures/pageFixtures';

test('authenticateuser',async({page,loginPage,homePage}) => {
    await page.goto(process.env.baseurl! + '/login')
    await loginPage.loginAction(TEST_DATA.loginCredentials.username,TEST_DATA.loginCredentials.password)
    await expect(homePage.browseEventsLink).toBeVisible()
    await page.context().storageState({path:'auth.user.json'})
})