<?php
include '../../../../Control/Conexión/conexion.php';


// Consulta para obtener todos los usuarios y su tipo
$sql = "
SELECT U.idUsuario, U.nombre, U.apellido, U.gmail,
    CASE
        WHEN C.idUsuario IS NOT NULL THEN 'Cliente'
        WHEN G.idUsuario IS NOT NULL THEN 'Gerente'
        WHEN CH.idUsuario IS NOT NULL THEN 'Chef'
        WHEN CHE.idUsuario IS NOT NULL THEN 'ChefEjecutivo'
        WHEN M.idUsuario IS NOT NULL THEN 'Mozo'
        ELSE 'Desconocido'
    END AS tipoUsuario
FROM Usuario U
LEFT JOIN Cliente C ON U.idUsuario = C.idUsuario
LEFT JOIN Gerente G ON U.idUsuario = G.idUsuario
LEFT JOIN Chef CH ON U.idUsuario = CH.idUsuario
LEFT JOIN ChefEjecutivo CHE ON U.idUsuario = CHE.idUsuario
LEFT JOIN Mozo M ON U.idUsuario = M.idUsuario
";
$result = $con->query($sql);

$usuarios = [];
while ($row = $result->fetchAll(PDO::FETCH_ASSOC)) {
    $usuarios = $row;
}

echo json_encode($usuarios);
?>