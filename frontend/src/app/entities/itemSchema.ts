type FieldSchema = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "phone" | "enum" | "date";
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
};

export const itemSchema: FieldSchema[] = [
  { name: "name", label: "Name", type: "text", required: true, maxLength: 20 },
  { name: "code", label: "Code", type: "text", required: true, maxLength: 20 },
  { name: "available", label: "Available", type: "enum", options: ["yes", "no"], required: true },
  { name: "weight", label: "Weight (kg)", type: "number", required: true, min: 0.1, max: 5000 },
];
