// components/RecipeList.js

import { useState } from 'react';

const RecipeList = ({ recipes, onSelectRecipe }) => {
  const [selectedDay, setSelectedDay] = useState('');
  
  const handleDaySelection = (day) => {
    setSelectedDay(day);
  };

  const handleRecipeSelection = (recipe) => {
    if (selectedDay) {
      onSelectRecipe(selectedDay, recipe);
      setSelectedDay('');
    } else {
      // Manejar el caso en el que no se haya seleccionado un día de la semana
    }
  };

  return (
    <div>
      <h3>Lista de recetas</h3>
      {/* Muestra la lista de recetas */}
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h4>{recipe.nombre}</h4>
          {/* Aquí muestra los detalles de la receta */}
          {/* Ejemplo: <p>{recipe.descripcion}</p> */}
          <button onClick={() => handleRecipeSelection(recipe)}>Seleccionar</button>
        </div>
      ))}
      
      <h3>Seleccionar día de la semana</h3>
      {/* Permite al usuario seleccionar un día de la semana */}
      <select value={selectedDay} onChange={(e) => handleDaySelection(e.target.value)}>
        <option value="">Seleccionar día</option>
        <option value="Lunes">Lunes</option>
        <option value="Martes">Martes</option>
        <option value="Miércoles">Miércoles</option>
        <option value="Jueves">Jueves</option>
        <option value="Viernes">Viernes</option>
        <option value="Sábado">Sábado</option>
        <option value="Domingo">Domingo</option>
      </select>
    </div>
  );
};

export default RecipeList;
