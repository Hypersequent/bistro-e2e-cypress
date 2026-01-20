import { Welcome } from '../pageobjects/welcome'
import { About } from '../pageobjects/about'
import { Menu } from '../pageobjects/menu'

describe('Contents Tests', () => {
	const welcome = new Welcome()
	const about = new About()
	const menu = new Menu()

	it('BD-055: User should see the content according to the About Us information', () => {
		about.goto()

		about.getHeading().should('equal', 'Welcome to Bistro Delivery')
		about
			.getBody()
			.should(
				'contain',
				"So, while you won't actually be able to order your favorite quiche or ratatouille from us," +
					' you can certainly rely on QA Sphere to deliver the tools and systems you need to ensure your software projects' +
					' are a recipe for success. Bon appétit and happy testing!'
			)
	})

	it('BD-026: Correct display of blocks and buttons in the navbar', () => {
		welcome.goto()
		welcome.getNavbarItems().should('deep.equal', [
			{ text: 'Welcome', isActive: true },
			{ text: "Today's Menu", isActive: false },
			{ text: 'About us', isActive: false },
		])

		menu.goto()
		menu.getNavbarItems().should('deep.equal', [
			{ text: 'Welcome', isActive: false },
			{ text: "Today's Menu", isActive: true },
			{ text: 'About us', isActive: false },
		])

		about.goto()
		about.getNavbarItems().should('deep.equal', [
			{ text: 'Welcome', isActive: false },
			{ text: "Today's Menu", isActive: false },
			{ text: 'About us', isActive: true },
		])
	})

	it("BD-038: User should see the Pizzas list by default on the Today's Menu block", () => {
		menu.goto()

		menu.getPizzaMenu().should('have.length.greaterThan', 0)
		menu.getTabs().should('deep.equal', [
			{ text: 'PIZZAS', isActive: true },
			{ text: 'DRINKS', isActive: false },
			{ text: 'DESSERTS', isActive: false },
		])

		menu.getOtherMenu('drinks').should('have.length.greaterThan', 0)
		menu.getTabs().should('deep.equal', [
			{ text: 'PIZZAS', isActive: false },
			{ text: 'DRINKS', isActive: true },
			{ text: 'DESSERTS', isActive: false },
		])

		menu.getOtherMenu('desserts').should('have.length.greaterThan', 0)
		menu.getTabs().should('deep.equal', [
			{ text: 'PIZZAS', isActive: false },
			{ text: 'DRINKS', isActive: false },
			{ text: 'DESSERTS', isActive: true },
		])
	})

	it("BD-052: User should see the Today's Menu block after clicking the Today's Menu button in the Welcome banner", () => {
		welcome.goto()

		welcome.getHeading().should('equal', 'Bistro Delivery')
		welcome
			.getBody()
			.should('equal', 'Elegance of French&Italian Cuisine Delivered Directly to Your Doorstep!')

		welcome.getGotoMenuButton().should('equal', "View Today's Menu")
	})
})
