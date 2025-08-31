"use client";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useEffect, useMemo, useState } from "react";

export default function WorkflowsPage() {
  const [schemaPath, setSchemaPath] = useState("/schemas/band/main.json");
  const [schema, setSchema] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    let active = true;
    fetch(schemaPath)
      .then((r) => r.json())
      .then((json) => {
        if (!active) return;
        setSchema(json);
      });
    return () => {
      active = false;
    };
  }, [schemaPath]);

  const uiSchema = useMemo(() => (schema?.["ui:schema"] ?? {}), [schema]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workflow Renderer</h1>
        <select className="input-field w-80" value={schemaPath} onChange={(e) => setSchemaPath(e.target.value)}>
          <option value="/schemas/band/main.json">Band: Main Workflow</option>
          <option value="/schemas/band/stages/equipmentCheckout.json">Band: Equipment Checkout Stage</option>
          <option value="/schemas/band/sub-stages/equipmentCheckout/studentVerification.json">Band: Student Verification</option>
          <option value="/schemas/band/sub-stages/equipmentCheckout/equipmentSelection.json">Band: Equipment Selection</option>
        </select>
      </div>

      <div className="card p-4">
        {schema ? (
          <Form schema={schema} uiSchema={uiSchema} formData={formData} onChange={(e) => setFormData(e.formData)} onSubmit={(e) => alert(JSON.stringify(e.formData, null, 2))} validator={validator}>
            <button className="btn-primary mt-3" type="submit">Submit</button>
          </Form>
        ) : (
          <div>Loading schema…</div>
        )}
      </div>
    </div>
  );
}
