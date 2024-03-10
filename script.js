// scripts.js
const todoTasks = document.getElementById('todo-tasks');
const inProgressTasks = document.getElementById('in-progress-tasks');
const doneTasks = document.getElementById('done-tasks');

const todoCount = document.getElementById('todo-count');
const inProgressCount = document.getElementById('in-progress-count');
const doneCount = document.getElementById('done-count');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

renderTasks();

function renderTasks() {
    todoTasks.innerHTML = '';
    inProgressTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        if (task.status === 'todo') {
            todoTasks.appendChild(taskElement);
        } else if (task.status === 'in-progress') {
            inProgressTasks.appendChild(taskElement);
        } else if (task.status === 'done') {
            doneTasks.appendChild(taskElement);
        }
    });

    todoCount.innerText = ${countTasks('todo')};
    inProgressCount.innerText = ${countTasks('in-progress')};
    doneCount.innerText = ${countTasks('done')};
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.draggable = true;
    taskElement.setAttribute('ondragstart', 'drag(event)');
    taskElement.innerHTML = <strong>${task.title}</strong>;
    taskElement.onclick = () => openTaskDetails(task);
    return taskElement;
}

function countTasks(status) {
    return tasks.filter(task => task.status === status).length;
}

function openNewTaskModal(status) {
    document.getElementById('task-title').value = '';
    document.getElementById('task-status').value = status;
    document.getElementById('task-description').value = '';
    document.getElementById('task-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('task-modal').style.display = 'none';
}

function saveTask() {
    const title = document.getElementById('task-title').value;
    const status = document.getElementById('task-status').value;
    const description = document.getElementById('task-description').value;

    const task = { title, status, description };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    closeModal();
    renderTasks();
}

function deleteTask() {
    const title = document.getElementById('task-title').value;
    tasks = tasks.filter(task => task.title !== title);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    closeModal();
    renderTasks();
}

function openTaskDetails(task) {
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-status').value = task.status;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-modal').style.display = 'block';
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.innerHTML);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    const status = event.target.parentNode.id;
    const title = data.split('<strong>')[1].split('</strong>')[0];
    const taskIndex = tasks.findIndex(task => task.title === title);
    tasks[taskIndex].status = status;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// function toggleMenu(category) {
//     const menu = document.getElementById(${category}-menu);
//     menu.classList.toggle('show');
// }

function toggleMenu(category) {
    const menu = document.getElementById(${category}-menu);
    const isOpen = menu.classList.contains('show');
    closeAllMenus(); // Close all other open menus
    if (!isOpen) {
        menu.classList.add('show');
    }
}

function closeAllMenus() {
    const menus = document.querySelectorAll('.menu-content');
    menus.forEach(menu => {
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
        }
    });
}

document.body.addEventListener('click', function (event) {
    if (!event.target.classList.contains('menu-btn')) {
        closeAllMenus();
    }
});



function removeAllTasks(category) {
    const confirmation = confirm(Are you sure you want to remove all tasks in the ${category} category?);
    if (confirmation) {
        tasks = tasks.filter(task => task.status !== category);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        closeModal();
        renderTasks();
    }
}