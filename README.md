LEGACY. Active Development has moved to github.com/TheStopsign/venue-new

<p align="center"><img src="https://github.com/TheStopsign/Venue/blob/master/src/assets/venue-logo.svg" alt="alt text" width="150" height="150"></p>

# Venue

Gauging Engagement | www.venue-meetings.com

<em>Every second LMS fails, we get one step closer</em>

## Developing

### Prerequisites

#### Technologies

- Vue.js
- Node.js
- MongoDB

#### Additional setup steps
1. Clone the repository
2. Navigate into the repository's root directory
3. `npm install`

### Back-End

#### 1) Database
1. In a new shell, navigate to the /server directory
2. Start the mongodb daemon `mongod` (might need to run with root priveleges depending on installation or kill existing instances with `sudo killall mongod`)

#### 2) Server
1. In a new shell, navigate to the /server directory
2. Start the NodeJS server `nodemon server`

#### 3) Front-End
1. In a new shell, navigate to the / directory (project's root directory)
2. Start the frontend client `npm run serve`

## Compiles and minifies for production
<em>Note, this step is done automatically during live/production builds</em> `npm run build`

## Testing
- `npm run test` will initiate CL testing using Cypress
- `npm run test:ui` will launch Cypress's GUI based testing client
