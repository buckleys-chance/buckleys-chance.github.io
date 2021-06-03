
fetch("/posts/template/data-miserables.json")
	.then(res => res.json())
	.then((data) => {
		plot(data);
	})
	.catch(err => { throw err });


function plot(data) {

	var width = width = document.querySelector("#graph-d3-example").clientWidth,
		height = 500,
		scale = d3.scaleOrdinal(d3.schemeCategory10);
	
	var svg = d3.select("#graph-d3-example");
	svg.attr("width", width)
	svg.attr("height", height);

	const links = data.links.map(d => Object.create(d));
	const nodes = data.nodes.map(d => Object.create(d));

	const simulation = d3.forceSimulation(nodes)
		.force("link", d3.forceLink(links).id(d => d.id))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(width / 2, height / 2));

	const link = svg.append("g")
		.attr("stroke", "#999")
		.attr("stroke-opacity", 0.6)
		.selectAll("line")
		.data(links)
		.join("line")
		.attr("stroke-width", d => Math.sqrt(d.value));

	drag = function(simulation) {

		function dragstarted(event) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;
		}

		function dragged(event) {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		}

		function dragended(event) {
			if (!event.active) simulation.alphaTarget(0);
			event.subject.fx = null;
			event.subject.fy = null;
		}

		return d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);
	}

	const node = svg.append("g")
		.attr("stroke", "#fff")
		.attr("stroke-width", 1.5)
		.selectAll("circle")
		.data(nodes)
		.join("circle")
		.attr("r", 5)
		.attr("fill", d => scale(d.group))
		.call(drag(simulation));

	simulation.on("tick", () => {
		link
			.attr("x1", d => d.source.x)
			.attr("y1", d => d.source.y)
			.attr("x2", d => d.target.x)
			.attr("y2", d => d.target.y);
		node
			.attr("cx", d => d.x)
			.attr("cy", d => d.y);
	});

}