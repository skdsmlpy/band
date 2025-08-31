"use client";
import SignatureCanvas from "react-signature-canvas";
import { useRef, useState } from "react";

export default function SignaturePage() {
  const ref = useRef<SignatureCanvas | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const clear = () => ref.current?.clear();
  const save = () => {
    if (!ref.current) return;
    setDataUrl(ref.current.getTrimmedCanvas().toDataURL("image/png"));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Capture Signature</h1>
      <div className="card p-4">
        <div className="border rounded-md overflow-hidden">
          <SignatureCanvas ref={ref} penColor="#111827" backgroundColor="#ffffff" canvasProps={{ width: 800, height: 200 }} />
        </div>
        <div className="mt-3 flex gap-2">
          <button className="btn-primary" onClick={clear}>Clear</button>
          <button className="btn-primary" onClick={save}>Save</button>
        </div>
      </div>
      {dataUrl && (
        <div className="card p-4">
          <div className="text-sm mb-2">Preview</div>
          <img src={dataUrl} alt="Signature preview" className="border rounded-md" />
        </div>
      )}
    </div>
  );
}
