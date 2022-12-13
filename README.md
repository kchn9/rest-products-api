# REST Products API /w JWT Auth

REST api implementation created in express. Product resource routes are protected by a JWT authorization requirement. The JWT is implemented with a "refresh token" to allow the user to get a new access token without forcing a login every time the access token expires.

## Appendix

File [postman_collection.json](./postman_collection.json) includes whole required configuration to test app manually with Postman.

## Tech stack:

#### Applicaiton framework

express: **_4.18.2_**

#### Typing:

typescript: **_4.9.4_**

#### Password hashing

bcrypt: **_5.1.0_**

#### Authorization

jsonwebtoken: **_8.5.1_**

#### Database and validation

mongoose: **_6.8.0_**
zod: **_3.19.1_**

#### Logging

pino: **_8.7.0_**
pino-http: **_8.2.1_**

#### Configuration

config: **_3.3.8_**
dotenv: **_16.0.3_**

#### Deployment

flyctl

## API Reference

### Users

#### Create a user / register

```http
  POST /api/users
```

| Request body           | Type     | Description                         |
| :--------------------- | :------- | :---------------------------------- |
| `username`             | `string` | **Required**. User's username       |
| `password`             | `string` | **Required**. User's password       |
| `passwordConfirmation` | `string` | **Required**. User's password again |
| `email`                | `string` | **Required**. User's email          |

#### Get all users

```http
  GET /api/users
```

### Sessions

#### Create a session / sing in

```http
  POST /api/sessions
```

| Request body | Type     | Description                   |
| :----------- | :------- | :---------------------------- |
| `username`   | `string` | **Required**. User's username |
| `password`   | `string` | **Required**. User's password |

#### Get all valid (signed in) sessions of current user

```http
  GET /api/sessions
```

#### Invalidate current session, logout

```http
  DELETE /api/sessions
```

### Products

#### Get all products

```http
  GET /api/products
```

#### Get specific product

```http
  GET /api/products/${id}
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Product's identifier |

#### Create a product

```http
  POST /api/products
```

| Request body | Type     | Description                                                    |
| :----------- | :------- | :------------------------------------------------------------- |
| `name`       | `string` | **Required**. Product's name                                   |
| `quantity`   | `number` | **Required**. Product's quantity                               |
| `price`      | `number` | **Required**. Price of 1 product                               |
| `decription` | `string` | **Required**. **Minimum length: 120chars** Product description |
| `image`      | `string` | **Required**. URI to image of product                          |

#### Update a product

```http
  POST /api/products/${id}
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Product's identifier |

| Request body                                  | Type  | Description   |
| :-------------------------------------------- | :---- | :------------ |
| any product field from create product request | `any` | **Optional**. |

#### Remove specific product

```http
  DELETE /api/products/${id}
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Product's identifier |

## Installation

Clone repository with git and then install it with yarn or npm:

```bash
  git clone https://github.com/kchn9/rest-users-products-api
  cd rest-users-products-api
  yarn install
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

-   [@kchn9](https://www.github.com/kchn9)
