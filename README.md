# Discord Bot Setup Guide

This guide will help you set up your Discord bot. Follow these steps to get your bot running smoothly.

## Installation
  1. [Fork](https://github.com/MBA2022/SysBot/fork) & clone the repository
```ssh
git clone https://github.com/MBA2022/S-Bot
```
  2. Make sure your `node.js` & `npm` are up to date
  3. Run ```npm install``` to install all dependencies
4. Update Start Script in `package.json`
replace the start script with nodemon for automatic updates when you make changes to the code:
```js
"scripts": {
  "start": "nodemon index.js"
}
```
5. Update the developer IDs in the index file with your own IDs.
```js
const developers = ['DeveloperID_1', 'DeveloperID_2'];
```
## Environment Variables

6. Create a `.env` file then add the Variables as shown:
```js
TOKEN = BOT_TOKEN
CLIENTID = APP _ID
GUILDID = DEVELOPMENT_SERVER
BOT_DM_WEBHOOK_URL = WEBHOOk_URL 

```
## Deployment

To deploy this project you have to add the bot to your discord server then run:

```bash
  npm start
```

then if you want to edit the code you don't have to restart the bot manually
