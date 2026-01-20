import { CartResponseSchema, type CartResponse } from '../support/schemas'

export const paymentMethods = ['Cash on Delivery', 'Card Payment on Delivery']

export class Checkout {
	getOrderItems(): Cypress.Chainable<CartResponse> {
		cy.url().should('include', '/checkout')
		// Wait for the order table to be visible
		cy.get('table > tbody > tr').should('have.length.greaterThan', 1)

		return cy.get('table > tbody > tr').then(($rows) => {
			const rows = Array.from($rows)
			const itemRows = rows.slice(0, rows.length - 1)

			const items = itemRows.map((row) => {
				const name = row.querySelector('td:nth-child(2)')?.textContent || ''
				const amount = row.querySelector('td:nth-child(4)')?.textContent || ''
				return { name, amount }
			})

			return cy
				.get('table.table > tbody > tr:last-of-type td:nth-child(4)')
				.invoke('text')
				.then((total) => {
					return CartResponseSchema.parse({
						items,
						total,
					})
				})
		})
	}

	fillName(name: string) {
		cy.get('#customerName').type(name)
	}

	fillEmail(email: string) {
		cy.get('#customerAddress').type(email)
	}

	getPaymentMethodOptions(): Cypress.Chainable<string[]> {
		return cy.get('#paymentMethod option').then(($opts) => {
			return Array.from($opts).map((opt) => opt.textContent || '')
		})
	}

	selectPaymentMethod(label: string) {
		cy.get('#paymentMethod').select(label)
	}

	placeOrder() {
		cy.get('form button[type="submit"]').click()
	}
}
