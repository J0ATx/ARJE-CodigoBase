<?php
include '../../../../Control/Conexión/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['nombre'], $data['apellido'], $data['gmail'], $data['contrasenia'], $data['tipoUsuario'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}
try {
    // Insertar en Usuario
    $stmtUsuario = $con->prepare("INSERT INTO Usuario (nombre, apellido, contrasenia, gmail) VALUES (?, ?, ?, ?)");
    $hashedPass = password_hash($data['contrasenia'], PASSWORD_BCRYPT);
    $stmtUsuario->execute([$data['nombre'], $data['apellido'], $hashedPass, $data['gmail']]);
    $idUsuario = $con->lastInsertId();

    // Insertar en tabla específica
    switch ($data['tipoUsuario']) {
        case 'Cliente':
            $stmt = $con->prepare("INSERT INTO Cliente (idUsuario, noShows, platilloFav) VALUES (?, 0, NULL)");
            $stmt->execute([$idUsuario]);
            $stmt->execute();
            break;
        case 'Gerente':
            $stmt = $con->prepare("INSERT INTO Gerente (idUsuario, fechContratacion) VALUES (?, CURDATE())");
            $stmt->execute([$idUsuario]);
            $stmt->execute();
            break;
        case 'Chef':
            $stmt = $con->prepare("INSERT INTO Chef (idUsuario, fechContratacion) VALUES (?, CURDATE())");
            $stmt->execute([$idUsuario]);
            $stmt->execute();
            break;
        case 'ChefEjecutivo':
            $stmt = $con->prepare("INSERT INTO ChefEjecutivo (idUsuario, fechPromocionEjec, presupuestoAnualCocina) VALUES (?, CURDATE(), 0)");
            $stmt->execute([$idUsuario]);
            $stmt->execute();
            break;
        case 'Mozo':
            $stmt = $con->prepare("INSERT INTO Mozo (idUsuario, fechContratacion) VALUES (?, CURDATE())");
            $stmt->execute([$idUsuario]);
            $stmt->execute();
            break;
        default:
            throw new Exception("Tipo de usuario no válido");
    }

    $con->commit();
    echo json_encode(["mensaje" => "Usuario creado como {$data['tipoUsuario']}"]);
} catch (Exception $e) {
    $con->rollback();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}