
<?php
function iniciarSesion($usuario)
{
    include "../../Conexión/conexion.php";
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }

    session_start();
    $_SESSION["usuario_id"] = $usuario["personal_id"];
    $_SESSION["nombre"] = $usuario["personal_nombre"];
    $_SESSION["apellido"] = $usuario["personal_apellido"];
    $_SESSION["logged"] = true; // Para verficar si el usuario está logueado

    // Verificar si el usuario es gerente
    $sql_personal = "SELECT personal_rol FROM Personal WHERE personal_id = ?";
    $resultado_personal = $con->prepare($sql_personal);
    $resultado_personal->execute([$usuario["personal_id"]]);
    $rol = $resultado_personal->fetch(PDO::FETCH_ASSOC);

    $_SESSION["rol"] = $rol;
}
?>