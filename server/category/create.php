<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtenemos los datos enviados
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = $data['name'] ?? null;
    $user_id = $data['user_id'] ?? null;

    if ($name && $user_id) {
        try {
            // Insertar categoría en la base de datos
            $stmt = $db->prepare("INSERT INTO task.category (name, user_id) VALUES (:name, :user_id)");
            $stmt->execute([
                'name' => $name,
                'user_id' => $user_id
            ]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error al crear la categoría: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Faltan parámetros']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>
