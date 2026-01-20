import { CartResponseSchema, type CartResponse } from '../support/schemas'

export class Cart {
	openCart() {
		cy.get('div.my-cart-icon').click()
	}

	closeCart() {
		cy.get('#cart button[data-dismiss="modal"]').first().click()
	}

	checkout() {
		cy.get('#cart a[href$="/checkout"]').click()
		cy.url().should('include', '/checkout')
	}

	getCartItems(): Cypress.Chainable<CartResponse> {
		return cy.get('#cart div.row.border-bottom').then(($rows) => {
			const items = Array.from($rows).map((row) => {
				const name = row.querySelector('div:nth-child(2)')?.textContent || ''
				const amount = row.querySelector('div:nth-child(4)')?.textContent || ''
				return { name, amount }
			})

			return cy
				.get("#cart div[data-testid='cartTotal']")
				.invoke('text')
				.then((total) => {
					return CartResponseSchema.parse({
						items,
						total,
					})
				})
		})
	}

	removeCartItem(idx: number) {
		cy.get('#cart div.row.border-bottom').eq(idx).find('button').click()
	}
}
