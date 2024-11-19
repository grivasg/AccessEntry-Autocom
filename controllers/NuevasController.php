<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use MVC\Router;

class NuevasController
{
    public static function index(Router $router)
    {
        $router->render('nuevas/index', []);
    }

    public static function buscarAPI()
    {
        try {
            $solicitudes = Solicitud::SolicitudesNuevas();
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

    public static function verificarAPI()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $solicitud_id = $_POST['solicitud_id'] ?? null;

                if (!$solicitud_id) {
                    throw new Exception('ID de solicitud no proporcionado');
                }

                // Obtener la solicitud
                $solicitud = Solicitud::find($solicitud_id);

                if (!$solicitud) {
                    throw new Exception('Solicitud no encontrada');
                }

                // Verificar si tiene usuario
                if ($solicitud->sol_cred_usuario == 'SI') {
                    // Si ya tiene usuario, cambiar el estado a 3
                    $resultado = Solicitud::verificarSolicitudSi($solicitud_id);
                } else {
                    // Si no tiene usuario, cambiar el estado a 2
                    $resultado = Solicitud::verificarSolicitud($solicitud_id);
                }

                if ($resultado) {
                    http_response_code(200);
                    echo json_encode([
                        'codigo' => 1,
                        'mensaje' => 'Solicitud procesada exitosamente',
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
                'mensaje' => 'Error al procesar la solicitud',
                'detalle' => $e->getMessage()
            ]);
        }
    }

    public static function rechazarAPI()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $solicitud_id = $_POST['solicitud_id'] ?? null;

                if (!$solicitud_id) {
                    throw new Exception('ID de solicitud no proporcionado');
                }

                $resultado = Solicitud::rechazarSolicitud($solicitud_id); // Pasamos $solicitud_id aquí

                if ($resultado) {
                    http_response_code(200);
                    echo json_encode([
                        'codigo' => 1,
                        'mensaje' => 'Solicitud rechazada exitosamente',
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
                'mensaje' => 'Error al rechazar la solicitud',
                'detalle' => $e->getMessage()
            ]);
        }
    }
};
