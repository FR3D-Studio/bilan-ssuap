import { ClipboardList } from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Button from "../ui/Button";

export default function ResumeTab({
  resume,
  copyResume,
  sendMail,
  printPdf,
  reset,
}) {
  return (
    <CardBlock title="Résumé copiable" icon={ClipboardList}>
      <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-3xl bg-slate-950 p-4 text-xs text-slate-50 md:text-sm">
        {resume}
      </pre>

      <div className="flex flex-wrap gap-2">
        <Button onClick={copyResume}>
          Copier le résumé
        </Button>

        <Button onClick={sendMail}>
          Mail texte
        </Button>

        <Button onClick={printPdf}>
          Imprimer / PDF
        </Button>

        <Button
          variant="outline"
          onClick={reset}
        >
          Réinitialiser
        </Button>
      </div>
    </CardBlock>
  );
}