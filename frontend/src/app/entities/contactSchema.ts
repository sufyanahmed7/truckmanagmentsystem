type FieldSchema = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "phone" | "enum" | "date";
  required?: boolean;
  maxLength?: number;
  options?: string[];
};

export const contactSchema : FieldSchema[]= [
  { name: "account", label: "Account", type: "text", required: true, maxLength: 20 },
  { name: "company", label: "Company", type: "text", required: true, maxLength: 20 },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "phone" },
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "type", label: "Type", type: "enum", options: ["supplier", "customer"], required: true },
];
