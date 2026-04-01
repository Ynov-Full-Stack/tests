const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl || "http://localhost:3000/tests",
    setupNodeEvents(on, config) {
        return config;
    },
  },
});
