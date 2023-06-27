import { useState,useEffect } from "react";
import styles from "./recipeCard.css";

export default function RecipeCard({recipe_, showPortions,getPortions,day}) {
  let total = 0;
  const recipe = recipe_;
  const [portions, setPortions] = useState([]);
  useEffect(()=>{
    getPortions(day,portions,recipe.key)
  },[portions])
  console.log(recipe_);
  return (
    <div id="itemTotal">
      {/* <pre>{JSON.stringify(recipe, null, 2)}</pre> */}
      {/* <div className="sub-tittle">Receta</div> */}
      <div className="tittle">{recipe.tittle}</div>
     { showPortions&&<input
        type="number"
        style={{
          width: 100,
          height: 30,
          color: "darkgreen",
          borderRadius: 8,
          padding: "0.1rem",
        }}
        value={portions || 1}
        placeholder="pedidos"
        onChange={(e) => setPortions(e.target.value)}
        required
      />}

      {/* <div
        style={{ display: "flex", justifyContent: "flex-start" }}
        onClick={() => deleteRecipe(recipe.tittle)}
      >
        🗑
      </div> */}
      <div className="in-container2">
        {recipe?.ingredients?.map((ingredient, index) => {
          total += +(
            ingredient.ingredient?.grPrice * ingredient.quantity
          ).toFixed(1);
          console.log(total, ingredient);
          return (
            <div className="in-container" key={index}>
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
          {portions}👤
        
          Costo:
          <div className="item2">
            ${((total / recipe.portions) * (showPortions?portions:1)).toFixed(0)}
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
