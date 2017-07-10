//uses tooltip.css and colorbrew.css

var width = 700, height = 550;

var map = baseurl + '/assets/maps/france-geojson/france-circonscriptions-legislatives-2012.json'
var data = baseurl + "/assets/data/Presidentielle_2017_Resultats_Tour_2_Cantons.csv"
var column_header = "% Blancs/Ins"

//projections data
var center = [2.454071, 46.279229];
var scale = 2600;
var translation = [width / 2, height / 2];

var path = d3.geoPath();

//projection
var projection = d3.geoConicConformal()
    .center(center)
    .scale(scale)
    .translate(translation);

path.projection(projection);

//svg placement selection
var svg = d3.select('#example').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "Blues");

var deps = svg.append("g");

//create tooltip element
var div = d3.select("#example").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//map creation
d3.json(map, function(req, geojson) {

    //draw (load ?) the map
    var features  = deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr('id', function(d) {return "d" + d.properties.ID;})
        .attr("d", path);

    //note: needs to be inside d3.json to load after the map
    d3.csv(data, function(csv) {

      //create quantile scale
      var quantile = d3.scaleQuantile()
          .domain([0, d3.max(csv, function(e) { return +e[column_header]; })])
          .range(d3.range(9));

      //create legend element to the side
      var legend = svg.append('g')
          .attr('transform', 'translate(525, 150)')
          .attr('id', 'legend');

      //add rectangles to legend
      legend.selectAll('.colorbar')
              .data(d3.range(9))
            .enter().append('svg:rect')
              .attr('y', function(d) { return d * 20 + 'px'; })
              .attr('height', '20px')
              .attr('width', '20px')
              .attr('x', '0px')
              .attr("class", function(d) { return "q" + d + "-9"; });

      //add color scale to legend
      var legendScale = d3.scaleLinear()
          .domain([d3.min(csv, function(e) { return +e[column_header]; }), d3.max(csv, function(e) { return +e[column_header]; })])
          .range([0, 9 * 20]);

      //add axis to legend
      var legendAxis = svg.append("g")
          .attr('transform', 'translate(550, 150)')
          .call(d3.axisRight(legendScale).ticks(6));

      //color map according to scale and add tooltip
      csv.forEach(function(e,i) {
        var code = e["Code du département"] + e["Code du canton"];
        d3.select("#d" + code)

            //add colors
            .attr("class", function(d) { return "department q" + quantile(+e[column_header]) + "-9"; })

            //add tooltip
            .on("mouseover", function(d) {
                div.transition()
                    .duration(50)
                    .style("opacity", .9);

                //tooltip html
                div.html("<b>Département : </b>" + e["Libellé du département"] + "<br>"
                      + "<b>" + column_header + ": </b>" + e[column_header] + "<br>"
                      )
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                div.html("")
                    .style("left", "0px")
                    .style("top", "0px");
            });

    });

    });
});
