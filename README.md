# E2E Tests for Bistro Delivery

This repository contains end-to-end tests for [Bistro Delivery](https://github.com/hypersequent/bistro), implemented using [Cypress](https://www.cypress.io/).

Prerequisites: Node.js 20+ (with npm)

## Getting Started

1. Clone the repository:

   ```bash
   git clone git@github.com:Hypersequent/bistro-e2e-cypress.git
   cd bistro-e2e-cypress
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Running Tests

### Basic Test Execution

```bash
npm test                  # Run tests in Chrome
npm run test:open         # Open Cypress interactive mode
```

### Upload testing results to QA Sphere

[QA Sphere](https://qasphere.com/) is a modern test management platform that makes organizing test cases, tracking test runs, and analyzing results a breeze. Integration is done via [qas-cli](https://github.com/Hypersequent/qas-cli).

Test names include markers (e.g., `BD-023: Cart operations...`) that automatically link results to QA Sphere test cases.

1. Add your QA Sphere credentials to `.env` or `.qaspherecli` file:

   ```bash
   QAS_TOKEN=<QA Sphere API Token>
   # Get your token in QA Sphere -> Settings -> API Keys

   QAS_URL=<QA Sphere Company URL>
   # Example: https://qasdemo.eu2.qasphere.com
   ```

2. Upload results:

   ```bash
   npx qas-cli junit-upload cypress/reports/junit/results-*.xml
   ```

   Useful options:

   ```bash
   --create-tcases              # Auto-create missing test cases in QA Sphere
   --run-name "CI Run {DD}.{MM}"  # Custom run name (supports date placeholders)
   --attachments                # Include test attachments (screenshots, etc.)
   ```

## Additional Commands

Different browsers:

```bash
npm run chrome            # Run tests in Chrome
npm run firefox           # Run tests in Firefox
npm run edge              # Run tests in Edge
```

Code quality:

```bash
npm run lint              # Check formatting and linting
npm run format            # Auto-format code
```

## License

This project is licensed under the 0BSD License - see the [LICENSE](LICENSE) file for details.

---

Maintained by [Hypersequent](https://github.com/Hypersequent)
