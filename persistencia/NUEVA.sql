DROP DATABASE IF EXISTS lostrestanosdb;
CREATE DATABASE lostrestanosdb;
USE lostrestanosdb;

CREATE TABLE Personal (
    personal_id VARCHAR (100) NOT NULL,
    personal_nombre VARCHAR (50),
    personal_apellido VARCHAR (50),
    personal_telefono INT (9),
    personal_contrasenia VARCHAR (256),
    personal_calificacion ENUM ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10'),
    personal_rol ENUM ('Cliente', 'Gerente-General', 'Gerente-Turno', 'Chef-Ejecutivo', 'Chef', 'Camarero'),
    PRIMARY KEY(personal_id)
);

CREATE TABLE Camarero (
    personal_id VARCHAR (100) NOT NULL,
    PRIMARY KEY (personal_id),
    FOREIGN KEY (personal_id) REFERENCES Personal (personal_id) ON DELETE CASCADE
);

CREATE TABLE Chef_Ejecutivo (
    personal_id VARCHAR (100) NOT NULL,
    PRIMARY KEY (personal_id),
    FOREIGN KEY (personal_id) REFERENCES Personal (personal_id) ON DELETE CASCADE
);

CREATE TABLE Gerente_General (
    personal_id VARCHAR (100) NOT NULL,
    PRIMARY KEY (personal_id),
    FOREIGN KEY (personal_id) REFERENCES Personal (personal_id) ON DELETE CASCADE
);

CREATE TABLE Cliente (
    cliente_id VARCHAR (100) NOT NULL,
    cliente_nombre VARCHAR (50),
    cliente_apellido VARCHAR (50),
    cliente_telefono INT (9),
    cliente_contrasenia VARCHAR (256),
    cliente_calificacion ENUM ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10'),
    cliente_platillo_favorito VARCHAR (150),
    cliente_fidelizado BOOLEAN,
    PRIMARY KEY (cliente_id)
);

CREATE TABLE Cliente_Alergia (
    cliente_id VARCHAR (100) NOT NULL,
    cliente_alergia VARCHAR (100),
    PRIMARY KEY (cliente_id),
    FOREIGN KEY (cliente_id) REFERENCES Cliente (cliente_id) ON DELETE CASCADE
);

CREATE TABLE Empresa (
    empresa_id INT AUTO_INCREMENT NOT NULL,
    empresa_nombre VARCHAR (100),
    empresa_mision VARCHAR (250),
    empresa_vision VARCHAR (250),
    empresa_whatsapp VARCHAR (100),
    empresa_instagram VARCHAR (100),
    empresa_facebook VARCHAR (100),
    personal_id VARCHAR (100),
    PRIMARY KEY (empresa_id),
    FOREIGN KEY (personal_id) REFERENCES Personal (personal_id) ON DELETE CASCADE
);

CREATE TABLE Empresa_Ubicacion (
    empresa_id INT NOT NULL,
    empresa_ciudad VARCHAR (100),
    empresa_calle VARCHAR (100),
    PRIMARY KEY (empresa_id),
    FOREIGN KEY (empresa_id) REFERENCES Empresa (empresa_id) ON DELETE CASCADE
);

CREATE TABLE Empresa_Valor (
    empresa_id INT NOT NULL,
    empresa_valor VARCHAR (250),
    PRIMARY KEY (empresa_id),
    FOREIGN KEY (empresa_id) REFERENCES Empresa (empresa_id) ON DELETE CASCADE
);

CREATE TABLE Empresa_Telefono (
    empresa_id INT NOT NULL,
    empresa_telefono INT (9),
    PRIMARY KEY (empresa_id),
    FOREIGN KEY (empresa_id) REFERENCES Empresa (empresa_id) ON DELETE CASCADE
);

CREATE TABLE Mesa (
    mesa_id INT AUTO_INCREMENT NOT NULL,
    mesa_estado ENUM ('Libre', 'Ocupada', 'Inhabilitada'),
    mesa_ubicacion ENUM ('Interior', 'Exterior'),
    mesa_tiempo_uso TIME,
    mesa_alcance INT (1),
    mesa_creacion DATE,
    PRIMARY KEY (mesa_id)
);

CREATE TABLE Reserva (
    reserva_id INT AUTO_INCREMENT NOT NULL,
    reserva_cantidad_personas INT (1),
    reserva_duracion ENUM ('1', '2', '3', '4', '5', '6'),
    reserva_fecha DATE,
    reserva_inicio TIME,
    cliente_id VARCHAR (100),
    mesa_id INT,
    PRIMARY KEY (reserva_id),
    FOREIGN KEY (cliente_id) REFERENCES Cliente (cliente_id) ON DELETE CASCADE,
    FOREIGN KEY (mesa_id) REFERENCES Mesa (mesa_id) ON DELETE CASCADE
);

CREATE TABLE Producto (
    producto_id INT AUTO_INCREMENT NOT NULL,
    producto_nombre VARCHAR (100),
    producto_precio FLOAT,
    producto_receta VARCHAR (900),
    producto_tiempo_preparacion VARCHAR (50),
    producto_creacion DATE,
    producto_categoria VARCHAR (100),
    producto_calificacion FLOAT,
    personal_id VARCHAR (100) NOT NULL,
    PRIMARY KEY (producto_id),
    FOREIGN KEY (personal_id) REFERENCES Personal (personal_id) ON DELETE CASCADE
);

CREATE TABLE Producto_Criterio (
    producto_id INT NOT NULL,
    producto_criterio VARCHAR (100) NOT NULL,
    PRIMARY KEY (producto_id),
    FOREIGN KEY (producto_id) REFERENCES Producto (producto_id) ON DELETE CASCADE
);

CREATE TABLE Comentario (
    comentario_id INT AUTO_INCREMENT NOT NULL,
    producto_id INT,
    cliente_id VARCHAR (100),
    comentario_contenido VARCHAR (250),
    comentario_calificacion ENUM ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10'),
    PRIMARY KEY (comentario_id, producto_id, cliente_id),
    FOREIGN KEY (producto_id) REFERENCES Producto (producto_id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES Cliente (cliente_id) ON DELETE CASCADE
);

CREATE TABLE Promocion (
    promocion_id INT AUTO_INCREMENT NOT NULL,
    promocion_nombre VARCHAR (100),
    promocion_descripcion VARCHAR (100),
    promocion_descuento FLOAT,
    promocion_fidelizada BOOLEAN,
    promocion_creacion DATE,
    PRIMARY KEY (promocion_id)
);

CREATE TABLE Stock (
    stock_id INT AUTO_INCREMENT NOT NULL,
    stock_nombre VARCHAR (100),
    stock_caducidad DATE,
    PRIMARY KEY (stock_id)
);

CREATE TABLE Stock_Cantidad (
    stock_id INT NOT NULL,
    stock_cantidad INT NOT NULL,
    stock_medida VARCHAR (3),
    PRIMARY KEY (stock_id, stock_cantidad, stock_medida),
    FOREIGN KEY (stock_id) REFERENCES Stock (stock_id) ON DELETE CASCADE
);

CREATE TABLE Pedido (
    pedido_id INT AUTO_INCREMENT NOT NULL,
    pedido_estado ENUM ('Pendiente', 'En-Preparacion', 'Listo', 'Entregado') DEFAULT 'Pendiente',
    pedido_especificacion VARCHAR (250),
    pedido_fecha DATE,
    pedido_monto FLOAT,
    pedido_pago ENUM ('Efectivo', 'Tarjeta'),
    personal_id VARCHAR (100),
    mesa_id INT,
    PRIMARY KEY (pedido_id),
    FOREIGN KEY (personal_id) REFERENCES Personal (personal_id) ON DELETE CASCADE,
    FOREIGN KEY (mesa_id) REFERENCES Mesa (mesa_id) ON DELETE CASCADE
);

CREATE TABLE Consume (
    producto_id INT NOT NULL,
    stock_id INT NOT NULL,
    consume_cantidad FLOAT,
    consume_medida VARCHAR (3),
    PRIMARY KEY (producto_id, stock_id),
    FOREIGN KEY (producto_id) REFERENCES Producto (producto_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES Stock (stock_id) ON DELETE CASCADE
);

CREATE TABLE Efectua (
    pedido_id INT NOT NULL,
    cliente_id VARCHAR (100) NOT NULL,
    PRIMARY KEY (pedido_id, cliente_id),
    FOREIGN KEY (pedido_id) REFERENCES Pedido (pedido_id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES Cliente (cliente_id) ON DELETE CASCADE
);

CREATE TABLE Contiene (
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    PRIMARY KEY (pedido_id, producto_id),
    FOREIGN KEY (pedido_id) REFERENCES Pedido (pedido_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES Producto (producto_id) ON DELETE CASCADE
);

CREATE TABLE Posee (
    promocion_id INT NOT NULL,
    producto_id INT NOT NULL,
    pedido_id INT NOT NULL,
    PRIMARY KEY (promocion_id, producto_id, pedido_id),
    FOREIGN KEY (promocion_id) REFERENCES Promocion (promocion_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES Producto (producto_id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES Pedido (pedido_id) ON DELETE CASCADE
);

CREATE TABLE No_Show (
    cliente_id VARCHAR (100) NOT NULL,
    reserva_id INT NOT NULL,
    no_show_fecha DATE,
    no_show_hora TIME,
    PRIMARY KEY (cliente_id, reserva_id),
    FOREIGN KEY (cliente_id) REFERENCES Cliente (cliente_id) ON DELETE CASCADE,
    FOREIGN KEY (reserva_id) REFERENCES Reserva (reserva_id) ON DELETE CASCADE
);