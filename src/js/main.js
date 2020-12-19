const {neverland: $, render, html, useState} = window.neverland;

import Surveyor from './components/Surveyor.js';

render(document.body, html`
	${Surveyor(result)}
`);

