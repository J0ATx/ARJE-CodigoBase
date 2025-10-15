CREATE USER 'gerente'@'localhost' IDENTIFIED BY '0gGiOjvwsBRHnpdt';
CREATE USER 'empleado'@'localhost' IDENTIFIED BY 'F3sycVEqp9rrdCjt';
CREATE USER 'cliente_registrado'@'localhost' IDENTIFIED BY 'VApxJBYwnfHRuv43';
CREATE USER 'cliente_no_registrado'@'localhost' IDENTIFIED BY 'lgfCaXeEgEarShYu';

GRANT SELECT ON lostrestanosdb.Datos_Usuarios TO 'gerente'@'localhost';
GRANT INSERT, UPDATE, DELETE ON lostrestanosdb.Cliente TO 'gerente'@'localhost';
GRANT INSERT, UPDATE, DELETE ON lostrestanosdb.Personal TO 'gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON lostrestanosdb.Producto TO 'gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON lostrestanosdb.Stock TO 'gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON lostrestanosdb.Mesa TO 'gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE ON lostrestanosdb.Reserva TO 'gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE ON lostrestanosdb.Pedido TO 'gerente'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE ON lostrestanosdb.Pedido TO 'empleado'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON lostrestanosdb.Mesa TO 'empleado'@'localhost';
GRANT SELECT, INSERT, UPDATE ON lostrestanosdb.Producto TO 'empleado'@'localhost';
GRANT SELECT, INSERT, UPDATE ON lostrestanosdb.Reserva TO 'empleado'@'localhost';
GRANT SELECT ON lostrestanosdb.Datos_Usuarios TO 'empleado'@'localhost';
GRANT SELECT ON lostrestanosdb.Stock TO 'empleado'@'localhost';


GRANT SELECT, INSERT, UPDATE, DELETE ON lostrestanosdb.Reserva TO 'cliente_registrado'@'localhost';
GRANT SELECT ON lostrestanosdb.Mesa TO 'cliente_registrado'@'localhost';
GRANT UPDATE ON lostrestanosdb.Cliente TO 'cliente_registrado'@'localhost';
GRANT SELECT ON lostrestanosdb.Datos_Usuarios TO 'cliente_registrado'@'localhost';
GRANT SELECT ON lostrestanosdb.Producto TO 'cliente_registrado'@'localhost';
GRANT SELECT ON lostrestanosdb.Pedido TO 'cliente_registrado'@'localhost';

GRANT SELECT ON lostrestanosdb.Datos_Usuarios TO 'cliente_no_registrado'@'localhost';
GRANT SELECT, INSERT ON lostrestanosdb.Cliente TO 'cliente_no_registrado'@'localhost';
GRANT SELECT ON lostrestanosdb.Personal TO 'cliente_no_registrado'@'localhost';
GRANT SELECT ON lostrestanosdb.Producto TO 'cliente_no_registrado'@'localhost';

FLUSH PRIVILEGES;