var mapId1 = "example";
var mapId2 = "example-2";
var mapId3 = "example-3";
var plotId = "dispersion";
var buttonId = "residuals-button-1";
var buttonContainerId = "residuals-button-container"

var width = $( ".page__inner-wrap" ).width();
var height = 0.9 * width;
var width2 = Math.max(width / 2 - 25, 300);
var height2 = 0.9 * width2;

var map = baseurl + '/assets/maps/france-geojson/departements.geojson'
var data = baseurl + "/assets/data/chomage_2016_2017.csv"
var columnHeader = "Ecart"

var options1 = {
        id: mapId1,
        width: width2,
        height: height2,
        map: map,
        data: data,
        dataColumnHeader: "2017_1",
        areaIdColumnHeader: "code",
        areaNameColumnHeader: "nom",
        tooltipName: "Chômage",
        colorbrewerCss: "Reds",
        strokeWidth: "0.25px",
        strokeColor: "grey",
        centeredRange: false,
        quantiles: 9
    };

var options2 = {
        id: mapId2,
        width: width2,
        height: height2,
        map: baseurl + '/assets/maps/france-geojson/departements.geojson',
        data: data,
        dataColumnHeader: "% Voix/Exp_2",
        areaIdColumnHeader: "code",
        areaNameColumnHeader: "nom",
        tooltipName: "Vote FN",
        colorbrewerCss: "Purples",
        strokeWidth: "0.25px",
        strokeColor: "grey",
        centeredRange: false,
        quantiles: 9
    };

var options3 = {
        id: mapId3,
        width: width,
        height: height,
        map: map,
        data: data,
        dataColumnHeader: "Ecart",
        areaIdColumnHeader: "code",
        areaNameColumnHeader: "nom",
        tooltipName: "Écart",
        colorbrewerCss: "PuOr",
        strokeWidth: "0.25px",
        strokeColor: "grey",
        centeredRange: true,
        quantiles: 11
    };

var optionsPlot = {
        plotId: plotId,
        buttonId: buttonId,
        buttonContainerId: buttonContainerId,
        width: width,
        height: height,
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
