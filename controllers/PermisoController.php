<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use MVC\Router;

class PermisoController
{
    public static function index(Router $router)
    {
        $router->render('permiso/index', []);
    }
    
    public static function buscarAPI()
    {
        try {
            $solicitudes = Solicitud::OtorgarPermisos();
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Datos encontrados',
                'detalle' => '',
                'datos' => $solicitudes
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'No se Encontraron Solicitudes Nuevas',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

};
