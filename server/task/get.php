<?php
require '../commons/db.php';

if (isset($_GET['id'])) {
    try {
        $q = "SELECT * FROM task.task WHERE id = :id";
        $stmt = $db->prepare($q);
        $stmt->execute(["id" => $_GET['id']]);
        $task = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($task);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "ID no proporcionado"]);
}
