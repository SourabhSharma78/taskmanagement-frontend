document.addEventListener('DOMContentLoaded', function() {
    const tasks = document.querySelector('#tasks');
    const completedTasks = document.querySelector('#completed');
    const titleInput = document.querySelector('#title');
    const descriptionInput = document.querySelector('#description');
    const dueDateInput = document.querySelector('#due-date');
    const addTaskButton = document.querySelector('#addBtn');

    // Function to fetch tasks from the server and display them
    async function fetchTasks() {
        const response = await fetch('http://localhost:3000/tasksData');
        const tasks = await response.json();
        tasks.forEach(addTaskToDOM);
    }

    // Function to add a new task
    async function addTask() {
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const dueDate = dueDateInput.value;

        if (title === '' || description === '' || dueDate === '') return;

        const response = await fetch('http://localhost:3000/tasksData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, dueDate })
        });

        const newTask = await response.json();
        addTaskToDOM(newTask);

        titleInput.value = '';
        descriptionInput.value = '';
        dueDateInput.value = '';
    }

    // Function to delete a task
    async function deleteTask(id) {
        await fetch(`http://localhost:3000/tasksData/${id}`, {
            method: 'DELETE'
        });
        document.getElementById(`task-${id}`).remove();
    }

    // Function to add a task to the DOM
    function addTaskToDOM(task) {
        const taskElement = document.createElement('li');
        taskElement.id = `task-${task._id}`;
        taskElement.innerHTML = `
            <strong>${task.title}</strong><br>
            ${task.description}<br>
            Due: ${task.dueDate}
            <i class="fa-regular fa-square-minus" onclick="deleteTask('${task._id}')"></i>
        `;
        tasks.appendChild(taskElement);
    }

    addTaskButton.addEventListener('click', addTask);
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    fetchTasks();
});