import jsPDF from 'jspdf';

export const generatePDF = async (totalCells, pdfTitle = null) => {
  const pdf = new jsPDF('portrait', 'pt', 'a4');

  // A4 size
  const pageWidth = 595;
  const pageHeight = 842;

  // Margins and layout
  const margin = 40;
  const availableWidth = pageWidth - 2 * margin;
  const availableHeight = pageHeight - 2 * margin;

  // Grid configuration
  const cols = 4;
  const rows = 25;
  const cellWidth = availableWidth / cols;
  const cellHeight = availableHeight / rows;
  const cellsPerPage = cols * rows;
  const cellsOnFirstPage = cols * (rows - 1); // 1 row reserved for title padding

  // Widths for number and response areas
  const maxDigits = totalCells.toString().length;
  const numberLabelWidth = Math.max(30, maxDigits * 8 + 10);
  const responseAreaWidth = cellWidth - numberLabelWidth - 2;

  let currentCell = 1;
  let currentPage = 1;

  while (currentCell <= totalCells) {
    if (currentPage > 1) {
      pdf.addPage();
    }

    let pageRows = rows;
    let cellsThisPage = cellsPerPage;
    let verticalOffset = margin;

    if (currentPage === 1 && pdfTitle !== null) {
      // Reserve space on first page
      pageRows = rows - 1;
      cellsThisPage = cellsOnFirstPage;
      verticalOffset += 40; // Extra space below title

      // Draw title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      const titleWidth = pdf.getTextWidth(pdfTitle);
      pdf.text(pdfTitle, (pageWidth - titleWidth) / 2, margin);
    }

    // Column headers
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(80, 80, 80);

    for (let col = 0; col < cols; col++) {
      const x = margin + col * cellWidth;
      const separatorX = x + numberLabelWidth;
      const subCellWidth = responseAreaWidth / 2;
      const labelY = verticalOffset + -6; // Slightly above first row

      pdf.text('Response', separatorX + 2, labelY);
      pdf.text('Review', separatorX + subCellWidth + 2, labelY);
    }

    // Grid for current page
    const cellsOnThisPage = Math.min(cellsThisPage, totalCells - currentCell + 1);

    for (let i = 0; i < cellsOnThisPage; i++) {
      const cellNumber = currentCell + i;
      const row = Math.floor(i / cols);
      const col = i % cols;

      const x = margin + col * cellWidth;
      const y = verticalOffset + row * cellHeight;

      // Cell border
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(x, y, cellWidth, cellHeight);

      // Vertical dividers
      const separatorX = x + numberLabelWidth;
      const subCellWidth = responseAreaWidth / 2;
      const midSeparatorX = separatorX + subCellWidth;
      pdf.line(separatorX, y, separatorX, y + cellHeight);
      pdf.line(midSeparatorX, y, midSeparatorX, y + cellHeight);

      // Labels inside cells
      pdf.setFontSize(7);
      pdf.setTextColor(120, 120, 120);
      pdf.text('R', separatorX + 3, y + 10);
      pdf.text('M', midSeparatorX + 3, y + 10);

      // Cell number
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const textY = y + cellHeight / 2 + 3;
      pdf.text(cellNumber.toString(), x + 5, textY);
    }

    // Footer with bold page numbering
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    const footerText = `Page ${currentPage} • Cells ${currentCell}-${Math.min(currentCell + cellsThisPage - 1, totalCells)} of ${totalCells}`;
    const footerWidth = pdf.getTextWidth(footerText);
    pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 20);

    currentCell += cellsThisPage;
    currentPage++;
  }

  // Save file
  const timestamp = new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '_');
  const filename = `response_sheet_${totalCells}_cells_${timestamp}.pdf`;
  pdf.save(filename);
};
