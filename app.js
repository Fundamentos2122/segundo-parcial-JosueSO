const formRecipe = document.getElementById("form-recipe");
const view = document.getElementById("view");
const newIng = document.getElementById("newIng");
const ingredientName = document.getElementById("ingredient-name");
const ingredientTempList = document.getElementById("ingredient-temp-list");

const recipeListKey = "recipe_list";

let ingTempList = [];

document.addEventListener("DOMContentLoaded", function() {
    formRecipe.addEventListener("submit", addRecipe);

    newIng.addEventListener("click", addIng);

    paintRecipeList();
});

//Agrega un ingrediente a la receta del formulario
function addIng() {
    if(ingredientName.value !== "") {
        let btnClose = document.createElement("button");

        btnClose.innerText = "X";
        btnClose.className = "close";
        btnClose.setAttribute("type", "button");
        btnClose.addEventListener("click", removeIng);

        let li = document.createElement("li");

        li.innerText = ingredientName.value;
        li.className = "[ bg-white color-gray ]";
        li.appendChild(btnClose);

        ingredientTempList.appendChild(li);

        ingTempList.push(ingredientName.value);

        ingredientName.value = "";
    }
}

//Elimina un ingrediente de la receta del formulario
function removeIng(e) {
    let aux_text = e.target.parentNode.innerText;

    aux_text = aux_text.substring(0, aux_text.length - 2);

    ingTempList = ingTempList.filter(i => i !== aux_text);

    e.target.parentNode.remove();
}

//Leer el formulario y guardar el objeto
function addRecipe(e) {
    e.preventDefault();

    let recipe = {
        id: Date.now(),
        title: formRecipe["title"].value,
        img_url: formRecipe["img_url"].value,
        description: formRecipe["description"].value,
        ingredients: ingTempList
    };

    let recipeList = getRecipeList();

    recipeList.push(recipe);

    localStorage.setItem(recipeListKey, JSON.stringify(recipeList));

    formRecipe["title"].value = "";
    formRecipe["img_url"].value = "";
    formRecipe["description"].value = "";
    ingTempList = [];
    ingredientTempList.innerHTML = "";

    paintRecipeList();
}

//Obtener listado de recetas del LocalStorage
function getRecipeList() {
    let recipeList = localStorage.getItem(recipeListKey);

    if (recipeList === null) {
        recipeList = [];
    }
    else {
        recipeList = JSON.parse(recipeList);
    }

    return recipeList;
}

//Pintar todo el listado de recetas
function paintRecipeList() {
    let recipeList = getRecipeList();

    let aux_html = "";

    recipeList.map(i => {
        aux_html +=
            `<div class="[ col ]">
                <div class="[ card ] [ bg-secondary color-white ] [ radius shadow ]" card-id="${i.id}">
                    <img src="${i.img_url}" alt="">
                    <div class="[ flow ]">
                        <h5>${i.title}</h5>
                        <div class="[ flex ]" data-state="justify-between">
                            <button class="[ btn ]" data-state="white" onclick="getRecipe(${i.id})">Ver</button>
                            <button class="[ btn ]" data-state="warning" onclick="deleteRecipe(${i.id})">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    view.innerHTML = 
        `<h1 class="[ color-primary ] [ text-center ]">Listado de recetas</h1>
        <div class="[ row ] [ flex ]" data-state="wrap">
            ${aux_html}
        </div>`;
}

//Eliminar la receta del LocalStorage
function deleteRecipe(id) {
    let recipe = document.querySelector(`[card-id="${id}"]`);

    recipe.setAttribute("data-state", "hide");

    let recipeList = getRecipeList();

    recipeList = recipeList.filter(i => i.id !== id);

    localStorage.setItem(recipeListKey, JSON.stringify(recipeList));

    setTimeout(() => {
        paintRecipeList();
    }, 150);
}

//Pintar la información de una receta
function getRecipe(id) {
    let recipeList = getRecipeList();

    let recipe = recipeList.find(i => i.id === id);

    let aux_html = "";
    recipe.ingredients.map(i => {
        aux_html += `<li>${i}</li>`;
    });

    view.innerHTML = 
        `<h1 class="[ color-primary ] [ text-center ]">Receta</h1>

        <div class="[ recipe ] [ flex ] [ shadow ]">
            <div class="recipe-img">
                <img src="${recipe.img_url}" alt="">
            </div>
            <div class="[ recipe-info ] [ flow ]">
                <h2>${recipe.title}</h2>
                <div class="[ text-justify ]">${recipe.description}</div>
                <h5>Ingredientes</h5>
                <ul class="[ recipe-ing ] [ flex ]" data-state="wrap">
                    ${aux_html}
                </ul>
            </div>
        </div>

        <div class="text-right">
            <button class="[ btn ]" data-state="primary" onclick="paintRecipeList()">Volver al listado</button>
        </div>`;
}
