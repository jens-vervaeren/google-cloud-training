module.exports = {
  apps: [{
    name: "crud-application",
    script: "./dist/main.js",
    env: {
      NODE_ENV: "production",
      APP_PORT: 3000,
      POSTGRES_HOST: "{ip of cloud sql instance}",
      POSTGRES_PORT: 5432,
      POSTGRES_DATABASE: "database",
      POSTGRES_USERNAME: "app",
      POSTGRES_PASSWORD: "{password}"
    }
  }]
}
