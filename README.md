# Demo Application For Posting Article And Comments

## Description

Built using NestJs framework TypeScript starter repository. It uses MySQL as database

Application is designed as different modules which can easily be ported as individual backend application with minimum coding.
It has a common module which define database schemas and defines commonly used DTOs

## Tech Stack

**Server:** Node v16.13.1, npm 8.3.0 Express, NestJS, MYSQL

## Installation

Checkout the demo project from repo and Open a terminal inside the project .

**Note:**In order to run the project @nestjs/cli should be installed globally

```bash
  git clone https://github.com/jerryfabiantt/article-api.git
  cd article-api
  npm install -g @nestjs/cli
  npm i
```

## Running the project

Commands for running the project are given in Package.json file.

To run the project in development mode

```bash
 npm run start:dev
```

To run the project in Production mode

```bash
 npm run build
 npm run start:prod
```
