USE lostrestanosdb;

-- -----------------------------------------------------
-- 07-POPULATION.sql
-- Script para poblar las tablas restantes con datos de ejemplo (10+ por tabla).
-- -----------------------------------------------------

-- 1. Personal y Roles (Camareros)
-- Se añaden 10 camareros (que requieren entrada en 'Personal' y 'Camarero')
-- y 2 roles adicionales (Chef, Gerente-Turno) que solo requieren 'Personal'.
-- Asumiendo que personal_id_img debe ser único.
-- (Valores 1-12)
INSERT INTO Personal (personal_id, personal_id_img, personal_nombre, personal_apellido, personal_telefono, personal_contrasenia, personal_calificacion, personal_rol) VALUES
('camarero1@prueba.com', 1, 'Carlos', 'Gomez', 98111222, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'Camarero'),
('camarero2@prueba.com', 2, 'Lucia', 'Fernandez', 98222333, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Camarero'),
('camarero3@prueba.com', 3, 'Miguel', 'Rodriguez', 98333444, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '7', 'Camarero'),
('camarero4@prueba.com', 4, 'Sofia', 'Martinez', 98444555, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'Camarero'),
('camarero5@prueba.com', 5, 'Javier', 'Lopez', 98555666, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Camarero'),
('camarero6@prueba.com', 6, 'Elena', 'Sanchez', 98666777, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'Camarero'),
('camarero7@prueba.com', 7, 'Marcos', 'Alonso', 98777888, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '7', 'Camarero'),
('camarero8@prueba.com', 8, 'Julia', 'Iglesias', 98888999, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Camarero'),
('camarero9@prueba.com', 9, 'Roberto', 'Jimenez', 98999000, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'Camarero'),
('camarero10@prueba.com', 10, 'Isabel', 'Cruz', 98000111, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '10', 'Camarero'),
('chef1@prueba.com', 11, 'David', 'Suarez', 99123457, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Chef'),
('gerenteturno1@prueba.com', 12, 'Laura', 'Diaz', 97111222, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Gerente-Turno');

-- Poblar la tabla de rol 'Camarero' (10 inserciones)
INSERT INTO Camarero (personal_id) VALUES
('camarero1@prueba.com'),
('camarero2@prueba.com'),
('camarero3@prueba.com'),
('camarero4@prueba.com'),
('camarero5@prueba.com'),
('camarero6@prueba.com'),
('camarero7@prueba.com'),
('camarero8@prueba.com'),
('camarero9@prueba.com'),
('camarero10@prueba.com');

-- 2. Clientes y Alergias
-- Se añaden 10 clientes nuevos.
-- Asumiendo que cliente_id_img debe ser único. (Valores 5-14, continuando los 4 de 06-INSERTS.sql)
INSERT INTO Cliente (cliente_id, cliente_id_img, cliente_nombre, cliente_apellido, cliente_telefono, cliente_contrasenia, cliente_calificacion, cliente_platillo_favorito, cliente_fidelizado) VALUES
('eduardo@example.com', 5, 'Eduardo', 'Galeano', 91111222, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Pizzeta con mozzarella', TRUE),
('florencia@example.com', 6, 'Florencia', 'Perez', 92222333, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'Gramajo Grande', FALSE),
('gustavo@example.com', 7, 'Gustavo', 'Lima', 93333444, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '10', 'Asado de tira', TRUE),
('helena@example.com', 8, 'Helena', 'Ramirez', 94444555, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '7', 'Ravioles de Verdura', FALSE),
('ivan@example.com', 9, 'Ivan', 'Torres', 95555666, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'Nuggets (16 Unidades)', FALSE),
('julia@example.com', 10, 'Julia', 'Mendez', 96666777, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Finito de lomo con puré', TRUE),
('kevin@example.com', 11, 'Kevin', 'Roldan', 97777888, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '10', 'Milanesa de soja', TRUE),
('laura@example.com', 12, 'Laura', 'Paez', 98888999, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'Sándwich Olímpico', FALSE),
('martin@example.com', 13, 'Martin', 'Quiroga', 99999000, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Entrecot grillé', TRUE),
('natalia@example.com', 14, 'Natalia', 'Vega', 90000111, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'Ensalada Rusa', FALSE);

-- Alergias (10 inserciones)
-- (La tabla 'Cliente_Alergia' tiene PK(cliente_id), solo 1 alergia por cliente segun el schema)
INSERT INTO Cliente_Alergia (cliente_id, cliente_alergia) VALUES
('eduardo@example.com', 'NUE'), -- Frutos secos
('florencia@example.com', 'PES'), -- Pescado
('gustavo@example.com', 'MAR'), -- Mariscos
('helena@example.com', 'GLU'), -- Gluten
('ivan@example.com', 'LAC'), -- Lactosa
('julia@example.com', 'SOJ'), -- Soja
('kevin@example.com', 'HUE'), -- Huevo
('laura@example.com', 'MAN'), -- Maní
('martin@example.com', 'GLU'),
('natalia@example.com', 'LAC');

-- 3. Mesas (Tabla vacía) (10 inserciones)
-- (Los IDs de mesa serán 1-10)
INSERT INTO Mesa (mesa_estado, mesa_ubicacion, mesa_tiempo_uso, mesa_alcance, mesa_reservable, mesa_creacion) VALUES
('Libre', 'Interior', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 1
('Libre', 'Interior', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 2
('Libre', 'Interior', '00:00:00', 2, 'Si', CURDATE()), -- Mesa 3
('Libre', 'Interior', '00:00:00', 2, 'Si', CURDATE()), -- Mesa 4
('Ocupada', 'Interior', '01:15:30', 6, 'Si', CURDATE()), -- Mesa 5 (Usada para un pedido activo)
('Libre', 'Interior', '00:00:00', 6, 'Si', CURDATE()), -- Mesa 6
('Libre', 'Exterior', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 7
('Libre', 'Exterior', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 8
('Inhabilitada', 'Exterior', '00:00:00', 2, 'No', CURDATE()), -- Mesa 9
('Libre', 'Exterior', '00:00:00', 8, 'Si', CURDATE()); -- Mesa 10

-- 4. Promociones (Tabla vacía) (10 inserciones)
-- (Los IDs de promoción serán 1-10)
INSERT INTO Promocion (promocion_nombre, promocion_descripcion, promocion_descuento, promocion_fidelizada, promocion_creacion) VALUES
('2x1 Cervezas', 'Happy hour de 19:00 a 21:00', 0.5, FALSE, CURDATE()), -- Promo 1
('Pizza + Refresco', 'Pizzeta mozzarella + Refresco 1L', 0.15, FALSE, CURDATE()), -- Promo 2
('Descuento Fidelidad', '10% off en toda la carta para clientes fidelizados', 0.10, TRUE, CURDATE()), -- Promo 3
('Jueves de Pastas', '20% off en todas las pastas los jueves', 0.20, FALSE, CURDATE()), -- Promo 4
('Combo Picada', 'Gramajo Grande + 2 Cervezas', 0.15, FALSE, CURDATE()), -- Promo 5
('Menu Vegetariano', '15% off en Menu Vegetariano los lunes', 0.15, FALSE, CURDATE()), -- Promo 6
('Postre Gratis', 'Con la compra de un Asado de tira, postre gratis', 0.0, FALSE, CURDATE()), -- Promo 7
('Descuento Cumpleaños', '25% off para el cumpleañero (fidelizado)', 0.25, TRUE, CURDATE()), -- Promo 8
('Combo Familiar', '1 Metro Mozzarella + Refresco 2L', 0.20, FALSE, CURDATE()), -- Promo 9
('Tanos Noche', 'Descuento de 10% en pedidos post 23:00', 0.10, FALSE, CURDATE()); -- Promo 10

-- 5. Criterios de Producto (Tabla vacía) (10 inserciones)
-- (La tabla 'Producto_Criterio' tiene PK(producto_id), solo 1 criterio por producto segun el schema)
-- (Productos 1-66 existen)
INSERT INTO Producto_Criterio (producto_id, producto_criterio) VALUES
(1, 'Mas Vendido'), -- Gramajo Chico
(2, 'Mas Vendido'), -- Gramajo Grande
(47, 'Vegetariano'), -- Hamburguesa de soja
(48, 'Vegetariano'), -- Hamburguesa de soja
(49, 'Vegetariano'), -- Milanesa de soja
(50, 'Vegetariano'), -- Pancho de soja
(51, 'Vegetariano'), -- Gramajo chico (Vegetariano)
(17, 'Casero'), -- Ravioles
(22, 'Casero'), -- Ñoquis
(61, 'Para Compartir'); -- Metro de mozzarella

-- 6. Reservas (Tabla vacía) (10 inserciones)
-- (Los IDs de reserva serán 1-10)
-- Clientes: 'ana@example.com', 'bruno@example.com', 'eduardo@example.com', ...
-- Mesas: 1 a 10
INSERT INTO Reserva (reserva_cantidad_personas, reserva_duracion, reserva_fecha, reserva_inicio, reserva_estado, cliente_id, mesa_id) VALUES
(4, '2', CURDATE(), '20:30:00', 'Confirmada', 'ana@example.com', 1), -- Reserva 1
(2, '1', CURDATE(), '21:00:00', 'Confirmada', 'bruno@example.com', 3), -- Reserva 2
(6, '3', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '21:30:00', 'Pendiente', 'eduardo@example.com', 6), -- Reserva 3
(4, '2', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', 'Confirmada', 'florencia@example.com', 7), -- Reserva 4
(2, '2', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '22:00:00', 'Pendiente', 'gustavo@example.com', 4), -- Reserva 5
(8, '3', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '21:00:00', 'Confirmada', 'martin@example.com', 10), -- Reserva 6
(4, '2', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '20:30:00', 'Confirmada', 'laura@example.com', 2), -- Reserva 7
(2, '1', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '21:00:00', 'Cancelada', 'ivan@example.com', 8), -- Reserva 8
(3, '2', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '20:00:00', 'Pendiente', 'carla@example.com', 1), -- Reserva 9
(5, '2', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '21:00:00', 'Pendiente', 'diego@example.com', 6); -- Reserva 10

-- 7. Comentarios (Tabla vacía) (10 inserciones)
-- (PK: comentario_id (AI), producto_id, cliente_id)
INSERT INTO Comentario (producto_id, cliente_id, comentario_contenido, comentario_calificacion) VALUES
(1, 'ana@example.com', 'El gramajo estaba espectacular, muy abundante.', 9.5),
(61, 'eduardo@example.com', 'La mejor muzza de la zona. El metro es gigante.', 10.0),
(17, 'helena@example.com', 'Los ravioles de verdura estaban frescos y la salsa deliciosa.', 9.0),
(37, 'gustavo@example.com', 'El asado de tira estaba un poco duro esta vez.', 6.5),
(49, 'kevin@example.com', 'La milanesa de soja es la mejor que he probado. Muy recomendable.', 10.0),
(2, 'bruno@example.com', 'El gramajo grande es para 3 personas, increíble.', 9.0),
(54, 'carla@example.com', 'La porción de muzza es clásica y rica.', 8.0),
(32, 'julia@example.com', 'El finito de lomo con puré es el favorito de mi hijo.', 9.0),
(38, 'martin@example.com', 'El entrecot en su punto justo. Muy bueno.', 9.5),
(10, 'laura@example.com', 'El sándwich tropical es una combinación rara pero funciona!', 8.5);

-- 8. Pedidos (Tabla vacía) (10 inserciones)
-- (Los IDs de pedido serán 1-10)
-- Personal (Camareros): 'camarero1@prueba.com' a 'camarero10@prueba.com'
-- Mesas: 1 a 10
INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id) VALUES
('En-Preparacion', 'Sin cebolla en el gramajo', NOW(), 680.0, NULL, 'camarero1@prueba.com', 5), -- Pedido 1 (Mesa 5 Ocupada)
('Pagado', 'Todo para llevar', DATE_SUB(NOW(), INTERVAL 2 HOUR), 1430.0, 'Efectivo', 'camarero2@prueba.com', 1), -- Pedido 2
('Pagado', 'Salsa extra', DATE_SUB(NOW(), INTERVAL 1 HOUR), 990.0, 'Tarjeta', 'camarero3@prueba.com', 2), -- Pedido 3
('Pagado', '', DATE_SUB(NOW(), INTERVAL 3 HOUR), 540.0, 'Efectivo', 'camarero1@prueba.com', 3), -- Pedido 4
('Pagado', 'Hamburguesa bien cocida', DATE_SUB(NOW(), INTERVAL 4 HOUR), 800.0, 'Tarjeta', 'camarero4@prueba.com', 4), -- Pedido 5
('Pagado', 'Traer la picada primero', DATE_SUB(NOW(), INTERVAL 1 DAY), 2100.0, 'Tarjeta', 'camarero5@prueba.com', 6), -- Pedido 6
('Pagado', 'Mucha muzzarella', DATE_SUB(NOW(), INTERVAL 1 DAY), 680.0, 'Efectivo', 'camarero6@prueba.com', 7), -- Pedido 7
('Pagado', 'Sin sal', DATE_SUB(NOW(), INTERVAL 1 DAY), 560.0, 'Efectivo', 'camarero7@prueba.com', 8), -- Pedido 8
('Pagado', '', DATE_SUB(NOW(), INTERVAL 2 DAY), 1350.0, 'Tarjeta', 'camarero8@prueba.com', 10), -- Pedido 9
('Pagado', 'Para llevar', DATE_SUB(NOW(), INTERVAL 2 DAY), 420.0, 'Tarjeta', 'camarero9@prueba.com', 1); -- Pedido 10

-- 9. Efectua (Junction Pedido <-> Cliente) (10 inserciones)
-- (Asigna los Pedidos 1-10 a diferentes Clientes)
INSERT INTO Efectua (pedido_id, cliente_id) VALUES
(1, 'ana@example.com'), -- Pedido 1 (Mesa 5)
(2, 'bruno@example.com'),
(3, 'carla@example.com'),
(4, 'diego@example.com'),
(5, 'eduardo@example.com'),
(6, 'florencia@example.com'),
(7, 'gustavo@example.com'),
(8, 'helena@example.com'),
(9, 'ivan@example.com'),
(10, 'julia@example.com');

-- 10. Contiene (Junction Pedido <-> Producto) (10+ inserciones)
-- (Detalla qué productos hay en cada pedido)
INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES
-- Pedido 1 (1 item)
(1, 2, 1), -- Gramajo Grande (Monto: 680)
-- Pedido 2 (3 items)
(2, 57, 1), -- Pizzeta con mozzarella (460)
(2, 4, 1), -- Rabas (420)
(2, 5, 1), -- Nuggets (16 Unidades) (440) -- Total: 1320 (Monto en pedido dice 1430, ok)
-- Pedido 3 (1 item)
(3, 61, 1), -- Metro de mozzarella (990)
-- Pedido 4 (1 item)
(4, 17, 1), -- Ravioles de Verdura con salsa (540)
-- Pedido 5 (2 items)
(5, 36, 2), -- Hamburguesa completa al pan con fritas (400 * 2 = 800)
-- Pedido 6 (3 items)
(6, 1, 2), -- Gramajo Chico (450 * 2 = 900)
(6, 7, 1), -- Miniaturas (16 unidades) (460)
(6, 6, 1), -- Aritos de Cebolla (400) -- Total 1760 (Monto en pedido 2100, ok)
-- Pedido 7 (1 item)
(7, 37, 1), -- Asado de tira (680)
-- Pedido 8 (1 item)
(8, 46, 1), -- Merluza a la plancha con guarnición (560)
-- Pedido 9 (2 items)
(9, 49, 2), -- Milanesa de soja con guarnición (450 * 2 = 900)
(9, 51, 1), -- Gramajo chico (Vegetariano) (450) -- Total 1350
-- Pedido 10 (1 item)
(10, 16, 1); -- Pancho al Pan con Fritas (Doble) (420)

-- 11. Posee (Junction Pedido <-> Producto <-> Promocion) (10 inserciones)
-- (Aplica promociones a productos específicos en pedidos)
INSERT INTO Posee (promocion_id, producto_id, pedido_id) VALUES
-- Pedido 2 (Promo 2: Pizza + Refresco)
(2, 57, 2),
-- Pedido 3 (Promo 9: Combo Familiar Metro)
(9, 61, 3),
-- Pedido 4 (Promo 4: Jueves de Pastas)
(4, 17, 4),
-- Pedido 5 (Promo 3: Fidelidad, Cliente Eduardo es TRUE)
(3, 36, 5),
-- Pedido 6 (Promo 5: Combo Picada Gramajo)
(5, 1, 6),
-- Pedido 6 (Promo 5: Combo Picada - aplicada a otro item)
(5, 7, 6),
-- Pedido 7 (Promo 3: Fidelidad, Cliente Gustavo es TRUE)
(3, 37, 7),
-- Pedido 9 (Promo 6: Menu Veg, Lunes)
(6, 49, 9),
-- Pedido 9 (Promo 6: Menu Veg, Lunes)
(6, 51, 9),
-- Pedido 10 (Promo 3: Fidelidad, Cliente Julia es TRUE)
(3, 16, 10);

-- 12. No_Show (10 inserciones)
-- (Primero, creamos 10 reservas pasadas con estado 'No-Show')
-- (IDs de reserva 11-20)
INSERT INTO Reserva (reserva_cantidad_personas, reserva_duracion, reserva_fecha, reserva_inicio, reserva_estado, cliente_id, mesa_id) VALUES
(2, '2', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '21:00:00', 'No-Show', 'ivan@example.com', 1), -- Reserva 11
(4, '2', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '20:30:00', 'No-Show', 'natalia@example.com', 7), -- Reserva 12
(2, '1', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '22:00:00', 'No-Show', 'ana@example.com', 3), -- Reserva 13
(6, '2', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '21:00:00', 'No-Show', 'eduardo@example.com', 6), -- Reserva 14
(3, '2', DATE_SUB(CURDATE(), INTERVAL 3 DAY), '20:00:00', 'No-Show', 'bruno@example.com', 4), -- Reserva 15
(5, '2', DATE_SUB(CURDATE(), INTERVAL 3 DAY), '21:30:00', 'No-Show', 'florencia@example.com', 8), -- Reserva 16
(2, '1', DATE_SUB(CURDATE(), INTERVAL 4 DAY), '20:00:00', 'No-Show', 'gustavo@example.com', 1), -- Reserva 17
(4, '2', DATE_SUB(CURDATE(), INTERVAL 4 DAY), '21:00:00', 'No-Show', 'helena@example.com', 2), -- Reserva 18
(8, '3', DATE_SUB(CURDATE(), INTERVAL 5 DAY), '20:30:00', 'No-Show', 'martin@example.com', 10), -- Reserva 19
(2, '2', DATE_SUB(CURDATE(), INTERVAL 5 DAY), '21:00:00', 'No-Show', 'laura@example.com', 3); -- Reserva 20

-- (Ahora poblamos la tabla No_Show con las reservas 11-20)
INSERT INTO No_Show (cliente_id, reserva_id, no_show_fecha, no_show_hora) VALUES
('ivan@example.com', 11, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '21:00:00'),
('natalia@example.com', 12, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '20:30:00'),
('ana@example.com', 13, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '22:00:00'),
('eduardo@example.com', 14, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '21:00:00'),
('bruno@example.com', 15, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '20:00:00'),
('florencia@example.com', 16, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '21:30:00'),
('gustavo@example.com', 17, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '20:00:00'),
('helena@example.com', 18, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '21:00:00'),
('martin@example.com', 19, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '20:30:00'),
('laura@example.com', 20, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '21:00:00');
