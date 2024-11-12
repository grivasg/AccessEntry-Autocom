<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use MVC\Router;

class SolicitudController
{
    public static function index(Router $router)
    {
        $router->render('solicitud/index', []);
    }

    public static function guardarAPI()
    {
        $_POST['sol_cred_catalogo'] = htmlspecialchars($_POST['sol_cred_catalogo']);

        try {
            $solicitud = new Solicitud($_POST);
            $resultado = $solicitud->crear();
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Solicitud Generada Exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al Generar Solicitud',
                'detalle' => $e->getMessage(),
            ]);
        }
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


    public static function modificarAPI()
    {
        $id = filter_var($_POST['solicitud_id'], FILTER_SANITIZE_NUMBER_INT);

        try {
            $solicitud = Solicitud::find($id);
            $solicitud->sincronizar($_POST);
            $solicitud->actualizar();
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Datos modificados exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al modificar los Datos',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function eliminarAPI()
    {

        $id = filter_var($_POST['solicitud_id'], FILTER_SANITIZE_NUMBER_INT);

        try {

            $solicitud = Solicitud::find($id);
            $solicitud->eliminar();
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Solicitud Eliminada Exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al Eliminar Solicitud',
                'detalle' => $e->getMessage(),
            ]);
        }
    }


    public static function verificarAPI()
    {
        $id = filter_var($_POST['solicitud_id'], FILTER_SANITIZE_NUMBER_INT);
        

        try {
            // Buscar la solicitud por ID
            $solicitud = Solicitud::find($id);

            // Verificamos si la solicitud existe
            if (!$solicitud) {
                throw new Exception("Solicitud no encontrada.");
            }

            // Cambiamos el estado de la solicitud a "verificada" o el valor que corresponda
            $solicitud->sol_cred_estado_solicitud = 2; // O el estado que corresponda para "verificada"

            // Actualizamos la solicitud en la base de datos
            $solicitud->actualizar();

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Solicitud verificada exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al verificar solicitud',
                'detalle' => $e->getMessage(),
            ]);
        }
    }
};
