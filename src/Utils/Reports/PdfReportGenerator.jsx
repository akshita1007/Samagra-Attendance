import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/Images/logo.png";

const PdfReportGenerator = async ({ title, dateRange, data }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ✅ Load image properly
    const img = new Image();
    img.src = logo;

    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    /* ================= HEADER ================= */

    const logoWidth = 60;
    const logoHeight = 21;
    const rightMargin = 14;

    // ✅ TOP-RIGHT LOGO
    doc.addImage(
        img,
        "PNG",
        pageWidth - logoWidth - rightMargin,
        10,
        logoWidth,
        logoHeight
    );

    const leftMargin = 14;

// Title
doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text("Samagra Shiksha", leftMargin, 16);

// Address line 1
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.text(
  "SAMAGRA SHIKSHA, Board Office, Composite Building 2nd Floor,",
  leftMargin,
  22
);

// Address line 2
doc.text(
  "Pension Bada, Raipur, Chhattisgarh",
  leftMargin,
  27
);


    doc.setDrawColor(200);
    doc.line(14, 28, pageWidth - 14, 28);

    /* ================= TITLE ================= */

    doc.setFontSize(13);
    doc.text(title, pageWidth / 2, 36, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Date Range: ${dateRange}`, pageWidth / 2, 42, { align: "center" });

    /* ================= TABLE ================= */

    const rows = data.map(item => ([
        item.date,
        item.present,
        item.absent,
        item.leave,
        item.onduty,
    ]));

    autoTable(doc, {
        startY: 48,
        head: [["Date", "Present", "Absent", "On Leave", "On Duty"]],
        body: rows,
        headStyles: { fillColor: [33, 150, 243], textColor: 255 },
        styles: { fontSize: 9, halign: "center" },
    });

    /* ================= SAVE ================= */

    doc.save(`${title.replace(/\s/g, "_")}.pdf`);
};

export default PdfReportGenerator;
