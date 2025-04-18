<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Obtener una tarea específica por ID
    if (isset($_GET['task_id'])) {
        try {
            $task_id = $_GET['task_id'];
            $q = "SELECT * FROM task.task WHERE id = :task_id";
            $stmt = $db->prepare($q);
            $stmt->execute(["task_id" => $task_id]);
            $task = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($task);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    // Obtener todas las tareas de un usuario
    else if (isset($_GET['user_id'])) {
        try {
            $user_id = $_GET['user_id'];
            $q = "SELECT * FROM task.task WHERE user_id = :usr_id";
            $stmt = $db->prepare($q);
            $stmt->execute(["usr_id" => $user_id]);
            $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($tasks);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(["error" => "No param"]);
    }
} else {
    echo json_encode(["error" => "Bad Request"]);
}
