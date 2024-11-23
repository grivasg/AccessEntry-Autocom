<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use MVC\Router;

class PendientesController
{
    public static function index(Router $router)
    {
        $router->render('pendientes/index', []);
    }

    public static function buscarAPI()
    {
        try {
            $solicitudes = Solicitud::PendientesConfirmacion();
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

    public static function catalogoExisteAPI()
    {
        try {
            $catalogo = filter_var($_POST['sol_cred_catalogo'], FILTER_SANITIZE_NUMBER_INT);


            if (Solicitud::catalogoExiste($catalogo)) {
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Catálogo encontrado'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Catálogo no encontrado'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al verificar el catálogo',
                'detalle' => $e->getMessage()
            ]);
        }
    }
};
