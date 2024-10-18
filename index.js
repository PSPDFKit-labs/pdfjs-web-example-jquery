const pdf = 'document.pdf';

// Import the necessary module from pdf.js
import { GlobalWorkerOptions, getDocument } from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.min.mjs';

// Set worker source
GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs';

const initialState = {
  pdfDoc: null,
  currentPage: 1,
  pageCount: 0,
  zoom: 1,
};

// Render the page
const renderPage = () => {
  initialState.pdfDoc.getPage(initialState.currentPage).then((page) => {
    const canvas = $("#canvas")[0];
    const ctx = canvas.getContext("2d");
    const viewport = page.getViewport({ scale: initialState.zoom });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    const renderCtx = {
      canvasContext: ctx,
      viewport: viewport,
    };

    page.render(renderCtx);

    // Update current page number
    $("#page_num").text(initialState.currentPage);
  });
};

// Load the Document
getDocument(pdf).promise.then((data) => {
  initialState.pdfDoc = data;
  $("#page_count").text(initialState.pdfDoc.numPages);

  renderPage();
}).catch((err) => {
  alert(err.message);
});

// Show Previous Page
const showPrevPage = () => {
  if (initialState.pdfDoc === null || initialState.currentPage <= 1) return;
  initialState.currentPage--;
  $("#current_page").val(initialState.currentPage);
  renderPage();
};

// Show Next Page
const showNextPage = () => {
  if (initialState.pdfDoc === null || initialState.currentPage >= initialState.pdfDoc.numPages) return;
  initialState.currentPage++;
  $("#current_page").val(initialState.currentPage);
  renderPage();
};

// Zoom In
const zoomIn = () => {
  if (initialState.pdfDoc === null) return;
  initialState.zoom *= 1.25;
  renderPage();
};

// Zoom Out
const zoomOut = () => {
  if (initialState.pdfDoc === null) return;
  initialState.zoom *= 0.8;
  renderPage();
};

// Bind events using jQuery
$("#prev_page").on("click", showPrevPage);
$("#next_page").on("click", showNextPage);
$("#zoom_in").on("click", zoomIn);
$("#zoom_out").on("click", zoomOut);

// Keypress Event for jumping to a page
$("#current_page").on("keypress", (event) => {
  if (initialState.pdfDoc === null) return;

  if (event.keyCode === 13) {
    let desiredPage = parseInt($("#current_page").val());
    initialState.currentPage = Math.min(Math.max(desiredPage, 1), initialState.pdfDoc.numPages);
    $("#current_page").val(initialState.currentPage);
    renderPage();
  }
});

// Optional Print Support
$(".print-button").on("click", () => {
  window.print();
});
