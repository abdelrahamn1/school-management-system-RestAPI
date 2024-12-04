[![npm version](https://badge.fury.io/js/your-package-name.svg)](https://badge.fury.io/js/your-package-name)
[![JavaScript](https://img.shields.io/badge/javascript-ES6-green)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-eslint-4B32C3.svg)](https://eslint.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Postman Collection](https://img.shields.io/badge/Postman-Collection-blue)](https://www.postman.com/your-collection-link)


# Full School Management System REST API
> A RESTful API for a comprehensive School Management System. This API offers various controls for admins, teachers, students, and parents to manage users, track assignments, handle grades, and more.


## How It Works

1. **Admin Controller**: Provides CRUD operations for users, event reports, fee management, and more.
2. **Student Functionality**: Students can add, update, delete, and view their own account information, view assignments, exams, and submit work.
3. **Teacher Functionality**: Teachers can manage their accounts, input student data (attendance, grades, exams), and track student progress.
4. **Parent Functionality**: Parents can view their children's performance, track progress, and communicate with teachers.
5. **Authentication & Authorization**: Secure login and JWT token handling for authentication.
6. **Password Reset**: Users can request a password reset via email, with token-based authentication and a user-friendly flow.


## Prerequisites
 This project requires NodeJS (version 18 or later) , EXPRESS (Version 4 or latter), NPM (Version 5 or later)  , MOngoDB (Version 5 or later) ,  MOngoose (Version 8 or later)
 , [Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.


 To make sure you have them available on your machine,
try running the following command.


```sh
$ npm -v && node -v
10.9.0
v22.11.0
```
``

### .env file requirements
you must provide the following environment variables to run the application
```sh
DATABASE = <your-mongo-db-uri>    # MongoDB Atlas URI
DATABASE_PASSWORD = <your-db-password>  # MongoDB Atlas password
PORT = <your-port>    # Port number (e.g., 5000)
JWT_SECRET_KEY = <your-jwt-secret>    # Secret key for JWT
JWT_EXPIRES = <token-expiration-time>  # JWT expiration (e.g., '1d')
EMAIL = <your-email-address>    # Sender email for NodeMailer
EMAIL_USER = <your-email-username>  # NodeMailer username
EMAIL_PASS = <your-email-password>  # NodeMailer password


```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone [https://github.com/abdelrahamn1/school-management-system-RestAPI.git]
```

To install and set up the library, run:

```sh
$ npm install
```

Or if you prefer using Yarn:

```sh
$ yarn add
```

## Usage

### Serving the app

#### for production
```sh
$ npm run start:prod
```

#### for developer
```sh
$npm run start:dev
```

or if it dose't work : 

```sh
$ node server.js
```

Or if you prefer using Yarn:

```sh
$ yarn start
```


## Built With
* Node.js 
* EXPRESS
* MongoDB
* nodmailer
* Post Man


* ## Authors

* **abdelrahman1** - *Initial work* - [abdelrahman1](https://github.com/abdelrahman1)
