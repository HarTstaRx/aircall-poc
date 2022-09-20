# Introduction
This is the result fo the technical challenge proposed to me for applying a job at Aircall
I started the challenge September 18 around 11:00 and ended it September 20 around 14:00.

## Requisites
### Technical Test - Phone Application
https://github.com/aircall/frontend-hiring-test

# Startup
The application is responsive and has been tested on Firefox and Chrome for Windows.
In order to start the application you need:

* An `.env` file with the following parameters, since this is a demo app and the params are public domain I'll leave mine below:

		REACT_APP_ENV="DEV"
		REACT_APP_API_HTTP="https://frontend-test-api.aircall.dev/graphql"
		REACT_APP_API_WS="wss://frontend-test-api.aircall.dev/websocket"

* Node 16.7.0 or higher.
* yarn installed.

In order to run the project, run `yarn` and `yarn start`. The project launches Chrome, but under the `scripts/start.js` you can change that behaviour.

# Other remarks
## Dependencies
In this point in time the material-ui library needs as a dependancy some `emotion` libraries due to some d.ts shenanigans. In the future check for an upgrade to the material library and see if those dependancies are removable.

## Design system
Initially I started using `@aircall/tractor` but due to lack of time, some shenanigans with the Typescript compiler, an issue with `Tractor` component, React 18.0 and an aparent lack of the property `children` inside `Tractor` component d.ts files I had to change the design system for material-ui.


# Feedback
I would love to receive some feedback about this project. If you have any questions, doubts or any issue feel free to reach me via email.
