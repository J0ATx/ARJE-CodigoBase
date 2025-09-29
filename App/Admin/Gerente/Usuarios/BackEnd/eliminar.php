<?php
header('Content-Type: application/json');
include '../../../../Control/Conexión/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['tipoUsuario'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Faltan datos requeridos"
    ]);
    exit;
}

try {
    $con->beginTransaction();

    if ($data['tipoUsuario'] === 'Cliente') {
        $stmt = $con->prepare("DELETE FROM Cliente WHERE cliente_id = ?");
    } else {
        // Primero eliminar de la tabla específica
        switch ($data['tipoUsuario'] || $data['tipoUsuario'] === 'Gerente-General' || $data['tipoUsuario'] === 'Chef-Ejecutivo' || $data['tipoUsuario'] === 'Camarero') {
            case 'Gerente-General':
                $stmt = $con->prepare("DELETE FROM Gerente_General WHERE personal_id = ?");
                break;
            case 'Chef-Ejecutivo':
                $stmt = $con->prepare("DELETE FROM Chef_Ejecutivo WHERE personal_id = ?");
                break;
            case 'Camarero':
                $stmt = $con->prepare("DELETE FROM Camarero WHERE personal_id = ?");
                break;
        }
        $stmt->execute([$data['email']]);

        // Luego eliminar de Personal
        $stmt = $con->prepare("DELETE FROM Personal WHERE personal_id = ?");
    }

    $stmt->execute([$data['email']]);
    $con->commit();

    echo json_encode([
        "success" => true,
        "mensaje" => "Usuario eliminado correctamente"
    ]);

} catch (PDOException $e) {
    $con->rollBack();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al eliminar usuario"
    ]);
}
?>