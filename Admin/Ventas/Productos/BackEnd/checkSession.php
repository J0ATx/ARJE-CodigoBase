<?php
header('Content-Type: application/json');
session_start();

if (isset($_SESSION["logged"]) && $_SESSION["logged"] === true) {
    require_once "../../../../Control/Conexión/conexion.php";
    $sql = "SELECT * FROM Usuario WHERE idUsuario = ?";
    $resultado = $con->prepare($sql);
    $resultado->execute([$_SESSION["usuario_id"]]);
    $usuario = $resultado->fetch(PDO::FETCH_ASSOC);

    $_SESSION["nombre"] = $usuario["nombre"];
    $_SESSION["apellido"] = $usuario["apellido"];
    $_SESSION["logged"] = true; // Para verficar si el usuario está logueado

    // Verificar si el usuario es gerente
    $sql_gerente = "SELECT COUNT(*) as es_gerente FROM Gerente WHERE idUsuario = ?";
    $resultado_gerente = $con->prepare($sql_gerente);
    $resultado_gerente->execute([$_SESSION["usuario_id"]]);
    $es_gerente = $resultado_gerente->fetch(PDO::FETCH_ASSOC)["es_gerente"] > 0;

    // Verificar si el usuario es chef
    $sql_chef = "SELECT COUNT(*) as es_chef FROM Chef WHERE idUsuario = ?";
    $resultado_chef = $con->prepare($sql_chef);
    $resultado_chef->execute([$_SESSION["usuario_id"]]);
    $es_chef = $resultado_chef->fetch(PDO::FETCH_ASSOC)["es_chef"] > 0;

    // Verificar si el usuario es ChefEjecutivo
    $sql_chef_ejecutivo = "SELECT COUNT(*) as es_chef_ejecutivo FROM ChefEjecutivo WHERE idUsuario = ?";
    $resultado_chef_ejecutivo = $con->prepare($sql_chef_ejecutivo);
    $resultado_chef_ejecutivo->execute([$_SESSION["usuario_id"]]);
    $es_chef_ejecutivo = $resultado_chef_ejecutivo->fetch(PDO::FETCH_ASSOC)["es_chef_ejecutivo"] > 0;

    // Verificar si el usuario es mozo
    $sql_mozo = "SELECT COUNT(*) as es_mozo FROM Mozo WHERE idUsuario = ?";
    $resultado_mozo = $con->prepare($sql_mozo);
    $resultado_mozo->execute([$_SESSION["usuario_id"]]);
    $es_mozo = $resultado_mozo->fetch(PDO::FETCH_ASSOC)["es_mozo"] > 0;



    if ($es_gerente == true) {
        $_SESSION["rol"] = "Gerente";
    } else if ($es_chef == true) {
        $_SESSION["rol"] = "Chef";
    } else if ($es_chef_ejecutivo == true) {
        $_SESSION["rol"] = "ChefEjecutivo";
    } else if ($es_mozo == true) {
        $_SESSION["rol"] = "Mozo";
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
