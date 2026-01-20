import { defineConfig } from 'cypress'
import 'dotenv/config'

// Set default DEMO_BASE_URL if not provided
if (typeof process.env.DEMO_BASE_URL === 'undefined') {
	process.env.DEMO_BASE_URL = 'https://hypersequent.github.io/bistro/'
}

// Ensure DEMO_BASE_URL does NOT have a trailing slash
process.env.DEMO_BASE_URL = process.env.DEMO_BASE_URL.replace(/\/+$/, '')

export default defineConfig({
	e2e: {
		baseUrl: process.env.DEMO_BASE_URL,
		specPattern: 'cypress/e2e/**/*.cy.ts',
		supportFile: 'cypress/support/e2e.ts',

		// Timeouts
		defaultCommandTimeout: 5000,
		pageLoadTimeout: 30000,

		// Retry on CI only
		retries: {
			runMode: process.env.CI ? 1 : 0,
			openMode: 0,
		},

		// Screenshots and videos
		screenshotOnRunFailure: true,
		video: true,
		videosFolder: 'cypress/videos',
		screenshotsFolder: 'cypress/screenshots',

		// Reporter configuration
		reporter: 'cypress-multi-reporters',
		reporterOptions: {
			configFile: 'reporter-config.json',
		},

		setupNodeEvents(on, config) {
			// implement node event listeners here
			return config
		},
	},
})
