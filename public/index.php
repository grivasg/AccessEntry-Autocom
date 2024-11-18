<?php
require_once __DIR__ . '/../includes/app.php';

use MVC\Router;
use Controllers\AppController;
use Controllers\EstadoController;
use Controllers\FinalizadasController;
use Controllers\FTPController;
use Controllers\NuevasController;
use Controllers\PendientesController;
use Controllers\PermisoController;
use Controllers\SolicitudController;
use Controllers\UsuarioController;

$router = new Router();
$router->setBaseURL('/' . $_ENV['APP_NAME']);

$router->get('/', [AppController::class, 'index']);

// RUTAS DE SOLICITUD
$router->get('/solicitud', [SolicitudController::class, 'index']); // Vista principal de solicitudes
$router->get('/API/solicitud/buscar', [SolicitudController::class, 'buscarAPI']); // Buscar solicitud
$router->post('/API/solicitud/guardar', [SolicitudController::class, 'guardarAPI']); // Guardar nueva solicitud
$router->post('/API/solicitud/modificar', [SolicitudController::class, 'modificarAPI']); // Modificar solicitud existente
$router->post('/API/solicitud/eliminar', [SolicitudController::class, 'eliminarAPI']); // Eliminar solicitud
$router->post('API/solicitud/verificar', [SolicitudController::class, 'verificarAPI']);
$router->post('/API/solicitud/verificar', [SolicitudController::class, 'verificarAPI']);
$router->post('/API/solicitud/catalogoExiste', [SolicitudController::class, 'catalogoExisteAPI']);
$router->post('/API/solicitud/obtenerDatosPersonal', [SolicitudController::class, 'obtenerDatosPersonalAPI']);
$router->post('/API/solicitud/actualizarPassword', [UsuarioController::class, 'actualizarPasswordAPI']); // Guardar nueva solicitud

// RUTAS DE ESTADO
$router->get('/estado', [EstadoController::class, 'index']);
$router->get('/API/estado/buscar', [EstadoController::class, 'buscarAPI']);

// RUTAS DE NUEVAS SOLICITUDES
$router->get('/nuevas', [NuevasController::class, 'index']);
$router->get('/API/nuevas/buscar', [NuevasController::class, 'buscarAPI']);
$router->post('/API/nuevas/verificar', [NuevasController::class, 'verificarAPI']);
$router->post('/API/nuevas/rechazar', [NuevasController::class, 'rechazarAPI']);

// RUTAS DE SOLICITUDES FINALIZADAS
$router->get('/finalizadas', [FinalizadasController::class, 'index']);
$router->get('/API/finalizadas/buscar', [FinalizadasController::class, 'buscarAPI']);

// RUTAS DE CREACION DE USUARIO
$router->get('/usuario', [UsuarioController::class, 'index']);
$router->get('/API/usuario/buscar', [UsuarioController::class, 'buscarAPI']);
$router->post('/API/usuario/enviar', [UsuarioController::class, 'enviarAPI']);


$router->get('/subir', [FTPController::class, 'subir']);
$router->post('/API/ftp/subir', [FTPController::class, 'subirAPI']);
$router->get('/mostrar', [FTPController::class, 'mostrar']);

// RUTAS DE ASIGNACION DE PERMISOS
$router->get('/permiso', [PermisoController::class, 'index']);
$router->get('/API/permiso/buscar', [PermisoController::class, 'buscarAPI']);

// RUTAS DE ASIGNACION DE PERMISOS
$router->get('/pendientes', [PendientesController::class, 'index']);
$router->get('/API/pendientes/buscar', [PendientesController::class, 'buscarAPI']);


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
