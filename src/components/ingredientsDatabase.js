import { useEffect, useRef, useState } from "react";
import styles from "./recepiDesign.css";
import { usePantry,addIngredient } from "@/pantry";
const units=["und","tbsp","gr","ml","GR","Ml"]
const min={"gr":50,"und":1,"tbsp":1,"ml":50,"GR":100,"Ml":100}

export default function Form({setIngredients,editableIngredient}) {
    const {addStoreIngredient}=usePantry()
    console.log(editableIngredient)
  const [formFields, setFormFields] = useState([
    { name: '', units: '', image: '', price: '' },
  ]);
  const handleChangeModeTiket = (index, event) => {
    const { name, value } = event.target;
    const values = [...formFields];
    values[index][name] = value;
    if (values[index].price) {
        const newPrice = values[index].quantity*values[index].price/1000;
        values[index].price = newPrice;
    }
        setFormFields(values);
  };
  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const values = [...formFields];
    console.log(values)
    values[index][name] = value;
    if (values[index].price) {
      if(values[index].units=="und"||values[index].units=="tbsp"){
        const newPrice = values[index].price;
        values[index].grPrice = newPrice;
      }
else{

  const newPrice = values[index].price/1000;
  values[index].grPrice = newPrice;
}
        console.log(values)
    }
    
    setFormFields(values);
    console.log(values,index)
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
console.log(formFields)
    event.preventDefault();
    setIngredients((prev)=>[...prev,...formFields])
   //addStoreIngredient(formFields)
   if(!editableIngredient){

     addIngredient(formFields[0])
    }
    else{
  addStoreIngredient(formFields) 
    }
    console.log(formFields);
    setFormFields([
      { name: '', units: '', image: '', price: '' },
     ])
     
    
  };

  useEffect(()=>{
    if(editableIngredient){
      const editableIngredientCopy = { ...editableIngredient.ingredient };
    setFormFields([editableIngredientCopy])}
    
  },[editableIngredient])

  return (

    <div className="out-container">
        <form onSubmit={handleSubmit}>
          {formFields?.map((field, index) => (
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
                          {` ${min[unit]}`}
                        </option>
              );
            })}
          </datalist>
        
              <input
                type="text"
                name="image"
                placeholder="emoji o nombre"
                value={field.image}
                onChange={(event) => handleChange(index, event)}
                required
              />
              <input
                type="number"
                name="price"
                placeholder={formFields[index].units!="und"?formFields[index].units!="tbsp"?"Precio/Kg":"Precio/unidad":"Precio/unidad"}
                value={field.price}
                onChange={(event) => handleChange(index, event)}
                required
              />
              {formFields.length > 1 && (
                <button className="button" type="button" onClick={() => handleRemoveField(index)}>
                  X
                </button>
              )}
            </div>
          ))}
          <button className="button" type="button" onClick={() => handleAddField()}>
            + Otro 
          </button>
          <button  className="button" type="submit">Agregar</button>
        </form>
    </div>
  );
}
