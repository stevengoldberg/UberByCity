Uber By City
=========================

[Check out UberByCity live here](https://resistorsings.com/UberByCity).

This tool charts either the current price of an Uber trip from the airport to the center of the city, or the current wait time to get an Uber at the airport. You can add and remove cities to the chart with the controls on the left. If a city name is associated with more than one airport, click the bar to cycle through the airports.


## Technology

This project was built with React, Redux, d3, and webpack, based on the [redux-easy-boilerplate](https://github.com/anorudes/redux-easy-boilerplate) repo. It looks up airport codes from city names using the [Developer.aero Airport API](https://www.developer.aero/Airport-API/API-Overview), then uses [Google's geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) to look up coordinates for the airport and the city center, and finally gets current estimates from the [Uber API](https://developer.uber.com/v1/endpoints/).

### Running locally

To run the code locally, you'll have to register for API keys with the 3 services mentioned above, then rename `config/development.js.example` to `config/development.js` and place the keys in the appropriate places in that module. Then `npm install`, then `npm start` and navigate to `localhost:3000`.

### To-do

* Handle non-USD currency
* Allow cycling through multiple airports per city
* Make it good on mobile
