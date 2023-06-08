// components/RecetasMatrix.js

import { useState } from 'react';

// Aquí importa tus datos de recetas desde el archivo JSON o desde una fuente de datos

const RecetasMatrix = () => {
  const [selectedRecipes, setSelectedRecipes] = useState({});

  // Función para manejar la selección de recetas en un día de la semana
  const handleSelectRecipe = (day, recipe) => {
    setSelectedRecipes(prevState => ({
      ...prevState,
      [day]: recipe,
    }));
  };

  // Función para calcular el total de ingredientes y precios
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

    return { ingredientsTotals, totalPrice };
  };

  return (
    <div>
      <h2>Seleccionar recetas</h2>
      {/* Aquí puedes mostrar la lista de recetas y permitir la selección */}
      {/* Puedes usar componentes adicionales para mostrar y seleccionar recetas */}
      {/* Ejemplo: <RecipeList onSelectRecipe={handleSelectRecipe} /> */}
      
      <h2>Matriz de recetas</h2>
      <table>
        <thead>
          <tr>
            <th>Día</th>
            <th>Receta</th>
          </tr>
        </thead>
        <tbody>
          {/* Recorre los días de la semana */}
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
            <tr key={day}>
              <td>{day}</td>
              <td>{selectedRecipes[day]?.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={calculateTotals}>Calcular Totales</button>
      {/* Muestra los totales de ingredientes y precio */}
    </div>
  );
};

export default RecetasMatrix;
