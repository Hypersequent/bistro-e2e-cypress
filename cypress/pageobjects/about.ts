import type { NavbarItem } from './welcome'

export class About {
	goto() {
		cy.visit('/about')
		// Wait for About us nav item to become active
		cy.get('nav ul > li.active').should('contain', 'About us')
	}

	getHeading(): Cypress.Chainable<string> {
		return cy
			.get('h1')
			.invoke('text')
			.then((text) => text.trim())
	}

	getBody(): Cypress.Chainable<string> {
		return cy
			.get('article')
			.invoke('text')
			.then((text) => text.replace(/\s+/g, ' ').trim())
	}

	getNavbarItems(): Cypress.Chainable<NavbarItem[]> {
		return cy
			.get('nav ul > li')
			.should('have.length', 3)
			.then(($items) => {
				const navbarItems: NavbarItem[] = []
				$items.each((_, item) => {
					const text = item.innerText.trim()
					const isActive = item.classList.contains('active')
					navbarItems.push({ text, isActive })
				})
				return navbarItems
			})
	}
}
