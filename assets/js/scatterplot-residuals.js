/*

Script is mostly generic, except for tooltip content, see var tooltipHtml

*/


  //choose id's, plotID same as div acted on

  var plotId = "plot"
  var svgId = "#svg" + plotId
  var buttonId = "residuals-button-1";
  var buttonContainerId = "residuals-button-container";


  //set data folder

  var dataFolder = baseurl + "/assets/data/"

  //set csv url

  var csvUrl = dataFolder + "chomage_2016_2017.csv";

  //choose columns from csv

  var xVar = "2017_1";
  var yVar = "% Contestataires";

  //axes names

  var xAxisName = "Chômage 1er Trimestre 2017";
  var yAxisName = "Abstention";

  //aliases for tooltip

  var xAlias = "CH";
  var yAlias = "ABS";

  //residuals names

  var yResidualsAxisName = "Points Error (PE)";
  var yResidualsAlias = "PE";

  //Residuals button names

  var buttonNameResiduals = "Check Residuals";
  var buttonNameGraph = "Back to Graph";

  //div dimensions

  var divWidth = parseInt(d3.select("#" + plotId)
              .style("width"), 10);
  var divHeight = Math.min(parseInt(d3.select("#" + plotId)
                    .style("width"), 10), 500);

  //margin between svg and edges of div, svg dimensions

  var margin = {top: 5, right: 5, bottom: 5, left: 5};

  var svgWidth = divWidth - margin.left - margin.right;
  var svgHeight = divHeight - margin.top - margin.bottom;

  //padding between graph area and edge of svg, graph dimensions
  /*note: tick labels and axes names are outside graph area but inside svg,
  adapt padding according to font sizes*/

  var padding = {top: 20, right: 20, bottom: 60, left: 60};

  var graphWidth = svgWidth - padding.left - padding.right;
  var graphHeight = svgHeight - padding.top - padding.bottom;

  //padding between points and edges of graph, as a proportion of domain

  var innerPadding = {top: 0.02, right: 0.02, bottom: 0.02, left: 0.02};

  //padding between tick labels and axis, grid

  var xPaddingLabels = 10;
  var yPaddingLabels = 10;

  //shift tooltip from pointer in px, changed when near right border

  var xTooltipShift = 16;
  var yTooltipShift = 0;

  //when pointer distance from right side less than tooltipInbound uses Alt

  var tooltipInbound = 100;

  var xTooltipShiftAlt = -50;
  var yTooltipShiftAlt = 20;

  //tooltip opacity, time to transition on-off

  var tooltipOpacity = 0.9;

  var tooltipTransitionOn = 500;
  var tooltipTransitionOff = 200;

  //choose dots, regression line dimensions

  var dotRadius = 4;
  var regLineStrokeWidth = 2;

  //choose number of ticks on axes and their size
  //TODO: make ticks dynamic for smartphones

  var xTicks = 10;
  var yTicks = 5;

  var tickDimension = 5;

  //create svg translated by margin

  //create tooltip, attached to div

  var tooltip = d3.select("#" + plotId).append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

  //define scales ranges using dimensions of graph

  var xScale = d3.scale.linear().range([0, graphWidth]);
  var yScale = d3.scale.linear().range([graphHeight, 0]);

  //define axes

  var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(xTicks);
  var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .ticks(yTicks);

  //define grid

  var xGrid = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(xTicks);
  var yGrid = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .ticks(yTicks);

  //regression line definition and its inverse
  //see linearRegression function defined at the end

  var regLineSlope;
  var regLineIntercept;
  var r2;
  function regLine(x) {return regLineSlope * x + regLineIntercept ;};
  function regLineInverse(y){return (1/regLineSlope)*(y-regLineIntercept);};

  //variables re-used later

  var xLength;
  var yLength;
  var xMin;
  var xMax;
  var yMin;
  var yMax;
  var xIntMin;
  var xIntMax;
  var xData;
  var yData;
  var yDataOriginal;
  var svg;
  var graph;

  //load graph

  loadSvg();

  //add residuals button

  var $residualsButton = $('<input type = "button"'
                              + 'value = "' + buttonNameResiduals + '"'
                              + 'id = "' + buttonId + '"'
                            + '/>');
  $residualsButton.appendTo($("#" + buttonContainerId));
  $residualsButton.on("click", residuals);


  //main function, load data, plots graph...

  function loadSvg(){

    svg = d3.select("#" + plotId)
          .append("svg")
          .attr("id", "svg" + plotId)
          .attr("width", svgWidth)
          .attr("height", svgHeight)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //create background, attached to svg

    svg.append("rect")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("class", "scatter-background");

    //create graph group translated by padding

    graph = svg.append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

    //load data, rest is wrapped in

    d3.csv(csvUrl, function(error,dataset) {

      //change xVar, yVar to num

      dataset.forEach(function(d) {
          d[xVar] = +d[xVar];
          d[yVar] = +d[yVar];
              }
          );

      //set up x y variables

      xData = dataset.map(function(d) {return d[xVar];});
      yData = dataset.map(function(d) {return d[yVar];});

      yDataOriginal = yData; //copy for use later

      //compute domains with extra room, making sure 0 is always included

      xLength = d3.max(xData) - Math.min(0, d3.min(xData));
      yLength = d3.max(yData) - Math.min(0, d3.min(yData));

      xMin = Math.min(0, d3.min(xData) - innerPadding.left * xLength);
      xMax = Math.max(0, d3.max(xData) + innerPadding.right * xLength);

      yMin = Math.min(0, d3.min(yData) - innerPadding.bottom * yLength);
      yMax = Math.max(0, d3.max(yData) + innerPadding.top * yLength);

      //set scales domains according to min max dimensions

      xScale.domain([xMin, xMax]);
      yScale.domain([yMin, yMax]);

      //create grid and tick labels attached to graph

      graph.append("g")
        .attr("class", "grid")
        .attr("id", "x-grid")
        .attr("transform", "translate(0," + graphHeight + ")")
        .call(xGrid
            .tickSize(-graphHeight, 0, 0)
            .tickPadding(xPaddingLabels)
        );

      graph.append("g")
        .attr("class", "grid")
        .attr("id", "y-grid")
        .call(yGrid
            .tickSize(-graphWidth, 0, 0)
            .tickPadding(yPaddingLabels)
        );

      //create axes, no tick labels attached to graph

      graph.append("g")
        .attr("class", "axis")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + yScale(0) + ")")
        .call(xAxis
            .tickSize(tickDimension, 0, 0)
            .tickFormat("")
        );

      graph.append("g")
        .attr("class", "axis")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + xScale(0) + ",0)")
        .call(yAxis
            .tickSize(tickDimension, 0, 0)
            .tickFormat("")
        );

      //add axes names attached to svg TODO: too much fudging with paddings?

      svg.append("text")
        .attr("class", "axis-name")
        .attr("id", "x-axis-name")
        .attr("x", (svgWidth - padding.left - padding.right) / 2 + padding.left)
        .attr("y", (svgHeight))
        .attr("dy", "-0.75em") //adapts distance to bottom in term of font size
        .style("text-anchor", "middle")
        .text(xAxisName);

      svg.append("text")
        .attr("class", "axis-name")
        .attr("id", "y-axis-name")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", "1.25em") //adapts distance to left in term of font size
        .attr("x", 0 - (svgHeight - padding.top - padding.bottom) / 2 - padding.top)
        .style("text-anchor", "middle")
        .text(yAxisName);

      //create scatter points, attached to graph

      var scatterPoints = graph.selectAll("circle")
                  .data(xData)
                  .enter()
                  .append("circle")
                  .attr("class", "scatter-point")
                  .attr("id", "scatter-point")
                  .attr("cx", function(d) {
                          return xScale(d);
                  })
                  .attr("cy", function(d,i) {
                          return yScale(yData[i]);
                  })
                  .attr("r", dotRadius);

        //add tooltip on mouseover and change stroke of selected point

      scatterPoints.on("mouseover", function(d,i) {

          //create tooltip

        d3.select(this).attr("class", "scatter-point-highlight");
        tooltip.transition()
          .duration(tooltipTransitionOn)
          .style("opacity", tooltipOpacity);

        //filter data for overlapping points

        var dataFiltered = dataset.filter(function(d) {return d[xVar] == dataset[i][xVar]
                                  && d[yVar] == dataset[i][yVar];
                  });

        //create tooltip html

        var tooltipHtml = xAlias + "=" + xData[i] + ", " + yAlias + "=" + yData[i];

        dataFiltered.map(function(d,i) {
                  tooltipHtml = tooltipHtml + "<br/>"
                    + dataFiltered[i]["Team"]
                    + " " + dataFiltered[i]["Year"];
        });

        // fill and position tooltip, separate case when too close to right side #(instead could check for 'collision'?)

        if (d3.event.pageX<svgWidth-tooltipInbound) {
          tooltip.html(tooltipHtml)
            .style("left", (d3.event.pageX + xTooltipShift) + "px")
            .style("top", (d3.event.pageY + yTooltipShift) + "px");
        } else {
          tooltip.html(tooltipHtml)
            .style("left", (d3.event.pageX + xTooltipShiftAlt) + "px")
            .style("top", (d3.event.pageY + yTooltipShiftAlt) + "px");
        }
      });

      //remove tooltip on mouseout

      scatterPoints.on("mouseout", function(d) {
                  d3.select(this).attr("class","scatter-point");
                  tooltip.transition()
                    .duration(tooltipTransitionOff)
                    .style("opacity", 0);
              });

      //compute regression line data

      lr = linearRegression(yData, xData);
      regLineSlope = +lr["slope"];
      regLineIntercept = +lr["intercept"];
      r2 = +lr["r2"];

      //create regression line, attached to graph
      //compute x-coord intersection with graph area TODO: other method?

      if (regLineSlope < 0){

      xIntMin = Math.max(xMin, regLineInverse(yMax));
      xIntMax = Math.min(xMax, regLineInverse(yMin));
      } else {
      xIntMin = Math.max(xMin, regLineInverse(yMin));
      xIntMax = Math.min(xMax, regLineInverse(yMax));
      }

      graph.append("line")
        .attr("id", "reg-line")
        .attr("x1", xScale(xIntMin))
        .attr("y1", yScale(regLine(xIntMin)))
        .attr("x2", xScale(xIntMax))
        .attr("y2", yScale(regLine(xIntMax)))
        .attr("class", "reg-line")
        .attr("stroke-width", regLineStrokeWidth);
    });
  };

	//function switch to residuals

	function residuals() {

    var yAxisNameNew;
    var yALiasCopy = yAlias;

		//duration of transition in ms

		var transitionTime = 1000;

		//check state of button, loads residuals or original data

		var currentValue = document.getElementById(buttonId).value;

		if (currentValue == buttonNameResiduals) {
			document.getElementById(buttonId).value = buttonNameGraph;

			//compute residuals

			yData = xData.map(function(d,i) {return yDataOriginal[i] - regLine(d);})
			yAxisNameNew = yResidualsAxisName;
      yAliasCopy = yAlias;
      yAlias = yResidualsAlias;
		} else {
			document.getElementById(buttonId).value = buttonNameResiduals;
			yData = yDataOriginal;
			yAxisNameNew = yAxisName;
      yAlias = yAliasCopy;
		}

		//recalculate min, max, scales, grid

		xLength = d3.max(xData) - Math.min(0, d3.min(xData));
		yLength = d3.max(yData) - Math.min(0, d3.min(yData));

		xMin = Math.min(0, d3.min(xData) - innerPadding.left * xLength);
		xMax = Math.max(0, d3.max(xData) + innerPadding.right * xLength);

		yMin = Math.min(0, d3.min(yData) - innerPadding.bottom * yLength);
		yMax = Math.max(0, d3.max(yData) + innerPadding.top * yLength);

		xScale.domain([xMin, xMax]);
		yScale.domain([yMin, yMax]);

		xGrid.scale(xScale);
		yGrid.scale(yScale);

		//create new svg the old one will transition to

		svgRes = d3.select("#svg" + plotId).transition();

		//update grids

		svgRes.select("#x-grid")
			.duration(transitionTime)
			.call(xGrid);

		svgRes.select("#y-grid")
			.duration(transitionTime)
			.call(yGrid);

		//update axes

		svgRes.select("#x-axis")
			.duration(transitionTime)
			.attr("transform", "translate(0," + yScale(0) + ")")
			.call(xAxis);

		svgRes.select("#y-axis")
			.duration(transitionTime)
			.attr("transform", "translate(" + xScale(0) + ",0)")
			.call(yAxis);

		//change y-axis name

		svgRes.select("#y-axis-name")
			.duration(transitionTime)
			.text(yAxisNameNew);

		//update scatter points

		svgRes.selectAll("#scatter-point")
			.duration(transitionTime)
			.attr("cy", function(d, i) {
						return yScale(yData[i]);
			});

		//update regression line
		//don't compute reg line for residuals to avoid line not being straight

    if (regLineSlope < 0){

        xIntMin = Math.max(xMin, regLineInverse(yMax));
        xIntMax = Math.min(xMax, regLineInverse(yMin));
        } else {
        xIntMin = Math.max(xMin, regLineInverse(yMin));
        xIntMax = Math.min(xMax, regLineInverse(yMax));
        }

		if (currentValue == buttonNameResiduals) {
			svgRes.select("#reg-line")
				.duration(transitionTime)
				.attr("x1", xScale(xMin)).attr("y1", yScale(0))
				.attr("x2", xScale(xMax)).attr("y2", yScale(0));
		} else {svgRes.select("#reg-line")
					.duration(transitionTime)
					.attr("x1", xScale(xIntMin))
					.attr("y1", yScale(regLine(xIntMin)))
					.attr("x2", xScale(xIntMax))
					.attr("y2", yScale(regLine(xIntMax)));
		}

		//round residuals for tooltip

		yData = yData.map(function(d) {return +d.toFixed(1);});
	}

	//Linear regression function, returns "slope", "intercept", "r2"

	function linearRegression(y,x){
				var lr = {};
				var n = y.length;
				var sum_x = 0;
				var sum_y = 0;
				var sum_xy = 0;
				var sum_xx = 0;
				var sum_yy = 0;

				for (var i = 0; i < y.length; i++) {
					sum_x += x[i];
					sum_y += y[i];
					sum_xy += (x[i]*y[i]);
					sum_xx += (x[i]*x[i]);
					sum_yy += (y[i]*y[i]);
				}

				lr['slope'] = (n * sum_xy - sum_x * sum_y) /
								(n * sum_xx - sum_x * sum_x);
				lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
				lr['r2'] = Math.pow(
							(n * sum_xy - sum_x * sum_y)/
							Math.sqrt((n * sum_xx - sum_x * sum_x) *
							(n * sum_yy - sum_y * sum_y)), 2);
				return lr;
			}
