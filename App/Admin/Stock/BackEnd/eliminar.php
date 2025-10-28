<?php
require_once '../../../Control/Conexion/gerente.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $stmt = $con->prepare("SELECT COUNT(*) FROM Consume WHERE stock_id = ?");
        $stmt->execute([$_POST['id']]);

        if ($stmt->fetchColumn() > 0) {
            $response['success'] = false;
            $response['message'] = 'No se puede eliminar el stock porque está siendo usado en uno o más productos';
        } else {
            $stmtDel = $con->prepare("DELETE FROM Stock WHERE stock_id = ?");
            $stmtDel->execute([$_POST['id']]);

            if ($stmtDel->rowCount() > 0) {
                $response['success'] = true;
                $response['message'] = 'Stock eliminado con éxito';
            } else {
                $response['success'] = false;
                $response['message'] = 'No se encontró el stock';
            }
        }
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al eliminar el stock: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
