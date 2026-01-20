import {
	PizzaMenuSchema,
	OtherMenuSchema,
	type PizzaMenu,
	type OtherMenu,
} from '../support/schemas'
import type { NavbarItem } from './welcome'

export type Tab = 'pizza' | 'drinks' | 'desserts'

export interface TabItem {
	text: string
	isActive: boolean
}

export class Menu {
	goto() {
		cy.visit('/')
		// Click on Today's Menu link in navbar to navigate and set active state
		cy.get('nav ul > li').contains("Today's Menu").click()
		cy.get('nav ul > li.active').should('contain', "Today's Menu")
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

	getTabs(): Cypress.Chainable<TabItem[]> {
		return cy.get('div.buttons-container a').then(($tabs) => {
			const tabs: TabItem[] = []
			$tabs.each((_, tab) => {
				const text = tab.innerText.trim()
				// Check for both possible active class names
				const isActive =
					tab.classList.contains('is-active') || tab.classList.contains('button--is-active')
				tabs.push({ text, isActive })
			})
			return tabs
		})
	}

	switchTab(tab: Tab) {
		cy.get(`a[data-target='${tab}Menu']`).click()
		// Wait for tab content to become visible
		cy.get(`div#${tab}Menu`).should('have.class', 'menu--is-visible')
	}

	getPizzaMenu(): Cypress.Chainable<PizzaMenu> {
		this.switchTab('pizza')
		return cy.get('section#menu > div > div.menu--is-visible > div.row').then(($items) => {
			const items = Array.from($items).map((item) => {
				const name = item.querySelector('h3.item__title')?.textContent || ''
				const price = item.querySelector('span.item__price')?.textContent || ''
				const description = item.querySelector('p.item__description')?.textContent || ''
				const image = item.querySelector('img')?.getAttribute('src') || ''

				return { name, image, description, price }
			})
			return PizzaMenuSchema.parse(items)
		})
	}

	getOtherMenu(item: 'drinks' | 'desserts'): Cypress.Chainable<OtherMenu> {
		this.switchTab(item)
		return cy.get('section#menu > div > div.menu--is-visible > div.row').then(($items) => {
			const items = Array.from($items).map((el) => {
				const name = el.querySelector('h3.item__title')?.textContent || ''
				const price = el.querySelector('span.item__price')?.textContent || ''
				const description = el.querySelector('p.item__description')?.textContent || ''

				return { name, description, price }
			})
			return OtherMenuSchema.parse(items)
		})
	}

	addMenuItemToCart(idx: number) {
		cy.get(
			`section#menu > div > div.menu--is-visible > div.row:nth-of-type(${idx + 1}) button`
		).click()
	}
}
