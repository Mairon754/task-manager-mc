<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Task Manager</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='css/styles.css'>
    <script src='js/app.js'></script>
</head>

<body>
    <main>
        <h1>Gestor de tareas</h1>

        <!-- Formulario de tareas -->
        <form action="server/task/create.php" method="post" class="my-form">
            <label for="title" class="field">
                <span>
                    <span class="req-field">*</span>
                    Title:
                </span>
                <input type="text" name="title" placeholder="title" id="title" required />
            </label>
            <label for="description" class="field">
                <span>Description: </span>
                <input type="text" name="description" placeholder="description" id="description" />
            </label>
            <label for="due_date" class="field">
                <span>Release date:</span>
                <input type="date" name="due_date" placeholder="due_date" id="due_date" />
            </label>
            <label for="completed" class="field cbx-g">
                <span>¿Is completed?</span>
                <input type="checkbox" name="completed" placeholder="completed" id="completed" />
            </label>

            <label for="user_id" class="field">
                <span>
                    <span class="req-field">*</span>
                    User id:
                </span>
                <input type="number" name="user_id" placeholder="user_id" id="user_id" required />
            </label>
            <label for="category_id" class="field">
                <span>
                    <span class="req-field">*</span>
                    Category id:
                </span>
                <input type="number" name="category_id" placeholder="category_id" id="category_id" required />
            </label>
            <button type="submit">Enviar</button>
        </form>

        <!-- Sección de Categorías -->
        <section>
            <h2>Categorías</h2>
            <form id="category-form" class="my-form">
                <label for="category_name" class="field">
                    <span><span class="req-field">*</span> Nombre de la categoría:</span>
                    <input type="text" id="category_name" name="name" required />
                </label>
                <label for="category_user_id" class="field">
                    <span><span class="req-field">*</span> User ID:</span>
                    <input type="number" id="category_user_id" name="user_id" required />
                </label>
                <button type="submit">Crear Categoría</button>
            </form>

            <!-- Lista de Categorías -->
            <ul id="category-list">
                <!-- Categorías generadas dinámicamente -->
            </ul>
        </section>

        <!-- Línea divisoria entre categorías y tareas -->
        <hr>

        <!-- Sección de Tareas -->
        <section>
            <h2>Tareas</h2>
            <ul id="task-list">
                <!-- Tareas generadas dinámicamente -->
            </ul>
        </section>
    </main>
</body>

</html>
