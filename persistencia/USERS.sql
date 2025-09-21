CREATE USER 'gerente'@'localhost' IDENTIFIED BY '0gGiOjvwsBRHnpdt';
CREATE USER 'empleado'@'localhost' IDENTIFIED BY 'F3sycVEqp9rrdCjt';
CREATE USER 'cliente_registrado'@'localhost' IDENTIFIED BY 'VApxJBYwnfHRuv43';
CREATE USER 'cliente_no_registrado'@'localhost' IDENTIFIED BY 'lgfCaXeEgEarShYu';

GRANT SELECT, INSERT, UPDATE, DELETE ON losTresTanosDB.usuario TO 'gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON losTresTanosDB.productos TO 'gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON losTresTanosDB.ingredientes TO 'gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON losTresTanosDB.mesas TO 'gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE ON losTresTanosDB.reserva TO 'gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE ON losTresTanosDB.pedido TO 'gerente'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE ON losTresTanosDB.pedido TO 'empleado'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON losTresTanosDB.mesas TO 'empleado'@'localhost';
GRANT SELECT, INSERT, UPDATE ON losTresTanosDB.productos TO 'empleado'@'localhost';
GRANT SELECT, INSERT, UPDATE ON losTresTanosDB.reserva TO 'empleado'@'localhost';
GRANT SELECT ON losTresTanosDB.usuario TO 'empleado'@'localhost';
GRANT SELECT ON losTresTanosDB.ingredientes TO 'empleado'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE ON losTresTanosDB.reserva TO 'cliente_registrado'@'localhost';
GRANT SELECT, UPDATE ON losTresTanosDB.usuario TO 'cliente_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.productos TO 'cliente_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.pedido TO 'cliente_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.gerente TO 'cliente_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.chef TO 'cliente_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.chefejecutivo TO 'cliente_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.mozo TO 'cliente_registrado'@'localhost';

GRANT SELECT, INSERT ON losTresTanosDB.usuario TO 'cliente_no_registrado'@'localhost';
GRANT INSERT ON losTresTanosDB.cliente TO 'cliente_no_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.productos TO 'cliente_no_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.cliente TO 'cliente_no_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.gerente TO 'cliente_no_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.chef TO 'cliente_no_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.chefejecutivo TO 'cliente_no_registrado'@'localhost';
GRANT SELECT ON losTresTanosDB.mozo TO 'cliente_no_registrado'@'localhost';

FLUSH PRIVILEGES;