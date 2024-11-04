<?php 
require_once __DIR__ . '/../includes/app.php';

use MVC\Router;
use Controllers\AppController;
use Controllers\SolicitudController;

$router = new Router();
$router->setBaseURL('/' . $_ENV['APP_NAME']);

$router->get('/', [AppController::class, 'index']);

// Rutas de SOLICITUD
$router->get('/solicitud', [SolicitudController::class, 'index']); // Vista principal de solicitudes
$router->get('/API/solicitud/buscar', [SolicitudController::class, 'buscarAPI']); // Buscar solicitud
$router->post('/API/solicitud/guardar', [SolicitudController::class, 'guardarAPI']); // Guardar nueva solicitud
$router->post('/API/solicitud/modificar', [SolicitudController::class, 'modificarAPI']); // Modificar solicitud existente
$router->post('/API/solicitud/eliminar', [SolicitudController::class, 'eliminarAPI']); // Eliminar solicitud
$router->post('/API/solicitud/cambiarestado', [SolicitudController::class, 'cambiarestadoAPI']); // Eliminar solicitud

// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
