-- Algunos INSERT Necesarios Para que los Módulos Entregados en la Primera Entrega Funcionen Correctamente
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('disponible', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('ocupada', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('reservada', '2025-07-16 19:00:00');
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('disponible', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('disponible', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('ocupada', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('reservada', '2025-07-17 20:00:00');
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('disponible', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('disponible', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('ocupada', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('reservada', '2025-07-18 21:00:00');
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('disponible', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('disponible', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('ocupada', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('reservada', '2025-07-19 18:00:00');
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('disponible', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('disponible', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('ocupada', NULL);
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('reservada', '2025-07-20 17:00:00');
INSERT INTO Mesas (estadoActual, fechUsoOcupadoReservado) VALUES ('disponible', NULL);


INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('Ana', 'García', 'claveAna', 'ana@email.com', 5, 111111111);
INSERT INTO Cliente (idUsuario, noShows, platilloFav) VALUES (LAST_INSERT_ID(), 0, 'Pizza');
INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('Luis', 'Martínez', 'claveLuis', 'luis@email.com', 4, 222222222);
INSERT INTO Cliente (idUsuario, noShows, platilloFav) VALUES (LAST_INSERT_ID(), 1, 'Ensalada');
INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('María', 'López', 'claveMaria', 'maria@email.com', 5, 333333333);
INSERT INTO Cliente (idUsuario, noShows, platilloFav) VALUES (LAST_INSERT_ID(), 0, 'Hamburguesa');
INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('Carlos', 'Sánchez', 'claveCarlos', 'carlos@email.com', 3, 444444444);
INSERT INTO Cliente (idUsuario, noShows, platilloFav) VALUES (LAST_INSERT_ID(), 2, 'Pasta');
INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('Lucía', 'Fernández', 'claveLucia', 'lucia@email.com', 4, 555555555);
INSERT INTO Cliente (idUsuario, noShows, platilloFav) VALUES (LAST_INSERT_ID(), 1, 'Sushi');
INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('Pedro', 'Ramírez', 'clavePedro', 'pedro@email.com', 5, 666666666);
INSERT INTO Mozo (idUsuario, fechContratacion) VALUES (LAST_INSERT_ID(), '2024-01-10');
INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('Sofía', 'Torres', 'claveSofia', 'sofia@email.com', 4, 777777777);
INSERT INTO Mozo (idUsuario, fechContratacion) VALUES (LAST_INSERT_ID(), '2024-02-15');
INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('Miguel', 'Vargas', 'claveMiguel', 'miguel@email.com', 5, 888888888);
INSERT INTO Mozo (idUsuario, fechContratacion) VALUES (LAST_INSERT_ID(), '2024-03-20');
INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('Elena', 'Morales', 'claveElena', 'elena@email.com', 3, 999999999);
INSERT INTO Mozo (idUsuario, fechContratacion) VALUES (LAST_INSERT_ID(), '2024-04-25');
INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('Javier', 'Castro', 'claveJavier', 'javier@email.com', 4, 101010101);
INSERT INTO Mozo (idUsuario, fechContratacion) VALUES (LAST_INSERT_ID(), '2024-05-30');
-- Usuario Gerente de Prueba
-- Email: gerente@prueba.com
-- Contraseña: gerente123 (hasheada correctamente con password_hash)
INSERT INTO Usuario (nombre, apellido, contrasenia, gmail, calificacion, numTel) VALUES ('Gerente', 'Prueba', '$2y$10$gy0d3tiaoPcx3J34cw2ia.4dV42Zea1VvGt75nqikQZGxDJpLtERy', 'gerente@prueba.com', 5, 123456789);
INSERT INTO Gerente (idUsuario, fechContratacion) VALUES (LAST_INSERT_ID(), '2024-01-01');

-- Ingredientes base para pizzas
INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Masa de Pizza', '2025-12-31', 1000, 'unidad');
SET @id_masa = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Salsa de Tomate', '2025-12-31', 5000, 'ml');
SET @id_salsa = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Mozzarella', '2025-09-30', 2000, 'g');
SET @id_mozzarella = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Jamón', '2025-09-15', 1000, 'g');
SET @id_jamon = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Pepperoni', '2025-09-15', 1000, 'g');
SET @id_pepperoni = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Champiñones', '2025-08-30', 800, 'g');
SET @id_champinones = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Aceitunas Negras', '2025-12-31', 500, 'g');
SET @id_aceitunas = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Pimiento Verde', '2025-08-30', 600, 'g');
SET @id_pimiento = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Cebolla', '2025-08-30', 800, 'g');
SET @id_cebolla = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Anchoas', '2025-10-31', 300, 'g');
SET @id_anchoas = LAST_INSERT_ID();

-- Ingredientes para pastas
INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Spaghetti', '2025-12-31', 2000, 'g');
SET @id_spaghetti = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Salsa Bolognesa', '2025-09-30', 3000, 'ml');
SET @id_bolognesa = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Parmesano', '2025-09-30', 1000, 'g');
SET @id_parmesano = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Albahaca', '2025-08-25', 200, 'g');
SET @id_albahaca = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Ajo', '2025-09-15', 500, 'g');
SET @id_ajo = LAST_INSERT_ID();

INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES ('Aceite de Oliva', '2025-12-31', 5000, 'ml');
SET @id_aceite = LAST_INSERT_ID();

-- Productos
INSERT INTO Productos (precio, nombre) VALUES (1200, 'Pizza Margherita');
SET @id_margherita = LAST_INSERT_ID();

INSERT INTO Productos (precio, nombre) VALUES (1400, 'Pizza Pepperoni');
SET @id_pepperoni_pizza = LAST_INSERT_ID();

INSERT INTO Productos (precio, nombre) VALUES (1300, 'Spaghetti Bolognesa');
SET @id_spaghetti_plato = LAST_INSERT_ID();

-- Recetas
INSERT INTO Recetas (idProducto, cantPasos) VALUES (@id_margherita, 5);
SET @receta_margherita = LAST_INSERT_ID();

INSERT INTO Recetas (idProducto, cantPasos) VALUES (@id_pepperoni_pizza, 5);
SET @receta_pepperoni = LAST_INSERT_ID();

INSERT INTO Recetas (idProducto, cantPasos) VALUES (@id_spaghetti_plato, 4);
SET @receta_bolognesa = LAST_INSERT_ID();

-- Pasos para Pizza Margherita
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_margherita, 'Extender la masa de pizza en forma circular de 30cm');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_margherita, 'Cubrir con salsa de tomate dejando un borde de 1cm');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_margherita, 'Agregar mozzarella rallada de manera uniforme');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_margherita, 'Decorar con hojas de albahaca fresca');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_margherita, 'Hornear a 220°C por 12-15 minutos');

-- Pasos para Pizza Pepperoni
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_pepperoni, 'Extender la masa de pizza en forma circular de 30cm');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_pepperoni, 'Cubrir con salsa de tomate dejando un borde de 1cm');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_pepperoni, 'Agregar mozzarella rallada de manera uniforme');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_pepperoni, 'Distribuir rodajas de pepperoni por toda la superficie');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_pepperoni, 'Hornear a 220°C por 12-15 minutos');

-- Pasos para Spaghetti Bolognesa
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_bolognesa, 'Cocinar el spaghetti en agua hirviendo con sal durante 8-10 minutos');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_bolognesa, 'Mientras tanto, calentar la salsa bolognesa');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_bolognesa, 'Escurrir la pasta y mezclar con la salsa');
INSERT INTO RecetasPasos (idReceta, paso) VALUES (@receta_bolognesa, 'Servir y decorar con parmesano rallado y albahaca');

-- Ingredientes necesarios para cada producto
-- Pizza Margherita
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_margherita, @id_masa, 1);
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_margherita, @id_salsa, 100);
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_margherita, @id_mozzarella, 150);
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_margherita, @id_albahaca, 10);

-- Pizza Pepperoni
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_pepperoni_pizza, @id_masa, 1);
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_pepperoni_pizza, @id_salsa, 100);
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_pepperoni_pizza, @id_mozzarella, 150);
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_pepperoni_pizza, @id_pepperoni, 100);

-- Spaghetti Bolognesa
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_spaghetti_plato, @id_spaghetti, 200);
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_spaghetti_plato, @id_bolognesa, 150);
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_spaghetti_plato, @id_parmesano, 30);
INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (@id_spaghetti_plato, @id_albahaca, 5);
