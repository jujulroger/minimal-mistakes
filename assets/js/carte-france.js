//uses tooltip.css and colorbrew.css
//Note: Id should be div Id without "#"

function loadMap(options) {


  var Id = options.Id;
  var width = options.width;
  var height = options.height;
  var map = options.map;
  var data = options.data;
  var columnHeader = options.columnHeader;
  var colorbrewerCss = options.colorbrewerCss;
  var centeredRange = options.centeredRange;
  var quantiles = options.quantiles;
  var tooltipName = options.tooltipName;
  var strokeWidth = options.strokeWidth;
  var strokeColor = options.strokeColor;

  var divId = "#" + Id;

  //projections data
  var center = [2.454071, 46.279229];
  var scale = 5 * width;
  var translation = [width / 2, height / 2];

  var path = d3.geoPath();

  //projection
  var projection = d3.geoConicConformal()
      .center(center)
      .scale(scale)
      .translate(translation);

  path.projection(projection);

  //svg placement selection
  var svg = d3.select(divId).append("svg")
      .attr("id", "svg-" + Id)
      .attr("width", width)
      .attr("height", height)
      .attr("class", colorbrewerCss);

  var deps = svg.append("g");

  //create tooltip element
  var div = d3.select(divId).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  //map creation
  d3.json(map, function(req, geojson) {

      //draw (load ?) the map
      var features  = deps.selectAll("path")
          .data(geojson.features)
          .enter()
          .append("path")
          .attr('id', function(d) {return "d" + d.properties.code + "-" + Id;})
          .attr("d", path)
          .attr("stroke-width", strokeWidth)
          .attr("stroke", strokeColor);

      //note: needs to be inside d3.json to load after the map
      d3.csv(data, function(csv) {

        //create data range, centered at 0 if centeredRange == true
        var min, max;
        if (centeredRange) {
              var dataMin = Math.abs(d3.min(csv, function(e) { return +e[columnHeader]; }));
              var dataMax = Math.abs(d3.max(csv, function(e) { return +e[columnHeader]; }));
              min = - Math.max(dataMin, dataMax);
              max = Math.max(dataMin, dataMax);
            }
        else {
          min = d3.min(csv, function(e) { return +e[columnHeader]; });
          max = d3.max(csv, function(e) { return +e[columnHeader]; });
          }

        //need to be reversed for color scale. TODO: does it break anything else ?
        var domain = [max, min];

        //create quantile scale
        var quantile = d3.scaleQuantile()
            .domain(domain)
            .range(d3.range(quantiles));

        //horizontal and vertical padding for legend. TODO: Too much fudging
        var hpad = 0.07 * width;
        var vpad;
        if (width > 600) { vpad = 0.3 * width;} else { vpad = (0.3 - 0.45 * (1- width / 600)) * width;}

        //create legend element to the side
        var legend = svg.append('g')
            .attr('transform', 'translate(' + (width - hpad - 25) + ',' + vpad + ')')
            .attr('id', 'legend-' + Id);

        //add rectangles to legend
        legend.selectAll('.colorbar')
                .data(d3.range(quantiles))
              .enter().append('svg:rect')
                .attr('y', function(d) { return ((quantiles - 1) * 20 - d * 20) + 'px'; })
                .attr('height', '20px')
                .attr('width', '20px')
                .attr('x', '0px')
                .attr("class", function(d) { return "q" + d + "-" + quantiles; })
                .attr("stroke-width", strokeWidth)
                .attr("stroke", strokeColor);

        //add color scale to legend
        var legendScale = d3.scaleLinear()
            .domain(domain)
            .range([0, quantiles * 20]);

        //add axis to legend
        var legendAxis = svg.append("g")
            .attr('transform', 'translate(' + (width - hpad) + ',' + vpad + ')')
            .call(d3.axisRight(legendScale).ticks(8).tickSizeOuter(0));

        //color map according to scale and add tooltip
        csv.forEach(function(e,i) {
          var code = e["code"];
          d3.select("#d" + code + "-" + Id)

              //add colors
              .attr("class", function(d) { return "department q" + quantile(+e[columnHeader]) + "-" + quantiles; })

              //add tooltip
              .on("mouseover", function(d) {
                  div.transition()
                      .duration(50)
                      .style("opacity", .9);

                  //tooltip html
                  div.html(e["nom"] + "<br>"
                        + "<b>" + tooltipName + " : </b>" + Number(e[columnHeader]).toFixed(1) + "<br>"
                      );

                  //tooltip position: below, shifted left if too close to window border
                  var mouseX = d3.event.pageX;
                  var mouseY = d3.event.pageY;

                  if (mouseX < $(window).width() - 50) {
                      div.style("left", (mouseX - 30) + "px")
                         .style("top", (mouseY + 30) + "px");
                    }
                  else {
                    div.style("left", (mouseX - 70) + "px")
                       .style("top", (mouseY + 30) + "px");
                    }
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
}
