//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {

    // The URL we will scrape from 
    url = 'https://www.leboncoin.fr/ventes_immobilieres/1076257949.htm?ca=12_s'


    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html


    request( url, function ( error, response, body ) {


        // First we'll check to make sure no errors occurred when making the request

        if ( !error && response.statusCode == 200 ) {

            // Next, we'll utilize the cheerio library on the returned html

            var $ = cheerio.load( body );

            // We'll define the variables we're going to capture

            var prix, surface, city, type, postalCode;
            var json = { prix: "", surface: "", city: "", type: "", postalCode: "" };


            // We'll use the unique header class as a starting point.

            price = $( 'h2.item_price' )

            // Let's store the data we filter into a variable so we can easily see what's going on.

            var data = $( this );

            // In examining the DOM we notice that the title rests within the last child element of the tag. 
            // Utilizing jQuery we can easily navigate and get the text by writing the following code:

            prix = data.children().last().text();

            // Once we have our title, we'll store it to the our json object.

            json.prix = prix;
            console.log( price );
            res.render( 'home', {
                message: body
            });


        }

    });
});

//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});