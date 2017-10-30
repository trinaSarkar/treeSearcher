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
    let filteredData = allData.filter(d => d.DBH < this.value && d.DBH != "");
    drawScatterPlot(filteredData);  
  });
  loadCircles();
};

function drawScatterPlot(allData) {
  let circles = svg.selectAll('circle:not(.rangeCircles)');
  let updatedCircles = circles.data(allData, d => d.id);

  let enterSelection = updatedCircles.enter();
  let newCircles = enterSelection.append('circle')
  .style("fill",  "pink")
  .attr("r",  4)
  .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
  .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
  .on('mouseover', function(d){
    var TreeID = 'Tree ID:                            ' + d.TreeID;
    var qSpecies = 'Species:                          ' + d.qSpecies;
    var DBH = 'Diameter in Breast Height (inches):    ' + d.DBH;

    document.getElementById('TreeID').innerHTML = TreeID;
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
  .attr("class", "rangeCircles")
  .attr("r",  65)
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .call(d3.drag().on("drag", on_resize));

  g.append('circle')
  .style("fill", "gray")
  .style('opacity', 0.5)
  .attr("id", function(d) { return "circle" + d.i; })
  .attr("class", "rangeCircles")
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

function loadIntersection() {
  // loadCircles();
  var interPoints = intersection(d3.select('#circle_border0').attr('cx'), 
    d3.select('#circle_border0').attr('cy'), 
    d3.select('#circle_border0').attr('r'), 
    d3.select('#circle_border1').attr('cx'), 
    d3.select('#circle_border1').attr('cy'), 
    d3.select('#circle_border1').attr('r'));

svg.append('circle')
  .style("fill",  "red")
  .attr("r",  5)
  .attr("cx", interPoints[0])
  .attr("cy", interPoints[2])

svg.append('circle')
  .style("fill",  "red")
  .attr("r",  5)
  .attr("cx", interPoints[1])
  .attr("cy", interPoints[3])

  // g.append("path")
  // .attr("d", function() {
  //   return "M" + interPoints[0] + "," + interPoints[2] + "A" + r1 + "," + r2 +
  //     " 0 0,1 " + interPoints[1] + "," + interPoints[3]+ "A" + r1 + "," + r2 +
  //     " 0 0,1 " + interPoints[0] + "," + interPoints[2];
  // })
  // .style('fill', 'red');   
};

function update(rangeVal) {
  d3.select("#dbhRange-value").text(rangeVal);
  d3.select("#dbhRange").property("value", rangeVal);
};

function intersection(x0, y0, r0, x1, y1, r1) {
        var a, dx, dy, d, h, rx, ry;
        var x2, y2;

        /* dx and dy are the vertical and horizontal distances between
         * the circle centers.
         */
        dx = x1 - x0;
        dy = y1 - y0;

        /* Determine the straight-line distance between the centers. */
        d = Math.sqrt((dy*dy) + (dx*dx));

        /* Check for solvability. */
        if (d > (r0 + r1)) {
            /* no solution. circles do not intersect. */
            return false;
        }
        if (d < Math.abs(r0 - r1)) {
            /* no solution. one circle is contained in the other */
            return false;
        }

        /* 'point 2' is the point where the line through the circle
         * intersection points crosses the line between the circle
         * centers.  
         */

        /* Determine the distance from point 0 to point 2. */
        a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

        /* Determine the coordinates of point 2. */
        x2 = x0 + (dx * a/d);
        y2 = y0 + (dy * a/d);

        /* Determine the distance from point 2 to either of the
         * intersection points.
         */
        h = Math.sqrt((r0*r0) - (a*a));

        /* Now determine the offsets of the intersection points from
         * point 2.
         */
        rx = -dy * (h/d);
        ry = dx * (h/d);

        /* Determine the absolute intersection points. */
        var xi = parseInt(x2) + parseInt(rx);
        var xi_prime = parseInt(x2) - parseInt(rx);
        var yi = parseInt(y2) + parseInt(ry);
        var yi_prime = parseInt(y2) - parseInt(ry);

        return [xi, xi_prime, yi, yi_prime];
    };

d3.csv("/data/trees.csv", projectData, loadVisualization);
