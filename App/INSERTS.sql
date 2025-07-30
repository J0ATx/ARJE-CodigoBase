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