// components/RecetasMatrix.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { Draggable } from "gsap/all";
import { usePantry } from "@/pantry";
import { shallow } from "zustand/shallow";
import RecipeCard from "./RecipeCard/recipeCard";
const MealMatrix = () => {
  const { addStorePrograming } = usePantry();
  const [selectedRecipes, setSelectedRecipes] = useState({});
  const storeRecipes = usePantry((store) => store.recipes, shallow);
  const [recipes, setRecipes] = useState();
  const [dayTotals, setDayTotals] = useState();
  const [ingredientsTotList, setIngredientsTotList] = useState("");
  const programing = usePantry((store) => store.programing, shallow);
  const { deletePrograming } = usePantry();
  console.log(programing);
  const deleteFromSelected = (day, recipeID) => {
    setSelectedRecipes((prevSelectedRecipes) => {
      console.log(prevSelectedRecipes[day]);

      return {
        ...prevSelectedRecipes,
        [day]: [
          ...prevSelectedRecipes?.[day]?.filter(
            (prevRecipes) => prevRecipes?.key !== recipeID
          ),
        ],
      };
    });
  };

  const setProgramPortions = (day, portions, recipeID) => {
    setSelectedRecipes((prevSelectedRecipes) => {
      console.log(prevSelectedRecipes[day]);
      const currentRecipes = prevSelectedRecipes[day] ?? [];
      let modifiedRecipe = currentRecipes.find(
        (recipe) => recipe.key == recipeID
      );
      let restRecipes = currentRecipes.filter(
        (recipe) => recipe.key !== recipeID
      );
      if (modifiedRecipe) {
        const updatedRecipe = { ...modifiedRecipe, realPortions: portions };
        console.log(modifiedRecipe);
        const modifiedIndex = currentRecipes.findIndex(
          (recipe) => recipe.key === recipeID
        );
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
      } else {
        return prevSelectedRecipes;
      }
    });
  };
  console.log(selectedRecipes);

  const handleSelectRecipe = (day, _recipe) => {
    console.log(day, _recipe);

    const isRecipeSelected = selectedRecipes?.[day]?.some((recipe) => {
      return _recipe.key === recipe.key;
    });

    if (!isRecipeSelected) {
      setSelectedRecipes((prevSelectedRecipes) => ({
        ...prevSelectedRecipes,
        [day]: [...(prevSelectedRecipes?.[day] || []), _recipe],
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
    console.log(programing);
    setSelectedRecipes(programing[programing.length - 1]);
  }, [storeRecipes]);
  useEffect(() => {
    calculateTotals();
  }, [selectedRecipes]);

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

    {
      selectedRecipes &&
        Object?.entries(selectedRecipes).forEach(([key, recipes]) => {
          console.log(selectedRecipes[key]);
          selectedRecipes[key].map((recipe) => {
            const RecipeIngredients = recipe.ingredients;
            console.log(RecipeIngredients);
          });
          console.log(recipes);
          // Recorre los ingredientes de cada receta y suma las cantidades y precios
          if (selectedRecipes[key].length > 1) {
            totalPrice[key] = 0;
            selectedRecipes[key].forEach((recipe) => {
              const porciones = recipe.portions;
              const realPortions = recipe.realPortions;
              console.log(recipe.portions);
              recipe.ingredients.map((ingredient) => {
                const ingredientProps = ingredient.ingredient;
                const cantidad = ingredient.quantity / porciones;
                const { name: nombre, grPrice: precio } = ingredientProps;
                console.log(ingredientProps, nombre, precio);
                if (ingredientsTotals[nombre]) {
                  ingredientsTotals[nombre].cantidad += cantidad * realPortions;
                  ingredientsTotals[nombre].precio += precio * cantidad;
                } else {
                  ingredientsTotals[nombre] = {
                    cantidad: cantidad * realPortions,
                    precio: precio * cantidad * realPortions,
                  };
                }
                totalPrice[key] += precio * cantidad * realPortions;
              });
            });
            console.log(totalPrice[key], key);
            setDayTotals((prevDaysTotal) => ({
              ...prevDaysTotal,
              [key]: totalPrice[key],
            }));
          } else {
            totalPrice[key] = 0;
            selectedRecipes[key]?.[0]?.ingredients.map((ingredient) => {
              const realPortions = selectedRecipes[key]?.[0].realPortions;
              const porciones = selectedRecipes[key]?.[0]?.portions;
              const ingredientProps = ingredient.ingredient;
              const cantidad = ingredient.quantity / porciones;
              const { name: nombre, grPrice: precio } = ingredientProps;
              console.log(ingredientProps, nombre, precio);
              if (ingredientsTotals[nombre]) {
                ingredientsTotals[nombre].cantidad += cantidad * realPortions;
                ingredientsTotals[nombre].precio +=
                  precio * cantidad * realPortions;
              } else {
                ingredientsTotals[nombre] = {
                  cantidad: cantidad * realPortions,
                  precio: precio * cantidad * realPortions,
                };
              }
              totalPrice[key] += precio * cantidad * realPortions;
            });
            console.log(totalPrice[key], key);
            setDayTotals((prevDaysTotal) => ({
              ...prevDaysTotal,
              [key]: totalPrice[key],
            }));
          }
          console.log(dayTotals);
        });
    }
    setIngredientsTotList(ingredientsTotals);

    const weekPrice = Object.values(ingredientsTotals).reduce(
      (total, ingredient) => {
        return total + ingredient.precio;
      },
      0
    );
    setDayTotals((prevDaysTotal) => ({
      ...prevDaysTotal,
      ["total"]: weekPrice,
    }));
    console.log(weekPrice);
    console.log(ingredientsTotals, dayTotals);
    // const weekPrice = in?.reduce((acc, ingredient) => {
    //   return ingredient.price + acc;
    // }, 0);
    // console.log(weekPrice);
    return { ingredientsTotals, totalPrice, weekPrice };
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
        (r) => r.key !== recipe.key
      );
      setSelectedRecipes((prevSelectedRecipes) => ({
        ...prevSelectedRecipes,
        [dayFrom]: updatedRecipes,
      }));
    }
    handleSelectRecipe(day, recipe);
  };
  const weekDays = [
    // "1ª",
    // "2ª",
    // "3ª",
    // "4ª",
    // "5ª",
    // "6ª",
    // "7ª",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
    "Lunesgo",
    "Marto",
  ];
  const ingredientList = Object.entries(ingredientsTotList).map(
    ([ingredient, details]) => (
      <li key={ingredient}>
        {details.cantidad?.toFixed(1)}
        {details.cantidad > 49 ? "gr" : "unid"} {ingredient} Price:{" "}
        {details.precio?.toFixed(0)}
      </li>
    )
  );
  return (
    <div
      style={{
        overflow: "scrollY",
        background: "rgb(0,10,10,0.8)",
        boxShadow: "-2px -2px -4px rgb(210,210,210,0.8)",
        background: "rgb(220,180,0,0.8)",
        minHeight: 200,
      }}
    >
      <div style={{ position: "sticky", top: 20, height: 260, blur: "5px" }}>
        <div
          style={{
            position: "sticky",
            top: 10,
            display: "flex",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            overflowX: "scroll",
            alignContent: "flex-start",
            justifyContent: "spaceAround",
            alignItems: "stretch",
            backgroundColor: "rgba(190, 190, 210, 0.8)",
            padding: "0.3rem",
            height: "270px",
            fontSize: "0.8rem",
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
                  border: "2.8px solid",
                  padding: "5px",
                  margin: "5px",
                  backgroundColor: "lightgray",
                  backgroundImage: 'url("../assets/810.jpg")',
                  backgroundRepeat: "repeat",
                  backgroundSize: "120px",
                  borderRadius: "8px",
                  borderColor: "rgb(15,50,55,0.9)",
                  minWidth: "150px",
                  maxWidth: "160px",
                  height: "170px",
                  zIndex: 7,
                }}
              >
                <RecipeCard
                  key={recipe.key}
                  recipe_={recipe}
                  showPortions={false}
                  getPortions={() => {}}
                />
              </div>
            </div>
          ))}

          {/* <div
            style={{
              //border: "3px solid blue",
              margin: "4px",
              minWidth: "400",
              padding: "4px",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "space-arround",
              flexWrap: "wrap",
            }}
          >
            {ingredientList}
          </div> */}
          {/* <pre>{JSON.stringify(selectedRecipes, null, 2)}</pre> */}
        </div>
        <button
          onClick={() => {
            addStorePrograming(selectedRecipes);
          }}
        >
          Guardar Programacion
        </button>
        <button
          onClick={() => {
            deletePrograming();
          }}
        >
          {" "}
          delete
        </button>
        <div
          style={{
            display: "flex",
            fontSize: "1.5rem",
            background: "rgb(15,1,10,0.31)",
            justifyContent: "space-around",
          }}
        >
          <div>🗓 Programacion </div>{" "}
          <div> Total :{dayTotals?.["total"]?.toFixed(0)}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "spaceAround",
          alignItems: "stretch",
          overflowY: "scroll",
          filter:
            "grayscale(10%) brightness(85%) sepia(15%) contrast(92%) opacity(98%)",
          marginTop: "4rem",
          minHeight: "400px",
          gap: "5px",
        }}
      >
        <div
          style={{
            height: "100px",
            backgroundImage: 'url("../assets/810.jpg")',
            //   border: '1px solid',
            backgroundColor: "rgb (220,240,230,0.7)",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flexStart",
            margin: "0.2rem",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "5px",
          }}
          // style={{
          //   display: 'grid',
          //   gridTemplateColumns: 'repeat(7, 1fr)',
          //   gap: '10px',
          // }}
        >
          {weekDays.map((day, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: 300,
                margin: "0.1rem",
                flexWrap: "wrap",
              }}
            >
              <div
                draggable
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, day)}
                style={{
                  minWidth: "260px",
                  minHeight: "270px",
                  border: "2px solid",
                  display: "flex",
                  background: "rgb(210,210,210,0.8)",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flexStart",
                  borderRadius: "6px",
                  boxShadow: "-2px -2px -4px rgb(210,210,210,0.8)",
                  flexWrap: "wrap",
                  gap: "5px",
                }}
              >
                <div style={{ fontSize: "1.9rem" }}>{day}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "7px",
                  }}
                >
                  {selectedRecipes?.[day] &&
                    selectedRecipes[day].map((_selectedRecipe) => (
                      <div
                        key={_selectedRecipe.id}
                        draggable="true"
                        onDragStart={(event) =>
                          handleDragStartFromDay(event, _selectedRecipe, day)
                        }
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          opacity: 1,
                          borderRadius: "10px",
                          cursor: "move",
                          border: "1px solid",
                          maxWidth: 150,
                          padding: "5px",
                          marginBottom: "5px",
                          margin: "0.18rem",
                          backgroundColor: "lightgray",
                          textAlign: "center",
                        }}
                      >
                        <RecipeCard
                          key={_selectedRecipe.key}
                          recipe_={_selectedRecipe}
                          day={day}
                          showPortions={true}
                          getPortions={setProgramPortions}
                          deleteCard={() => {
                            deleteFromSelected(day, _selectedRecipe.key);
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
              <div
                style={{
                  // position: "sticky",
                  // top: 10,
                  display: "flex",
                  margin: "3px",
                  color: "rgb(60,30,10,0.9)",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignContent: "space-around",
                  justifyContent: "space-around",
                  alignItems: "stretch",
                  backgroundColor: "rgba(190, 190, 210, 0.8)",
                  padding: "0.2rem",
                  fontSize: "1.3rem",
                  border: "2px solid rgb(190,40,20,0.9)",
                  boxShadow: "2px 5px 10px",
                  borderRadius: "8px",
                  gap: "5px",
                }}
              >
                Total:
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  ${dayTotals?.[day]?.toFixed(0)}
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
