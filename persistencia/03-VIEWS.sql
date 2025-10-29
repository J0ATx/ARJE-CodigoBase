USE lostrestanosdb;

CREATE VIEW Ventas_Totales AS
SELECT SUM(pedido_monto) AS total_ventas
FROM Pedido
WHERE pedido_estado = 'Pagado';

CREATE VIEW Ventas_Por_Cliente AS
SELECT cliente_id, cliente_nombre, SUM(pedido_monto) AS total
FROM  Pedido JOIN Efectua USING (pedido_id)
JOIN Cliente USING (cliente_id)
WHERE pedido_estado = 'Pagado'
GROUP BY cliente_id
ORDER BY total DESC;

CREATE VIEW Ventas_Por_Camarero AS
SELECT personal_id, personal_nombre, SUM(pedido_monto) AS total
FROM  Pedido JOIN Personal USING (personal_id)
WHERE pedido_estado = 'Pagado'
GROUP BY personal_id
ORDER BY total DESC;

CREATE VIEW Ventas_Por_Producto AS
SELECT producto_id, producto_nombre, SUM(pedido_monto) AS total
FROM  Pedido JOIN Contiene USING (pedido_id)
JOIN Producto USING (producto_id)
WHERE pedido_estado = 'Pagado'
GROUP BY producto_id
ORDER BY total DESC;

CREATE VIEW Ventas_Por_Pago AS
SELECT pedido_pago, SUM(pedido_monto) AS total
FROM  Pedido
WHERE pedido_estado = 'Pagado'
GROUP BY pedido_pago
ORDER BY total DESC;

CREATE VIEW Ventas_Por_Fecha AS
SELECT DATE(pedido_fecha) AS fecha, SUM(pedido_monto) AS total
FROM  Pedido
WHERE pedido_estado = 'Pagado'
GROUP BY pedido_fecha
ORDER BY total DESC;

CREATE VIEW No_Show_Por_Cliente AS
SELECT cliente_id, COUNT(*) AS no_shows
FROM No_Show
GROUP BY cliente_id
ORDER BY no_shows DESC;

CREATE VIEW No_Show_Por_Fecha AS
SELECT no_show_fecha, COUNT(*) AS no_shows
FROM No_Show
GROUP BY no_show_fecha
ORDER BY no_shows DESC;

CREATE VIEW Datos_Usuarios AS
SELECT
    cliente_id AS usuario_id,
    cliente_id_img AS usuario_img,
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
    personal_id_img AS usuario_img,
    personal_nombre AS usuario_nombre,
    personal_apellido AS usuario_apellido,
    personal_telefono AS usuario_telefono,
    personal_calificacion AS usuario_calificacion,
    NULL AS usuario_platillo_favorito,
    FALSE AS usuario_fidelizado,
    personal_rol AS usuario_rol
FROM Personal;