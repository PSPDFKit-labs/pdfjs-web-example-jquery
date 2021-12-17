const $pdf = 'document.pdf';

const $initialState = {
  pdfDoc: null,
  currentPage: 1,
  pageCount: 0,
  zoom: 1,
};

// Render the page
const renderPage = () => {
  // load the first page
  $initialState.pdfDoc.getPage($initialState.currentPage).then((page) => {
    console.log('page', page);

    const canvas = $('#canvas')[0];
    const $ctx = canvas.getContext('2d');
    const $viewport = page.getViewport({ scale: $initialState.zoom });

    canvas.height = $viewport.height;
    canvas.width = $viewport.width;

    // Render PDF page into canvas context
    const renderCtx = {
      canvasContext: $ctx,
      viewport: $viewport,
    };

    page.render(renderCtx);

    $('#page_num').html($initialState.currentPage);
  });
};

// Load the Document
pdfjsLib
  .getDocument($pdf)
  .promise.then((doc) => {
    $initialState.pdfDoc = doc;
    console.log('pdfDocument', $initialState.pdfDoc);

    $('#page_count').html($initialState.pdfDoc.numPages);

    renderPage();
  })
  .catch((err) => {
    alert(err.message);
  });

function showPrevPage() {
  if ($initialState.pdfDoc === null || $initialState.currentPage <= 1) return;
  $initialState.currentPage--;
  // render the current page
  $('#current_page').val($initialState.currentPage);
  renderPage();
}

function showNextPage() {
  if (
    $initialState.pdfDoc === null ||
    $initialState.currentPage >= $initialState.pdfDoc._pdfInfo.numPages
  )
    return;

  $initialState.currentPage++;
  $('#current_page').val($initialState.currentPage);
  renderPage();
}

// Button Events
$('#prev-page').click(showPrevPage);
$('#next-page').click(showNextPage);

// Display a specific page
$('#current_page').on('keypress', (event) => {
  if ($initialState.pdfDoc === null) return;
  // get the key code
  const $keycode = event.keyCode ? event.keyCode : event.which;
  if ($keycode === 13) {
    // get the new page number and render it
    let desiredPage = $('#current_page')[0].valueAsNumber;

    $initialState.currentPage = Math.min(
      Math.max(desiredPage, 1),
      $initialState.pdfDoc._pdfInfo.numPages
    );
    renderPage();

    $('#current_page').val($initialState.currentPage);
  }
});

// Zoom functionality
$('#zoom_in').on('click', () => {
  if ($initialState.pdfDoc === null) return;
  $initialState.zoom *= 4 / 3;

  renderPage();
});

$('#zoom_out').on('click', () => {
  if ($initialState.pdfDoc === null) return;
  $initialState.zoom *= 2 / 3;
  renderPage();
});
