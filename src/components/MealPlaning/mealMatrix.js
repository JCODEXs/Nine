// components/RecetasMatrix.js
"use client";
import { useEffect, useState } from "react";
import { Draggable } from "gsap/all";
import { usePantry } from "@/pantry";
import { shallow } from "zustand/shallow";
import RecipeCard from "./RecipeCard/recipeCard";
const MealMatrix = () => {
  const [selectedRecipes, setSelectedRecipes] = useState({});
  const storeRecipes = usePantry((store) => store.recipes, shallow);
  const [recipes, setRecipes] = useState();

  const handleSelectRecipe = (day, recipe) => {
    console.log(day, recipe);
    console.log(selectedRecipes[day]);
    const isRecipeSelected = selectedRecipes[day]?.some((_recipe) => {
      return _recipe.key === recipe.key;
    });

    if (!isRecipeSelected) {
      setSelectedRecipes((prevSelectedRecipes) => ({
        ...prevSelectedRecipes,
        [day]: [...(prevSelectedRecipes[day] || []), recipe],
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
    let totalPrice = 0;

    // Recorre las recetas seleccionadas
    Object.values(selectedRecipes).forEach((recipe) => {
      // Recorre los ingredientes de cada receta y suma las cantidades y precios
      recipe.ingredients.forEach((ingredient) => {
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
    console.log(ingredientsTotals, totalPrice);
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
    <div style={{ overflow: "scrollY", background: "rgb(30,90,60,0.8)" }}>
      <div style={{ position: "sticky", top: 10, height: 200, blur: "5px" }}>
        <div
          style={{ backgroundColor: "rgba(10, 0, 0, 0.7)", fontSize: "1.5rem" }}
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
            flexWrap: "wrap",
            alignContent: "center",
            justifyContent: "spaceAround",
            alignItems: "stretch",
            backgroundColor: "rgba(0, 0, 10, 0.7)",
            padding: "1rem",
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
                  borderRadius: "3px",
                }}
              >
                <RecipeCard key={recipe.key} recipe={recipe} />
              </div>
            </div>
          ))}
        </div>
        {/* <button onClick={calculateTotals}>Calcular Totales</button> */}
      </div>

      <div
        style={{
          display: "flex",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "spaceAround",
          alignItems: "stretch",
          marginTop: "2rem",
          minHeight: "600px",
        }}
      >
        <h2>🗓 Programacion </h2>
        <div
          style={{
            width: "120px",
            height: "100px",
            //   border: '1px solid',
            backgroundColor: "rgb (20,10,30,0.7)",
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
              <div>Totals</div>
              <div
                draggable
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, day)}
                style={{
                  minWidth: "160px",
                  minHeight: "100px",
                  border: "1px solid",
                  backgroundColor: "rgb(0,10,10,0.8)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flexStart",
                  borderRadius: "3px",
                  boxShadow: "-2px -2px black",
                }}
              >
                <h4>{day}</h4>
                {selectedRecipes[day] &&
                  selectedRecipes[day].map((_selectedRecipe) => (
                    <div
                      key={_selectedRecipe.id}
                      draggable="true"
                      onDragStart={(event) =>
                        handleDragStartFromDay(event, _selectedRecipe, day)
                      }
                      style={{
                        opacity: 1,
                        cursor: "move",
                        border: "1px solid",
                        padding: "5px",
                        marginBottom: "5px",
                        backgroundColor: "lightgray",
                        textAlign: "center",
                      }}
                    >
                      <RecipeCard recipe={_selectedRecipe} />
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

export default MealMatrix;
