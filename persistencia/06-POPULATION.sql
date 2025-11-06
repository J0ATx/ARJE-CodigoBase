USE lostrestanosdb;

-- GRUPO 1: Tablas "Hijas" (Nivel mÃ¡s bajo de dependencia)
-- Estas tablas referencian a otras, pero ninguna otra tabla las referencia a ellas.
-- TRUNCATE TABLE No_Show;
-- TRUNCATE TABLE Posee;
-- TRUNCATE TABLE Contiene;
-- TRUNCATE TABLE Efectua;
-- TRUNCATE TABLE Consume;
-- TRUNCATE TABLE Comentario;
-- TRUNCATE TABLE Producto_Criterio;
-- TRUNCATE TABLE Stock_Cantidad;
-- TRUNCATE TABLE Empresa_Horario;
-- TRUNCATE TABLE Empresa_Telefono;
-- TRUNCATE TABLE Empresa_Ubicacion;
-- TRUNCATE TABLE Cliente_Alergia;
-- TRUNCATE TABLE Camarero;
-- TRUNCATE TABLE Chef_Ejecutivo;
-- TRUNCATE TABLE Gerente_General;

-- GRUPO 2: Tablas "Intermedias"
-- Estas son referenciadas por el GRUPO 1, pero a su vez referencian a otras.
-- TRUNCATE TABLE Reserva;
-- TRUNCATE TABLE Pedido;
-- TRUNCATE TABLE Producto;
-- TRUNCATE TABLE Empresa;

-- GRUPO 3: Tablas "Padre" o "RaÃ­z"
-- Estas son las tablas principales que son referenciadas por el GRUPO 2.
-- TRUNCATE TABLE Personal;
-- TRUNCATE TABLE Cliente;
-- TRUNCATE TABLE Mesa;
-- TRUNCATE TABLE Promocion;
-- TRUNCATE TABLE Stock;

-- GRUPO 4: Tablas Independientes
-- Tablas sin claves forÃ¡neas (ni de entrada ni de salida)
-- TRUNCATE TABLE image_id_sequence;

-- Email: gerente@prueba.com
-- ContraseÃ±a: gerente123 (hasheada correctamente con password_hash)
INSERT INTO Personal (personal_nombre, personal_apellido, personal_contrasenia, personal_id, personal_telefono, personal_rol) VALUES ('Gerente', 'Prueba', '$2y$10$gy0d3tiaoPcx3J34cw2ia.4dV42Zea1VvGt75nqikQZGxDJpLtERy', 'gerente@prueba.com', 123456789, 'Gerente-General');
INSERT INTO Gerente_General (personal_id) VALUES ('gerente@prueba.com');

INSERT INTO Personal (personal_id, personal_nombre, personal_apellido, personal_telefono, personal_contrasenia, personal_calificacion, personal_rol) VALUES
('chefejecutivo@prueba.com', 'Chef', 'Ejecutivo', 99123456, 'hashed_password', '10', 'Chef-Ejecutivo');

INSERT INTO Chef_Ejecutivo (personal_id) VALUES
('chefejecutivo@prueba.com');

insert into Empresa (empresa_nombre, empresa_mision, empresa_vision, empresa_whatsapp, empresa_instagram, empresa_facebook, personal_id) VALUES ("Los 3 Tanos", "Vender buena comida", "Vender MÃS buena comida", "092412772", "los3tanos_pizzeria", "Pizzeria Los 3 Tanos | AtlÃ¡ntida", "gerente@prueba.com");
UPDATE Empresa SET
           empresa_valores = "no comer, no matar"
            WHERE empresa_id = 1;
insert into Empresa_Telefono (empresa_id, empresa_telefono) VALUES ("1", "43729333");
insert into Empresa_Ubicacion (empresa_id, empresa_ciudad, empresa_calle) 
VALUES ("1", "Las Toscas", "M. Ferreira y Central");
INSERT INTO Empresa_Horario (empresa_id, empresa_dia, empresa_hora) 
VALUES 
	("1", "Martes", "19:00 - 00:00"), 
	("1", "MiÃ©rcoles", "19:00 - 00:00"), 
    ("1", "Jueves", "19:00 - 00:00"),
    ("1", "Viernes", "19:00 - 00:00"),
    ("1", "SÃ¡bado", "12:00 - 16:00"),
    ("1", "SÃ¡bado", "19:00 - 00:00"),
    ("1", "Domingo", "12:00 - 16:00"),
    ("1", "Domingo", "19:00 - 00:00");


INSERT INTO Cliente (cliente_id, cliente_nombre, cliente_apellido)
VALUES
  ('ana@example.com',    'Ana',    'SuÃ¡rez'),
  ('bruno@example.com',  'Bruno',  'Silva'),
  ('carla@example.com',  'Carla',  'RodrÃ­guez'),
  ('diego@example.com',  'Diego',  'FernÃ¡ndez')
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
(3, 'JamÃ³n', DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
(4, 'Cebolla', DATE_ADD(CURDATE(), INTERVAL 60 DAY)),
(5, 'Mozzarella', DATE_ADD(CURDATE(), INTERVAL 45 DAY)),
(6, 'Anillos de Calamar Rebozados', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(7, 'Nuggets de Pollo', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(8, 'Aros de Cebolla Empanizados', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(9, 'Pan de SÃ¡ndwich', DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(10, 'PiÃ±a en Rodajas', DATE_ADD(CURDATE(), INTERVAL 365 DAY)),
(11, 'Tomate', DATE_ADD(CURDATE(), INTERVAL 15 DAY)),
(12, 'MorrÃ³n', DATE_ADD(CURDATE(), INTERVAL 20 DAY)),
(13, 'Aceitunas', DATE_ADD(CURDATE(), INTERVAL 45 DAY)),
(14, 'Panchos (Schneck)', DATE_ADD(CURDATE(), INTERVAL 40 DAY)),
(15, 'Panceta', DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
(16, 'Ricotta', DATE_ADD(CURDATE(), INTERVAL 15 DAY)),
(17, 'Espinaca', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(18, 'Pasta para Ravioles', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(19, 'Pasta para Tallarines', DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
(20, 'Papa para Ã‘oquis/PurÃ©', DATE_ADD(CURDATE(), INTERVAL 60 DAY)),
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
INSERT INTO Producto (producto_id, producto_nombre, producto_precio, producto_descripcion, producto_receta, producto_tiempo_preparacion, producto_creacion, producto_categoria, personal_id) VALUES
(1, 'Gramajo Chico', 450.00, 'Huevo revuelto con papas, jamÃ³n y cebolla.', 'Saltear jamÃ³n y cebolla en sartÃ©n, agregar papas fritas y huevos batidos. Revolver hasta cocer.', '15 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(2, 'Gramajo Grande', 680.00, 'VersiÃ³n mÃ¡s grande del Gramajo Chico con ingredientes similares.', 'Doblar cantidad de ingredientes del Gramajo Chico y cocinar del mismo modo.', '20 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(3, 'Fritas con Salsa', 400.00, 'Papas fritas crujientes acompaÃ±adas con salsa.', 'Cortar papas en bastones, freÃ­r en aceite caliente y acompaÃ±ar con salsa elegida.', '10 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(4, 'Rabas', 420.00, 'Anillos de calamar rebozados y fritos.', 'Rebozar anillos de calamar en harina y freÃ­r hasta dorar.', '12 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(5, 'Nuggets (16 Unidades)', 440.00, 'PorciÃ³n de 16 nuggets de pollo fritos.', 'FreÃ­r los nuggets congelados hasta dorar y escurrir el exceso de aceite.', '10 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(6, 'Aritos de Cebolla', 400.00, 'Aros de cebolla empanizados y fritos.', 'Pasar los aros por harina, huevo y pan rallado, freÃ­r hasta dorar.', '10 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(7, 'Miniaturas (16 unidades)', 460.00, 'Una picada con pescados y mariscos.', 'Rebozar las miniaturas y freÃ­r en aceite caliente hasta dorar.', '15 min', CURDATE(), 'Para Picar', 'chefejecutivo@prueba.com'),
(8, 'SÃ¡ndwich Caliente', 290.00, 'Sandwich caliente clÃ¡sico con fiambre y pan.', 'Rellenar pan con jamÃ³n y queso, tostar hasta derretir el queso.', '5 min', CURDATE(), 'SÃ¡ndwiches', 'chefejecutivo@prueba.com'),
(9, 'SÃ¡ndwich Caliente con Mozzarella', 340.00, 'Sandwich caliente con fiambre y mozzarella.', 'Agregar mozzarella al relleno y calentar hasta fundir.', '7 min', CURDATE(), 'SÃ¡ndwiches', 'chefejecutivo@prueba.com'),
(10, 'SÃ¡ndwich Tropical', 380.00, 'Sandwich con jamÃ³n, queso, y rodajas de piÃ±a.', 'Tostar el pan, agregar jamÃ³n, queso y piÃ±a en rodajas.', '8 min', CURDATE(), 'SÃ¡ndwiches', 'chefejecutivo@prueba.com'),
(11, 'SÃ¡ndwich Napolitano', 380.00, 'Sandwich con jamÃ³n, queso, tomate y morrÃ³n.', 'Armar con pan, jamÃ³n, queso, tomate y morrÃ³n asado, calentar.', '8 min', CURDATE(), 'SÃ¡ndwiches', 'chefejecutivo@prueba.com'),
(12, 'SÃ¡ndwich OlÃ­mpico', 300.00, 'Sandwich con jamÃ³n, queso, huevo duro y aceitunas.', 'Intercalar capas de jamÃ³n, queso, huevo y aceitunas entre pan.', '6 min', CURDATE(), 'SÃ¡ndwiches', 'chefejecutivo@prueba.com'),
(13, 'SÃ¡ndwich Napolitano Tropical', 420.00, 'SÃ¡ndwich Napolitano con adiciÃ³n de piÃ±a.', 'Preparar como el napolitano y agregar rodajas de piÃ±a.', '10 min', CURDATE(), 'SÃ¡ndwiches', 'chefejecutivo@prueba.com'),
(14, 'Pancho al Pan (Schneck)', 140.00, 'Pancho clÃ¡sico con salchicha tipo schneck.', 'Cocinar la salchicha y colocar en pan caliente.', '5 min', CURDATE(), 'Panchos', 'chefejecutivo@prueba.com'),
(15, 'Pancho al Pan con Muzzarella y Panceta', 180.00, 'Pancho con salchicha, mozzarella y panceta.', 'Agregar mozzarella derretida y panceta crocante sobre la salchicha.', '7 min', CURDATE(), 'Panchos', 'chefejecutivo@prueba.com'),
(16, 'Pancho al Pan con Fritas (Doble)', 420.00, 'Doble pancho con mozzarella, jamÃ³n, huevo y fritas.', 'Armar doble salchicha con los toppings, acompaÃ±ar con papas fritas.', '10 min', CURDATE(), 'Panchos', 'chefejecutivo@prueba.com'),
(17, 'Ravioles de Verdura con salsa', 540.00, 'Ravioles rellenos de verduras con salsa a elecciÃ³n.', 'Hervir los ravioles y cubrir con salsa roja, blanca o mixta.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(18, 'Ravioles de Ricotta con salsa', 540.00, 'Ravioles rellenos de ricotta con salsa a elecciÃ³n.', 'Cocer los ravioles y baÃ±ar con salsa seleccionada.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(19, 'Tallarines (morrÃ³n, huevo, albahaca) con salsa', 420.00, 'Pasta fresca con morrÃ³n, huevo y albahaca, con salsa.', 'Hervir la pasta y mezclar con salsa de tomate o crema.', '18 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(20, 'Sorrentinos de jamÃ³n y muzzarella con salsa', 540.00, 'Sorrentinos de jamÃ³n y mozzarella con salsa.', 'Cocer los sorrentinos y servir con salsa a elecciÃ³n.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(21, 'Sorrentinos de espinaca y ricotta con salsa', 540.00, 'Sorrentinos de espinaca y ricotta con salsa.', 'Hervir los sorrentinos y cubrir con salsa de tomate o crema.', '20 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(22, 'Ã‘oquis de papa con salsa', 420.00, 'Ã‘oquis caseros de papa con salsa a elecciÃ³n.', 'Cocer los Ã±oquis en agua hirviendo y servir con salsa.', '18 min', CURDATE(), 'Pastas (Caseras)', 'chefejecutivo@prueba.com'),
(23, 'Fritas (PorciÃ³n)', 270.00, 'PorciÃ³n individual de papas fritas.', 'Cortar y freÃ­r papas hasta dorar, salar al gusto.', '10 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(24, 'Noisette', 300.00, 'PorciÃ³n de papas noisette (pequeÃ±as y redondas).', 'FreÃ­r las papas noisette congeladas hasta dorar.', '10 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(25, 'Ensalada Mixta', 270.00, 'Lechuga, tomate, cebolla y zanahoria.', 'Lavar y cortar los vegetales, mezclar y aliÃ±ar.', '5 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(26, 'Ensalada Rusa', 270.00, 'Papa, zanahoria, arvejas y mayonesa.', 'Hervir verduras, enfriar y mezclar con mayonesa.', '10 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(27, 'PurÃ© de Papas', 250.00, 'PurÃ© cremoso de papas.', 'Hervir papas, pisar y mezclar con manteca y leche.', '15 min', CURDATE(), 'Porciones', 'chefejecutivo@prueba.com'),
(28, 'Hamburguesa con Fritas (plato o pan)', 300.00, 'Hamburguesa sencilla con papas fritas.', 'Cocinar hamburguesa a la plancha y servir con fritas.', '10 min', CURDATE(), 'MenÃº para los pequeÃ±os', 'chefejecutivo@prueba.com'),
(29, 'Pancho con Fritas (MenÃº PequeÃ±o)', 300.00, 'Pancho con salchicha y papas fritas.', 'Servir pancho clÃ¡sico acompaÃ±ado de papas fritas.', '10 min', CURDATE(), 'MenÃº para los pequeÃ±os', 'chefejecutivo@prueba.com'),
(30, 'Nuggets con Fritas (MenÃº PequeÃ±o)', 380.00, 'Nuggets de pollo con papas fritas.', 'FreÃ­r nuggets y acompaÃ±ar con papas fritas reciÃ©n hechas.', '10 min', CURDATE(), 'MenÃº para los pequeÃ±os', 'chefejecutivo@prueba.com'),
(31, 'Hamburguesa (schneck) al pan con fritas', 380.00, 'Hamburguesa con jamÃ³n y mozzarella, acompaÃ±ada con fritas.', 'Cocinar la hamburguesa, agregar jamÃ³n y mozzarella, servir con fritas.', '10 min', CURDATE(), 'MenÃº para los pequeÃ±os', 'chefejecutivo@prueba.com'),
(32, 'Finito de lomo con purÃ©', 400.00, 'Bife finito de lomo con purÃ© de papas.', 'Cocinar el bife a la plancha y servir con purÃ© caliente.', '20 min', CURDATE(), 'MenÃº para los pequeÃ±os', 'chefejecutivo@prueba.com'),
(33, 'Miniaturas (MenÃº PequeÃ±o)', 400.00, 'PorciÃ³n de miniaturas para picar.', 'FreÃ­r miniaturas hasta dorar, escurrir y servir.', '15 min', CURDATE(), 'MenÃº para los pequeÃ±os', 'chefejecutivo@prueba.com'),
(34, 'Hamburguesa con fritas (lechuga/tomate)', 320.00, 'Hamburguesa clÃ¡sica con lechuga y tomate con papas fritas.', 'Cocinar hamburguesa y montar con vegetales, servir con fritas.', '10 min', CURDATE(), 'Hamburguesas', 'chefejecutivo@prueba.com'),
(35, 'Hamburguesa completa al plato con fritas', 400.00, 'Hamburguesa con ingredientes adicionales servida en plato con fritas.', 'Agregar jamÃ³n, queso, huevo y panceta a la hamburguesa, acompaÃ±ar con fritas.', '15 min', CURDATE(), 'Hamburguesas', 'chefejecutivo@prueba.com'),
(36, 'Hamburguesa completa al pan con fritas', 400.00, 'Hamburguesa completa servida en pan con papas fritas.', 'Montar hamburguesa con todos los ingredientes en pan y servir con fritas.', '15 min', CURDATE(), 'Hamburguesas', 'chefejecutivo@prueba.com'),
(37, 'Asado de tira, 1 chorizo + guarniciÃ³n', 680.00, 'Corte de carne asada con chorizo y guarniciÃ³n a la plancha.', 'Asar carne y chorizo, servir con guarniciÃ³n elegida.', '30 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(38, 'Entrecot grillÃ© con guarniciÃ³n', 550.00, 'Entrecot a la parrilla con guarniciÃ³n.', 'Sellar el entrecot en parrilla y servir con acompaÃ±amiento.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(39, 'Entrecot grillÃ© con guarniciÃ³n y salsa', 650.00, 'Entrecot a la parrilla con guarniciÃ³n y salsa.', 'Cocinar el entrecot y baÃ±ar con salsa elegida antes de servir.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(40, 'Suprema grillÃ© con guarniciÃ³n', 550.00, 'Suprema de pollo a la parrilla con guarniciÃ³n.', 'Asar la suprema y servir con purÃ© o ensalada.', '20 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(41, 'Suprema grillÃ© con guarniciÃ³n y salsa', 650.00, 'Suprema de pollo a la parrilla con guarniciÃ³n y salsa.', 'Cocinar la suprema y cubrir con salsa antes de servir.', '20 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(42, 'Costilla a la Riojana con guarniciÃ³n', 650.00, 'Costillas cocinadas al estilo riojano con guarniciÃ³n.', 'Cocinar costillas con morrÃ³n, cebolla, tomate y servir con guarniciÃ³n.', '30 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(43, 'Tortilla de papa (con mixta)', 400.00, 'Tortilla de papa tradicional con ensalada mixta.', 'Batir huevos, aÃ±adir papas cocidas y cebolla, cocinar en sartÃ©n.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(44, 'Tortilla a la espaÃ±ola (con mixta)', 450.00, 'Tortilla espaÃ±ola con ensalada mixta.', 'Preparar con papas, cebolla y chorizo, dorar por ambos lados.', '25 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(45, 'Omelette con mixta', 360.00, 'Omelette servido con ensalada mixta.', 'Batir huevos, cocinar en sartÃ©n y doblar con relleno si aplica.', '10 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(46, 'Merluza a la plancha con guarniciÃ³n', 560.00, 'Filete de merluza a la plancha con guarniciÃ³n.', 'Cocinar la merluza a fuego medio y servir con guarniciÃ³n.', '20 min', CURDATE(), 'Asados', 'chefejecutivo@prueba.com'),
(47, 'Hamburguesa de soja al pan con guarniciÃ³n', 340.00, 'Hamburguesa vegetariana de soja en pan con guarniciÃ³n.', 'Cocinar hamburguesa de soja y servir en pan con ensalada o fritas.', '15 min', CURDATE(), 'MenÃº Vegetariano', 'chefejecutivo@prueba.com'),
(48, 'Hamburguesa de soja al plato con guarniciÃ³n', 400.00, 'Hamburguesa vegetariana de soja en plato con guarniciÃ³n.', 'Cocinar hamburguesa y acompaÃ±ar con purÃ© o ensalada.', '15 min', CURDATE(), 'MenÃº Vegetariano', 'chefejecutivo@prueba.com'),
(49, 'Milanesa de soja con guarniciÃ³n', 450.00, 'Milanesa vegetariana de soja con guarniciÃ³n.', 'Rebozar la milanesa y freÃ­r, servir con guarniciÃ³n elegida.', '20 min', CURDATE(), 'MenÃº Vegetariano', 'chefejecutivo@prueba.com'),
(50, 'Pancho de soja', 115.00, 'Pancho vegetariano con salchicha de soja.', 'Cocinar la salchicha vegetal y servir en pan.', '5 min', CURDATE(), 'MenÃº Vegetariano', 'chefejecutivo@prueba.com'),
(51, 'Gramajo chico (Vegetariano)', 450.00, 'Gramajo chico sin carne.', 'Saltear cebolla y papas, agregar huevo batido y revolver.', '15 min', CURDATE(), 'MenÃº Vegetariano', 'chefejecutivo@prueba.com'),
(52, 'PorciÃ³n al tomate', 150.00, 'PorciÃ³n de pizza solo con salsa de tomate.', 'Extender masa, cubrir con salsa de tomate y hornear.', '10 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(53, 'PorciÃ³n al tomate con gusto', 220.00, 'PorciÃ³n de pizza con tomate y un gusto extra.', 'Agregar ingrediente extra sobre salsa antes de hornear.', '12 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(54, 'PorciÃ³n de muzzarella', 290.00, 'PorciÃ³n de pizza con mozzarella.', 'Cubrir la masa con salsa y mozzarella, hornear hasta dorar.', '10 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(55, 'PorciÃ³n de muzzarella con gusto', 280.00, 'PorciÃ³n de pizza con mozzarella y un gusto extra.', 'Agregar ingrediente adicional sobre la mozzarella y hornear.', '12 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(56, 'Pizzeta al tomate', 360.00, 'Pizza pequeÃ±a con salsa de tomate.', 'Formar base, cubrir con salsa de tomate y hornear.', '15 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(57, 'Pizzeta con mozzarella', 460.00, 'Pizza pequeÃ±a con mozzarella.', 'Cubrir base con salsa y mozzarella, hornear hasta derretir.', '18 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(58, 'Pizzeta con mozzarella con gusto', 590.00, 'Pizza pequeÃ±a con mozzarella y un gusto extra.', 'Agregar ingrediente adicional y hornear hasta dorar.', '20 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(59, '1/2 metro de mozzarella', 580.00, 'Medio metro de pizza con mozzarella.', 'Extender masa de medio metro, agregar salsa y queso, hornear.', '20 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(60, '1/4 metro de mozzarella con gusto', 450.00, 'Cuarto de metro de pizza con mozzarella y un gusto.', 'Agregar ingrediente adicional y hornear.', '15 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(61, 'Metro de mozzarella', 990.00, 'Un metro de pizza con mozzarella.', 'Extender masa larga, cubrir con salsa y queso, hornear hasta dorar.', '25 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(62, 'Metro de mozzarella con gusto', 1290.00, 'Un metro de pizza con mozzarella y un gusto extra.', 'Agregar ingrediente adicional sobre la pizza antes de hornear.', '28 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(63, 'PorciÃ³n de fainÃ¡', 150.00, 'PorciÃ³n de fainÃ¡ simple.', 'Mezclar harina de garbanzo con agua y aceite, hornear.', '10 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(64, 'PorciÃ³n de fainÃ¡ con mozzarella', 210.00, 'PorciÃ³n de fainÃ¡ con mozzarella.', 'Agregar mozzarella sobre la fainÃ¡ y gratinar.', '12 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(65, 'PorciÃ³n figazza', 210.00, 'PorciÃ³n de pizza figazza (cebolla).', 'Cubrir masa con cebolla en pluma y hornear.', '10 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com'),
(66, 'PorciÃ³n de fugazzeta', 280.00, 'PorciÃ³n de fugazzeta (cebolla y queso).', 'Agregar cebolla sobre mozzarella, hornear hasta gratinar.', '10 min', CURDATE(), 'PizzerÃ­a', 'chefejecutivo@prueba.com');

INSERT INTO Consume (producto_id, stock_id, consume_cantidad, consume_medida) VALUES
-- Para Picar (1-7)
(1, 1, 2.0, 'u'), (1, 2, 0.150, 'kg'), (1, 3, 0.050, 'kg'), (1, 4, 0.020, 'kg'), -- Gramajo Chico
(2, 1, 3.0, 'u'), (2, 2, 0.300, 'kg'), (2, 3, 0.100, 'kg'), (2, 4, 0.040, 'kg'), -- Gramajo Grande
(3, 2, 0.250, 'kg'), -- Fritas con Salsa
(4, 6, 0.150, 'kg'), -- Rabas
(5, 7, 16.0, 'u'), -- Nuggets (16)
(6, 8, 0.150, 'kg'), -- Aritos de Cebolla
(7, 7, 8.0, 'u'), (7, 6, 0.080, 'kg'), -- Miniaturas

-- SÃ¡ndwiches (8-13)
(8, 9, 2.0, 'u'), (8, 3, 0.050, 'kg'), (8, 5, 0.050, 'kg'), -- SÃ¡ndwich Caliente
(9, 9, 2.0, 'u'), (9, 3, 0.050, 'kg'), (9, 5, 0.100, 'kg'), -- SÃ¡ndwich Caliente con Mozza
(10, 9, 2.0, 'u'), (10, 3, 0.050, 'kg'), (10, 5, 0.050, 'kg'), (10, 10, 0.050, 'kg'), -- SÃ¡ndwich Tropical
(11, 9, 2.0, 'u'), (11, 3, 0.050, 'kg'), (11, 5, 0.050, 'kg'), (11, 11, 0.050, 'kg'), (11, 12, 0.050, 'kg'), -- SÃ¡ndwich Napolitano
(12, 9, 2.0, 'u'), (12, 3, 0.050, 'kg'), (12, 5, 0.050, 'kg'), (12, 1, 1.0, 'u'), (12, 13, 0.020, 'kg'), -- SÃ¡ndwich OlÃ­mpico
(13, 9, 2.0, 'u'), (13, 10, 0.050, 'kg'), (13, 11, 0.050, 'kg'), (13, 12, 0.050, 'kg'), (13, 5, 0.050, 'kg'), -- SÃ¡ndwich Napolitano Tropical

-- Panchos (14-16)
(14, 14, 1.0, 'u'), (14, 9, 1.0, 'u'), -- Pancho al Pan
(15, 14, 1.0, 'u'), (15, 9, 1.0, 'u'), (15, 5, 0.050, 'kg'), (15, 15, 0.030, 'kg'), -- Pancho con Mozza y Panceta
(16, 14, 2.0, 'u'), (16, 9, 2.0, 'u'), (16, 2, 0.150, 'kg'), -- Pancho con Fritas (Doble)

-- Pastas (17-22)
(17, 18, 0.150, 'kg'), (17, 17, 0.050, 'kg'), -- Ravioles Verdura
(18, 16, 0.150, 'kg'), (18, 18, 0.100, 'kg'), -- Ravioles Ricotta
(19, 19, 0.200, 'kg'), (19, 1, 1.0, 'u'), (19, 12, 0.020, 'kg'), -- Tallarines
(20, 18, 0.150, 'kg'), (20, 3, 0.050, 'kg'), (20, 5, 0.050, 'kg'), -- Sorrentinos JamÃ³n/Mozza
(21, 16, 0.150, 'kg'), (21, 17, 0.050, 'kg'), -- Sorrentinos Espinaca/Ricotta
(22, 20, 0.250, 'kg'), -- Ã‘oquis de papa

-- Porciones (23-27)
(23, 2, 0.250, 'kg'), -- Fritas (PorciÃ³n)
(24, 2, 0.300, 'kg'), -- Noisette (Papas fritas)
(25, 21, 0.050, 'kg'), (25, 11, 0.050, 'kg'), (25, 4, 0.010, 'kg'), (25, 22, 0.020, 'kg'), -- Ensalada Mixta
(26, 20, 0.100, 'kg'), (26, 22, 0.050, 'kg'), (26, 23, 0.050, 'kg'), (26, 24, 0.050, 'L'), -- Ensalada Rusa
(27, 20, 0.250, 'kg'), -- PurÃ© de Papas

-- MenÃº PequeÃ±o (28-33)
(28, 25, 1.0, 'u'), (28, 2, 0.100, 'kg'), -- Hamburguesa con Fritas
(29, 14, 1.0, 'u'), (29, 2, 0.100, 'kg'), -- Pancho con Fritas
(30, 7, 8.0, 'u'), (30, 2, 0.100, 'kg'), -- Nuggets con Fritas
(31, 25, 1.0, 'u'), (31, 2, 0.100, 'kg'), (31, 3, 0.020, 'kg'), (31, 5, 0.020, 'kg'), -- Hamburguesa Schneck
(32, 27, 0.100, 'kg'), (32, 20, 0.200, 'kg'), -- Finito de lomo con purÃ©
(33, 7, 8.0, 'u'), (33, 6, 0.080, 'kg'), -- Miniaturas

-- Hamburguesas (34-36)
(34, 25, 1.0, 'u'), (34, 26, 1.0, 'u'), (34, 2, 0.150, 'kg'), (34, 21, 0.010, 'kg'), (34, 11, 0.020, 'kg'), -- Simple
(35, 25, 1.0, 'u'), (35, 2, 0.150, 'kg'), (35, 3, 0.050, 'kg'), (35, 5, 0.050, 'kg'), (35, 1, 1.0, 'u'), -- Completa plato
(36, 25, 1.0, 'u'), (36, 26, 1.0, 'u'), (36, 2, 0.150, 'kg'), (36, 3, 0.050, 'kg'), (36, 5, 0.050, 'kg'), (36, 1, 1.0, 'u'), -- Completa pan

-- Asados (37-46)
(37, 28, 0.500, 'kg'), (37, 29, 1.0, 'u'), (37, 20, 0.150, 'kg'), -- Asado de tira
(38, 30, 0.300, 'kg'), (38, 2, 0.200, 'kg'), -- Entrecot grillÃ©
(39, 30, 0.300, 'kg'), (39, 2, 0.200, 'kg'), (39, 38, 0.050, 'kg'), -- Entrecot con salsa
(40, 31, 0.250, 'kg'), (40, 2, 0.200, 'kg'), -- Suprema grillÃ©
(41, 31, 0.250, 'kg'), (41, 2, 0.200, 'kg'), (41, 38, 0.050, 'kg'), -- Suprema con salsa
(42, 32, 0.350, 'kg'), (42, 20, 0.200, 'kg'), -- Costilla a la Riojana
(43, 20, 0.200, 'kg'), (43, 1, 3.0, 'u'), (43, 21, 0.050, 'kg'), -- Tortilla de papa
(44, 20, 0.200, 'kg'), (44, 1, 3.0, 'u'), (44, 12, 0.050, 'kg'), -- Tortilla a la espaÃ±ola
(45, 1, 2.0, 'u'), (45, 21, 0.050, 'kg'), -- Omelette
(46, 34, 0.200, 'kg'), (46, 2, 0.200, 'kg'), -- Merluza a la plancha

-- MenÃº Vegetariano (47-51)
(47, 35, 1.0, 'u'), (47, 26, 1.0, 'u'), (47, 21, 0.020, 'kg'), -- Hamburguesa de soja pan
(48, 35, 1.0, 'u'), (48, 21, 0.050, 'kg'), -- Hamburguesa de soja plato
(49, 36, 1.0, 'u'), (49, 2, 0.200, 'kg'), -- Milanesa de soja
(50, 35, 1.0, 'u'), (50, 9, 1.0, 'u'), -- Pancho de soja
(51, 1, 2.0, 'u'), (51, 2, 0.150, 'kg'), (51, 4, 0.020, 'kg'), -- Gramajo Vegetariano

-- PizzerÃ­a (52-68)
(52, 37, 0.100, 'kg'), (52, 38, 0.050, 'kg'), -- PorciÃ³n al tomate
(53, 37, 0.100, 'kg'), (53, 38, 0.050, 'kg'), (53, 12, 0.010, 'kg'), -- PorciÃ³n al tomate con gusto
(54, 37, 0.100, 'kg'), (54, 38, 0.030, 'kg'), (54, 5, 0.100, 'kg'), -- PorciÃ³n de muzzarella
(55, 37, 0.100, 'kg'), (55, 38, 0.030, 'kg'), (55, 5, 0.100, 'kg'), (55, 12, 0.010, 'kg'), -- PorciÃ³n de muzzarella con gusto
(56, 37, 0.200, 'kg'), (56, 38, 0.080, 'kg'), -- Pizzeta al tomate
(57, 37, 0.200, 'kg'), (57, 38, 0.050, 'kg'), (57, 5, 0.250, 'kg'), -- Pizzeta con mozzarella
(58, 37, 0.200, 'kg'), (58, 38, 0.050, 'kg'), (58, 5, 0.250, 'kg'), (58, 3, 0.050, 'kg'), -- Pizzeta con mozzarella con gusto
(59, 37, 0.400, 'kg'), (59, 38, 0.100, 'kg'), (59, 5, 0.500, 'kg'), -- 1/2 metro de mozzarella
(60, 37, 0.200, 'kg'), (60, 38, 0.050, 'kg'), (60, 5, 0.250, 'kg'), (60, 11, 0.050, 'kg'), -- 1/4 metro con gusto
(61, 37, 0.800, 'kg'), (61, 38, 0.200, 'kg'), (61, 5, 1.000, 'kg'), -- Metro de mozzarella
(62, 37, 0.800, 'kg'), (62, 38, 0.200, 'kg'), (62, 5, 1.000, 'kg'), (62, 13, 0.050, 'kg'), -- Metro con gusto
(63, 33, 0.100, 'kg'), (63, 4, 0.010, 'kg'), -- PorciÃ³n de fainÃ¡
(64, 33, 0.100, 'kg'), (64, 4, 0.010, 'kg'), (64, 5, 0.050, 'kg'), -- FainÃ¡ con mozzarella
(65, 37, 0.100, 'kg'), (65, 4, 0.050, 'kg'), -- PorciÃ³n figazza
(66, 37, 0.100, 'kg'), (66, 4, 0.050, 'kg'), (66, 5, 0.080, 'kg'); -- PorciÃ³n de fugazzeta

-- -----------------------------------------------------
-- 07-POPULATION.sql
-- Script para poblar las tablas restantes con datos de ejemplo (10+ por tabla).
-- -----------------------------------------------------

-- 1. Personal y Roles (Camareros)
-- Se aÃ±aden 10 camareros (que requieren entrada en 'Personal' y 'Camarero')
-- y 2 roles adicionales (Chef, Gerente-Turno) que solo requieren 'Personal'.
-- Asumiendo que personal_id_img debe ser Ãºnico.
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
-- Se aÃ±aden 10 clientes nuevos.
-- Asumiendo que cliente_id_img debe ser Ãºnico. (Valores 5-14, continuando los 4 de 06-INSERTS.sql)
INSERT INTO Cliente (cliente_id, cliente_id_img, cliente_nombre, cliente_apellido, cliente_telefono, cliente_contrasenia, cliente_calificacion, cliente_platillo_favorito, cliente_fidelizado) VALUES
('eduardo@example.com', 5, 'Eduardo', 'Galeano', 91111222, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Pizzeta con mozzarella', TRUE),
('florencia@example.com', 6, 'Florencia', 'Perez', 92222333, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'Gramajo Grande', FALSE),
('gustavo@example.com', 7, 'Gustavo', 'Lima', 93333444, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '10', 'Asado de tira', TRUE),
('helena@example.com', 8, 'Helena', 'Ramirez', 94444555, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '7', 'Ravioles de Verdura', FALSE),
('ivan@example.com', 9, 'Ivan', 'Torres', 95555666, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'Nuggets (16 Unidades)', FALSE),
('julia@example.com', 10, 'Julia', 'Mendez', 96666777, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Finito de lomo con purÃ©', TRUE),
('kevin@example.com', 11, 'Kevin', 'Roldan', 97777888, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '10', 'Milanesa de soja', TRUE),
('laura@example.com', 12, 'Laura', 'Paez', 98888999, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '8', 'SÃ¡ndwich OlÃ­mpico', FALSE),
('martin@example.com', 13, 'Martin', 'Quiroga', 99999000, '$2y$10$f.T.1.X.f/Y.1.f.T.1.X.eT3tY.1.f.T.1.X.f/Y.1.f.T.1.X', '9', 'Entrecot grillÃ©', TRUE),
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
('laura@example.com', 'MAN'), -- ManÃ­
('martin@example.com', 'GLU'),
('natalia@example.com', 'LAC');

-- 3. Mesas (Tabla vacÃ­a) (10 inserciones)
-- (Los IDs de mesa serÃ¡n 1-10)
INSERT INTO Mesa (mesa_id, mesa_estado, mesa_tiempo_uso, mesa_alcance, mesa_reservable, mesa_creacion) VALUES
(1, 'Libre', '00:00:00', 6, 'Si', CURDATE()), -- Mesa 1
(2, 'Libre', '00:00:00', 6, 'Si', CURDATE()), -- Mesa 2
(3, 'Libre', '00:00:00', 6, 'Si', CURDATE()), -- Mesa 3
(4, 'Libre', '00:00:00', 6, 'Si', CURDATE()), -- Mesa 4
(5, 'Ocupada', '01:15:30', 6, 'Si', CURDATE()), -- Mesa 5 (Usada para un pedido activo)
(6, 'Libre', '00:00:00', 6, 'Si', CURDATE()), -- Mesa 6
(10, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 10
(11, 'Libre', '00:00:00', 4, 'No', CURDATE()), -- Mesa 11
(12, 'Inhabilitada', '00:00:00', 4, 'No', CURDATE()), -- Mesa 12
(13, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 13
(14, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 14
(15, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 15
(16, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 16
(17, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 17
(18, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 18
(20, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 20
(21, 'Libre', '00:00:00', 2, 'Si', CURDATE()), -- Mesa 21
(22, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 22
(23, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 23
(24, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 24
(25, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 25
(26, 'Libre', '00:00:00', 4, 'Si', CURDATE()), -- Mesa 26
(27, 'Libre', '00:00:00', 4, 'Si', CURDATE()); -- Mesa 27

-- 4. Promociones (Tabla vacÃ­a) (10 inserciones)
-- (Los IDs de promociÃ³n serÃ¡n 1-10)
INSERT INTO Promocion (promocion_nombre, promocion_descripcion, promocion_descuento, promocion_fidelizada, promocion_creacion) VALUES
('2x1 Cervezas', 'Happy hour de 19:00 a 21:00', 0.5, FALSE, CURDATE()), -- Promo 1
('Pizza + Refresco', 'Pizzeta mozzarella + Refresco 1L', 0.15, FALSE, CURDATE()), -- Promo 2
('Descuento Fidelidad', '10% off en toda la carta para clientes fidelizados', 0.10, TRUE, CURDATE()), -- Promo 3
('Jueves de Pastas', '20% off en todas las pastas los jueves', 0.20, FALSE, CURDATE()), -- Promo 4
('Combo Picada', 'Gramajo Grande + 2 Cervezas', 0.15, FALSE, CURDATE()), -- Promo 5
('Menu Vegetariano', '15% off en Menu Vegetariano los lunes', 0.15, FALSE, CURDATE()), -- Promo 6
('Postre Gratis', 'Con la compra de un Asado de tira, postre gratis', 0.0, FALSE, CURDATE()), -- Promo 7
('Descuento CumpleaÃ±os', '25% off para el cumpleaÃ±ero (fidelizado)', 0.25, TRUE, CURDATE()), -- Promo 8
('Combo Familiar', '1 Metro Mozzarella + Refresco 2L', 0.20, FALSE, CURDATE()), -- Promo 9
('Tanos Noche', 'Descuento de 10% en pedidos post 23:00', 0.10, FALSE, CURDATE()); -- Promo 10

-- 5. Criterios de Producto (Tabla vacÃ­a) (10 inserciones)
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
(22, 'Casero'), -- Ã‘oquis
(61, 'Para Compartir'); -- Metro de mozzarella

-- 6. Reservas (Tabla vacÃ­a) (10 inserciones)
-- (Los IDs de reserva serÃ¡n 1-10)
-- Clientes: 'ana@example.com', 'bruno@example.com', 'eduardo@example.com', ...
-- Mesas: 1 a 10
INSERT INTO Reserva (reserva_cantidad_personas, reserva_duracion, reserva_fecha, reserva_inicio, reserva_estado, cliente_id, mesa_id) VALUES
(4, '5', CURDATE(), '20:30:00', 'Pendiente', 'ana@example.com', 1), -- Reserva 1
(2, '6', CURDATE(), '21:00:00', 'Pendiente', 'bruno@example.com', 3), -- Reserva 2
(6, '3', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '21:30:00', 'Pendiente', 'eduardo@example.com', 6), -- Reserva 3
(4, '2', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', 'Pendiente', 'florencia@example.com', 4), -- Reserva 4
(2, '2', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '22:00:00', 'Pendiente', 'gustavo@example.com', 4), -- Reserva 5
(2, '3', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '21:00:00', 'Pendiente', 'martin@example.com', 16), -- Reserva 6
(4, '2', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '20:30:00', 'Pendiente', 'laura@example.com', 2), -- Reserva 7
(2, '1', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '21:00:00', 'Cancelada', 'ivan@example.com', 22), -- Reserva 8
(3, '2', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '20:00:00', 'Pendiente', 'carla@example.com', 1), -- Reserva 9
(5, '2', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '21:00:00', 'Pendiente', 'diego@example.com', 6); -- Reserva 10

-- 7. Comentarios (Tabla vacÃ­a) (10 inserciones)
-- (PK: comentario_id (AI), producto_id, cliente_id)
INSERT INTO Comentario (producto_id, cliente_id, comentario_contenido, comentario_calificacion) VALUES
(1, 'ana@example.com', 'El gramajo estaba espectacular, muy abundante.', 4),
(61, 'eduardo@example.com', 'La mejor muzza de la zona. El metro es gigante.', 5),
(17, 'helena@example.com', 'Los ravioles de verdura estaban frescos y la salsa deliciosa.', 5),
(37, 'gustavo@example.com', 'El asado de tira estaba un poco duro esta vez.', 4),
(49, 'kevin@example.com', 'La milanesa de soja es la mejor que he probado. Muy recomendable.', 4),
(2, 'bruno@example.com', 'El gramajo grande es para 3 personas, increÃ­ble.', 4),
(54, 'carla@example.com', 'La porciÃ³n de muzza es clÃ¡sica y rica.', 3),
(32, 'julia@example.com', 'El finito de lomo con purÃ© es el favorito de mi hijo.', 4),
(38, 'martin@example.com', 'El entrecot en su punto justo. Muy bueno.', 5),
(10, 'laura@example.com', 'El sÃ¡ndwich tropical es una combinaciÃ³n rara pero funciona!', 5);

-- 8. Pedidos (Tabla vacÃ­a) (10 inserciones)
-- (Los IDs de pedido serÃ¡n 1-10)
-- Personal (Camareros): 'camarero1@prueba.com' a 'camarero10@prueba.com'
-- Mesas: 1 a 10
INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id) VALUES
('En-Preparacion', 'Sin cebolla en el gramajo', NOW(), 680.0, NULL, 'camarero1@prueba.com', 5), -- Pedido 1 (Mesa 5 Ocupada)
('Pagado', 'Todo para llevar', DATE_SUB(NOW(), INTERVAL 2 HOUR), 1430.0, 'Efectivo', 'camarero2@prueba.com', 1), -- Pedido 2
('Pagado', 'Salsa extra', DATE_SUB(NOW(), INTERVAL 1 HOUR), 990.0, 'Tarjeta', 'camarero3@prueba.com', 2), -- Pedido 3
('Pagado', '', DATE_SUB(NOW(), INTERVAL 3 HOUR), 540.0, 'Efectivo', 'camarero1@prueba.com', 3), -- Pedido 4
('Pagado', 'Hamburguesa bien cocida', DATE_SUB(NOW(), INTERVAL 4 HOUR), 800.0, 'Tarjeta', 'camarero4@prueba.com', 4), -- Pedido 5
('Pagado', 'Traer la picada primero', DATE_SUB(NOW(), INTERVAL 1 DAY), 2100.0, 'Tarjeta', 'camarero5@prueba.com', 6), -- Pedido 6
('Pagado', 'Mucha muzzarella', DATE_SUB(NOW(), INTERVAL 1 DAY), 680.0, 'Efectivo', 'camarero6@prueba.com', 12), -- Pedido 7
('Pagado', 'Sin sal', DATE_SUB(NOW(), INTERVAL 1 DAY), 560.0, 'Efectivo', 'camarero7@prueba.com', 11), -- Pedido 8
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
-- (Detalla quÃ© productos hay en cada pedido)
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
(8, 46, 1), -- Merluza a la plancha con guarniciÃ³n (560)
-- Pedido 9 (2 items)
(9, 49, 2), -- Milanesa de soja con guarniciÃ³n (450 * 2 = 900)
(9, 51, 1), -- Gramajo chico (Vegetariano) (450) -- Total 1350
-- Pedido 10 (1 item)
(10, 16, 1); -- Pancho al Pan con Fritas (Doble) (420)

-- 11. Posee (Junction Pedido <-> Producto <-> Promocion) (10 inserciones)
-- (Aplica promociones a productos especÃ­ficos en pedidos)
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
(4, '2', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '20:30:00', 'No-Show', 'natalia@example.com', 11), -- Reserva 12
(2, '1', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '22:00:00', 'No-Show', 'ana@example.com', 3), -- Reserva 13
(6, '2', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '21:00:00', 'No-Show', 'eduardo@example.com', 6), -- Reserva 14
(3, '2', DATE_SUB(CURDATE(), INTERVAL 3 DAY), '20:00:00', 'No-Show', 'bruno@example.com', 4), -- Reserva 15
(5, '2', DATE_SUB(CURDATE(), INTERVAL 3 DAY), '21:30:00', 'No-Show', 'florencia@example.com', 12), -- Reserva 16
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
