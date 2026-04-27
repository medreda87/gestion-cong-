import jsPDF from "jspdf";

export interface DecisionData {
  decisionNumber: string;
  decisionDate: string;
  employee: {
    name: string;
    id: string;
    department: string;
    position: string;
  };
  leave: {
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
  };
  substitute: {
    name: string;
    position: string;
  };
  organization: {
    name: string;
    address: string;
    headerText: string;
    footerText: string;
  };
  director: {
    name: string;
    title: string;
  };
}

export interface DecisionCounter {
  prefix: string;
  year: number;
  counter: number;
}

export function generateDecisionNumber(counter: DecisionCounter): string {
  const paddedCounter = counter.counter.toString().padStart(4, "0");
  return `${counter.prefix}-${paddedCounter}/${counter.year}`;
}

export function generateLeaveDecisionPDF(data: DecisionData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Helper function to center text
  const centerText = (text: string, y: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  // Helper function for right-aligned text
  const rightText = (text: string, y: number) => {
    const textWidth = doc.getTextWidth(text);
    doc.text(text, pageWidth - margin - textWidth, y);
  };

  // =============== HEADER ===============
  // Kingdom emblem placeholder (rectangle)
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 35);

  // Header text
  yPos += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  centerText("المملكة المغربية", yPos);
  
  yPos += 7;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const headerLines = data.organization.headerText.split("\n");
  headerLines.forEach((line) => {
    centerText(line.trim(), yPos);
    yPos += 5;
  });

  yPos += 15;

  // =============== DECISION TITLE ===============
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  centerText("DÉCISION DE CONGÉ", yPos);
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  centerText(`N° ${data.decisionNumber}`, yPos);

  yPos += 15;

  // =============== DECISION INFO ===============
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  rightText(`Rabat, le ${data.decisionDate}`, yPos);

  yPos += 15;

  // =============== PREAMBLE ===============
  doc.setFont("helvetica", "bold");
  doc.text("Le Directeur des Ressources Humaines,", margin, yPos);
  
  yPos += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const preambleText = [
    "Vu le dahir n° 1-58-008 du 4 chaabane 1377 (24 février 1958) portant statut général de la fonction publique ;",
    "Vu le décret n° 2-99-1219 du 6 safar 1421 (10 mai 2000) fixant les modalités d'application du congé annuel ;",
    "Vu la demande de l'intéressé en date du " + data.leave.startDate + " ;",
  ];

  preambleText.forEach((text) => {
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 2;
  });

  yPos += 10;

  // =============== DECISION BODY ===============
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  centerText("DÉCIDE", yPos);
  
  yPos += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  // Article 1
  doc.setFont("helvetica", "bold");
  doc.text("Article 1 :", margin, yPos);
  yPos += 7;
  doc.setFont("helvetica", "normal");
  
  const article1Text = `${data.leave.type} est accordé à M./Mme ${data.employee.name}, ${data.employee.position} au sein du département ${data.employee.department}, matricule ${data.employee.id}.`;
  const article1Lines = doc.splitTextToSize(article1Text, pageWidth - 2 * margin);
  article1Lines.forEach((line: string) => {
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Article 2
  doc.setFont("helvetica", "bold");
  doc.text("Article 2 :", margin, yPos);
  yPos += 7;
  doc.setFont("helvetica", "normal");
  
  const article2Text = `Ce congé prend effet à compter du ${data.leave.startDate} jusqu'au ${data.leave.endDate}, soit une durée de ${data.leave.days} jours ouvrables.`;
  const article2Lines = doc.splitTextToSize(article2Text, pageWidth - 2 * margin);
  article2Lines.forEach((line: string) => {
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Article 3
  doc.setFont("helvetica", "bold");
  doc.text("Article 3 :", margin, yPos);
  yPos += 7;
  doc.setFont("helvetica", "normal");
  
  const article3Text = `Durant cette période, l'intérim sera assuré par M./Mme ${data.substitute.name}, ${data.substitute.position}.`;
  const article3Lines = doc.splitTextToSize(article3Text, pageWidth - 2 * margin);
  article3Lines.forEach((line: string) => {
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Article 4
  doc.setFont("helvetica", "bold");
  doc.text("Article 4 :", margin, yPos);
  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.text("La présente décision prend effet à compter de sa date de signature.", margin, yPos);

  yPos += 20;

  // =============== SIGNATURE ===============
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  rightText(data.director.title, yPos);
  
  yPos += 25;
  rightText(data.director.name, yPos);

  // =============== FOOTER ===============
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  // Draw footer line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
  
  // Footer text
  const footerLines = data.organization.footerText.split("\n");
  let footerY = pageHeight - 15;
  footerLines.forEach((line) => {
    centerText(line.trim(), footerY);
    footerY += 4;
  });

  return doc;
}

export function downloadDecisionPDF(data: DecisionData): void {
  const doc = generateLeaveDecisionPDF(data);
  doc.save(`Decision_Conge_${data.decisionNumber.replace(/\//g, "-")}.pdf`);
}

export function previewDecisionPDF(data: DecisionData): void {
  const doc = generateLeaveDecisionPDF(data);
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
}
