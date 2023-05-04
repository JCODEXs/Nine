import {produce} from 'immer';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

const pantry = (set) => ({
  ingredients: [],
  recipes:[{tittle:"first",ingredients:[{name:{name:"callo",units:"und",image:"🥚",price:"10"},quantity:"10"},{ name:  {name:"weed",units:"und",image:"🥚",price:"10"},quantity:100}],description:"ejemplo"}],
  // draggedTask: null,
  // tasksInOngoing: 0,
  addStoreIngredient: (ingredients) =>

    set(
  produce((store) => {
    console.log(ingredients);
    ingredients.forEach((ingredient) => {
      const index = store.ingredients.findIndex(
        (item) => item.name === ingredient.name
      );
      if (index === -1) {
        console.log("new item", ingredient);
        store.ingredients.push(ingredient);
      } else {
        console.log("updating item", ingredient);
        store.ingredients[index] = ingredient;
      }
    });
  }),
  false,
  "addIngredient"
),
addStoreRecipe: (_recipe) =>
    set(
  produce((store) => {
    // store.recipes.push(_recipe);
    if(store.recipes.length<1){
      store.recipes.push(_recipe);
    }
    else{

      store.recipes.forEach((recipe) => {
        const index = store.recipes.findIndex(
          (item) => item.tittle === _recipe.tittle
        );
        if (index === -1) {
          console.log("new item", _recipe);
          store.recipes.push(_recipe);
        } else {
          console.log("updating item", _recipe);
          store.recipes[index] = _recipe;
        }
      });
    }
  }
  )
  ,
  false,
  "addIngredient"
),
  deleteIngredient: (name) =>
    set((store) => ({
      ingredients: store.ingredients.filter((ingredient) => ingredient.name !== name),
    })),
  deleteAllIngredient: (name) =>
    set((store) => ({
      ingredients: store.ingredients.filter((ingredient) => ingredient.name !== ""),
    })),
 deleteRecipe: (name) =>{
 console.log(name);

    set((store) => ({
       recipes: store.recipes.filter((recipe) => recipe.tittle !== name),
    }))},
 // setDraggedTask: (title) => set({ draggedTask: title }),
  // moveTask: (title, state) =>
  //   set((store) => ({
  //     tasks: store.tasks.map((task) =>
  //       task.title === title ? { title, state } : task
  //     ),
  //   })),
});

const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log(args);
      set(...args);
    },
    get,
    api
  );

export const usePantry = create(
  subscribeWithSelector(log(persist(devtools(pantry), { name: 'pantry' })))
);

// useStore.subscribe(
//   (store) => store.ingredients,
//   (newIngredients, prevIngredients) => {
//     useStore.setState({
//       lowIngredient: newIngredients.filter((task) => task.state === 'ONGOING')
//         .length,
//     });
//   }
// );
