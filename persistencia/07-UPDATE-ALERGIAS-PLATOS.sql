-- Migration to fix Cliente_Alergia table and add Cliente_Plato_Favorito table
-- This allows multiple allergies and favorite dishes per client

-- Drop existing Cliente_Alergia table with incorrect primary key
DROP TABLE IF EXISTS Cliente_Alergia;

-- Create new Cliente_Alergia table with proper structure for multiple allergies
CREATE TABLE Cliente_Alergia (
    cliente_alergia_id INT AUTO_INCREMENT NOT NULL,
    cliente_id VARCHAR(100) NOT NULL,
    cliente_alergia VARCHAR(100) NOT NULL,
    PRIMARY KEY (cliente_alergia_id),
    FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id) ON DELETE CASCADE,
    INDEX idx_cliente_alergia (cliente_id)
);

-- Create new Cliente_Plato_Favorito table for multiple favorite dishes
CREATE TABLE Cliente_Plato_Favorito (
    cliente_plato_id INT AUTO_INCREMENT NOT NULL,
    cliente_id VARCHAR(100) NOT NULL,
    cliente_plato_nombre VARCHAR(150) NOT NULL,
    PRIMARY KEY (cliente_plato_id),
    FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id) ON DELETE CASCADE,
    INDEX idx_cliente_plato (cliente_id)
);

-- Update Datos_Usuarios view to include allergies and favorite dishes count
CREATE OR REPLACE VIEW Datos_Usuarios AS
SELECT 
    u.usuario_id,
    u.usuario_email,
    u.usuario_rol,
    c.cliente_id,
    c.cliente_nombre,
    c.cliente_apellido,
    c.cliente_telefono,
    c.cliente_platillo_favorito,
    c.cliente_fidelizado,
    c.cliente_calificacion,
    (SELECT COUNT(*) FROM Cliente_Alergia ca WHERE ca.cliente_id = c.cliente_id) as alergias_count,
    (SELECT COUNT(*) FROM Cliente_Plato_Favorito cpf WHERE cpf.cliente_id = c.cliente_id) as platos_favoritos_count
FROM Usuario u
LEFT JOIN Cliente c ON u.usuario_id = c.cliente_id
WHERE u.usuario_rol = 'Cliente'

UNION ALL

SELECT 
    u.usuario_id,
    u.usuario_email,
    u.usuario_rol,
    NULL as cliente_id,
    p.personal_nombre as cliente_nombre,
    p.personal_apellido as cliente_apellido,
    p.personal_telefono as cliente_telefono,
    NULL as cliente_platillo_favorito,
    NULL as cliente_fidelizado,
    NULL as cliente_calificacion,
    NULL as alergias_count,
    NULL as platos_favoritos_count
FROM Usuario u
INNER JOIN Personal p ON u.usuario_id = p.personal_id
WHERE u.usuario_rol != 'Cliente';