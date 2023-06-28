// components/RecetasMatrix.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { Draggable } from "gsap/all";
import { usePantry } from "@/pantry";
import { shallow } from "zustand/shallow";
import RecipeCard from "./RecipeCard/recipeCard";
const MealMatrix = () => {
  const [selectedRecipes, setSelectedRecipes] = useState({});
  const storeRecipes = usePantry((store) => store.recipes, shallow);
  const [recipes, setRecipes] = useState();
  const [dayTotals,setDayTotals]=useState()

  const  setProgramPortions =(day,portions,recipeID)=>{

    setSelectedRecipes((prevSelectedRecipes) => {
      console.log(prevSelectedRecipes[day])
      const currentRecipes = prevSelectedRecipes[day] ?? [];
   let modifiedRecipe= currentRecipes.find((recipe)=>recipe.key==recipeID);
   let restRecipes=currentRecipes.filter((recipe)=>recipe.key!==recipeID);
   if (modifiedRecipe) {
    const updatedRecipe = { ...modifiedRecipe, realPortions: portions };
   console.log(modifiedRecipe)
   const modifiedIndex = currentRecipes.findIndex((recipe) => recipe.key === recipeID);
      const newRecipes = [
        ...currentRecipes.slice(0, modifiedIndex),
        updatedRecipe,
      ...currentRecipes.slice(modifiedIndex + 1),
      ];
      const updatedSelectedRecipes = {
        ...prevSelectedRecipes,
        [day]: newRecipes,
      };

      return updatedSelectedRecipes;
}
else{

  return prevSelectedRecipes
}
})
  }
  console.log(selectedRecipes)

  const handleSelectRecipe = (day, _recipe) => {
    console.log(day, _recipe);
   
    const isRecipeSelected = selectedRecipes[day]?.some((recipe) => {
      return _recipe.key === recipe.key;
    });

    if (!isRecipeSelected) {
      setSelectedRecipes((prevSelectedRecipes) => ({
        ...prevSelectedRecipes,
        [day]: [...(prevSelectedRecipes[day] || []), _recipe],
      }));
    }
  };
  
  // const handleSelectRecipe = (day, recipe) => {
  //   console.log(selectedRecipes[day]);

  //   const exist =
  //     selectedRecipes[day] &&
  //     selectedRecipes[day].some((_recipe) => {
  //       return _recipe.id === recipe.id;
  //     });

  //   if (!exist) {
  //     setSelectedRecipes((prevSelectedRecipes) => ({
  //       ...prevSelectedRecipes,
  //       [day]: [...(prevSelectedRecipes[day] || []), recipe],
  //     }));
  //   }

  //   // }

  //   //     setSelectedRecipes((prevSelectedRecipes) =>
  //   //     ({
  //   //       ...prevSelectedRecipes,
  //   //       [day]: [recipe]
  //   //     }));
  // };
  useEffect(() => {
    setRecipes(storeRecipes);
  }, [storeRecipes]);

  // const recipes =
  //   {
  //     id: 1,
  //     nombre: "Recipe 1",
  //     ingredients: ["ingredient 1", "ingredient 2"],
  //     precio: 10,
  //   },
  //   {
  //     id: 2,
  //     nombre: "Recipe 2",
  //     ingredients: ["ingredient 3", "ingredient 4"],
  //     precio: 15,
  //   },
  //   // Add more recipes as needed
  // ];

  const calculateTotals = () => {
    const ingredientsTotals = {};
    let totalPrice = [];

    // Recorre las recetas seleccionadas
    Object.entries(selectedRecipes).forEach(([key,recipes]) => {
      console.log( selectedRecipes[key])
      selectedRecipes[key].map((recipe)=>{const RecipeIngredients=recipe.ingredients
      console.log(RecipeIngredients)})
      console.log(recipes)
      // Recorre los ingredientes de cada receta y suma las cantidades y precios
      if(selectedRecipes[key].length>1){
        totalPrice[key]=0
        selectedRecipes[key].forEach((recipe)=>{
          const porciones= recipe.portions
          const realPortions=recipe.realPortions
          console.log(recipe.portions)
          recipe.ingredients.map((ingredient) => {
             const ingredientProps=ingredient.ingredient
             const cantidad=ingredient.quantity
             const { name:nombre, grPrice:precio } = ingredientProps;
             console.log(ingredientProps,nombre,  precio)
             if (ingredientsTotals[nombre]) {
               ingredientsTotals[nombre].cantidad += (cantidad/porciones)*realPortions;
               ingredientsTotals[nombre].precio +=( precio * cantidad)/porciones;
             } else {
               ingredientsTotals[nombre] = {
                 cantidad:cantidad*realPortions,
                 precio: (((precio * cantidad)/porciones)*realPortions)*realPortions,
               };
             }
             totalPrice[key] += ((precio * cantidad)/porciones)*realPortions;
           });
        })
          console.log(totalPrice[key],key)
        setDayTotals((prevDaysTotal) => ({
          ...prevDaysTotal,
          [key]: totalPrice[key]
        }))
        
      }
      else{
        totalPrice[key]=0
        selectedRecipes[key]?.[0].ingredients.map((ingredient) => {
          const realPortions=selectedRecipes[key]?.[0].realPortions
          const porciones= selectedRecipes[key]?.[0]?.portions
          const ingredientProps=ingredient.ingredient
          const cantidad=ingredient.quantity
          const { name:nombre, grPrice:precio } = ingredientProps;
          console.log(ingredientProps,nombre,  precio)
          if (ingredientsTotals[nombre]) {
            ingredientsTotals[nombre].cantidad += (cantidad/porciones)*realPortions;
            ingredientsTotals[nombre].precio += ((precio * cantidad)/porciones)*realPortions;
          } else {
            ingredientsTotals[nombre] = {
              cantidad:cantidad*realPortions,
              precio: ((precio * cantidad)/porciones)*realPortions,
            };
          }
          totalPrice[key] += ((precio * cantidad)/porciones)*realPortions;
        });
        console.log(totalPrice[key],key)
        setDayTotals((prevDaysTotal) => ({
          ...prevDaysTotal,
          [key]: totalPrice[key]
        }))
        
        
      }
     console.log(dayTotals)
   
    });
    console.log(ingredientsTotals, dayTotals);
 
    return { ingredientsTotals, totalPrice };
  };

  const handleDragStart = (event, recipe) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", JSON.stringify({ recipe }));
    console.log(recipe);
  };
  const handleDragStartFromDay = (event, recipe, dayFrom) => {
    // if(!dayFrom){
    //     event.dataTransfer.effectAllowed = 'move';
    //     event.dataTransfer.setData('text/plain', JSON.stringify({recipe}));
    // }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ recipe, dayFrom })
    );
    console.log(recipe);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    const target = event;
    console.log(target);
  };

  const handleDrop = (event, day) => {
    event.preventDefault();
    const data = event?.dataTransfer?.getData("text/plain");
    let parsedData = null;

    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      // Handle the error (e.g., display a message, set default values, etc.)
      console.error("Error parsing JSON data:", error);
    }

    const recipe = parsedData.recipe;
    const dayFrom = parsedData.dayFrom;
    console.log(recipe, dayFrom);
    if (dayFrom && selectedRecipes[dayFrom]) {
      const updatedRecipes = selectedRecipes[dayFrom].filter(
        (r) => r.id !== recipe.id
      );
      setSelectedRecipes((prevSelectedRecipes) => ({
        ...prevSelectedRecipes,
        [dayFrom]: updatedRecipes,
      }));
    }
    handleSelectRecipe(day, recipe);
  };
  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  return (
    <div style={{ overflow: "scrollY", background: "rgb(220,180,0,0.8)" }}>
      <div style={{ position: "sticky", top: 10, height: 180, blur: "5px" ,}}>
        
        <div
          style={{ backgroundColor: "rgba(190, 190, 190, 0.7)", fontSize: "1.1rem" }}
        >
          📜 Recetas{" "}
        </div>
      
        <div
          style={{
            position: "sticky",
            top: 10,
            display: "flex",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            overflowX:"scroll",
            alignContent: "center",
            justifyContent: "spaceAround",
            alignItems: "stretch",
            backgroundColor: "rgba(190, 190, 210, 0.8)",
          
            padding: "0.3rem",
            height:"190px",
            fontSize:"0.8rem"
          }}
        >
          {recipes?.map((recipe) => (
            <div
              draggable="true"
              key={recipe.key}
              onDragStart={(event) => handleDragStart(event, recipe)}
            >
              <div
                style={{
                  opacity: 1,
                  cursor: "move",
                  border: "1px solid",
                  padding: "5px",
                  margin: "5px",
                  backgroundColor: "lightgray",
                  backgroundImage:'url("../assets/810.jpg")', backgroundRepeat: "repeat",backgroundSize:"120px" ,
                  borderRadius: "3px",
                  minWidth:"90px",
                  maxWidth:"150px",
                  maxHeight: "170px"
                }}
              >
                <RecipeCard key={recipe.key} recipe_={recipe} showPortions={false} getPortions={()=>{}}/>
                
              </div>
            </div>
          ))}
            <pre>{JSON.stringify(selectedRecipes,null,2)}</pre>
        </div>
        <button onClick={calculateTotals}>Calcular Totales</button>
      </div>

      <div
        style={{
          display: "flex",
         flexDirection: "column",
          alignContent: "center",
          justifyContent: "spaceAround",
          alignItems: "stretch",
          overflowY:"scroll",
          filter: "grayscale(10%) brightness(85%) sepia(15%) contrast(92%) opacity(98%)",
          marginTop: "4rem",
          minHeight: "300px",
        }}
      >
        <h2>🗓 Programacion </h2>
      
        <div
          style={{
            width: "120px",
            height: "100px",
            backgroundImage:'url("../assets/810.jpg")',
            //   border: '1px solid',
            backgroundColor: "rgb (220,240,230,0.7)",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flexStart",
          }}
          // style={{
          //   display: 'grid',
          //   gridTemplateColumns: 'repeat(7, 1fr)',
          //   gap: '10px',
          // }}
        >
          {weekDays.map((day, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "row" }}>
              <div style={{
            position: "sticky",
            top: 10,
            display: "flex",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
              alignContent: "center",
            justifyContent: "spaceAround",
            alignItems: "stretch",
            backgroundColor: "rgba(190, 190, 210, 0.8)",
            padding: "1rem",
            fontSize:"1rem",
            border:"2px solid black"
          }}>
            <div>Totals</div>
          <div>
            ${(dayTotals?.[day])?.toFixed(0) }
            </div>
          </div>
              <div
                draggable
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, day)}
                style={{
                  minWidth: "460px",
                  minHeight: "100px",
                  border: "1px solid",
                  display: "flex",
                  background:"rgb(210,210,210,0.8)",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flexStart",
                  borderRadius: "3px",
                  boxShadow: "-2px -2px black",
                }}
              >
                <h4>{day}</h4>
<div
     style={{
      display:"flex",
      flexDirection:"row",}}>
  
                  {selectedRecipes[day] &&
                    selectedRecipes[day].map((_selectedRecipe) => (
                      <div
  
                        key={_selectedRecipe.id}
                        draggable="true"
                        onDragStart={(event) =>
                          handleDragStartFromDay(event, _selectedRecipe, day)
                        }
                        style={{
                          display:"flex",
                          flexDirection:"row",
                          opacity: 1,
                          borderRadius:"17px",
                          cursor: "move",
                          border: "1px solid",
                          maxWidth:150,
                          padding: "5px",
                          marginBottom: "5px",
                          margin:"0.1rem",
                          backgroundColor: "lightgray",
                          textAlign: "center",
                        }}
                      >
                        <RecipeCard key={_selectedRecipe.key} recipe_={_selectedRecipe} day={day} showPortions={true} getPortions={setProgramPortions}/>
                      
                      </div>
                    ))}
</div>

              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealMatrix;
