


// ============================================================================== //
// ============================================================================== //
// SETUP ======================================================================== //
// ============================================================================== //

var width = document.querySelector("#fig-strategies").clientWidth,
	ratio = .75,
	height = 300, //ratio * width,
	m = [0, 0, 40, 120],
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

var stages = ["TRIGGER", "1", "1b", "2", "3", "4"],
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
			{from: "1", to: "4", id: "1-4", idx: 0},
			{from: "1b", to: "4", id: "1b-4", idx: 1},
			{from: "2", to: "4", id: "2-4", idx: 2},
			{from: "3", to: "4", id: "3-4", idx: 3},
		],
		width: 4,
		condition: '7-day average > 7.5'
	},
	{
		group: "B",
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
		group: "C",
		direction: 'tighten',
		arrows: [
			{from: "1", to: "2", id: "1-2", idx: 0},
			{from: "1b", to: "2", id: "1b-2", idx: 1},
		],
		width: 2,
		condition: '2+ cases in last 14 days'
	},
	{
		group: "D",
		direction: 'tighten',
		arrows: [
			{from: "1", to: "1b", id: "1-1b", idx: 0}
		],
		width: 1,
		condition: 'Any new case'
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
	"TRIGGER": "transparent"
}

// defs = svg.append('defs');
// grad = defs.append('linearGradient')
// 	.attr('id', '1-4')
// 	.attr('x1', 0)
// 	.attr('x2', .1)
// 	.attr('y1', 0.1)
// 	.attr('y2', .9);
// grad.append('stop').attr('offset', '0%').attr('stop-color', stageCols["1"]);
// grad.append('stop').attr('offset', '100%').attr('stop-color', stageCols["4"]);

function draw() {

	yScale = d3.scaleBand()
		.domain(stages)
		.range([m[0], h+m[0]]);

	xScaleGroup = d3.scaleBand()
		.domain(transitions.map(d => d.group))
		.range([m[3], width - yScale.bandwidth()/2 - m[1]])
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


	let brB = yScale.range()[1] + 10,
		brT = yScale.range()[1] + m[2]/2;

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
		.attr("y", yScale.range()[1] + m[2]/2)
		.text("TIGHTENING")
		.attr("alignment-baseline", "middle")
		.attr("text-anchor", "middle")
		.attr("fill", "#fff")
		.attr("stroke", "#fff")
		.attr("stroke-width", 10);

	bracketTextL = svg.append("text")
		.attr("class","alt-view")
		.attr("x", xScaleGroup("C"))
		.attr("y", yScale.range()[1] + m[2]/2)
		.text("TIGHTENING")
		.attr("alignment-baseline", "middle")
		.attr("text-anchor", "middle")
		.attr("fill", "#33691e");

	bracketTextR = svg.append("text")
		.attr("class","alt-view")
		.attr("x", xScaleGroup("G"))
		.attr("y", yScale.range()[1] + m[2]/2)
		.text("EASING")
		.attr("alignment-baseline", "middle")
		.attr("text-anchor", "middle")
		.attr("fill", "#fff")
		.attr("stroke", "#fff")
		.attr("stroke-width", 10);

	bracketTextR = svg.append("text")
		.attr("class","alt-view")
		.attr("x", xScaleGroup("G"))
		.attr("y", yScale.range()[1] + m[2]/2)
		.text("EASING")
		.attr("alignment-baseline", "middle")
		.attr("text-anchor", "middle")
		.attr("fill", "#33691e");


	let ybw = yScale.bandwidth();
	rows = svg.append("g")
		.attr("class","rows alt-view")
		.selectAll("path");
	rows
		.data(stages.filter(d => d != "TRIGGER"))
		.enter()
		.append("path")
		.attr("class", d => `alt-view row row-${d}`)
		.attr("d", d => {
			let y = yScale(d);
			return `M ${0} ${y} L ${width - ybw/4} ${y} L ${width} ${y + ybw/2} L ${width - ybw/4} ${y + ybw} L ${0} ${y + ybw} L ${ybw/4} ${y + ybw/2} Z`;
		})
		.attr("fill", d => stageCols[d])
		.attr("opacity", d => {
			return (d == "1") ? 1 : 0.2;
		});

	partialRows = svg.append("g")
		.attr("class","partial-rows alt-view")
		.selectAll("path");
	partialRows
		.data(transitions)
		.enter()
		.append("path")
		.attr("class", d => {
			let classes = ['alt-view', 'partial-row'];
			for (let a of d.arrows) {
				classes.push(`partial-row-${a.from}`);
			}
			return classes.join(' ');
		})
		.attr("d", d => {
			let y = yScale(d.arrows[0].to);
			let x = xScaleGroup(d.group) + aScales[1](0) + aScales[4].bandwidth()*.15 + aScales[4].bandwidth()*1 - 2;
			return `M ${x} ${y} ` +
				`L ${width - ybw/4} ${y} ` +
				`L ${width} ${y + ybw/2} ` +
				`L ${width - ybw/4} ${y + ybw} ` +
				`L ${x} ${y + ybw} ` +
				`Z`;
		})
		.attr("fill", d => stageCols[d.arrows[0].to])
		.attr("opacity", d => {
			return (d.arrows[0].from == "1") ? 1 : 1;
		});

	rowText = svg.append("g")
		.attr("class","rowText alt-view")
		.selectAll("text");
	rowText
		.data(stages)
		.enter()
		.append("text")
		.attr("class","alt-view")
		.attr("x", 25)
		.attr("y", d => yScale(d) + yScale.bandwidth() / 2)
		.text(d => (d == 'TRIGGER' ? "⤉⤈ TRIGGER" : `Stage ${d}`))
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

	let aw = aScales[4].bandwidth()*1;

	arrows = svg.append("g")
		.attr("class", "arrows alt-view")
		.selectAll("path");
	arrows
		.data(As.filter(d => d.hasOwnProperty("from")))
		.enter()
		.append("path")
		.attr("class", d => `alt-view arrow arrow-from-${d.from}`)
		.attr("d", d => {
			
			let isTightening = stages.indexOf(d.from) < stages.indexOf(d.to);

			let left = xScaleGroup(d.group) + aScales[1](0) + aScales[4].bandwidth()*.15,
				middle = left + aw/2,
				right = left + aw,

				start = (isTightening ? yScale(d.from) : yScale(d.from)),
				end = (isTightening ? yScale(d.to) : yScale(d.to) + ybw),
				point = (isTightening ? yScale(d.to) + aw/2 : yScale(d.to) + ybw - aw/2);

			if (isTightening) {
				return `M ${right - 1*ybw} ${start} ` +
					`L ${right - ybw} ${start} ` +
					`Q ${right} ${start}, ${right} ${start + ybw} ` +
					`L ${right} ${end} ` +
					// `L ${right} ${end - ybw} ` +
					// `Q ${right} ${end}, ${right + ybw} ${end} ` +
					`L ${right + ybw} ${end + ybw} ` +
					`L ${right} ${end + ybw} ` +
					`Q ${right - ybw} ${end + ybw}, ${right-ybw} ${end} ` +
					`L ${right - ybw} ${start + ybw} ` +
					// `L ${right - ybw} ${start + 2*ybw} ` +
					// `Q ${right - ybw} ${start + ybw}, ${right-2*ybw} ${start + ybw} ` +
					`Z `;
			} else {
				return `M ${right - ybw} ${start} ` +
					`Q ${right - ybw} ${start - ybw}, ${right} ${start - ybw} ` +
					`L ${right} ${start} ` +
					`Q ${right} ${end + ybw}, ${right - ybw} ${end + ybw} ` +
					`Z`;
				// return `M ${left} ${start} L ${right} ${start} L ${right} ${end} L ${middle} ${point} L ${left} ${end} Z`;
			}

		})
		// .attr("stroke", d => stageCols[d.from])
		.attr("fill", d => `url(#${d.from}-${d.to})`)
		.attr("opacity", d => {
			return (d.from == "1") ? 1 : 0;
		});
		// .attr("fill", d => stageCols[d.from]);
		// .attr("fill", "#ffffff");
	
	directions = svg.append("g")
		.attr("class", "directions alt-view")
		.selectAll("path");
	directions
		.data(As.filter(d => d.hasOwnProperty("from")))
		.enter()
		.append("path")
		.attr("class", d => `alt-view direction direction-from-${d.from}`)
		.attr("d", d => {

			let isTightening = stages.indexOf(d.from) < stages.indexOf(d.to);

			let y = 4,
				z = ybw + 15,
				a = 2*y,
				o = 10 + (ybw/2) - (y/2)
				r = 4*y,
				ra = (r + y) * (1 - (1/Math.sqrt(2))) + 2, // TODO - use an SVG arc then remove the +2 kluge
				v = 10,
				s = (isTightening ? 1 : -1);
			
			let x0 = xScaleGroup(d.group) + aScales[1](0) + aScales[4].bandwidth()*.15 + aw - ybw - 10,
				y0 = yScale(d.from) + yScale.bandwidth()/2,
				pth = `M ${x0} ${y0} `;

			pth = pth +
					`L ${x0} ${y0 - s*(y/2)} ` +
					`L ${x0 + z} ${y0 - s*(y/2)} ` +
					`L ${x0 + z} ${y0 - s*(y/2) - s*y} ` +
					`L ${x0 + z + a} ${y0} ` +
					`L ${x0 + z} ${y0 + s*(y/2) + s*y} ` +
					`L ${x0 + z} ${y0 + s*(y/2)} ` +
					`L ${x0 + o + y - ra} ${y0  - s*(y/2) + s*y} ` + // v1
					`Q ${x0 + o + y} ${y0 - s*(y/2) + s*y}, ${x0 + o + y} ${y0 - s*(y/2) + s*y + s*r} ` + // v2
					`L ${x0 + o + y} ${y0 - s*(y/2) + s*y + s*r + s*v} ` + // v3
					`L ${x0 + o + 2*y} ${y0 - s*(y/2) + s*y + s*r + s*v} ` + // v4
					`L ${x0 + o + (y/2)} ${y0 - s*(y/2) + s*y + s*r + s*v + s*a} ` + // v5
					`L ${x0 + o - y} ${y0 - s*(y/2) + s*y + s*r + s*v} ` + // v6
					`L ${x0 + o} ${y0 - s*(y/2) + s*y + s*r + s*v} ` + // v7
					`L ${x0 + o} ${y0 - s*(y/2) + s*y + s*r} ` + // v8
					`Q ${x0 + o} ${y0 - s*(y/2) + s*y}, ${x0 + o - r} ${y0 - s*(y/2) + s*y} ` + // v9
					`L ${x0} ${y0 -s*(y/2) + s*y} ` +
					`Z`;

			console.log(pth);
			
			return pth;
		})
		.attr("stroke", "#000000")
		.attr("fill", "#ffffff")
		.attr("opacity", d => {
			return (d.from == "1") ? 1 : 0;
		});
		

	hoverRows = svg.append("g")
		.attr("class","hover-rows alt-view")
		.selectAll("path");
	hoverRows
		.data(stages.filter(d => d != "TRIGGER"))
		.enter()
		.append("path")
		.attr("class","alt-view hover-row")
		.attr("d", d => {
			let y = yScale(d);
			return `M ${0} ${y} L ${width - ybw/4} ${y} L ${width} ${y + ybw/2} L ${width - ybw/4} ${y + ybw} L ${0} ${y + ybw} L ${ybw/4} ${y + ybw/2} Z`;
		})
		.attr("opacity", 0)
		.on("mouseover", function(d) {
			d3.selectAll(`.row`).attr('opacity', 0.2);
			d3.select(`.row-${d}`).attr('opacity', 1);

			d3.selectAll(`.partial-row`).attr('opacity', 0);
			d3.selectAll(`.partial-row-${d}`).attr('opacity', 1);

			d3.selectAll(`.arrow`).attr('opacity', 0);
			d3.selectAll(`.arrow-from-${d}`).attr('opacity', 1);

			d3.selectAll(`.direction`).attr('opacity', 0);
			d3.selectAll(`.direction-from-${d}`).attr('opacity', 1);
		});


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
		.attr("y", yScale("TRIGGER") + yScale.bandwidth()/2)
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