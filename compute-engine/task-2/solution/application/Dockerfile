# Stage 1: Build distributable
FROM node:16-alpine AS distributable-build-stage
WORKDIR /installation
COPY package*.json ./
RUN npm install
COPY tsconfig.build.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY ./src ./src
RUN npm run build

# Stage 2: Copy distributable and install only production modules
# We copy our distributable, production node modules
# We expose port 80 and supply an env variable to use for our application
FROM node:16-alpine AS serving-stage
COPY --from=distributable-build-stage ./installation/dist ./dist
COPY package*.json ./
RUN npm ci --production
ENV APP_PORT=80
ENTRYPOINT ["node", "dist/main"]
EXPOSE 80