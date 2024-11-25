<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use Model\Historial;
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


    public static function guardarHistorialAPI()
    {
        try {
            // Log de los datos recibidos
            error_log('Datos POST recibidos: ' . print_r($_POST, true));

            // Validar datos requeridos
            $solicitudId = filter_var($_POST['his_cred_solicitud_id'], FILTER_SANITIZE_NUMBER_INT);
            $responsableEnvio = filter_var($_POST['his_cred_responsable_envio'], FILTER_SANITIZE_NUMBER_INT);

            if (!$solicitudId || !$responsableEnvio) {
                throw new Exception('Datos de solicitud incompletos');
            }

            // Obtener el correo del destinatario
            $destinatario = Historial::obtenerCorreoDestinatario($solicitudId);
            if (!$destinatario) {
                throw new Exception('No se pudo obtener el correo del destinatario');
            }

            // Crear el historial con todos los campos necesarios
            $historial = new Historial([
                'his_cred_solicitud_id' => $solicitudId,
                'his_cred_responsable_envio' => $responsableEnvio,
                'his_cred_destinatario' => $destinatario,
                'his_cred_metodo_envio' => 'CORREO',
                'his_cred_observaciones' => 'ENVIO AUTOMATICO DE CREDENCIALES.'
            ]);

            // Intentar guardar
            $resultado = $historial->guardar1();

            if ($resultado['resultado']) {
                header('Content-Type: application/json');
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Historial guardado correctamente',
                    'id' => $resultado['id']
                ]);
            } else {
                throw new Exception($resultado['error'] ?? 'Error al guardar el historial');
            }
        } catch (Exception $e) {
            error_log("Error en guardarHistorialAPI: " . $e->getMessage());
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => $e->getMessage()
            ]);
        }
    }

    public static function detallesAPI()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $solicitudId = $_GET['solicitudId'] ?? null;

                if (!$solicitudId) {
                    throw new Exception('ID de solicitud no proporcionado');
                }

                // Obtener la solicitud con los detalles necesarios
                $solicitud = Solicitud::find($solicitudId);

                if (!$solicitud) {
                    throw new Exception('Solicitud no encontrada');
                }

                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Detalles obtenidos exitosamente',
                    'datos' => [
                        'solicitud_id' => $solicitud->solicitud_id,
                        'sol_cred_usuario' => $solicitud->sol_cred_usuario,
                        // Otros detalles que necesites
                    ]
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener detalles',
                'detalle' => $e->getMessage()
            ]);
        }
    }
};
