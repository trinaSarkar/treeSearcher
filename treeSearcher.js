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
    'lat' : dataPoint.Latitude,
    'TreeID': dataPoint.TreeID,
    'qSpecies': dataPoint.qSpecies,
    'qAddress': dataPoint.qSpecies,
    'DBH': parseInt(dataPoint.DBH)
  }
};

function loadVisualization(error, allData) {
  if (error) throw error; 
  let input = d3.selectAll('input');
  drawScatterPlot(allData);
  input.on('change', function() {
    d3.select('.range-slider__value').html(this.value);
    let filteredData = allData.filter(d => d.DBH < this.value && d.DBH != "");
    drawScatterPlot(filteredData);  
  });
  let button = d3.selectAll('button');
  button.on("click", function() {
    let r1 = d3.select('#circle_border0').attr('r');
    var circle1 = [d3.select('#circle_border0').attr('cx'), d3.select('#circle_border0').attr('cy')];
    let r2 = d3.select('#circle_border1').attr('r');
    var circle2 = [d3.select('#circle_border1').attr('cx'), d3.select('#circle_border1').attr('cy')];
    let filteredData = allData.filter(function(d) {
      var point = projection([d.lon, d.lat]);
      return pointInCircle(point[0], point[1], circle1[0], circle1[1], r1) && 
      pointInCircle(point[0], point[1], circle2[0], circle2[1], r2);
      drawScatterPlot(filteredData); 
    });
    drawScatterPlot(filteredData);
  });
  loadCircles();
};

function drawScatterPlot(allData) {
  let circles = svg.selectAll('circle:not(.rangeCircle)');
  let updatedCircles = circles.data(allData, d => d.id);

  let enterSelection = updatedCircles.enter();
  let newCircles = enterSelection.append('circle')
  .style("fill",  "pink")
  .attr('id', 'dataPoints')
  .attr("r",  3)
  .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
  .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
  .on('mouseover', function(d){
    var qSpecies = '<b>Species:                          </b>' + d.qSpecies;
    var DBH = '<b>Diameter in Breast Height (inches):    </b>' + d.DBH;
    document.getElementById('qSpecies').innerHTML = qSpecies;
    document.getElementById('DBH').innerHTML = DBH;
  });

  let unselectedCircles = updatedCircles.exit();
  updatedCircles.exit().remove(); 
};

function loadCircles() {
  var currCircles = 2;
  circle_position_data = d3.range(currCircles).map(function() {
    return {
      x: mapWidth/2,
      y: mapHeight/2
    };
  });
  circle_position_data.forEach(function(d, i) {
    d.i = i;
  });
  var circles = svg.selectAll("g")
  .data(circle_position_data);
  var g = circles.enter()
  .append("g");
  circles.exit().remove();

  g.append('circle')
  .style("fill",  "red")
  .style('opacity', 0.5)
  .attr("id", function(d) { return "circle_border" + d.i; })
  .attr("class", "rangeCircle")
  .attr("r",  65)
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .call(d3.drag().on("drag", on_resize));

  g.append('circle')
  .style("fill", "gray")
  .style('opacity', 0.5)
  .attr("id", function(d) { return "circle" + d.i; })
  .attr("class", "rangeCircle")
  .attr("r", 60)
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .call(d3.drag().on("drag", on_circle_drag));

  function on_resize(d, i) {
   g.select("#circle_border" + d.i)
   .attr("r", function (c) {
     return Math.pow(Math.pow(this.attributes.cx.value - d3.event.x, 2) + Math.pow(this.attributes.cy.value - d3.event.y, 2), 0.5) + 5;
   });
   g.selectAll("#circle" + d.i)
   .attr("r", function (c) {
     return Math.pow(Math.pow(this.attributes.cx.value - d3.event.x, 2) + Math.pow(this.attributes.cy.value - d3.event.y, 2), 0.5);
   });
 };

 function on_circle_drag(d, i) {
   g.select("#circle" + d.i)
   .attr("cx", d.x = d3.event.x)
   .attr("cy", d.y = d3.event.y);

   g.select("#circle_border" + d.i)
   .attr("cx", d.x = d3.event.x)
   .attr("cy", d.y = d3.event.y);
 };
};

function pointInCircle(x_p, y_p, x_c, y_c, r) {
  return (distance(x_p, y_p, x_c, y_c) < r); 
};

function distance(x_p, y_p, x_c, y_c) {
  return Math.sqrt(Math.pow(x_p - x_c, 2) + Math.pow(y_p - y_c,2));
};

function update(rangeVal) {
  d3.select("#dbhRange-value").text(rangeVal);
  d3.select("#dbhRange").property("value", rangeVal);
};

d3.csv("/data/trees.csv", projectData, loadVisualization);
