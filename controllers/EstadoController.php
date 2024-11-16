<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use MVC\Router;

class EstadoController
{
    public static function index(Router $router)
    {
        $router->render('estado/index', []);
    }


    public static function buscarAPI()
    {
        try {
            $solicitudes = Solicitud::obtenerSolicitudes();
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
                'mensaje' => 'Error al buscar Solicitudes',
                'detalle' => $e->getMessage(),
            ]);
        }
    }
};
