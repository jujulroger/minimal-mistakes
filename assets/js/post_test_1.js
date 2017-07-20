var Id1 = "example";
var Id2 = "example-2";
var Id3 = "example-3";

var width = $( ".page__inner-wrap" ).width();
var height = width;

var map = baseurl + '/assets/maps/france-geojson/departements.geojson'
var data = baseurl + "/assets/data/chomage_2016_2017.csv"
var columnHeader = "Ecart_Macron"

var options1 = {
        Id: Id1,
        width: 350,
        height: 350,
        map: map,
        data: data,
        columnHeader: "2017_1",
        colorbrewerCss: "Reds",
        centeredRange: false,
        quantiles: 9
    };

var options2 = {
        Id: Id2,
        width: 350,
        height: 350,
        map: map,
        data: data,
        columnHeader: "% Voix/Exp_2",
        colorbrewerCss: "Greys",
        centeredRange: false,
        quantiles: 9
    };

var options3 = {
        Id: Id3,
        width: width,
        height: height,
        map: map,
        data: data,
        columnHeader: "Ecart_Macron",
        colorbrewerCss: "RdGy",
        centeredRange: true,
        quantiles: 11
    };


loadMap(options1);
loadMap(options2);
loadMap(options3);
