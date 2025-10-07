import React, { useEffect, useMemo, useState } from 'react'

const KEY = 'etr-task-tracker-v1'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY)
      return saved ? JSON.parse(saved) : [
        { id: 1, title: 'Set up project', done: true },
        { id: 2, title: 'Add new features', done: false },
      ]
    } catch { return [] }
  })
  const [text, setText] = useState('')

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(tasks))
  }, [tasks])

  const remaining = useMemo(() => tasks.filter(t => !t.done).length, [tasks])

  const addTask = (e) => {
    e.preventDefault()
    const title = text.trim()
    if (!title) return
    setTasks(prev => [...prev, { id: Date.now(), title, done: false }])
    setText('')
  }

  const toggle = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const remove = (id) => setTasks(prev => prev.filter(t => t.id !== id))
  const clearCompleted = () => setTasks(prev => prev.filter(t => !t.done))

  return (
    <div className="container">
      <h1>React Task Tracker</h1>
      <p className="muted">Remaining: {remaining}</p>

      <form onSubmit={addTask} className="row gap">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a new task..."
          aria-label="Task title"
          className="input"
        />
        <button type="submit" className="btn">Add</button>
      </form>

      <ul className="list">
        {tasks.map(t => (
          <li key={t.id} className="item">
            <label className="row gap">
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span className={t.done ? 'done' : ''}>{t.title}</span>
            </label>
            <button className="btn-outline" onClick={() => remove(t.id)} aria-label={`Delete ${t.title}`}>Delete</button>
          </li>
        ))}
      </ul>

      <div className="row gap">
        <button className="btn-outline" onClick={clearCompleted}>Clear Completed</button>
        <button className="btn-outline" onClick={() => setTasks([])}>Reset</button>
      </div>
    </div>
  )
}
