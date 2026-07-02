import { useState } from 'react'
import './App.css'

const categories = ['Travel', 'Food', 'Stay', 'Ticket', 'Trekking', 'Events', 'Other']

const startingExpenses = [
  { id: 1, name: 'Bus travel', amount: 4500, category: 'Travel' },
  { id: 2, name: 'Hotel advance', amount: 6000, category: 'Stay' },
  { id: 3, name: 'Paragliding tickets', amount: 3000, category: 'Ticket' },
  { id: 4, name: 'Pine forest exploration', amount: 1200, category: 'Events' },
  { id: 5, name: 'Dinner', amount: 1800, category: 'Food' },
]

function formatMoney(value) {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })
}

function App() {
  const [budget, setBudget] = useState({
    tourName: 'Manali & Shimla Trip',
    peopleCount: 4,
    expenses: startingExpenses,
    expenseName: '',
    amount: '',
    category: 'Travel',
    error: '',
  })

  const totalCost = budget.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  )
  const costPerPerson =
    budget.peopleCount > 0 ? totalCost / budget.peopleCount : 0

  const subtotals = categories.map((item) => {
    const total = budget.expenses
      .filter((expense) => expense.category === item)
      .reduce((sum, expense) => sum + expense.amount, 0)

    return { category: item, total }
  })

  function handleAddExpense(event) {
    event.preventDefault()

    const parsedAmount = Number(budget.amount)

    if (budget.expenseName.trim() === '') {
      setBudget({ ...budget, error: 'Enter an expense name.' })
      return
    }

    if (parsedAmount <= 0) {
      setBudget({
        ...budget,
        error: 'Enter an amount greater than or equal to 1.',
      })
      return
    }

    const newExpense = {
      id: Date.now(),
      name: budget.expenseName.trim(),
      amount: parsedAmount,
      category: budget.category,
    }

    setBudget({
      ...budget,
      expenses: [newExpense, ...budget.expenses],
      expenseName: '',
      amount: '',
      category: 'Travel',
      error: '',
    })
  }

  function handleDeleteExpense(id) {
    const remainingExpenses = budget.expenses.filter(
      (expense) => expense.id !== id,
    )
    setBudget({ ...budget, expenses: remainingExpenses })
  }

  return (
    <main className="app">
      <section className="tour-panel">
        <div>
          <p className="eyebrow">Weekend budget splitter</p>
          <h1>{budget.tourName}</h1>
        </div>

        <div className="tour-inputs">
          <label>
            Tour name
            <input
              type="text"
              value={budget.tourName}
              onChange={(event) =>
                setBudget({ ...budget, tourName: event.target.value })
              }
            />
          </label>

          <label>
            Number of people
            <input
              type="number"
              min="1"
              value={budget.peopleCount}
              onChange={(event) =>
                setBudget({
                  ...budget,
                  peopleCount: Number(event.target.value),
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="budget-grid">
        <div className="summary-box">
          <span>Total cost</span>
          <strong>{formatMoney(totalCost)}</strong>
        </div>
        <div className="summary-box">
          <span>Cost per person</span>
          <strong>{formatMoney(costPerPerson)}</strong>
        </div>
        <div className="summary-box">
          <span>Total Expenses</span>
          <strong>{budget.expenses.length}</strong>
        </div>
      </section>

      <section className="content-grid">
        <form className="expense-form" onSubmit={handleAddExpense}>
          <h2>Add cost</h2>

          <label>
            Expense name
            <input
              type="text"
              placeholder="Food, room booking, trekking"
              value={budget.expenseName}
              onChange={(event) =>
                setBudget({ ...budget, expenseName: event.target.value })
              }
            />
          </label>

          <label>
            Amount
            <input
              type="number"
              min="1"
              placeholder="2500"
              value={budget.amount}
              onChange={(event) =>
                setBudget({ ...budget, amount: event.target.value })
              }
            />
          </label>

          <label>
            Category
            <select
              value={budget.category}
              onChange={(event) =>
                setBudget({ ...budget, category: event.target.value })
              }
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {budget.error && <p className="error">{budget.error}</p>}

          <button type="submit">Add expense</button>
        </form>

        <section className="expense-list">
          <h2>Expenditure list</h2>

          {budget.expenses.map((expense) => (
            <article className="expense-item" key={expense.id}>
              <div>
                <strong>{expense.name}</strong>
                <span>{expense.category}</span>
              </div>
              <p>{formatMoney(expense.amount)}</p>
              <button
                type="button"
                onClick={() => handleDeleteExpense(expense.id)}
              >
                Delete
              </button>
            </article>
          ))}
        </section>
      </section>

      <section className="subtotals">
        <h2>Sub-total cost by category</h2>
        <div className="subtotal-list">
          {subtotals.map((item) => (
            <p key={item.category}>
              <span>{item.category}</span>
              <strong>{formatMoney(item.total)}</strong>
            </p>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
