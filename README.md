# Vending Machine API
REST API for a vending machine


![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-white?style=for-the-badge&logo=mongodb&logoColor=4EA94B)

### How to run

###### First, please make sure you have [Node.js](https://nodejs.org/en/download/) installed.

1. navigate to the project folder
```
cd vending-machine
```
2. install npm dependencies
```
npm i
```
3. start it!
```
npm start
```

### Documentaion
You can find the api documentation at [Postman](https://documenter.getpostman.com/view/11148012/UVRHh3F3)

### Important notes
- config.env file in project's root directory is used to store the configuration "env. variables" 
- In config.env, you can change NODE_ENV from development to production and vice versa
    - development: error details and stack is returned, also logs are logged to the console
    - production: production error version is returned, logs are logged to logs files 
- The api default url is localhost:8000/api/v1
    - Can be changed from config.env
- This is a simple project aims to learn and practice, In real production application .env and .pem files shouldn't be added to the repo.
- the command `node utils/generatePublicAndPrivateKeys.js` is used to generate '.pem' files in the jwt-keys folder under '/config'
