d3.csv("data/data.csv", projectData, loadVisualization);

var svg = d3.select('body').append('svg')
.attr('id', 'bodySVG')
.attr('width', 1500)
.attr('height', 1500)

var toolTip = d3.select("body").append("div")	
.attr("class", "tooltip")	
.style("opacity", 0);


document.addEventListener("DOMContentLoaded", function(event) {
    var posBtn = document.getElementById('positive');
    posBtn.onclick = function () {
    	var negatives = document.getElementsByClassName("negativeOutcome")
    	if (!posBtn.checked) {
    		for (var i = 0; i < negatives.length; i++) {
    		 	var img = negatives[i].children[2];
    			img.style.opacity = "1.0"

    		}
    	} else {
    		for (var i = 0; i < negatives.length; i++) {
    		 	var img = negatives[i].children[2];
    			img.style.opacity = "0.2"
    		 }
    	}
    }

    var negBtn = document.getElementById('negative');
    negBtn.onclick = function () {
    	var positives = document.getElementsByClassName("positiveOutcome");
    	if (!negBtn.checked) {
    		for (var i = 0; i < positives.length; i++) {
    			var img = positives[i].children[2];
    			img.style.opacity = "1.0"
    		}
    	} else {
    		for (var i = 0; i < positives.length; i++) {
    			var img = positives[i].children[2];
    			img.style.opacity = "0.2"
    		 }
    	}
    }

    var admitBtn = document.getElementById('allegationBtn');
    admitBtn.onclick = function () {
    	var admits = document.getElementsByClassName("admitted")
    	if (!admitBtn.checked) {
    		for (var i = 0; i < admits.length; i++) {
    		 	var img = admits[i].children[2];
    			img.style.opacity = "1.0"
    		}
    	} else {
    		for (var i = 0; i < admits.length; i++) {
    		 	var img = admits[i].children[2];
    			img.style.opacity = "0.2"
    		 }
    	}
    }

    var hollyBtn = document.getElementById('hollywoodBtn');
    hollyBtn.onclick = function () {
    	var hollywood = document.getElementsByClassName("hollywood");
    	if (!hollyBtn.checked) {
    		for (var i = 0; i < hollywood.length; i++) {
    		 	var img = hollywood[i].children[2];
    			img.style.opacity = "1.0"
    		}
    	} else {
    		for (var i = 0; i < hollywood.length; i++) {
    		 	var img = hollywood[i].children[2];
    			img.style.opacity = "0.2"
    		 }
    	}
    }

    var washBtn = document.getElementById('washingtonBtn');
    washBtn.onclick = function () {
    	var washington = document.getElementsByClassName("washington");
    	if (!washBtn.checked) {
    		for (var i = 0; i < washington.length; i++) {
    		 	var img = washington[i].children[2];
    			img.style.opacity = "1.0"
    		}
    	} else {
    		for (var i = 0; i < washington.length; i++) {
    		 	var img = washington[i].children[2];
    			img.style.opacity = "0.2"
    		 }
    	}
    }

    var denyBtn = document.getElementById('deniedBtn');
    denyBtn.onclick = function () {
    	var denied = document.getElementsByClassName("denied");
    	if (!denyBtn.checked) {
    		for (var i = 0; i < denied.length; i++) {
    		 	var img = denied[i].children[2];
    			img.style.opacity = "1.0"
    		}
    	} else {
    		for (var i = 0; i < denied.length; i++) {
    		 	var img = denied[i].children[2];
    			img.style.opacity = "0.2"
    		 }
    	}
    }
});

var index = 0; 
var outcomes = []; 
function projectData(dataPoint) {
	return {
		'industry' : dataPoint.Industry,
		'occupation' : dataPoint.Occupation,
		'person': dataPoint.Person, 
		'year': dataPoint.Year,
		'content': dataPoint.Content,
		'type': dataPoint.Type,
		'id': dataPoint.ID,
		'source': dataPoint.Source
	}
};

function filter(name) {
	let filteredData = dataset.filter(function(d) {
		return d.type != "Outcome" && d.person == name.innerText; 
	});
	return filteredData; 
}

function filterOutcomes() {
	let outcomeData = dataset.filter(function (d) {
		if (d.type == "Outcome") {
			var firstName = d.person.split(" ")[0].toLowerCase();
			outcomes[firstName] = d.content; 
		}
	});
}

function loadVisualization(error, allData) {
	window.dataset = allData; 
	if (error) throw error;
	var names = document.getElementsByClassName('name'); 
	filterOutcomes();
	for (var i = 0; i < names.length; i++) {
		drawTimeline(filter(names[i]), names[i]);
		drawOutcomes(names[i]);
	}
	drawLegend();
	
}

function getHeight(content) {
	if (content.length > 200) {
		return 250;
	}
	if (content.length > 100) {
		return 200;
	} else if (content.length > 50) {
		return 150;
	} else if (content.length > 30) {
		return 100; 
	} else {
		return 50;
	}
}

function drawTimeline(filterData, name) {
	var firstname = name.innerText.split(" ")[0].toLowerCase();
	var timeline = document.getElementById(firstname);
	var box = timeline.getBoundingClientRect();
	var y = box.y;
	var x = box.x;
	var yOffset = 0;
	let lines = svg.selectAll('line.'+firstname)
	.data(filterData)
	.enter()
	.append("line");
	let lineAttr =  lines.attr("x1", function(d) {
		if (d.type == "Allegation") return x;
		else if (d.type == "Achievement")return x + 32;})
	.attr("y1", function(d) { return y + ((d.year - 1960) * 10);})
	.attr("x2",function(d) {
		if (d.type == "Allegation") return x + 32;
		else if (d.type == "Achievement")return x + 64;})
	.attr("y2", function(d) {return y + ((d.year - 1960) * 10);})
	.attr("stroke-width", 3)
	.attr("stroke", function(d) {
		if (d.type == "Allegation") return "red";
		else if (d.type == "Achievement") return "green";
	})
	.attr('id', function(d) { return d.id})
	.on("mouseover", function(d) {		
		toolTip.transition()		
		.duration(200)		
		.style("opacity", .9);		
		toolTip.html(d.year + "<br/>"  + d.content)	
		.style("left", (d3.event.pageX) + "px")		
		.style("top", (d3.event.pageY - 28) + "px")
		.style("height", getHeight(d.content));	
	})					
	.on("mouseout", function(d) {		
		toolTip.transition()		
		.duration(500)		
		.style("opacity", 0);	
	});
};

function drawLegend() {
	var rect = document.getElementById('legend').getBoundingClientRect();
	let lines = svg.selectAll('line')
	.append('line')
	var x = rect.x;
	var y = rect.y
	var newyear = 1960; 
	var yoffset = 0;
	for (var i = 0; i < 7; i++) {
		svg.append('text')
		.attr("x", x)
		.attr("y", y + yoffset)
		.text(newyear)
		.attr("font-family", "sans-serif")
		.attr("font-size", "15px")
		.attr("fill", "#696969");
		newyear += 10;
		yoffset = (newyear - 1960) * 10; 
	}
};

function drawOutcomes(name) {
	var firstname = name.innerText.split(" ")[0].toLowerCase();
	var timeline = document.getElementById(firstname);
	var outcome = outcomes[firstname];
	var box = timeline.getBoundingClientRect();
	var y = box.y;
	var x = box.x;
    svg.append("circle")
    .attr("cx", x + 33) 
                          .attr("cy", y + 595)
                          .attr("r", 5)
                          .style("fill", 'black')
                          .on("mouseover", function() {	
							toolTip.transition()		
							.duration(200)		
							.style("opacity", .9);		
							toolTip.html(outcome)	
							.style("left", (d3.event.pageX) + "px")		
							.style("top", (d3.event.pageY - 28) + "px")
							.style("height", 100);	
						})					
						.on("mouseout", function(d) {		
							toolTip.transition()		
							.duration(500)		
							.style("opacity", 0);	
						});;	
}



