


// ============================================================================== //
// ============================================================================== //
// SETUP ======================================================================== //
// ============================================================================== //

var width = document.querySelector("#fig-strategies").clientWidth,
	ratio = .75,
	height = 300, //ratio * width,
	m = [25, 0, 0, 120],
	w = width - m[1] - m[3],
	h = height - m[0] - m[2];

var svg = d3.select("#fig-strategies");

svg.attr("height", height);

function redraw() {
	d3.selectAll(".alt-view").remove();
	draw();
}

d3.select(window)
	.on("resize", function() {
		
		width = document.querySelector("#fig-strategies").clientWidth;
		// height = 600, // ratio * width;
		w = width - m[1] - m[3];
		h = height - m[0] - m[2];
		
		svg.attr("height", height);
		
		redraw();
	});

var xScale, yScale;

// ============================================================================== //
// ============================================================================== //
// DRAW ========================================================================= //
// ============================================================================== //

var stages = ["1", "1b", "2", "3", "4", "THRESHOLD"],
	transitions = [];

for (let s1 of stages) {
	for (let s2 of stages) {
		if (s1 != s2) {
			transitions.push({from: s1, to: s2, id: `${s1}-${s2}`});
		}
	}
}

transitions = [
	{
		group: "A",
		direction: 'tighten',
		arrows: [
			{from: "1", to: "1b", id: "1-1b", idx: 0}
		],
		width: 1,
		condition: 'Any new case'
	},
	{
		group: "B",
		direction: 'tighten',
		arrows: [
			{from: "1", to: "2", id: "1-2", idx: 0},
			{from: "1b", to: "2", id: "1b-2", idx: 1},
		],
		width: 2,
		condition: '2+ cases in last 14 days'
	},
	{
		group: "C",
		direction: 'tighten',
		arrows: [
			{from: "1", to: "3", id: "1-3", idx: 0},
			{from: "1b", to: "3", id: "1b-3", idx: 1},
			{from: "2", to: "3", id: "2-3", idx: 2},
		],
		width: 3,
		condition: '7-day average > 1.5'
	},
	{
		group: "D",
		direction: 'tighten',
		arrows: [
			{from: "1", to: "4", id: "1-4", idx: 0},
			{from: "1b", to: "4", id: "1b-4", idx: 1},
			{from: "2", to: "4", id: "2-4", idx: 2},
			{from: "3", to: "4", id: "3-4", idx: 3},
		],
		width: 4,
		condition: '7-day average > 7.5'
	},
	{
		group: "E",
		direction: 'relax',
		arrows: [
			{from: "4", to: "3", id: "4-3", idx: 0},
		],
		width: 1,
		condition: '7-day average < 5'
	},
	{
		group: "F",
		direction: 'relax',
		arrows: [
			{from: "3", to: "2", id: "3-2", idx: 0},
		],
		width: 1,
		condition: '7-day average < 1'
	},
	{
		group: "G",
		direction: 'relax',
		arrows: [
			{from: "2", to: "1b", id: "2-1b", idx: 0},
		],
		width: 1,
		condition: 'No cases in 7 days'
	},
	{
		group: "H",
		direction: 'relax',
		arrows: [
			{from: "1b", to: "1", id: "1b-1", idx: 0},
		],
		width: 1,
		condition: 'No cases in 28 days'
	},
]

let As = [];
for (let t of transitions) {
	t.arrows.forEach(function(d) {
		d.group = t.group;
		d.width = t.width;
	})
	As = As.concat(t.arrows);
	As.push({id: `spacer-${t.group}`});
}
As.pop();

var stageCols = {
	"1": "#ebf0e9",
	"1b": "#d6e1d2",
	"2": "#c2d2bc",
	"3": "#adc3a5",
	"4": "#99b48f",
	"THRESHOLD": "transparent"
}

function draw() {

	xScaleGroup = d3.scaleBand()
		.domain(transitions.map(d => d.group))
		.range([m[3], width - m[1]])
		.paddingInner(.1)
		.paddingOuter(.1)

	let aScales = {},
		bw;
	aScales[4] = d3.scaleBand()
		.domain([0,1,2,3])
		.range([0, xScaleGroup.bandwidth()])
		.paddingInner(0)
		.paddingOuter(0)
	for (let k = 3; k > 0; k--) {
		aScales[k] = d3.scaleBand()
			.domain([...Array(k).keys()])
			.range([0, xScaleGroup.bandwidth()])
			.paddingInner(0)
			.paddingOuter((4-k)/2)

	}

	yScale = d3.scaleBand()
		.domain(stages)
		.range([m[0], h+m[0]])

	let brB = yScale.range()[0] - 3,
		brT = yScale.range()[0] - m[0]/2;

	bracketL = svg.append("path")
		.attr("class", "alt-view")
		.attr("d", `M ${xScaleGroup("A")} ${brB} L ${xScaleGroup("A")} ${brT} L ${xScaleGroup("D") + xScaleGroup.bandwidth()} ${brT} L ${xScaleGroup("D") + xScaleGroup.bandwidth()} ${brB}`)
		.attr("stroke", "#33691e")
		.attr("fill", "transparent");

	bracketR = svg.append("path")
		.attr("class", "alt-view")
		.attr("d", `M ${xScaleGroup("E")} ${brB} L ${xScaleGroup("E")} ${brT} L ${xScaleGroup("H") + xScaleGroup.bandwidth()} ${brT} L ${xScaleGroup("H") + xScaleGroup.bandwidth()} ${brB}`)
		.attr("stroke", "#33691e")
		.attr("fill", "transparent");

	bracketTextL = svg.append("text")
		.attr("class","alt-view")
		.attr("x", xScaleGroup("C"))
		.attr("y", yScale.range()[0] - m[0]/2)
		.text("TIGHTENING")
		.attr("alignment-baseline", "middle")
		.attr("text-anchor", "middle")
		.attr("fill", "#fff")
		.attr("stroke", "#fff")
		.attr("stroke-width", 10);

	bracketTextL = svg.append("text")
		.attr("class","alt-view")
		.attr("x", xScaleGroup("C"))
		.attr("y", yScale.range()[0] - m[0]/2)
		.text("TIGHTENING")
		.attr("alignment-baseline", "middle")
		.attr("text-anchor", "middle")
		.attr("fill", "#33691e");

	bracketTextR = svg.append("text")
		.attr("class","alt-view")
		.attr("x", xScaleGroup("G"))
		.attr("y", yScale.range()[0] - m[0]/2)
		.text("EASING")
		.attr("alignment-baseline", "middle")
		.attr("text-anchor", "middle")
		.attr("fill", "#fff")
		.attr("stroke", "#fff")
		.attr("stroke-width", 10);

	bracketTextR = svg.append("text")
		.attr("class","alt-view")
		.attr("x", xScaleGroup("G"))
		.attr("y", yScale.range()[0] - m[0]/2)
		.text("EASING")
		.attr("alignment-baseline", "middle")
		.attr("text-anchor", "middle")
		.attr("fill", "#33691e");


	rows = svg.append("g")
		.attr("class","rows alt-view")
		.selectAll("rect");
	rows
		.data(stages)
		.enter()
		.append("rect")
		.attr("class","alt-view")
		.attr("x", 0)
		.attr("y", d => yScale(d))
		.attr("width", width)
		.attr("height", yScale.bandwidth())
		.attr("fill", d => stageCols[d]);

	rowText = svg.append("g")
		.attr("class","rowText alt-view")
		.selectAll("text");
	rowText
		.data(stages)
		.enter()
		.append("text")
		.attr("class","alt-view")
		.attr("x", 20)
		.attr("y", d => yScale(d) + yScale.bandwidth() / 2)
		.text(d => (d == 'THRESHOLD' ? d : `Stage ${d}`))
		.attr("alignment-baseline", "central")
		.attr("fill", "#33691e");

	// circs = svg.append("g")
	// 	.attr("class","circs alt-view")
	// 	.selectAll("circle");
	// circs
	// 	.data(stages)
	// 	.enter()
	// 	.append("circle")
	// 	.attr("class","alt-view")
	// 	.attr("cx", d => xScale(d) + xScale.bandwidth()/2)
	// 	.attr("cy", d => yScale(d) + yScale.bandwidth()/2)
	// 	.attr("r", 5)
	// 	.attr("fill", "#000000");

	let aw = aScales[4].bandwidth()*.7,
		ybw = yScale.bandwidth();

	arrows = svg.append("g")
		.attr("class", "arrows alt-view")
		.selectAll("path");
	arrows
		.data(As.filter(d => d.hasOwnProperty("from")))
		.enter()
		.append("path")
		.attr("class", "alt-view")
		.attr("d", d => {
			
			let isTightening = stages.indexOf(d.from) < stages.indexOf(d.to);

			let left = xScaleGroup(d.group) + aScales[d.width](d.idx) + aScales[4].bandwidth()*.15,
				middle = left + aw/2,
				right = left + aw,
				start = (isTightening ? yScale(d.from) + ybw : yScale(d.from)),
				end = (isTightening ? yScale(d.to) : yScale(d.to) + ybw),
				point = (isTightening ? yScale(d.to) + aw/2 : yScale(d.to) + ybw - aw/2);

			if (isTightening) {
				return `M ${left} ${start} L ${right} ${start} L ${right} ${end} L ${middle} ${point} L ${left} ${end} Z`;
			} else {
				return `M ${left} ${start} L ${right} ${start} L ${right} ${end} L ${middle} ${point} L ${left} ${end} Z`;
			}

		})
		.attr("stroke", d => stageCols[d.from])
		// .attr("fill", "#ffffff")
		.attr("fill", d => stageCols[d.from]);
	
	let gbw = xScaleGroup.bandwidth();

	conditions = svg.append("g")
		.attr("class","conditions alt-view")
		.selectAll("text");
	conditions
		.data(transitions)
		.enter()
		.append("text")
		.attr("class","alt-view")
		.attr("x", d => xScaleGroup(d.group) + gbw/2)
		.attr("y", yScale("THRESHOLD") + yScale.bandwidth()/2)
		.text(d => d.condition)
		.attr("alignment-baseline", "central")
		.attr("text-anchor", "middle");
}

draw();
	
// 	digitsNumCoreTitle = svg.append("text")
// 		.text("n")
// 		.attr("x", m[3])
// 		.attr("y", m[0] + height - 60)
// 		.attr("class", "annotation alt-view")
// 		.attr("text-anchor","end")
// 		.attr("opacity", Number(page.params.numbers));

// 	digitsAvgCoreTitle = svg.append("text")
// 		.text("AVG")
// 		.attr("x", m[3])
// 		.attr("y", m[0] + height - 40 + 20*Number(page.params.comparisonSet != "none"))
// 		.attr("class", "annotation alt-view")
// 		.attr("text-anchor","end")
// 		.attr("opacity", Number(page.params.numbers & page.params.averages));

// 	digitsNumCompTitle = svg.append("text")
// 		.text("n")
// 		.attr("x", m[3])
// 		.attr("y", m[0] + height - 40)
// 		.attr("class", "annotation alt-view")
// 		.attr("text-anchor","end")
// 		.attr("fill", "hsla(0, 100%, 50%, 1)")
// 		.attr("opacity", Number(page.params.numbers & page.params.comparisonSet != "none"));

// 	digitsAvgCompTitle = svg.append("text")
// 		.text("AVG")
// 		.attr("x", m[3])
// 		.attr("y", m[0] + height)
// 		.attr("class", "annotation alt-view")
// 		.attr("text-anchor","end")
// 		.attr("fill", "hsla(0, 100%, 50%, 1)")
// 		.attr("opacity", Number(page.params.numbers & page.params.averages & page.params.comparisonSet != "none"));

// 	svg.append("g")
// 		.attr("class", "xAxis alt-view")
// 		.attr("transform", "translate(0," + (h + m[0]) + ")")
// 		.call(xAxis);
// 	svg.append("g")
// 		.attr("class", "yAxis alt-view")
// 		.attr("transform", "translate(" + Math.round(m[3]) + ",0)")
// 		.call(yAxis)
// 		.selectAll(".tick text")
//       	.call(util.wrap, 60)
//       	.attr("transform", "translate(-10,0)");


// 	dataCore = coagulateCore(page.dataCore, H);
// 	dataComp = coagulateComp(page.rawComp, H);



// // ########################################################################## //
// // ########################################################################## //
// // ########################################################################## //

// page.update = function() {
// 	update[page.params.graphType]();
// }

// // ########################################################################## //
// // ########################################################################## //
// // ########################################################################## //




// console.log(svg)