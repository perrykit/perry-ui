/**
 * Perry UI Todo App Example
 *
 * A functional todo app demonstrating:
 * - Input component (text entry)
 * - Button component (actions)
 * - Checkbox component (todo completion)
 * - Card component (layout)
 * - Dialog component (delete confirmation)
 * - Toast component (notifications)
 */

import { Window } from "perry/ui"
import { VStack, HStack } from "perry/ui"
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Checkbox } from "./components/ui/checkbox"
import { Dialog } from "./components/ui/dialog"
import { Label } from "./components/ui/label"

interface Todo {
  id: number
  text: string
  completed: boolean
}

let todos: Todo[] = []
let nextId = 1
let inputText = ""
let pendingDelete: number | null = null

function addTodo() {
  if (inputText.trim()) {
    todos.push({
      id: nextId++,
      text: inputText,
      completed: false
    })
    inputText = ""
    updateTodoList()
    showToast("Todo added")
  }
}

function toggleTodo(id: number) {
  const todo = todos.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    updateTodoList()
  }
}

function confirmDelete(id: number) {
  pendingDelete = id
  showDeleteDialog()
}

function deleteTodo() {
  if (pendingDelete !== null) {
    todos = todos.filter(t => t.id !== pendingDelete)
    pendingDelete = null
    updateTodoList()
    showToast("Todo deleted")
  }
}

function updateTodoList() {
  const container = document.getElementById("todo-list")
  if (container) {
    container.innerHTML = ""
    todos.forEach(todo => {
      const todoItem = createTodoItem(todo)
      container.appendChild(todoItem)
    })
  }
}

function createTodoItem(todo: Todo): HTMLElement {
  const row = document.createElement("div")
  row.className = "todo-item"

  const checkbox = Checkbox({
    checked: todo.completed,
    onCheckedChange: (checked) => toggleTodo(todo.id)
  })

  const label = Label({
    children: todo.text,
    style: todo.completed ? { opacity: 0.5 } : undefined
  })

  const deleteButton = Button({
    children: "Delete",
    variant: "destructive",
    size: "sm",
    onPress: () => confirmDelete(todo.id)
  })

  row.appendChild(checkbox)
  row.appendChild(label)
  row.appendChild(deleteButton)

  return row
}

function showDeleteDialog() {
  const dialog = Dialog({
    title: "Delete Todo",
    description: "Are you sure you want to delete this todo?",
    onConfirm: deleteTodo,
    onCancel: () => { pendingDelete = null }
  })
  dialog.show()
}

function showToast(message: string) {
  // Toast implementation
  console.log("Toast:", message)
}

export function main() {
  return Window({
    title: "Todo App",
    width: 500,
    height: 600,
    children: [
      VStack(16, [
        // Header
        Card({
          children: [
            Label({
              children: "My Todos",
              variant: "heading"
            })
          ]
        }),

        // Input section
        Card({
          children: [
            HStack(8, [
              Input({
                placeholder: "Add a new todo...",
                value: inputText,
                onChange: (value) => { inputText = value }
              }),
              Button({
                children: "Add",
                variant: "default",
                onPress: addTodo
              })
            ])
          ]
        }),

        // Todo list
        Card({
          children: [
            Label({ children: "Todos", variant: "label" }),
            VStack(8, [
              // Todo items will be rendered here
            ])
          ]
        })
      ])
    ]
  })
}
