INSERT INTO Mesa (mesa_estado, mesa_ubicacion, mesa_tiempo_uso, mesa_alcance, mesa_creacion) VALUES
('Libre', 'Interior', '00:00:00', 2, CURDATE()),
('Libre', 'Interior', '00:00:00', 4, CURDATE()),
('Libre', 'Interior', '00:00:00', 6, CURDATE()),
('Libre', 'Interior', '00:00:00', 3, CURDATE()),
('Libre', 'Interior', '00:00:00', 5, CURDATE()),
('Libre', 'Interior', '00:00:00', 2, CURDATE()),

('Libre', 'Exterior', '00:00:00', 2, CURDATE()),
('Libre', 'Exterior', '00:00:00', 4, CURDATE()),
('Libre', 'Exterior', '00:00:00', 6, CURDATE()),
('Libre', 'Exterior', '00:00:00', 3, CURDATE()),
('Libre', 'Exterior', '00:00:00', 5, CURDATE()),
('Libre', 'Exterior', '00:00:00', 2, CURDATE());


-- Usuario Gerente de Prueba
-- Email: gerente@prueba.com
-- Contraseña: gerente123 (hasheada correctamente con password_hash)
INSERT INTO Personal (personal_nombre, personal_apellido, personal_contrasenia, personal_id, personal_telefono, personal_rol) VALUES ('Gerente', 'Prueba', '$2y$10$gy0d3tiaoPcx3J34cw2ia.4dV42Zea1VvGt75nqikQZGxDJpLtERy', 'gerente@prueba.com', 123456789, 'Gerente-General');
INSERT INTO Gerente_General (personal_id) VALUES ('gerente@prueba.com');