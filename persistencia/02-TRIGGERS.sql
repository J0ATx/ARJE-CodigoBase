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


CREATE TRIGGER actualizar_promedio_calificacion_insert
AFTER INSERT ON Comentario
FOR EACH ROW
BEGIN
    DECLARE promedio_calc DECIMAL(2,1);

    SELECT AVG(comentario_calificacion)
    INTO promedio_calc
    FROM Comentario
    WHERE producto_id = NEW.producto_id;
    UPDATE Producto
    SET producto_calificacion = promedio_calc
    WHERE producto_id = NEW.producto_id;
END $$

CREATE TRIGGER actualizar_promedio_calificacion_update
AFTER UPDATE ON Comentario
FOR EACH ROW
BEGIN
    DECLARE promedio_calc DECIMAL(2,1);

    SELECT AVG(comentario_calificacion)
    INTO promedio_calc
    FROM Comentario
    WHERE producto_id = NEW.producto_id;
    UPDATE Producto
    SET producto_calificacion = promedio_calc
    WHERE producto_id = NEW.producto_id;
END $$

CREATE TRIGGER actualizar_promedio_calificacion_delete
AFTER DELETE ON Comentario
FOR EACH ROW
BEGIN
    DECLARE promedio_calc DECIMAL(2,1);

    SELECT AVG(comentario_calificacion)
    INTO promedio_calc
    FROM Comentario
    WHERE producto_id = OLD.producto_id;

    UPDATE Producto
    SET producto_calificacion = promedio_calc
    WHERE producto_id = OLD.producto_id;
END $$

DELIMITER ;
