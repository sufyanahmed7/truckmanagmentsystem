import Main from "../components/Main";
import Navbar from "../components/Navbar";
import { contactSchema } from "../entities/contactSchema";
import { useContacts } from "../hooks/useContacts";
import { Data } from "../types/company";

const initialFormState: Data = {
  account: "",
  company: "",
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
};

export default function ContactPage() {
  return (
    <>
    <Navbar />
      <Main
        schema={contactSchema}
        hookName={useContacts} 
        initialState={initialFormState}
        entityType="company"
      />
    </>
  );
}
