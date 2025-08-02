import jsPDF from 'jspdf';

export const generatePDF = async (totalCells) => {
  const pdf = new jsPDF('portrait', 'pt', 'a4');
  
  // A4 dimensions in points (72 DPI)
  const pageWidth = 595;
  const pageHeight = 842;
  
  // Margins
  const margin = 40;
  const availableWidth = pageWidth - (2 * margin);
  const availableHeight = pageHeight - (2 * margin);
  
  // Grid configuration
  const cols = 5;
  const rows = 25;
  const cellsPerPage = cols * rows;
  
  // Cell dimensions
  const cellWidth = availableWidth / cols;
  const cellHeight = availableHeight / rows;
  
  // Number label width (adjust based on max number of digits)
  const maxDigits = totalCells.toString().length;
  const numberLabelWidth = Math.max(30, maxDigits * 8 + 10);
  const responseAreaWidth = cellWidth - numberLabelWidth - 2; // 2pt for internal spacing
  
  let currentCell = 1;
  let currentPage = 1;
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  while (currentCell <= totalCells) {
    // Add new page if not the first page
    if (currentPage > 1) {
      pdf.addPage();
    }
    
    // Draw grid for current page
    const cellsOnThisPage = Math.min(cellsPerPage, totalCells - currentCell + 1);
    
    for (let i = 0; i < cellsOnThisPage; i++) {
      const cellNumber = currentCell + i;
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      const x = margin + (col * cellWidth);
      const y = margin + (row * cellHeight);
      
      // Draw cell border
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(x, y, cellWidth, cellHeight);
      
      // Draw vertical separator between number and response area
      pdf.line(x + numberLabelWidth, y, x + numberLabelWidth, y + cellHeight);
      
      // Add cell number
      pdf.setFontSize(9);
      const textY = y + (cellHeight / 2) + 3; // Center vertically
      pdf.text(cellNumber.toString(), x + 5, textY);
      
    //   // Optional: Add light grid lines in response area for writing
    //   pdf.setLineWidth(0.25);
    //   pdf.setDrawColor(200, 200, 200);
    //   const lineSpacing = 12;
    //   const linesInCell = Math.floor((cellHeight - 4) / lineSpacing);
      
    //   for (let line = 1; line <= linesInCell; line++) {
    //     const lineY = y + 2 + (line * lineSpacing);
    //     if (lineY < y + cellHeight - 2) {
    //       pdf.line(x + numberLabelWidth + 2, lineY, x + cellWidth - 2, lineY);
    //     }
    //   }
    }
    
    // Add page footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const footerText = `Page ${currentPage} • Cells ${currentCell}-${Math.min(currentCell + cellsPerPage - 1, totalCells)} of ${totalCells}`;
    const footerWidth = pdf.getTextWidth(footerText);
    pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 20);
    
    currentCell += cellsPerPage;
    currentPage += 1;
  }
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '_');
  const filename = `response_sheet_${totalCells}_cells_${timestamp}.pdf`;
  
  // Save the PDF
  pdf.save(filename);
};