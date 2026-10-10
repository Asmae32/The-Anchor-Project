// 1. Select the HTML elements we need to interact with
const taskTitleInput = document.getElementById('task-title');
const taskTypeSelect = document.getElementById('task-type');
const taskDateInput = document.getElementById('task-date');
const addBtn = document.getElementById('add-task-btn') || document.getElementById('add-btn');
const taskListSection = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

// 2. Load existing tasks from LocalStorage when the page starts
renderTasks();
renderCompletedTasks();
checkBurnout();

// 3. Add an event listener to the "Add" button
if (addBtn) {
    addBtn.addEventListener('click', () => {
        const title = taskTitleInput ? taskTitleInput.value.trim() : '';
        const type = taskTypeSelect ? taskTypeSelect.value : '';
        const date = taskDateInput ? taskDateInput.value : '';
        const energy = document.getElementById('task-energy')?.value || '';
        const stress = document.getElementById('task-stress')?.value || '';
        const startTime = document.getElementById('task-start-time')?.value || '';
        const endTime = document.getElementById('task-end-time')?.value || '';

        if (!title || !date) {
            alert('Please fill in the title and date!');
            return;
        }

        const newTask = {
            id: Date.now(),
            title,
            type,
            date,
            energy,
            stress,
            startTime,
            endTime
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        checkBurnout();

        if (taskTitleInput) taskTitleInput.value = '';
        if (taskDateInput) taskDateInput.value = '';
        if (taskTypeSelect) taskTypeSelect.value = '';
    });
}

// 4. Function to save tasks to LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// 5. Function to render (display) the tasks in the HTML
function renderTasks() {
    const list = taskListSection || document.getElementById('task-list');
    if (!list) return;

    list.innerHTML = '';

    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';

        const dateDisplay = task.date ? new Date(`${task.date}T00:00:00`).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'No date';

        const duration = calculateDuration(task.startTime, task.endTime);

        taskDiv.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>Type: ${task.type ? task.type.charAt(0).toUpperCase() + task.type.slice(1) : 'General'} | Due: ${dateDisplay}</p>
                <p>Energy: ${task.energy || 'N/A'} | Stress: ${task.stress || 'N/A'} | Time: ${task.startTime || 'No time'}${task.endTime ? ` - ${task.endTime}` : ''}${duration ? ` | Duration: ${duration}` : ''}</p>
            </div>
            <div class="task-buttons">
                <button class="complete-btn" aria-label="Mark as complete">✅</button>
                <button class="delete-btn" aria-label="Delete task">🗑️</button>
            </div>
        `;

        taskDiv.querySelector('.complete-btn').addEventListener('click', () => completeTask(task.id));
        taskDiv.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        list.appendChild(taskDiv);
    });
}

// 6. Function to delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    checkBurnout();
}

function checkBurnout() {
    const today = new Date().toISOString().split('T')[0];
    const highStressToday = tasks.filter(task => task.date === today && task.stress === 'high').length;
    const mainSection = document.querySelector('main');
    const existingWarning = document.getElementById('burnout-warning');

    if (highStressToday > 2) {
        if (!existingWarning) {
            const warning = document.createElement('div');
            warning.id = 'burnout-warning';
            warning.style.backgroundColor = '#e74c3c';
            warning.style.color = 'white';
            warning.style.padding = '10px';
            warning.style.marginBottom = '20px';
            warning.style.borderRadius = '4px';
            warning.style.textAlign = 'center';
            warning.innerHTML = `<strong>Burnout Alert:</strong> You have ${highStressToday} high-stress tasks today. Consider rescheduling one!`;

            if (mainSection && document.getElementById('input-section')) {
                mainSection.insertBefore(warning, document.getElementById('input-section'));
            } else if (mainSection) {
                mainSection.prepend(warning);
            }
        }
    } else if (existingWarning) {
        existingWarning.remove();
    }
}

function calculateDuration(start, end) {
    if (!start || !end) return '';

    const startMinutes = parseInt(start.split(':')[0], 10) * 60 + parseInt(start.split(':')[1], 10);
    const endMinutes = parseInt(end.split(':')[0], 10) * 60 + parseInt(end.split(':')[1], 10);
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

    return diffDays <= 1 && diffDays >= 0;
}

function completeTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        const task = tasks[taskIndex];
        tasks.splice(taskIndex, 1);
        completedTasks.push(task);
        saveTasks();
        renderTasks();
        renderCompletedTasks();
    }
}

function restoreTask(id) {
    const taskIndex = completedTasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        const task = completedTasks[taskIndex];
        completedTasks.splice(taskIndex, 1);
        tasks.push(task);
        saveTasks();
        renderTasks();
        renderCompletedTasks();
    }
}

function renderCompletedTasks() {
    const list = document.getElementById('completed-list');
    if (!list) return;

    list.innerHTML = '';

    completedTasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'completed-task';
        div.innerHTML = `
            <strong>${task.title}</strong><br>
            <small>Due: ${task.date} | ${task.type}</small>
            <button class="restore-btn" aria-label="Restore task" style="float:right; background:none; border:none; cursor:pointer;">↩️</button>
        `;

        div.querySelector('.restore-btn').addEventListener('click', () => restoreTask(task.id));
        list.appendChild(div);
    });
}
// --- Midnight Mode Logic ---
const themeToggle = document.createElement('button');
themeToggle.id = 'theme-toggle';
themeToggle.innerHTML = '✨ Midnight Mode';
document.body.appendChild(themeToggle);

// Check for saved preference
if (localStorage.getItem('theme') === 'midnight') {
    document.body.classList.add('midnight-mode');
    themeToggle.innerHTML = '☀️ Light Mode';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('midnight-mode');
    
    if (document.body.classList.contains('midnight-mode')) {
        localStorage.setItem('theme', 'midnight');
        themeToggle.innerHTML = '☀️ Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '✨ Midnight Mode';
    }
});