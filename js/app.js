document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const dateInput = document.getElementById('due_date');
    const completedInput = document.getElementById('completed');
    const userIdInput = document.getElementById('user_id');
    const categoryIdInput = document.getElementById('category_id');
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');

    let currentEditingTaskId = null;

    function renderTasks() {
        fetch('server/user/session_info.php')
            .then(res => res.json())
            .then(data => {
                if (data.user_id) {
                    fetch('server/task/index.php?user_id=' + data.user_id)
                        .then(response => response.json())
                        .then(tasks => {
                            taskList.innerHTML = '';
                            tasks.forEach(task => {
                                const li = document.createElement('li');
                                li.className = task.completed ? 'task-ready' : '';
                                li.innerHTML = `
                                    <span>${task.title}</span>
                                    <div>
                                        <button class="complete-btn" onclick="completeTask(${task.id})">Completar</button>
                                        <button class="edit-btn" onclick="editTask(${task.id})">Editar</button>
                                        <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
                                    </div>
                                `;
                                taskList.appendChild(li);
                            });
                        });
                } else {
                    window.location.href = 'login.php';
                }
            });
    }

    //nuevo categorias
    function renderCategories() {
        fetch('server/user/session_info.php')
          .then(res => res.json())
          .then(data => {
            if (data.user_id) {
              document.getElementById('category_user_id').value = data.user_id;
      
              fetch('server/category/index.php?user_id=' + data.user_id)
                .then(res => res.json())
                .then(categories => {
                  const list = document.getElementById('category-list');
                  list.innerHTML = '';
                  categories.forEach(cat => {
                    const li = document.createElement('li');
                    li.textContent = cat.name;
                    list.appendChild(li);
                  });
                });
            }
          });
      }
      
      const categoryForm = document.getElementById('category-form');
      categoryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('category_name').value;
        const user_id = parseInt(document.getElementById('category_user_id').value);
      
        fetch('server/category/create.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, user_id })
        })
          .then(res => res.json())
          .then(() => {
            categoryForm.reset();
            renderCategories();
          });
      });
      

    // Completar tarea
    window.completeTask = function (id) {
        console.log("Intentando completar tarea ID:", id);
        fetch('server/task/complete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(res => res.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            if (data.success) {
                renderTasks();
            } else {
                alert("Error al completar la tarea: " + (data.error || "Desconocido"));
            }
        })
        .catch(err => {
            console.error("Error en la solicitud:", err);
        });
    };
    
    

    // Eliminar tarea
    window.deleteTask = function (id) {
        fetch('server/task/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(() => renderTasks());
    };

    // Editar tarea: carga los datos en el formulario
    window.editTask = function (id) {
        fetch('server/user/session_info.php')
            .then(res => res.json())
            .then(data => {
                fetch('server/task/index.php?user_id=' + data.user_id)
                    .then(res => res.json())
                    .then(tasks => {
                        const task = tasks.find(t => t.id === id);
                        if (task) {
                            titleInput.value = task.title;
                            descInput.value = task.description;
                            dateInput.value = task.due_date;
                            completedInput.checked = task.completed == 1;
                            userIdInput.value = task.user_id;
                            categoryIdInput.value = task.category_id;
                            currentEditingTaskId = id;
                            submitButton.textContent = "Guardar";
                        }
                    });
            });
    };

    // Crear o actualizar tarea
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const taskData = {
            title: titleInput.value,
            description: descInput.value,
            due_date: dateInput.value,
            completed: completedInput.checked ? 1 : 0,
            user_id: parseInt(userIdInput.value),
            category_id: parseInt(categoryIdInput.value)
        };

        if (currentEditingTaskId) {
            taskData.id = currentEditingTaskId;
            fetch('server/task/update.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            })
                .then(res => res.json())
                .then(() => {
                    currentEditingTaskId = null;
                    submitButton.textContent = "Enviar";
                    form.reset();
                    renderTasks();
                });
        } else {
            form.submit(); // Se enviará al create.php como lo tienes en el HTML
        }
    });

    renderTasks();
});
