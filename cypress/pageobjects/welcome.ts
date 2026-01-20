export interface NavbarItem {
	text: string
	isActive: boolean
}

export class Welcome {
	goto() {
		cy.visit('/')
		// Wait for Welcome nav item to become active
		cy.get('nav ul > li.active').should('contain', 'Welcome')
	}

	getHeading(): Cypress.Chainable<string> {
		return cy
			.get('h1')
			.invoke('text')
			.then((text) => text.trim())
	}

	getBody(): Cypress.Chainable<string> {
		return cy
			.get('div.hero1 p')
			.invoke('text')
			.then((text) => text.trim())
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

	getGotoMenuButton(): Cypress.Chainable<string> {
		return cy
			.get('a[href="#menu"]')
			.invoke('text')
			.then((text) => text.trim())
	}
}
