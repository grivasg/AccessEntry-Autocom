<?php

namespace Controllers;

use Exception;
use Model\Historial;
use MVC\Router;

class HistorialController
{
    public static function index(Router $router)
    {
        $router->render('historial/index', []);
    }

    public static function buscarAPI()
    {
        try {
            $solicitudes = Historial::obtenerHistorial();
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
}
