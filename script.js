// 1. Select the HTML elements we need to interact with
const taskTitleInput = document.getElementById('task-title');
const taskTypeSelect = document.getElementById('task-type');
const taskDateInput = document.getElementById('task-date');
const addBtn = document.getElementById('add-btn');
const taskListSection = document.getElementById('task-list');

// 2. Load existing tasks from LocalStorage when the page starts
let tasks = JSON.parse(localStorage.getItem('anchorTasks')) || [];
renderTasks();

// 3. Add an event listener to the "Add" button
addBtn.addEventListener('click', function() {
    const title = taskTitleInput.value;
    const type = taskTypeSelect.value;
    const date = taskDateInput.value;

    // Validation: Don't add empty tasks
    if (title === '') {
        alert('Please enter a task title.');
        return;
    }

    // Create a new task object
    const newTask = {
        id: Date.now(), // A unique ID based on the current timestamp
        title: title,
        type: type,
        date: date
    };

    // Add the new task to our array
    tasks.push(newTask);

    // Save the updated array to LocalStorage
    saveTasks();

    // Update the UI
    renderTasks();

    // Clear the input fields
    taskTitleInput.value = '';
    taskDateInput.value = '';
});

// 4. Function to save tasks to LocalStorage
function saveTasks() {
    // localStorage only stores strings, so we use JSON.stringify() to convert our array into a string
    localStorage.setItem('anchorTasks', JSON.stringify(tasks));
}

// 5. Function to render (display) the tasks in the HTML
function renderTasks() {
    // Clear the current list in the HTML
    taskListSection.innerHTML = '';

    // Loop through each task in our array
    tasks.forEach(function(task) {
        // Create a new div for this task
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-item', task.type); // Add the CSS class for color coding
        taskDiv.setAttribute('data-id', task.id);

        // Format the date for display (if it exists)
        const dateDisplay = task.date ? new Date(task.date).toLocaleDateString() : 'No date set';

        // Set the HTML content of the div
        taskDiv.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>Type: ${task.type.charAt(0).toUpperCase() + task.type.slice(1)} | Due: ${dateDisplay}</p>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;

        // Append the new div to the task list section
        taskListSection.appendChild(taskDiv);
    });
}

// 6. Function to delete a task
function deleteTask(id) {
    // Filter the array to keep only tasks that do NOT match the ID
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    // Save and re-render
    saveTasks();
    renderTasks();
}

