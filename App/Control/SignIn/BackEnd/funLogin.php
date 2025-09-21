
<?php
function iniciarSesion($usuario)
{
    include "../../Conexión/clienteNoRegistrado.php";
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }

    session_start();
    $_SESSION["usuario_id"] = $usuario["idUsuario"];
    $_SESSION["nombre"] = $usuario["nombre"];
    $_SESSION["apellido"] = $usuario["apellido"];
    $_SESSION["logged"] = true;
    $_SESSION["rol"] = "Cliente";
}
?>