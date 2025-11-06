USE lostrestanosdb;

DELIMITER $$

CREATE PROCEDURE Validar_SignUp_Cliente (
    IN nombre VARCHAR (50),
    IN apellido VARCHAR (50),
    IN contrasenia VARCHAR (256),
    IN email VARCHAR(100),
    OUT usuario JSON,
    OUT mensaje VARCHAR(100)
)
BEGIN
    IF (SELECT COUNT(*) FROM Datos_Usuarios WHERE usuario_id = email) > 0 THEN
        SET mensaje = 'El usuario ya existe';
        SET usuario = NULL;
    ELSE
        INSERT INTO Cliente(cliente_nombre, cliente_apellido, cliente_contrasenia, cliente_id)
        VALUES (nombre, apellido, contrasenia, email);
        SET usuario = (
            SELECT JSON_OBJECT(
                'nombre', cliente_nombre,
                'apellido', cliente_apellido,
                'telefono', cliente_telefono,
                'email', cliente_id,
                'fidelizado', cliente_fidelizado,
                'platillo_favorito', cliente_platillo_favorito
            )
            FROM Cliente
            WHERE cliente_id = email
        );
        SET mensaje = 'Usuario creado exitosamente';
    END IF;
END $$

CREATE PROCEDURE Validar_SignUp_Personal (
    IN nombre VARCHAR (50),
    IN apellido VARCHAR (50),
    IN contrasenia VARCHAR (256),
    IN telefono VARCHAR (9),
    IN email VARCHAR(100),
    IN rol VARCHAR (40),
    OUT usuario JSON,
    OUT mensaje VARCHAR(100)
)
BEGIN
    IF (SELECT COUNT(*) FROM Datos_Usuarios WHERE usuario_id = email) > 0 THEN
        SET mensaje = 'El usuario ya existe';
        SET usuario = NULL;
    ELSE
        INSERT INTO Personal(personal_nombre, personal_apellido, personal_contrasenia, personal_rol, personal_id)
        VALUES (nombre, apellido, contrasenia, rol, email);
        SET usuario = (
            SELECT JSON_OBJECT(
                'nombre', personal_nombre,
                'apellido', personal_apellido,
                'telefono', personal_telefono,
                'email', personal_id,
                'rol', personal_rol
            )
            FROM Personal
            WHERE personal_id = email
        );
        SET mensaje = 'Usuario creado exitosamente';
    END IF;
END $$

CREATE PROCEDURE Validar_SignIn_Cliente (
    IN email VARCHAR(100),
    IN contrasenia VARCHAR(256),
    OUT usuario JSON,
    OUT mensaje VARCHAR(100)
)
BEGIN
    DECLARE usuario_encontrado INT DEFAULT 0;

    SELECT COUNT(*) INTO usuario_encontrado
    FROM Cliente
    WHERE cliente_id = email;

    IF usuario_encontrado > 0 THEN
        SELECT JSON_OBJECT(
            'nombre', cliente_nombre,
            'apellido', cliente_apellido,
            'telefono', cliente_telefono,
            'email', cliente_id,
            'fidelizado', cliente_fidelizado,
            'platillo_favorito', cliente_platillo_favorito,
            'contrasenia', cliente_contrasenia
        ) INTO usuario
        FROM Cliente
        WHERE cliente_id = email;

        SET mensaje = 'Usuario encontrado';
    ELSE
        SET usuario = NULL;
        SET mensaje = 'Usuario no encontrado';
    END IF;
END $$

CREATE PROCEDURE Validar_SignIn_Personal (
    IN email VARCHAR(100),
    IN contrasenia VARCHAR(256),
    OUT usuario JSON,
    OUT mensaje VARCHAR(100)
)
BEGIN
    DECLARE usuario_encontrado INT DEFAULT 0;

    SELECT COUNT(*) INTO usuario_encontrado
    FROM Personal
    WHERE personal_id = email;

    IF usuario_encontrado > 0 THEN
        SELECT JSON_OBJECT(
            'nombre', personal_nombre,
            'apellido', personal_apellido,
            'telefono', personal_telefono,
            'email', personal_id,
            'rol', personal_rol,
            'contrasenia', personal_contrasenia
        ) INTO usuario
        FROM Personal
        WHERE personal_id = email;

        SET mensaje = 'Usuario encontrado';
    ELSE
        SET usuario = NULL;
        SET mensaje = 'Usuario no encontrado';
    END IF;
END $$

CREATE PROCEDURE Verificar_Comentario_Existente(
    IN p_producto_id INT,
    IN p_cliente_id VARCHAR(100),
    OUT existe BOOLEAN
)
BEGIN
    SELECT COUNT(*) > 0 INTO existe
    FROM Comentario
    WHERE producto_id = p_producto_id AND cliente_id = p_cliente_id;
END $$

DELIMITER ;