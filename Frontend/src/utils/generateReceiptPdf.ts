import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

export const generateReceiptPdf = async (
  booking: any,
  payment: any
) => {
  const doc = new jsPDF();

  /* =========================================
     COLORS
  ========================================= */
  
  const primary = [255, 170, 0];
  const dark = [30, 30, 30];
  const gray = [120, 120, 120];
  const light = [245, 245, 245];
  
  /* =========================================
     HEADER BACKGROUND
  ========================================= */
  
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 0, 210, 35, "F");
  
  /* =========================================
     COMPANY NAME
  ========================================= */
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  
  doc.text(
    "SWAYAM SAARTHI",
    14,
    18
  );
  
  doc.setFontSize(11);
  
  doc.text(
    "Professional Ride Receipt",
    14,
    27
  );
  
  /* =========================================
     INVOICE INFO
  ========================================= */
  
  const invoiceNumber =
  `SS-${new Date().getFullYear()}-${booking._id.slice(-6).toUpperCase()}`;

  
  doc.setTextColor(dark[0], dark[1], dark[2]);
  
  doc.setFontSize(18);
  
  doc.text(
    "RIDE INVOICE",
    145,
    50
  );
  
  doc.setFontSize(10);
  
  doc.setTextColor(gray[0], gray[1], gray[2]);
  
  doc.text(
    `Invoice No: ${invoiceNumber}`,
    145,
    58
  );
  
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    145,
    64
  );
  
  doc.line(
    14,
    72,
    196,
    72
  );


  /* =========================================
     INVOICE DETAILS
  ========================================= */
  
  autoTable(doc, {
    startY: 80,
  
    head: [["Invoice Details", ""]],
  
    body: [
      [
        "Booking ID",
        booking._id,
      ],
      [
        "Ride Date",
        booking.completedAt
          ? new Date(
              booking.completedAt
            ).toLocaleString()
          : "-",
      ],
      [
        "Ride Status",
        booking.status.toUpperCase(),
      ],
      [
        "Payment Status",
        payment.status.toUpperCase(),
      ],
      [
        "Payment Method",
        payment.paymentMethod.toUpperCase(),
      ],
    ],
  
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
  
    headStyles: {
      fillColor: [255, 170, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
  
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
  });

  // ===============================
  // Customer & Driver
  // ===============================
  const currentY = (doc as any).lastAutoTable.finalY;

  autoTable(doc, {
    startY: currentY + 10,
  
    head: [
      [
        "Customer",
        "Driver",
      ],
    ],
  
    body: [[
      `${booking.userId.name}
  
  ${booking.userId.email}
  
  ${booking.userId.phone}`,
  
      `${booking.driverId?.name ?? "-"}
  
  ${booking.driverId?.phone ?? "-"}`,
    ]],
  
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
  
    headStyles: {
      fillColor: [35, 35, 35],
      textColor: [255, 255, 255],
    },
  
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
  });

  // ===============================
  // Ride Details
  // ===============================
  const rideY = (doc as any).lastAutoTable.finalY;

  /* =========================================
     FARE CALCULATION
  ========================================= */
  
  const totalFare = payment.amount;
  
  const serviceFee = Math.round(totalFare * 0.05);
  
  const distanceCharge = Math.round(totalFare * 0.30);
  
  const baseFare =
    totalFare -
    distanceCharge -
    serviceFee;
  
  /* =========================================
     RIDE SUMMARY
  ========================================= */
  
  autoTable(doc, {
    startY: rideY + 10,
  
    head: [["Ride Summary", ""]],
  
    body: [
      [
        "Pickup",
        booking.pickupLocation?.name ?? "-"
      ],
  
      [
        "Destination",
        booking.dropLocation?.name ?? "-"
      ],
  
      [
        "Distance",
        `${booking.routeDistance} km`
      ],
  
      [
        "Duration",
        `${booking.routeDuration} mins`
      ],
    ],
  
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
  
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: [255, 255, 255],
    },
  
    alternateRowStyles: {
      fillColor: [248,248,248],
    },
  });

  const fareY = (doc as any).lastAutoTable.finalY;

  autoTable(doc, {
    startY: fareY + 8,
  
    head: [["Fare Breakdown", "Amount"]],
  
    body: [
      [
        "Base Fare",
        `Rs.${baseFare}`
      ],
  
      [
        "Distance Charge",
        `Rs.${distanceCharge}`
      ],
  
      [
        "Platform Fee",
        `Rs.${serviceFee}`
      ],
  
      [
        "Total Paid",
        `Rs.${totalFare}`
      ],
    ],
  
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
  
    headStyles: {
      fillColor: [255,170,0],
      textColor: [255,255,255],
    },
  
    footStyles: {
      fillColor: [35,35,35],
    },
  
    alternateRowStyles: {
      fillColor: [248,248,248],
    },
  
    didParseCell(data) {
  
      if (
        data.row.index === 3
      ) {
  
        data.cell.styles.fontStyle = "bold";
  
        data.cell.styles.fillColor = [240,248,240];
  
        data.cell.styles.textColor = [0,120,0];
      }
  
    },
  });
  

  /* =========================================
   QR CODE
  ========================================= */
  
  const qrData = `
  Booking ID : ${booking._id}
  Customer   : ${booking.userId.name}
  Driver     : ${booking.driverId?.name}
  Amount     : Rs.${payment.amount}
  Status     : ${payment.status}
  `;
  
  const qrImage = await QRCode.toDataURL(qrData);
  
  const footerStartY =
    (doc as any).lastAutoTable.finalY + 12;
  
  doc.addImage(
    qrImage,
    "PNG",
    150,
    footerStartY,
    35,
    35
  );
  
  doc.setFontSize(10);
  
  doc.setTextColor(120);
  
  doc.text(
    "Scan to verify ride details",
    145,
    footerStartY + 42
  );

  /* =========================================
     FOOTER
  ========================================= */
  
  doc.setFontSize(12);
  doc.setTextColor(40);
  
  doc.text(
    "Thank you for choosing Swayam Saarthi!",
    14,
    footerStartY + 10
  );
  
  doc.setFontSize(10);
  
  doc.setTextColor(110);
  
  doc.text(
    "Customer Support",
    14,
    footerStartY + 20
  );
  
  doc.text(
    "support@swayamsaarthi.com",
    14,
    footerStartY + 27
  );
  
  doc.text(
    "www.swayamsaarthi.in",
    14,
    footerStartY + 34
  );
  
  doc.text(
    "+91 7398425022",
    14,
    footerStartY + 41
  );
  
  doc.setDrawColor(220);
  
  doc.line(
    14,
    footerStartY + 48,
    196,
    footerStartY + 48
  );
  
  doc.setFontSize(9);
  
  doc.setTextColor(140);
  
  doc.text(
    "© 2026 Swayam Saarthi • Safe • Reliable • Trusted",
    14,
    footerStartY + 56
  );

  // =========================================
  // DOWNLOAD PDF
  // =========================================
  
  doc.save(
    `${invoiceNumber}.pdf`
  );
};