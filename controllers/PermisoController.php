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

    public static function otorgarAPI()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $solicitud_id = $_POST['solicitud_id'] ?? null;

                if (!$solicitud_id) {
                    throw new Exception('ID de solicitud no proporcionado');
                }

                $resultado = Solicitud::permisoOtorgado($solicitud_id); // Pasamos $solicitud_id aquí

                if ($resultado) {
                    http_response_code(200);
                    echo json_encode([
                        'codigo' => 1,
                        'mensaje' => 'Solicitud verificada exitosamente',
                        'detalle' => ''
                    ]);
                } else {
                    throw new Exception('Error al actualizar el estado');
                }
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al verificar la solicitud',
                'detalle' => $e->getMessage()
            ]);
        }
    }
};
