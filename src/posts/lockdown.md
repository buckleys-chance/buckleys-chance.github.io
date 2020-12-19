---
permalink: false
templateEngineOverride: false
tags: post
title: Pandemic trade-offs
date: 2020-11-21
slug: lockdown
cover: /img/eg1.png
description:
    Restrictions stop the spread of SARS-CoV-2, but also cause other harms. Can we strike a balance?
---

#### What is this work? Why is it useful?

Introduce the research.

List side-effects of restrictions, to make concrete. Both negative and positive. Lost revenue, unemployment, depression, anxiety, suicide, domestic violence, alcohol consumption, road traffic crashes, work-life balance, lost education, deferred medical treatment / screening, family time, access to green space, ...

#### What restriction levels are included in the modelling?

Clearly present the different stages. Probably in a table.

- No restrictions
- Stage 1
- Stage 2
- Stage 3
- Stage 4

#### What policy scenarios are modelled?

Clearly describe the different triggers for switching between levels.

- aggressive elimination
- moderate elimination
- tight suppression
- loose suppression

Have a graph that shows where the thresholds are, present runs of the ABM in each case with the thresholds visible.

![](/img/lockdown1.png)

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

![](/img/lockdown2.png)

#### Thorny Questions

- What monetary value should be placed on a HALY?

#### Important considerations

- Regardless of policy response, there is still a pandemic. Need to compare each scenario to other ways of responding to the pandemic, not to the pre-pandemic world.

#### Limitations

- Difficulty in estimating impacts of different restriction levels.
- This is just one way of approaching decision-making. Implies a particular ethical framework (~utilitarianism), which may not be correct.
