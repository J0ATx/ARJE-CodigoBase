<?php
header('Content-Type: application/json');
session_start();
$response = [
    "logged_in" => false,
];
if (isset($_SESSION["logged"]) && $_SESSION["logged"] === true) {
    require_once "../../../Control/Conexión/conexion.php";
    $sql = "SELECT * FROM Cliente WHERE cliente_id = ?";
    $resultado = $con->prepare($sql);
    $resultado->execute([$_SESSION["usuario_id"]]);
    $usuario = $resultado->fetch(PDO::FETCH_ASSOC);

    $_SESSION["nombre"] = $usuario["cliente_nombre"];
    $_SESSION["apellido"] = $usuario["cliente_apellido"];
    $_SESSION["logged"] = true; // Para verficar si el usuario está logueado

    // Verificar si el usuario es personal
    $sql_personal = "SELECT COUNT(*) as es_personal FROM Personal WHERE personal_id = ?";
    $resultado_personal = $con->prepare($sql_personal);
    $resultado_personal->execute([$_SESSION["usuario_id"]]);
    $es_personal = $resultado_personal->fetch(PDO::FETCH_ASSOC)["es_personal"] > 0;

    $sql_rol = "SELECT personal_rol FROM Personal WHERE personal_id = ?";
    $resultado_rol = $con->prepare($sql_rol);
    $resultado_rol->execute([$_SESSION["usuario_id"]]);
    $rol = $resultado_rol->fetch(PDO::FETCH_ASSOC);


    if ($es_personal == true) {
        $_SESSION["rol"] = $rol;
    } else {
        $_SESSION["rol"] = "Cliente";
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
}
echo json_encode($response);
