<?php
header('Content-Type: application/json');
session_start();
$response = [
    "logged_in" => false
];
if (isset($_SESSION["logged"]) && $_SESSION["logged"] === true) {
    try {
        require_once "../../../Control/Conexion/clienteNoRegistrado.php";
        $sql = "SELECT * FROM datos_usuarios WHERE usuario_id = ?";
        $resultado = $con->prepare($sql);
        $resultado->execute([$_SESSION["usuario_id"]]);
        $usuario = $resultado->fetch(PDO::FETCH_ASSOC);
        if ($usuario) {
            $_SESSION["nombre"] = $usuario["usuario_nombre"];
            $_SESSION["apellido"] = $usuario["usuario_apellido"];
            $_SESSION["logged"] = true;
            $_SESSION["rol"] = $usuario["usuario_rol"];
        }
        $response = [
            "logged_in" => isset($_SESSION["logged"]) && $_SESSION["logged"] === true,
            "user" => isset($_SESSION["usuario_id"]) ? [
                "id" => $_SESSION["usuario_id"],
                "nombre" => $_SESSION["nombre"],
                "apellido" => $_SESSION["apellido"],
                "rol" => $_SESSION["rol"]
            ] : null
        ];
    } catch (Exception $e) {
        $response = [
            "logged_in" => false
        ];
    }
}
echo json_encode($response);
