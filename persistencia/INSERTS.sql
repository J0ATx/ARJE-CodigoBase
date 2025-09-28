-- Usuario Gerente de Prueba
-- Email: gerente@prueba.com
-- Contraseña: gerente123 (hasheada correctamente con password_hash)
INSERT INTO Personal (personal_nombre, personal_apellido, personal_contrasenia, personal_id, personal_telefono, personal_rol) VALUES ('Gerente', 'Prueba', '$2y$10$gy0d3tiaoPcx3J34cw2ia.4dV42Zea1VvGt75nqikQZGxDJpLtERy', 'gerente@prueba.com', 123456789, 'Gerente-General');
INSERT INTO Gerente_General (personal_id) VALUES ('gerente@prueba.com');

INSERT INTO Personal (personal_id, personal_nombre, personal_apellido, personal_telefono, personal_contrasenia, personal_calificacion, personal_rol) VALUES
('chefejecutivo@prueba.com', 'Chef', 'Ejecutivo', 99123456, 'hashed_password', '10', 'Chef-Ejecutivo');

INSERT INTO Chef_Ejecutivo (personal_id) VALUES
('chefejecutivo@prueba.com');

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
(14, 'Salchicha tipo Schneck', DATE_ADD(CURDATE(), INTERVAL 40 DAY)),
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
(7, 'Miniaturas (16 unidades)', 460.00, 'Variedad de pequeñas porciones fritas, típicas para picar.', '15 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
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
(37, 'Asado de tira (x kg), 1 chorizo + guarnición', 680.00, 'Corte de carne asada con chorizo y guarnición a la plancha.', '30 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
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
(61, '1/2 metro de mozzarella (precio 2)', 580.00, 'Medio metro de pizza con mozzarella.', '20 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(62, '1/2 metro de mozzarella con gusto (precio 2)', 750.00, 'Medio metro de pizza con mozzarella y gusto extra.', '22 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(63, 'Metro de mozzarella', 990.00, 'Un metro de pizza con mozzarella.', '25 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(64, 'Metro de mozzarella con gusto', 1290.00, 'Un metro de pizza con mozzarella y un gusto extra.', '28 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(65, 'Porción de fainá', 150.00, 'Porción de fainá simple.', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(66, 'Porción de fainá con mozzarella', 210.00, 'Porción de fainá con mozzarella.', '12 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(67, 'Porción figazza', 210.00, 'Porción de pizza figazza (cebolla).', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(68, 'Porción de fugazzeta', 280.00, 'Porción de fugazzeta (cebolla y queso).', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com');

-- Consume
INSERT INTO Consume (producto_id, stock_id, consume_cantidad, consume_medida) VALUES
-- Para Picar (1-7)
(1, 1, 2.0, 'u'), (1, 2, 150.0, 'g'), (1, 3, 50.0, 'g'), (1, 4, 20.0, 'g'), -- Gramajo Chico
(2, 1, 3.0, 'u'), (2, 2, 300.0, 'g'), (2, 3, 100.0, 'g'), (2, 4, 40.0, 'g'), -- Gramajo Grande
(3, 2, 250.0, 'g'), -- Fritas con Salsa
(4, 6, 150.0, 'g'), -- Rabas
(5, 7, 16.0, 'u'), -- Nuggets (16)
(6, 8, 150.0, 'g'), -- Aritos de Cebolla
(7, 7, 8.0, 'u'), (7, 6, 80.0, 'g'), -- Miniaturas (Mix de Nuggets y Rabas)
-- Sándwiches (8-13)
(8, 9, 2.0, 'u'), (8, 3, 50.0, 'g'), (8, 5, 50.0, 'g'), -- Sándwich Caliente (Jamón, Mozza)
(9, 9, 2.0, 'u'), (9, 3, 50.0, 'g'), (9, 5, 100.0, 'g'), -- Sándwich Caliente con Mozza
(10, 9, 2.0, 'u'), (10, 3, 50.0, 'g'), (10, 5, 50.0, 'g'), (10, 10, 50.0, 'g'), -- Sándwich Tropical
(11, 9, 2.0, 'u'), (11, 3, 50.0, 'g'), (11, 5, 50.0, 'g'), (11, 11, 50.0, 'g'), (11, 12, 50.0, 'g'), -- Sándwich Napolitano
(12, 9, 2.0, 'u'), (12, 3, 50.0, 'g'), (12, 5, 50.0, 'g'), (12, 1, 1.0, 'u'), (12, 13, 20.0, 'g'), -- Sándwich Olímpico
(13, 9, 2.0, 'u'), (13, 10, 50.0, 'g'), (13, 11, 50.0, 'g'), (13, 12, 50.0, 'g'), (13, 5, 50.0, 'g'), -- Sándwich Napolitano Tropical
-- Panchos (14-16)
(14, 14, 1.0, 'u'), (14, 9, 1.0, 'u'), -- Pancho al Pan
(15, 14, 1.0, 'u'), (15, 9, 1.0, 'u'), (15, 5, 50.0, 'g'), (15, 15, 30.0, 'g'), -- Pancho con Mozza y Panceta
(16, 14, 2.0, 'u'), (16, 9, 2.0, 'u'), (16, 2, 150.0, 'g'), -- Pancho con Fritas (Doble)
-- Pastas (17-22)
(17, 18, 150.0, 'g'), (17, 17, 50.0, 'g'), -- Ravioles Verdura (Pasta y Espinaca genérica)
(18, 16, 150.0, 'g'), (18, 18, 100.0, 'g'), -- Ravioles Ricotta
(19, 19, 200.0, 'g'), (19, 1, 1.0, 'u'), (19, 12, 20.0, 'g'), -- Tallarines (Pasta, Huevo, Morrón)
(20, 18, 150.0, 'g'), (20, 3, 50.0, 'g'), (20, 5, 50.0, 'g'), -- Sorrentinos Jamón/Mozza
(21, 16, 150.0, 'g'), (21, 17, 50.0, 'g'), -- Sorrentinos Espinaca/Ricotta
(22, 20, 250.0, 'g'), -- Ñoquis de papa
-- Porciones (23-27)
(23, 2, 250.0, 'g'), -- Fritas (Porción)
(24, 2, 300.0, 'g'), -- Noisette (Papas fritas)
(25, 21, 50.0, 'g'), (25, 11, 50.0, 'g'), (25, 4, 10.0, 'g'), (25, 22, 20.0, 'g'), -- Ensalada Mixta
(26, 20, 100.0, 'g'), (26, 22, 50.0, 'g'), (26, 23, 50.0, 'g'), (26, 24, 50.0, 'ml'), -- Ensalada Rusa
(27, 20, 250.0, 'g'), -- Puré de Papas
-- Menú Pequeño (28-33)
(28, 25, 1.0, 'u'), (28, 2, 100.0, 'g'), -- Hamburguesa con Fritas
(29, 14, 1.0, 'u'), (29, 2, 100.0, 'g'), -- Pancho con Fritas
(30, 7, 8.0, 'u'), (30, 2, 100.0, 'g'), -- Nuggets con Fritas
(31, 25, 1.0, 'u'), (31, 2, 100.0, 'g'), (31, 3, 20.0, 'g'), (31, 5, 20.0, 'g'), -- Hamburguesa Schneck
(32, 27, 100.0, 'g'), (32, 20, 200.0, 'g'), -- Finito de lomo con puré
(33, 7, 8.0, 'u'), (33, 6, 80.0, 'g'), -- Miniaturas
-- Hamburguesas (34-36)
(34, 25, 1.0, 'u'), (34, 26, 1.0, 'u'), (34, 2, 150.0, 'g'), (34, 21, 10.0, 'g'), (34, 11, 20.0, 'g'), -- Simple
(35, 25, 1.0, 'u'), (35, 2, 150.0, 'g'), (35, 3, 50.0, 'g'), (35, 5, 50.0, 'g'), (35, 1, 1.0, 'u'), -- Completa plato
(36, 25, 1.0, 'u'), (36, 26, 1.0, 'u'), (36, 2, 150.0, 'g'), (36, 3, 50.0, 'g'), (36, 5, 50.0, 'g'), (36, 1, 1.0, 'u'), -- Completa pan
-- Asados (37-46)
(37, 28, 500.0, 'g'), (37, 29, 1.0, 'u'), (37, 20, 150.0, 'g'), -- Asado de tira (Carne, Chorizo, Papa)
(38, 30, 300.0, 'g'), (38, 2, 200.0, 'g'), -- Entrecot grillé (Fritas genéricas)
(39, 30, 300.0, 'g'), (39, 2, 200.0, 'g'), (39, 38, 50.0, 'g'), -- Entrecot grillé con salsa
(40, 31, 250.0, 'g'), (40, 2, 200.0, 'g'), -- Suprema grillé
(41, 31, 250.0, 'g'), (41, 2, 200.0, 'g'), (41, 38, 50.0, 'g'), -- Suprema grillé con salsa
(42, 32, 350.0, 'g'), (42, 20, 200.0, 'g'), -- Costilla a la Riojana (Costilla, Papa)
(43, 20, 200.0, 'g'), (43, 1, 3.0, 'u'), (43, 21, 50.0, 'g'), -- Tortilla de papa (Papa, Huevo, Lechuga)
(44, 20, 200.0, 'g'), (44, 1, 3.0, 'u'), (44, 12, 50.0, 'g'), -- **CORREGIDO:** Tortilla a la española (Stock 43 cambiado a 20 'Papa')
(45, 1, 2.0, 'u'), (45, 21, 50.0, 'g'), -- Omelette
(46, 34, 200.0, 'g'), (46, 2, 200.0, 'g'), -- Merluza a la plancha
-- Menú Vegetariano (47-51)
(47, 35, 1.0, 'u'), (47, 26, 1.0, 'u'), (47, 21, 20.0, 'g'), -- Hamburguesa de soja pan
(48, 35, 1.0, 'u'), (48, 21, 50.0, 'g'), -- Hamburguesa de soja plato
(49, 36, 1.0, 'u'), (49, 2, 200.0, 'g'), -- Milanesa de soja
(50, 35, 1.0, 'u'), (50, 9, 1.0, 'u'), -- Pancho de soja
(51, 1, 2.0, 'u'), (51, 2, 150.0, 'g'), (51, 4, 20.0, 'g'), -- Gramajo Vegetariano (Huevo, Papa, Cebolla)
-- Pizzería (52-68)
(52, 37, 100.0, 'g'), (52, 38, 50.0, 'g'), -- Porción al tomate (Masa, Salsa)
(53, 37, 100.0, 'g'), (53, 38, 50.0, 'g'), (53, 12, 10.0, 'g'), -- Porción al tomate con gusto (Masa, Salsa, Morrón)
(54, 37, 100.0, 'g'), (54, 38, 30.0, 'g'), (54, 5, 100.0, 'g'), -- Porción de muzzarella
(55, 37, 100.0, 'g'), (55, 38, 30.0, 'g'), (55, 5, 100.0, 'g'), (55, 12, 10.0, 'g'), -- Porción de muzzarella con gusto
(56, 37, 200.0, 'g'), (56, 38, 80.0, 'g'), -- Pizzeta al tomate
(57, 37, 200.0, 'g'), (57, 38, 50.0, 'g'), (57, 5, 250.0, 'g'), -- Pizzeta con mozzarella
(58, 37, 200.0, 'g'), (58, 38, 50.0, 'g'), (58, 5, 250.0, 'g'), (58, 3, 50.0, 'g'), -- Pizzeta con mozzarella con gusto (Jamón)
(59, 37, 400.0, 'g'), (59, 38, 100.0, 'g'), (59, 5, 500.0, 'g'), -- 1/2 metro de mozzarella
(60, 37, 200.0, 'g'), (60, 38, 50.0, 'g'), (60, 5, 250.0, 'g'), (60, 11, 50.0, 'g'), -- 1/4 metro con gusto (Tomate)
(61, 37, 400.0, 'g'), (61, 38, 100.0, 'g'), (61, 5, 500.0, 'g'), -- 1/2 metro de mozzarella (precio 2)
(62, 37, 400.0, 'g'), (62, 38, 100.0, 'g'), (62, 5, 500.0, 'g'), (62, 12, 100.0, 'g'), -- 1/2 metro con gusto (Morrón)
(63, 37, 800.0, 'g'), (63, 38, 200.0, 'g'), (63, 5, 1000.0, 'g'), -- Metro de mozzarella
(64, 37, 800.0, 'g'), (64, 38, 200.0, 'g'), (64, 5, 1000.0, 'g'), (64, 13, 50.0, 'g'), -- Metro con gusto (Aceitunas)
(65, 33, 100.0, 'g'), (65, 4, 10.0, 'g'), -- Porción de fainá (Harina, Cebolla)
(66, 33, 100.0, 'g'), (66, 4, 10.0, 'g'), (66, 5, 50.0, 'g'), -- Porción de fainá con mozzarella
(67, 37, 100.0, 'g'), (67, 4, 50.0, 'g'), -- Porción figazza (Masa, Cebolla)
(68, 37, 100.0, 'g'), (68, 4, 50.0, 'g'), (68, 5, 80.0, 'g'); -- Porción de fugazzeta