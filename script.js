document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const todoForm = document.querySelector('.todo-form');
    const todoInput = document.querySelector('.todo-input');
    const todoList = document.querySelector('.todo-list');
    const emptyState = document.querySelector('.empty-state');
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const remainingTasksElement = document.getElementById('remaining-tasks');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('theme-toggle');

    // Initialize todos from localStorage or empty array
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Theme management
    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        setTheme(true);
    }

    // Theme toggle event
    themeToggle.addEventListener('change', function() {
        setTheme(this.checked);
    });

    // Update stats
    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const remaining = total - completed;

        totalTasksElement.textContent = total;
        completedTasksElement.textContent = completed;
        remainingTasksElement.textContent = remaining;
    }

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateStats();
    }

    // Render todos based on filter
    function renderTodos(filter = 'all') {
        todoList.innerHTML = '';

        const filteredTodos = todos.filter(todo => {
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true;
        });

        if (filteredTodos.length === 0) {
            todoList.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            todoList.style.display = 'block';
            emptyState.style.display = 'none';

            filteredTodos.forEach(todo => {
                const todoItem = document.createElement('li');
                todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                todoItem.dataset.id = todo.id;

                todoItem.innerHTML = `
                  <div class="todo-item-inner">
                      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                      <span class="todo-text">${todo.text}</span>
                      <button class="todo-delete">
                          <i class="fas fa-trash-alt"></i>
                      </button>
                  </div>
              `;

                todoList.appendChild(todoItem);
            });
        }

        updateStats();
    }

    // Add new todo
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const text = todoInput.value.trim();

        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };

            todos.push(newTodo);
            saveTodos();
            renderTodos();
            todoInput.value = '';
            todoInput.focus();
        }
    });

    // Toggle todo completion
    todoList.addEventListener('click', function(e) {
        if (e.target.classList.contains('todo-checkbox')) {
            const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
            const todo = todos.find(t => t.id === todoId);
            todo.completed = e.target.checked;
            saveTodos();
            renderTodos(document.querySelector('.filter-btn.active').dataset.filter);
        }
    });

    // Delete todo
    todoList.addEventListener('click', function(e) {
        if (e.target.closest('.todo-delete')) {
            const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
            todos = todos.filter(t => t.id !== todoId);
            saveTodos();
            renderTodos(document.querySelector('.filter-btn.active').dataset.filter);
        }
    });

    // Filter todos
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderTodos(this.dataset.filter);
        });
    });

    // Initial render
    renderTodos();
});