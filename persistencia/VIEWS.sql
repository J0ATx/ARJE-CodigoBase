USE lostrestanosdb;

CREATE VIEW Ventas_Totales AS
SELECT SUM(pedido_monto) AS total_ventas
FROM Pedido;

-- CREATE VIEW Ventas_Por_Cliente AS
-- SELECT cliente_id, cliente_nombre, SUM(pedido_monto)
-- FROM  Pedido JOIN Efectua JOIN Cliente USING (pedido_id, cliente_id)
-- WHERE pedido_estado = 'Pagado'
-- GROUP BY cliente_id;

CREATE VIEW Ventas_Por_Camarero AS
SELECT personal_id, personal_nombre, SUM(pedido_monto)
FROM  Pedido JOIN Personal USING (personal_id)
WHERE pedido_estado = 'Pagado'
GROUP BY personal_id;

-- CREATE VIEW Ventas_Por_Producto AS
-- SELECT producto_id, producto_nombre, SUM(pedido_monto)
-- FROM  Pedido JOIN Contiene JOIN Producto USING (pedido_id, producto_id)
-- WHERE pedido_estado = 'Pagado'
-- GROUP BY producto_id;

CREATE VIEW Ventas_Por_Pago AS
SELECT SUM(pedido_monto)
FROM  Pedido
WHERE pedido_estado = 'Pagado'
GROUP BY pedido_pago;

CREATE VIEW Ventas_Por_Fecha AS
SELECT SUM(pedido_monto) AS total_ventas, DATE(pedido_fecha) AS fecha
FROM  Pedido
WHERE pedido_estado = 'Pagado'
GROUP BY pedido_fecha;

CREATE VIEW Tiempo_Promedio AS
SELECT AVG(producto_tiempo_preparacion) AS tiempo_promedio
FROM Producto;

CREATE VIEW No_Show_Por_Cliente AS
SELECT cliente_id, COUNT(*) AS no_show_count
FROM No_Show
GROUP BY cliente_id;

CREATE VIEW No_Show_Por_Fecha AS
SELECT COUNT(*) AS no_show_count
FROM No_Show
GROUP BY no_show_fecha;

-- CREATE VIEW Registros_Por_Fecha AS
-- SELECT COUNT(*) AS total_registros, DATE(cliente_fecha_registro) AS fecha
-- FROM Cliente
-- GROUP BY cliente_fecha_registro;

-- porcentaje de inactividad, se regsitro y no hizo nada

CREATE VIEW Datos_Usuarios AS
SELECT
    cliente_id AS usuario_id,
    cliente_nombre AS usuario_nombre,
    cliente_apellido AS usuario_apellido,
    cliente_telefono AS usuario_telefono,
    cliente_calificacion AS usuario_calificacion,
    cliente_platillo_favorito AS usuario_platillo_favorito,
    cliente_fidelizado AS usuario_fidelizado,
    'Cliente' AS usuario_rol
FROM Cliente
UNION ALL
SELECT
    personal_id AS usuario_id,
    personal_nombre AS usuario_nombre,
    personal_apellido AS usuario_apellido,
    personal_telefono AS usuario_telefono,
    personal_calificacion AS usuario_calificacion,
    NULL AS usuario_platillo_favorito,
    NULL AS usuario_fidelizado,
    personal_rol AS usuario_rol
FROM Personal;