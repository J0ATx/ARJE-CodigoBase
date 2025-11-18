<?php
header('Content-Type: application/json');
require_once $_SERVER['DOCUMENT_ROOT'] . '/App/Control/Conexion/clienteRegistrado.php';
session_start();

if (!isset($_SESSION["usuario_id"])) {
    echo json_encode(["success" => false, "error" => "Sesión no iniciada"]);
    exit;
}

try {
    $stmt = $con->prepare("SELECT usuario_rol FROM Datos_Usuarios WHERE usuario_id = ?");
    $stmt->execute([$_SESSION["usuario_id"]]);
    $usuarioData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuarioData) {
        throw new Exception("Usuario no encontrado");
    }

    $rol = $usuarioData['usuario_rol'];
    $esCliente = ($rol === 'cliente');

    $datos = [
        'nombre' => $_POST['nombre'] ?? null,
        'apellido' => $_POST['apellido'] ?? null,
        'telefono' => $_POST['telefono'] ?? null,
        'contrasenia' => $_POST['contrasenia'] ?? null,
        'platillofav' => $esCliente ? ($_POST['platillofav'] ?? null) : null
    ];

    if (empty($datos['nombre']) || empty($datos['apellido'])) {
        throw new Exception("Nombre y apellido son campos requeridos");
    }

    if (!empty($datos['telefono']) && !preg_match('/^\d{9}$/', $datos['telefono'])) {
        throw new Exception("El teléfono debe tener exactamente 9 dígitos numéricos");
    }

    $set = [];
    $params = [];

    $camposBD = [
        'nombre' => $esCliente ? 'cliente_nombre' : 'personal_nombre',
        'apellido' => $esCliente ? 'cliente_apellido' : 'personal_apellido',
        'telefono' => $esCliente ? 'cliente_telefono' : 'personal_telefono'
    ];

    foreach ($camposBD as $campo => $columna) {
        if ($datos[$campo] !== null) {
            $set[] = "$columna = ?";
            $params[] = $datos[$campo];
        }
    }

    if (!empty($datos['contrasenia'])) {
        $set[] = 'cliente_contrasenia = ?';
        $params[] = password_hash($datos['contrasenia'], PASSWORD_DEFAULT);
    }

    if ($esCliente && $datos['platillofav'] !== null) {
        $set[] = 'cliente_platillo_favorito = ?';
        $params[] = $datos['platillofav'];
    }

    if (empty($set)) {
        throw new Exception("No se proporcionaron datos para actualizar");
    }

    $tabla = $esCliente ? 'Cliente' : 'Personal';
    $columnaId = $esCliente ? 'cliente_id' : 'personal_id';
    $params[] = $_SESSION["usuario_id"];

    $sql = "UPDATE $tabla SET " . implode(", ", $set) . " WHERE $columnaId = ?";
    $stmt = $con->prepare($sql);
    $stmt->execute($params);

    $stmt = $con->prepare("SELECT * FROM Datos_Usuarios WHERE usuario_id = ?");
    $stmt->execute([$_SESSION["usuario_id"]]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    $response = [
        "success" => true,
        "user" => [
            "id" => $usuario['usuario_id'],
            "nombre" => $usuario['usuario_nombre'],
            "apellido" => $usuario['usuario_apellido'],
            "telefono" => $usuario['usuario_telefono'],
            "rol" => $usuario['usuario_rol']
        ]
    ];

    if ($esCliente) {
        $response["user"]["platillofav"] = $usuario['usuario_platillo_favorito'];
        $response["user"]["cliente_fidelizado"] = $usuario['usuario_fidelizado'];
    }

    if (!empty($usuario['usuario_img'])) {
        $response["user"]["avatar"] = $usuario['usuario_img'];
    }
} catch (Exception $e) {
    http_response_code(400);
    $response = [
        "success" => false,
        "error" => $e->getMessage()
    ];
}

echo json_encode($response);
