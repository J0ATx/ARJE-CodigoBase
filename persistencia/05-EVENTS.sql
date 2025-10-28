USE lostrestanosdb;

SET GLOBAL event_scheduler = ON;

DELIMITER $$

-- Evento para marcar No Show automáticamente cuando pasa la duración de la reserva
CREATE EVENT IF NOT EXISTS marcar_no_show
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
    -- Insertar en tabla No_Show las reservas pendientes que ya pasaron su hora de inicio + duración
    INSERT INTO No_Show (cliente_id, reserva_id, no_show_fecha, no_show_hora)
    SELECT 
        r.cliente_id,
        r.reserva_id,
        CURDATE(),
        CURTIME()
    FROM Reserva r
    WHERE r.reserva_estado = 'Pendiente'
    AND r.reserva_fecha = CURDATE()
    AND (
        -- Verificar que ya pasó la hora de inicio + duración
        CASE
            WHEN r.reserva_duracion = '1' THEN TIMESTAMP(r.reserva_fecha, r.reserva_inicio) + INTERVAL 1 HOUR < NOW()
            WHEN r.reserva_duracion = '2' THEN TIMESTAMP(r.reserva_fecha, r.reserva_inicio) + INTERVAL 2 HOUR < NOW()
            WHEN r.reserva_duracion = '3' THEN TIMESTAMP(r.reserva_fecha, r.reserva_inicio) + INTERVAL 3 HOUR < NOW()
            WHEN r.reserva_duracion = '4' THEN TIMESTAMP(r.reserva_fecha, r.reserva_inicio) + INTERVAL 4 HOUR < NOW()
            WHEN r.reserva_duracion = '5' THEN TIMESTAMP(r.reserva_fecha, r.reserva_inicio) + INTERVAL 5 HOUR < NOW()
            WHEN r.reserva_duracion = '6' THEN TIMESTAMP(r.reserva_fecha, r.reserva_inicio) + INTERVAL 6 HOUR < NOW()
        END
    )
    -- No insertar duplicados
    AND NOT EXISTS (
        SELECT 1 FROM No_Show 
        WHERE No_Show.reserva_id = r.reserva_id 
        AND No_Show.cliente_id = r.cliente_id
    );
    
    -- Actualizar el estado de las reservas a 'No-Show' después de registrar en No_Show
    UPDATE Reserva r
    SET r.reserva_estado = 'No-Show'
    WHERE r.reserva_estado = 'Pendiente'
    AND r.reserva_fecha = CURDATE()
    AND EXISTS (
        SELECT 1 FROM No_Show ns
        WHERE ns.reserva_id = r.reserva_id
    );
END $$

DELIMITER ;

