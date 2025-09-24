
<?php
function iniciarSesion($usuario)
{
    include "../../Conexión/conexion.php";
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }

    session_start();
    $_SESSION["usuario_id"] = $usuario["cliente_id"];
    $_SESSION["nombre"] = $usuario["cliente_nombre"];
    $_SESSION["apellido"] = $usuario["cliente_apellido"];
    $_SESSION["logged"] = true;
    $_SESSION["rol"] = "Cliente";
}
?>