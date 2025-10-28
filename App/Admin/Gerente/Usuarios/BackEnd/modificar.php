<?php
header('Content-Type: application/json');
include '../../../../Control/Conexion/gerente.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['nombre'], $data['apellido'], $data['telefono'], $data['tipoUsuario'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Faltan datos requeridos"
    ]);
    exit;
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Formato de email inválido"
    ]);
    exit;
}

if (strlen($data['telefono']) > 9) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "El teléfono debe tener máximo 9 dígitos"
    ]);
    exit;
}

try {
    $con->beginTransaction();

    $esCliente = false;
    $stmt = $con->prepare("SELECT 1 FROM Cliente WHERE cliente_id = ?");
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        $esCliente = true;
    }

    if ($data['tipoUsuario'] === 'Cliente') {
        if ($esCliente) {
            $stmt = $con->prepare("UPDATE Cliente SET 
                cliente_nombre = :nombre,
                cliente_apellido = :apellido,
                cliente_telefono = :telefono
                WHERE cliente_id = :email");
            $stmt->execute([
                ':nombre' => $data['nombre'],
                ':apellido' => $data['apellido'],
                ':telefono' => $data['telefono'],
                ':email' => $data['email']
            ]);
        } else {
            $roles = ['Camarero', 'Chef_Ejecutivo', 'Gerente_General'];
            foreach ($roles as $tabla) {
                $stmt = $con->prepare("DELETE FROM {$tabla} WHERE personal_id = ?");
                $stmt->execute([$data['email']]);
            }

            $stmt = $con->prepare("UPDATE Personal SET 
                personal_nombre = :nombre,
                personal_apellido = :apellido,
                personal_telefono = :telefono,
                personal_rol = 'Cliente'
                WHERE personal_id = :email");
            $stmt->execute([
                ':nombre' => $data['nombre'],
                ':apellido' => $data['apellido'],
                ':telefono' => $data['telefono'],
                ':email' => $data['email']
            ]);

            $stmt = $con->prepare("INSERT INTO Cliente 
                (cliente_id, cliente_nombre, cliente_apellido, cliente_telefono) 
                VALUES (:email, :nombre, :apellido, :telefono)");
            $stmt->execute([
                ':email' => $data['email'],
                ':nombre' => $data['nombre'],
                ':apellido' => $data['apellido'],
                ':telefono' => $data['telefono']
            ]);
        }
    } else {
        $roleTable = '';
        $validRoles = ['Gerente-General', 'Chef-Ejecutivo', 'Camarero', 'Chef', 'Gerente-Turno'];

        if (!in_array($data['tipoUsuario'], $validRoles)) {
            throw new Exception('Rol no válido');
        }

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
        }

        if ($esCliente) {
            $checkStmt = $con->prepare("SELECT COUNT(*) as count FROM Personal WHERE personal_id = :email");
            $checkStmt->execute([':email' => $data['email']]);
            $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
            $existeEnPersonal = ($result['count'] > 0);
            
            if (!$existeEnPersonal) {
                $stmt = $con->prepare("INSERT INTO Personal 
                    (personal_id, personal_nombre, personal_apellido, personal_telefono, personal_rol) 
                    VALUES (:email, :nombre, :apellido, :telefono, :rol)");
                $result = $stmt->execute([
                    ':email' => $data['email'],
                    ':nombre' => $data['nombre'],
                    ':apellido' => $data['apellido'],
                    ':telefono' => $data['telefono'],
                    ':rol' => $data['tipoUsuario']
                ]);
                
                if (!$result) {
                    throw new Exception("Error al convertir el cliente a personal");
                }
            } else {
                $stmt = $con->prepare("UPDATE Personal SET 
                    personal_nombre = :nombre,
                    personal_apellido = :apellido,
                    personal_telefono = :telefono,
                    personal_rol = :rol
                    WHERE personal_id = :email");
                $stmt->execute([
                    ':nombre' => $data['nombre'],
                    ':apellido' => $data['apellido'],
                    ':telefono' => $data['telefono'],
                    ':rol' => $data['tipoUsuario'],
                    ':email' => $data['email']
                ]);
            }
            
            $stmt = $con->prepare("DELETE FROM Cliente WHERE cliente_id = ?");
            $stmt->execute([$data['email']]);
        } else {
            $stmt = $con->prepare("UPDATE Personal SET 
                personal_nombre = :nombre,
                personal_apellido = :apellido,
                personal_telefono = :telefono,
                personal_rol = :rol
                WHERE personal_id = :email");
            $stmt->execute([
                ':nombre' => $data['nombre'],
                ':apellido' => $data['apellido'],
                ':telefono' => $data['telefono'],
                ':rol' => $data['tipoUsuario'],
                ':email' => $data['email']
            ]);
        }

        if (!empty($roleTable)) {
            $roles = ['Camarero', 'Chef_Ejecutivo', 'Gerente_General'];
            foreach ($roles as $tabla) {
                if ($tabla !== $roleTable) {
                    $stmt = $con->prepare("DELETE FROM {$tabla} WHERE personal_id = ?");
                    $stmt->execute([$data['email']]);
                }
            }

            $checkStmt = $con->prepare("SELECT COUNT(*) as count FROM {$roleTable} WHERE personal_id = :email");
            $checkStmt->execute([':email' => $data['email']]);
            $result = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if ($result['count'] == 0) {
                $stmt = $con->prepare("INSERT INTO {$roleTable} (personal_id) VALUES (:email)");
                $result = $stmt->execute([':email' => $data['email']]);
                if (!$result) {
                    throw new Exception("Error al asignar el rol al usuario");
                }
            }
        } else {
            $roles = ['Camarero', 'Chef_Ejecutivo', 'Gerente_General'];
            foreach ($roles as $tabla) {
                $stmt = $con->prepare("DELETE FROM {$tabla} WHERE personal_id = ?");
                $stmt->execute([$data['email']]);
            }
        }
    }

    $con->commit();
    echo json_encode([
        "success" => true,
        "mensaje" => "Usuario actualizado correctamente"
    ]);
} catch (PDOException $e) {
    $con->rollBack();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al actualizar usuario: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    $con->rollBack();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
