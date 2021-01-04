
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

Sidenotes = {
    /*  The `sidenoteSpacing` constant defines the minimum vertical space that
        is permitted between adjacent sidenotes; any less, and they are
        considered to be overlapping.
        */
    sidenoteSpacing: 60.0,

    /*  This includes the border width.
        */
    sidenotePadding: 13.0,

    /*  Maximum height of a sidenote.
        */
    sidenoteMaxHeight: 720.0,

    /*  Elements which occupy (partially or fully) the sidenote columns, and 
        which can thus collide with sidenotes.
        */
    potentiallyOverlappingElementsSelector: ".fig .outset-1, .fig .outset-2, .fig .outset-3, .fig .outset-4, .fig .full-width, .fig .full-width-inset, .fig .side-2, .fig .side-3",

    /*  Media query objects (for checking and attaching listeners).
        */
    mediaQueries: {
        viewportWidthBreakpoint: matchMedia("(max-width: 1760px)")
    },

    /*****************/
    /* Infrastructure.
        */
    sidenoteDivs: null,
    citations: null,

    sidenoteColumnLeft: null,
    sidenoteColumnRight: null,

    noteNumberFromHash: () => {
        if (location.hash.match(/#[sf]n[0-9]/))
            return location.hash.substr(3);
        else if (location.hash.match(/#fnref[0-9]/))
            return location.hash.substr(6);
        else
            return "";
    },

    /*  Bind event listeners for mousing over citations and sidenotes.
        */
    bindSidenoteMouseEvents: () => {
        // GWLog("Sidenotes.bindSidenoteMouseEvents", "sidenotes.js", 1);

        for (var i = 0; i < Sidenotes.citations.length; i++) {
            let citation = Sidenotes.citations[i];
            let sidenote = Sidenotes.sidenoteDivs[i];

            citation.addEventListener("mouseenter", citation.citationover = (event) => {
                sidenote.classList.toggle("highlighted", true);
            });
            citation.addEventListener("mouseleave", citation.citationout = (event) => {
                sidenote.classList.toggle("highlighted", false);
            });
            sidenote.addEventListener("mouseenter", sidenote.sidenoteover = (event) => {
                citation.classList.toggle("highlighted", true);
            });
            sidenote.addEventListener("mouseleave", sidenote.sidenoteout = (event) => {
                citation.classList.toggle("highlighted", false);
            });
        }
    },

    /*  Unbind event listeners for mousing over citations and sidenotes.
        */
    unbindSidenoteMouseEvents: () => {
        // GWLog("Sidenotes.unbindSidenoteMouseEvents", "sidenotes.js", 1);

        for (var i = 0; i < Sidenotes.citations.length; i++) {
            let citation = Sidenotes.citations[i];
            let sidenote = Sidenotes.sidenoteDivs[i];

            citation.removeEventListener("mouseenter", citation.citationover);
            citation.citationover = null;

            citation.removeEventListener("mouseleave", citation.citationout);
            citation.citationout = null;

            sidenote.removeEventListener("mouseenter", sidenote.sidenoteover);
            sidenote.sidenoteover = null;

            sidenote.removeEventListener("mouseleave", sidenote.sidenoteout);
            sidenote.sidenoteout = null;
        }
    },

    /*  The â€œtarget counterpartâ€ is the element associated with the target, i.e.:
        if the URL hash targets a footnote reference, its counterpart is the
        sidenote for that citation; and vice-versa, if the hash targets a sidenote,
        its counterpart is the in-text citation. We want a target counterpart to be
        highlighted along with the target itself; therefore we apply a special
        â€˜targetedâ€™ class to the target counterpart.
        */
    updateTargetCounterpart: () => {
        // GWLog("Sidenotes.updateTargetCounterpart", "sidenotes.js", 1);

        /*  Clear existing targeting.
            */
        document.querySelectorAll(".targeted").forEach(element => {
            element.classList.remove("targeted");
        });

        /*  Identify new target counterpart, if any.
            */
        var counterpart;
        if (location.hash.match(/#sn[0-9]/)) {
            counterpart = document.querySelector("#fnref" + Sidenotes.noteNumberFromHash());
        } else if (location.hash.match(/#fnref[0-9]/) && Sidenotes.mediaQueries.viewportWidthBreakpoint.matches == false) {
            counterpart = document.querySelector("#sn" + Sidenotes.noteNumberFromHash());
        }
        /*  If a target counterpart exists, mark it as such.
            */
        if (counterpart)
            counterpart.classList.toggle("targeted", true);
    },

    /*  Move sidenotes within currently-collapsed collapse blocks to the hidden
        sidenote storage container (#hidden-sidenote-storage). Conversely, move
        sidenotes within currently-expanded collapse blocks from the hidden sidenote
        storage container to the appropriate sidenote column.
        */
    updateSidenotesInCollapseBlocks: () => {
        // GWLog("Sidenotes.updateSidenotesInCollapseBlocks", "sidenotes.js", 1);

        for (var i = 0; i < Sidenotes.citations.length; i++) {
            let citation = Sidenotes.citations[i];
            let sidenote = Sidenotes.sidenoteDivs[i];

            sidenote.classList.toggle("hidden", isWithinCollapsedBlock(citation));
        }
    },

    getNextVisibleSidenote: (sidenote) => {
        var nextSidenoteNumber;
        for (nextSidenoteNumber = sidenote.id.substr(2) + 2;
             (nextSidenoteNumber <= Sidenotes.citations.length && Sidenotes.sidenoteDivs[nextSidenoteNumber - 1].classList.contains("hidden"));
             nextSidenoteNumber += 2)
             ;
        return nextSidenoteNumber <= Sidenotes.citations.length
               ? Sidenotes.sidenoteDivs[nextSidenoteNumber - 1]
               : null;
    },

    /*  This function actually calculates and sets the positions of all sidenotes.
        */
    updateSidenotePositions: () => {
        // GWLog("Sidenotes.updateSidenotePositions", "sidenotes.js", 1);

        /*  If weâ€™re in footnotes mode (i.e., the viewport is too narrow), then
            donâ€™t do anything.
            */
        if (Sidenotes.mediaQueries.viewportWidthBreakpoint.matches)
            return;

        //  Update the disposition of sidenotes within collapse blocks.
        Sidenotes.updateSidenotesInCollapseBlocks();

        /*  Initial layout (to force browser layout engine to compute sidenotesâ€™
            height for us).
            */
        for (var i = 0; i < Sidenotes.citations.length; i++) {
            let sidenote = Sidenotes.sidenoteDivs[i];

            /*  Check whether the sidenote is in the hidden sidenote storage (i.e.,
                within a currently-collapsed collapse block. If so, skip it.
                */
            if (sidenote.classList.contains("hidden"))
                continue;

            //  What side is this sidenote on?
            let side = (i % 2) ? Sidenotes.sidenoteColumnLeft : Sidenotes.sidenoteColumnRight;

            //  Maximum height.
            sidenote.firstElementChild.style.maxHeight = `${Sidenotes.sidenoteMaxHeight}px`;

            //  Default position (vertically aligned with the footnote reference).
            sidenote.style.top = Math.round(((Sidenotes.citations[i].getBoundingClientRect().top) - side.getBoundingClientRect().top) + 4) + "px";

            /*  Mark sidenotes which are cut off vertically.
                */
            let sidenoteOuterWrapper = sidenote.firstElementChild;
            sidenote.classList.toggle("cut-off", (sidenoteOuterWrapper.scrollHeight > sidenoteOuterWrapper.clientHeight + 2));
        }

        /*  Determine proscribed vertical ranges (i.e., bands of the page from which
            sidenotes are excluded, by the presence of, e.g., a full-width table).
            */
        var proscribedVerticalRangesLeft = [ ];
        var proscribedVerticalRangesRight = [ ];
        let leftColumnBoundingRect = Sidenotes.sidenoteColumnLeft.getBoundingClientRect();
        let rightColumnBoundingRect = Sidenotes.sidenoteColumnRight.getBoundingClientRect();

        /*  Examine all potentially overlapping elements (i.e., non-sidenote
            elements that may appear in, or extend into, the side columns).
            */
        document.querySelectorAll(Sidenotes.potentiallyOverlappingElementsSelector).forEach(potentiallyOverlappingElement => {
            let elementBoundingRect = potentiallyOverlappingElement.getBoundingClientRect();

            if (!(elementBoundingRect.left > leftColumnBoundingRect.right || elementBoundingRect.right < leftColumnBoundingRect.left))
                proscribedVerticalRangesLeft.push({ top: elementBoundingRect.top - leftColumnBoundingRect.top,
                                                    bottom: elementBoundingRect.bottom - leftColumnBoundingRect.top });

            if (!(elementBoundingRect.left > rightColumnBoundingRect.right || elementBoundingRect.right < rightColumnBoundingRect.left))
                proscribedVerticalRangesRight.push({ top: elementBoundingRect.top - rightColumnBoundingRect.top,
                                                     bottom: elementBoundingRect.bottom - rightColumnBoundingRect.top });
        });

        /*  The bottom edges of each column are also â€œproscribed vertical rangesâ€.
            */
        proscribedVerticalRangesLeft.push({
            top:    Sidenotes.sidenoteColumnLeft.clientHeight,
            bottom: Sidenotes.sidenoteColumnLeft.clientHeight
        });
        proscribedVerticalRangesRight.push({
            top:    Sidenotes.sidenoteColumnRight.clientHeight,
            bottom: Sidenotes.sidenoteColumnRight.clientHeight
        });

        /*  Correct for overlap (both between sidenotes, and of sidenotes with
            proscribed vertical ranges, such as those associated with full-width
            tables).
            */
        for (var i = 0; i < Sidenotes.citations.length; i++) {
            let sidenote = Sidenotes.sidenoteDivs[i];
            let sidenoteNumber = sidenote.id.substr(2);

            let nextSidenote = Sidenotes.getNextVisibleSidenote(sidenote);
            let nextSidenoteNumber = nextSidenote ? nextSidenote.id.substr(2) : "";

            /*  Is this sidenote even displayed? Or is it hidden (i.e., within
                a currently-collapsed collapse block)? If so, skip it.
                */
            if (sidenote.classList.contains("hidden")) continue;

            //  What side is this sidenote on?
            let side = (i % 2) ? Sidenotes.sidenoteColumnLeft : Sidenotes.sidenoteColumnRight;

            /*  What points bound the vertical region within which this sidenote may
                be placed?
                */
            let room = {
                ceiling:    0,
                floor:      side.clientHeight
            };
            let sidenoteFootprint = {
                top:    sidenote.offsetTop - Sidenotes.sidenoteSpacing,
                bottom: sidenote.offsetTop + sidenote.clientHeight + Sidenotes.sidenoteSpacing
            };
            let sidenoteFootprintHalfwayPoint = (sidenoteFootprint.top + sidenoteFootprint.bottom) / 2;

            var proscribedVerticalRanges = [...((i % 2) ? proscribedVerticalRangesLeft : proscribedVerticalRangesRight)];
            if (i > 1) {
                proscribedVerticalRanges.push({
                    /*  Not offsetTop but 0, because we want everything *up to*
                        the previous note to also be proscribed.
                        */
                    top:    0,
                    bottom: Sidenotes.sidenoteDivs[i - 2].offsetTop + Sidenotes.sidenoteDivs[i - 2].offsetHeight
                });
            }
            proscribedVerticalRanges.sort((a, b) => {
                if (a.bottom < b.bottom) return -1;
                if (a.bottom > b.bottom) return 1;
                return 0;
            });

            /*  Simultaneously traverse the array of proscribed ranges up and down,
                narrowing down the room we have to work with (in which to place this
                sidenote) from both sides.
                */
            var nextProscribedRangeAfterSidenote = -1;
            for (var j = 0; j < proscribedVerticalRanges.length; j++) {
                let rangeCountingUp = {
                    top:            proscribedVerticalRanges[j].top,
                    bottom:         proscribedVerticalRanges[j].bottom,
                };
                rangeCountingUp.halfwayPoint = (rangeCountingUp.top + rangeCountingUp.bottom) / 2;
                if (rangeCountingUp.halfwayPoint < sidenoteFootprintHalfwayPoint)
                    room.ceiling = rangeCountingUp.bottom;

                let indexCountingDown = proscribedVerticalRanges.length - j - 1;
                let rangeCountingDown = {
                    top:    proscribedVerticalRanges[indexCountingDown].top,
                    bottom: proscribedVerticalRanges[indexCountingDown].bottom
                };
                rangeCountingDown.halfwayPoint = (rangeCountingDown.top + rangeCountingDown.bottom) / 2;
                if (rangeCountingDown.halfwayPoint > sidenoteFootprintHalfwayPoint) {
                    room.floor = rangeCountingDown.top;
                    nextProscribedRangeAfterSidenote = indexCountingDown;
                }
            }
            // GWLog(`Sidenote ${i + 1}â€™s room is: (${room.ceiling}, ${room.floor}).`, "sidenotes.js", 2);

            //  Is this sidenote capable of fitting within the room it now occupies?
            if (sidenoteFootprint.bottom - sidenoteFootprint.top > room.floor - room.ceiling) {
                /*  If this is not caused by bumping into the top of a proscribed
                    range, then it could only be because the sidenote is either too
                    long for the entire page itself, or itâ€™s longer than the entire
                    footnotes section (and comes very late in the document).
                    In that case, just give up.
                    */
                if (nextProscribedRangeAfterSidenote == -1) {
                    // GWLog("TOO MUCH SIDENOTES. GIVING UP. :(", "sidenotes.js");
                    return;
                }

                /*  Otherwise, move the sidenote down to the next free space, and
                    try laying it out again.
                    */
                sidenote.style.top = (proscribedVerticalRanges[nextProscribedRangeAfterSidenote].bottom + Sidenotes.sidenoteSpacing) + "px";
                i--;
                continue;
            }
            /*  At this point, we are guaranteed that the sidenote can fit within
                its room. We do not have to worry that it will overlap its floor if
                we move it right up against its ceiling (or vice versa).
                */

            /*  Does this sidenote overlap its roomâ€™s ceiling? In such a case, we
                will have to move it down, regardless of whether thereâ€™s a next
                sidenote that would be overlapped.
                */
            var overlapWithCeiling = room.ceiling - sidenoteFootprint.top;
            if (overlapWithCeiling > 0) {
                // GWLog(`Sidenote ${sidenoteNumber} overlaps its ceiling!`, "sidenotes.js", 2);

                sidenote.style.top = (parseInt(sidenote.style.top) + overlapWithCeiling) + "px";
                sidenoteFootprint.top += overlapWithCeiling;
                sidenoteFootprint.bottom += overlapWithCeiling;
            }

            //  Does this sidenote overlap its roomâ€™s floor?
            var overlapWithFloor = sidenoteFootprint.bottom - room.floor;
            if (overlapWithFloor > 0)
                // GWLog(`Sidenote ${sidenoteNumber} overlaps its floor by ${overlapWithFloor} pixels!`, "sidenotes.js", 2);

            /*  Is there a next sidenote, and if so, is there any overlap between
                it and this one?
                */
            var overlapWithNextSidenote = nextSidenote ?
                                          (sidenoteFootprint.bottom - nextSidenote.offsetTop) :
                                          -1;
            if (overlapWithNextSidenote > 0)
                // GWLog(`Sidenote ${sidenoteNumber} overlaps sidenote ${nextSidenoteNumber} by ${overlapWithNextSidenote} pixels!`, "sidenotes.js", 2);

            /*  If the sidenote overlaps the next sidenote AND its roomâ€™s floor,
                we want to know what it overlaps more.
                */
            var overlapBelow = Math.max(overlapWithNextSidenote, overlapWithFloor);

            /*  If thereâ€™s no overlap with the roomâ€™s floor, and thereâ€™s no overlap
                with the next sidenote (or there is no next sidenote), then the
                current sidenoteâ€™s position needs no further adjustment.
                */
            if (overlapBelow <= 0) continue;

            /*  Figure out how much vertical space above we have; if thereâ€™s enough
                â€œheadroomâ€, we can simply move the current sidenote up.
                */
            let previousSidenote = sidenote.previousElementSibling;
            let maxHeadroom = sidenoteFootprint.top - room.ceiling;
            let headroom = previousSidenote ?
                           Math.min(maxHeadroom, (sidenoteFootprint.top - (previousSidenote.offsetTop + previousSidenote.clientHeight))) :
                           maxHeadroom;
            // GWLog(`We have ${headroom}px of headroom.`, "sidenotes.js", 2);

            //  If we have enough headroom, simply move the sidenote up.
            if (headroom >= overlapBelow) {
                // GWLog(`There is enough headroom. Moving sidenote ${sidenoteNumber} up.`, "sidenotes.js", 2);
                sidenote.style.top = (parseInt(sidenote.style.top) - overlapBelow) + "px";
                continue;
            } else {
                //  We donâ€™t have enough headroom!
                // GWLog(`There is not enough headroom to move sidenote ${sidenoteNumber} all the way up!`, "sidenotes.js", 2);

                /*  If thereâ€™s overlap with the roomâ€™s floor, and the headroom is
                    insufficient to clear that overlap, then we will have to move
                    the current sidenote to the next open space, and try laying it
                    out again.
                    */
                if (headroom < overlapWithFloor) {
                    sidenote.style.top = (proscribedVerticalRanges[nextProscribedRangeAfterSidenote].bottom + Sidenotes.sidenoteSpacing) + "px";
                    i--;
                    continue;
                }

                /*  If the headroom is enough to clear the sidenoteâ€™s overlap with
                    the roomâ€™s floor (if any), then it must be insufficient to clear
                    the overlap with the next sidenote. Before we try moving the
                    current sidenote up, we check to see whether the *next* sidenote
                    will fit in the remaining space of the current room. If not,
                    then that next sidenote will need to be moved to the next open
                    space, and the current sidenote need not be disturbed...
                    */
                if ((sidenoteFootprint.bottom + nextSidenote.clientHeight + Sidenotes.sidenoteSpacing - headroom) >
                    proscribedVerticalRanges[nextProscribedRangeAfterSidenote].top)
                    continue;

                //  Move the sidenote up as much as we can...
                // GWLog(`Moving sidenote ${sidenoteNumber} up by ${headroom} pixels...`, "sidenotes.js", 2);
                sidenote.style.top = (parseInt(sidenote.style.top) - headroom) + "px";
                //  Recompute overlap...
                overlapWithNextSidenote -= headroom;
                /*  And move the next sidenote down - possibly causing overlap.
                    (But this will be handled when we process the next sidenote.)
                    */
                // GWLog(`... and moving sidenote ${nextSidenoteNumber} down by ${overlapWithNextSidenote} pixels.`, "sidenotes.js", 2);
                nextSidenote.style.top = (parseInt(nextSidenote.style.top) + overlapWithNextSidenote) + "px";
            }
        }

        console.log('show the sidenote columns');

        //  Show the sidenote columns.
        Sidenotes.sidenoteColumnLeft.style.visibility = "";
        Sidenotes.sidenoteColumnRight.style.visibility = "";

        GW.notificationCenter.fireEvent("Sidenotes.sidenotePositionsDidUpdate");
    },

    /*  Destroys the HTML structure of the sidenotes.
        */
    deconstructSidenotes: () => {
        // GWLog("Sidenotes.deconstructSidenotes", "sidenotes.js", 1);

        Sidenotes.sidenoteDivs = null;
        Sidenotes.citations = null;

        Sidenotes.sidenoteColumnLeft.remove();
        Sidenotes.sidenoteColumnLeft = null;
        Sidenotes.sidenoteColumnRight.remove();
        Sidenotes.sidenoteColumnRight = null;
    },

    /*  Constructs the HTML structure, and associated listeners and auxiliaries,
        of the sidenotes.
        */
    constructSidenotes: () => {
        // GWLog("Sidenotes.constructSidenotes", "sidenotes.js", 1);
        console.log('constructing sidenotes')

        /*  Do nothing if sidenotes.js somehow gets run extremely early in the page
            load process.
            */
        let markdownBody = document.querySelector("article");
        if (!markdownBody) return;

        /*  Add the sidenote columns (removing them first if they already exist).
            */
        if (Sidenotes.sidenoteColumnLeft) Sidenotes.sidenoteColumnLeft.remove();
        if (Sidenotes.sidenoteColumnRight) Sidenotes.sidenoteColumnRight.remove();
        markdownBody.insertAdjacentHTML("beforeend",
            "<div id='sidenote-column-left' class='footnotes' style='visibility:hidden'></div>" +
            "<div id='sidenote-column-right' class='footnotes' style='visibility:hidden'></div>");
        Sidenotes.sidenoteColumnLeft = document.querySelector("#sidenote-column-left");
        Sidenotes.sidenoteColumnRight = document.querySelector("#sidenote-column-right");

        /*  Create and inject the sidenotes.
            */
        Sidenotes.sidenoteDivs = [ ];
        //  The footnote references (citations).
        Sidenotes.citations = Array.from(document.querySelectorAll("a.footnote-ref"));
        for (var i = 0; i < Sidenotes.citations.length; i++) {
            //  Create the sidenote outer containing block...
            let sidenote = document.createElement("div");
            sidenote.classList.add("sidenote");
            let sidenoteNumber = "" + (i + 1);
            sidenote.id = "sn" + sidenoteNumber;
            //  Wrap the contents of the footnote in two wrapper divs...
            let referencedFootnote = document.querySelector("#fn" + sidenoteNumber);
            sidenote.innerHTML = `<div class="sidenote-outer-wrapper"><div class="sidenote-inner-wrapper">` +
                                 (referencedFootnote ? referencedFootnote.innerHTML : "Loading sidenote contents, please waitâ€¦")
                                 + `</div></div>`;
            //  Add the sidenote to the sidenotes array...
            Sidenotes.sidenoteDivs.push(sidenote);
            //  On which side should the sidenote go? Odd - right; even - left.
            let side = (i % 2) ? Sidenotes.sidenoteColumnLeft : Sidenotes.sidenoteColumnRight;
            //  Inject the sidenote into the page.
            side.appendChild(sidenote);
        }

        /*  Create & inject the sidenote self-links (i.e., boxed sidenote numbers).
            */
        for (var i = 0; i < Sidenotes.citations.length; i++) {
            let sidenoteSelfLink = document.createElement("a");
            sidenoteSelfLink.classList.add("sidenote-self-link");
            sidenoteSelfLink.href = "#sn" + (i + 1);
            sidenoteSelfLink.textContent = (i + 1);
            Sidenotes.sidenoteDivs[i].appendChild(sidenoteSelfLink);
        }

        GW.notificationCenter.fireEvent("Sidenotes.sidenotesDidConstruct");
    },

    cleanup: () => {
        // GWLog("Sidenotes.cleanup", "sidenotes.js", 1);

        /*  Deactivate active media queries.
            */
        cancelDoWhenMatchMedia("Sidenotes.rewriteHashForCurrentMode");
        cancelDoWhenMatchMedia("Sidenotes.rewriteCitationTargetsForCurrentMode");
        cancelDoWhenMatchMedia("Sidenotes.bindOrUnbindEventListenersForCurrentMode");
        cancelDoWhenMatchMedia("Sidenotes.addOrRemoveEventHandlersForCurrentMode");

        /*  Remove sidenotes & auxiliaries from HTML.
            */
        Sidenotes.deconstructSidenotes();

        GW.notificationCenter.fireEvent("Sidenotes.sidenotesDidDeconstruct");
    },

    /*  Q:  Why is this setup function so long and complex?
        A:  In order to properly handle all of the following:

        1.  The two different modes (footnote popups vs. sidenotes)
        2.  The interactions between sidenotes and collapse blocks
        3.  Linking to footnotes/sidenotes
        4.  Loading a URL that links to a footnote/sidenote
        5.  Changes in the viewport width dynamically altering all of the above

        â€¦ and, of course, correct layout of the sidenotes, even in tricky cases
        where the citations are densely packed and the sidenotes are long.
        */
    setup: () => {

        console.log('setup')
        // GWLog("Sidenotes.setup", "sidenotes.js", 1);

        /*  If the page was loaded with a hash that points to a footnote, but
            sidenotes are enabled (or vice-versa), rewrite the hash in accordance
            with the current mode (this will also cause the page to end up scrolled
            to the appropriate element - footnote or sidenote). Add an active media 
            query to rewrite the hash whenever the viewport width media query changes.
            */
        doWhenMatchMedia(Sidenotes.mediaQueries.viewportWidthBreakpoint, "Sidenotes.rewriteHashForCurrentMode", (mediaQuery) => {
            let regex = new RegExp(mediaQuery.matches ? "#sn[0-9]" : "#fn[0-9]");
            let prefix = (mediaQuery.matches ? "#fn" : "#sn");

            if (location.hash.match(regex)) {
                GW.hashRealignValue = prefix + Sidenotes.noteNumberFromHash();

                if (document.readyState == "complete") {
                    history.replaceState(null, null, GW.hashRealignValue);
                    GW.hashRealignValue = null;
                }
            }
        }, null, (mediaQuery) => {
            if (location.hash.match(/#sn[0-9]/)) {
                GW.hashRealignValue = "#fn" + Sidenotes.noteNumberFromHash();

                if (document.readyState == "complete") {
                    history.replaceState(null, null, GW.hashRealignValue);
                    GW.hashRealignValue = null;
                }
            }
        });

        /*  In footnote mode (i.e., on viewports too narrow to support sidenotes),
            footnote reference links (i.e., citations) should point down to footnotes
            (this is the default state).
            But in sidenote mode, footnote reference links should point to sidenotes.
            This function rewrites all footnote reference links appropriately to the
            current mode (based on viewport width).
            */
        GW.notificationCenter.addHandlerForEvent("Sidenotes.sidenotesDidConstruct", () => {
            doWhenMatchMedia(Sidenotes.mediaQueries.viewportWidthBreakpoint, "Sidenotes.rewriteCitationTargetsForCurrentMode", (mediaQuery) => {
                for (var i = 0; i < Sidenotes.citations.length; i++)
                    Sidenotes.citations[i].href = (mediaQuery.matches ? "#fn" : "#sn") + (i + 1);
            }, null, (mediaQuery) => {
                for (var i = 0; i < Sidenotes.citations.length; i++)
                    Sidenotes.citations[i].href = "#fn" + (i + 1);
            });
        }, { once: true });

        /*  Listen for changes to whether the viewport width media query is matched;
            if such a change occurs (i.e., if the viewport becomes, or stops being,
            wide enough to support sidenotes), switch modes from footnote popups to
            sidenotes or vice/versa, as appropriate.
            (This listener may also be fired if the dev tools pane is opened, etc.)
            */
        GW.notificationCenter.addHandlerForEvent("Sidenotes.sidenotesDidConstruct", () => {
            doWhenMatchMedia(Sidenotes.mediaQueries.viewportWidthBreakpoint, "Sidenotes.bindOrUnbindEventListenersForCurrentMode", (mediaQuery) => {
                //  Unbind sidenote mouse events.
                Sidenotes.unbindSidenoteMouseEvents();

                //  Determine whether we are in sidenote mode or footnote mode.
                if (!mediaQuery.matches) {
                    //  If we are in sidenotes mode, bind sidenote mouse events.
                    Sidenotes.bindSidenoteMouseEvents();
                }
            }, null, (mediaQuery) => {
                //  Unbind sidenote mouse events.
                Sidenotes.unbindSidenoteMouseEvents();
            });
        }, { once: true });

        GW.notificationCenter.addHandlerForEvent("Sidenotes.sidenotesDidConstruct", () => {
            doWhenMatchMedia(Sidenotes.mediaQueries.viewportWidthBreakpoint, "Sidenotes.addOrRemoveEventHandlersForCurrentMode", (mediaQuery) => {
                if (!mediaQuery.matches) {
                    /*  After the hash updates, properly highlight everything, if needed.
                        Also, if the hash points to a sidenote whose citation is in a 
                        collapse block, expand it and all collapse blocks enclosing it.
                        */
                    GW.notificationCenter.addHandlerForEvent("Collapse.targetDidRevealOnHashUpdate", Sidenotes.updateStateAfterTargetDidRevealOnHashUpdate = (info) => {
                        if (location.hash.match(/#sn[0-9]/)) {
                            revealElement(document.querySelector("#fnref" + Sidenotes.noteNumberFromHash()), false);
                            scrollElementIntoView(getHashTargetedElement(), (-1 * Sidenotes.sidenotePadding));
                        }

                        Sidenotes.updateTargetCounterpart();
                    });

                    /*  Add event handler to (asynchronously) recompute sidenote positioning 
                        when full-width media lazy-loads.
                        */
                    GW.notificationCenter.addHandlerForEvent("Rewrite.fullWidthMediaDidLoad", Sidenotes.updateSidenotePositionsAfterDidExpandFullWidthBlocks = () => {
                        requestAnimationFrame(Sidenotes.updateSidenotePositions);
                    });

                    /*  Add event handler to (asynchronously) recompute sidenote positioning
                        when collapse blocks are expanded/collapsed.
                        */
                    GW.notificationCenter.addHandlerForEvent("Collapse.collapseStateDidChange", Sidenotes.updateSidenotePositionsAfterCollapseStateDidChange = () => {
                        requestAnimationFrame(Sidenotes.updateSidenotePositions);
                    });
                } else {
                    /*  Deactivate notification handlers.
                        */
                    GW.notificationCenter.removeHandlerForEvent("Rewrite.fullWidthMediaDidLoad", Sidenotes.updateSidenotePositionsAfterDidExpandFullWidthBlocks);
                    GW.notificationCenter.removeHandlerForEvent("Collapse.collapseStateDidChange", Sidenotes.updateSidenotePositionsAfterCollapseStateDidChange);
                    GW.notificationCenter.removeHandlerForEvent("Collapse.targetDidRevealOnHashUpdate", Sidenotes.updateStateAfterTargetDidRevealOnHashUpdate);
                }
            }, null, (mediaQuery) => {
                /*  Deactivate notification handlers.
                    */
                GW.notificationCenter.removeHandlerForEvent("Rewrite.fullWidthMediaDidLoad", Sidenotes.updateSidenotePositionsAfterDidExpandFullWidthBlocks);
                GW.notificationCenter.removeHandlerForEvent("Collapse.collapseStateDidChange", Sidenotes.updateSidenotePositionsAfterCollapseStateDidChange);
                GW.notificationCenter.removeHandlerForEvent("Collapse.targetDidRevealOnHashUpdate", Sidenotes.updateStateAfterTargetDidRevealOnHashUpdate);
            });
        }, { once: true });

        /*  Once the sidenotes are constructed, lay them out.
            */
        GW.notificationCenter.addHandlerForEvent("Sidenotes.sidenotesDidConstruct", () => {
            /*  Lay out the sidenotes as soon as the document is loaded.
                */
            Sidenotes.updateSidenotePositions();

            /*  If layout remains to be done, queue up another reposition for 
                when all layout is complete.
                */
            if (!GW.pageLayoutComplete) {
                GW.notificationCenter.addHandlerForEvent("Rewrite.pageLayoutDidComplete", () => {
                    requestAnimationFrame(Sidenotes.updateSidenotePositions);
                }, { once: true });
            }

            /*  Add a resize listener so that sidenote positions are recalculated when
                the window is resized.
                */
            window.addEventListener("resize", Sidenotes.windowResized = (event) => {
                // GWLog("Sidenotes.windowResized", "sidenotes.js");

                Sidenotes.updateSidenotePositions();
            });
        }, { once: true });

        /*  Construct the sidenotes as soon as the HTML content is fully loaded.
            */
        if (!GW.isMobile())
            doWhenDOMContentLoaded(Sidenotes.constructSidenotes);

        GW.notificationCenter.fireEvent("Sidenotes.setupDidComplete");
    }
};

GW.notificationCenter.fireEvent("Sidenotes.didLoad");

/*  Update the margin note style, and add event listener to re-update it
    when the viewport width changes.
    */
doWhenPageLoaded (() => {
    doWhenMatchMedia(Sidenotes.mediaQueries.viewportWidthBreakpoint, "Sidenotes.updateMarginNoteStyleForCurrentMode", (mediaQuery) => {
        document.querySelectorAll(".marginnote").forEach(marginNote => {
            marginNote.swapClasses([ "inline", "sidenote" ], (mediaQuery.matches ? 0 : 1));
        });
    });
});

//  LET... THERE... BE... SIDENOTES!!!
Sidenotes.setup();