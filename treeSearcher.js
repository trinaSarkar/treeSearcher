// Set up size
var mapWidth = 750;
var mapHeight = 750;

// Set up projection that the map is using
var projection = d3.geoMercator()
  .center([-122.433701, 37.767683]) // San Francisco, roughly
  .scale(225000)
  .translate([mapWidth / 2, mapHeight / 2]);

// This is the mapping between <longitude, latitude> position to <x, y> pixel position on the map
// projection is a function and it has an inverse:
// projection([lon, lat]) returns [x, y]
// projection.invert([x, y]) returns [lon, lat]

// Add an SVG element to the DOM
var svg = d3.select('body').append('svg')
.attr('id', 'mapSVG')
.attr('width', mapWidth)
.attr('height', mapHeight);

// Add SVG map at correct size, assuming map is saved in a subdirectory called data
svg.append('image')
.attr('id', 'map')
.attr('width', mapWidth)
.attr('height', mapHeight)
.attr('xlink:href', 'https://magrawala.github.io/cs448b-fa17/assets/a3/sf-map.svg');


function projectData(dataPoint) {
	return {
		'lon' : dataPoint.Longitude,
		'lat' : dataPoint.Latitude
	}
}

function loadVisualization(allData) {
	svg.selectAll("circle")
		.data(allData)
		.enter()
		.append("circle")
		.style("fill",	"pink")
		.attr("r",	4)
		.attr("cx",	function(d)	{	return projection([d.lon, d.lat])[0];	})
		.attr("cy",	function(d)	{	return projection([d.lon, d.lat])[1];	});
	isLoaded = true;
};

function loadCircles() {

  var currCircles = 2;

  circle_position_data = d3.range(currCircles).map(function() {
      return {
          x: mapWidth/2,
          y: mapHeight/2
      };
  });

  // update(currCircles);

  circle_position_data.forEach(function(d, i) {
      d.i = i;
  });

  var circles = svg.selectAll("g")
      .data(circle_position_data);

  var g = circles.enter()
      .append("g");

  circles.exit().remove();

  // OUR CODE
  g.append('circle')
    .style("fill",	"red")
    .style('opacity', 0.5)
    .attr("id", function(d) { return "circleB_border" + d.i; })
    .attr("r",	65)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .call(d3.drag().on("drag", on_resize));

	g.append('circle')
	   .style("fill",	"gray")
	   .style('opacity', 0.5)
     .attr("id", function(d) { return "circleB" + d.i; })
	   .attr("r",	60)
     .attr("cx", function(d) { return d.x; })
     .attr("cy", function(d) { return d.y; })
     .call(d3.drag().on("drag", on_circle_drag));


  function on_resize(d, i) {
     g.select("#circleB_border" + d.i)
         .attr("r", function (c) {
             return Math.pow(Math.pow(this.attributes.cx.value - d3.event.x, 2) + Math.pow(this.attributes.cy.value - d3.event.y, 2), 0.5) + 5;
         });
     g.selectAll("#circleB" + d.i)
         .attr("r", function (c) {
             return Math.pow(Math.pow(this.attributes.cx.value - d3.event.x, 2) + Math.pow(this.attributes.cy.value - d3.event.y, 2), 0.5);
         });
  }

   function on_circle_drag(d, i) {
       g.select("#circleB" + d.i)
           .attr("cx", d.x = d3.event.x)
           .attr("cy", d.y = d3.event.y);

       g.select("#circleB_border" + d.i)
           .attr("cx", d.x = d3.event.x)
           .attr("cy", d.y = d3.event.y);
   }
}

d3.csv("/data/trees.csv", projectData, loadVisualization);
setTimeout(loadCircles, 500);