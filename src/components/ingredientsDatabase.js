import { useRef, useState } from "react";
import styles from "./recepiDesign.css";
import { usePantry } from "@/pantry";
const units=["und","tbsp","gr","ml"]

export default function Form({setIngredients}) {
    const {addStoreIngredient,deleteIngredient}=usePantry()
  const [formFields, setFormFields] = useState([
    { name: '', units: '', image: '', price: '' },
  ]);

  const handleChange = (index, event) => {
    const values = [...formFields];
    values[index][event.target.name] = event.target.value;
    setFormFields(values);
  };

  const handleAddField = () => {
    setFormFields([...formFields, { name: '', units: '', image: '', price: '' }]);
  };

  const handleRemoveField = (index) => {
    const values = [...formFields];
    values.splice(index, 1);
    setFormFields(values);
   // deleteIngredient(values)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIngredients((prev)=>[...prev,...formFields])
   addStoreIngredient(formFields)
    console.log(formFields);
    setFormFields([
        { name: '', units: '', image: '', price: '' },
      ])
     
    
  };

  return (

    <div className="out-container">
        <form onSubmit={handleSubmit}>
          {formFields.map((field, index) => (
            <div key={`${index}`}>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={field.name}
                onChange={(event) => handleChange(index, event)}
                required
              />
             <input
            type="text"
            name="units"
            list="units"
            placeholder="Unidades"
            value={field.units}
            onChange={(event) => handleChange(index, event)}
            required
            />
            <datalist id="units">
              {units.map((unit) => {
                return (
                        <option key={unit} value={unit}>
                          {` ${unit}`}
                        </option>
              );
            })}
          </datalist>
        
              <input
                type="text"
                name="image"
                placeholder="Imagen"
                value={field.image}
                onChange={(event) => handleChange(index, event)}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Precio"
                value={field.price}
                onChange={(event) => handleChange(index, event)}
                required
              />
              {formFields.length > 1 && (
                <button type="button" onClick={() => handleRemoveField(index)}>
                  X
                </button>
              )}
            </div>
          ))}
          <button className="button" type="button" onClick={() => handleAddField()}>
            +Ingrediente
          </button>
          <button  className="button" type="submit">Registrar</button>
        </form>
    </div>
  );
}
