Here’s a `README.md` for your Playwright-based project. This file covers installation, setup, environment configuration, and test execution.

---

# DROPIT Test Automation Project

This project provides automated testing for an myshopify application using Playwright. The project uses the Page Object Model (POM) to structure test code for maintainability and scalability. You can configure test environments using environment variables to test against different setups, such as test or production environments.

## Table of Contents

- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Test Execution](#test-execution)
- [Project Structure](#project-structure)
- [Test Structure and Flow](#test-structure-and-flow)

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed, then follow these steps to set up the project:

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

## Environment Configuration

The project uses [dotenv](https://www.npmjs.com/package/dotenv) to manage environment variables, allowing the test environment to be set up dynamically.

1. Create a `.env` file in the root directory, and define the environment and authentication information:

   ```env
   TESTING_ENV=test # or 'prod'
   CORRECT_PASSWORD=giclao
   ```

2. Based on `TESTING_ENV`, different configuration files will be loaded. The project has separate configuration files for each environment:

   - `config.test.ts` - Test environment configuration.
   - `config.prod.ts` - Production environment configuration.

   For example, the `config.test.ts` file contains the following:

   ```typescript
   export const config = {
     baseURL: 'https://drpt-external-dev.myshopify.com',
   }
   ```

   Modify these files as needed to match your environments.

## Test Execution

Playwright tests can be executed by setting the appropriate environment and running the following command:

```bash
npx playwright test
```

To run specific test tags, such as `@sanity`, use:

```bash
npx playwright test --grep @sanity
```

### Additional Playwright Options

- To generate HTML reports: `npx playwright show-report`
- To run tests in headed mode (with browser UI): `npx playwright test --headed`
- To select specific test files or functions, specify their paths:

  ```bash
  npx playwright test tests/order-flow.spec.ts
  ```

## Project Structure

This project is organized with the Page Object Model (POM) for modularity and readability.

```
├── page-objects       # Page Object files for different sections of the application
├── test-data          # JSON files containing test data for customers, products, etc.
├── helpers            # Helper functions for data manipulation and utilities
├── tests              # Test files organized by feature or flow
├── config.test.ts     # Test environment configuration
├── config.prod.ts     # Production environment configuration
└── README.md          # Project documentation
```

### Key Files

- **Page Objects**: Define and manage elements and actions for each page (e.g., `LoginPage`, `CartPage`, etc.).
- **Helpers**: Contain utility functions for processing data like formatting phone numbers or masking card numbers.
- **Test Data**: JSON files store test data to avoid hardcoding within tests.

## Test Structure and Flow

### Example Test Suite: Order Flow

The `Order Flow` test suite simulates a complete purchase, from login to order confirmation. 

1. The `beforeEach` block initializes Page Objects for each part of the application.
2. The `general order flow` test covers adding products, viewing the cart, and completing the checkout.
3. Validations are performed after each action to verify the expected outcomes.

### Example Test Cases

- **general order flow**: Completes a purchase, verifies the cart, and checks the thank-you page for confirmation and customer details.
- **incorrect email and card number**: Tests error handling for invalid login and card information during checkout.

---

