module.exports = {
  apps: [{
    name: "crud-application",
    script: "./dist/main.js",
    env: {
      NODE_ENV: "production",
      APP_PORT: 3000,
      POSTGRES_HOST: "{internal dns of database}",
      POSTGRES_PORT: 5432,
      POSTGRES_DATABASE: "app",
      POSTGRES_USERNAME: "app",
      POSTGRES_PASSWORD: "{password}"
    }
  }]
}
