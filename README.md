Uber By City
=========================

[Check out UberByCity live here](https://resistorsings.com/UberByCity).

This tool charts either the current price of an Uber trip from the airport to the center of the city, or the current wait time to get an Uber at the airport. You can add and remove cities to the chart.


## Technology

This project was built with React, Redux, d3, and webpack, based on the [redux-easy-boilerplate](https://github.com/anorudes/redux-easy-boilerplate) repo. It looks up airport codes from city names using the [Developer.aero Airport API](https://www.developer.aero/Airport-API/API-Overview), then uses [Google's geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) to look up coordinates for the airport and the city center, and finally gets current estimates from the [Uber API](https://developer.uber.com/v1/endpoints/).

##To-do

* Handle non-USD currency
* Allow cycling through multiple airports per city
