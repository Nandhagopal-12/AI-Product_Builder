export function filterPlaces(
  places,
  searchText,
  selectedCategory,
  selectedBudget,
  sortOption,
) {
  const filteredPlaces = places.filter((place) => {
    const searchValue = searchText.toLowerCase()

    const matchesSearch =
      place.name.toLowerCase().includes(searchValue) ||
      place.area.toLowerCase().includes(searchValue) ||
      place.description.toLowerCase().includes(searchValue)

    const matchesCategory =
      selectedCategory === 'All' || place.category === selectedCategory

    const matchesBudget =
      selectedBudget === 'All' || place.price === selectedBudget

    return matchesSearch && matchesCategory && matchesBudget
  })

  if (sortOption === 'name') {
    return [...filteredPlaces].sort((a, b) => a.name.localeCompare(b.name))
  }

  if (sortOption === 'time') {
    return [...filteredPlaces].sort((a, b) => a.time.localeCompare(b.time))
  }

  return filteredPlaces
}
