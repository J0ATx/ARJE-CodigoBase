-- Trigger para asignar ID de imagen al insertar en Personal
DELIMITER $$
CREATE TRIGGER before_personal_insert
BEFORE INSERT ON Personal
FOR EACH ROW
BEGIN
    INSERT INTO image_id_sequence VALUES (NULL);
    SET NEW.personal_id_img = LAST_INSERT_ID();
END $$

-- Trigger para asignar ID de imagen al insertar en Cliente
CREATE TRIGGER before_cliente_insert
BEFORE INSERT ON Cliente
FOR EACH ROW
BEGIN
    INSERT INTO image_id_sequence VALUES (NULL);
    SET NEW.cliente_id_img = LAST_INSERT_ID();
END $$

DELIMITER ;
