<?php 

    include_once '../control/conexion.php';


    $var1 = $_POST['var1'];
    $var2 = $_POST['var2'];

    // Regex validations
    if (!preg_match('/^[a-zA-Z0-9_\- ]{1,100}$/', $var1)) {
        echo json_encode(["error" => "var1 inválido"]);
        exit();
    }
    if (!preg_match('/^[a-zA-Z0-9_\- ]{1,100}$/', $var2)) {
        echo json_encode(["error" => "var2 inválido"]);
        exit();
    }

    try {
        $sql = "UPDATE reserva SET campo1 = ?, campo2 = ? WHERE id = ?;";
        $sentencia = $con->prepare($sql);
        $sentencia->execute([$var1, $var2]);
    } catch (\Throwable $th) {
        JSON_encode("error" => "Error al modificar los datos: " . $th->getMessage());
        exit();
    }

?>