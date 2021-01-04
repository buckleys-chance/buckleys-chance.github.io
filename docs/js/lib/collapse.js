
// -------------------------------------------------------------------------------------- //

/*  Run the given function immediately if the page is already loaded, or add
    a listener to run it as soon as the page loads.
    */
function doWhenPageLoaded(f) {
    if (document.readyState == "complete")
        f();
    else
        window.addEventListener("load", f);
}

/*  Run the given function immediately if the page content has already loaded
	(DOMContentLoaded event has fired), or add a listener to run it as soon as 
	the event fires.
    */
function doWhenDOMContentLoaded(f) {
    if (GW.DOMContentLoaded == true)
        f();
    else
        window.addEventListener("DOMContentLoaded", f);
}

/************************/
/* ACTIVE MEDIA QUERIES */
/************************/

/*  This function provides two slightly different versions of its functionality,
    depending on how many arguments it gets.

    If one function is given (in addition to the media query and its name), it
    is called whenever the media query changes (in either direction).

    If two functions are given (in addition to the media query and its name),
    then the first function is called whenever the media query starts matching,
    and the second function is called whenever the media query stops matching.

    If you want to call a function for a change in one direction only, pass an
    empty closure (NOT null!) as one of the function arguments.

    There is also an optional fifth argument. This should be a function to be
    called when the active media query is canceled.
    */
function doWhenMatchMedia(mediaQuery, name, ifMatchesOrAlwaysDo, otherwiseDo = null, whenCanceledDo = null) {
    if (typeof GW.mediaQueryResponders == "undefined")
        GW.mediaQueryResponders = { };

    let mediaQueryResponder = (event, canceling = false) => {
        if (canceling) {
            // GWLog(`Canceling media query “${name}”`, "media queries", 1);

            if (whenCanceledDo != null)
                whenCanceledDo(mediaQuery);
        } else {
            let matches = (typeof event == "undefined") ? mediaQuery.matches : event.matches;

            // GWLog(`Media query “${name}” triggered (matches: ${matches ? "YES" : "NO"})`, "media queries", 1);

            if (otherwiseDo == null || matches) ifMatchesOrAlwaysDo(mediaQuery);
            else otherwiseDo(mediaQuery);
        }
    };
    mediaQueryResponder();
    mediaQuery.addListener(mediaQueryResponder);

    GW.mediaQueryResponders[name] = mediaQueryResponder;
}

if (typeof window.GW == "undefined")
    window.GW = { };

/*****************/
/* MEDIA QUERIES */
/*****************/

GW.mediaQueries = {
    mobileWidth:           matchMedia("(max-width: 650px)"),
    systemDarkModeActive:  matchMedia("(prefers-color-scheme: dark)"),
    hoverAvailable:        matchMedia("only screen and (hover:hover) and (pointer:fine)")
};

GW.isMobile = () => {
	/*  We consider a client to be mobile if one of two conditions obtain:
		1. JavaScript detects touch capability, AND viewport is narrow; or,
		2. CSS does NOT detect hover capability.
		*/
	return (   (   ('ontouchstart' in document.documentElement)
				&& GW.mediaQueries.mobileWidth.matches)
			|| !GW.mediaQueries.hoverAvailable.matches);
};

GW.isFirefox = () => {
	return (navigator.userAgent.indexOf("Firefox") > 0);
};

GW.notificationCenter = { };
GW.notificationCenter.addHandlerForEvent = function (eventName, f, options = { }) {
    if (GW.notificationCenter[eventName] == null)
        GW.notificationCenter[eventName] = [ ];

    if (GW.notificationCenter[eventName].findIndex(handler => handler.f == f) !== -1)
        return;

    GW.notificationCenter[eventName].push({ f: f, options: options });
};
GW.notificationCenter.removeHandlerForEvent = function (eventName, f, options = { }) {
    if (GW.notificationCenter[eventName] == null)
        return;

    GW.notificationCenter[eventName].removeIf(handler => handler.f == f);
}
GW.notificationCenter.removeAllHandlersForEvent = function (eventName) {
    GW.notificationCenter[eventName] = null;
}
GW.notificationCenter.fireEvent = function (eventName, eventInfo) {
    // GWLog(`Event “${eventName}” fired.`, "notification");

    if (GW.notificationCenter[eventName] == null)
        return;

	for (var i = 0; i < GW.notificationCenter[eventName].length; i++) {
		let handler = GW.notificationCenter[eventName][i];
        handler.f(eventInfo);
        if (handler.options.once) {
        	GW.notificationCenter[eventName].splice(i, 1);
        	i--;
        }
	}
}

// -------------------------------------------------------------------------------------- //

function expandCollapseBlocksToReveal(node) {
    // GWLog("expandCollapseBlocksToReveal", "collapse.js", 2);
    if (!node)
        return;
    let element = node instanceof HTMLElement ? node : node.parentElement;
    if (!isWithinCollapsedBlock(element)) return false;
    let collapseParent = element.closest(".collapse");
    let disclosureButton = collapseParent.querySelector(".disclosure-button");
    let expansionOccurred = (disclosureButton.checked == false);
    disclosureButton.checked = true;
    updateDisclosureButtonTitle(disclosureButton);
    collapseParent.classList.toggle("expanded", disclosureButton.checked);
    if (!expandCollapseBlocksToReveal(collapseParent.parentElement) && expansionOccurred)
        GW.notificationCenter.fireEvent("Collapse.collapseStateDidChange");
    return expansionOccurred;
}

function updateDisclosureButtonTitle(disclosureButton) {
    // GWLog("expandCollapseBlocksToReveal", "collapse.js", 3);
    let collapsedStateTitle = "This is a collapsed region; mouse click to expand it. Collapsed text can be sections, code, text samples, or long digressions which most users will not read, and interested readers can opt into.";
    let expandedStateTitle = "This is an expanded collapse region; mouse click to collapse it.";
    disclosureButton.title = disclosureButton.checked ? expandedStateTitle : collapsedStateTitle;
}

function isCollapsed(collapseBlock) {
    return !collapseBlock.classList.contains("expanded");
}

function isWithinCollapsedBlock(element) {
    let collapseParent = element.closest(".collapse");
    if (!collapseParent) return false;
    if (isCollapsed(collapseParent)) return true;
    return isWithinCollapsedBlock(collapseParent.parentElement);
}

function prepareCollapseBlocks() {
    // GWLog("prepareCollapseBlocks", "collapse.js", 1);
    let hashTarget = getHashTargetedElement();
    document.querySelectorAll(".collapse").forEach(collapseBlock => {
        let checked = collapseBlock.contains(hashTarget) ? " checked='checked'" : "";
        let disclosureButtonHTML = `<input type='checkbox' class='disclosure-button' aria-label='Open/close collapsed section'${checked}>`;
        if (collapseBlock.tagName == "SECTION") {
            collapseBlock.children[0].insertAdjacentHTML("afterend", disclosureButtonHTML);
            if (checked > "")
                collapseBlock.classList.add("expanded");
        } else if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(collapseBlock.tagName)) {
            collapseBlock.classList.remove("collapse");
        } else if (collapseBlock.parentElement.tagName == "DIV" && collapseBlock.parentElement.children.length == 1) {
            let realCollapseBlock = collapseBlock.parentElement;
            realCollapseBlock.classList.add("collapse");
            realCollapseBlock.insertAdjacentHTML("afterbegin", disclosureButtonHTML);
            if (checked > "")
                realCollapseBlock.classList.add("expanded");
            collapseBlock.classList.remove("collapse");
        } else {
            let realCollapseBlock = document.createElement("div");
            realCollapseBlock.classList.add("collapse");
            realCollapseBlock.insertAdjacentHTML("afterbegin", disclosureButtonHTML);
            if (checked > "")
                realCollapseBlock.classList.add("expanded");
            collapseBlock.parentElement.insertBefore(realCollapseBlock, collapseBlock);
            collapseBlock.classList.remove("collapse");
            realCollapseBlock.appendChild(collapseBlock);
        }
    });
    document.querySelectorAll(".disclosure-button").forEach(disclosureButton => {
        updateDisclosureButtonTitle(disclosureButton);
        let collapseBlock = disclosureButton.closest(".collapse");
        disclosureButton.addEventListener("change", (event) => {
            collapseBlock.classList.toggle("expanded", disclosureButton.checked);
            updateDisclosureButtonTitle(disclosureButton);
            if (!disclosureButton.checked && !isOnScreen(collapseBlock))
                scrollElementIntoView(collapseBlock);
            else if (disclosureButton.checked && collapseBlock.getBoundingClientRect().top < 0)
                scrollElementIntoView(collapseBlock);
            GW.notificationCenter.fireEvent("Collapse.collapseStateDidChange");
        });
    });
}
doWhenDOMContentLoaded(prepareCollapseBlocks);

function scrollElementIntoView(element, offset = 0) {
    // GWLog("scrollElementIntoView", "collapse.js", 2);
    doWhenPageLoaded(() => {
        requestAnimationFrame(() => {
            element.scrollIntoView();
            if (offset != 0)
                window.scrollBy(0, offset);
        });
    });
}

function revealElement(element, scrollIntoView = true) {
    // GWLog("revealElement", "collapse.js", 2);
    let didExpandCollapseBlocks = expandCollapseBlocksToReveal(element);
    if (scrollIntoView) {
        scrollElementIntoView(element);
    }
    return didExpandCollapseBlocks;
}

function getHashTargetedElement() {
    if (GW.isFirefox() && location.hash.startsWith("#:~:"))
        return null;
    return (location.hash.length > 1) ? document.querySelector(decodeURIComponent(location.hash)) : null;
}

function revealTarget() {
    // GWLog("revealTarget", "collapse.js", 1);
    if (!location.hash)
        return;
    let target = getHashTargetedElement();
    if (!target)
        return;
    revealElement(target);
    GW.notificationCenter.fireEvent("Collapse.targetDidRevealOnHashUpdate");
}
window.addEventListener("hashchange", GW.hashUpdated = () => {
    // GWLog("GW.hashUpdated", "collapse.js", 1);
    revealTarget();
});
document.addEventListener("selectionchange", GW.selectionChanged = (event) => {
    // GWLog("GW.selectionChanged", "rewrite.js", 3);
    let newSelection = document.getSelection();
    if (newSelection && newSelection.getRangeAt(0).toString().length > 0)
        expandCollapseBlocksToReveal(newSelection.anchorNode);
});