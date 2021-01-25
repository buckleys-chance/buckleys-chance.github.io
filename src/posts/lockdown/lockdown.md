---json
{
	"permalink": false,
	"templateEngineOverride": false,
	"tags": ["post"],
	"title": "Pandemic trade-offs",
	"date": "2021-01-10",
	"date_updated": "2021-01-10",
	"slug": "lockdown",
	"cover": "/img/placeholder.png",
	"description": "Restrictions stop the spread of SARS-CoV-2, but also cause other harms. Can we strike a balance?",
	"authors": [
		{
			"name": {
				"first": "Luke",
				"last": "Thorburn",
				"url": "https://lukethorburn.com"
			},
			"affiliation": {
				"text": "Buckley's Chance",
				"url": "https://buckleys.pub"
			}
		},
		{
			"name": {
				"first": "Tony",
				"last": "Blakely",
				"url": "https://findanexpert.unimelb.edu.au/profile/773939-tony-blakely"
			},
			"affiliation": {
				"text": "University of Melbourne",
				"url": "https://unimelb.edu.au"
			}
		},
		{
			"name": {
				"first": "Nathan",
				"last": "Grills",
				"url": "https://findanexpert.unimelb.edu.au/profile/356800-nathan-grills"
			},
			"affiliation": {
				"text": "University of Melbourne",
				"url": "https://unimelb.edu.au"
			}
		},
		{
			"name": {
				"first": "...",
				"last": "...",
				"url": "#"
			},
			"affiliation": {
				"text": "...",
				"url": "#"
			}
		}
		
	],
	"acknowledgements": "Thanks to ...",
	"references": "lockdown.bib",
	"katex": true,
	"d3": true,
	"css": ["post.css"],
	"js": ["fig-strategies.js"],
	"hidden": true
}
---

Introduce the research.

List side-effects of restrictions, to make concrete. Both negative and positive. Lost revenue, unemployment, depression, anxiety, suicide, domestic violence, alcohol consumption, road traffic crashes, work-life balance, lost education, deferred medical treatment / screening, family time, access to green space, ...

---

# Stages and Strategies

<div class="fig outset-3">
<table>
	<thead>
		<tr>
			<th></th>
			<th>Stage 1</th>
			<th>Stage 2</th>
			<th>Stage 3</th>
			<th>Stage 4</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
	</tbody>
</table>
</div>


<div class="fig full-width-inset more-margin-3">
	<nav class="strategies">
		<button class="active">
			<h1>Aggressive Elimination</h1>
			<p>Aim for no community transmission, quickly.</p>
		</button>
		<button>
			<h1>Moderate Elimination</h1>
			<p>Aim for no community transmission, less quickly.</p>
		</button>
		<button>
			<h1>Tight Suppression</h1>
			<p>Aim for 1-5 new cases per million people per day.</p>
		</button>
		<button>
			<h1>Loose Suppression</h1>
			<p>Aim for 5-25 new cases per million people per day.</p>
		</button>
	</nav>
	<svg id="fig-strategies">
		<defs>
			<linearGradient id="1-1b" x1="0" x2="0.1" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#ebf0e9" />
				<stop offset="100%" stop-color="#d6e1d2" />
			</linearGradient>
			<linearGradient id="1-2" x1="0" x2="0.1" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#ebf0e9" />
				<stop offset="100%" stop-color="#c2d2bc" />
			</linearGradient>
			<linearGradient id="1-3" x1="0" x2="0.1" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#ebf0e9" />
				<stop offset="100%" stop-color="#adc3a5" />
			</linearGradient>
			<linearGradient id="1-4" x1="0" x2="0.1" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#ebf0e9" />
				<stop offset="100%" stop-color="#99b48f" />
			</linearGradient>
			<linearGradient id="1b-2" x1="0" x2="0.1" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#d6e1d2" />
				<stop offset="100%" stop-color="#c2d2bc" />
			</linearGradient>
			<linearGradient id="1b-3" x1="0" x2="0.1" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#d6e1d2" />
				<stop offset="100%" stop-color="#adc3a5" />
			</linearGradient>
			<linearGradient id="1b-4" x1="0" x2="0.1" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#d6e1d2" />
				<stop offset="100%" stop-color="#99b48f" />
			</linearGradient>
			<linearGradient id="2-3" x1="0" x2="0.1" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#c2d2bc" />
				<stop offset="100%" stop-color="#adc3a5" />
			</linearGradient>
			<linearGradient id="2-4" x1="0" x2="0.1" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#c2d2bc" />
				<stop offset="100%" stop-color="#99b48f" />
			</linearGradient>
			<linearGradient id="3-4" x1="0" x2="0.1" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#adc3a5" />
				<stop offset="100%" stop-color="#99b48f" />
			</linearGradient>
			<linearGradient id="1b-1" x1=".1" x2="0" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#ebf0e9" />
				<stop offset="100%" stop-color="#d6e1d2" />
			</linearGradient>
			<linearGradient id="2-1b" x1=".1" x2="0" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#d6e1d2" />
				<stop offset="100%" stop-color="#c2d2bc" />
			</linearGradient>
			<linearGradient id="3-2" x1=".1" x2="0" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#c2d2bc" />
				<stop offset="100%" stop-color="#adc3a5" />
			</linearGradient>
			<linearGradient id="4-3" x1=".1" x2="0" y1=".1" y2=".9">
				<stop offset="0%" stop-color="#adc3a5" />
				<stop offset="100%" stop-color="#99b48f" />
			</linearGradient>
		</defs>
	</svg>
</div>

Have a graph that shows where the thresholds are, present runs of the ABM in each case with the thresholds visible.

<div class="fig outset-2">
	<img src="/img/lockdown1.png" />
</div>

#### What non-COVID consequences are included in the model? How are they quantified?

Briefly describe which consequences are included.

Introduce the concept of HALYs/DALYs, and how they are estimated.

#### Main tool

Provide dropdowns/sliders for key assumptions:

- Effect of restrictions on each consequence
- In each case, default to sensible values emerging from lit review.
	- Anxiety
	- Depression
	- Unemployment
	- ...
- $/HALY
- Perspect (health system, partial-societal)

As assumptions are updated, update main graph of the probability each policy scenario is optimal. Can choose what the x-axis is (though $/HALY by default).

<div class="fig side-3">
	<img src="/img/lockdown2.png" />
</div>

#### Thorny Questions

- What monetary value should be placed on a HALY?

#### Important considerations

- Regardless of policy response, there is still a pandemic. Need to compare each scenario to other ways of responding to the pandemic, not to the pre-pandemic world.

#### Limitations

- Difficulty in estimating impacts of different restriction levels.
- This is just one way of approaching decision-making. Implies a particular ethical framework (\~utilitarianism), which may not be correct.