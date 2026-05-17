import { useRef } from "react";
import { FileDown } from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Button from "../ui/Button";

import logoMedifire from "../../assets/logo-medifire.png";
import { downloadElementAsPdf } from "../../utils/pdfExport";

const SECTION_TITLES = new Set([
  "INTERVENTION",
  "IDENTITÉ",
  "CIRCONSTANCES",
  "PRIMAIRE XABCDE",
  "SECONDAIRE",
  "GESTES",
  "SAMU",
  "SURVEILLANCE",
]);

function splitResumeSections(resume) {
  const lines = String(resume || "").split("\n");
  const sections = [];
  let current = null;

  lines.forEach((line) => {
    const clean = line.trim();

    if (!clean || clean === "BILAN VICTIME") return;

    if (SECTION_TITLES.has(clean)) {
      current = { title: clean, lines: [] };
      sections.push(current);
      return;
    }

    if (current) current.lines.push(line);
  });

  return sections;
}

function PrintableResume({ resume, pageRef }) {
  const sections = splitResumeSections(resume);

  return (
    <div className="print-only">
      <div ref={pageRef} className="print-page">
        <header className="relative mb-4 overflow-hidden border-b-4 border-black pb-4">
          <div className="absolute inset-0 opacity-[0.03]">
            <img src={logoMedifire} alt="" className="absolute right-0 top-[-30px] h-52 object-contain" />
          </div>

          <div className="relative z-10 grid grid-cols-[110px_1fr_110px] items-center">
            <div className="flex justify-start">
              <img src={logoMedifire} alt="Logo MédiFIRE" className="h-28 w-28 object-contain drop-shadow-sm" />
            </div>

            <div className="text-center">
              <div className="mb-1 text-sm font-black uppercase tracking-[0.35em] text-slate-600">MédiFIRE</div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-black">Fiche bilan SSUAP</h1>
              <div className="mt-1 text-2xl font-black uppercase tracking-[0.25em] text-slate-800">RFFS</div>
              <div className="mx-auto mt-3 h-[2px] w-40 bg-black" />
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                Résumé opérationnel imprimable
              </p>
            </div>

            <div />
          </div>
        </header>

        <div className="grid gap-3">
          {sections.map((section, sectionIndex) => (
            <section key={section.title} className="break-inside-avoid overflow-hidden rounded-sm border-2 border-slate-300">
              <div className="flex items-center justify-between bg-black px-3 py-2">
                <h2 className="text-[12px] font-black uppercase tracking-[0.18em] text-white">
                  {section.title}
                </h2>
                <div className="text-[10px] font-bold text-slate-300">
                  {String(sectionIndex + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="bg-white px-3 py-3">
                <div className="space-y-2 text-[11px] leading-relaxed text-black">
                  {section.lines.length > 0 ? (
                    section.lines.map((line, index) => (
                      <div key={`${section.title}-${index}`} className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-1">
                        {line || "—"}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-1">—</div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-4 border-t border-slate-300 pt-2 text-center">
          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            MédiFIRE • Génération opérationnelle SSUAP • RFFS
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function ResumeTab({
  resume,
  copyResume,
  sendMail,
  printPdf,
  reset,
}) {
  const pageRef = useRef(null);

  const downloadPdf = async () => {
    try {
      await downloadElementAsPdf(pageRef.current, "bilan-ssuap.pdf");
    } catch {
      printPdf();
    }
  };

  return (
    <>
      <style>
        {`
          .print-only {
            display: none;
          }

          @media print {
            body {
              background: white !important;
            }

            body * {
              visibility: hidden !important;
            }

            .print-only,
            .print-only * {
              visibility: visible !important;
            }

            .print-only {
              display: block !important;
              position: absolute;
              inset: 0;
              background: white;
            }

            .print-page {
              width: 210mm;
              min-height: 297mm;
              padding: 8mm;
              margin: 0 auto;
              background: white;
              color: black;
              font-family: Arial, sans-serif;
            }

            @page {
              size: A4;
              margin: 0;
            }
          }
        `}
      </style>

      <CardBlock title="Résumé copiable" icon={FileDown}>
        <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-xs text-slate-50 md:text-sm">
          {resume}
        </pre>

        <div className="flex flex-wrap gap-2">
          <Button onClick={copyResume}>Copier le résumé</Button>
          <Button onClick={sendMail}>Mail texte</Button>
          <Button onClick={downloadPdf}>Télécharger PDF</Button>
          <Button variant="outline" onClick={reset}>Réinitialiser</Button>
        </div>
      </CardBlock>

      <PrintableResume resume={resume} pageRef={pageRef} />
    </>
  );
}
