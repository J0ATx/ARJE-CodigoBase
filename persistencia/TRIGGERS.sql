DELIMITER $$
CREATE TRIGGER personal_img_setter
BEFORE INSERT ON Personal
FOR EACH ROW
BEGIN
    INSERT INTO image_id_sequence VALUES (NULL);
    SET NEW.personal_id_img = LAST_INSERT_ID();
END $$

CREATE TRIGGER cliente_img_setter
BEFORE INSERT ON Cliente
FOR EACH ROW
BEGIN
    INSERT INTO image_id_sequence VALUES (NULL);
    SET NEW.cliente_id_img = LAST_INSERT_ID();
END $$

DELIMITER ;