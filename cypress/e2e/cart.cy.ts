import { Menu } from '../pageobjects/menu'
import { Cart } from '../pageobjects/cart'
import { Checkout, paymentMethods } from '../pageobjects/checkout'
import { UserData } from '../utils/userData'
import type { PizzaMenu, OtherMenu } from '../support/schemas'

describe('Cart Tests', () => {
	const menu = new Menu()
	const cart = new Cart()
	const checkout = new Checkout()
	const userData = new UserData()

	const addToCart = () => {
		menu.addMenuItemToCart(0)
		menu.addMenuItemToCart(1)
		menu.addMenuItemToCart(1)

		menu.switchTab('drinks')
		menu.addMenuItemToCart(0)
		menu.addMenuItemToCart(1)

		menu.switchTab('desserts')
		menu.addMenuItemToCart(0)
	}

	it('BD-023: User should see product list according the cart on the Checkout page', () => {
		menu.goto()
		addToCart()

		let pizzaMenu: PizzaMenu
		let drinksMenu: OtherMenu
		let dessertsMenu: OtherMenu

		menu.getPizzaMenu().then((pizza) => {
			pizzaMenu = pizza
		})

		menu.getOtherMenu('drinks').then((drinks) => {
			drinksMenu = drinks
		})

		menu.getOtherMenu('desserts').then((desserts) => {
			dessertsMenu = desserts
		})

		cy.then(() => {
			const expectedCartResponse = {
				items: [
					{ name: pizzaMenu[0].name, amount: pizzaMenu[0].price },
					{ name: pizzaMenu[1].name, amount: pizzaMenu[1].price * 2 },
					{ name: drinksMenu[0].name, amount: drinksMenu[0].price },
					{ name: drinksMenu[1].name, amount: drinksMenu[1].price },
					{ name: dessertsMenu[0].name, amount: dessertsMenu[0].price },
				],
				total:
					pizzaMenu[0].price +
					pizzaMenu[1].price * 2 +
					drinksMenu[0].price +
					drinksMenu[1].price +
					dessertsMenu[0].price,
			}

			cart.openCart()
			cart.getCartItems().should('deep.equal', expectedCartResponse)

			// Remove items from cart and check response
			cart.removeCartItem(1)
			cart.removeCartItem(0)

			const expectedAfterRemove = {
				items: [
					{ name: drinksMenu[0].name, amount: drinksMenu[0].price },
					{ name: drinksMenu[1].name, amount: drinksMenu[1].price },
					{ name: dessertsMenu[0].name, amount: dessertsMenu[0].price },
				],
				total: drinksMenu[0].price + drinksMenu[1].price + dessertsMenu[0].price,
			}

			cart.getCartItems().should('deep.equal', expectedAfterRemove)

			// Add back items to cart again
			cart.closeCart()
			menu.switchTab('pizza')
			menu.addMenuItemToCart(1)
			menu.addMenuItemToCart(1)

			cart.openCart()
			const expectedAfterAddBack = {
				items: [
					{ name: drinksMenu[0].name, amount: drinksMenu[0].price },
					{ name: drinksMenu[1].name, amount: drinksMenu[1].price },
					{ name: dessertsMenu[0].name, amount: dessertsMenu[0].price },
					{ name: pizzaMenu[1].name, amount: pizzaMenu[1].price * 2 },
				],
				total:
					drinksMenu[0].price +
					drinksMenu[1].price +
					dessertsMenu[0].price +
					pizzaMenu[1].price * 2,
			}

			cart.getCartItems().should('deep.equal', expectedAfterAddBack)
		})
	})

	it('BD-022: User should place the order successfully after entering valid data in all required fields and selecting the "Cash" payment', () => {
		menu.goto()
		addToCart()

		let pizzaMenu: PizzaMenu
		let drinksMenu: OtherMenu
		let dessertsMenu: OtherMenu

		menu.getPizzaMenu().then((pizza) => {
			pizzaMenu = pizza
		})

		menu.getOtherMenu('drinks').then((drinks) => {
			drinksMenu = drinks
		})

		menu.getOtherMenu('desserts').then((desserts) => {
			dessertsMenu = desserts
		})

		cy.then(() => {
			const expectedItemsResponse = {
				items: [
					{ name: pizzaMenu[0].name, amount: pizzaMenu[0].price },
					{ name: pizzaMenu[1].name, amount: pizzaMenu[1].price * 2 },
					{ name: drinksMenu[0].name, amount: drinksMenu[0].price },
					{ name: drinksMenu[1].name, amount: drinksMenu[1].price },
					{ name: dessertsMenu[0].name, amount: dessertsMenu[0].price },
				],
				total:
					pizzaMenu[0].price +
					pizzaMenu[1].price * 2 +
					drinksMenu[0].price +
					drinksMenu[1].price +
					dessertsMenu[0].price,
			}

			cart.openCart()
			// Wait for checkout button to be visible before clicking
			cy.get('#cart a[href$="/checkout"]').should('be.visible')
			cart.checkout()

			checkout.getOrderItems().should('deep.equal', expectedItemsResponse)

			checkout.fillName(userData.getName())
			checkout.fillEmail(userData.getAddress())

			checkout.getPaymentMethodOptions().should('deep.equal', paymentMethods)
			checkout.selectPaymentMethod('Cash on Delivery')

			checkout.placeOrder()
		})
	})
})
