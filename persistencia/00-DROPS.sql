DROP USER IF EXISTS 'gerente'@'localhost';
DROP USER IF EXISTS 'empleado'@'localhost';
DROP USER IF EXISTS 'cliente_registrado'@'localhost';
DROP USER IF EXISTS 'cliente_no_registrado'@'localhost';

-- DROP PROCEDURE IF EXISTS Validar_SignUp_Cliente;
-- DROP PROCEDURE IF EXISTS Validar_SignUp_Personal;
-- DROP PROCEDURE IF EXISTS Validar_SignIn_Cliente;
-- DROP PROCEDURE IF EXISTS Validar_SignIn_Personal;
-- DROP PROCEDURE IF EXISTS Verificar_Comentario_Existente;

-- DROP TRIGGER IF EXISTS personal_img_setter;
-- DROP TRIGGER IF EXISTS cliente_img_setter;
-- DROP TRIGGER IF EXISTS actualizar_promedio_calificacion_insert;
-- DROP TRIGGER IF EXISTS actualizar_promedio_calificacion_update;
-- DROP TRIGGER IF EXISTS actualizar_promedio_calificacion_delete;

-- DROP VIEW IF EXISTS Ventas_Totales;
-- DROP VIEW IF EXISTS Ventas_Por_Cliente;
-- DROP VIEW IF EXISTS Ventas_Por_Camarero;
-- DROP VIEW IF EXISTS Ventas_Por_Producto;
-- DROP VIEW IF EXISTS Ventas_Por_Pago;
-- DROP VIEW IF EXISTS Ventas_Por_Fecha;
-- DROP VIEW IF EXISTS Tiempo_Promedio;
-- DROP VIEW IF EXISTS No_Show_Por_Cliente;
-- DROP VIEW IF EXISTS No_Show_Por_Fecha;
-- DROP VIEW IF EXISTS Datos_Usuarios;

-- DROP DATABASE IF EXISTS lostrestanosdb;

-- Orden de creación: DATABASE.sql, TRIGGERS.sql, VIEW.sql, INSERT.sql, EVENTS.sql, PROCEDURES.sql, USERS.sql.