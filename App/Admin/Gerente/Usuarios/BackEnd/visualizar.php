<?php
header('Content-Type: application/json');
include '../../../../Control/Conexión/conexion.php';

try {
    // Consulta para obtener clientes
    $sqlClientes = "SELECT 
        cliente_id as id,
        cliente_nombre as nombre,
        cliente_apellido as apellido,
        cliente_telefono as telefono,
        cliente_id as email,
        'Cliente' as tipoUsuario
    FROM Cliente";

    // Consulta para obtener personal
    $sqlPersonal = "SELECT 
        personal_id as id,
        personal_nombre as nombre,
        personal_apellido as apellido,
        personal_telefono as telefono,
        personal_id as email,
        personal_rol as tipoUsuario
    FROM Personal";

    $stmtClientes = $con->query($sqlClientes);
    $stmtPersonal = $con->query($sqlPersonal);

    $clientes = $stmtClientes->fetchAll(PDO::FETCH_ASSOC);
    $personal = $stmtPersonal->fetchAll(PDO::FETCH_ASSOC);

    // Combinar resultados
    $usuarios = array_merge($clientes, $personal);

    echo json_encode([
        "success" => true,
        "usuarios" => $usuarios
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al obtener usuarios"
    ]);
}
?>