<?php
require_once("../../../../Control/Conexion/clienteNoRegistrado.php");
require("../../../../Control/Librerias/fpdf/fpdf.php");


class PDF extends FPDF {
    // Cabecera de página
    function Header() {
        // Título
        $this->SetFont('Arial', 'B', 20);
        $this->SetTextColor(40, 40, 40);
        $this->Cell(0, 10, 'Menú de Los 3 Tanos', 0, 1, 'C');
        
        // Línea decorativa
        $this->SetDrawColor(211, 47, 47);
        $this->SetLineWidth(0.5);
        $this->Line(10, 30, 200, 30);
        
        // Espacio después del encabezado
        $this->Ln(15);
    }

    // Pie de página
    function Footer() {
        // Posición a 1.5 cm del final
        $this->SetY(-15);
        // Arial itálica 8
        $this->SetFont('Arial', 'I', 8);
        // Número de página
        $this->Cell(0, 10, 'Página ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
        // Fecha de generación
        $this->SetX(-60);
        $this->Cell(0, 10, 'Generado el: ' . date('d/m/Y H:i'), 0, 0, 'R');
    }

    // Función para verificar si necesitamos una nueva página
    function CheckPageBreak($h) {
        if($this->GetY() + $h > $this->PageBreakTrigger) {
            $this->AddPage($this->CurOrientation);
            return true;
        }
        return false;
    }

    // Calcular número de líneas que ocupará un texto
    function NbLines($w, $txt) {
        $cw = &$this->CurrentFont['cw'];
        if($w == 0) {
            $w = $this->w - $this->rMargin - $this->x;
        }
        $wmax = ($w - 2 * $this->cMargin) * 1000 / $this->FontSize;
        $s = str_replace("\r", '', $txt);
        $nb = strlen($s);
        if($nb > 0 && $s[$nb-1] == "\n") {
            $nb--;
        }
        $sep = -1;
        $i = 0;
        $j = 0;
        $l = 0;
        $nl = 1;
        while($i < $nb) {
            $c = $s[$i];
            if($c == "\n") {
                $i++;
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
                continue;
            }
            if($c == ' ') {
                $sep = $i;
            }
            $l += $cw[$c];
            if($l > $wmax) {
                if($sep == -1) {
                    if($i == $j) {
                        $i++;
                    }
                } else {
                    $i = $sep + 1;
                }
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
            } else {
                $i++;
            }
        }
        return $nl;
    }

    // Tabla de productos
    function ProductTable($header, $data) {
        // Colores, ancho de línea y fuente en negrita
        $this->SetFillColor(211, 47, 47); // Rojo
        $this->SetTextColor(255);
        $this->SetDrawColor(180, 30, 30);
        $this->SetLineWidth(0.3);
        $this->SetFont('Arial', 'B', 10);
        
        // Anchuras de las columnas (ajustadas para mejor visualización)
        $w = array(70, 80, 30);
        
        // Altura de línea base
        $lineHeight = 6;
        
        // Verificar espacio para los encabezados
        $this->CheckPageBreak($lineHeight * 2);
        
        // Guardar la posición Y inicial
        $startY = $this->GetY();
        
        // Cabeceras
        for($i = 0; $i < count($header); $i++) {
            $this->Cell($w[$i], $lineHeight, $header[$i], 1, 0, 'C', true);
        }
        $this->Ln();
        
        // Restauración de colores y fuentes
        $this->SetFillColor(250, 250, 250);
        $this->SetTextColor(0);
        $this->SetFont('Arial', '', 10);
        
        // Datos
        $fill = false;
        
        foreach($data as $row) {
            // Calcular altura necesaria para esta fila
            $nb = max(
                $this->NbLines($w[0], $row[0]),
                $this->NbLines($w[1], $row[1]),
                1 // Mínimo una línea para el precio
            );
            
            $h = $lineHeight * $nb;
            
            // Verificar si necesitamos una nueva página
            if($this->CheckPageBreak($h)) {
                $this->SetFillColor(250, 250, 250);
                $this->SetTextColor(0);
                $fill = false;
            }
            
            // Guardar posición actual
            $x = $this->GetX();
            $y = $this->GetY();
            
            // Dibujar celdas
            $this->MultiCell($w[0], $lineHeight, $row[0], 'LR', 'L', $fill, $nb);
            $this->SetXY($x + $w[0], $y);
            
            $this->MultiCell($w[1], $lineHeight, $row[1], 'LR', 'L', $fill, $nb);
            // Mover a la posición del precio
            $this->SetXY($x + $w[0] + $w[1], $y);
            
            // Celda del precio con la misma altura que la descripción
            $this->MultiCell($w[2], $h, '$' . number_format($row[2], 2, ',', '.'), 'LR', 'R', $fill);
            
            // Mover a la siguiente línea
            $this->SetXY($x, $y + $h);
            
            // Dibujar bordes laterales si es necesario
            $this->Cell($w[0], $h, '', 'LR', 0, '', $fill);
            $this->Cell($w[1] + $w[2], $h, '', 'R', 1, '', $fill);
            
            $fill = !$fill;
        }
        // Línea de cierre
        $this->Cell(array_sum($w), 0, '', 'T');
    }
}

try {
    // Configurar zona horaria
    date_default_timezone_set('America/Argentina/Buenos_Aires');
    
    // Obtener productos por categoría
    $sql = "SELECT producto_id, producto_nombre, producto_descripcion, producto_precio, producto_categoria 
            FROM Producto 
            ORDER BY 
                CASE 
                    WHEN producto_categoria = 'Entradas' THEN 1
                    WHEN producto_categoria = 'Platos Principales' THEN 2
                    WHEN producto_categoria = 'Postres' THEN 3
                    WHEN producto_categoria = 'Bebidas' THEN 4
                    ELSE 5 
                END,
                producto_nombre";
    
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Agrupar productos por categoría
    $categorias = [];
    foreach ($productos as $producto) {
        $categoria = $producto['producto_categoria'];
        if (!isset($categorias[$categoria])) {
            $categorias[$categoria] = [];
        }
        $categorias[$categoria][] = $producto;
    }
    
    // Crear PDF
    $pdf = new PDF();
    $pdf->AliasNbPages();
    $pdf->AddPage();
    $pdf->SetFont('Arial', '', 12);
    
    // Título del menú
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(0, 10, 'Nuestro Menú', 0, 1, 'C');
    $pdf->Ln(5);
    
    // Encabezados de la tabla
    $header = array('Producto', 'Descripción', 'Precio');
    
    // Agregar productos por categoría
    foreach ($categorias as $categoria => $productosCategoria) {
        // Título de la categoría
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->SetFillColor(240, 240, 240);
        $pdf->Cell(0, 8, ucfirst($categoria), 0, 1, 'L', true);
        $pdf->SetFont('Arial', '', 10);
        
        // Preparar datos para la tabla
        $data = [];
        foreach ($productosCategoria as $producto) {
            // Limpiar y formatear la descripción
            $descripcion = trim($producto['producto_descripcion']);
            $descripcion = str_replace("\r\n", "\n", $descripcion); // Normalizar saltos de línea
            $descripcion = str_replace("\r", "\n", $descripcion);
            $descripcion = preg_replace('/\n+/', "\n", $descripcion); // Eliminar saltos de línea múltiples
            $descripcion = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $descripcion); // Eliminar caracteres de control
            $descripcion = html_entity_decode($descripcion, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            
            $data[] = [
                $producto['producto_nombre'],
                $descripcion,
                $producto['producto_precio']
            ];
        }
        
        // Agregar tabla de productos
        $pdf->ProductTable($header, $data);
        $pdf->Ln(8); // Espacio entre categorías
    }
    
    // Pie de página personalizado
    $pdf->SetY(-40);
    $pdf->SetFont('Arial', 'I', 10);
    $pdf->Cell(0, 5, 'Gracias por elegirnos', 0, 1, 'C');
    
    // Configurar cabeceras para UTF-8
    $filename = 'los3tanos_menu_' . date('Y-m-d') . '.pdf';
    header('Content-Type: application/pdf');
    header('Content-Disposition: inline; filename="' . $filename . '"');
    
    // Salida del PDF
    $pdf->Output('I', $filename);
    
} catch (Exception $e) {
    // En caso de error, devolver un mensaje
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al generar el menú',
        'message' => $e->getMessage()
    ]);
}
