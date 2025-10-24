-- Email: gerente@prueba.com
-- Contraseña: gerente123 (hasheada correctamente con password_hash)
INSERT INTO Personal (personal_nombre, personal_apellido, personal_contrasenia, personal_id, personal_telefono, personal_rol) VALUES ('Gerente', 'Prueba', '$2y$10$gy0d3tiaoPcx3J34cw2ia.4dV42Zea1VvGt75nqikQZGxDJpLtERy', 'gerente@prueba.com', 123456789, 'Gerente-General');
INSERT INTO Gerente_General (personal_id) VALUES ('gerente@prueba.com');

INSERT INTO Personal (personal_id, personal_nombre, personal_apellido, personal_telefono, personal_contrasenia, personal_calificacion, personal_rol) VALUES
('chefejecutivo@prueba.com', 'Chef', 'Ejecutivo', 99123456, 'hashed_password', '10', 'Chef-Ejecutivo');

INSERT INTO Chef_Ejecutivo (personal_id) VALUES
('chefejecutivo@prueba.com');

insert into Empresa (empresa_nombre, empresa_mision, empresa_vision, empresa_whatsapp, empresa_instagram, empresa_facebook, personal_id) VALUES ("Los 3 Tanos", "Vender buena comida", "Vender MÁS buena comida", "092412772", "los3tanos_pizzeria", "Pizzeria Los 3 Tanos | Atlántida", "gerente@prueba.com");
UPDATE empresa SET
           empresa_valores = "no comer, no matar"
            WHERE empresa_id = 1;
insert into empresa_telefono (empresa_id, empresa_telefono) VALUES ("1", "43729333");
insert into empresa_ubicacion (empresa_id, empresa_ciudad, empresa_calle) 
VALUES ("1", "Las Toscas", "M. Ferreira y Central");
INSERT INTO empresa_horario (empresa_id, empresa_dia, empresa_hora) 
VALUES 
	("1", "Martes", "19:00 - 00:00"), 
	("1", "Miércoles", "19:00 - 00:00"), 
    ("1", "Jueves", "19:00 - 00:00"),
    ("1", "Viernes", "19:00 - 00:00"),
    ("1", "Sábado", "12:00 - 16:00"),
    ("1", "Sábado", "19:00 - 00:00"),
    ("1", "Domingo", "12:00 - 16:00"),
    ("1", "Domingo", "19:00 - 00:00");


INSERT INTO Cliente (cliente_id, cliente_nombre, cliente_apellido)
VALUES
  ('ana@example.com',    'Ana',    'Suárez'),
  ('bruno@example.com',  'Bruno',  'Silva'),
  ('carla@example.com',  'Carla',  'Rodríguez'),
  ('diego@example.com',  'Diego',  'Fernández')
ON DUPLICATE KEY UPDATE cliente_nombre = VALUES(cliente_nombre), cliente_apellido = VALUES(cliente_apellido);

INSERT INTO Cliente_Alergia (cliente_id, cliente_alergia)
VALUES
  ('ana@example.com',   'GLU'),
  ('bruno@example.com', 'LAC')
ON DUPLICATE KEY UPDATE cliente_alergia = VALUES(cliente_alergia);

-- Stock
INSERT INTO Stock (stock_id, stock_nombre, stock_caducidad) VALUES
(1, 'Huevo', DATE_ADD(CURDATE(), INTERVAL 20 DAY)),
(2, 'Papas Fritas Congeladas', DATE_ADD(CURDATE(), INTERVAL 180 DAY)),
(3, 'Jamón', DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
(4, 'Cebolla', DATE_ADD(CURDATE(), INTERVAL 60 DAY)),
(5, 'Mozzarella', DATE_ADD(CURDATE(), INTERVAL 45 DAY)),
(6, 'Anillos de Calamar Rebozados', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(7, 'Nuggets de Pollo', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(8, 'Aros de Cebolla Empanizados', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(9, 'Pan de Sándwich', DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(10, 'Piña en Rodajas', DATE_ADD(CURDATE(), INTERVAL 365 DAY)),
(11, 'Tomate', DATE_ADD(CURDATE(), INTERVAL 15 DAY)),
(12, 'Morrón', DATE_ADD(CURDATE(), INTERVAL 20 DAY)),
(13, 'Aceitunas', DATE_ADD(CURDATE(), INTERVAL 45 DAY)),
(14, 'Panchos (Schneck)', DATE_ADD(CURDATE(), INTERVAL 40 DAY)),
(15, 'Panceta', DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
(16, 'Ricotta', DATE_ADD(CURDATE(), INTERVAL 15 DAY)),
(17, 'Espinaca', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(18, 'Pasta para Ravioles', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(19, 'Pasta para Tallarines', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(20, 'Papa para Ñoquis/Puré', DATE_ADD(CURDATE(), INTERVAL 60 DAY)),
(21, 'Lechuga', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(22, 'Zanahoria', DATE_ADD(CURDATE(), INTERVAL 25 DAY)),
(23, 'Arvejas', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(24, 'Mayonesa', DATE_ADD(CURDATE(), INTERVAL 60 DAY)),
(25, 'Carne de Hamburguesa', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(26, 'Pan de Hamburguesa', DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(27, 'Bife de Lomo Finito', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(28, 'Carne Asado de Tira', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(29, 'Chorizo', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(30, 'Entrecot', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(31, 'Suprema de Pollo', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(32, 'Costilla de Cerdo', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(33, 'Harina para Tortilla/Omelette', DATE_ADD(CURDATE(), INTERVAL 180 DAY)),
(34, 'Merluza Filete', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(35, 'Hamburguesa de Soja', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(36, 'Milanesa de Soja', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(37, 'Masa para Pizza', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(38, 'Salsa de Tomate para Pizza', DATE_ADD(CURDATE(), INTERVAL 30 DAY));

-- Stock_Cantidad
INSERT INTO Stock_Cantidad (stock_id, stock_cantidad, stock_medida) VALUES
(1, 120.000, 'u'),
(2, 50.000, 'kg'),
(3, 10.000, 'kg'),
(4, 5.000, 'kg'),
(5, 20.000, 'kg'),
(6, 10.000, 'kg'),
(7, 5.000, 'kg'),
(8, 5.000, 'kg'),
(9, 100.000, 'u'),
(10, 5.000, 'kg'),
(11, 7.500, 'kg'),
(12, 4.000, 'kg'),
(13, 2.000, 'kg'),
(14, 80.000, 'u'),
(15, 5.000, 'kg'),
(16, 10.000, 'kg'),
(17, 4.000, 'kg'),
(18, 15.000, 'kg'),
(19, 15.000, 'kg'),
(20, 30.000, 'kg'),
(21, 5.000, 'kg'),
(22, 5.000, 'kg'),
(23, 5.000, 'kg'),
(24, 5.000, 'L'),
(25, 60.000, 'u'),
(26, 60.000, 'u'),
(27, 15.000, 'kg'),
(28, 20.000, 'kg'),
(29, 10.000, 'u'),
(30, 15.000, 'kg'),
(31, 20.000, 'kg'),
(32, 10.000, 'kg'),
(33, 5.000, 'kg'),
(34, 15.000, 'kg'),
(35, 30.000, 'u'),
(36, 30.000, 'u'),
(37, 15.000, 'kg'),
(38, 10.000, 'kg');

-- Producto
INSERT INTO Producto (producto_id, producto_nombre, producto_precio, producto_receta, producto_tiempo_preparacion, producto_creacion, producto_categoria, personal_id) VALUES
(1, 'Gramajo Chico', 450.00, 'Huevo revuelto con papas, jamón y cebolla.', '15 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(2, 'Gramajo Grande', 680.00, 'Versión más grande del Gramajo Chico con ingredientes similares.', '20 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(3, 'Fritas con Salsa', 400.00, 'Papas fritas crujientes acompañadas con salsa.', '10 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(4, 'Rabas', 420.00, 'Anillos de calamar rebozados y fritos.', '12 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(5, 'Nuggets (16 Unidades)', 440.00, 'Porción de 16 nuggets de pollo fritos.', '10 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(6, 'Aritos de Cebolla', 400.00, 'Aros de cebolla empanizados y fritos.', '10 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(7, 'Miniaturas (16 unidades)', 460.00, 'Una picada con pescados y mariscos', '15 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(8, 'Sándwich Caliente', 290.00, 'Sandwich caliente clásico con fiambre y pan.', '5 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(9, 'Sándwich Caliente con Mozzarella', 340.00, 'Sandwich caliente con fiambre y mozzarella.', '7 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(10, 'Sándwich Tropical', 380.00, 'Sandwich con jamón, queso, y rodajas de piña.', '8 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(11, 'Sándwich Napolitano', 380.00, 'Sandwich con jamón, queso, tomate y morrón.', '8 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(12, 'Sándwich Olímpico', 300.00, 'Sandwich con jamón, queso, huevo duro y aceitunas.', '6 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(13, 'Sándwich Napolitano Tropical', 420.00, 'Sándwich Napolitano con adición de piña.', '10 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(14, 'Pancho al Pan (Schneck)', 140.00, 'Pancho clásico con salchicha tipo schneck.', '5 min', CURDATE(), 'Panchos', 'chefejecutivo@prueba.com'),
(15, 'Pancho al Pan con Muzzarella y Panceta', 180.00, 'Pancho con salchicha, mozzarella y panceta.', '7 min', CURDATE(), 'Panchos', 'chefejecutivo@prueba.com'),
(16, 'Pancho al Pan con Fritas (Doble)', 420.00, 'Doble pancho con mozzarella, jamón, huevo y fritas.', '10 min', CURDATE(), 'Panchos', 'chefejecutivo@prueba.com'),
(17, 'Ravioles de Verdura con salsa', 540.00, 'Ravioles rellenos de verduras con salsa a elección.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(18, 'Ravioles de Ricotta con salsa', 540.00, 'Ravioles rellenos de ricotta con salsa a elección.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(19, 'Tallarines (morrón, huevo, albahaca) con salsa', 420.00, 'Pasta fresca con morrón, huevo y albahaca, con salsa.', '18 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(20, 'Sorrentinos de jamón y muzzarella con salsa', 540.00, 'Sorrentinos de jamón y mozzarella con salsa.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(21, 'Sorrentinos de espinaca y ricotta con salsa', 540.00, 'Sorrentinos de espinaca y ricotta con salsa.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(22, 'Ñoquis de papa con salsa', 420.00, 'Ñoquis caseros de papa con salsa a elección.', '18 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(23, 'Fritas (Porción)', 270.00, 'Porción individual de papas fritas.', '10 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(24, 'Noisette', 300.00, 'Porción de papas noisette (pequeñas y redondas).', '10 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(25, 'Ensalada Mixta', 270.00, 'Lechuga, tomate, cebolla y zanahoria.', '5 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(26, 'Ensalada Rusa', 270.00, 'Papa, zanahoria, arvejas y mayonesa.', '10 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(27, 'Puré de Papas', 250.00, 'Puré cremoso de papas.', '15 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(28, 'Hamburguesa con Fritas (plato o pan)', 300.00, 'Hamburguesa sencilla con papas fritas.', '10 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(29, 'Pancho con Fritas (Menú Pequeño)', 300.00, 'Pancho con salchicha y papas fritas.', '10 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(30, 'Nuggets con Fritas (Menú Pequeño)', 380.00, 'Nuggets de pollo con papas fritas.', '10 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(31, 'Hamburguesa (schneck) al pan con fritas', 380.00, 'Hamburguesa con jamón y mozzarella, acompañada con fritas.', '10 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(32, 'Finito de lomo con puré', 400.00, 'Bife finito de lomo con puré de papas.', '20 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(33, 'Miniaturas (Menú Pequeño)', 400.00, 'Porción de miniaturas para picar.', '15 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(34, 'Hamburguesa con fritas (lechuga/tomate)', 320.00, 'Hamburguesa clásica con lechuga y tomate con papas fritas.', '10 min', CURDATE(), 'Hamburguesas', 'chefejecutivo@prueba.com'),
(35, 'Hamburguesa completa al plato con fritas', 400.00, 'Hamburguesa con ingredientes adicionales servida en plato con fritas.', '15 min', CURDATE(), 'Hamburguesas', 'chefejecutivo@prueba.com'),
(36, 'Hamburguesa completa al pan con fritas', 400.00, 'Hamburguesa completa servida en pan con papas fritas.', '15 min', CURDATE(), 'Hamburguesas', 'chefejecutivo@prueba.com'),
(37, 'Asado de tira, 1 chorizo + guarnición', 680.00, 'Corte de carne asada con chorizo y guarnición a la plancha.', '30 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(38, 'Entrecot grillé con guarnición', 550.00, 'Entrecot a la parrilla con guarnición.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(39, 'Entrecot grillé con guarnición y salsa', 650.00, 'Entrecot a la parrilla con guarnición y salsa.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(40, 'Suprema grillé con guarnición', 550.00, 'Suprema de pollo a la parrilla con guarnición.', '20 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(41, 'Suprema grillé con guarnición y salsa', 650.00, 'Suprema de pollo a la parrilla con guarnición y salsa.', '20 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(42, 'Costilla a la Riojana con guarnición', 650.00, 'Costillas cocinadas al estilo riojano con guarnición.', '30 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(43, 'Tortilla de papa (con mixta)', 400.00, 'Tortilla de papa tradicional con ensalada mixta.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(44, 'Tortilla a la española (con mixta)', 450.00, 'Tortilla española con ensalada mixta.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(45, 'Omelette con mixta', 360.00, 'Omelette servido con ensalada mixta.', '10 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(46, 'Merluza a la plancha con guarnición', 560.00, 'Filete de merluza a la plancha con guarnición.', '20 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(47, 'Hamburguesa de soja al pan con guarnición', 340.00, 'Hamburguesa vegetariana de soja en pan con guarnición.', '15 min', CURDATE(), 'Menú Vegetariano', 'chefejecutivo@prueba.com'),
(48, 'Hamburguesa de soja al plato con guarnición', 400.00, 'Hamburguesa vegetariana de soja en plato con guarnición.', '15 min', CURDATE(), 'Menú Vegetariano', 'chefejecutivo@prueba.com'),
(49, 'Milanesa de soja con guarnición', 450.00, 'Milanesa vegetariana de soja con guarnición.', '20 min', CURDATE(), 'Menú Vegetariano', 'chefejecutivo@prueba.com'),
(50, 'Pancho de soja', 115.00, 'Pancho vegetariano con salchicha de soja.', '5 min', CURDATE(), 'Menú Vegetariano', 'chefejecutivo@prueba.com'),
(51, 'Gramajo chico (Vegetariano)', 450.00, 'Gramajo chico sin carne.', '15 min', CURDATE(), 'Menú Vegetariano', 'chefejecutivo@prueba.com'),
(52, 'Porción al tomate', 150.00, 'Porción de pizza solo con salsa de tomate.', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(53, 'Porción al tomate con gusto', 220.00, 'Porción de pizza con tomate y un gusto extra.', '12 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(54, 'Porción de muzzarella', 290.00, 'Porción de pizza con mozzarella.', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(55, 'Porción de muzzarella con gusto', 280.00, 'Porción de pizza con mozzarella y un gusto extra.', '12 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(56, 'Pizzeta al tomate', 360.00, 'Pizza pequeña con salsa de tomate.', '15 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(57, 'Pizzeta con mozzarella', 460.00, 'Pizza pequeña con mozzarella.', '18 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(58, 'Pizzeta con mozzarella con gusto', 590.00, 'Pizza pequeña con mozzarella y un gusto extra.', '20 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(59, '1/2 metro de mozzarella', 580.00, 'Medio metro de pizza con mozzarella.', '20 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(60, '1/4 metro de mozzarella con gusto', 450.00, 'Cuarto de metro de pizza con mozzarella y un gusto.', '15 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(61, 'Metro de mozzarella', 990.00, 'Un metro de pizza con mozzarella.', '25 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(62, 'Metro de mozzarella con gusto', 1290.00, 'Un metro de pizza con mozzarella y un gusto extra.', '28 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(63, 'Porción de fainá', 150.00, 'Porción de fainá simple.', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(64, 'Porción de fainá con mozzarella', 210.00, 'Porción de fainá con mozzarella.', '12 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(65, 'Porción figazza', 210.00, 'Porción de pizza figazza (cebolla).', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(66, 'Porción de fugazzeta', 280.00, 'Porción de fugazzeta (cebolla y queso).', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com');

INSERT INTO Consume (producto_id, stock_id, consume_cantidad, consume_medida) VALUES
-- Para Picar (1-7)
(1, 1, 2.0, 'u'), (1, 2, 0.150, 'kg'), (1, 3, 0.050, 'kg'), (1, 4, 0.020, 'kg'), -- Gramajo Chico
(2, 1, 3.0, 'u'), (2, 2, 0.300, 'kg'), (2, 3, 0.100, 'kg'), (2, 4, 0.040, 'kg'), -- Gramajo Grande
(3, 2, 0.250, 'kg'), -- Fritas con Salsa
(4, 6, 0.150, 'kg'), -- Rabas
(5, 7, 16.0, 'u'), -- Nuggets (16)
(6, 8, 0.150, 'kg'), -- Aritos de Cebolla
(7, 7, 8.0, 'u'), (7, 6, 0.080, 'kg'), -- Miniaturas (Mix de Nuggets y Rabas)

-- Sándwiches (8-13)
(8, 9, 2.0, 'u'), (8, 3, 0.050, 'kg'), (8, 5, 0.050, 'kg'), -- Sándwich Caliente
(9, 9, 2.0, 'u'), (9, 3, 0.050, 'kg'), (9, 5, 0.100, 'kg'), -- Sándwich Caliente con Mozza
(10, 9, 2.0, 'u'), (10, 3, 0.050, 'kg'), (10, 5, 0.050, 'kg'), (10, 10, 0.050, 'kg'), -- Sándwich Tropical
(11, 9, 2.0, 'u'), (11, 3, 0.050, 'kg'), (11, 5, 0.050, 'kg'), (11, 11, 0.050, 'kg'), (11, 12, 0.050, 'kg'), -- Sándwich Napolitano
(12, 9, 2.0, 'u'), (12, 3, 0.050, 'kg'), (12, 5, 0.050, 'kg'), (12, 1, 1.0, 'u'), (12, 13, 0.020, 'kg'), -- Sándwich Olímpico
(13, 9, 2.0, 'u'), (13, 10, 0.050, 'kg'), (13, 11, 0.050, 'kg'), (13, 12, 0.050, 'kg'), (13, 5, 0.050, 'kg'), -- Sándwich Napolitano Tropical

-- Panchos (14-16)
(14, 14, 1.0, 'u'), (14, 9, 1.0, 'u'), -- Pancho al Pan
(15, 14, 1.0, 'u'), (15, 9, 1.0, 'u'), (15, 5, 0.050, 'kg'), (15, 15, 0.030, 'kg'), -- Pancho con Mozza y Panceta
(16, 14, 2.0, 'u'), (16, 9, 2.0, 'u'), (16, 2, 0.150, 'kg'), -- Pancho con Fritas (Doble)

-- Pastas (17-22)
(17, 18, 0.150, 'kg'), (17, 17, 0.050, 'kg'), -- Ravioles Verdura
(18, 16, 0.150, 'kg'), (18, 18, 0.100, 'kg'), -- Ravioles Ricotta
(19, 19, 0.200, 'kg'), (19, 1, 1.0, 'u'), (19, 12, 0.020, 'kg'), -- Tallarines
(20, 18, 0.150, 'kg'), (20, 3, 0.050, 'kg'), (20, 5, 0.050, 'kg'), -- Sorrentinos Jamón/Mozza
(21, 16, 0.150, 'kg'), (21, 17, 0.050, 'kg'), -- Sorrentinos Espinaca/Ricotta
(22, 20, 0.250, 'kg'), -- Ñoquis de papa

-- Porciones (23-27)
(23, 2, 0.250, 'kg'), -- Fritas (Porción)
(24, 2, 0.300, 'kg'), -- Noisette (Papas fritas)
(25, 21, 0.050, 'kg'), (25, 11, 0.050, 'kg'), (25, 4, 0.010, 'kg'), (25, 22, 0.020, 'kg'), -- Ensalada Mixta
(26, 20, 0.100, 'kg'), (26, 22, 0.050, 'kg'), (26, 23, 0.050, 'kg'), (26, 24, 0.050, 'L'), -- Ensalada Rusa
(27, 20, 0.250, 'kg'), -- Puré de Papas

-- Menú Pequeño (28-33)
(28, 25, 1.0, 'u'), (28, 2, 0.100, 'kg'), -- Hamburguesa con Fritas
(29, 14, 1.0, 'u'), (29, 2, 0.100, 'kg'), -- Pancho con Fritas
(30, 7, 8.0, 'u'), (30, 2, 0.100, 'kg'), -- Nuggets con Fritas
(31, 25, 1.0, 'u'), (31, 2, 0.100, 'kg'), (31, 3, 0.020, 'kg'), (31, 5, 0.020, 'kg'), -- Hamburguesa Schneck
(32, 27, 0.100, 'kg'), (32, 20, 0.200, 'kg'), -- Finito de lomo con puré
(33, 7, 8.0, 'u'), (33, 6, 0.080, 'kg'), -- Miniaturas

-- Hamburguesas (34-36)
(34, 25, 1.0, 'u'), (34, 26, 1.0, 'u'), (34, 2, 0.150, 'kg'), (34, 21, 0.010, 'kg'), (34, 11, 0.020, 'kg'), -- Simple
(35, 25, 1.0, 'u'), (35, 2, 0.150, 'kg'), (35, 3, 0.050, 'kg'), (35, 5, 0.050, 'kg'), (35, 1, 1.0, 'u'), -- Completa plato
(36, 25, 1.0, 'u'), (36, 26, 1.0, 'u'), (36, 2, 0.150, 'kg'), (36, 3, 0.050, 'kg'), (36, 5, 0.050, 'kg'), (36, 1, 1.0, 'u'), -- Completa pan

-- Asados (37-46)
(37, 28, 0.500, 'kg'), (37, 29, 1.0, 'u'), (37, 20, 0.150, 'kg'), -- Asado de tira
(38, 30, 0.300, 'kg'), (38, 2, 0.200, 'kg'), -- Entrecot grillé
(39, 30, 0.300, 'kg'), (39, 2, 0.200, 'kg'), (39, 38, 0.050, 'kg'), -- Entrecot con salsa
(40, 31, 0.250, 'kg'), (40, 2, 0.200, 'kg'), -- Suprema grillé
(41, 31, 0.250, 'kg'), (41, 2, 0.200, 'kg'), (41, 38, 0.050, 'kg'), -- Suprema con salsa
(42, 32, 0.350, 'kg'), (42, 20, 0.200, 'kg'), -- Costilla a la Riojana
(43, 20, 0.200, 'kg'), (43, 1, 3.0, 'u'), (43, 21, 0.050, 'kg'), -- Tortilla de papa
(44, 20, 0.200, 'kg'), (44, 1, 3.0, 'u'), (44, 12, 0.050, 'kg'), -- Tortilla a la española
(45, 1, 2.0, 'u'), (45, 21, 0.050, 'kg'), -- Omelette
(46, 34, 0.200, 'kg'), (46, 2, 0.200, 'kg'), -- Merluza a la plancha

-- Menú Vegetariano (47-51)
(47, 35, 1.0, 'u'), (47, 26, 1.0, 'u'), (47, 21, 0.020, 'kg'), -- Hamburguesa de soja pan
(48, 35, 1.0, 'u'), (48, 21, 0.050, 'kg'), -- Hamburguesa de soja plato
(49, 36, 1.0, 'u'), (49, 2, 0.200, 'kg'), -- Milanesa de soja
(50, 35, 1.0, 'u'), (50, 9, 1.0, 'u'), -- Pancho de soja
(51, 1, 2.0, 'u'), (51, 2, 0.150, 'kg'), (51, 4, 0.020, 'kg'), -- Gramajo Vegetariano

-- Pizzería (52-68)
(52, 37, 0.100, 'kg'), (52, 38, 0.050, 'kg'), -- Porción al tomate
(53, 37, 0.100, 'kg'), (53, 38, 0.050, 'kg'), (53, 12, 0.010, 'kg'), -- Porción al tomate con gusto
(54, 37, 0.100, 'kg'), (54, 38, 0.030, 'kg'), (54, 5, 0.100, 'kg'), -- Porción de muzzarella
(55, 37, 0.100, 'kg'), (55, 38, 0.030, 'kg'), (55, 5, 0.100, 'kg'), (55, 12, 0.010, 'kg'), -- Porción de muzzarella con gusto
(56, 37, 0.200, 'kg'), (56, 38, 0.080, 'kg'), -- Pizzeta al tomate
(57, 37, 0.200, 'kg'), (57, 38, 0.050, 'kg'), (57, 5, 0.250, 'kg'), -- Pizzeta con mozzarella
(58, 37, 0.200, 'kg'), (58, 38, 0.050, 'kg'), (58, 5, 0.250, 'kg'), (58, 3, 0.050, 'kg'), -- Pizzeta con mozzarella con gusto
(59, 37, 0.400, 'kg'), (59, 38, 0.100, 'kg'), (59, 5, 0.500, 'kg'), -- 1/2 metro de mozzarella
(60, 37, 0.200, 'kg'), (60, 38, 0.050, 'kg'), (60, 5, 0.250, 'kg'), (60, 11, 0.050, 'kg'), -- 1/4 metro con gusto
(61, 37, 0.800, 'kg'), (61, 38, 0.200, 'kg'), (61, 5, 1.000, 'kg'), -- Metro de mozzarella
(62, 37, 0.800, 'kg'), (62, 38, 0.200, 'kg'), (62, 5, 1.000, 'kg'), (62, 13, 0.050, 'kg'), -- Metro con gusto
(63, 33, 0.100, 'kg'), (63, 4, 0.010, 'kg'), -- Porción de fainá
(64, 33, 0.100, 'kg'), (64, 4, 0.010, 'kg'), (64, 5, 0.050, 'kg'), -- Fainá con mozzarella
(65, 37, 0.100, 'kg'), (65, 4, 0.050, 'kg'), -- Porción figazza
(66, 37, 0.100, 'kg'), (66, 4, 0.050, 'kg'), (66, 5, 0.080, 'kg'); -- Porción de fugazzeta