<?php
header('Content-Type: application/json');
include '../../../../Control/Conexion/gerente.php';

try {
    $input = [];
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = $_POST ?: json_decode(file_get_contents('php://input'), true) ?: [];
    } else {
        $input = $_GET ?: [];
    }

    $search = isset($input['search']) ? trim($input['search']) : '';
    $rol = isset($input['rol']) ? trim($input['rol']) : '';
    $estado = isset($input['estado']) ? trim($input['estado']) : '';

    $where = [];
    $params = [];

    if ($search !== '') {
        $like = '%'.$search.'%';
        $where[] = '(usuario_nombre LIKE ? OR usuario_apellido LIKE ? OR usuario_id LIKE ? OR usuario_rol LIKE ? OR usuario_telefono LIKE ?)';
        $params = array_merge($params, [$like, $like, $like, $like, $like]);
    }

    if ($rol !== '') {
        $where[] = 'usuario_rol = ?';
        $params[] = $rol;
    }

    if ($estado !== '' && ($estado === '0' || $estado === '1')) {
        $where[] = 'usuario_activo = ?';
        $params[] = (int)$estado;
    }

    $sql = 'SELECT * FROM Datos_Usuarios';
    if (!empty($where)) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }
    $sql .= ' ORDER BY usuario_apellido, usuario_nombre';

    $stmt = $con->prepare($sql);
    $stmt->execute($params);
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'usuarios' => $usuarios
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener usuarios'
    ]);
}
