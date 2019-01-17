### The basic e2e test project which based on Cypress and TypeScript
##### Requirements:

- Preinstalled nodejs : [more details here](https://nodejs.org/en/download/package-manager)
- Preinstalled npm : [more details here](https://www.npmjs.com/get-npm)
- Preinstalled Cypress. [More instructions for installing here:](https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements)

* Before launching tests - get all dependencies with: `npm install --save-dev command` prepare a workspase for Theia. Create predefined folder (for instanse /tmp/e2e)
* Set up env. variables for the test in `cypress.json file` (or use predifined settings)

##### Launching tests with  Cypress IDE
* Run Theia locally on default port 3000
* Open Cypress from the current project  (we can use command like: `./node_modules/.bin/cypress open` or another way more details [here:](https://docs.cypress.io/guides/getting-started/installing-cypress.html#Opening-Cypress)
click on spec.ts file. We can watch the test with Cypress runner  

##### Launching tests in headless mode  
* Launch command from current project like: `/node_modules/.bin/cypress run` and wait test execution. We can watch video recording of the tests here: cypress/videos/spec.ts.mp4

##### Launching tests in view mode
* Launch command from current project like: `/node_modules/.bin/cypress run --headed`
More details about run [here:](https://docs.cypress.io/guides/guides/command-line.html#cypress-run) 

