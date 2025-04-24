<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtenemos los datos enviados
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if ($id) {
        try {
            // Eliminar la categoría de la base de datos
            $stmt = $db->prepare("DELETE FROM task.category WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error al eliminar la categoría: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Faltan parámetros']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>
