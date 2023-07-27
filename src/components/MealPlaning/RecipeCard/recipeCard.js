import { useState, useEffect } from "react";
import styles from "./recipeCard.css";

export default function RecipeCard({
  recipe_,
  showPortions,
  getPortions,
  day,
  deleteCard,
}) {
  let total = 0;
  const recipe = recipe_;
  const [portions, setPortions] = useState(1);
  if (showPortions) {
    useEffect(() => {
      getPortions(day, portions, recipe.key);
    }, [portions]);
  }
  console.log(recipe_);
  return (
    <div id="itemTotal">
      {/* <pre>{JSON.stringify(recipe, null, 2)}</pre> */}
      {/* <div className="sub-tittle">Receta</div> */}
      <div className="tittlecard">
        {recipe.tittle}{" "}
        {showPortions && (
          <button
            style={{
              borderRadius: "45%",
              background: "red",
              fontSize: "0.8rem",
              padding: "0.05rem",
              margin: "-3px -2px auto auto ",
            }}
            onClick={() => {
              deleteCard();
            }}
          >
            X
          </button>
        )}
      </div>
      {showPortions && (
        <input
          type="number"
          style={{
            width: 100,
            height: 30,
            color: "darkgreen",
            borderRadius: 8,
            padding: "0.1rem",
          }}
          value={portions}
          placeholder="pedidos"
          onChange={(e) => {
            const inputValue = parseInt(e.target.value);
            const minRange = 1; // minimum allowed value
            const maxRange = 10; // maximum allowed value

            if (!isNaN(inputValue)) {
              // Check if the entered value is a valid number
              if (inputValue < minRange) {
                setPortions(minRange); // Set the minimum value if it's below the range
              } else if (inputValue > maxRange) {
                setPortions(maxRange); // Set the maximum value if it's above the range
              } else {
                setPortions(inputValue); // Set the entered value if it's within the range
              }
            } else {
              setPortions(""); // Set an empty string if the entered value is not a number
            }
          }}
          required
        />
      )}

      {/* <div
        style={{ display: "flex", justifyContent: "flex-start" }}
        onClick={() => deleteRecipe(recipe.tittle)}
      >
        🗑
      </div> */}

      <div className="in-2container">
        {recipe?.ingredients?.map((ingredient, index) => {
          total += +(
            ingredient.ingredient?.grPrice * ingredient.quantity
          ).toFixed(1);
          console.log(total, ingredient);
          return (
            <div className="in-container3" key={index}>
              {ingredient?.ingredient?.image}
              {/* {ingredient?.ingredient?.name}{" "} */}

              {/* <div className="item">{ingredient?.quantity} </div>
                <div className="baseMarc">
                  {ingredient?.ingredient?.units} ={" "}
                </div>
                <div className="itemTotal">
                  $
                  {(
                    ingredient.ingredient?.grPrice * ingredient?.quantity
                  ).toFixed(0)}{" "}
                </div> */}
            </div>
          );
        })}
        <div className="cardTotal">
          {portions}👤 Costo:
          <div className="itemcard">
            $
            {(
              (total / recipe.portions) *
              (showPortions ? portions : 1)
            ).toFixed(0)}
          </div>
          {/* <div
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
          </div> */}
        </div>
      </div>
      {/* <div className="textRecipe">{recipe.description} </div> */}
    </div>
  );
}
