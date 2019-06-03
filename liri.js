
//require env file to handle environment variables

require("dotenv").config();
var moment = require('moment');


var keys = require("./keys.js");

//create Spotify object to hold environment variables

function Spotify(id, secret) {
    this.id = id;
    this.secret = secret;
}

//create an instance of the Spotify object to access the spotify id and secret
var spotify = new Spotify(keys.spotify.id, keys.spotify.secret);

//require Axios
var axios = require('axios');

//create an array to hold the possible command line arguments
var inputArray = ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'];

//use a switch statement to parse the various input cases

switch (process.argv[2]) {
    case inputArray[0]:
        //bands in town 
        //create a variable to hold the band name
        var artist = process.argv[3];
        //call the function
        bandsInTown(artist);
        break;
    case inputArray[1]:
        //spotify
        console.log("spotify");
        break;
    case inputArray[2]:
        //OMDB
        console.log("omdb");
        break;
    case inputArray[3]:
        //use random.txt
        console.log("random.txt");
        break;
    default:
        console.log('hi');

}

//functions for each type fo request

//bands in town

function bandsInTown(input) {
    //construct query URL
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(function (response) {
        // If the axios was successful...then show info
        console.log(response.data[0]);
        var timeFormat = "MM/DD/YYYY"
        //since resopnse.data is structured as an array, iterate over it to get at the 
        //event values for each item
        for (var i = 0; i < response.data.length; i++) {
            var venue = response.data[i].venue.name;
            var city = response.data[i].venue.city;
            var region = response.data[i].venue.region;
            var country = response.data[i].venue.country;
            var date = moment(response.data[i].datetime).format(timeFormat);

            //only display region if it is populated:
            if (region === '') {
                console.log("\n--------------\n");
                console.log(
                    "Venue: " + venue + '\n' + "City: " + city + '\n' + "Country: "
                    + country + '\n' + "Date: " + date
                );
                console.log("\n--------------\n");

            } else {
                console.log("\n--------------\n");
                console.log(
                    "Venue: " + venue + '\n' + "City: " + city + '\n' + "Region: " +
                    region + '\n' + "Country: " + country + '\n' + "Date: " + date
                );
                console.log("\n--------------\n");
            }

        }

    })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {

            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });


}