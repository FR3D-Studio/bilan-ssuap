import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function downloadElementAsPdf(element, filename) {
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

  clone.style.display = "block";
  clone.style.visibility = "visible";

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageWidth = pageWidth;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    const imageData = canvas.toDataURL("image/png");

    let remainingHeight = imageHeight;
    let y = 0;

    pdf.addImage(imageData, "PNG", 0, y, imageWidth, imageHeight);
    remainingHeight -= pageHeight;

    while (remainingHeight > 0) {
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
