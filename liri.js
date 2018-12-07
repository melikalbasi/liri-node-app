require("dotenv").config();
var request = require("request");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var keys = require("./keys");
var inquirer = require("inquirer");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);


// concert-this
// spotify-this-song
// movie-this
// do-what-it-says

function liriChoice() {
    console.log("Welcome to LIRI")
    console.log("")
    inquirer
        .prompt([
            {
                type: "list",
                name: "actionChoice",
                message: "What would you like to do?",
                choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]
            },
            {
                type: "input",
                name: "title",
                message: "What movie/band/artist do you want to search for?",
            }
        ]).then(function (answers) {
            console.log(answers);
            liriSwitch(answers.actionChoice, answers.title);


        })
}
liriChoice();

function liriSwitch(action, title) {
    switch (action) {
        case "concert-this":
            concertThis(title);
            break;
        case "spotify-this-song":
            spotifyThisSong(title);
            break;
        case "movie-this":
            movieThis(title);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}




function concertThis(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, function (error, response, body) {
        var data = JSON.parse(body)
        console.log(data)

        if (data.length === 0) {
            console.log("Sorry there are no upcoming events for this artist")
        } else {
            for (var i=0; i < data.length; i++) {
                console.log("Venue name: " + data[i].venue.name)
                console.log("Venue location: " + data[i].venue.city + ", " + data[i].venue.country)
                console.log("Date: " + moment(data[i].datetime).format("MM/DD/YYY"))
            }
        }
        

});
}

