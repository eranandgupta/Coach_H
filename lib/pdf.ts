// Shared, quality-first PDF export for the printable "sheets" (Transformation
// Logbook, Habit Tracker month grid).
//
// The naive approach — render the whole sheet to one tall canvas and slice it
// into A4-height chunks — cuts straight through table rows, section headers and
// the footer. This helper instead breaks pages ONLY at "safe" boundaries: the
// tops of elements marked with `data-pdf-break` (table rows, section titles,
// the footer). A page never ends in the middle of a row or heading.
//
// Mark break points in the printable DOM like:  <tr data-pdf-break> … </tr>
export async function exportElementToPdf(el: HTMLElement, filename: string) {
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  // scale 2 ≈ 150 DPI at A4 — crisp, and stays under iOS Safari's canvas-area
  // limit (~16.7M px) even for a tall logbook.
  const scale = 2;
  const canvas = await html2canvas(el, {
    scale,
    backgroundColor: '#ffffff',
    useCORS: true,
    imageTimeout: 0,
  });

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const marginY = 6; // mm — small top/bottom breathing room on every page
  const usableH = pageH - marginY * 2;

  const pxPerMm = canvas.width / pageW;        // horizontal px → mm (full-bleed width)
  const maxSlicePx = Math.floor(usableH * pxPerMm); // tallest slice that fits one page

  // Collect safe break offsets (in canvas px, relative to the captured element).
  const elRect = el.getBoundingClientRect();
  const cssToCanvas = canvas.height / elRect.height; // handles sub-pixel rounding
  const breaks = Array.from(el.querySelectorAll<HTMLElement>('[data-pdf-break]'))
    .map((b) => (b.getBoundingClientRect().top - elRect.top) * cssToCanvas)
    .filter((y) => y > 1 && y < canvas.height - 1)
    .sort((a, b) => a - b);

  let start = 0;
  let firstPage = true;

  while (start < canvas.height - 1) {
    const idealEnd = start + maxSlicePx;
    let end: number;

    if (idealEnd >= canvas.height) {
      end = canvas.height;
    } else {
      // Largest safe break that fits on this page (and makes forward progress).
      let candidate = -1;
      for (const y of breaks) {
        if (y > start + 1 && y <= idealEnd) candidate = y;
        else if (y > idealEnd) break;
      }
      // Fallback: if a single block is taller than a page (shouldn't happen with
      // row-level breaks), hard-cut so we still make progress.
      end = candidate > 0 ? candidate : idealEnd;
    }

    const sliceH = Math.round(Math.min(end, canvas.height) - start);
    if (sliceH <= 0) break;

    // Copy just this slice onto its own canvas, on a white background.
    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = sliceH;
    const ctx = slice.getContext('2d');
    if (!ctx) break;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, start, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

    const imgHmm = sliceH / pxPerMm;
    if (!firstPage) pdf.addPage();
    pdf.addImage(slice.toDataURL('image/png'), 'PNG', 0, marginY, pageW, imgHmm);
    firstPage = false;

    start = Math.round(end);
  }

  pdf.save(filename);
}
