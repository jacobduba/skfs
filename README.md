SKFS is a web 2.0 application where users can sign up/sign
in to create, like, and comment on posts.

![Screenshot 2021-12-29 at 20-11-01 Screenshot](https://user-images.githubusercontent.com/11655457/147716369-ac51a1c3-0696-43a3-8d0e-dc983c41a688.png)

 - Designed with a robust client-server [REST API](https://github.com/mooshoe/skfs/blob/master/documentation.md).
 - Back end uses Express.js with SQLite.
 - Front end developed in React.

# Install
The first step is to make sure you are using node v10.24.1.
**SKFS IS NOT COMPATABLE** with newer LTS versions. I highly
recomend [installing nvm if you haven't already](https://github.com/nvm-sh/nvm)
.

Setting up the backend.

```
npm install
npm run build-css
npm run env # After running this command, it's advied to edit .env
mkdir .data/
npm run production
```

To build the front end client.

```
cd client
npm install
npm run build
```

# Developing
After setting up a production instance, you can begin developing.

Backend: These commands will automatically redeploy
skfs every time you make an edit.

```
npm run watch-css
npm run dev
```

Frontend: I bootstraped the client with create-react-app. Thus 
simply:
```
npm start
```
