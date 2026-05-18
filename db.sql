create database facturacion;
use facturacion;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    rol ENUM('ADMIN', 'EMPLEADO') NOT NULL DEFAULT 'EMPLEADO',

    activo BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL,
    codigo_barras VARCHAR(100),

    precio DECIMAL(10,2) NOT NULL,

    iva_porcentaje DECIMAL(5,2) DEFAULT 21,

    activo BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,

    metodo_pago ENUM(
        'EFECTIVO',
        'TRANSFERENCIA',
        'TARJETA',
        'QR',
        'MIXTO'
    ) NOT NULL,

    estado ENUM(
        'PENDIENTE',
        'PAGADA',
        'ANULADA',
        'FACTURADA'
    ) DEFAULT 'FACTURADA',

    cliente_nombre VARCHAR(150),
    cliente_documento VARCHAR(50),

    tipo_comprobante VARCHAR(20),
    punto_venta VARCHAR(10),
    numero_comprobante VARCHAR(30),

    cae VARCHAR(50),
    cae_vencimiento DATE,

    qr_data TEXT,

    observaciones TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
CREATE TABLE detalle_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,

    venta_id INT NOT NULL,

    producto_id INT,

    producto_nombre VARCHAR(150) NOT NULL,

    cantidad INT NOT NULL,

    precio_unitario DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    iva_porcentaje DECIMAL(5,2) DEFAULT 21,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);


CREATE TABLE caja (
    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_apertura_id INT NOT NULL,
    usuario_cierre_id INT,

    fecha_apertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre DATETIME,

    monto_inicial DECIMAL(10,2) NOT NULL,
    monto_final DECIMAL(10,2),

    ventas_efectivo DECIMAL(10,2) DEFAULT 0,
    ventas_transferencia DECIMAL(10,2) DEFAULT 0,
    ventas_tarjeta DECIMAL(10,2) DEFAULT 0,
    ventas_qr DECIMAL(10,2) DEFAULT 0,

    diferencia DECIMAL(10,2) DEFAULT 0,

    estado ENUM('ABIERTA', 'CERRADA') DEFAULT 'ABIERTA',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_apertura_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_cierre_id) REFERENCES usuarios(id)
);
CREATE TABLE movimientos_caja (
    id INT AUTO_INCREMENT PRIMARY KEY,

    caja_id INT NOT NULL,

    tipo ENUM(
        'INGRESO',
        'EGRESO'
    ) NOT NULL,

    descripcion VARCHAR(255),

    monto DECIMAL(10,2) NOT NULL,

    usuario_id INT NOT NULL,

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (caja_id) REFERENCES caja(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
CREATE TABLE configuracion_empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,

    razon_social VARCHAR(255),
    nombre_fantasia VARCHAR(255),

    cuit VARCHAR(20),

    direccion VARCHAR(255),

    telefono VARCHAR(50),

    condicion_iva VARCHAR(100),

    punto_venta VARCHAR(10),

    certificado_path TEXT,
    clave_privada_path TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
show tables;

INSERT INTO usuarios (
    nombre,
    usuario,
    password_hash,
    rol
)
VALUES (
    'Administrador',
    'admin',
    '$2b$10$fL6Nx/X/8H1x8u1DhrAAcub461rDDNzjIZQ5YRUe5w9JiEz1bUyTS',
    'ADMIN'
);


INSERT INTO productos (
    nombre,
    precio,
    codigo_barras,
    activo
)
VALUES
(
    'Remera Negra',
    7500,
    '7790001',
    1
),
(
    'Aros Plateados',
    8000,
    '7790002',
    1
),
(
    'Gorra Nike',
    12000,
    '7790003',
    1
),
(
    'Medias Deportivas',
    3500,
    '7790004',
    1
),
(
    'Billetera Cuero',
    15000,
    '7790005',
    1
);

SELECT * FROM ventas;

SELECT * FROM detalle_venta;