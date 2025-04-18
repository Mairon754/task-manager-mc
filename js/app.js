window.completeTask = function (id) {
    tasks = tasks.map(task =>
        task.id === id ? {
            ...task, complete: true
        } : task);
    renderTasks();
};

function renderTasks() {
    console.log("Runing");
    fetch('server/user/session_info.php')
        .then(res => res.json())
        .then(data => {
            if (data.user_id) {
                console.log('Sesión activa para usuario:', data.user_id);
                fetch('server/task/index.php?user_id=' + data.user_id)
                    .then(response => response.json())
                    .then(tks => {
                        console.log(tks);
                        taskList.innerHTML = ''; // <- mover aquí para evitar duplicados

                        tks.forEach(task => {
                            const li = document.createElement('li');

                            if (task.completed) {
                                li.className = 'task-ready';
                                li.innerHTML = '<span>' + task.title + '</span>';

                                const completedMsg = document.createElement('span');
                                completedMsg.innerText = ' (Task Completed)';
                                completedMsg.style.fontStyle = 'italic';
                                completedMsg.style.color = 'darkgreen';
                                li.appendChild(completedMsg);
                            } else {
                                li.innerHTML =
                                    '<span>' + task.title + '</span>' +
                                    '<div>' +
                                    '<button class="complete-btn" onclick="completeTask(' + task.id + ')">Completar</button>' +
                                    '<button class="edit-btn" onclick="editTask(' + task.id + ')">Editar</button>' +
                                    '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">Eliminar</button>' +
                                    '</div>';
                            }

                            taskList.appendChild(li);
                        });
                    });
            } else {
                console.warn(data.error);
                window.location.href = 'login.html';
            }
        });

    // Parte local, también actualizada con el mensaje de "Task Completed"
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.complete) {
            li.className = 'task-ready';
            li.innerHTML = '<span>' + task.text + '</span>';

            const completedMsg = document.createElement('span');
            completedMsg.innerText = ' (Task Completed)';
            completedMsg.style.fontStyle = 'italic';
            completedMsg.style.color = 'darkgreen';
            li.appendChild(completedMsg);
        } else {
            li.innerHTML =
                '<span>' + task.text + '</span>' +
                '<div>' +
                '<button class="complete-btn" onclick="completeTask(' + task.id + ')">Completar</button>' +
                '<button class="edit-btn" onclick="editTask(' + task.id + ')">Editar</button>' +
                '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">Eliminar</button>' +
                '</div>';
        }
        taskList.appendChild(li);
    });
}
