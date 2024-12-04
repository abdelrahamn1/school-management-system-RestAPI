[![npm version](https://badge.fury.io/js/your-package-name.svg)](https://badge.fury.io/js/your-package-name)
[![JavaScript](https://img.shields.io/badge/javascript-ES6-green)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-eslint-4B32C3.svg)](https://eslint.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Postman Collection](https://img.shields.io/badge/Postman-Collection-blue)](https://www.postman.com/your-collection-link)


# Full School Mnagemnt System RestAPI 
> This is a restApI for Scholl managent System , provide wise controll that manger need!

## How it Works
 * admin controller to manipulate diffrent operations for users (add, update, delete, get) , and minpulate some reports and events or fees.
 * student can (add ,get, update , delete ) there own accounts too , and complete there information , know about assignmnets and sumbit it, or know about exams and submit exams , with best handel for all scenarios.
 * teachers cand(add, get,update, delete) there own accounts too , manipulte student information , like assign attendences , grads , and exams .
 * parents can (add,get,update,delete) there own accounts , track the performance for his childerns , and contact with teahchers.
 * login , signUp authentication  , with handel different errors , and more authentications
 * forget and reset password , using nodeMailer


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
DATABASE = ...    //  Atlas MongoDb
DATABASE_PASSWORD = .....   // Atlas MongoDb
PORT = ......
JWT_SECRET_KEY = ......
JWT_EXPIRES = ......
EMAIL = .......   
EMAIL_USER = .......   //  nodeMailer
EMAIL_PASS = ........   //  nodeMailer


```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone [https://github.com/abdelrahamn1/school-management-system-RestAPI]
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
