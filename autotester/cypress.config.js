const { defineConfig } = require("cypress");
const cs = require("cypress-json-results")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      //implement node event listeners here
      require("cypress-json-results")({
        on,
        filename:'results.json'
      })
    },
  },
});
