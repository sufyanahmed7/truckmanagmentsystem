import Main from "../components/Main";
import Navbar from "../components/Navbar";
import { itemSchema } from "../entities/itemSchema";
import { useItems } from "../hooks/useItems";

const initialItemState = {
  name: "",
  code: "",
  available: "",
  weight: "",
};

export default function ItemPage() {

  return (
    <>
    <Navbar />
      <Main
        schema={itemSchema}
        hookName={useItems}
        initialState={initialItemState}
        entityType="item"
      />
    </>
  );
}
