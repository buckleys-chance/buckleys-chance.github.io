---json
{
	"permalink": false,
	"templateEngineOverride": false,
	"tags": ["post"],
	"title": "Generic template post",
	"date": "2021-01-02",
	"date_updated": "2021-01-02",
	"slug": "template",
	"cover": "/img/placeholder.png",
	"description": "This is a template post, with which to refine the stylesheets for posts in general.",
	"authors": [
		{
			"name": { "first": "Luke", "last": "Thorburn", "url": "https://lukethorburn.com" },
			"affiliation": { "text": "University of Melbourne", "url": "https://unimelb.edu.au" }
		},
		{
			"name": { "first": "Liam", "last": "Carroll" },
			"affiliation": { "text": "Buckley's Chance", "url": "/" }
		}
	],
	"acknowledgements": "Thanks to Joe Blow and Mary Doe.",
	"references": "template.bib",
	"katex": true,
	"flag": "BIT BORING",
	"hidden": true
}
---

Articles usually start with an introduction, in the form of a paragraph like this. Then, they might be broken up into sections, using titles like the one below.

---

# Section name

## The name of a subsection

### Third-level heading

Note that while styles are defined for three levels of headings, in practice we anticipate using them sparingly.

---

# Links

Inline hyperlinks, such as to [Our World in Data](https://ourworldindata.org/) or [Parametric Press](https://parametric.press/issue-02/), are demonstrated in this sentence.

---

# Lists

Ordered lists look this ...

1. Explorable Explanations
2. The Markup
3. Guardian Datablog

... and unordered lists look like this...

- The Pudding
- Distil
- Stubborn Mule

... and definition lists look like this.

First concept
: Definition of first concept.

Concept #2
: Definition of second concept.

Another concept
: Explanation for third concept.

---

# Blockquotes

Quotes can be uncited ...

> A quote.

... or include attribution.

> Another quote. This one is a bit longer and more interesting.
> That's one small step for [a] man, one giant leap for mankind.  
> — **Neil Armstrong** (1969, July 21)

---

# Figures

## Positioning

Nullam et nibh in tellus tincidunt volutpat. Vestibulum lobortis nisi et lectus convallis, eget semper arcu sagittis. Aliquam lectus libero, feugiat vitae nibh at, malesuada scelerisque ipsum. In erat elit, pretium quis viverra in, dapibus quis arcu. Sed ut molestie lacus. Nam gravida ex odio, at aliquam lectus lacinia venenatis. Aenean condimentum eleifend libero eget faucibus. Aliquam condimentum sollicitudin purus, vitae pretium magna aliquet sed. Morbi feugiat, turpis ac iaculis gravida, arcu mauris placerat erat, vel faucibus felis neque quis risus. Fusce et augue quis velit dictum aliquam sed vel enim. Pellentesque a tristique odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec faucibus vehicula magna vitae fermentum.

<div class="placeholder fig inset">.fig .inset</div>

Donec accumsan arcu vel elit auctor, nec blandit neque venenatis. Nam quis urna a diam mollis dignissim auctor vestibulum massa. Pellentesque vehicula mauris eget augue aliquet eleifend. Etiam cursus quam sed diam convallis, eu euismod metus placerat. Nullam purus purus, luctus vitae magna quis, venenatis efficitur dolor. Suspendisse eget euismod sem, et tempor velit. Vivamus cursus tincidunt facilisis. Integer nisl turpis, gravida nec velit quis, iaculis blandit ligula. Suspendisse vitae felis lobortis, auctor massa a, consequat felis. Duis luctus vel tortor nec elementum. Mauris quis volutpat arcu.

<div class="placeholder fig outset-1">.fig .outset-1</div>
<div class="placeholder fig outset-2">.fig .outset-2</div>
<div class="placeholder fig outset-3">.fig .outset-3</div>
<div class="placeholder fig outset-4">.fig .outset-4</div>

Integer mi sem, euismod quis lacus sed, suscipit vulputate turpis. Phasellus ultricies metus tortor, non faucibus nibh tincidunt eu. Donec at facilisis justo. Sed pulvinar sed mi vitae ullamcorper. Pellentesque ultrices tristique dapibus. Donec sit amet justo enim. Nam at urna ac risus tempus sagittis. Aenean mattis mattis velit id ultricies. Donec ut volutpat ex.

<div class="placeholder fig full-width">.fig .full-width</div>
<div class="placeholder fig full-width-inset">.fig .full-width-inset</div>

Morbi a scelerisque mauris. Donec lacinia nibh at nisi imperdiet sagittis. Donec eu ipsum consequat, fringilla magna vel, fringilla sem. Praesent aliquam ante metus, ut dignissim augue vestibulum nec. Nam aliquet justo sagittis est facilisis, quis auctor nibh porta. Ut mollis sem ut ligula dapibus ornare. Sed ut lectus a orci sollicitudin fringilla. Aenean porttitor turpis libero, quis laoreet arcu fringilla elementum. Ut eget lectus odio.

<div class="placeholder fig side-1">.fig .side-1</div>
<div class="placeholder fig side-2">.fig .side-2</div>
<div class="placeholder fig side-3">.fig .side-3</div>

Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum vitae nisi dui. Praesent tellus mauris, pellentesque eget lorem non, laoreet condimentum velit. Sed sagittis enim enim, non tincidunt nunc tempor eget. Morbi lacus nisi, accumsan ac augue ac, rhoncus mollis orci. Nullam nec imperdiet ipsum. Etiam fringilla volutpat lobortis. Ut et diam efficitur, facilisis urna in, iaculis erat. Morbi et molestie purus. Mauris interdum, mauris sed euismod cursus, ex dolor vehicula neque, at egestas dui libero tempus magna.

## Graphing libraries

Example graphs using `d3.js` and either `Vega` or `Vegalite` will be placed here.

<div class="collapsible collapsed"
	data-text="Click to reveal a collapsible section.">

# Collapsible Sections

It can be helpful to have more technical sections collapsed by default so that they don't deter more casual readers. This is one such section.

</div>

# Formulae

You can include formulae using LaTeX notation. We use the [KaTeX](https://katex.org/) library to render equations.

$$ \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } } $$

$$ \left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right) $$

$$ {1 +  \frac{q^2}{(1-q)}+\frac{q^6}{(1-q)(1-q^2)}+\cdots }= \prod_{j=0}^{\infty}\frac{1}{(1-q^{5j+2})(1-q^{5j+3})} $$

---

# Sidenotes

Vivamus bibendum fermentum velit faucibus venenatis. Morbi venenatis eros sit amet sapien tincidunt hendrerit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam efficitur posuere urna vel maximus. Quisque malesuada pulvinar lectus in convallis. Suspendisse enim ligula, condimentum condimentum finibus quis, rutrum eu lacus. Proin vitae ultricies ex. Nam ut[^example1] ligula fringilla, auctor sapien ut, vestibulum orci. Fusce porttitor, sapien in luctus interdum, nunc lectus sagittis ante, maximus feugiat odio neque ac lectus.

Nunc interdum odio a turpis suscipit, eu varius massa lobortis. Integer pellentesque eros ac ipsum ultricies, ac dignissim felis blandit. Integer molestie diam bibendum elit congue tincidunt. Nunc faucibus nulla arcu, nec laoreet nunc porttitor a. Integer ac sapien libero. Etiam nec cursus leo. Proin cursus nec felis a pretium. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus[^example2]. Nunc faucibus ultrices lacus. Donec iaculis non tellus at gravida.

Duis feugiat dignissim magna. Duis at tristique enim. Phasellus id efficitur augue. Donec ut ante sit amet orci rutrum varius. Maecenas suscipit est odio, eget varius diam aliquet vel. Nulla pulvinar laoreet justo iaculis posuere. Pellentesque vestibulum condimentum eros. Curabitur ipsum lorem, posuere ut viverra ut, finibus vitae purus. In commodo congue urna. Integer cursus, turpis a pulvinar feugiat, orci sapien molestie lacus, ut volutpat magna velit eget quam. Mauris ut libero vitae est eleifend fermentum. Ut vitae felis fermentum, pulvinar ligula a, pharetra diam. Etiam id orci at lorem hendrerit lobortis.

[^example1]:R This is a right sidenote. Note that there are some limitations to sidenotes: no effort is taken to ensure they don't overlap, and there can be only one per paragraph. This is due to the difficulties involved in implementing them robustly across all screen widths and mobile devices. You can, however, specify the side on which they are positioned.

[^example2]:L This is shorter sidenote on the left hand side. Try narrowing the browser window to see what happens when it becomes too narrow to display sidenotes.

---

# Citations

Reference data can be included via a BibTeX file in the `/_data/` directory, with the filename referenced in the post metadata. A bibliography will then be generated and included using all the references in the BibTeX file.

To insert a citation inline, use the syntax `[@xyz]` where `xyz` is the citation reference used in the BibTeX file.

This will generate a fairly generic looking inline citation that looks like this [@ausdata]. The details of the citation will appear on hover.

This leaves it up to the author to decide exactly how to describe the citation in the text, be it author-date or something more organic. We might want a convention, but can figure it out as we go. Probably don't want anything too intimidatingly formal.

Here's another citation for the fun of it, on custom vs. in-house tools in data journalism [@outofbox].