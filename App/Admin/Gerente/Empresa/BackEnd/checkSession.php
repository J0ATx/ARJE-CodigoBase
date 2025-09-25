<?php
header('Content-Type: application/json');
session_start();
$response = [
    "logged_in" => false
];
if (isset($_SESSION["logged"]) && $_SESSION["logged"] === true) {
    try {
        require_once "../../../../Control/Conexión/conexion.php";
        $sql = "SELECT * FROM Cliente WHERE cliente_id = ?";
        $resultado = $con->prepare($sql);
        $resultado->execute([$_SESSION["usuario_id"]]);
        $usuario = $resultado->fetch(PDO::FETCH_ASSOC);
        if ($usuario) {
            $_SESSION["nombre"] = $usuario["cliente_nombre"];
            $_SESSION["apellido"] = $usuario["cliente_apellido"];
            $_SESSION["logged"] = true;
            $_SESSION["rol"] = "Cliente";
        }
        $sql_personal = "SELECT * FROM Personal WHERE personal_id = ?";
        $resultado_personal = $con->prepare($sql_personal);
        $resultado_personal->execute([$_SESSION["usuario_id"]]);
        $personal = $resultado_personal->fetch(PDO::FETCH_ASSOC);
        if ($personal) {
            $_SESSION["nombre"] = $personal["personal_nombre"];
            $_SESSION["apellido"] = $personal["personal_apellido"];
            $_SESSION["logged"] = true;
            $_SESSION["rol"] = $personal["personal_rol"];
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
