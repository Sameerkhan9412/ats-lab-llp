import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = async (order: any) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const invoiceNumber = `INV-${Date.now()}`;
      const fileName = `${invoiceNumber}.pdf`;
      const filePath = path.join(process.cwd(), "public/invoices", fileName);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const fontPath = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");
    //   const doc = new PDFDocument({ margin: 40 });
     const doc = new PDFDocument({
        font: path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf"),
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.font(fontPath);

      // ───────────────── HEADER ─────────────────
      const logoPath = path.join(process.cwd(), "public/logo.jpg");

      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 40, { width: 80 });
      }

      doc
        .fontSize(18)
        .text("ATAS Lab LLP", 130, 40)
        .fontSize(10)
        .text("Khasra No 136, Viklang Colony,", 130, 65)
        .text("Nandgram, Ghaziabad, (U.P.)- 201001", 130, 80)
        .text("GSTIN: 22AAAAA0000A1Z5", 130, 95);

      doc
        .fontSize(20)
        .text("INVOICE", 400, 40, { align: "right" });

      doc
        .fontSize(10)
        .text(`Invoice No: ${invoiceNumber}`, { align: "right" })
        .text(`Date: ${new Date().toLocaleDateString("en-IN")}`, {
          align: "right",
        });

      doc.moveDown(3);

      // ───────────────── CUSTOMER DETAILS ─────────────────
      doc
        .fontSize(12)
        .text("Bill To:", { underline: true });

      doc
        .fontSize(10)
        .text(order?.checkoutDetails?.participant?.name || "Customer")
        .text(order?.checkoutDetails?.participant?.address1 || "")
        .text(
          `${order?.checkoutDetails?.participant?.city || ""}, ${
            order?.checkoutDetails?.participant?.state || ""
          }`
        )
        .text(`Pincode: ${order?.checkoutDetails?.participant?.pincode || ""}`);

      doc.moveDown();

      // ───────────────── TABLE HEADER ─────────────────
      const tableTop = doc.y + 10;

      doc
        .fontSize(10)
        .text("S.No", 40, tableTop)
        .text("Program", 90, tableTop)
        .text("Qty", 350, tableTop)
        .text("Price", 400, tableTop)
        .text("Total", 470, tableTop);

      doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // ───────────────── TABLE ROWS ─────────────────
      let y = tableTop + 25;

      order.items.forEach((item: any, index: number) => {
        doc
          .fontSize(10)
          .text(String(index + 1), 40, y)
          .text(item.programName, 90, y, { width: 240 })
          .text(item.quantity || 1, 350, y)
          .text(`₹${item.fees}`, 400, y)
          .text(`₹${item.fees}`, 470, y);

        y += 20;
      });

      doc.moveTo(40, y).lineTo(550, y).stroke();

      // ───────────────── TOTALS ─────────────────
      y += 20;

      doc
        .fontSize(10)
        .text(`Subtotal: ₹${order.subtotal}`, 400, y, { align: "right" });

      y += 15;

      doc
        .text(`GST (18%): ₹${order.gstAmount}`, 400, y, { align: "right" });

      y += 15;

      doc
        .fontSize(12)
        .text(`Total: ₹${order.totalAmount}`, 400, y, { align: "right" });

      // ───────────────── FOOTER ─────────────────
      doc.moveDown(4);

      doc
        .fontSize(10)
        .text("Thank you for your business!", { align: "center" });

      doc
        .fontSize(8)
        .text("This is a computer-generated invoice.", { align: "center" });

      doc.end();

      stream.on("finish", () => {
        resolve(`/invoices/${fileName}`);
      });

    } catch (err) {
      reject(err);
    }
  });
};