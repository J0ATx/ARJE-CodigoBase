USE lostrestanosdb;

-- =================================================================================
-- 1. PERSONAL JERÁRQUICO Y EMPRESA
-- =================================================================================

-- Gerente General y Chef Ejecutivo
INSERT INTO Personal (personal_nombre, personal_apellido, personal_contrasenia, personal_id, personal_telefono, personal_rol) 
VALUES ('Gerente', 'Prueba', '$2y$10$gy0d3tiaoPcx3J34cw2ia.4dV42Zea1VvGt75nqikQZGxDJpLtERy', 'gerente@prueba.com', 123456789, 'Gerente-General');
INSERT INTO Gerente_General (personal_id) VALUES ('gerente@prueba.com');

INSERT INTO Personal (personal_id, personal_nombre, personal_apellido, personal_telefono, personal_contrasenia, personal_calificacion, personal_rol) 
VALUES ('chefejecutivo@prueba.com', 'Chef', 'Ejecutivo', 99123456, 'hashed_password', '10', 'Chef-Ejecutivo');
INSERT INTO Chef_Ejecutivo (personal_id) VALUES ('chefejecutivo@prueba.com');

-- Datos de la Empresa
INSERT INTO Empresa (empresa_nombre, empresa_mision, empresa_vision, empresa_whatsapp, empresa_instagram, empresa_facebook, personal_id) 
VALUES ("Los 3 Tanos", "Vender buena comida", "Vender MÁS buena comida", "092412772", "los3tanos_pizzeria", "Pizzeria Los 3 Tanos | Atlántida", "gerente@prueba.com");

UPDATE Empresa SET empresa_valores = "Calidad, Rapidez, Sabor" WHERE empresa_id = 1;

INSERT INTO Empresa_Telefono (empresa_id, empresa_telefono) VALUES ("1", "43729333");
INSERT INTO Empresa_Ubicacion (empresa_id, empresa_ciudad, empresa_calle) VALUES ("1", "Las Toscas", "M. Ferreira y Central");

INSERT INTO Empresa_Horario (empresa_id, empresa_dia, empresa_hora) VALUES 
    ("1", "Martes", "19:00 - 00:00"), ("1", "Miércoles", "19:00 - 00:00"), ("1", "Jueves", "19:00 - 00:00"),
    ("1", "Viernes", "19:00 - 00:00"), ("1", "Sábado", "12:00 - 16:00"), ("1", "Sábado", "19:00 - 00:00"),
    ("1", "Domingo", "12:00 - 16:00"), ("1", "Domingo", "19:00 - 00:00");

-- =================================================================================
-- 2. INVENTARIO (STOCK)
-- =================================================================================

-- Ingredientes de Cocina (IDs 1-38)
INSERT INTO Stock (stock_id, stock_nombre, stock_caducidad, stock_alerta) VALUES
(1, 'Huevo', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 12.000),
(2, 'Papas Fritas Congeladas', DATE_ADD(CURDATE(), INTERVAL 180 DAY), 10.000),
(3, 'Jamón', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 5.000),
(4, 'Cebolla', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 3.000),
(5, 'Mozzarella', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 10.000),
(6, 'Anillos de Calamar Rebozados', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 5.000),
(7, 'Nuggets de Pollo', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 5.000),
(8, 'Aros de Cebolla Empanizados', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 5.000),
(9, 'Pan de Sándwich', DATE_ADD(CURDATE(), INTERVAL 10 DAY), 20.000),
(10, 'Piña en Rodajas', DATE_ADD(CURDATE(), INTERVAL 365 DAY), 2.000),
(11, 'Tomate', DATE_ADD(CURDATE(), INTERVAL 15 DAY), 5.000),
(12, 'Marrón', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 3.000),
(13, 'Aceitunas', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 2.000),
(14, 'Panchos (Schneck)', DATE_ADD(CURDATE(), INTERVAL 40 DAY), 20.000),
(15, 'Panceta', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 2.000),
(16, 'Ricotta', DATE_ADD(CURDATE(), INTERVAL 15 DAY), 3.000),
(17, 'Espinaca', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 2.000),
(18, 'Pasta para Ravioles', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 5.000),
(19, 'Pasta para Tallarines', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 5.000),
(20, 'Papa para Ñoquis/Puré', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 10.000),
(21, 'Lechuga', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 3.000),
(22, 'Zanahoria', DATE_ADD(CURDATE(), INTERVAL 25 DAY), 3.000),
(23, 'Arvejas', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 2.000),
(24, 'Mayonesa', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 2.000),
(25, 'Carne de Hamburguesa', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 20.000),
(26, 'Pan de Hamburguesa', DATE_ADD(CURDATE(), INTERVAL 10 DAY), 20.000),
(27, 'Bife de Lomo Finito', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 5.000),
(28, 'Carne Asado de Tira', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 5.000),
(29, 'Chorizo', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 5.000),
(30, 'Entrecot', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 5.000),
(31, 'Suprema de Pollo', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 5.000),
(32, 'Costilla de Cerdo', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 5.000),
(33, 'Harina para Tortilla/Omelette', DATE_ADD(CURDATE(), INTERVAL 180 DAY), 2.000),
(34, 'Merluza Filete', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 5.000),
(35, 'Hamburguesa de Soja', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 10.000),
(36, 'Milanesa de Soja', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 10.000),
(37, 'Masa para Pizza', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 5.000),
(38, 'Salsa de Tomate para Pizza', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 5.000);

-- Bebidas y Postres (IDs 39-43)
INSERT INTO Stock (stock_id, stock_nombre, stock_caducidad, stock_alerta) VALUES
(39, 'Coca-Cola 1.5L', DATE_ADD(CURDATE(), INTERVAL 180 DAY), 10.000),
(40, 'Cerveza Patricia 1L', DATE_ADD(CURDATE(), INTERVAL 120 DAY), 12.000),
(41, 'Agua Salus s/gas 1.5L', DATE_ADD(CURDATE(), INTERVAL 365 DAY), 10.000),
(42, 'Dulce de Leche', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 2.000),
(43, 'Huevos (Postres)', DATE_ADD(CURDATE(), INTERVAL 15 DAY), 24.000);

-- Cantidades Iniciales
INSERT INTO Stock_Cantidad (stock_id, stock_cantidad, stock_medida) VALUES
(1, 120.000, 'u'), (2, 50.000, 'kg'), (3, 10.000, 'kg'), (4, 5.000, 'kg'), (5, 20.000, 'kg'),
(6, 10.000, 'kg'), (7, 5.000, 'kg'), (8, 5.000, 'kg'), (9, 100.000, 'u'), (10, 5.000, 'kg'),
(11, 7.500, 'kg'), (12, 4.000, 'kg'), (13, 2.000, 'kg'), (14, 80.000, 'u'), (15, 5.000, 'kg'),
(16, 10.000, 'kg'), (17, 4.000, 'kg'), (18, 15.000, 'kg'), (19, 15.000, 'kg'), (20, 30.000, 'kg'),
(21, 5.000, 'kg'), (22, 5.000, 'kg'), (23, 5.000, 'kg'), (24, 5.000, 'L'), (25, 60.000, 'u'),
(26, 60.000, 'u'), (27, 15.000, 'kg'), (28, 20.000, 'kg'), (29, 10.000, 'u'), (30, 15.000, 'kg'),
(31, 20.000, 'kg'), (32, 10.000, 'kg'), (33, 5.000, 'kg'), (34, 15.000, 'kg'), (35, 30.000, 'u'),
(36, 30.000, 'u'), (37, 15.000, 'kg'), (38, 10.000, 'kg'),
(39, 50.000, 'u'), (40, 48.000, 'u'), (41, 30.000, 'u'), (42, 5.000, 'kg'), (43, 60.000, 'u');

-- =================================================================================
-- 3. PRODUCTOS Y MENÚ
-- =================================================================================

-- Menú Principal (IDs 1-66)
INSERT INTO Producto (producto_id, producto_nombre, producto_precio, producto_descripcion, producto_receta, producto_tiempo_preparacion, producto_creacion, producto_categoria, personal_id) VALUES
(1, 'Gramajo Chico', 450.00, 'Huevo revuelto con papas, jamón y cebolla.', 'Saltear jamón y cebolla en sartén, agregar papas fritas y huevos batidos.', '15 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(2, 'Gramajo Grande', 680.00, 'Versión más grande del Gramajo Chico.', 'Doblar cantidad de ingredientes del Gramajo Chico y cocinar del mismo modo.', '20 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(3, 'Fritas con Salsa', 400.00, 'Papas fritas crujientes acompañadas con salsa.', 'Cortar papas en bastones, freír y acompañar con salsa.', '10 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(4, 'Rabas', 420.00, 'Anillos de calamar rebozados y fritos.', 'Rebozar anillos de calamar y freír hasta dorar.', '12 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(5, 'Nuggets (16 Unidades)', 440.00, 'Porción de 16 nuggets de pollo fritos.', 'Freír los nuggets congelados.', '10 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(6, 'Aritos de Cebolla', 400.00, 'Aros de cebolla empanizados y fritos.', 'Freír hasta dorar.', '10 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(7, 'Miniaturas (16 unidades)', 460.00, 'Una picada con pescados y mariscos.', 'Freír las miniaturas hasta dorar.', '15 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(8, 'Sándwich Caliente', 290.00, 'Sandwich caliente clásico.', 'Rellenar pan con jamón y queso, tostar.', '5 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(9, 'Sándwich Caliente con Mozzarella', 340.00, 'Sandwich caliente con mozzarella.', 'Agregar mozzarella al relleno y calentar.', '7 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(10, 'Sándwich Tropical', 380.00, 'Sandwich con jamón, queso, y piña.', 'Tostar el pan, agregar jamón, queso y piña.', '8 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(11, 'Sándwich Napolitano', 380.00, 'Sandwich con jamón, queso, tomate y morrón.', 'Armar con pan, jamón, queso, tomate y morrón asado.', '8 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(12, 'Sándwich Olímpico', 300.00, 'Sandwich con jamón, queso, huevo duro y aceitunas.', 'Intercalar capas de ingredientes.', '6 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(13, 'Sándwich Napolitano Tropical', 420.00, 'Sándwich Napolitano con adición de piña.', 'Preparar como el napolitano y agregar piña.', '10 min', CURDATE(), 'Sándwiches', 'chefejecutivo@prueba.com'),
(14, 'Pancho al Pan (Schneck)', 140.00, 'Pancho clásico.', 'Cocinar la salchicha y colocar en pan.', '5 min', CURDATE(), 'Panchos', 'chefejecutivo@prueba.com'),
(15, 'Pancho al Pan con Muzzarella y Panceta', 180.00, 'Pancho con mozzarella y panceta.', 'Agregar mozzarella y panceta sobre la salchicha.', '7 min', CURDATE(), 'Panchos', 'chefejecutivo@prueba.com'),
(16, 'Pancho al Pan con Fritas (Doble)', 420.00, 'Doble pancho con toppings y fritas.', 'Armar doble salchicha y acompañar con fritas.', '10 min', CURDATE(), 'Panchos', 'chefejecutivo@prueba.com'),
(17, 'Ravioles de Verdura con salsa', 540.00, 'Ravioles rellenos de verduras.', 'Hervir los ravioles y cubrir con salsa.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(18, 'Ravioles de Ricotta con salsa', 540.00, 'Ravioles rellenos de ricotta.', 'Cocer los ravioles y bañar con salsa.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(19, 'Tallarines con salsa', 420.00, 'Pasta fresca con salsa.', 'Hervir la pasta y mezclar con salsa.', '18 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(20, 'Sorrentinos de jamón y muzzarella', 540.00, 'Sorrentinos con salsa.', 'Cocer los sorrentinos y servir con salsa.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(21, 'Sorrentinos de espinaca y ricotta', 540.00, 'Sorrentinos de verdura con salsa.', 'Hervir y cubrir con salsa.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(22, 'Ñoquis de papa con salsa', 420.00, 'Ñoquis caseros con salsa.', 'Cocer los ñoquis y servir con salsa.', '18 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(23, 'Fritas (Porción)', 270.00, 'Porción individual de papas fritas.', 'Freír papas hasta dorar.', '10 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(24, 'Noisette', 300.00, 'Porción de papas noisette.', 'Freír las papas noisette.', '10 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(25, 'Ensalada Mixta', 270.00, 'Lechuga, tomate, cebolla y zanahoria.', 'Lavar, cortar y mezclar.', '5 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(26, 'Ensalada Rusa', 270.00, 'Papa, zanahoria, arvejas y mayonesa.', 'Hervir verduras y mezclar con mayonesa.', '10 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(27, 'Puré de Papas', 250.00, 'Puré cremoso.', 'Hervir papas, pisar con manteca y leche.', '15 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(28, 'Hamburguesa con Fritas (plato o pan)', 300.00, 'Hamburguesa con papas fritas.', 'Cocinar hamburguesa y servir con fritas.', '10 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(29, 'Pancho con Fritas (Menú Pequeño)', 300.00, 'Pancho con papas fritas.', 'Servir pancho clásico con papas.', '10 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(30, 'Nuggets con Fritas (Menú Pequeño)', 380.00, 'Nuggets con papas fritas.', 'Freír nuggets y papas.', '10 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(31, 'Hamburguesa (schneck) al pan con fritas', 380.00, 'Hamburguesa completa pequeña.', 'Cocinar hamburguesa con jamón y queso.', '10 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(32, 'Finito de lomo con puré', 400.00, 'Bife finito con puré.', 'Cocinar el bife a la plancha y servir con puré.', '20 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(33, 'Miniaturas (Menú Pequeño)', 400.00, 'Porción de miniaturas.', 'Freír miniaturas.', '15 min', CURDATE(), 'Menú para los pequeños', 'chefejecutivo@prueba.com'),
(34, 'Hamburguesa con fritas (lechuga/tomate)', 320.00, 'Hamburguesa clásica.', 'Cocinar hamburguesa y montar con vegetales.', '10 min', CURDATE(), 'Hamburguesas', 'chefejecutivo@prueba.com'),
(35, 'Hamburguesa completa al plato con fritas', 400.00, 'Hamburguesa completa al plato.', 'Agregar todos los toppings y acompañar con fritas.', '15 min', CURDATE(), 'Hamburguesas', 'chefejecutivo@prueba.com'),
(36, 'Hamburguesa completa al pan con fritas', 400.00, 'Hamburguesa completa al pan.', 'Montar hamburguesa completa en pan.', '15 min', CURDATE(), 'Hamburguesas', 'chefejecutivo@prueba.com'),
(37, 'Asado de tira, 1 chorizo + guarnición', 680.00, 'Carne asada con chorizo.', 'Asar carne y chorizo.', '30 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(38, 'Entrecot grille con guarnición', 550.00, 'Entrecot a la parrilla.', 'Sellar el entrecot en parrilla.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(39, 'Entrecot grille con guarnición y salsa', 650.00, 'Entrecot a la parrilla con salsa.', 'Cocinar y bañar con salsa.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(40, 'Suprema grille con guarnición', 550.00, 'Suprema de pollo a la parrilla.', 'Asar la suprema.', '20 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(41, 'Suprema grille con guarnición y salsa', 650.00, 'Suprema con salsa.', 'Cocinar la suprema y cubrir con salsa.', '20 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(42, 'Costilla a la Riojana con guarnición', 650.00, 'Costillas a la riojana.', 'Cocinar costillas con vegetales salteados.', '30 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(43, 'Tortilla de papa (con mixta)', 400.00, 'Tortilla de papa.', 'Cocinar tortilla y servir con ensalada.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(44, 'Tortilla a la española (con mixta)', 450.00, 'Tortilla española.', 'Preparar con chorizo y servir con ensalada.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(45, 'Omelette con mixta', 360.00, 'Omelette clásico.', 'Batir huevos, cocinar y servir.', '10 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(46, 'Merluza a la plancha con guarnición', 560.00, 'Filete de merluza.', 'Cocinar merluza y servir con guarnición.', '20 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(47, 'Hamburguesa de soja al pan', 340.00, 'Hamburguesa vegetariana.', 'Cocinar hamburguesa de soja.', '15 min', CURDATE(), 'Menú Vegetariano', 'chefejecutivo@prueba.com'),
(48, 'Hamburguesa de soja al plato', 400.00, 'Hamburguesa vegetariana al plato.', 'Cocinar hamburguesa de soja.', '15 min', CURDATE(), 'Menú Vegetariano', 'chefejecutivo@prueba.com'),
(49, 'Milanesa de soja con guarnición', 450.00, 'Milanesa vegetariana.', 'Freír milanesa de soja.', '20 min', CURDATE(), 'Menú Vegetariano', 'chefejecutivo@prueba.com'),
(50, 'Pancho de soja', 115.00, 'Pancho vegetariano.', 'Cocinar salchicha vegetal.', '5 min', CURDATE(), 'Menú Vegetariano', 'chefejecutivo@prueba.com'),
(51, 'Gramajo chico (Vegetariano)', 450.00, 'Gramajo sin carne.', 'Gramajo clásico sin jamón.', '15 min', CURDATE(), 'Menú Vegetariano', 'chefejecutivo@prueba.com'),
(52, 'Porción al tomate', 150.00, 'Pizza solo salsa.', 'Hornear masa con salsa.', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(53, 'Porción al tomate con gusto', 220.00, 'Pizza salsa y gusto.', 'Hornear con ingrediente extra.', '12 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(54, 'Porción de muzzarella', 290.00, 'Porción clásica.', 'Hornear con mozzarella.', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(55, 'Porción de muzzarella con gusto', 280.00, 'Muzzarella y gusto.', 'Hornear con ingrediente extra.', '12 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(56, 'Pizzeta al tomate', 360.00, 'Pizzeta solo salsa.', 'Hornear pizzeta con salsa.', '15 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(57, 'Pizzeta con mozzarella', 460.00, 'Pizzeta clásica.', 'Hornear pizzeta con queso.', '18 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(58, 'Pizzeta con mozzarella con gusto', 590.00, 'Pizzeta y gusto.', 'Hornear con ingrediente extra.', '20 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(59, '1/2 metro de mozzarella', 580.00, 'Media pizza.', 'Hornear medio metro.', '20 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(60, '1/4 metro de mozzarella con gusto', 450.00, 'Cuarto de metro.', 'Hornear cuarto de metro.', '15 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(61, 'Metro de mozzarella', 990.00, 'Metro entero.', 'Hornear metro entero.', '25 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(62, 'Metro de mozzarella con gusto', 1290.00, 'Metro y gusto.', 'Hornear con ingrediente extra.', '28 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(63, 'Porción de fainá', 150.00, 'Fainá clásica.', 'Hornear mezcla de garbanzo.', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(64, 'Porción de fainá con mozzarella', 210.00, 'Fainá con queso.', 'Gratinar mozzarella sobre fainá.', '12 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(65, 'Porción figazza', 210.00, 'Pizza de cebolla.', 'Hornear con cebolla.', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com'),
(66, 'Porción de fugazzeta', 280.00, 'Cebolla y queso.', 'Gratinar cebolla y queso.', '10 min', CURDATE(), 'Pizzería', 'chefejecutivo@prueba.com');

-- Nuevos Productos (Bebidas y Postres)
INSERT INTO Producto (producto_id, producto_nombre, producto_precio, producto_descripcion, producto_receta, producto_tiempo_preparacion, producto_creacion, producto_categoria, personal_id) VALUES
(67, 'Coca-Cola 1.5L', 180.00, 'Refresco cola para compartir.', 'Servir fría.', '2 min', CURDATE(), 'Bebidas', 'chefejecutivo@prueba.com'),
(68, 'Cerveza Patricia 1L', 220.00, 'Cerveza rubia nacional.', 'Destapar y servir en vasos fríos.', '2 min', CURDATE(), 'Bebidas', 'chefejecutivo@prueba.com'),
(69, 'Agua Mineral 1.5L', 140.00, 'Agua sin gas familiar.', 'Servir natural o fría.', '1 min', CURDATE(), 'Bebidas', 'chefejecutivo@prueba.com'),
(70, 'Flan Casero con Dulce de Leche', 250.00, 'Flan de huevo tradicional.', 'Servir porción de flan y añadir una cucharada generosa de dulce de leche.', '5 min', CURDATE(), 'Postres', 'chefejecutivo@prueba.com');

-- Relación Consumo (Recetas)
INSERT INTO Consume (producto_id, stock_id, consume_cantidad, consume_medida) VALUES
(1, 1, 2.0, 'u'), (1, 2, 0.150, 'kg'), (1, 3, 0.050, 'kg'), (1, 4, 0.020, 'kg'),
(2, 1, 3.0, 'u'), (2, 2, 0.300, 'kg'), (2, 3, 0.100, 'kg'), (2, 4, 0.040, 'kg'),
(3, 2, 0.250, 'kg'), (4, 6, 0.150, 'kg'), (5, 7, 16.0, 'u'), (6, 8, 0.150, 'kg'),
(7, 7, 8.0, 'u'), (7, 6, 0.080, 'kg'), (8, 9, 2.0, 'u'), (8, 3, 0.050, 'kg'), (8, 5, 0.050, 'kg'),
(9, 9, 2.0, 'u'), (9, 3, 0.050, 'kg'), (9, 5, 0.100, 'kg'),
(10, 9, 2.0, 'u'), (10, 3, 0.050, 'kg'), (10, 5, 0.050, 'kg'), (10, 10, 0.050, 'kg'),
(11, 9, 2.0, 'u'), (11, 3, 0.050, 'kg'), (11, 5, 0.050, 'kg'), (11, 11, 0.050, 'kg'), (11, 12, 0.050, 'kg'),
(12, 9, 2.0, 'u'), (12, 3, 0.050, 'kg'), (12, 5, 0.050, 'kg'), (12, 1, 1.0, 'u'), (12, 13, 0.020, 'kg'),
(13, 9, 2.0, 'u'), (13, 10, 0.050, 'kg'), (13, 11, 0.050, 'kg'), (13, 12, 0.050, 'kg'), (13, 5, 0.050, 'kg'),
(14, 14, 1.0, 'u'), (14, 9, 1.0, 'u'), (15, 14, 1.0, 'u'), (15, 9, 1.0, 'u'), (15, 5, 0.050, 'kg'), (15, 15, 0.030, 'kg'),
(16, 14, 2.0, 'u'), (16, 9, 2.0, 'u'), (16, 2, 0.150, 'kg'),
(17, 18, 0.150, 'kg'), (17, 17, 0.050, 'kg'), (18, 16, 0.150, 'kg'), (18, 18, 0.100, 'kg'),
(19, 19, 0.200, 'kg'), (19, 1, 1.0, 'u'), (19, 12, 0.020, 'kg'),
(20, 18, 0.150, 'kg'), (20, 3, 0.050, 'kg'), (20, 5, 0.050, 'kg'), (21, 16, 0.150, 'kg'), (21, 17, 0.050, 'kg'),
(22, 20, 0.250, 'kg'), (23, 2, 0.250, 'kg'), (24, 2, 0.300, 'kg'),
(25, 21, 0.050, 'kg'), (25, 11, 0.050, 'kg'), (25, 4, 0.010, 'kg'), (25, 22, 0.020, 'kg'),
(26, 20, 0.100, 'kg'), (26, 22, 0.050, 'kg'), (26, 23, 0.050, 'kg'), (26, 24, 0.050, 'L'),
(27, 20, 0.250, 'kg'), (28, 25, 1.0, 'u'), (28, 2, 0.100, 'kg'),
(29, 14, 1.0, 'u'), (29, 2, 0.100, 'kg'), (30, 7, 8.0, 'u'), (30, 2, 0.100, 'kg'),
(31, 25, 1.0, 'u'), (31, 2, 0.100, 'kg'), (31, 3, 0.020, 'kg'), (31, 5, 0.020, 'kg'),
(32, 27, 0.100, 'kg'), (32, 20, 0.200, 'kg'), (33, 7, 8.0, 'u'), (33, 6, 0.080, 'kg'),
(34, 25, 1.0, 'u'), (34, 26, 1.0, 'u'), (34, 2, 0.150, 'kg'), (34, 21, 0.010, 'kg'), (34, 11, 0.020, 'kg'),
(35, 25, 1.0, 'u'), (35, 2, 0.150, 'kg'), (35, 3, 0.050, 'kg'), (35, 5, 0.050, 'kg'), (35, 1, 1.0, 'u'),
(36, 25, 1.0, 'u'), (36, 26, 1.0, 'u'), (36, 2, 0.150, 'kg'), (36, 3, 0.050, 'kg'), (36, 5, 0.050, 'kg'), (36, 1, 1.0, 'u'),
(37, 28, 0.500, 'kg'), (37, 29, 1.0, 'u'), (37, 20, 0.150, 'kg'),
(38, 30, 0.300, 'kg'), (38, 2, 0.200, 'kg'), (39, 30, 0.300, 'kg'), (39, 2, 0.200, 'kg'), (39, 38, 0.050, 'kg'),
(40, 31, 0.250, 'kg'), (40, 2, 0.200, 'kg'), (41, 31, 0.250, 'kg'), (41, 2, 0.200, 'kg'), (41, 38, 0.050, 'kg'),
(42, 32, 0.350, 'kg'), (42, 20, 0.200, 'kg'), (43, 20, 0.200, 'kg'), (43, 1, 3.0, 'u'), (43, 21, 0.050, 'kg'),
(44, 20, 0.200, 'kg'), (44, 1, 3.0, 'u'), (44, 12, 0.050, 'kg'), (45, 1, 2.0, 'u'), (45, 21, 0.050, 'kg'),
(46, 34, 0.200, 'kg'), (46, 2, 0.200, 'kg'), (47, 35, 1.0, 'u'), (47, 26, 1.0, 'u'), (47, 21, 0.020, 'kg'),
(48, 35, 1.0, 'u'), (48, 21, 0.050, 'kg'), (49, 36, 1.0, 'u'), (49, 2, 0.200, 'kg'),
(50, 35, 1.0, 'u'), (50, 9, 1.0, 'u'), (51, 1, 2.0, 'u'), (51, 2, 0.150, 'kg'), (51, 4, 0.020, 'kg'),
(52, 37, 0.100, 'kg'), (52, 38, 0.050, 'kg'), (53, 37, 0.100, 'kg'), (53, 38, 0.050, 'kg'), (53, 12, 0.010, 'kg'),
(54, 37, 0.100, 'kg'), (54, 38, 0.030, 'kg'), (54, 5, 0.100, 'kg'),
(55, 37, 0.100, 'kg'), (55, 38, 0.030, 'kg'), (55, 5, 0.100, 'kg'), (55, 12, 0.010, 'kg'),
(56, 37, 0.200, 'kg'), (56, 38, 0.080, 'kg'), (57, 37, 0.200, 'kg'), (57, 38, 0.050, 'kg'), (57, 5, 0.250, 'kg'),
(58, 37, 0.200, 'kg'), (58, 38, 0.050, 'kg'), (58, 5, 0.250, 'kg'), (58, 3, 0.050, 'kg'),
(59, 37, 0.400, 'kg'), (59, 38, 0.100, 'kg'), (59, 5, 0.500, 'kg'),
(60, 37, 0.200, 'kg'), (60, 38, 0.050, 'kg'), (60, 5, 0.250, 'kg'), (60, 11, 0.050, 'kg'),
(61, 37, 0.800, 'kg'), (61, 38, 0.200, 'kg'), (61, 5, 1.000, 'kg'),
(62, 37, 0.800, 'kg'), (62, 38, 0.200, 'kg'), (62, 5, 1.000, 'kg'), (62, 13, 0.050, 'kg'),
(63, 33, 0.100, 'kg'), (63, 4, 0.010, 'kg'), (64, 33, 0.100, 'kg'), (64, 4, 0.010, 'kg'), (64, 5, 0.050, 'kg'),
(65, 37, 0.100, 'kg'), (65, 4, 0.050, 'kg'), (66, 37, 0.100, 'kg'), (66, 4, 0.050, 'kg'), (66, 5, 0.080, 'kg'),
(67, 39, 1.0, 'u'), (68, 40, 1.0, 'u'), (69, 41, 1.0, 'u'), (70, 42, 0.050, 'kg'), (70, 43, 1.0, 'u');

-- =================================================================================
-- 4. CAMAREROS Y CLIENTES
-- =================================================================================

-- Camareros y Personal Extra
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

INSERT INTO Camarero (personal_id) VALUES
('camarero1@prueba.com'), ('camarero2@prueba.com'), ('camarero3@prueba.com'), ('camarero4@prueba.com'),
('camarero5@prueba.com'), ('camarero6@prueba.com'), ('camarero7@prueba.com'), ('camarero8@prueba.com'),
('camarero9@prueba.com'), ('camarero10@prueba.com');

-- Clientes
INSERT INTO Cliente (cliente_id, cliente_nombre, cliente_apellido) VALUES
('ana@example.com', 'Ana', 'Suárez'), ('bruno@example.com', 'Bruno', 'Silva'),
('carla@example.com', 'Carla', 'Rodríguez'), ('diego@example.com', 'Diego', 'Fernández')
ON DUPLICATE KEY UPDATE cliente_nombre = VALUES(cliente_nombre);

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

INSERT INTO Cliente_Alergia (cliente_id, cliente_alergia) VALUES
('ana@example.com', 'GLU'), ('bruno@example.com', 'LAC'), ('eduardo@example.com', 'NUE'),
('florencia@example.com', 'PES'), ('gustavo@example.com', 'MAR'), ('helena@example.com', 'GLU'),
('ivan@example.com', 'LAC'), ('julia@example.com', 'SOJ'), ('kevin@example.com', 'HUE'),
('laura@example.com', 'MAN'), ('martin@example.com', 'GLU'), ('natalia@example.com', 'LAC')
ON DUPLICATE KEY UPDATE cliente_alergia = VALUES(cliente_alergia);

-- =================================================================================
-- 5. MESAS Y PROMOCIONES
-- =================================================================================

INSERT INTO Mesa (mesa_id, mesa_estado, mesa_tiempo_uso, mesa_alcance, mesa_reservable, mesa_creacion) VALUES
(1, 'Libre', '00:00:00', 6, 'Si', CURDATE()), (2, 'Libre', '00:00:00', 6, 'Si', CURDATE()),
(3, 'Libre', '00:00:00', 6, 'Si', CURDATE()), (4, 'Libre', '00:00:00', 6, 'Si', CURDATE()),
(5, 'Ocupada', '01:15:30', 6, 'Si', CURDATE()), (6, 'Libre', '00:00:00', 6, 'Si', CURDATE()),
(10, 'Libre', '00:00:00', 4, 'Si', CURDATE()), (11, 'Libre', '00:00:00', 4, 'No', CURDATE()),
(12, 'Inhabilitada', '00:00:00', 4, 'No', CURDATE()), (13, 'Libre', '00:00:00', 4, 'Si', CURDATE()),
(14, 'Libre', '00:00:00', 4, 'Si', CURDATE()), (15, 'Libre', '00:00:00', 4, 'Si', CURDATE()),
(16, 'Libre', '00:00:00', 4, 'Si', CURDATE()), (17, 'Libre', '00:00:00', 4, 'Si', CURDATE()),
(18, 'Libre', '00:00:00', 4, 'Si', CURDATE()), (20, 'Libre', '00:00:00', 4, 'Si', CURDATE()),
(21, 'Libre', '00:00:00', 2, 'Si', CURDATE()), (22, 'Libre', '00:00:00', 4, 'Si', CURDATE()),
(23, 'Libre', '00:00:00', 4, 'Si', CURDATE()), (24, 'Libre', '00:00:00', 4, 'Si', CURDATE()),
(25, 'Libre', '00:00:00', 4, 'Si', CURDATE()), (26, 'Libre', '00:00:00', 4, 'Si', CURDATE()),
(27, 'Libre', '00:00:00', 4, 'Si', CURDATE());

INSERT INTO Promocion (promocion_nombre, promocion_descripcion, promocion_descuento, promocion_fidelizada, promocion_creacion) VALUES
('2x1 Cervezas', 'Happy hour de 19:00 a 21:00', 0.5, FALSE, CURDATE()),
('Pizza + Refresco', 'Pizzeta mozzarella + Refresco 1L', 0.15, FALSE, CURDATE()),
('Descuento Fidelidad', '10% off en toda la carta', 0.10, TRUE, CURDATE()),
('Jueves de Pastas', '20% off en todas las pastas', 0.20, FALSE, CURDATE()),
('Combo Picada', 'Gramajo Grande + 2 Cervezas', 0.15, FALSE, CURDATE()),
('Menu Vegetariano', '15% off en Menu Vegetariano', 0.15, FALSE, CURDATE()),
('Postre Gratis', 'Con la compra de un Asado', 0.0, FALSE, CURDATE()),
('Descuento Cumpleaños', '25% off para el cumpleañero', 0.25, TRUE, CURDATE()),
('Combo Familiar', '1 Metro Mozzarella + Refresco', 0.20, FALSE, CURDATE()),
('Tanos Noche', 'Descuento post 23:00', 0.10, FALSE, CURDATE());

INSERT INTO Producto_Criterio (producto_id, producto_criterio) VALUES
(1, 'Mas Vendido'), (2, 'Mas Vendido'), (47, 'Vegetariano'), (48, 'Vegetariano'),
(49, 'Vegetariano'), (50, 'Vegetariano'), (51, 'Vegetariano'), (17, 'Casero'),
(22, 'Casero'), (61, 'Para Compartir');

-- =================================================================================
-- 6. RESERVAS Y COMENTARIOS
-- =================================================================================

INSERT INTO Reserva (reserva_cantidad_personas, reserva_duracion, reserva_fecha, reserva_inicio, reserva_estado, cliente_id, mesa_id) VALUES
(4, '5', CURDATE(), '20:30:00', 'Pendiente', 'ana@example.com', 1),
(2, '6', CURDATE(), '21:00:00', 'Pendiente', 'bruno@example.com', 3),
(6, '3', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '21:30:00', 'Pendiente', 'eduardo@example.com', 6),
(4, '2', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', 'Pendiente', 'florencia@example.com', 4),
(2, '2', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '22:00:00', 'Pendiente', 'gustavo@example.com', 4),
(2, '3', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '21:00:00', 'Pendiente', 'martin@example.com', 16),
(4, '2', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '20:30:00', 'Pendiente', 'laura@example.com', 2),
(2, '1', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '21:00:00', 'Cancelada', 'ivan@example.com', 22),
(3, '2', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '20:00:00', 'Pendiente', 'carla@example.com', 1),
(5, '2', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '21:00:00', 'Pendiente', 'diego@example.com', 6);

INSERT INTO Comentario (producto_id, cliente_id, comentario_contenido, comentario_calificacion) VALUES
(1, 'ana@example.com', 'El gramajo estaba espectacular.', 4),
(61, 'eduardo@example.com', 'La mejor muzza de la zona.', 5),
(17, 'helena@example.com', 'Ravioles muy frescos.', 5),
(37, 'gustavo@example.com', 'El asado un poco duro.', 4),
(49, 'kevin@example.com', 'La mejor milanesa de soja.', 4),
(2, 'bruno@example.com', 'Abundante plato.', 4),
(54, 'carla@example.com', 'Clásica y rica.', 3),
(32, 'julia@example.com', 'A mi hijo le encantó.', 4),
(38, 'martin@example.com', 'Entrecot a punto.', 5),
(10, 'laura@example.com', 'Buena combinación.', 5);

-- =================================================================================
-- 7. PEDIDOS (HISTÓRICO Y ACTUAL) - ACTUALIZADO PARA VARIEDAD
-- =================================================================================

-- 7.1 Pedidos Recientes (Últimas 48h - Estado variado)
INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id) VALUES
('En-Preparacion', 'Sin cebolla', NOW(), 680.0, NULL, 'camarero1@prueba.com', 5),
('Pagado', 'Para llevar', DATE_SUB(NOW(), INTERVAL 2 HOUR), 1430.0, 'Efectivo', 'camarero2@prueba.com', 1),
('Pagado', 'Salsa extra', DATE_SUB(NOW(), INTERVAL 1 HOUR), 990.0, 'Tarjeta', 'camarero3@prueba.com', 2),
('Pagado', '', DATE_SUB(NOW(), INTERVAL 3 HOUR), 540.0, 'Efectivo', 'camarero1@prueba.com', 3),
('Pagado', 'Bien cocida', DATE_SUB(NOW(), INTERVAL 4 HOUR), 800.0, 'Tarjeta', 'camarero4@prueba.com', 4),
('Pagado', 'Picada primero', DATE_SUB(NOW(), INTERVAL 1 DAY), 2100.0, 'Tarjeta', 'camarero5@prueba.com', 6),
('Pagado', 'Mucha muzza', DATE_SUB(NOW(), INTERVAL 1 DAY), 680.0, 'Efectivo', 'camarero6@prueba.com', 12),
('Pagado', 'Sin sal', DATE_SUB(NOW(), INTERVAL 1 DAY), 560.0, 'Efectivo', 'camarero7@prueba.com', 11),
('Pagado', '', DATE_SUB(NOW(), INTERVAL 2 DAY), 1350.0, 'Tarjeta', 'camarero8@prueba.com', 10),
('Pagado', 'Para llevar', DATE_SUB(NOW(), INTERVAL 2 DAY), 420.0, 'Tarjeta', 'camarero9@prueba.com', 1);

INSERT INTO Efectua (pedido_id, cliente_id) VALUES
(1, 'ana@example.com'), (2, 'bruno@example.com'), (3, 'carla@example.com'), (4, 'diego@example.com'),
(5, 'eduardo@example.com'), (6, 'florencia@example.com'), (7, 'gustavo@example.com'), (8, 'helena@example.com'),
(9, 'ivan@example.com'), (10, 'julia@example.com');

INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES
(1, 2, 1), (2, 57, 1), (2, 4, 1), (2, 5, 1), (3, 61, 1), (4, 17, 1), (5, 36, 2),
(6, 1, 2), (6, 7, 1), (6, 6, 1), (7, 37, 1), (8, 46, 1), (9, 49, 2), (9, 51, 1), (10, 16, 1);

INSERT INTO Posee (promocion_id, producto_id, pedido_id) VALUES
(2, 57, 2), (9, 61, 3), (4, 17, 4), (3, 36, 5), (5, 1, 6), (5, 7, 6),
(3, 37, 7), (6, 49, 9), (6, 51, 9), (3, 16, 10);

-- 7.2 "BEST SELLERS" (Lote masivo para Coca-Cola y Pizzas) - Hace 5-10 días
-- Esto creará picos en los gráficos de productos

-- Pedido Masivo 1: Pizzas y Cocas (Mesa Grande)
INSERT INTO Pedido (pedido_estado, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id)
VALUES ('Pagado', DATE_SUB(NOW(), INTERVAL 5 DAY), 3500.00, 'Tarjeta', 'camarero1@prueba.com', 1);
INSERT INTO Efectua (pedido_id, cliente_id) VALUES (LAST_INSERT_ID(), 'eduardo@example.com');
INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES 
(LAST_INSERT_ID(), 61, 3), -- 3 Metros Pizza
(LAST_INSERT_ID(), 67, 4), -- 4 Cocas
(LAST_INSERT_ID(), 70, 6); -- 6 Flanes

-- Pedido Masivo 2: Noche de Cervezas (Grupo Amigos)
INSERT INTO Pedido (pedido_estado, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id)
VALUES ('Pagado', DATE_SUB(NOW(), INTERVAL 6 DAY), 2200.00, 'Efectivo', 'camarero3@prueba.com', 6);
INSERT INTO Efectua (pedido_id, cliente_id) VALUES (LAST_INSERT_ID(), 'kevin@example.com');
INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES 
(LAST_INSERT_ID(), 68, 8), -- 8 Cervezas Patricia
(LAST_INSERT_ID(), 2, 2);  -- 2 Gramajos

-- Pedido Masivo 3: Almuerzo Familiar (Domingo pasado)
INSERT INTO Pedido (pedido_estado, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id)
VALUES ('Pagado', DATE_SUB(NOW(), INTERVAL 10 DAY), 1800.00, 'Tarjeta', 'camarero2@prueba.com', 4);
INSERT INTO Efectua (pedido_id, cliente_id) VALUES (LAST_INSERT_ID(), 'ana@example.com');
INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES 
(LAST_INSERT_ID(), 34, 3), -- 3 Hamburguesas
(LAST_INSERT_ID(), 67, 2), -- 2 Cocas
(LAST_INSERT_ID(), 69, 1); -- 1 Agua

-- Pedido Masivo 4: Comida Rápida (Hace 2 semanas)
INSERT INTO Pedido (pedido_estado, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id)
VALUES ('Pagado', DATE_SUB(NOW(), INTERVAL 14 DAY), 900.00, 'Efectivo', 'camarero5@prueba.com', 12);
INSERT INTO Efectua (pedido_id, cliente_id) VALUES (LAST_INSERT_ID(), 'diego@example.com');
INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES 
(LAST_INSERT_ID(), 59, 2), -- 2 Medios Metros
(LAST_INSERT_ID(), 67, 2); -- 2 Cocas

-- Pedido Masivo 5: Fiesta Infantil (Muchos Nuggets y Papas)
INSERT INTO Pedido (pedido_estado, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id)
VALUES ('Pagado', DATE_SUB(NOW(), INTERVAL 20 DAY), 4200.00, 'Tarjeta', 'camarero10@prueba.com', 1);
INSERT INTO Efectua (pedido_id, cliente_id) VALUES (LAST_INSERT_ID(), 'julia@example.com');
INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES 
(LAST_INSERT_ID(), 5, 5),  -- 5 Porciones Nuggets
(LAST_INSERT_ID(), 23, 5), -- 5 Porciones Fritas
(LAST_INSERT_ID(), 67, 4); -- 4 Cocas

-- 7.3 Pedidos EN VIVO (Estado actual del restaurante para la DEMO)
-- MESA 20 (Ocupada, Pedido Pendiente)
UPDATE Mesa SET mesa_estado = 'Ocupada' WHERE mesa_id = 20;
INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id)
VALUES ('Pendiente', 'Sin sal las papas', NOW(), 950.00, NULL, 'camarero5@prueba.com', 20);
INSERT INTO Efectua (pedido_id, cliente_id) VALUES (LAST_INSERT_ID(), 'florencia@example.com');
INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES (LAST_INSERT_ID(), 28, 2), (LAST_INSERT_ID(), 67, 1);

-- MESA 22 (Ocupada, En Cocina)
UPDATE Mesa SET mesa_estado = 'Ocupada' WHERE mesa_id = 22;
INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id)
VALUES ('En-Preparacion', 'Punto jugoso', DATE_SUB(NOW(), INTERVAL 15 MINUTE), 1200.00, NULL, 'camarero4@prueba.com', 22);
INSERT INTO Efectua (pedido_id, cliente_id) VALUES (LAST_INSERT_ID(), 'gustavo@example.com');
INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES (LAST_INSERT_ID(), 38, 1), (LAST_INSERT_ID(), 25, 1), (LAST_INSERT_ID(), 68, 1);

-- MESA 24 (Ocupada, Comiendo/Entregado)
UPDATE Mesa SET mesa_estado = 'Ocupada' WHERE mesa_id = 24;
INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id)
VALUES ('Entregado', '', DATE_SUB(NOW(), INTERVAL 45 MINUTE), 580.00, NULL, 'camarero6@prueba.com', 24);
INSERT INTO Efectua (pedido_id, cliente_id) VALUES (LAST_INSERT_ID(), 'natalia@example.com');
INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES (LAST_INSERT_ID(), 59, 1);

-- =================================================================================
-- 8. NO SHOWS Y FIDELIZACIÓN (CON VARIEDAD DE DATOS)
-- =================================================================================

-- 8.1 Generación de No-Shows (Ivan y Natalia son los clientes "problemáticos")
-- Ivan (4 No-Shows)
INSERT INTO Reserva (reserva_cantidad_personas, reserva_duracion, reserva_fecha, reserva_inicio, reserva_estado, cliente_id, mesa_id) VALUES
(2, '2', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '21:00:00', 'No-Show', 'ivan@example.com', 1),
(2, '2', DATE_SUB(CURDATE(), INTERVAL 10 DAY), '21:00:00', 'No-Show', 'ivan@example.com', 1),
(4, '2', DATE_SUB(CURDATE(), INTERVAL 20 DAY), '21:00:00', 'No-Show', 'ivan@example.com', 1),
(2, '2', DATE_SUB(CURDATE(), INTERVAL 25 DAY), '21:00:00', 'No-Show', 'ivan@example.com', 1);

INSERT INTO No_Show (cliente_id, reserva_id, no_show_fecha, no_show_hora) VALUES
('ivan@example.com', 11, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '21:00:00'), -- ID manual asumido
('ivan@example.com', 12, DATE_SUB(CURDATE(), INTERVAL 10 DAY), '21:00:00'),
('ivan@example.com', 13, DATE_SUB(CURDATE(), INTERVAL 20 DAY), '21:00:00'),
('ivan@example.com', 14, DATE_SUB(CURDATE(), INTERVAL 25 DAY), '21:00:00');

-- Natalia (3 No-Shows)
INSERT INTO Reserva (reserva_cantidad_personas, reserva_duracion, reserva_fecha, reserva_inicio, reserva_estado, cliente_id, mesa_id) VALUES
(4, '2', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '20:30:00', 'No-Show', 'natalia@example.com', 11),
(4, '2', DATE_SUB(CURDATE(), INTERVAL 15 DAY), '20:30:00', 'No-Show', 'natalia@example.com', 11),
(4, '2', DATE_SUB(CURDATE(), INTERVAL 22 DAY), '20:30:00', 'No-Show', 'natalia@example.com', 11);

INSERT INTO No_Show (cliente_id, reserva_id, no_show_fecha, no_show_hora) VALUES
('natalia@example.com', 15, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '20:30:00'),
('natalia@example.com', 16, DATE_SUB(CURDATE(), INTERVAL 15 DAY), '20:30:00'),
('natalia@example.com', 17, DATE_SUB(CURDATE(), INTERVAL 22 DAY), '20:30:00');

-- Otros Clientes (1 No-Show cada uno)
INSERT INTO Reserva (reserva_cantidad_personas, reserva_duracion, reserva_fecha, reserva_inicio, reserva_estado, cliente_id, mesa_id) VALUES
(2, '1', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '22:00:00', 'No-Show', 'ana@example.com', 3),
(6, '2', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '21:00:00', 'No-Show', 'eduardo@example.com', 6),
(3, '2', DATE_SUB(CURDATE(), INTERVAL 3 DAY), '20:00:00', 'No-Show', 'bruno@example.com', 4);

INSERT INTO No_Show (cliente_id, reserva_id, no_show_fecha, no_show_hora) VALUES
('ana@example.com', 18, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '22:00:00'),
('eduardo@example.com', 19, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '21:00:00'),
('bruno@example.com', 20, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '20:00:00');

-- 8.2 Solicitudes de Fidelización (Variadas)
INSERT INTO Fidelizacion_Solicitud (cliente_id, solicitud_fecha, solicitud_estado) VALUES
('carla@example.com', DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Pendiente'),
('diego@example.com', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Rechazada'),
('ana@example.com', DATE_SUB(NOW(), INTERVAL 5 HOUR), 'Pendiente'),
('natalia@example.com', DATE_SUB(NOW(), INTERVAL 3 DAY), 'Aprobada'), -- Ya procesada
('ivan@example.com', DATE_SUB(NOW(), INTERVAL 10 DAY), 'Rechazada'); -- Cliente problematico rechazado

-- 8.3 Reservas Futuras (Para mostrar calendario lleno)
INSERT INTO Reserva (reserva_cantidad_personas, reserva_duracion, reserva_fecha, reserva_inicio, reserva_estado, cliente_id, mesa_id) VALUES
(10, '4', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '21:00:00', 'Confirmada', 'kevin@example.com', 1),
(2, '2', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '20:00:00', 'Pendiente', 'florencia@example.com', 15),
(4, '3', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '20:00:00', 'Confirmada', 'julia@example.com', 2),
(6, '4', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '21:30:00', 'Pendiente', 'martin@example.com', 6);