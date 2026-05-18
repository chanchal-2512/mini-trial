async function addTask() {

    const taskInput = document.getElementById("taskInput");

    const task = taskInput.value;

    if (task === "") {
        alert("Enter a task");
        return;
    }

    await fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task })
    });

    taskInput.value = "";

    loadTasks();
}

async function loadTasks() {

    const response = await fetch('/tasks');

    const tasks = await response.json();

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach((item) => {

        taskList.innerHTML += `
            <div class="task">
                ${item.task}
            </div>
        `;
    });
}

loadTasks();