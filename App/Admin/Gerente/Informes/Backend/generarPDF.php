<?php
// Use an absolute-ish path relative to this file for robustness
require_once __DIR__ . '/../../../../Control/Librerias/fpdf/fpdf.php';

// Helper: convert UTF-8 strings to ISO-8859-1 expected by FPDF
function fpdf_text($s) {
	if ($s === null) return '';
	// utf8_decode maps UTF-8 to ISO-8859-1; if characters are outside ISO-8859-1 they'll be lost.
	// For full Unicode support you'd need a different approach (TCPDF or add a Unicode font).
	return ($s);
}

// Try to obtain the same data that the frontend uses by including cargarInfo.php
// First set up proper POST environment, then capture its output JSON
$data = null;
$cargarPath = __DIR__ . '/cargarInfo.php';
if (file_exists($cargarPath)) {
    // Parámetros que quieras pasar a cargarInfo.php (vacío si no se necesitan filtros)
    $params = [
        // 'fecha_inicio' => '2025-01-01',
        // 'fecha_fin' => '2025-10-30',
    ];

    // Guardar estado actual
    $oldPost = $_POST;
    $oldMethod = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : null;

    // Simular una petición POST para que cargarInfo.php ejecute las consultas
    $_POST = $params;
    $_SERVER['REQUEST_METHOD'] = 'POST';

    // Capturar la salida JSON del script
    ob_start();
    include $cargarPath;
    $json = ob_get_clean();

    // Restaurar estado original
    $_POST = $oldPost;
    if ($oldMethod !== null) {
        $_SERVER['REQUEST_METHOD'] = $oldMethod;
    } else {
        unset($_SERVER['REQUEST_METHOD']);
    }

    // Decodificar el JSON a array
    $decoded = json_decode($json, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $data = $decoded;
    }
}

// Fallback: if we didn't get data, create an empty structure to avoid warnings
if (!is_array($data)) {
	$data = [
		'ventasTotales' => [['total_ventas' => '0']],
		'ventasPorCamarero' => [],
		'ventasPorCliente' => [],
		'ventasPorFecha' => [],
		'ventasPorPago' => [],
		'ventasPorProducto' => [],
		'noShowPorCliente' => [],
		'noShowPorFecha' => []
	];
}

// 1. Crear el objeto FPDF
$pdf = new FPDF();
$pdf->AddPage();

// Document title
$pdf->SetFont('Arial','B',16);
$pdf->Cell(0,10, fpdf_text('Informe de Ventas - Los 3 Tanos'), 0, 1, 'C');
$pdf->Ln(4);

// Section renderer
function render_section($pdf, $title) {
	$pdf->SetFont('Arial','B',12);
	$pdf->Cell(0,7, fpdf_text($title), 0, 1);
	$pdf->SetFont('Arial','',11);
}

// Ventas Totales
render_section($pdf, 'Ganancias Totales');
$total = isset($data['ventasTotales'][0]['total_ventas']) ? $data['ventasTotales'][0]['total_ventas'] : '0';
$pdf->Cell(0,6, fpdf_text('Ingresos Totales a la Fecha: $' . $total), 0, 1);
$pdf->Ln(3);

// Ventas por Camarero
render_section($pdf, 'Ganancias Por Camarero');
if (!empty($data['ventasPorCamarero'])) {
	foreach ($data['ventasPorCamarero'] as $row) {
		$name = isset($row['personal_nombre']) ? $row['personal_nombre'] : '';
		$totalv = isset($row['total']) ? $row['total'] : '';
		$pdf->Cell(0,6, fpdf_text("- {$name} : {$totalv}"), 0, 1);
	}
} else {
	$pdf->Cell(0,6, fpdf_text('No hay datos.'), 0, 1);
}
$pdf->Ln(3);

// Ventas por Cliente
render_section($pdf, 'Ganancias Por Cliente');
if (!empty($data['ventasPorCliente'])) {
	foreach ($data['ventasPorCliente'] as $row) {
		$name = isset($row['cliente_nombre']) ? $row['cliente_nombre'] : (isset($row['cliente_id']) ? $row['cliente_id'] : '');
		$totalv = isset($row['total']) ? $row['total'] : '';
		$pdf->Cell(0,6, fpdf_text("- {$name} : {$totalv}"), 0, 1);
	}
} else {
	$pdf->Cell(0,6, fpdf_text('No hay datos.'), 0, 1);
}
$pdf->Ln(3);

// Ventas por Fecha
render_section($pdf, 'Ganancias Por Fecha');
if (!empty($data['ventasPorFecha'])) {
	foreach ($data['ventasPorFecha'] as $row) {
		$fecha = isset($row['fecha']) ? $row['fecha'] : '';
		$totalv = isset($row['total']) ? $row['total'] : '';
		$pdf->Cell(0,6, fpdf_text("- {$fecha} : {$totalv}"), 0, 1);
	}
} else {
	$pdf->Cell(0,6, fpdf_text('No hay datos.'), 0, 1);
}
$pdf->Ln(3);

// Ventas por Pago
render_section($pdf, 'Ganancias Por Pago');
if (!empty($data['ventasPorPago'])) {
	foreach ($data['ventasPorPago'] as $row) {
		$pago = isset($row['pedido_pago']) ? $row['pedido_pago'] : '';
		$totalv = isset($row['total']) ? $row['total'] : '';
		$pdf->Cell(0,6, fpdf_text("- {$pago} : {$totalv}"), 0, 1);
	}
} else {
	$pdf->Cell(0,6, fpdf_text('No hay datos.'), 0, 1);
}
$pdf->Ln(3);

// Ventas por Producto
render_section($pdf, 'Ganancias Por Producto');
if (!empty($data['ventasPorProducto'])) {
	foreach ($data['ventasPorProducto'] as $row) {
		$prod = isset($row['producto_nombre']) ? $row['producto_nombre'] : '';
		$totalv = isset($row['total']) ? $row['total'] : '';
		$pdf->Cell(0,6, fpdf_text("- {$prod} : {$totalv}"), 0, 1);
	}
} else {
	$pdf->Cell(0,6, fpdf_text('No hay datos.'), 0, 1);
}
$pdf->Ln(3);

// No Shows Por Cliente
render_section($pdf, 'No Shows Por Cliente');
if (!empty($data['noShowPorCliente'])) {
	foreach ($data['noShowPorCliente'] as $row) {
		$cliente = isset($row['cliente_id']) ? $row['cliente_id'] : '';
		$no = isset($row['no_shows']) ? $row['no_shows'] : '';
		$pdf->Cell(0,6, fpdf_text("- {$cliente} : {$no}"), 0, 1);
	}
} else {
	$pdf->Cell(0,6, fpdf_text('No hay datos.'), 0, 1);
}
$pdf->Ln(3);

// No Shows Por Fecha
render_section($pdf, 'No Shows Por Fecha');
if (!empty($data['noShowPorFecha'])) {
	foreach ($data['noShowPorFecha'] as $row) {
		$fecha = isset($row['no_show_fecha']) ? $row['no_show_fecha'] : '';
		$no = isset($row['no_shows']) ? $row['no_shows'] : '';
		$pdf->Cell(0,6, fpdf_text("- {$fecha} : {$no}"), 0, 1);
	}
} else {
	$pdf->Cell(0,6, fpdf_text('No hay datos.'), 0, 1);
}

// Clear output buffers to avoid header issues
if (ob_get_length()) {
	@ob_end_clean();
}

// Force download
$pdf->Output('D', 'informe_ventas.pdf');

?>