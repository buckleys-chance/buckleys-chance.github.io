module.exports = function(eleventyConfig) {

	// Add filter to extract toggle specification from graph specification.
	
	const fs = require('fs');
	eleventyConfig.addFilter("get_graph_spec", function(name, slug) {

		let spec = JSON.parse(fs.readFileSync(`../src/posts/${slug}/graph-${name}.json`).toString()),
			BC = {};

		if (spec.hasOwnProperty('BC')) {
			BC = spec.BC;
		}

		return BC;

	})

	// Add shortcode to import custom elements (d3 graphs, tables etc.).

	eleventyConfig.addShortcode("import_content", function(name, slug) {

		let html = fs.readFileSync(`../src/posts/${slug}/${name}.html`).toString();

		// Load CSS, if it exists.
		try {
			if (fs.existsSync(`../src/posts/${slug}/${name}.css`)) {
				html += `<script type="text/javascript">
					loadCSS("/posts/${slug}/${name}.css");
				</script>`;
			}
		} catch(error) {
			console.error(error);
		}

		// Load javascript, if it exists.
		try {
			if (fs.existsSync(`../src/posts/${slug}/${name}.js`)) {
				html += `<script src="/posts/${ slug }/${ name }.js"></script>`
			}
		} catch(error) {
			console.error(error);
		}

		return html;

	})

	// Add shortcode to generate Vega dashboard-style graphs.

	eleventyConfig.addShortcode("import_graph", function(name, slug) {
		

		let BC = eleventyConfig.getFilter("get_graph_spec")(name, slug),
			toggle_specs = [],
			toggles = ``;

		if (BC.hasOwnProperty('toggle-groups')) {
			toggle_specs = BC['toggle-groups'];
		}

		for (let toggle_group of toggle_specs) {
			
			let toggle_group_contents = ``;
			for (let toggle of toggle_group.toggles) {

				toggle_group_contents += `<div class="toggle-box">
				<div>
					<div class="name">${ toggle.title }</div>
					<div class="description">${ toggle.description }</div>
				</div>
				<div>`;

							
				if (toggle.type == "range") {
					
					toggle_group_contents += `<input type="range" name="a" id="a" min="1" max="3" step="1" value="2" autocomplete=off>`;
					// custom input slider: https://codepen.io/trevanhetzel/pen/rOVrGK

				} else if (toggle.type == "select") {
					
					let slug = eleventyConfig.getFilter('slug');

					toggle_group_contents += `<select name="${ toggle.signalName }" id="select-${name}-${ toggle.signalName }" autocomplete=off>
						${toggle.options.map(option => `<option value="${option.value}" ${option.default ? 'selected' : ''}>${option.label ? option.label : option.value}</option>`).join('\n')}
					</select>`
					// https://joshuajohnson.co.uk/Choices/

				}
				
				toggle_group_contents += `</div></div>`;

			}

			toggles += `<div class="toggle-group">${toggle_group.hasOwnProperty('name') ? `<div class="group-details">
					<div class="group-name">${toggle_group.name}</div>
				</div>` : ``}
				<div class="group-contents">
					${toggle_group_contents}
				</div>
			</div>`;
		}

		// let downloadLink = '';
		// if (BC.hasOwnProperty('data-download')) {
		// 	downloadLink = `<a href="${BC['data-download'].href}" class="download-link"><strong>Download data</strong> (${BC['data-download'].size})</a>`
		// }

		if (toggle_specs.length > 0) {
			toggles = `<div class="toggles">${toggles}</div>`;
		}

		let figPosition = BC.hasOwnProperty("figPosition") ? BC.figPosition : 'inset',
			increaseMargin = BC.hasOwnProperty("increaseMargin") ? BC.increaseMargin : 1;

		let html = `<div class="fig ${figPosition} increase-margin-${increaseMargin}">
				<div id="graph-container-${name}" class="graph-container"></div>${toggles}</div>
			<script type="text/javascript">
				graphs.push("${name}")
			</script>
		`;

		return html;
	});





	// Add markdown filter.
	var options = {
		html: true,
		typographer: true
	};
	var md = require('markdown-it')(options);
	
	eleventyConfig.addFilter("markdown", function(rawString) {
		return md.render(rawString);
	});

	// Add RSS date format filter.
	eleventyConfig.addFilter("RSSdate", function(value) {
		var d = (new Date(value)),
			months = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec"
			],
			days = [
				"Sun",
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat"
			];

		var date = d.getDate();
		if (String(date).length == 1) {
			date = '0' + date;
		}

		return(days[d.getDay()] + ', ' + date + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' 07:00:00 +1000');
	});

	// Add filter to remove hidden posts from collections.post.
	eleventyConfig.addFilter("removeHiddenPostsAndPages", function(collection) {
		let rval = [];
		for (let p of collection) {
			if (!p.data.hasOwnProperty('hidden') || !p.data.hidden) {
				if (!p.data.tags.includes('page')) {
					rval.push(p);
				}
			}
		}
		return rval;
	});


	// Add date format filter.
	eleventyConfig.addFilter("readable_date", function(value) {
		if (value === undefined) {
			return '';
		}

		var d = (new Date(value)),
			months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			];

		var date = d.getDate();

		return(`${date}&nbsp;${months[d.getMonth()].substr(0,3)}&nbsp;${d.getFullYear()}`);
	});

	// Add year filter for dates.
	eleventyConfig.addFilter("get_year", function(value) {
		if (value === undefined) {
			return '';
		}

		var d = (new Date(value));

		return(`${d.getFullYear()}`);
	});

	// Add filter to format authors for BibTeX.
	eleventyConfig.addFilter("bibtex_authors", function(authors) {
		if (authors === undefined) {
			return '';
		}

		return authors
			.map(a => `${a.name.last}, ${a.name.first}`)
			.join(' and ');
	});

	eleventyConfig.addFilter("citation_authors", function(authors) {
		if (authors === undefined) {
			return '';
		}

		let txt = '';
		for (let k = 0; k < authors.length; k++) {
			if (k < authors.length - 2) {
				txt += `${authors[k].name.last}, `;
			} else if (k == authors.length - 2) {
				txt += `${authors[k].name.last} and `;
			} else if (k == authors.length - 1) {
				txt += `${authors[k].name.last}`;
			}
		}
		return txt;
	});

	eleventyConfig.addFilter("homepage_authors", function(authors) {
		if (authors === undefined) {
			return '';
		}

		let txt = '';
		for (let k = 0; k < authors.length; k++) {
			if (k < authors.length - 2) {
				txt += `${authors[k].name.first}&nbsp;${authors[k].name.last}, `;
			} else if (k == authors.length - 2) {
				txt += `${authors[k].name.first}&nbsp;${authors[k].name.last} &amp; `;
			} else if (k == authors.length - 1) {
				txt += `${authors[k].name.first}&nbsp;${authors[k].name.last}`;
			}
		}
		return txt;
	});

	// Add filter to generate bibliography.
	
	const Cite = require('citation-js');
	
	eleventyConfig.addFilter("bibliography", function(referenceFile) {
		
		let bibtex = fs.readFileSync('../src/_data/references/' + referenceFile).toString();

		let citations = new Cite(bibtex),
			refs = citations.format('data'),
			html;

		refs = JSON.parse(refs);

		if (refs.length == 0) {
			return '';
		}
		
		// Sort refs alphabetically by first author.
		refs.sort((a, b) => {
			if (a.author[0].family < b.author[0].family) {
				return 1;
			} else if (a.author[0].family > b.author[0].family) {
				return -1;
			} else {
				return 0;
			}
		})

		function formatAuthors(ref) {
			let authors = ref.author;
			// console.log(ref.author);
			if (authors.length == 1) {
				return `${authors[0].family}, ${authors[0].given[0]}.`;
			} else {
				let txt = '';
				for (let k = 0; k < authors.length; k++) {
					if (k < authors.length - 2) {
						txt += `${authors[k].family}, ${authors[k].given[0]}., `;
					} else if (k == authors.length - 2) {
						txt += `${authors[k].family}, ${authors[k].given[0]}. and `;
					} else if (k == authors.length - 1) {
						txt += `${authors[k].family}, ${authors[k].given[0]}.`;
					}
				}
				return txt;
			}
			// return 'AUTHORS';
		}

		function getYear(ref) {
			return ref.issued['date-parts'][0][0];
		}

		html = `<h1>References</h1><div class="csl-bib-body">`;
		for (let ref of refs) {
			html += `
				<div id="bib-${ref.id}" data-csl-entry-id="${ref.id}" class="csl-entry">
					<span class="title">${ref.title}</span> <a href="${ref.URL}">[link]</a> <br />
					${formatAuthors(ref)}, ${getYear(ref)}. ${ref['container-title']}.
				</div>
			`;
		}
		html += `</div>`;

		return html;

	});

	// Add filter to insert citations.

	eleventyConfig.addFilter("citations", function(html) {

		let citations = Array.from(html.matchAll(/\[@\w*?\]/g), m => m[0]);
		citations = citations.filter(c => c != "[@xyz]");

		if (citations.length == 0) {
			
			return html;
		
		} else {

			let new_html = html;

			for (let c of citations) {

				let id = c.substr(2, c.length - 3),
					regex = new RegExp(`\\[@${id}\\]`, "g");

				new_html = new_html.replace(
					regex,
					`<a class="ref" onmouseenter="create_modal_ref(this, '${id}')" onmouseleave="destroy_modal_ref()"><i class="fad fa-file-alt"></i></a>`
				)

			}

			return new_html;

		}

	})

	// Add filter to compute card width.

	eleventyConfig.addFilter("card_width", function(postdata) {

		let { title, description } = postdata;

		title = title.split('').length;
		description = description.split('').length;

		// return description * 4.4;
		return Math.max(title * 12, description * 4.4);

	})

	// Add markdown filter.
	var options = {
		html: true,
		typographer: true
	};
	var md = require('markdown-it')(options)
		.use(require('markdown-it-footnote'))
		.use(require('markdown-it-deflist'))
		.use(require('markdown-it-attribution'));
		// .use(require("markdown-it-anchor"))
		// .use(require("markdown-it-toc-done-right"));
	
	md.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
		var id      = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
		var caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
		var refid   = id;

		if (tokens[idx].meta.subId > 0) {
		refid += ':' + tokens[idx].meta.subId;
		}

		// return '<sup class="footnote-ref"><a href="#fn' + id + '" id="fnref' + refid + '">' + caption + '</a></sup>';
		// return '<a href="#fn' + id + '" class="footnote-ref" id="fnref' + refid + '" role="doc-noteref"><sup>' + caption + '</sup></a>';
		return `<label id="fnref${id}" for="sn-${id}" class="margin-toggle sidenote-number"></label>
			<input type="checkbox" id="sn-${id}" class="margin-toggle"/>
			<span id="#sidenote-${id}" class="sidenote"></span>
		`;
	};
	md.renderer.rules.footnote_block_open = () => (
		'<div class="footnotes">\n' +
		'<ol class="footnotes-list">\n'
	);
	md.renderer.rules.footnote_block_close = () => (
		'</ol>\n' +
		'</div>\n'
	);

	eleventyConfig.addFilter("markdown", function(rawString) {
		return md.render(rawString);
	});

	// Add filter to convert footnotes to sidenotes.

	eleventyConfig.addFilter("footnotes_to_sidenotes", function(html) {

		let new_html = html;

		// Extract index and html for each of the footnotes.
		let regex = /<li id="fn\d+" class="footnote-item"><p>((.|\n)*?)<\/p>\n<\/li>/g;
		let footnotes = Array.from(html.matchAll(regex), m => m[1]);
		footnotes = footnotes.map(function(fn) {
			let idx = fn.match(/#fnref(\d+)/g)[0].replace(/#fnref/g, ''),
				text = fn.replace(/ <a href="#fnref\d+" class="footnote-backref">↩︎<\/a>/g, '');
				side = text[0];
			text = text.replace(/^(R|L) /g, '');
			return { idx, side, text };
		});

		// Insert html into sidenotes.
		footnotes.forEach(function(fn) {

			let sidenote_html = `<span id="#sidenote-${fn.idx}" class="sidenote ${fn.side}">${fn.text}</span>`,
				regex = `<span id="#sidenote-${fn.idx}" class="sidenote"><\/span>`;
			regex = new RegExp(regex, "g");
			new_html = new_html.replace(regex, sidenote_html);

		})


		// Strip footnotes list from end of post.
		new_html = new_html.replace(/<div class="footnotes">(.|\n)*<\/div>/g, '');

		return new_html;
	});

	// Add filter to extract footnotes list.

	eleventyConfig.addFilter("get_footnotes", function(html) {
		let footnotes = html.match(/<ol class="footnotes-list">(.|\n)*<\/ol>/g);
		if (footnotes !== null) {
			footnotes = footnotes[0].replace(/<p>(R|L) /g, '');
			return `<h1>Footnotes</h1>${footnotes}`;
		} else {
			return '';
		}
	});

	// Add plugins to markdown processor.
	var markdownIt = require("markdown-it");
	var markdownItFootnote = require("markdown-it-footnote");
	// var markdownItAnchor = require("markdown-it-anchor");
	// var markdownItTOC = require("markdown-it-toc-done-right");
	var options = {
		html: true,
		typographer: true
	};
	var markdownLib = markdownIt(options)
		.use(require('markdown-it-deflist'))
		.use(markdownItFootnote);
		// .use(markdownItAnchor);
		// .use(markdownItTOC, {
		// 	callback: function(html, ast) {
		// 		return(html);
		// 	}
		// });

	markdownLib.renderer.rules.footnote_block_open = () => (
		'<div class="footnotes">\n' +
		'<ol class="footnotes-list">\n'
	);
	markdownLib.renderer.rules.footnote_block_close = () => (
		'</ol>\n' +
		'</div>\n'
	);

	eleventyConfig.setLibrary("md", markdownLib);

	return {

		dir: {
			input: "../src",
			output: "../docs",
			includes: "_includes"
		},

		templateFormats: [
			"html",
			"css",
			"njk",
			"md",
			"js",
			"png",
			"jpg",
			"svg",
			"woff",
			"woff2",
			"ttf",
			"ico",
			"csv",
			"json",
			"pdf",
			"txt",
			"htaccess"
		]

	}
};

