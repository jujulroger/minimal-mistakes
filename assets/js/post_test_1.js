var Id1 = "example";
var Id2 = "example-2";
var Id3 = "example-3";

var width = $( ".page__inner-wrap" ).width();
var height = 0.9 * width;
var width2 = Math.max(width / 2 - 25, 300);
var height2 = 0.9 * width2;

var map = baseurl + '/assets/maps/france-geojson/departements.geojson'
var data = baseurl + "/assets/data/chomage_2016_2017.csv"
var columnHeader = "Ecart"

var options1 = {
        Id: Id1,
        width: width2,
        height: height2,
        map: map,
        data: data,
        columnHeader: "2017_1",
        tooltipName: "Chômage",
        colorbrewerCss: "Reds",
        strokeWidth: "0.25px",
        strokeColor: "grey",
        centeredRange: false,
        quantiles: 9
    };

var options2 = {
        Id: Id2,
        width: width2,
        height: height2,
        map: map,
        data: data,
        columnHeader: "% Voix/Exp_2",
        tooltipName: "Vote FN",
        colorbrewerCss: "Purples",
        strokeWidth: "0.25px",
        strokeColor: "grey",
        centeredRange: false,
        quantiles: 9
    };

var options3 = {
        Id: Id3,
        width: width,
        height: height,
        map: map,
        data: data,
        columnHeader: "Ecart",
        tooltipName: "Écart",
        colorbrewerCss: "PuOr",
        strokeWidth: "0.25px",
        strokeColor: "grey",
        centeredRange: true,
        quantiles: 11
    };

var optionsPlot = {
        width: width,
        height: height,
        plotId: "dispersion",
        buttonId: "residuals-button-1",
        buttonContainerId: "residuals-button-container",
        data: data,
        xVar: "2017_1",
        yVar: "% Voix/Exp_2",
        xAxisName: "Chômage 1er Trimestre 2017",
        yAxisName: "Vote Front National",
        xAlias: "CH",
        yAlias: "FN",
        yResidualsAxisName: "Écart (ÉC)",
        yResidualsAlias: "ÉC",
        buttonNameResiduals: "Écarts",
        buttonNameGraph: "Graphe"
}

loadMap(options1);
loadMap(options2);
loadPlot(optionsPlot);
loadMap(options3);
