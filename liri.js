// our required files and keys set to variables 
require("dotenv").config();
var request = require("request");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var keys = require("./keys");
var inquirer = require("inquirer");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
 

// set inquire prompt inside a function
function liriChoice() {
    console.log("================================================================")
    console.log("Welcome to LIRI")
    console.log("Your personal Language Interpretation and Recognition Interface")
    console.log("================================================================")
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
                message: "What movie/band/artist do you want to search for? (if do-what-it-says, hit Enter)",
            }
        ]).then(function (answers) {
            console.log(answers);
            liriSwitch(answers.actionChoice, answers.title);
            // log input to external file "log.txt"
            log(answers.actionChoice, answers.title);
        })
}

// call to function to prompt user to select a choice 
liriChoice();

// once selected, LIRI will go through our switch case to display response accordingly
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


// function for concert-this action
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
};


// function for spotifiy-this-song action
function spotifyThisSong(title) {
    // if no title is entered, default to bonnie tyler's "total eclipse of the heart"
    if (!title) {
        title = "Total Eclipse of the Heart"
    }
 
spotify.search({ type: 'track', query: title }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  var spotifyRes = data.tracks.items[0];

console.log("Artist: " + spotifyRes.artists[0].name); 
console.log("Song Title: " + spotifyRes.name);
console.log("Preview URL: " + spotifyRes.preview_url);
console.log("Ablum: " + spotifyRes.album.name);
});
}



// function for movie-this action
function movieThis(title) {
    var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";

    request(queryURL, function(error, response, body) {
        var data = JSON.parse(body);

        if (data.length === 0) {
            console.log("Sorry this movie isn't in our database")
        } else {
        console.log("Title: " + data.Title)
        console.log("Released: " + data.Year)
        console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value)
        console.log("IMDb rating: " + data.imdbRating)
        console.log("Country: " + data.Country)
        console.log("Language: " + data.Language)
        console.log("Plot: " + data.Plot)
        console.log("Actors: " + data.Actors)
        }
    })

}

// function for do-what-it-says function
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            throw error
        }
        console.log(data);
        var randomTextArr =  data.split(",");
        action = randomTextArr[0];
        title = randomTextArr[1];
        liriSwitch(action, title);
    })

}

// function to log user input to external file "log.txt"
function log (action, title) {
    var appendData;
    if (title === undefined) {
        appendData = action + "\n";
    } else {
        appendData = action + ", " + title + "\n";
    }
    fs.appendFile("log.txt", appendData, function(error) {
        if (error) {
            throw error
        }
    }) 
}