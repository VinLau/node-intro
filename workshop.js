var request = require('request-promise');

// Euclidian distance between two points
function getDistance(pos1, pos2) {
   return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

function getIssPosition() {
   return request("http://api.open-notify.org/iss-now.json")
      .then( //callback after request promise is resolved
         function(response1) {
            // console.log(response);
            // console.log(typeof response); //string
            // Parse as JSON //NB: we could have just put JSON.parse without assignment, function definition, or return value but it was here before
            var parsed = JSON.parse(response1); //use JSON.parse to change string to object (JSON.stringify turns object to string)
            // console.log(typeof JSON.parse(response)); //object
            // console.log(parsed.iss_position); // { longitude: '154.7769', latitude: '-30.0946' }  //(will change due to orbit)
            // console.log(parsed["iss_position"]["longitude"]); //158.1304 (will change due to orbit) NB: bracket object notation works as well
            // console.log(parsed.iss_position.longitude); //158.1304
            return parsed;
         }).then(
         function(response2) {
            var returnObj = {};
            returnObj.lat = response2.iss_position.latitude;
            returnObj.lng = response2.iss_position.longitude;
            return returnObj; // Return object with lat and lng
         });
}

getIssPosition().then(console.log); //YAY! notice we passed console.log as a function definition

var globalObj;

function getAddressPosition(address) {
   return request("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBWiFuxVWRmUFjje3C7EaxgVN9TFLpt0Do")
      .then(
         function(response1) {
            // console.log(typeof response1); //string
            // console.log(response1);
            var parsed = JSON.parse(response1);
            // console.log(parsed);
            // console.log(typeof parsed); //object
            return parsed;
         }
      ).then(
         function(response2) {
            var returnObj = {};
            returnObj.lat = response2.results[0].geometry.location.lat;
            returnObj.lng = response2.results[0].geometry.location.lng;
            // console.log("returnObj", returnObj);
            // globalObj = returnObj;
            // console.log("globalObj", globalObj);
            // console.log("google map lng ", returnObj.lng);
            // console.log("google map lat ", returnObj.lat);
            return returnObj;
         }
      )
      .catch(
         function(err) {
            console.log("Error happened during google API:", err);
         }
      );
}

getAddressPosition("4+place+ville+marie,+Montreal+Canada").then(console.log);

function getCurrentTemperatureAtPosition(position) {
   // console.log(position); //NB: we get a promise object back, not the returnObj earlier if we pass in just  getAddressPosition("4+place+ville+marie,+Montreal+Canada") as position
   var lat = position.lat;
   var lng = position.lng;
   // console.log(lat);
   // console.log(lng);
   return request("https://api.darksky.net/forecast/68692099c40fdc3d25b8504475e3240b/" + lat + "," + lng)
      .then(
         function(response1) {
            var parsed = JSON.parse(response1);
            //console.log(parsed);
            var returnTemp = 5 * (parsed.currently.apparentTemperature - 32) / 9;
            console.log("temperature is C" + returnTemp);
            return returnTemp;
         }
      )
      .catch(
         function(err) {
            console.log("dark sky API error", err);
         }
      );
}

getAddressPosition("4+place+ville+marie,+Montreal+Canada")
   .then(getCurrentTemperatureAtPosition);

getCurrentTemperatureAtPosition({
   lat: 45,
   lng: 74
}).then(console.log);

function getCurrentTemperature(address) {
   getAddressPosition(address)
      .then(getCurrentTemperatureAtPosition); //NB: we are passing the function definition and it is assumed that the return reponse from the above line is being passed into this function definition
}

getCurrentTemperature("400+king+street,+Toronto+Canada"); //basically the same line 90 but more compact form

var globalDist;

function getDistanceFromIss(address) {
   return Promise.all([ //NOTE: we need to return a promise to allow for promise chaining, this is no different than return request-promise
      getIssPosition(),
      getAddressPosition(address)
   ])
   .then(function(dataArray){
      var ISSpos = dataArray[0];
      var myPos = dataArray[1];
      var distance = getDistance(ISSpos, myPos);
      // console.log("ISSpos longtitude is " + ISSpos.lng);
      // console.log("myPos longtitude is " + myPos.lng);
      // console.log("the distance is " + distance);
      return distance;
   })
   .then(function(returnValue){
      globalDist = returnValue;
   })
   .catch(function(err){
      console.log("error in ISS calculation " + err);
   });
}

getDistanceFromIss("4+place+ville+marie,+Montreal+Canada")
.then( function(response) {console.log("the distance from ISS is "+ response);} );


console.log("global " + globalDist);
