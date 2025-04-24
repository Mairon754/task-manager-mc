<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtenemos los datos enviados
    $data = json_decode(file_get_contents("php://input"), true);
    
    $id = $data['id'] ?? null;
    $name = $data['name'] ?? null;
    $user_id = $data['user_id'] ?? null;

    if ($id && $name && $user_id) {
        try {
            // Actualizar la categoría en la base de datos
            $stmt = $db->prepare("UPDATE task.category SET name = :name, user_id = :user_id WHERE id = :id");
            $stmt->execute([
                'id' => $id,
                'name' => $name,
                'user_id' => $user_id
            ]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error al actualizar la categoría: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Faltan parámetros']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>
