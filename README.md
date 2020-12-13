<p align="center"><img src="https://github.com/TheStopsign/Venue/blob/master/src/assets/venue-logo.svg" alt="alt text" width="150" height="150"></p>

# Venue

## Gauging Engagement | www.venue-meetings.com

<em>Every second LMS fails, we get one step closer</em>

## Prerequisites

- Vue.js
- Node.js
- MongoDB

## Developing

Clone the repo

Run `npm install` in the project's /server director, and then in the root directory.

### Front-End

Run `npm run serve` 

### Back-End

1. In a separate shell navigate to the 'server' directory `cd server`
2. Start the mongodb daemon `mongod` (might need to run with root priveleges depending on installation or kill existing instances with `sudo killall mongod`)
3. In a separate shell navigate to the 'server' directory again
4. Start the node server `nodemon server`

## Compiles and minifies for production
```
npm run build
```

## Testing
`npm run test` will initiate CL testing using Cypress
`npm run test:ui` will launch Cypress's GUI based testing client

## Lints and fixes files
`npm run lint`
