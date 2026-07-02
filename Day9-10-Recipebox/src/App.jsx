import { useEffect, useState } from 'react'
import './App.css'

const starterRecipes = [
  {
    id: 1,
    name: 'Tomato Rice',
    category: 'Lunch',
    ingredients: 'Rice, tomato, onion, spices',
    isFavorite: true,
  },
  {
    id: 2,
    name: 'Banana Smoothie',
    category: 'Breakfast',
    ingredients: 'Banana, milk, honey',
    isFavorite: false,
  },
]

function App() {
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('recipe-box-items')
    return savedRecipes ? JSON.parse(savedRecipes) : starterRecipes
  })
  const [recipeName, setRecipeName] = useState('')
  const [category, setCategory] = useState('Breakfast')
  const [ingredients, setIngredients] = useState('')
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    localStorage.setItem('recipe-box-items', JSON.stringify(recipes))
  }, [recipes])

  function handleAddRecipe(event) {
    event.preventDefault()

    if (!recipeName.trim() || !ingredients.trim()) {
      return
    }

    if (editingId !== null) {
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === editingId
            ? { ...recipe, name: recipeName, category, ingredients }
            : recipe,
        ),
      ) 
      setEditingId(null)
      setRecipeName('')
      setIngredients('')
      setCategory('Breakfast')
      return
    }

    const newRecipe = {
      id: Date.now(),
      name: recipeName,
      category,
      ingredients,
      isFavorite: false,
    }

    setRecipes([newRecipe, ...recipes])
    setRecipeName('')
    setIngredients('')
    setCategory('Breakfast')
  }

  function handleDeleteRecipe(id) {
    setRecipes(recipes.filter((recipe) => recipe.id !== id))
  }

  function handleToggleFavorite(id) {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe,
      ),
    )
  }

  function handleEditRecipe(recipe) {
    setEditingId(recipe.id)
    setRecipeName(recipe.name)
    setCategory(recipe.category)
    setIngredients(recipe.ingredients)
  }

  function handleCancelEdit() {
    setEditingId(null)
    setRecipeName('')
    setIngredients('')
    setCategory('Breakfast')
  }

  function handleClearFilters() {
    setSearchText('')
    setCategoryFilter('All')
    setShowFavoritesOnly(false)
  }

  function handleResetRecipes() {
    setRecipes(starterRecipes)
    setSearchText('')
    setCategoryFilter('All')
    setShowFavoritesOnly(false)
  }

  const visibleRecipes = recipes.filter((recipe) => {
    const searchValue = searchText.toLowerCase()

    const matchesSearch =
      recipe.name.toLowerCase().includes(searchValue) ||
      recipe.ingredients.toLowerCase().includes(searchValue)

    const matchesCategory =
      categoryFilter === 'All' || recipe.category === categoryFilter

    const matchesFavorite = !showFavoritesOnly || recipe.isFavorite

    return matchesSearch && matchesCategory && matchesFavorite
  })

  const favoriteCount = recipes.filter((recipe) => recipe.isFavorite).length

  const visibleCount = visibleRecipes.length
  const totalCount = recipes.length

  return (
    <main className="app">
      <section className="app-header">
        <div>
          <p className="eyebrow">Week 2 Day 9-10</p>
          <h1>Recipe Box</h1>
          <p className="subtitle">
            Add recipes, organize them, and keep your list after refresh.
          </p>
        </div>

        <div className="summary">
          <span>{recipes.length} recipes</span>
          <span>{favoriteCount} favorites</span>
        </div>
      </section>

      <section className="workspace">
        <form className="recipe-form" onSubmit={handleAddRecipe}>
          <h2>{editingId === null ? 'Add recipe' : 'Edit recipe'}</h2>

          <label>
            Recipe name
            <input
              value={recipeName}
              onChange={(event) => setRecipeName(event.target.value)}
              placeholder="Example: Lemon rice"
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
              <option>Dessert</option>
            </select>
          </label>

          <label>
            Ingredients
            <textarea
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              placeholder="Write the main ingredients"
              rows="4"
            />
          </label>

          <button type="submit">
            {editingId === null ? 'Add recipe' : 'Save changes'}
          </button>

          {editingId !== null && (
            <button type="button" className="secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </form>

        <section className="recipe-panel">
          <div className="filters">
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search recipes"
            />

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option>All</option>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
              <option>Dessert</option>
            </select>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(event) =>
                  setShowFavoritesOnly(event.target.checked)
                }
              />
              Favorites only
            </label>
            <button type="button" className="secondary" onClick={handleClearFilters}>
              Clear filters
            </button>

            <button type="button" className="secondary" onClick={handleResetRecipes}>
              Reset recipes
            </button>
          </div>

          <p className="filter-summary">
            Showing {visibleCount} of {totalCount} recipes
          </p>

          <div className="recipe-list">
            {visibleRecipes.length === 0 ? (
              <p className="empty-state">No recipes match your filters.</p>
            ) : (
              visibleRecipes.map((recipe) => (
                <article className="recipe-card" key={recipe.id}>
                  <div>
                    <p className="category">{recipe.category}</p>
                    <h3>{recipe.name}</h3>
                    <p>{recipe.ingredients}</p>
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className={recipe.isFavorite ? 'favorite active' : 'favorite'}
                      onClick={() => handleToggleFavorite(recipe.id)}
                    >
                      {recipe.isFavorite ? 'Favorite' : 'Mark favorite'}
                    </button>

                    <button
                      type="button"
                      className="secondary"
                      onClick={() => handleEditRecipe(recipe)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
