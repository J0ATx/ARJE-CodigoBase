<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION["usuario_id"]) || !isset($_SESSION["logged"]) || $_SESSION["logged"] !== true) {
    echo json_encode(["success" => false, "error" => "No autenticado"]);
    exit;
}

try {
    require_once __DIR__ . "/../../Conexion/clienteRegistrado.php";

    $usuarioId = $_SESSION["usuario_id"];    
    $stmt = $con->prepare("SELECT usuario_rol FROM Datos_Usuarios WHERE usuario_id = ?");
    $stmt->execute([$usuarioId]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$usuario) {
        throw new Exception("Usuario no encontrado");
    }

    $rol = strtolower($usuario['usuario_rol']);
    if ($rol === 'cliente') {
        $upd = $con->prepare("UPDATE Cliente SET cliente_eliminado = TRUE WHERE cliente_id = ?");
        $upd->execute([$usuarioId]);
    } else {
        $upd = $con->prepare("UPDATE Personal SET personal_eliminado = TRUE WHERE personal_id = ?");
        $upd->execute([$usuarioId]);
    }

    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>