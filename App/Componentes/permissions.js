const MODULE_PERMISSIONS = {
  'mesas': ['Gerente-General', 'Camarero', 'Gerente-Turno'],
  'inventario': ['Gerente-General', 'Gerente-Turno', 'Chef-Ejecutivo'],
  'productos': ['Gerente-General', 'Chef', 'Chef-Ejecutivo', 'Gerente-Turno'],
  'reservas': ['Gerente-General', 'Camarero', 'Gerente-Turno'],
  'cocina': ['Gerente-General', 'Chef', 'Chef-Ejecutivo'],
  'pedidos': ['Gerente-General', 'Camarero'],
  'promociones': ['Gerente-General', 'Chef-Ejecutivo', 'Gerente-Turno'],
  'usuarios': ['Gerente-General'],
  'empresa': ['Gerente-General'],
  'estadisticas': ['Gerente-General']
};

const READ_ONLY_PERMISSIONS = {
  'productos': ['Chef'],
  'inventario': ['Chef-Ejecutivo'],
  'reservas': ['Camarero'],
  'mesas': ['Camarero']
};

function isRoleAllowed(userRole, moduleName) {
  return MODULE_PERMISSIONS[moduleName]?.includes(userRole) || false;
}

function hasWritePermission(userRole, moduleName) {
  if (!isRoleAllowed(userRole, moduleName)) return false;
  return !READ_ONLY_PERMISSIONS[moduleName]?.includes(userRole);
}
