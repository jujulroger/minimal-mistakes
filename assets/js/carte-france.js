//uses tooltip.css and colorbrew.css
//Note: id should be div Id without "#"

function loadMap(options) {


  var id = options.id;
  var width = options.width;
  var height = options.height;
  var map = options.map;
  var data = options.data;
  var dataColumnHeader = options.dataColumnHeader;
  var areaIdColumnHeader = options.areaIdColumnHeader;
  var areaNameColumnHeader = options.areaNameColumnHeader;
  var colorbrewerCss = options.colorbrewerCss;
  var centeredRange = options.centeredRange;
  var quantiles = options.quantiles;
  var tooltipName = options.tooltipName;
  var strokeWidth = options.strokeWidth;
  var strokeColor = options.strokeColor;

  var divId = "#" + id;

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
      .attr("id", "svg-" + id)
      .attr("width", width)
      .attr("height", height)
      .attr("class", colorbrewerCss);

  var deps = svg.append("g");

  //create tooltip element
  var tooltipDiv = d3.select(divId).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  //map creation
  d3.json(map, function(req, geojson) {

      //draw (load ?) the map
      var features  = deps.selectAll("path")
          .data(geojson.features)
          .enter()
          .append("path")
          .attr('id', function(d) {return "d" + d.properties.code + "-" + id;})
          .attr("d", path)
          .attr("stroke-width", strokeWidth)
          .attr("stroke", strokeColor);

      //note: needs to be inside d3.json to load after the map
      d3.csv(data, function(csv) {

        //create data range, centered at 0 if centeredRange == true
        var min, max;
        if (centeredRange) {
              var dataMin = Math.abs(d3.min(csv, function(e) { return +e[dataColumnHeader]; }));
              var dataMax = Math.abs(d3.max(csv, function(e) { return +e[dataColumnHeader]; }));
              min = - Math.max(dataMin, dataMax);
              max = Math.max(dataMin, dataMax);
            }
        else {
          min = d3.min(csv, function(e) { return +e[dataColumnHeader]; });
          max = d3.max(csv, function(e) { return +e[dataColumnHeader]; });
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
        if (width > 600) { vpad = 0.3 * width;} else { vpad = (0.3 - 0.5 * (1- width / 600)) * width;}

        //create legend element to the side
        var legend = svg.append('g')
            .attr('transform', 'translate(' + (width - hpad - 25) + ',' + vpad + ')')
            .attr('id', 'legend-' + id);

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
          var code = e[areaIdColumnHeader];
          var element = d3.select("#d" + code + "-" + id);

              //add colors
              element.attr("class", function(d) { return "department q" + quantile(+e[dataColumnHeader]) + "-" + quantiles; });

              //create tooltip html
              tooltipHtml = e[areaNameColumnHeader] + "<br>"
                    + "<b>" + tooltipName + " : </b>" + Number(e[dataColumnHeader]).toFixed(1) + "&nbsp;%<br>"

              //add tooltip
              createTooltip(element, tooltipDiv, tooltipHtml);
        });
      });
  });
}
