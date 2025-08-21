<?php
include '../../../../Control/Conexión/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idUsuario'], $data['nombre'], $data['apellido'], $data['gmail'], $data['tipoUsuario'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

try {
    $con->beginTransaction();

    // Actualizar datos básicos
    $numTel = empty($data['numTel']) ? null : $data['numTel'];

    if (!empty($data['contrasenia'])) {
        $hashedPass = password_hash($data['contrasenia'], PASSWORD_BCRYPT);
        $stmt = $con->prepare("UPDATE Usuario SET nombre=?, apellido=?, gmail=?, calificacion=?, numTel=?, WHERE idUsuario=?");
        $stmt->execute([$data['nombre'], $data['apellido'], $data['gmail'], $data['calificacion'], $numTel, $hashedPass, $data['idUsuario']]);
    } else {
        $stmt = $con->prepare("UPDATE Usuario SET nombre=?, apellido=?, gmail=?, calificacion=?, numTel=? WHERE idUsuario=?");
        $stmt->execute([$data['nombre'], $data['apellido'], $data['gmail'], $data['calificacion'], $numTel, $data['idUsuario']]);
    }

    // Eliminar de todas las tablas de roles
    $roles = [
        'Cliente' => 'Cliente',
        'Gerente' => 'Gerente',
        'Chef' => 'Chef',
        'ChefEjecutivo' => 'ChefEjecutivo',
        'Mozo' => 'Mozo'
    ];
    foreach ($roles as $tabla) {
        $stmt = $con->prepare("DELETE FROM $tabla WHERE idUsuario = ?");
        $stmt->execute([$data['idUsuario']]);
    }

    // Insertar en la tabla del nuevo rol
    switch ($data['tipoUsuario']) {
        case 'Cliente':
            $stmt = $con->prepare("INSERT INTO Cliente (idUsuario, noShows, platilloFav) VALUES (?, 0, NULL)");
            $stmt->execute([$data['idUsuario']]);
            break;
        case 'Gerente':
            $stmt = $con->prepare("INSERT INTO Gerente (idUsuario, fechContratacion) VALUES (?, CURDATE())");
            $stmt->execute([$data['idUsuario']]);
            break;
        case 'Chef':
            $stmt = $con->prepare("INSERT INTO Chef (idUsuario, fechContratacion) VALUES (?, CURDATE())");
            $stmt->execute([$data['idUsuario']]);
            break;
        case 'ChefEjecutivo':
            $stmt = $con->prepare("INSERT INTO ChefEjecutivo (idUsuario, fechPromocionEjec, presupuestoAnualCocina) VALUES (?, CURDATE(), 0)");
            $stmt->execute([$data['idUsuario']]);
            break;
        case 'Mozo':
            $stmt = $con->prepare("INSERT INTO Mozo (idUsuario, fechContratacion) VALUES (?, CURDATE())");
            $stmt->execute([$data['idUsuario']]);
            break;
        default:
            throw new Exception("Tipo de usuario no válido");
    }

    $con->commit();
    echo json_encode(["mensaje" => "Usuario actualizado"]);

} catch (Exception $e) {
    $con->rollBack();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>