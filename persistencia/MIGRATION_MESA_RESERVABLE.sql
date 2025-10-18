-- Migración para permitir mesa_id NULL en reservas pendientes
-- Fecha: 2025-10-18

-- Modificar columna mesa_id para permitir NULL
ALTER TABLE Reserva MODIFY COLUMN mesa_id INT NULL;

-- Agregar columna mesa_reservable a la tabla Mesa
ALTER TABLE Mesa
ADD COLUMN mesa_reservable ENUM('Si', 'No') DEFAULT 'Si' AFTER mesa_alcance;

-- Actualizar todas las mesas existentes como reservables (para mantener compatibilidad)
UPDATE Mesa SET mesa_reservable = 'Si' WHERE mesa_reservable IS NULL;
