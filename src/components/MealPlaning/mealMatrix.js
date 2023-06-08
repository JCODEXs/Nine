// components/RecetasMatrix.js
"use client"
import { useState } from 'react';
import { Draggable } from 'gsap/all';

const RecetasMatrix = () => {
  const [selectedRecipes, setSelectedRecipes] = useState({});

  const handleSelectRecipe = (day, recipe) => {
  console.log(selectedRecipes[day])
   

 const exist= selectedRecipes[day]&& selectedRecipes[day].some((_recipe)=>{return _recipe.id===recipe.id})

if(!exist){

    setSelectedRecipes((prevSelectedRecipes) => 
    ({
        ...prevSelectedRecipes,
        [day]:[...(prevSelectedRecipes[day] || []), recipe] 
    }));
   
}
// }

//     setSelectedRecipes((prevSelectedRecipes) => 
//     ({
//       ...prevSelectedRecipes,
//       [day]: [recipe]
//     }));
  };

  const recipes = [
     {
      id: 1,
      nombre: 'Recipe 1',
      ingredients: ['ingredient 1', 'ingredient 2'],
      precio: 10,
    },
    {
      id: 2,
      nombre: 'Recipe 2',
      ingredients: ['ingredient 3', 'ingredient 4'],
      precio: 15,
    },
    // Add more recipes as needed
];
 
    const calculateTotals = () => {
        const ingredientsTotals = {};
        let totalPrice = 0;
    
        // Recorre las recetas seleccionadas
        Object.values(selectedRecipes).forEach(recipe => {
          // Recorre los ingredientes de cada receta y suma las cantidades y precios
          recipe.ingredients.forEach(ingredient => {
            const { nombre, cantidad, precio } = ingredient;
            if (ingredientsTotals[nombre]) {
              ingredientsTotals[nombre].cantidad += cantidad;
              ingredientsTotals[nombre].precio += precio * cantidad;
            } else {
              ingredientsTotals[nombre] = {
                cantidad,
                precio: precio * cantidad,
              };
            }
            totalPrice += precio * cantidad;
          });
        });
    console.log(ingredientsTotals,totalPrice)
        return { ingredientsTotals, totalPrice };
      };


  const handleDragStart = (event, recipe) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({recipe}));
    console.log(recipe)
  };
  const handleDragStartFromDay = (event, recipe, dayFrom) => {
    // if(!dayFrom){
    //     event.dataTransfer.effectAllowed = 'move';
    //     event.dataTransfer.setData('text/plain', JSON.stringify({recipe}));
    // }
    
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({recipe,dayFrom}));
    console.log(recipe)
  };


  const handleDragOver = (event) => {
    event.preventDefault();
    const target= event
    console.log(target)
  };

  const handleDrop = (event, day) => {
    event.preventDefault();

    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    const recipe = data.recipe;
    const dayFrom = data.dayFrom;
    console.log(recipe)
    if (dayFrom && selectedRecipes[dayFrom]) {
        const updatedRecipes = selectedRecipes[dayFrom].filter((r) => r.id !== recipe.id);
        setSelectedRecipes((prevSelectedRecipes) => ({
          ...prevSelectedRecipes,
          [dayFrom]: updatedRecipes,
        }));
      }
     handleSelectRecipe(day, recipe);
  };
const weekDays=['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  return (

    <div style={{overflow:scrollY}} >
          <div style={{position:"sticky", top:10,height:200,blur:"5px"}}>
          <h2  style={{backgroundColor: "rgba(0, 0, 0, 0.7)"}}>📜 Recetas </h2>
        <div style={{position:"sticky",top:10,display:"flex", display: "flex",flexDirection: "row",flexWrap: "wrap", alignContent:"center",justifyContent: "spaceAround",alignItems: "stretch",backgroundColor: "rgba(0, 0, 0, 0.7)"}}>
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                draggable
                onDragStart={(event) => handleDragStart(event, recipe)}
                style={{
                  opacity: 1,
                  cursor: 'move',
                  border: '1px solid',
                  padding: '5px',
                  marginBottom: '5px',
                  backgroundColor: 'lightgray',
                }}
              >
                {recipe.nombre}
              </div>
            ))}
           </div>
               <button onClick={calculateTotals}>Calcular Totales</button>
          </div>
       
          <div style={{display:"flex", display: "flex",flexDirection: "column",flexWrap: "wrap", alignContent:"center",justifyContent: "spaceAround",alignItems: "stretch",minHeight:"500px"}}>
            <h2>🗓 Programacion </h2>
              <div style={{
                      width: '100px',
                      height: '100px',
                    //   border: '1px solid',
                      backgroundColor: 'rgb (20,10,30,0.7)',
                      display: 'flex',
                      flexWrap:"wrap",
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flexStart',
                    }}
                // style={{
                //   display: 'grid',
                //   gridTemplateColumns: 'repeat(7, 1fr)',
                //   gap: '10px',
                // }}
              >
               
                {weekDays.map((day) => (
                <div style={{display:"flex",flexDirection:"row"}}>
                <div>
                    Totals
                </div>
               <div
                    key={day}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, day)}
                    style={{
                      width: '100px',
                      height: '100px',
                      border: '1px solid',
                      backgroundColor: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flexStart',
                    }}
                  >
                    <h4>{day}</h4>
                    {selectedRecipes[day] && selectedRecipes[day].map((_selectedRecipe) => (
                    <div
                        key={_selectedRecipe.id}
                        draggable="true"
                        onDragStart={(event) => handleDragStartFromDay(event, _selectedRecipe,day)}
                        style={{
                        opacity: 1,
                        cursor: 'move',
                        border: '1px solid',
                        padding: '5px',
                        marginBottom: '5px',
                        backgroundColor: 'lightgray',
                        textAlign: 'center',
                        }}
                    >
                        {_selectedRecipe.nombre}
                    </div>
                    ))}
                  </div>
                </div>
                ))}
                </div>          
          </div>
          
        
        </div>
  );
};

export default RecetasMatrix;
