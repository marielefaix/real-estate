//Importation of modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

//creation of a new express server
var app = express();

//We set EJS as the templating engine
app.set( 'view engine', 'ejs' );

//We set the 'assets' directory as our static assets dir 
app.use( '/assets', express.static( 'assets' ) );


//It makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {
    var url = req.query.urlLBC

    if ( url ) {
        callLeBonCoin( url, res )
    }
    else {

        res.render( 'home', {
            message: 'Veuillez saisir le lien html du logement : '
        });
    }
});


//Launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});

function callLeBonCoin( _url, res ) {
    request( _url, function ( error, response, body ) {
        if ( !error && response.statusCode == 200 ) {

            var url = cheerio.load( body )

            var FirstPrice = url( 'span.value' ).eq( 0 ).text()

            var Price = url( 'span.value' ).eq( 0 ).text().replace( '€', '' )
            Price = Price.replace( / /g, "" )
            console.log( Price )

            var CityName = url( 'span.value' ).eq( 1 ).text().split( ' ' )[0]

            var PostalCode = url( 'span.value' ).eq( 1 ).text().split( ' ' )[1]

            var Type = url( 'span.value' ).eq( 2 ).text()

            var Area = url( 'span.value' ).eq( 4 ).text().split( ' ' )[0]
            console.log( Area )

            var PricePerSquareMeter = Price / Area
            console.log( PricePerSquareMeter )


            request( 'http://www.meilleursagents.com/prix-immobilier/' + CityName.toLowerCase() + '-' + PostalCode, function ( error, response, body ) {
                if ( !error && response.statusCode == 200 ) {
                    var url2 = cheerio.load( body )

                    var MeanPriceAppart = url2( 'div.small-4.medium-2.columns.prices-summary__cell--median' ).eq( 0 ).text().replace( '€', '' ).replace( /\s/g, '' )
                    MeanPriceAppart = parseFloat( MeanPriceAppart )

                    var MeanPriceHouse = url2( 'div.small-4.medium-2.columns.prices-summary__cell--median' ).eq( 1 ).text().replace( '€', '' ).replace( /\s/g, '' )

                    var message = ' '

                    if ( Type == 'Appartement' ) {
                        if ( MeanPriceAppart > PricePerSquareMeter ) {
                            message = 'Bonne affaire : le prix moyen au mètre carré de cet appartement est inférieur au prix moyen au mètre carré du lieu '
                        }
                        else {
                            message = 'Mauvaise affaire : le prix moyen au mètre carré de cet appartement est supérieur au prix moyen du mètre carré du lieu'
                        }
                    }
                    else {
                        if ( MeanPriceHouse > PricePerSquareMeter ) {
                            message = 'Bonne affaire : le prix moyen au mètre carré de cette maison est inférieur au prix moyen du mètre carré du lieu'
                        }
                        else {
                            message = 'Mauvaise affaire : le prix moyen au mètre carré de cette maison est supérieur au prix moyen du mètre carré du lieu'
                        }

                    }

                    res.render( 'home', {
                        message: message
                    });
                }
            })
        }
    })
}