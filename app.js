// DOM Elements
const todoForm = document.getElementById("todo-form")
const todoText = document.getElementById("todo-text")
const todoList = document.getElementById("todo-list")
const doneList = document.getElementById("done-list")
const deleteAllBtn = document.getElementById("delete-all")
const currentDateElement = document.getElementById("current-date")
const currentTimeElement = document.getElementById("current-time")

// Update current date and time
function updateDateTime() {
  const now = new Date()

  // Format date (e.g., "Monday, January 1, 2023")
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  currentDateElement.textContent = now.toLocaleDateString("en-US", options)

  // Format time (e.g., "12:00:00 PM")
  currentTimeElement.textContent = now.toLocaleTimeString("en-US")
}

// Update time every second
updateDateTime()
setInterval(updateDateTime, 1000)

// Priority colors
const priorityColors = {
  low: "green",
  medium: "yellow",
  high: "red",
}

// Load todos from localStorage
function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || []

  // Clear existing lists
  todoList.innerHTML = ""
  doneList.innerHTML = ""

  // Separate completed and pending todos
  const pendingTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)

  // Add pending todos to TODO list
  pendingTodos.forEach((todo) => {
    addTodoToDOM(todo, false)
  })

  // Add completed todos to DONE list
  completedTodos.forEach((todo) => {
    addTodoToDOM(todo, true)
  })

  // Check for overdue todos
  checkOverdueTodos()
}

// Add a todo to the DOM
function addTodoToDOM(todo, isCompleted) {
  const todoElement = document.createElement("div")
  todoElement.className = `flex items-start p-3 border rounded-md ${
    isCompleted ? "bg-gray-100 border-gray-200" : "bg-white border-gray-300"
  }`

  // Add overdue class if the todo is overdue
  const now = new Date()
  const todoDate = new Date(todo.date)
  const isOverdue =
    !isCompleted && now > new Date(todoDate.setDate(todoDate.getDate() + 1))

  if (isOverdue) {
    todoElement.classList.add("border-red-300", "bg-red-50")
  }

  todoElement.innerHTML = `
        <div class="flex items-start w-full">
            <div class="flex items-center h-5 mt-1 mr-3">
                <input type="checkbox" ${isCompleted ? "checked" : ""} 
                    class="h-4 w-4 rounded border-gray-300 text-${
                      priorityColors[todo.priority]
                    }-500 focus:ring-${
    priorityColors[todo.priority]
  }-500 cursor-pointer"
                    data-id="${todo.id}">
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium ${
                  isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                }">
                    ${todo.text}
                </p>
                <div class="flex items-center mt-1 text-xs text-gray-500">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${
                      priorityColors[todo.priority]
                    }-100 text-${priorityColors[todo.priority]}-800 mr-2">
                        ${
                          todo.priority.charAt(0).toUpperCase() +
                          todo.priority.slice(1)
                        }
                    </span>
                    <span>${formatDate(todo.date)}</span>
                    ${
                      isOverdue
                        ? '<span class="ml-2 text-red-500">(Overdue/Late)</span>'
                        : ""
                    }
                </div>
            </div>
        </div>
    `

  if (isCompleted) {
    doneList.appendChild(todoElement)
  } else {
    todoList.appendChild(todoElement)
  }

  // Add event listener to checkbox
  const checkbox = todoElement.querySelector('input[type="checkbox"]')
  checkbox.addEventListener("change", toggleTodoStatus)
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Check for overdue todos
function checkOverdueTodos() {
  const now = new Date()
  const todos = JSON.parse(localStorage.getItem("todos")) || []

  todos.forEach((todo) => {
    if (!todo.completed) {
      const todoDate = new Date(todo.date)
      if (now > new Date(todoDate.setDate(todoDate.getDate() + 1))) {
        // Todo is overdue
        console.log(`Todo "${todo.text}" is overdue!`)
      }
    }
  })
}

// Toggle todo status (completed/pending)
function toggleTodoStatus(e) {
  const todoId = e.target.dataset.id
  const todos = JSON.parse(localStorage.getItem("todos")) || []

  const updatedTodos = todos.map((todo) => {
    if (todo.id === todoId) {
      return { ...todo, completed: !todo.completed }
    }
    return todo
  })

  localStorage.setItem("todos", JSON.stringify(updatedTodos))
  loadTodos()
}

// Add new todo
todoForm.addEventListener("submit", function (e) {
  e.preventDefault()

  const text = todoText.value.trim()
  const priority = document.querySelector(
    'input[name="priority"]:checked'
  ).value

  if (text) {
    const newTodo = {
      id: Date.now().toString(),
      text,
      priority,
      date: new Date().toISOString(),
      completed: false,
    }

    const todos = JSON.parse(localStorage.getItem("todos")) || []
    todos.push(newTodo)
    localStorage.setItem("todos", JSON.stringify(todos))

    addTodoToDOM(newTodo, false)
    todoText.value = ""
  }
})

// Delete all todos
deleteAllBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to delete all todos?")) {
    localStorage.removeItem("todos")
    todoList.innerHTML = ""
    doneList.innerHTML = ""
  }
})

// Initial load
loadTodos()
