<?php
header('Content-Type: application/json');
require_once "../../../Control/Conexión/conexion.php";
session_start();
if (!isset($_SESSION["usuario_id"])) {
    echo json_encode(["success" => false, "error" => "Sesión no iniciada"]);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(["success" => false, "error" => "Datos inválidos"]);
    exit;
}
try {
    $campos = [
        "cliente_nombre" => $data["nombre"] ?? null,
        "cliente_apellido" => $data["apellido"] ?? null,
        "cliente_telefono" => $data["telefono"] ?? null,
        "cliente_platillo_favorito" => $data["platillofav"] ?? null
    ];
    $params = [];
    $set = [];
    // Permitir modificar el ID (correo)
    if (!empty($data["id"])) {
        $set[] = "cliente_id = ?";
        $params[] = $data["id"];
    }
    foreach ($campos as $campo => $valor) {
        if ($valor !== null) {
            $set[] = "$campo = ?";
            $params[] = $valor;
        }
    }
    // Si hay contraseña, hashearla y agregarla
    if (!empty($data["contrasenia"])) {
        $set[] = "cliente_contrasenia = ?";
        $params[] = password_hash($data["contrasenia"], PASSWORD_DEFAULT);
    }
    if (empty($set)) {
        echo json_encode(["success" => false, "error" => "Nada que actualizar"]);
        exit;
    }
    $params[] = $_SESSION["usuario_id"];
    $sql = "UPDATE Cliente SET " . implode(", ", $set) . " WHERE cliente_id = ?";
    $stmt = $con->prepare($sql);
    $stmt->execute($params);

    // Si el ID fue cambiado, actualizar la sesión
    if (!empty($data["id"]) && $data["id"] !== $_SESSION["usuario_id"]) {
        $_SESSION["usuario_id"] = $data["id"];
    }

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Error al actualizar datos"]);
}
?>
