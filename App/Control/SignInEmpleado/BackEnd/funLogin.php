<?php
function iniciarSesion($usuario)
{
    include "../../Conexion/clienteNoRegistrado.php"; 
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }

    session_start();
    $_SESSION["usuario_id"] = $usuario["email"];
    $_SESSION["nombre"] = $usuario["nombre"];
    $_SESSION["apellido"] = $usuario["apellido"];
    $_SESSION["logged"] = true; // Para verificar si el usuario está logueado
    $_SESSION["rol"] = $usuario["rol"]; // El rol ya viene en el JSON del procedimiento
}
?>