document.addEventListener('DOMContentLoaded', () => {
    const newTaskBtn = document.querySelector('#newTask');
    const tasks = document.querySelector('#tasks');
    const addTaskForm = document.querySelector('#add-task');
    const form = document.querySelector('#form')
    const heading = document.querySelector('header')
    const main = document.querySelector('main');
    const body = document.body;

    const taskName = document.querySelector('#task-name');
    const taskDescription = document.querySelector('#task-description');
    const tasksList = document.querySelector('#tasks-list');

    loadAndDisplayTasks();

    // Event listener for New Task button
    newTaskBtn.addEventListener('click', () => {

        // Hide tasks and display form
        addTaskForm.classList.remove('hidden');
        main.classList.add('items-center');
        addTaskForm.classList.add('flex', 'flex-col', 'space-y-4', 'items-center');
        body.classList.add('justify-center');
        heading.classList.add('hidden');
        tasks.classList.add('hidden');
    });

    // Event listener for for submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Load existing tasks
        let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Create new Task
        const newTask = { id: Date.now(), name: taskName.value, description: taskDescription.value };

        // Add to array
        savedTasks.push(newTask);

        // Save back to localStorage
        localStorage.setItem('tasks', JSON.stringify(savedTasks));

        // Reset UI
        addTaskForm.classList.add('hidden');
        main.classList.remove('items-center');
        addTaskForm.classList.remove('flex', 'flex-col', 'space-y-4', 'items-center');
        body.classList.remove('justify-center');
        heading.classList.remove('hidden');
        tasks.classList.remove('hidden');

        // Update UI
        loadAndDisplayTasks()

        // Clear task form inputs
        taskName.value = '';
        taskDescription.value = '';
    })

    // Event listener for deleting task

    tasksList.addEventListener('click', function (e) {
        if (e.target.matches('.deleteBtn')) {
            const id = Number(e.target.dataset.id);

            const tasks = loadTasks() || [];
            const updated = tasks.filter(task => task.id !== id);

            localStorage.setItem('tasks', JSON.stringify(updated));
            loadAndDisplayTasks();
        }
    });

    // Function to get tasks from localStorage
    function loadTasks() {
        return JSON.parse(localStorage.getItem('tasks'));
    }

    // Function to add task to UI
    function loadAndDisplayTasks() {
        const tasks = loadTasks() || [];

        tasksList.innerHTML = '';
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task-card');
            taskDiv.innerHTML = `
            <div>
                <input class='w-7 h-7' type='checkbox'>
            </div>
            <div>
                <p class='font-bold text-2xl'>${task.name}</p>
                <p class='text-base'>${task.description}</p>
            </div>
            <div>
                <button class='deleteBtn' data-id='${task.id}'>Delete</button>
            </div>
            `
            tasksList.appendChild(taskDiv);
        });
    }
})