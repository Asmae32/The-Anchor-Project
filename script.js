// 1. Select the HTML elements we need to interact with
const taskTitleInput = document.getElementById('task-title');
const taskTypeSelect = document.getElementById('task-type');
const taskDateInput = document.getElementById('task-date');
const addBtn = document.getElementById('add-btn');
const taskListSection = document.getElementById('task-list');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

// 2. Load existing tasks from LocalStorage when the page starts
let tasks = JSON.parse(localStorage.getItem('anchorTasks')) || [];
renderTasks();

// 3. Add an event listener to the "Add" button
addBtn.addEventListener('click', function() {
    const title = taskTitleInput.value;
    const type = taskTypeSelect.value;
    const date = taskDateInput.value;
    const energy = document.getElementById('task-energy').value;
    const stress = document.getElementById('task-stress').value;
    const startTime = document.getElementById('task-start-time').value;
const endTime = document.getElementById('task-end-time').value;
    // Validation: Don't add empty tasks
    if (title === '') {
        alert('Please enter a task title.');
        return;
saveTasks();
renderTasks();
checkBurnout(); 


    }

    // Create a new task object
    const newTask = {
    id: Date.now(),
    title: title,
    type: type,
    date: date,
    energy: energy,
    stress: stress,
    startTime: startTime,
    endTime: endTime,
// 
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
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}
}
}

// 5. Function to render (display) the tasks in the HTML
function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        
        // ... (your existing innerHTML for the task details) ...
        
        // Add the buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'task-buttons';

        // Complete Button
        const completeBtn = document.createElement('button');
        completeBtn.innerHTML = '✅';
        completeBtn.title = 'Mark as Complete';
        completeBtn.addEventListener('click', () => completeTask(task.id));
        buttonsDiv.appendChild(completeBtn);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete Task';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        buttonsDiv.appendChild(deleteBtn);

        taskDiv.appendChild(buttonsDiv);
        list.appendChild(taskDiv);
    });
}

        // Set the HTML content of the div
        taskDiv.innerHTML = `
<p>Type: ${task.type.charAt(0).toUpperCase() + task.type.slice(1)} | Energy: ${task.energy} | Stress: ${task.stress} | Time: ${task.startTime || 'No time'} - ${task.endTime || ''} | Due: ${dateDisplay}</p>
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
saveTasks();
renderTasks();
checkBurnout(); 
    });

    // Save and re-render
    saveTasks();
    renderTasks();
}
function checkBurnout() {
    const today = new Date().toISOString().split('T')[0]; // Gets today's date in YYYY-MM-DD format
    const highStressToday = tasks.filter(task => task.date === today && task.stress === 'high').length;

    if (highStressToday > 2) {
        // Create a warning element
        const warning = document.createElement('div');
        warning.id = 'burnout-warning';
        warning.style.backgroundColor = '#e74c3c';
        warning.style.color = 'white';
        warning.style.padding = '10px';
        warning.style.marginBottom = '20px';
        warning.style.borderRadius = '4px';
        warning.style.textAlign = 'center';
        warning.innerHTML = `<strong>Burnout Alert:</strong> You have ${highStressToday} high-stress tasks today. Consider rescheduling one!`;
        
        // Insert it at the top of the main section
        const mainSection = document.querySelector('main');
        mainSection.insertBefore(warning, document.getElementById('input-section'));
    } else {
        // Remove the warning if it exists and the count is now safe
        const existingWarning = document.getElementById('burnout-warning');
        if (existingWarning) {
            existingWarning.remove();
        }
    }
}
function calculateDuration(start, end) {
    if (!start || !end) return '';
    const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
    const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
    const diff = endMinutes - startMinutes;
    
    if (diff <= 0) return '';
    
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
function isDueSoon(dateString) {
    if (!dateString) return false;
    const taskDate = new Date(dateString);
    const now = new Date();
    const diffTime = taskDate - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // If the task is due within the next 24 hours (1 day)
    return diffDays <= 1 && diffDays >= 0;
}
function completeTask(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        const task = tasks[taskIndex];
        tasks.splice(taskIndex, 1); // Remove from active tasks
        completedTasks.push(task); // Add to completed list
        saveTasks();
        renderTasks();
        renderCompletedTasks();
    }
}

function restoreTask(id) {
    const taskIndex = completedTasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        const task = completedTasks[taskIndex];
        completedTasks.splice(taskIndex, 1); // Remove from completed
        tasks.push(task); // Add back to active tasks
        saveTasks();
        renderTasks();
        renderCompletedTasks();
    }
}

function renderCompletedTasks() {
    const list = document.getElementById('completed-list');
    list.innerHTML = ''; // Clear current list
    
    completedTasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'completed-task';
        div.innerHTML = `
            <strong>${task.title}</strong> <br>
            <small>Due: ${task.date} | ${task.type}</small>
            <button onclick="restoreTask(${task.id})" style="float:right; background:none; border:none; cursor:pointer;">↩️</button>
        `;
        list.appendChild(div);
    });
}