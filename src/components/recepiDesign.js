"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import styles from "./recepiDesign.css";
import Form from "./ingredientsDatabase";
import { usePantry } from "@/pantry";
import { shallow } from "zustand/shallow";
import { getRecipes, getIngredients, addIngredient } from "@/pantry";
import axios from "axios";

export default function DesignRecipe({ persistedData }) {
  const [ingredients, setIngredients] = useState(); //[{name:"huevo",units:"und",image:"🥚",price:450,grPrice:450 }, {name:"harina",units:"gr",image:"🍚",price:500,grPrice:5}]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [recipeList, setRecipeList] = useState([]);
  const [quantity, setQuantity] = useState([0]);
  const [tittle, setTittle] = useState("");
  const [portions, setPortions] = useState();
  const searchRef = useRef();
  const [addIngredientModal, setAddIngredientModal] = useState(false);
  const [recipes, setRecipes] = useState([]);
  //const [descriptionValue, setDescriptionValue] = useState("");
  const [deleteMode, setDeleteMode] = useState("chose");
  const [editableIngredient, setEditableIngredient] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const min = { gr: 50, und: 1, tbsp: 1, ml: 50, GR: 100, Ml: 100 };
  const {
    addStoreIngredient,
    addStoreRecipe,
    deleteRecipe,
    deleteIngredient,
    onRehydrate,
  } = usePantry();

  const store = usePantry();
  //let dependency= localStorage?localStorage:null;
  useEffect(() => {
    let shouldCheckLocalStorage = true;
    let storedState = null;

    if (typeof localStorage !== "undefined") {
      storedState = JSON.parse(localStorage.getItem("Devtools"));
      shouldCheckLocalStorage = false;
    }

    if (storedState) {
      store.onRehydrate(storedState);
    }
  }, [ingredientsList]);
  //}, [dependency]);

  let total = 0;
  const descriptionRef = useRef("");
  const descriptionValue = descriptionRef.current;

  const storeIngredients = usePantry((store) => store.ingredients, shallow);
  const storeRecipes = usePantry((store) => store.recipes, shallow);

  useLayoutEffect(() => {
    validateForm();
  }, [tittle, portions, recipeList]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipes = await getRecipes();
        const ingredients = await getIngredients();
        setIngredients([...ingredients]);
        setIngredientsList(ingredients);
        recipes.map((recipe) => {
          addStoreRecipe(recipe.recipe);
          console.log(recipe.recipe);
        });
        console.log(ingredients, recipes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Retrieve the persisted data from localStorage
  //       const pantryData = localStorage.getItem("pantry");
  //       const data = JSON.parse(pantryData);
  //       console.log(pantryData, data);

  //       onRehydrate(data);
  //       // Send a GET request to your server-side endpoint, passing the persisted data
  //       // const response = await axios.post("/api/persistedstore", {
  //       //   pantryData,
  //       // });
  //       // console.log(response.data);
  //       // onRehydrate(data);
  //       // Handle the response and set the persisted data received from the server
  //     } catch (error) {
  //       console.error("Error fetching persisted data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [onRehydrate]);

  useEffect(() => {
    addStoreIngredient([...ingredientsList]);

    setRecipes(storeRecipes[storeRecipes.length - 1]);

    //console.log(recipes, storeRecipes);
  }, [ingredientsList]);

  const updateRecipes = (recipe) => {
    const newRecipe = [];
    const updatedRecipe = recipe.ingredients.forEach((ing, index) => {
      const actualIngredient = ingredientsList.find((_ing) => {
        return _ing.ingredient.name === ing.ingredient.name;
      });

      if (actualIngredient) {
        newRecipe[index] = actualIngredient; // Update ing properties with actualIngredient

        // addStoreRecipe(recipe); // Update the recipe in storeRecipes
      } else {
        newRecipe[index] = ing;
      }
    });
    console.log(recipe, updateRecipes);
    return newRecipe;
  };

  // }, []);

  // useEffect(() => {
  //   let total;
  //   const updatedRecipes = storeRecipes.map((recipe) => {
  //     // console.log(recipe, ingredientsList);
  //     recipe.ingredients.forEach((ing, index) => {
  //       let newRecipe = { ...recipe };
  //       const actualIngredient = ingredientsList.find((_ing) => {
  //         // console.log(_ing, ing);
  //         // console.log(_ing.ingredient.name == ing.ingredient.name);

  //         return _ing.ingredient.name === ing.ingredient.name;
  //       });
  //       const defIngredient = { ...actualIngredient };
  //       defIngredient.quantity ??= ing.quantity;
  //       console.log(newRecipe.ingredients, defIngredient);
  //       const price = actualIngredient?.ingredient.grPrice;
  //       if (price) {
  //         newRecipe.ingredients = [
  //           ...newRecipe.ingredients.slice(0, index),
  //           defIngredient,
  //           ...newRecipe.ingredients.slice(index + 1),
  //         ];
  //         console.log("def", defIngredient, newRecipe.ingredients);
  //         // console.log(newRecipe.ingredients);
  //         addStoreRecipe(newRecipe);
  //         // setRecipes((prev) => [...prev, { [recipes[index]]: recipe }]);
  //         total += price * ing.quantity;
  //       } else {
  //         // total += ing.ingredient.grPrice * ing.quantity;
  //       }
  //     });
  //   });
  // }, []);
  useEffect(() => {
    setIngredientsList(storeIngredients);
    //console.log(storeIngredients);
  }, [storeIngredients]);

  const setSearch = () => {
    const searchValue = searchRef.current.value;
    if (searchValue) {
      const filteredIngredients = ingredientsList.filter((ingredient) =>
        ingredient.ingredient.name.includes(searchValue)
      );
      if (filteredIngredients) {
        setIngredientsList(filteredIngredients);
      }
    } else {
      const usedItems = recipeList.map((item) => {
        return item.ingredient.name;
      });

      const filteredIngredients = storeIngredients.filter(
        (item) => !usedItems.includes(item.ingredient.name)
      );

      setIngredientsList(filteredIngredients);
    }
  };
  const editRecipe = (recipe) => {
    setRecipes(recipe);
    setTittle(recipe.tittle);
    descriptionRef.current = recipe.description;
    //setDescriptionValue(recipe.description);
    const ingredients = updateRecipes(recipe);
    const quantity = recipe.ingredients.map((ingredient) => {
      return ingredient.quantity;
    });
    console.log(ingredients, recipe);
    setRecipeList(ingredients);
    setQuantity(quantity);
    setPortions(recipe.portions);
  };

  const addToRecipeList = () => {
    const ingredients = [];
    recipeList.map((item, index) => {
      const newIngredient = { ...item };
      newIngredient.quantity = quantity[index];

      ingredients.push(newIngredient);
    });
    setRecipes({
      ingredients: ingredients,
      description: descriptionValue,
      tittle: tittle,
      portions: portions,
    });
    addStoreRecipe({
      key: Math.random(8) * 10000000,
      ingredients: ingredients,
      description: descriptionValue,
      tittle: tittle,
      portions: portions,
    });
    setRecipeList([]);
    setTittle("");
    descriptionRef.current = "";
    //setDescriptionValue("");
    setQuantity([]);
    setIngredientsList(storeIngredients);
    console.log(recipeList, ingredients);
    setPortions(1);
  };
  const makeBkup = () => {
    storeIngredients.forEach((ingredient) => {
      console.log(ingredient);
      addIngredient(ingredient.ingredient);
    });
  };
  const addToRecipe = (item) => {
    console.log(item);
    if (deleteMode == "delete") {
      deleteIngredient(item._id);
      const filter = ingredientsList.filter(
        (ingredient) => ingredient._id !== item._id
      );
      setIngredientsList(filter);
    }
    if (deleteMode == "chose") {
      if (
        recipeList.some(
          (_item) => _item.ingredient.name === item.ingredient.name
        )
      ) {
      } else {
        setRecipeList((prev) => [...prev, item]);
        const filter = ingredientsList.filter(
          (ingredient) =>
            ingredient?.ingredient?.name !== item?.ingredient?.name || item.name
        );
        setIngredientsList(filter);
      }
    }
    if (deleteMode == "edit") {
      setEditableIngredient(item);
      setAddIngredientModal(true);
      //console.log(item)
    }
  };
  const removeItem = (item, index) => {
    if (
      ingredientsList.some(
        (ingredient) => ingredient?.ingredient?.name === item?.ingredient?.name // || item.name
      )
    ) {
      const filter = recipeList.filter(
        (ingredient) => ingredient?.ingredient?.name !== item?.ingredient?.name
      );
      console.log(recipeList, "filter", filter, item);
      setQuantity((prev) => {
        let quantity = prev ? [...prev] : [];
        console.log(quantity);
        const newquantity = [
          ...quantity.slice(0, index),
          ...quantity.slice(index + 1),
        ];
        return newquantity;
      });
      setRecipeList(filter);
    } else {
      setIngredientsList((prev) => [...prev, item]);
      const filter = recipeList.filter(
        (ingredient) => ingredient?.ingredient?.name !== item?.ingredient?.name
      );
      console.log(recipeList, "filter", filter, item);
      setQuantity((prev) => {
        let quantity = prev ? [...prev] : [];
        console.log(quantity);
        const newquantity = [
          ...quantity.slice(0, index),
          ...quantity.slice(index + 1),
        ];
        return newquantity;
      });
      setRecipeList(filter);
    }
  };
  const validateForm = () => {
    if (tittle.trim() === "" || +portions < 1 || recipeList.length < 1) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    ///  console.log(isDisabled,recipeList.length>1,+portions,tittle,tittle.trim() === "")
  };
  const increase = (index, units) => {
    setQuantity((prev) => {
      const newQuantity = [...prev];
      if (newQuantity[index]) {
        newQuantity[index] = +newQuantity[index] + min[units];
      } else {
        newQuantity[index] = 0 + min[units];
      }
      console.log(newQuantity);
      return newQuantity;
    });
  };

  const decrease = (index, units) => {
    setQuantity((prev) => {
      const newQuantity = [...prev];
      if (newQuantity[index] && newQuantity[index] >= min[units]) {
        newQuantity[index] = +newQuantity[index] - min[units];
      } else {
        newQuantity[index] = 0;
      }

      return newQuantity;
    });
  };
  function deleteHandler(recipetittle) {
    const result = window.confirm(
      "¿Estás seguro de que deseas borrar este elemento?"
    );
    if (result) {
      deleteRecipe(recipetittle);
    }
  }

  //console.log(deleteMode)
  return (
    <div className="out-container">
      <div className="background">Salimos</div>
      <div className="container">
        <div id="+ingredientes" className="ingredients">
          <h3 onClick={() => setAddIngredientModal(!addIngredientModal)}>
            + Ingrediente
          </h3>
          <div>
            <div>
              {addIngredientModal && (
                <Form
                  setIngredients={setIngredients}
                  editableIngredient={editableIngredient}
                  key={editableIngredient?.name}
                />
              )}
            </div>
            <div>
              <input
                type="text"
                style={{ minWidth: 100 }}
                ref={searchRef}
                onChange={setSearch}
              />
              🔎
            </div>
            <div
              className="backGuide"
              onClick={() =>
                deleteMode != "chose"
                  ? deleteMode == "delete"
                    ? setDeleteMode("chose")
                    : setDeleteMode("delete")
                  : setDeleteMode("edit")
              }
            >
              {" "}
              {deleteMode != "chose" ? (
                deleteMode == "delete" ? (
                  <div
                    style={{
                      fontSize: "1.2rem",
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    eliminar ingredientes
                  </div>
                ) : (
                  <div style={{ fontSize: "1.2rem", color: "blue" }}>
                    Editar Ingredientes
                  </div>
                )
              ) : (
                <div style={{ fontSize: "1.2rem", color: "green" }}>
                  Elegir Ingredientes
                </div>
              )}{" "}
            </div>
            <div className="items">
              {ingredientsList?.map((item, index) => {
                return (
                  <div
                    className="item"
                    key={item?._id}
                    onClick={() => addToRecipe(item)}
                    onMouseEnter={() =>
                      setHoveredItem(item.ingredient?.name || item.name)
                    }
                    onMouseLeave={() => setHoveredItem(null)}
                    data-tooltip={hoveredItem}
                  >
                    {item.ingredient?.image || item.image}
                  </div>
                );
              })}
            </div>
            <button className="button" type="button" onClick={() => makeBkup()}>
              bkup
            </button>
          </div>
        </div>

        <div id="recipe" className="recipe">
          <div>
            <h2>Nueva Receta</h2>
            <div className="out-container">
              <input
                type="text"
                style={{
                  width: "70%",
                  height: 30,
                  borderRadius: 8,
                  padding: "0.1rem",
                }}
                value={tittle}
                placeholder="Titulo"
                onChange={(e) => setTittle(e.target.value)}
                required
              />
              <input
                type="number"
                style={{
                  width: "22%",
                  height: 30,
                  borderRadius: 8,
                  padding: "0.2rem",
                }}
                value={portions}
                placeholder="# 👤"
                onChange={(e) => setPortions(e.target.value)}
                required
              />
            </div>
            <h4>Ajustar cantidades</h4>
            <div className="incrementalnputs">
              {recipeList?.map((item, index) => {
                //  console.log(item);
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexBasis: "calc(50% - 10px)",
                    }}
                    key={item?._id}
                  >
                    <div
                      className="itemQ"
                      style={{ margin: "0.3rem" }}
                      onClick={() => removeItem(item, index)}
                    >
                      {item?.ingredient?.name}
                    </div>
                    <button
                      className="buttonSum"
                      onClick={() => increase(index, item?.ingredient?.units)}
                    >
                      +
                    </button>
                    {}
                    <button
                      className="buttonSum"
                      onClick={() => decrease(index, item?.ingredient?.units)}
                    >
                      -
                    </button>{" "}
                    {
                      <div className="in-container">
                        {" "}
                        <div className="item2">{quantity?.[index]}</div>{" "}
                        <div className="baseMarc">
                          {item?.ingredient?.units}
                        </div>
                      </div>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div id="description" className="description">
          <div>
            <textarea
              type="text"
              style={{
                width: "90%",
                height: 200,
                borderRadius: 8,
                padding: "0.2rem",
              }}
              value={descriptionValue?.current}
              onChange={(e) => {
                descriptionRef.current = e.target.value;
              }}
            />
          </div>
          <button
            className={isDisabled ? "buttonDisabled" : "button"}
            disabled={isDisabled}
            onClick={addToRecipeList}
          >
            +Receta
          </button>
        </div>
      </div>

      <div className="ReceipLibrary">
        {storeRecipes.map((recipe) => {
          total = 0;
          return (
            <div
              className="totals2"
              key={recipe.key}
              onClick={() => editRecipe(recipe)}
            >
              {" "}
              Recetas anteriores
              <div id="totals">
                {/* <div className="sub-tittle">Receta</div> */}
                <div className="tittle">{recipe.tittle}</div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    display: "flex",
                    justifyContent: "flex-end",
                    borderRadius: 8,
                    marginRight: "1rem",
                    marginBottom: "0.6rem",
                  }}
                >
                  {recipe?.portions}👤
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    fontSize: "1.8rem",
                  }}
                  onClick={() => deleteHandler(recipe.tittle)}
                >
                  🗑
                </div>
                <div className="in-2container">
                  {recipe?.ingredients?.map((ingredient, index) => {
                    //   const actualIngredient = ingredientsList.find((ing) => {
                    {
                      /* console.log(
                        ing.ingredient.name === ingredient.ingredient.name,
                        ing.ingredient.name,
                        ingredient.name
                      ); */
                    }
                    {
                      /* return ing.ingredient.name === ingredient.ingredient.name;
                    }); */
                    }
                    {
                      /* const price = actualIngredient?.ingredient.grPrice;
                    // console.log(price, actualIngredient);
                    if (price) {
                      total += price * ingredient.quantity;
                    } else { */
                    }
                    total +=
                      ingredient.ingredient?.grPrice * ingredient.quantity;

                    return (
                      <div className="in-container" key={ingredient._id}>
                        <div className="item2">
                          {ingredient?.ingredient?.image}
                          {ingredient?.ingredient?.name}
                        </div>
                        {/* <div className="item2">{ingredient.ingredient?.name} </div> */}
                        <div className="item">
                          <div className="baseMarc">
                            {ingredient?.quantity}{" "}
                            {ingredient?.ingredient?.units}{" "}
                          </div>
                        </div>
                        =
                        <div className="itemTotal">
                          $
                          {
                            /* price
                            ? price * ingredient.quantity
                            :  */
                            (
                              ingredient.ingredient?.grPrice *
                              ingredient?.quantity
                            ).toFixed(0)
                          }
                        </div>
                      </div>
                    );
                  })}
                  <div key={recipe.key} className="itemTotal">
                    Costo Total:
                    <div className="item2">${total.toFixed(0)}</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "0.2rem",
                        borderRadius: 8,
                        marginRight: "0.6rem",
                        color: "blue",
                      }}
                    >
                      ${(total / recipe?.portions).toFixed(0)} 👤
                    </div>
                  </div>
                </div>
                {/* <div className="textRecipe">{recipe.description} </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
