var width = 550, height = 550;

var path = d3.geoPath();

var projection = d3.geoConicConformal()
    .center([2.454071, 46.279229])
    .scale(2600)
    .translate([width / 2, height / 2]);

path.projection(projection);

var svg = d3.select('#example').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

var deps = svg.append("g");

d3.json('/assets/france-geojson-master/departements.geojson', function(req, geojson) {
    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path);
});
