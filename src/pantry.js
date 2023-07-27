import { produce } from "immer";
import { create } from "zustand";
import axios from "axios";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

const pantry = (set) => ({
  ingredients: [],
  recipes: [
    // {
    //   tittle: "first",
    //   ingredients: [
    //     {
    //       name: "tomate",🫙
    //       units: "gr",
    //       image: "🍅",
    //       grPrice: "5",
    //       quantity: "450",
    //     },
    //     {
    //       name: "huevo",
    //       units: "und",
    //       image: "🥚",
    //       grPrice: "500",
    //       quantity: 4,
    //     },
    //   ],
    //   description: "ejemplo",
    //   portions: 3,
    // },
  ],
  programing: [],
  // draggedTask: null,
  // tasksInOngoing: 0,
  addStoreIngredient: (ingredients) =>
    set(
      produce((store) => {
        console.log(ingredients);
        ingredients?.forEach((ingredient) => {
          const index = store.ingredients.findIndex(
            (item) => item._id === ingredient._id
          );
          if (index === -1) {
            console.log("new item", ingredient);
            store.ingredients.push(ingredient);
            // addIngredient(ingredient.ingredient);
          } else {
            //  console.log("updating item", ingredient);
            store.ingredients[index] = ingredient;
          }
        });
      }),
      false,
      "addIngredient"
    ),
  addStorePrograming: (program) =>
    set(
      produce((store) => {
        //   console.log(Object.values(program), program);
        //   Object.entries(program)?.forEach(([day, recipes]) => {
        //     console.log(day, recipes);

        //     let existingDay =
        //       store?.programing &&
        //       store?.programing?.find((item) => item.day === day);
        //     if (!existingDay) {
        //       console.log("new day", day);
        //       store.programing[day] = recipes;
        //     } else {
        //       // Update existing day
        //       console.log("updating day", day);
        //       existingDay = recipes;
        //     }
        //   });
        // }),

        // store.programing = program;
        store.programing.push(program);
      }),
      false,
      "addProgram"
    ),
  deletePrograming: () =>
    set(
      produce(
        (store) => {
          store.programing = [];
        },
        false,
        "delteAll"
      )
    ),
  // addStorePrograming: (program) =>
  //   set(
  //     produce((store) => {
  //       console.log(Object.values(program), program);
  //       Object.entries(program,key)?.[0]?.forEach((program) => {
  //         console.log(program);

  //         const index = store.programing.findIndex(
  //           (item) => item.tittle === program.tittle
  //         );
  //         if (index === -1) {
  //           console.log("new item", program);
  //           store.programing.push(program);
  //         } else {
  //           //  console.log("updating item", program);
  //           store.programing[key] = program;
  //         }
  //       });
  //     }),
  //     false,
  //     "addProgram"
  //   ),
  addStoreRecipe: (_recipe) =>
    set(
      produce((store) => {
        // store.recipes.push(_recipe);
        if (store.recipes.length < 1) {
          store.recipes.push(_recipe);
          console.log(_recipe);
          addRecipe(_recipe);
        } else {
          store.recipes.forEach((recipe) => {
            const index = store.recipes.findIndex(
              (item) => item.tittle === _recipe.tittle
            );
            console.log(index, _recipe.ingredients[0], recipe.ingredients[0]);
            if (index === -1) {
              console.log("new item", _recipe);
              store.recipes.push(_recipe);
              addRecipe(_recipe);
            } else {
              console.log("updating item", _recipe, recipe.ingredients);
              // alert("modificando")
              store.recipes[index] = _recipe;
            }
          });
        }
      }),
      false,
      "addRecipe"
    ),
  deleteIngredient: (id) => {
    // console.log(id);
    set(
      produce((store) => {
        //console.log(store.ingredients);
        store.ingredients = store.ingredients.filter(
          (ingredient) => ingredient?._id !== id
        );
      })
    );
  },
  deleteAllIngredient: (name) =>
    set((store) => ({
      ingredients: store.ingredients.filter(
        (ingredient) => ingredient.name !== ""
      ),
    })),
  deleteRecipe: (name) => {
    console.log(name);

    set((store) => ({
      recipes: store.recipes.filter((recipe) => recipe.tittle !== name),
    }));
  },
  onRehydrate: (state) => {
    if (state) {
      console.log(state);
      set((store) => ({
        recipes: state.state.recipes,
        ingredients: state.state.ingredients,
        programing: state.state.programing,
      }));
    }
  },

  // setDraggedTask: (title) => set({ draggedTask: title }),
  // moveTask: (title, state) =>
  //   set((store) => ({
  //     tasks: store.tasks.map((task) =>
  //       task.title === title ? { title, state } : task
  //     ),
  //   })),
});

export const getRecipes = async () => {
  console.log("hi");
  const result = await axios.get("/api/recipes");
  console.log("getRecipes", result.data.result);
  // const { response, data } = result.data;
  return result.data.result;
};
export const getIngredients = async () => {
  console.log("hi");
  const result = await axios.get("/api/ingredients");
  console.log("getIngredients", result.data.result);
  // const { response, data } = result.data;
  return result.data.result;
};

export const addRecipe = async (recipe) => {
  console.log("hi");
  const result = await axios.post("/api/recipes", {
    recipe,
  });
  console.log("addRecipe", result.data);
  const { response, data } = result.data;
};

export const addIngredient = async (ingredient) => {
  console.log("hi");
  const result = await axios.post("/api/ingredients", {
    ingredient,
  });
  console.log("addIngredient", result.data);
  const { response, data } = result.data;
};

const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      // console.log(args);
      set(...args);
    },
    get,
    api
  );

export const usePantry = create(
  subscribeWithSelector(log(persist(devtools(pantry), { name: "Devtools" })))
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
