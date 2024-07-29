# Movie Management System

## Table of contents

* [General Informations](#general-informations)
* [Installation](#installation)
* [How To Run It?](#how-to-run-it)
* [How To Test It?](#how-to-test-it)
* [Migrations](#migrations)

## General Informations:

`movie-management-system` is a backend application that provides an HTTP
REST API to manage movies. It is developed by using NestJS with TypeScript. Node 22
is used as the runtime environment.

## Installation

Run:

```bash
npm install
```

## How To Run It?

Run

```bash
npm run start:dev
```

### Environment Variables

You need to export environment variables to run the application.

The variables that you need to export are listed:

```
PORT='8000'
DB_HOST='localhost'
DB_USERNAME='username'
DB_PASSWORD='password'
DB_NAME='postgres'
DB_PORT='5432'
JWT_SECRET='supersecret'
```

## How To Test It?

**Please be sure that you exported test environment variables before running below commands.**

Firstly, you need a database to run tests. You can use docker-compose to create a test database.

```bash
docker-compose -f docker-compose.test.yml up -d
```

To create test database, you need to run migrations:

```bash
./node_modules/db-migrate/bin/db-migrate up
```

To run tests, run:

```bash
npm run test
```

To run e2e tests, run:

```bash
npm run test:e2e
```

If you want to see the test coverage, run:

```bash
npm run test:cov
```

## Migrations

You need to run migrations before running the application or testing.

**[db-migrate](https://www.npmjs.com/package/db-migrate) is used to manage migrations.**

```bash
./node_modules/db-migrate/bin/db-migrate up
```