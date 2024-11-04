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

    public static function verificarAPI($id) {
        try {
            // Buscar la solicitud por ID
            $solicitud = Solicitud::find($id);
            
            // Verificar si la solicitud existe
            if (!$solicitud) {
                http_response_code(404);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Solicitud no encontrada.',
                ]);
                return;
            }
    
            // Verificar si la solicitud tiene el estado correcto para ser verificada
            if ($solicitud->sol_cred_estado_solicitud == 1) { // 1 = "Pendiente de Verificación"
                // Cambiar el estado de la solicitud a "Solicitud Enviada" (estado 2)
                $sql = "UPDATE solicitud_credenciales 
                        SET sol_cred_estado_solicitud = 2 
                        WHERE solicitud_id = :id";
                $stmt = self::$db->prepare($sql);
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
    
                // Respuesta exitosa
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Solicitud verificada y estado cambiado a "Solicitud Enviada".',
                ]);
            } else {
                // Si la solicitud ya no está en el estado "Pendiente de Verificación", devuelve un error
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'La solicitud no está en el estado correcto para ser verificada.',
                ]);
            }
        } catch (Exception $e) {
            // Error al intentar cambiar el estado
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al verificar la solicitud',
                'detalle' => $e->getMessage(),
            ]);
        }
    }
    
    

};
