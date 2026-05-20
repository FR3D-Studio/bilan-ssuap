import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export async function downloadElementAsPdf(
  element,
  filename,
  { padding = "8mm" } = {}
) {
  if (!element) {
    window.print();
    return;
  }

  const wrapper = document.createElement("div");
  const clone = element.cloneNode(true);

  wrapper.style.position = "fixed";
  wrapper.style.left = "-10000px";
  wrapper.style.top = "0";
  wrapper.style.display = "block";
  wrapper.style.visibility = "visible";
  wrapper.style.background = "white";
  wrapper.style.zIndex = "-1";
  wrapper.style.width = `${A4_WIDTH_MM}mm`;
  wrapper.style.margin = "0";
  wrapper.style.padding = "0";

  clone.style.display = "block";
  clone.style.visibility = "visible";
  clone.style.width = `${A4_WIDTH_MM}mm`;
  clone.style.minHeight = `${A4_HEIGHT_MM}mm`;
  clone.style.maxWidth = "none";
  clone.style.boxSizing = "border-box";
  clone.style.margin = "0";
  clone.style.padding = padding;
  clone.style.background = "#ffffff";
  clone.style.color = "#000000";
  clone.style.fontFamily = "Arial, Helvetica, sans-serif";
  clone.style.transform = "none";
  clone.style.position = "static";

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    await document.fonts?.ready;

    const width = Math.ceil(clone.scrollWidth);
    const height = Math.ceil(clone.scrollHeight);

    const canvas = await html2canvas(clone, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageWidth = pageWidth;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    const imageData = canvas.toDataURL("image/png");
    const pageOverflowTolerance = 1;

    let remainingHeight = imageHeight;
    let y = 0;

    pdf.addImage(imageData, "PNG", 0, y, imageWidth, imageHeight);
    remainingHeight -= pageHeight;

    while (remainingHeight > pageOverflowTolerance) {
      y -= pageHeight;
      pdf.addPage();
      pdf.addImage(imageData, "PNG", 0, y, imageWidth, imageHeight);
      remainingHeight -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    wrapper.remove();
  }
}
