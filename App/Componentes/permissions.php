<?php
$MODULE_PERMISSIONS = [
    'mesas' => ['Gerente-General', 'Camarero', 'Gerente-Turno'],
    'inventario' => ['Gerente-General', 'Gerente-Turno', 'Chef-Ejecutivo'],
    'productos' => ['Gerente-General', 'Chef', 'Chef-Ejecutivo', 'Gerente-Turno'],
    'reservas' => ['Gerente-General', 'Camarero', 'Gerente-Turno'],
    'cocina' => ['Gerente-General', 'Chef', 'Chef-Ejecutivo'],
    'pedidos' => ['Gerente-General', 'Camarero'],
    'promociones' => ['Gerente-General', 'Chef-Ejecutivo', 'Gerente-Turno'],
    'usuarios' => ['Gerente-General'],
    'empresa' => ['Gerente-General'],
    'estadisticas' => ['Gerente-General'],
    'fidelizados' => ['Gerente-General']
];

$READ_ONLY_PERMISSIONS = [
    'productos' => ['Chef'],
    'inventario' => ['Chef-Ejecutivo'],
    'reservas' => ['Camarero'],
    'mesas' => ['Camarero']
];

function isRoleAllowed($userRole, $moduleName)
{
    global $MODULE_PERMISSIONS;
    return isset($MODULE_PERMISSIONS[$moduleName]) &&
        in_array($userRole, $MODULE_PERMISSIONS[$moduleName]);
}

function hasWritePermission($userRole, $moduleName)
{
    global $READ_ONLY_PERMISSIONS;

    if (!isRoleAllowed($userRole, $moduleName)) {
        return false;
    }

    return !isset($READ_ONLY_PERMISSIONS[$moduleName]) ||
        !in_array($userRole, $READ_ONLY_PERMISSIONS[$moduleName]);
}

function requireWritePermission($moduleName)
{
    session_start();

    if (!isset($_SESSION['rol'])) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Sesión no válida'
        ]);
        exit;
    }

    $userRole = $_SESSION['rol'];

    if (!hasWritePermission($userRole, $moduleName)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'No tienes permisos para realizar esta acción'
        ]);
        exit;
    }
}
