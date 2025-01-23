/* Copyright 2014 Mozilla Foundation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

if (!pdfjsLib.getDocument || !pdfjsViewer.PDFPageView) {
    // eslint-disable-next-line no-alert
    alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
}

// The workerSrc property shall be specified.
//
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "pdf.worker.js";

// Some PDFs need external cmaps.
//
const CMAP_URL = "cmaps/";
const CMAP_PACKED = true;

const DEFAULT_URL = "./document.pdf";
const PAGE_TO_VIEW = 1;
const SCALE = 1.0;
const SEARCH_FOR = ""; // try "Mozilla";

const ENABLE_XFA = true;

const SANDBOX_BUNDLE_SRC = new URL(
    "pdf.sandbox.js",
    window.location
);


const container = document.getElementById("viewerContainer");

const eventBus = new pdfjsViewer.EventBus();

// (Optionally) enable hyperlinks within PDF files.
const pdfLinkService = new pdfjsViewer.PDFLinkService({
    eventBus,
});

// (Optionally) enable find controller.
const pdfFindController = new pdfjsViewer.PDFFindController({
    eventBus,
    linkService: pdfLinkService,
});

// (Optionally) enable scripting support.
const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
    eventBus,
    sandboxBundleSrc: SANDBOX_BUNDLE_SRC,
});

const pdfSinglePageViewer = new pdfjsViewer.PDFSinglePageViewer({
    container,
    eventBus,
    linkService: pdfLinkService,
    findController: pdfFindController,
    scriptingManager: pdfScriptingManager,
});
pdfLinkService.setViewer(pdfSinglePageViewer);
pdfScriptingManager.setViewer(pdfSinglePageViewer);

eventBus.on("pagesinit", function () {
    // We can use pdfSinglePageViewer now, e.g. let's change default scale.
    pdfSinglePageViewer.currentScaleValue = "page-fit";
});

// Loading document.
const loadingTask = pdfjsLib.getDocument({
    url: DEFAULT_URL,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    enableXfa: ENABLE_XFA,
});

const pdfDocument = await loadingTask.promise;
// Document loaded, specifying document for the viewer and
// the (optional) linkService.
pdfSinglePageViewer.setDocument(pdfDocument);

pdfLinkService.setDocument(pdfDocument, null);

document.getElementById('next-page').addEventListener('click', function () {
    pdfSinglePageViewer.nextPage();
    
    sendTrackingEvent('page_changed', { page: pdfSinglePageViewer.currentPageNumber, totalPages: pdfSinglePageViewer.pagesCount });

    if (isLastPage()) {
        document.getElementById('complete-module').style.display = 'inline';
        document.getElementById('next-page').style.display = 'none';
    }

    if (!isFirstPage()) {
        document.getElementById('prev-page').style.display = 'inline';
    }
});

document.getElementById('prev-page').addEventListener('click', function () {
    pdfSinglePageViewer.previousPage();
    
    sendTrackingEvent('page_changed', { page: pdfSinglePageViewer.currentPageNumber, totalPages: pdfSinglePageViewer.pagesCount });

    if (!isLastPage()) {
        document.getElementById('next-page').style.display = 'inline';
    }

    if (isFirstPage()) {
        document.getElementById('prev-page').style.display = 'none';
    }
});

document.getElementById('complete-module').addEventListener('click', function () {
    pdfSinglePageViewer.previousPage();
    sendTrackingEvent('completed');
});

document.getElementById('find').addEventListener('click', function () {
    const searchText = document.getElementById('find-input').value;

    const options = {
        type: "again",
        query: searchText,
        caseSensitive: false,
        entireWord: false,
        highlightAll: true,
        phraseSearch: true,
    };
 
    eventBus.dispatch("find", options)
});

const isInPresentationMode = pdfSinglePageViewer.isInPresentationMode || pdfSinglePageViewer.isChangingPresentationMode

document.getElementById('increase-scale').addEventListener('click', function () {
    if (!isInPresentationMode)
        pdfSinglePageViewer.increaseScale();
});

document.getElementById('decrease-scale').addEventListener('click', function () {
    if (!isInPresentationMode)
        pdfSinglePageViewer.decreaseScale();
});

function sendTrackingEvent(eventType, details = {}) {
    const trackingData = {
        eventType,
        timestamp: new Date().toISOString(),
        details
    };

    if (typeof SCORM2004 !== 'undefined') {
        SCORM2004.setValue("cmi.interactions.n", JSON.stringify(trackingData));
        SCORM2004.commit();
    } else if (typeof SCORM12 !== 'undefined') {
        SCORM12.setValue("cmi.suspend_data", JSON.stringify(trackingData));
        SCORM12.commit();
    } else {
        console.log('Tracking Event:', trackingData);
    }
}

function isFirstPage() {
    console.log('current page', pdfSinglePageViewer.currentPageNumber);
    return pdfSinglePageViewer.currentPageNumber === 1;
}

function isLastPage() {
    console.log('current page', pdfSinglePageViewer.currentPageNumber);
    console.log('total pages', pdfSinglePageViewer.pagesCount);
    return pdfSinglePageViewer.currentPageNumber === pdfSinglePageViewer.pagesCount;
}