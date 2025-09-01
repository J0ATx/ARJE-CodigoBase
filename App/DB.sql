drop database if exists losTresTanosDB;
create database losTresTanosDB;
use losTresTanosDB;

create table Usuario(
    idUsuario int auto_increment,
    nombre varchar (30) NOT NULL,
    apellido varchar (30) NOT NULL,
    contrasenia varchar (256) NOT NULL,
    gmail varchar (100) UNIQUE NOT NULL,
    calificacion int (2),
    numTel int (9) UNIQUE,
    primary key(idUsuario)
);

create table Cliente(
    idUsuario int,
    noShows int (3),
    platilloFav varchar (40),
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

create table Alergias(
    idAlergia int auto_increment,
    nombreAler varchar (40) UNIQUE NOT NULL,
    primary key(idAlergia)
);

create table ClienteAlergias(
    idUsuario int,
    idAlergia int,
    primary key(idUsuario, idAlergia),
    foreign key(idUsuario) REFERENCES Cliente(idUsuario) ON DELETE CASCADE,
    foreign key(idAlergia) REFERENCES Alergias(idAlergia) ON DELETE CASCADE
);

create table Gerente(
    idUsuario int,
    fechContratacion date NOT NULL,
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

create table TurnoGerente(
    idTurno int auto_increment,
    idUsuario int,
    turnoAsignado varchar (20) NOT NULL,
    horasSemanales int (3) NOT NULL,
    inicioTurno time NOT NULL,
    finTurno time NOT NULL,
    primary key(idTurno),
    foreign key(idUsuario) REFERENCES Gerente(idUsuario) ON DELETE CASCADE
);

create table AreasResponsabilidad(
    idArea int auto_increment,
    nombreArea varchar (40) UNIQUE NOT NULL,
    primary key(idArea)
);

create table TurnoGerenteArea(
    idUsuario int,
    idTurno int,
    idArea int,
    primary key(idUsuario, idTurno, idArea),
    foreign key(idUsuario) REFERENCES Gerente(idUsuario) ON DELETE CASCADE,
    foreign key(idTurno) REFERENCES TurnoGerente(idTurno) ON DELETE CASCADE,
    foreign key(idArea) REFERENCES AreasResponsabilidad(idArea) ON DELETE CASCADE
);

create table Chef(
    idUsuario int,
    fechContratacion date NOT NULL,
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

create table TurnoChef(
	idUsuario int,
    idTurno int auto_increment,
    turnoAsignado varchar (30) NOT NULL,
    horasSemanales int (3) NOT NULL,
    inicioTurno time NOT NULL,
    finTurno time NOT NULL,
    primary key(idTurno),
    foreign key(idUsuario) REFERENCES Chef(idUsuario) ON DELETE CASCADE
);

create table Especialidades(
	idEspecialidad int auto_increment,
    nombreEspecialidad varchar (40) UNIQUE NOT NULL,
    primary key(idEspecialidad)
);

create table NivelEspecialidadChef(
	idUsuario int,
    idEspecialidad int,
    nivelHabilidad int (2) NOT NULL,
    aniosExperiencia int (3) NOT NULL,
    primary key(idUsuario, idEspecialidad),
    foreign key(idUsuario) REFERENCES Chef(idUsuario) ON DELETE CASCADE,
    foreign key(idEspecialidad) REFERENCES Especialidades(idEspecialidad) ON DELETE CASCADE
);

create table TurnoChefEspecialidad(
	idUsuario int,
    idTurno int,
    idEspecialidad int,
    primary key(idUsuario, idTurno, idEspecialidad),
    foreign key(idUsuario) REFERENCES Chef(idUsuario) ON DELETE CASCADE,
    foreign key(idTurno) REFERENCES TurnoChef(idTurno) ON DELETE CASCADE,
    foreign key(idEspecialidad) REFERENCES Especialidades(idEspecialidad) ON DELETE CASCADE
);

create table ChefEjecutivo(
	idUsuario int,
    fechPromocionEjec date NOT NULL,
    presupuestoAnualCocina int (10) NOT NULL,
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

create table TurnoChefEjec(
	idUsuario int,
    idTurno int auto_increment,
    turnoAsignado varchar (30) NOT NULL,
    horasSemanales int (3) NOT NULL,
    inicioTurno time NOT NULL,
    finTurno time NOT NULL,
    primary key(idTurno),
    foreign key(idUsuario) REFERENCES ChefEjecutivo(idUsuario) ON DELETE CASCADE
);

create table NivelEspecialidadChefEjec(
	idUsuario int,
    idEspecialidad int,
    nivelHabilidad int (2) NOT NULL,
    aniosExperiencia int (3) NOT NULL,
    primary key(idUsuario, idEspecialidad),
    foreign key(idUsuario) REFERENCES ChefEjecutivo(idUsuario) ON DELETE CASCADE,
    foreign key(idEspecialidad) REFERENCES Especialidades(idEspecialidad) ON DELETE CASCADE
);

create table TurnoChefEjecEspecialidad(
	idUsuario int,
    idTurno int,
    idEspecialidad int,
    primary key(idUsuario, idTurno, idEspecialidad),
    foreign key(idUsuario) REFERENCES ChefEjecutivo(idUsuario) ON DELETE CASCADE,
    foreign key(idTurno) REFERENCES TurnoChefEjec(idTurno) ON DELETE CASCADE,
    foreign key(idEspecialidad) REFERENCES Especialidades(idEspecialidad) ON DELETE CASCADE
);

create table Mozo(
	idUsuario int,
    fechContratacion date NOT NULL,
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

create table TurnoMozo(
	idUsuario int,
    idTurno int auto_increment,
    turnoAsignado varchar (30) NOT NULL,
    horasSemanales int (3) NOT NULL,
    inicioTurno time NOT NULL,
    finTurno time NOT NULL,
    primary key(idTurno),
    foreign key(idUsuario) REFERENCES ChefEjecutivo(idUsuario) ON DELETE CASCADE
);

create table PedidosTotal(
	idPedidosTotal int auto_increment,
    totalPedidosAtendidos int (7) NOT NULL,
    primary key(idPedidosTotal)
);

create table TurnoMozoPedidosTotal(
	idUsuario int,
    idTurno int,
    idPedidosTotal int,
    primary key(idUsuario, idTurno, idPedidosTotal),
    foreign key(idUsuario) REFERENCES Mozo(idUsuario) ON DELETE CASCADE,
    foreign key(idTurno) REFERENCES TurnoMozo(idTurno) ON DELETE CASCADE,
    foreign key(idPedidosTotal) REFERENCES PedidosTotal(idPedidosTotal) ON DELETE CASCADE
);

create table ClienteNormal(
	idUsuario int,
    cantPedidosRealizados int (6),
    totalDineroGastado int (9),
    fechUltimaCompra date,
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Cliente(idUsuario) ON DELETE CASCADE
);

create table ClienteFidelizado(
	idUsuario int,
    cantPedidosRealizados int (6),
    totalDineroGastado int (9),
    fechInicioFidelidad date NOT NULL,
    nivelFidelidad int (2) NOT NULL,
    fechUltimaCompra date,
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Cliente(idUsuario) ON DELETE CASCADE
);

create table Pedido(
	idPedido int auto_increment,
    estado ENUM('pendiente','en_preparacion','listo','entregado') DEFAULT 'pendiente',
    montoTotal int (6) NOT NULL,
    pagoPedido int (6) NOT NULL,
    pagoPropina int (6) NOT NULL,
    horaIngreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    horaFinalizacion DATETIME NULL,
    primary key(idPedido)
);

create table Relaciona(
	idUsuario int,
    idPedido int,
    primary key(idUsuario, idPedido),
    foreign key(idUsuario) REFERENCES Cliente(idUsuario) ON DELETE CASCADE,
    foreign key(idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE
);

create table Especificaciones(
	idEspecificacion int auto_increment,
    especificacion varchar (100) UNIQUE NOT NULL,
    primary key(idEspecificacion)
);

create table EspecificacionesPedido(
	idEspecificacion int,
    idPedido int,
    primary key(idEspecificacion, idPedido),
    foreign key(idEspecificacion) REFERENCES Especificaciones(idEspecificacion) ON DELETE CASCADE,
    foreign key(idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE
);

create table Mesas(
	idMesa int auto_increment,
    estadoActual varchar (30) NOT NULL,
    fechUsoOcupadoReservado datetime,
    primary key(idMesa)
);

create table PedidoFisico(
	idPedido int,
    idMesa int,
    idUsuario int,
    primary key(idPedido),
    foreign key(idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE,
    foreign key(idMesa) REFERENCES Mesas(idMesa) ON DELETE CASCADE,
    foreign key(idUsuario) REFERENCES Mozo(idUsuario) ON DELETE CASCADE
);

create table ParaLlevar(
	idPedido int,
    horaRecogidaEstimada time NOT NULL,
    primary key(idPedido),
    foreign key(idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE
);

create table Reserva(
	idPedido int,
    idMesa int,
    idUsuario int,
    fecha date NOT NULL,
    horaInicio time NOT NULL,
    duracion time NOT NULL, -- se guarda en TIME ya que cuando inicie la reserva, no va a durar mas de 24h
    primary key(idPedido),
    foreign key(idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE,
    foreign key(idMesa) REFERENCES Mesas(idMesa) ON DELETE CASCADE,
    foreign key(idUsuario) REFERENCES Mozo(idUsuario) ON DELETE CASCADE
);

create table Delivery(
	idPedido int,
    personalAsig varchar (60) NOT NULL,
    primary key(idPedido),
    foreign key(idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE
);

create table Ventas(
	idVenta int auto_increment,
    hora time NOT NULL,
    fecha date NOT NULL,
    primary key(idVenta)
);

create table Contiene(
	idPedido int,
    idVenta int,
    primary key(idPedido, idVenta),
    foreign key(idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE,
    foreign key(idVenta) REFERENCES Ventas(idVenta) ON DELETE CASCADE
);

create table Factura(
	idVenta int,
    division bool NOT NULL,
    monto int (9) NOT NULL,
    propina int (9) NOT NULL,
    descuento decimal (3, 2), -- Permite hasta 4 decimales para el porcentaje, EJ: 0.20 = 20%
    primary key(idVenta),
    foreign key(idVenta) REFERENCES Ventas(idVenta) ON DELETE CASCADE
);

create table CuentasAsociadas(
	idVenta int,
    idUsuario int,
    montoPorPersona int (9) NOT NULL,
    metodoPago varchar (30) NOT NULL,
    primary key(idVenta),
    foreign key(idVenta) REFERENCES Ventas(idVenta) ON DELETE CASCADE,
    foreign key(idUsuario) REFERENCES Cliente(idUsuario) ON DELETE CASCADE
);

create table Productos(
	idProducto int auto_increment,
    precio int (9) NOT NULL,
    calificacionPromedio float,
    nombre varchar (100) UNIQUE NOT NULL,
    primary key(idProducto)
);

create table Tiene(
	idPedido int,
    idProducto int,
    tiempoPrep time,
    primary key(idPedido, idProducto),
    foreign key(idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE,
    foreign key(idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE
);

create table ProductosFactura(
	idVenta int,
    idProducto int,
    cantidad int (6) NOT NULL,
    precioUnitarioActual int (10) NOT NULL,
    primary key(idVenta, idProducto),
    foreign key(idVenta) REFERENCES Factura(idVenta) ON DELETE CASCADE,
    foreign key(idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE
);

create table Criterios(
	idCriterio int auto_increment,
    criterio varchar (100) UNIQUE NOT NULL,
    primary key(idCriterio)
);

create table CriterioProducto(
	idCriterio int,
    idProducto int,
    primary key(idCriterio, idProducto),
    foreign key(idCriterio) REFERENCES Criterios(idCriterio) ON DELETE CASCADE,
    foreign key(idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE
);

create table Promociones(
	idPromocion int auto_increment,
    nombre varchar (100) UNIQUE NOT NULL,
    descuento decimal (3, 2),
    fidelizado bool NOT NULL,
    primary key(idPromocion)
);

create table Incluyen(
	idProducto int,
    idPromocion int,
    primary key(idProducto, idPromocion),
    foreign key(idPromocion) REFERENCES Promociones(idPromocion) ON DELETE CASCADE,
    foreign key(idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE
);

create table PedidoPromocion(
	idPedido int,
    idPromocion int,
    primary key(idPedido, idPromocion),
    foreign key(idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE,
    foreign key(idPromocion) REFERENCES Promociones(idPromocion) ON DELETE CASCADE
);

create table Ingredientes(
	idIngrediente int auto_increment,
    nombre varchar (100) UNIQUE NOT NULL,
    caducidad date NOT NULL,
    stock int (10) NOT NULL,
    medida varchar (10) NOT NULL,
    primary key(idIngrediente)
);

create table Incluye(
	idProducto int,
    idIngrediente int,
    cantidad int NOT NULL,
    primary key(idProducto, idIngrediente),
    foreign key(idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE,
    foreign key(idIngrediente) REFERENCES Ingredientes(idIngrediente) ON DELETE CASCADE
);

create table Recetas(
	idReceta int auto_increment,
    idProducto int,
    cantPasos int (3) NOT NULL,
    primary key(idReceta),
    foreign key(idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE
);

create table RecetasPasos(
	idPaso int auto_increment,
    idReceta int,
    paso varchar (500) NOT NULL,
    primary key(idPaso),
    foreign key(idReceta) REFERENCES Recetas(idReceta) ON DELETE CASCADE
);

create table RecetasIngredientes(
	idReceta int,
    idIngrediente int,
    primary key(idReceta, idIngrediente),
    foreign key(idReceta) REFERENCES Recetas(idReceta) ON DELETE CASCADE,
    foreign key(idIngrediente) REFERENCES Ingredientes(idIngrediente) ON DELETE CASCADE
);
