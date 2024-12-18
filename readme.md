# Bangkit Capstone project C242-PR637

## Overview

This project is an API service built using Node.js, Hapi.js. It provides user authentication, image upload functionality, and integrates with Google Cloud Firestore and Google Cloud Storage.

## Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/Farma27/EcoFlow-API.git
    cd EcoFlow-API
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    JWT_SECRET_KEY=your_jwt_secret_key
    BUCKET_NAME=your_google_cloud_storage_bucket_name
    ```

4. Generate a secret key:
    ```sh
    npm run generate-key
    ```

## Running the Server

To start the server in development mode:
```sh
npm start
```

To start the server in production mode:
```sh
npm run start-prod
```

The server will run on ```http://localhost:8000```.

## API Endpoints 

### User

- Register
  - ```POST /register```
  - Request Body: 
    ```
    { 
      "username": "testuser",
      "password": "testpassword"
     }
    ```
- Login
  - ```POST /login```
  - Request Body: 
    ```
    { 
      "username": "testuser",
      "password": "testpassword"
     }
    ```
- Logout
  - ```POST /logout```
  - Headers: ```Authorization: Bearer <token>```
- Get All Users
  - ```GET /users/all```
  - Headers: ```Authorization: Bearer <token>```
- Get User by ID
  - ```GET /user/{id}```
  - Header: ```Authorization: Bearer <token>```
- Update User
  - ```PUT /user/edit/{id}```
  - Header: ```Authorization: Bearer <token>```
  - Request Body: 
  ```
  { 
    "username": "updatedusername",
    "password": "updatedpassword"
  }
  ```
- Delete User
  - ```DELETE /user/delete/{id}```
  - Headers: ```Authorization: Bearer <token>```

### Upload

- Upload Image
  - ```POST /upload```
  - Headers: ```Authorization: Bearer <token>```
  - Form Data: ```image: <file>```

### Artikel

- Create
  - ```POST /article/create```
  - Headers: ```Authorization: Bearer <token>```
  - Request Body: 
  ```
  {
    "title": "Article Title",
    "content": "Lorem Ipsum",
  }
  ```
- Edit 
  - ```PUT /article/edit/{id}```
  - Headers: ```Authorization: Bearer <token>```
  - Request Body: 
  ```
  {
    "title": "Updated Title",
    content: "Lorem Ipsum",
  }
- Get All Article
  - ```GET /articles/all```
- Get Article By Id
  - ```GET /article/{id}```
- Delete
  - ```DELETE /article/delete/{id}```
  - Headers: ```Authorization: Bearer <token>```

## Rate Limit

Each user is limited to 200 requests per hour. If the limit is exceeded, the server will respond with a 429 Too Many Requests status code.

## Testing

You can use the provided Postman collection to test the API endpoints. Follow these steps:

1. Open Postman.
2. Click on `Import` in the top left corner.
3. Select the `EcoFlow API Environment.postman_environment.json` file from the test directory.
4. Click on `Import` again and select the `EcoFlow API.postman_collection.json` file from the test directory.
5. Select the imported environment from the environment dropdown in the top right corner.
6. Click the Settings button then search for Location.
7. Click Choose to choose the location of your image.
8. Change the url and port in environment.
8. Use the provided requests in the collection to test the API endpoints.

## License

This project is licensed under the ISC License.