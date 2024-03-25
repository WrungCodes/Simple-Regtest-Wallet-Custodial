# Simple Custodial App

This simple wallet custodial app allows users to connect their banks and
use their fiat to purchase crypto(BTC) on the regtest network.

The deployed web app can be accessed [Here](http://137.184.246.58)

## Technologies Used

Nodejs, Express, Sqlite, Bitcoin Regtest, React, Redux, Digital Ocean, Ubuntu, Nginx, Docker

### Set Up Locally

- First, we need to install SQLite, a good post [here](https://www.linkedin.com/pulse/part-5-how-install-sqlite-your-machine-windows-linux-mac-julles/) on how to for Windows, Mac, and Linux
- Next, we want to set up the [bitcoin-lib](https://github.com/bitcoinjs/bitcoinjs-lib) regtest bitcoin node locally, I recommend using docker for simplicity, which the setup can be found [here](https://github.com/bitcoinjs/regtest-server/tree/master/docker)
- Since the project is written in NodeJs and React we need to Install [NodeJs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- If that is all done we want we can now run ``npm install`` to install all packages for the React and NodeJs app
- Setup the `.env` files, one in the client folder and the other in the server, copy the keys from the `.env.example`
- Build the React and move the build files to the server using ``npm run build``
- You can now run the app locally using ``npm run start``


## What I implemented
- signup with username email and password, with both client and API validations, also the user is automatically authenticated
- login with email and password, authentication is done with jwt and cookies using passport and cookie-parser libraries
- logout, clearing state on the client, and clearing and invalidating cookies on the server
- getting and refreshing the Bitcoin rate gotten from coinbase API and displaying it on the frontend
- integrating add multiple banks using plaid client SDK and NPM package
- creating a BTC wallet and address for the user
- trade USD for Bitcoin, I do a balance check to make sure the user has enough, I also create a charge entry on the bank (DB level)
- transfer BTC from our out hot wallet (we have unlimited bitcoin 🤑) to the user wallet
- after the trade we emit an event that notifies a listener that bitcoin was sent and queries the blockchain for the transaction
- query the DB to find the wallet and update the wallet alongside a wallet transaction to track changes to the wallet
- wrote tests for all repositories, entities, services, use cases and strategies in the server
- hosting the project on digital ocean droplet alongside the regtest docker instance

## What could be improved and how
- the frontend can use a bit more breaking down into components
- a more dynamic frontend incase we want to add new cryptos
- we are not caching, caching can be done with Redis for better performance
- maybe migrating to a Postgresql or Mysql
- better error handling in the frontend and backend in terms of more unified error messages and statues
- I only tested the frontend with macOS desktop, so it might not be optimized for pc or mobile devices.
- less importing and fewer arguments for use cases and controllers due to the Dependency Injection, this can be solved by using containers like TypeDI
- more reactivity in terms of auto update using balance update, using push notification
- more scalable backend that works with real event queues to make trade process async and event-driven
- better transaction discovery flow, this would entail periodically parsing through the blockchain blocks typically using the blockchain's blocktime to get transactions belonging to wallet we control.
