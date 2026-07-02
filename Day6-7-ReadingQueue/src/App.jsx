import { useState } from 'react'
import './App.css'

const starterBooks = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'in-progress',
    progress: 35,
    note: '',
  },
  {
    id: 2,
    title: 'Deep Work',
    author: 'Cal Newport',
    status: 'unread',
    progress: 0,
    note: '',
  },
]

function App() {
  const [books, setBooks] = useState(starterBooks)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingBookId, setEditingBookId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAuthor, setEditAuthor] = useState('')

  const visibleBooks = books.filter((book) => {
    const searchValue = searchText.toLowerCase()
    const matchesSearch =
      book.title.toLowerCase().includes(searchValue) ||
      book.author.toLowerCase().includes(searchValue)

    const matchesStatus =
      statusFilter === 'all' || book.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const completedCount = books.filter((book) => book.status === 'complete').length

  function handleAddBook(event) {
    event.preventDefault()

    if (title.trim() === '' || author.trim() === '') {
      return
    }

    const newBook = {
      id: Date.now(),
      title: title.trim(),
      author: author.trim(),
      status: 'unread',
      progress: 0,
      note: '',
    }

    setBooks([newBook, ...books])
    setTitle('')
    setAuthor('')
  }

  function updateStatus(bookId, nextStatus) {
    setBooks(
      books.map((book) => {
        if (book.id !== bookId) {
          return book
        }

        const nextProgress = nextStatus === 'complete' ? 100 : book.progress
        return { ...book, status: nextStatus, progress: nextProgress }
      }),
    )
  }

  function updateProgress(bookId, nextProgress) {
    const progressNumber = Number(nextProgress)

    setBooks(
      books.map((book) => {
        if (book.id !== bookId) {
          return book
        }

        const nextStatus = progressNumber === 100 ? 'complete' : 'in-progress'
        return { ...book, progress: progressNumber, status: nextStatus }
      }),
    )
  }

  function updateNote(bookId, nextNote) {
    setBooks(
      books.map((book) => {
        if (book.id !== bookId) {
          return book
        }

        return { ...book, note: nextNote }
      }),
    )
  }

  function startEdit(book) {
    setEditingBookId(book.id)
    setEditTitle(book.title)
    setEditAuthor(book.author)
  }

  function saveEdit(bookId) {
    if (editTitle.trim() === '' || editAuthor.trim() === '') {
      return
    }

    setBooks(
      books.map((book) => {
        if (book.id !== bookId) {
          return book
        }

        return {
          ...book,
          title: editTitle.trim(),
          author: editAuthor.trim(),
        }
      }),
    )

    setEditingBookId(null)
    setEditTitle('')
    setEditAuthor('')
  }

  function deleteBook(bookId) {
    setBooks(books.filter((book) => book.id !== bookId))
  }

  return (
    <main className="app-shell">
      <section className="top-panel">
        <div>
          <p className="eyebrow">Week 2 Day 6</p>
          <h1>Reading Queue</h1>
          <p className="intro">
            Add books you want to read, track progress, and move each book from
            unread to complete.
          </p>
        </div>

        <div className="summary">
          <span>{books.length} books</span>
          <span>{completedCount} complete</span>
        </div>
      </section>

      <section className="controls">
        <form className="book-form" onSubmit={handleAddBook}>
          <input
            type="text"
            placeholder="Book title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
          <button type="submit">Add book</button>
        </form>

        <input
          className="search-input"
          type="search"
          placeholder="Search by title or author"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <div className="filter-buttons">
          <button type="button" onClick={() => setStatusFilter('all')}>
            All
          </button>
          <button type="button" onClick={() => setStatusFilter('unread')}>
            Unread
          </button>
          <button type="button" onClick={() => setStatusFilter('in-progress')}>
            In progress
          </button>
          <button type="button" onClick={() => setStatusFilter('complete')}>
            Complete
          </button>
        </div>
      </section>

      <section className="book-list" aria-label="Reading books">
        {visibleBooks.length === 0 ? (
          <p className="empty-message">No books match your search.</p>
        ) : (
          visibleBooks.map((book) => (
            <article className="book-card" key={book.id}>
              <div className="book-heading">
                {editingBookId === book.id ? (
                  <div className="edit-fields">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                    />
                    <input
                      type="text"
                      value={editAuthor}
                      onChange={(event) => setEditAuthor(event.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <h2>{book.title}</h2>
                    <p>{book.author}</p>
                  </div>
                )}
                <div className="book-actions">
                  {editingBookId === book.id ? (
                    <button type="button" onClick={() => saveEdit(book.id)}>
                      Save
                    </button>
                  ) : (
                    <button type="button" onClick={() => startEdit(book)}>
                      Edit
                    </button>
                  )}

                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => deleteBook(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="status-row">
                <label>
                  Status
                  <select
                    value={book.status}
                    onChange={(event) => updateStatus(book.id, event.target.value)}
                  >
                    <option value="unread">Unread</option>
                    <option value="in-progress">In progress</option>
                    <option value="complete">Complete</option>
                  </select>
                </label>

                <label>
                  Progress: {book.progress}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={book.progress}
                    onChange={(event) => updateProgress(book.id, event.target.value)}
                  />
                </label>
              </div>

              <div className="progress-track" aria-hidden="true">
                <div
                  className="progress-fill"
                  style={{ width: `${book.progress}%` }}
                ></div>
              </div>
              <label className="note-box">
                Notes
                <textarea
                  placeholder="Write a note about this book..."
                  value={book.note}
                  onChange={(event) => updateNote(book.id, event.target.value)}
                />
              </label>
            </article>
          ))
        )}
      </section>
    </main>
  )
}

export default App
