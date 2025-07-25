<?php
session_start();
$id_usuario = $_SESSION["usuario_id"];
echo $id_usuario;