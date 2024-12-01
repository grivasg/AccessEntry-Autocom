<?php

namespace Controllers;

use Exception;
use Model\Modulos;
use Model\Solicitud;
use MVC\Router;

class SolicitudController
{
    public static function index(Router $router)
    {
        $modulos = Modulos::obtenerModeloconQuery();

        $router->render('solicitud/index', [
            'modulos' => $modulos
        ]);
    }


    public static function obtenerModulosAPI()
    {
        header('Content-Type: application/json');

        try {
            $modulos = Modulos::obtenerModeloconQuery();

            echo json_encode([
                'codigo' => 1,
                'modulos' => $modulos
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener módulos',
                'detalle' => $e->getMessage()
            ]);
        }
        exit;
    }


    public static function guardarAPI()
    {
        try {
            // Sanitizar entrada básica
            $_POST['sol_cred_catalogo'] = htmlspecialchars($_POST['sol_cred_catalogo']);

            // Decodificar los arrays JSON y aplicar utf8_decode
            $modulos = array_map('utf8_decode', json_decode($_POST['modulos'], true));
            $justificaciones = array_map('utf8_decode', json_decode($_POST['justificaciones'], true));

            // Validar que haya al menos un módulo y justificación
            if (empty($modulos) || empty($justificaciones)) {
                throw new Exception("Debe incluir al menos un módulo y justificación");
            }

            // Validar que la cantidad de módulos y justificaciones coincida
            if (count($modulos) !== count($justificaciones)) {
                throw new Exception("La cantidad de módulos y justificaciones debe coincidir");
            }

            // Convertir los arrays a cadenas separadas por coma, aplicando utf8_decode
            $modulosString = implode(', ', $modulos);
            $justificacionesString = implode(', ', $justificaciones);

            // Crear la solicitud con los datos del POST y las cadenas de módulos y justificaciones
            $solicitud = new Solicitud($_POST);
            $solicitud->modulos = $modulosString; // Guardar como cadena
            $solicitud->justificaciones = $justificacionesString; // Guardar como cadena

            // Llamada al método guardar en el modelo o base de datos
            $resultado = $solicitud->guardars();

            if ($resultado) {
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Solicitud Generada Exitosamente'
                ]);
            } else {
                throw new Exception("Error al guardar la solicitud");
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al Generar Solicitud',
                'detalle' => $e->getMessage()
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

    // Agregar estos métodos en SolicitudController

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

    public static function obtenerDatosPersonalAPI()
    {
        try {
            $catalogo = filter_var($_POST['sol_cred_catalogo'], FILTER_SANITIZE_NUMBER_INT);

            $datos = Solicitud::obtenerDatosPersonal($catalogo);

            if ($datos) {
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Datos encontrados',
                    'datos' => $datos
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'No se encontraron datos para el catálogo proporcionado'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener datos del personal',
                'detalle' => $e->getMessage()
            ]);
        }
    }
};
