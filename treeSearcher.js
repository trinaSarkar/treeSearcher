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

// Add SVG map at correct size, assuming map is saved in a subdirectory called `data`
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

	svg.append('circle')
	   .style("fill",	"gray")	
	   .style('opacity', 0.5)
	   .attr('id', "circleB")											
	   .attr("r",	60)
	   .attr('cx', mapWidth/2)
	   .attr('cy', mapHeight/2)
	   .attr('stroke', 'black')
	   .attr('stroke-width', '3')
	   .call(d3.drag().on("drag",	function() {
	   	d3.select(this)
	   	.attr("cx",	d3.event.x)
		.attr("cy", d3.event.y);
	   } ));

  svg.append('circle')
	   .style("fill",	"gray")	
	   .style('opacity', 0.5)	
	   .attr('id', "circleA")										
	   .attr("r",	60)
	   .attr('cx', mapWidth/2 - 150)
	   .attr('cy', mapHeight/2 + 150)
	   .attr('stroke', 'black')
	   .attr('stroke-width', '3')
	   .call(d3.drag().on("drag",	function() {
	   	d3.select(this)
	   	.attr("cx",	d3.event.x)
		.attr("cy", d3.event.y);
	   } ));
}



d3.csv("/data/trees.csv", projectData, loadVisualization);
setTimeout(loadCircles, 500); 

