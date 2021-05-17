---json
{
	"permalink": false,
	"templateEngineOverride": "njk",
	"tags": ["post"],
	"title": "Pandemic Trade-offs",
	"date": "2021-05-15",
	"date_updated": "2021-05-15",
	"slug": "lockdown",
	"cover": "/img/placeholder.png",
	"flag": "NEW",
	"description": "Restrictions help reduce the spread of the SARS-CoV-2 coronavirus, but they also cause other harms. Can we find a balance?",
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
				"url": "https://mspgh.unimelb.edu.au/research-groups/centre-for-epidemiology-and-biostatistics-research/population-interventions"
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
				"url": "https://mspgh.unimelb.edu.au/"
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
	"dependencies": {
		"katex": true,
		"vega": true
	},
	"hidden": true,
	"draft": true
}
---

The use of government-imposed restrictions to help limit the spread of the SARS&#8209;CoV&#8209;2 coronavirus—from mandatory mask-wearing to curfews and border closures—is often politicised.

In Australia, such restrictions appear (on the face of it) to have helped us domestically eradicate the virus on multiple occasions. However, restrictions are a 'blunt instrument'. They have unintended consequences, many of which are undesirable.

> There are no solutions. There are only trade-offs.
> — **Thomas Sowell** (1986)

Limits to in-person social interaction increase loneliness and social anxiety. Border closures prevent families from seeing one another. Restrictions on industry cause people to lose their jobs. Moving school online disrupts education. Bans on elective surgery discourage people from seeking medical help when they need it.

One way to think about government restrictions as a tool for managing the pandemic is that they should be deployed in a manner that minimises the overall harms to society.

If restrictions are too permissive, the virus would circulate widely in the community and there would be a large amount of harm due to people getting sick with (and some dying of) COVID&#8209;19. But if restrictions are too severe, then the harms caused by the restrictions themselves become excessive. Somewhere in the middle there is an optimum strategy that minimises the total harm caused by both COVID&#8209;19 and the restrictions.

<div style="text-align:center;margin:5rem 0 -5rem 0;cursor:default;">
<span style="border-bottom: 1px dashed #000;font-weight:300;">TOTAL&nbsp;HARMS</span> \(=\) <span style="border-bottom: 2px solid #ca0020;color:#ca0020;font-weight:500;">harms&nbsp;due&nbsp;to&nbsp;COVID-19</span> \(+\) <span style="border-bottom: 2px solid #0571b0;color:#0571b0;font-weight:500;">harms&nbsp;due&nbsp;to&nbsp;restrictions</span>
</div>

{% import_graph "decomposition", slug %}

This is the basic idea. Of course, all the different types of restrictions cannot be characterised by a one-dimensional measure of 'severity'. And there are no numbers on the above graph. Attempting to quantify the future harms caused by COVID&#8209;19 and far-reaching government restrictions is an exercise fraught with assumptions and uncertainty. But that doesn't mean we shouldn't try, because the additional harm caused if we get the balance wrong can be enormous.

Below, we present the results of an attempt to … cautiously … start quantifying these harms in the context of the COVID-19 vaccine rollout, and describe some of the challenges involved.

---

First, the results.

The graph below shows the distribution of harms for different government restriction strategies in a simulated Australian state with a population of 6 million. This roughly corresponds to the populations of Victoria, New South Wales or Queensland, but the high-level takeaways should apply to other states too.

(NOTE! Data plotted is currently incomplete and a bit wrong.)

{% import_graph "optimisation", slug %}

The four different restriction strategies considered are (in order of increasing severity): Loose Suppression, Tight Suppression, Moderate Elimination and Aggressive Elimination[^strategies].

[^strategies]:R A full specification of each strategy is quite detailed, but essentially the choice of strategy determines the rules by which society moves between different levels of restrictions. [See here for more details.](https://populationinterventions.science.unimelb.edu.au/pandemic-trade-offs-detail/#strategies)

The harms are quantified using HALYs, or health-adjusted life years, that are lost relative to a hypothetical baseline scenario in which there was no pandemic. One HALY is designed to represent one year of life for a healthy person. COVID-19 causes HALYs to be lost because many people are less than 100% healthy when they have the disease, and those who die from COVID-19 lose years of life that they would otherwise have lived in the future. Government restrictions likewise cause some HALYs to be lost in various ways.

You can use the toggles below the graph to explore how the trade-offs differ depending on how many people choose to vaccinated, how infectious the variant of the virus in circulation is, and how effective the vaccines are at reducing transmission.

---

## How to compare different types of harm?

A more detailed description of HALYs, and where they come from, will go here.

## How to quantify the harms caused by restrictions?

A description of literature review will go here. Key points:

- what types of harms are included (depression, anxiety, road traffic injury, ...)
- need to distinguish between the effect of the pandemic and the effect of lockdowns
- the relative lack of published research that attempts to do this, despite the mountains of papers on COVID
- time period (1 year / lifetime)

## How to account for different sources of uncertainty?

Key points:

- The only source of uncertainty incorporated into the plot is that relating to how the virus spreads
- Other intuitively-uncertain variables are treated as 'assumptions' to describe different scenarios (vaccine uptake, $R_0$, ...)

## Other limitations

- This is just one way to make a decision. Implies a particular ethical framework (\~utilitarianism), which may not be 'correct'.
- Only includes health effects, no direct economic effects.

For more details about this work, please see [the official tool]