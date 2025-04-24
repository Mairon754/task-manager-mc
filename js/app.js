document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const categoryList = document.getElementById('category-list');
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const dateInput = document.getElementById('due_date');
    const completedInput = document.getElementById('completed');
    const userIdInput = document.getElementById('user_id');
    const categoryIdInput = document.getElementById('category_id');
    const categoryNameInput = document.getElementById('category_name');
    const categoryUserIdInput = document.getElementById('category_user_id');
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
    let currentEditingCategoryId = null;

    function renderCategories() {
        fetch('server/user/session_info.php')
            .then(res => res.json())
            .then(data => {
                if (data.user_id) {
                    fetch('server/category/index.php?user_id=' + data.user_id)
                        .then(res => res.json())
                        .then(categories => {
                            const categoryList = document.getElementById('category-list');
                            categoryList.innerHTML = '';
                            categories.forEach(cat => {
                                const li = document.createElement('li');
                                li.textContent = cat.name;
                                categoryList.appendChild(li);
                            });
                        });
                }
            });
    }

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
                                    ${task.completed ? 
                                        // Si está completada, solo mostramos el botón de "Desmarcar"
                                        `<button class="undo-btn" onclick="undoTask(${task.id})">Desmarcar</button>` :
                                        // Si no está completada, mostramos los botones "Completar", "Editar", "Eliminar"
                                        `
                                            <button class="complete-btn" onclick="completeTask(${task.id})">Completar</button>
                                            <button class="edit-btn" onclick="editTask(${task.id})">Editar</button>
                                            <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
                                        `
                                    }
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
                        list.innerHTML = ''; // Limpiar la lista antes de renderizarla
                        categories.forEach(cat => {
                            const li = document.createElement('li');
                            li.innerHTML = `
                                <span>${cat.name}</span>
                                <div>
                                    <button class="edit-btn" onclick="editCategory(${cat.id})">Editar</button>
                                    <button class="delete-btn" onclick="deleteCategory(${cat.id})">Eliminar</button>
                                </div>
                            `;
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


    //editar categoria
    window.editCategory = function (id) {
        // Primero, obtenemos el ID del usuario logueado (esto ya lo tienes en tu código)
        fetch('server/user/session_info.php')
            .then(res => res.json())
            .then(data => {
                if (data.user_id) {
                    fetch('server/category/index.php?user_id=' + data.user_id)
                        .then(res => res.json())
                        .then(categories => {
                            // Encontrar la categoría que estamos editando
                            const category = categories.find(cat => cat.id === id);
                            if (category) {
                                // Cargar la categoría en el formulario
                                document.getElementById('category_name').value = category.name;
                                document.getElementById('category_user_id').value = category.user_id;
    
                                // Cambiar el texto del botón a "Guardar"
                                currentEditingCategoryId = id;
                            document.querySelector('#category-form button[type="submit"]').textContent = 'Guardar';
                            }
                        });
                }
            });
    };
    
    // Agregar la lógica para guardar la categoría actualizada
    categoryForm.addEventListener('submit', function (e) {
        e.preventDefault();
    
        const name = document.getElementById('category_name').value;
        const user_id = parseInt(document.getElementById('category_user_id').value);
    
        const categoryData = {
            id: currentEditingCategoryId,  // ID de la categoría que estamos editando
            name: name,
            user_id: user_id
        };
    
        // Llamada a update.php para actualizar la categoría
        fetch('server/category/update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Si la actualización es exitosa, volvemos a renderizar las categorías
                currentEditingCategoryId = null;
                document.querySelector('#category-form button[type="submit"]').textContent = 'Crear Categoría'; // Volver al texto original del botón
                categoryForm.reset(); // Limpiar el formulario
                renderCategories(); // Volver a cargar las categorías
            } else {
                alert("Error al actualizar la categoría");
            }
        })
        .catch(err => {
            console.error("Error al enviar la actualización:", err);
        });
    });
    
    
    //eliminar categoria
    window.deleteCategory = function (id) {
        fetch('server/category/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        .then(res => res.json())
        .then(() => renderCategories());
    };
    

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
                renderTasks(); // Recargar las tareas después de completar
            } else {
                alert("Error al completar la tarea: " + (data.error || "Desconocido"));
            }
        })
        .catch(err => {
            console.error("Error en la solicitud:", err);
        });
    };
    
    
    // Desmarcar tarea
    window.undoTask = function (id) {
        console.log("Intentando desmarcar tarea ID:", id);
        fetch('server/task/undo.php', {
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
                // Recargar las tareas después de desmarcar
                renderTasks(); // Esta función recargará las tareas con los botones actualizados
            } else {
                alert("Error al desmarcar la tarea: " + (data.error || "Desconocido"));
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
    renderCategories();
    renderTasks();
});
