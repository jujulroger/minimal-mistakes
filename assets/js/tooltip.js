//uses d3 and jquery

function createTooltip(element, tooltipDiv, tooltipHtml) {
    element.on("mouseover", function(d) {

        tooltipDiv.transition()
          .duration(50)
          .style("opacity", .9);

        tooltipDiv.html(tooltipHtml);

        //tooltip position: below, shifted left if too close to window border
        var mouseX = d3.event.pageX;
        var mouseY = d3.event.pageY;

        if (mouseX < $( window ).width() - 50) {
            tooltipDiv.style("left", (mouseX - 30) + "px")
               .style("top", (mouseY + 30) + "px");
        }
        else {
          tooltipDiv.style("left", (mouseX - 70) + "px")
             .style("top", (mouseY + 30) + "px");
        }
      })
    .on("mouseout", function(d) {

        tooltipDiv.transition()
            .duration(500)
            .style("opacity", 0);

        tooltipDiv.html("")
            .style("left", "0px")
            .style("top", "0px");
    });
};
