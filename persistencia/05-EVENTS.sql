USE lostrestanosdb;

SET GLOBAL event_scheduler = ON;

DELIMITER $$

-- Evento para liberar mesas cuando termina la duración de una reserva
CREATE EVENT IF NOT EXISTS liberar_mesas_reserva
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
    UPDATE Mesa
    INNER JOIN Reserva ON Mesa.mesa_id = Reserva.mesa_id
    SET Mesa.mesa_estado = 'Libre'
    WHERE Reserva.reserva_estado = 'Confirmada'
    AND DATE(Reserva.reserva_fecha) = CURDATE()
    AND (
        CASE
            WHEN Reserva.reserva_duracion = '1' THEN TIME(Reserva.reserva_inicio) <= DATE_SUB(CURTIME(), INTERVAL 1 HOUR)
            WHEN Reserva.reserva_duracion = '2' THEN TIME(Reserva.reserva_inicio) <= DATE_SUB(CURTIME(), INTERVAL 2 HOUR)
            WHEN Reserva.reserva_duracion = '3' THEN TIME(Reserva.reserva_inicio) <= DATE_SUB(CURTIME(), INTERVAL 3 HOUR)
            WHEN Reserva.reserva_duracion = '4' THEN TIME(Reserva.reserva_inicio) <= DATE_SUB(CURTIME(), INTERVAL 4 HOUR)
            WHEN Reserva.reserva_duracion = '5' THEN TIME(Reserva.reserva_inicio) <= DATE_SUB(CURTIME(), INTERVAL 5 HOUR)
            WHEN Reserva.reserva_duracion = '6' THEN TIME(Reserva.reserva_inicio) <= DATE_SUB(CURTIME(), INTERVAL 6 HOUR)
        END
    )
    AND Mesa.mesa_estado = 'Ocupada';
END $$

DELIMITER ;