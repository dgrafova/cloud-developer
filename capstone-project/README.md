# Functionality of the application

This application allows to creating/removing/updating/fetching Recipe items. Each Recipe item can optionally have an attachment image. Each user only has access to Recipe items that he/she has created.
The code is based on the Project 4 "Serverless App" from Udacity Coud Developer Nanodegree.

# Recipe items

The application stores Recipe items, each Recipe item contains the following fields:

* `recipeId` (string) - a unique id for an item
* `userId` (string) - an id of a user who created a recipe item
* `name` (string) - name of a recipe
* `description` (string) - a recipe description
* `favourite` (boolean) - true if a recipe must be added to favourites, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a recipe item

# Frontend

The `client` folder contains a web application that uses the API.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Recipe application.