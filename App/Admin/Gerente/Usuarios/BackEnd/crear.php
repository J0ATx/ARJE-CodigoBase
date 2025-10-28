<?php
header('Content-Type: application/json');
require_once '../../../../Control/Conexion/gerente.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['nombre'], $data['apellido'], $data['email'], $data['contrasenia'], $data['tipoUsuario'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos requeridos"]);
    exit;
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Formato de email inválido"]);
    exit;
}

if (strlen($data['telefono'] ?? '') > 9) {
    http_response_code(400);
    echo json_encode(["error" => "El teléfono debe tener máximo 9 dígitos"]);
    exit;
}

try {
    $con->beginTransaction();

    $hashedPass = password_hash($data['contrasenia'], PASSWORD_DEFAULT);

    if ($data['tipoUsuario'] === 'Cliente') {
        $stmt = $con->prepare("INSERT INTO Cliente (
            cliente_id, 
            cliente_nombre, 
            cliente_apellido, 
            cliente_telefono, 
            cliente_contrasenia
        ) VALUES (
            :email,
            :nombre,
            :apellido,
            :telefono,
            :contrasenia
        )");

        $stmt->execute([
            ':email' => $data['email'],
            ':nombre' => $data['nombre'],
            ':apellido' => $data['apellido'],
            ':telefono' => $data['telefono'],
            ':contrasenia' => $hashedPass
        ]);
    } else {
        $rolesValidos = ['Gerente-General', 'Gerente-Turno', 'Chef-Ejecutivo', 'Chef', 'Camarero'];
        if (!in_array($data['tipoUsuario'], $rolesValidos)) {
            throw new Exception("Rol de personal no válido");
        }

        $stmt = $con->prepare("INSERT INTO Personal (
            personal_id, 
            personal_nombre, 
            personal_apellido, 
            personal_telefono, 
            personal_contrasenia, 
            personal_rol
        ) VALUES (
            :email,
            :nombre,
            :apellido,
            :telefono,
            :contrasenia,
            :rol
        )");

        $stmt->execute([
            ':email' => $data['email'],
            ':nombre' => $data['nombre'],
            ':apellido' => $data['apellido'],
            ':telefono' => $data['telefono'] ?? '',
            ':contrasenia' => $hashedPass,
            ':rol' => $data['tipoUsuario']
        ]);

        $roleTable = null;
        switch ($data['tipoUsuario']) {
            case 'Gerente-General':
                $roleTable = 'Gerente_General';
                break;
            case 'Chef-Ejecutivo':
                $roleTable = 'Chef_Ejecutivo';
                break;
            case 'Camarero':
                $roleTable = 'Camarero';
                break;
            case 'Chef':
                break;
            case 'Gerente-Turno':
                break;
            default:
                throw new Exception("Rol no válido o no soportado");
        }

        if ($roleTable !== null) {
            $stmt = $con->prepare("INSERT INTO {$roleTable} (personal_id) VALUES (:email)");
            $stmt->execute([':email' => $data['email']]);
        }
    }

    $con->commit();
    echo json_encode([
        "success" => true,
        "mensaje" => "Usuario creado exitosamente como {$data['tipoUsuario']}"
    ]);

} catch (PDOException $e) {
    $con->rollBack();
    $errorInfo = $e->errorInfo;
    
    if ($errorInfo[0] === '23000') {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => "El email ya está registrado"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Error en la base de datos: " . $e->getMessage()
        ]);
    }
} catch (Exception $e) {
    $con->rollBack();
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
