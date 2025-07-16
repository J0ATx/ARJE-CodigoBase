drop database if exists losTresTanosDB;
create database losTresTanosDB;
use losTresTanosDB;

create table Usuario(
    idUsuario int auto_increment,
    nombre varchar (30),
    apellido varchar (30),
    contrasenia varchar (30),
    gmail varchar (100) UNIQUE,
    calificacion int (2),
    primary key(idUsuario)
);

create table Telefono(
    idTel int auto_increment,
    idUsuario int,
    numTel int (9) UNIQUE,
    primary key(idTel), primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Usuario(idUsuario)
);

create table Cliente(
    idUsuario int,
    noShows int (3),
    platilloFav varchar (40),
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Usuario(idUsuario)
);

create table Alergias(
    idAlergia int auto_increment,
    nombreAler varchar (40) UNIQUE,
    primary key(idAlergia)
);

create table ClienteAlergias(
    idUsuario int,
    idAlergia int,
    primary key(idUsuario), primary key(idAlergia),
    foreign key(idUsuario) REFERENCES Cliente(idUsuario),
    foreign key(idAlergia) REFERENCES Alergias(idAlergia)
);

create table Gerente(
    idUsuario int,
    fechContratacion date,
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Usuario(idUsuario)
);

create table TurnoGerente(
    idTurno int auto_increment,
    idUsuario int,
    turnoAsignado varchar (20),
    horasSemanales int (3),
    inicioTurno time,
    finTurno time,
    primary key(idTurno), primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Gerente(idUsuario)
);

create table AreasResponsabilidad(
    idArea int auto_increment,
    nombreArea varchar (40) UNIQUE,
    primary key(idArea)
);

create table TurnoGerenteArea(
    idUsuario int,
    idTurno int,
    idArea int,
    primary key(idUsuario), primary key(idTurno), primary key(idArea),
    foreign key(idUsuario) REFERENCES Gerente(idUsuario),
    foreign key(idTurno) REFERENCES TurnoGerente(idTurno),
    foreign key(idArea) REFERENCES AreasResponsabilidad(idArea)
);

create table Chef(
    idUsuario int,
    fechContratacion date,
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Usuario(idUsuario)
);

create table TurnoChef(
	idUsuario int,
    idTurno int auto_increment,
    turnoAsignado varchar (30),
    horasSemanales int (3),
    inicioTurno time,
    finTurno time,
    primary key(idUsuario), primary key(idTurno),
    foreign key(idUsuario) REFERENCES Chef(idUsuario)
);

create table Especialidades(
	idEspecialidad int auto_increment,
    nombreEspecialidad varchar (40),
    primary key(idEspecialidad)
);

create table NivelEspecialidadChef(
	idUsuario int,
    idEspecialidad int,
    nivelHabilidad int (2),
    aniosExperiencia int (3),
    primary key(idUsuario), primary key(idEspecialidad),
    foreign key(idUsuario) REFERENCES Chef(idUsuario),
    foreign key(idEspecialidad) REFERENCES Especialidades(idEspecialidad)
);

create table TurnoChefEspecialidad(
	idUsuario int,
    idTurno int,
    idEspecialidad int,
    primary key(idUsuario), primary key(idTurno), primary key(idEspecialidad),
    foreign key(idUsuario) REFERENCES Chef(idUsuario),
    foreign key(idTurno) REFERENCES TurnoChef(idTurno),
    foreign key(idEspecialidad) REFERENCES Especialidades(idEspecialidad)
);

create table ChefEjecutivo(
	idUsuario int,
    fechPromocionEjec date,
    presupuestoAnualCocina int (10),
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Usuario(idUsuario)
);

create table TurnoChefEjec(
	idUsuario int,
    idTurno int auto_increment,
    turnoAsignado varchar (30),
    horasSemanales int (3),
    inicioTurno time,
    finTurno time,
    primary key(idUsuario), primary key(idTurno),
    foreign key(idUsuario) REFERENCES ChefEjecutivo(idUsuario)
);

create table NivelEspecialidadChefEjec(
	idUsuario int,
    idEspecialidad int,
    nivelHabilidad int (2),
    aniosExperiencia int (3),
    primary key(idUsuario), primary key(idEspecialidad),
    foreign key(idUsuario) REFERENCES ChefEjecutivo(idUsuario),
    foreign key(idEspecialidad) REFERENCES Especialidades(idEspecialidad)
);

create table TurnoChefEjecEspecialidad(
	idUsuario int,
    idTurno int,
    idEspecialidad int,
    primary key(idUsuario), primary key(idTurno), primary key(idEspecialidad),
    foreign key(idUsuario) REFERENCES ChefEjecutivo(idUsuario),
    foreign key(idTurno) REFERENCES TurnoChefEjec(idTurno),
    foreign key(idEspecialidad) REFERENCES Especialidades(idEspecialidad)
);

create table ClienteNormal(
	idUsuario int,
    cantPedidosRealizados int (6),
    totalDineroGastado int (9),
    fechUltimaCompra date,
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Cliente(idUsuario)
);

create table ClienteFidelizado(
	idUsuario int,
    cantPedidosRealizados int (6),
    totalDineroGastado int (9),
    fechInicioFidelidad date,
    nivelFidelidad int (2),
    fechUltimaCompra date,
    primary key(idUsuario),
    foreign key(idUsuario) REFERENCES Cliente(idUsuario)
);

create table Pedido(
	idPedido int auto_increment,
    montoTotal int (6),
    pagoPedido int (6),
    pagoPropina int (6),
    fechReg date,
    primary key(idPedido)
);

create table Relaciona(
	idUsuario int,
    idPedido int,
    primary key(idUsuario), primary key(idPedido),
    foreign key(idUsuario) REFERENCES Cliente(idUsuario),
    foreign key(idPedido) REFERENCES Pedido(idPedido)
);

create table Especificaciones(
	idEspecificacion int auto_increment,
    especificacion varchar (100),
    primary key(idEspecificacion)
);

create table EspecificacionesPedido(
	idEspecificacion int,
    idPedido int,
    primary key(idEspecificacion), primary key(idPedido),
    foreign key(idEspecificacion) REFERENCES Especificaciones(idEspecificacion),
    foreign key(idPedido) REFERENCES Pedido(idPedido)
);

create table Mesas(
	idMesa int auto_increment,
    estadoActual varchar (30),
    fechUsoOcupadoReservado datetime,
    primary key(idMesa)
);

create table PedidoFisico(
	idPedido int,
    idMesa int,
    primary key(idPedido),
    foreign key(idPedido) REFERENCES Pedido(idPedido),
    foreign key(idMesa) REFERENCES Mesas(idMesa)
);

create table ParaLlevar(
	idPedido int,
    horaRecogidaEstimada time,
    primary key(idPedido),
    foreign key(idPedido) REFERENCES Pedido(idPedido)
);

create table Reserva(
	idPedido int,
    idMesa int,
    fecha date,
    horaInicio time,
    duracion time, -- se guarda en TIME ya que cuando inicie la reserva, no va a durar mas de 24h
    primary key(idPedido),
    foreign key(idPedido) REFERENCES Pedido(idPedido),
    foreign key(idMesa) REFERENCES Mesas(idMesa)
);

create table Delivery(
	idPedido int,
    personalAsig varchar (60),
    primary key(idPedido),
    foreign key(idPedido) REFERENCES Pedido(idPedido)
);

create table Ventas(
	idVenta int auto_increment,
    hora time,
    fecha date,
    primary key(idVenta)
);

create table Contiene(
	idPedido int,
    idVenta int,
    primary key(idPedido), primary key(idVenta),
    foreign key(idPedido) REFERENCES Pedido(idPedido),
    foreign key(idVenta) REFERENCES Ventas(idVenta)
);

create table Factura(
	idVenta int,
    division bool,
    monto int (9),
    propina int (9),
    descuento decimal (3, 2), -- Permite hasta 4 decimales para el porcentaje, EJ: 0.20 = 20%
    primary key(idVenta),
    foreign key(idVenta) REFERENCES Ventas(idVenta)
);

create table CuentasAsociadas(
	idVenta int,
    idUsuario int,
    montoPorPersona int (9),
    metodoPago varchar (30),
    primary key(idVenta), primary key(idUsuario),
    foreign key(idVenta) REFERENCES Ventas(idVenta),
    foreign key(idUsuario) REFERENCES Cliente(idUsuario)
);

create table Productos(
	idProducto int auto_increment,
    precio int (9),
    calificacionPromedio float,
    nombre varchar (100),
    primary key(idProducto)
);

create table Tiene(
	idPedido int,
    idProducto int,
    tiempoPrep time,
    primary key(idPedido), primary key(idProducto),
    foreign key(idPedido) REFERENCES Pedido(idPedido),
    foreign key(idProducto) REFERENCES Productos(idProducto)
);

create table ProductosFactura(
	idVenta int,
    idProducto int,
    cantidad int (6),
    precioUnitarioActual int (10),
    primary key(idVenta), primary key(idProducto),
    foreign key(idVenta) REFERENCES Factura(idVenta),
    foreign key(idProducto) REFERENCES Productos(idProducto)
);

create table Criterios(
	idCriterio int auto_increment,
    criterio varchar (100),
    primary key(idCriterio)
);

create table CriterioProducto(
	idCriterio int,
    idProducto int,
    primary key(idCriterio), primary key(idProducto),
    foreign key(idCriterio) REFERENCES Criterios(idCriterio),
    foreign key(idProducto) REFERENCES Productos(idProducto)
);

create table Promociones(
	idPromocion int auto_increment,
    nombre varchar (100),
    descuento decimal (3, 2),
    fidelizado bool,
    primary key(idPromocion)
);

create table Incluyen(
	idProducto int,
    idPromocion int,
    primary key(idProducto), primary key(idPromocion),
    foreign key(idPromocion) REFERENCES Promociones(idPromocion),
    foreign key(idProducto) REFERENCES Productos(idProducto)
);

create table PedidoPromocion(
	idPedido int,
    idPromocion int,
    primary key(idPedido), primary key(idPromocion),
    foreign key(idPedido) REFERENCES Pedido(idPedido),
    foreign key(idPromocion) REFERENCES Promociones(idPromocion)
);

create table Ingredientes(
	idIngrediente int auto_increment,
    nombre varchar (100),
    caducidad date,
    stock int (10),
    primary key(idIngrediente)
);

create table Incluye(
	idProducto int,
    idIngrediente int,
    primary key(idProducto), primary key(idIngrediente),
    foreign key(idProducto) REFERENCES Productos(idProducto),
    foreign key(idIngrediente) REFERENCES Ingredientes(idIngrediente)
);

create table Recetas(
	idReceta int auto_increment,
    idProducto int,
    cantPasos int (3),
    primary key(idReceta),
    foreign key(idProducto) REFERENCES Productos(idProducto)
);

create table RecetasPasos(
	idPaso int auto_increment,
    idReceta int,
    paso varchar (500),
    primary key(idPaso), primary key(idReceta),
    foreign key(idReceta) REFERENCES Recetas(idReceta)
);

create table RecetasIngredientes(
	idReceta int,
    idIngrediente int,
    primary key(idReceta), primary key(idIngrediente),
    foreign key(idReceta) REFERENCES Recetas(idReceta),
    foreign key(idIngrediente) REFERENCES Ingredientes(idIngrediente)
);
