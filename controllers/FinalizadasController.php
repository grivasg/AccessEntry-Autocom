<?php

namespace Controllers;

use Exception;
use Model\Historial;
use MVC\Router;

class FinalizadasController
{
    public static function index(Router $router)
    {
        $router->render('finalizadas/index', []);
    }

    public static function buscarAPI()
    {
        header('Content-Type: application/json');

        try {
            if (!isset($_GET['fecha_inicio']) || !isset($_GET['fecha_fin'])) {
                throw new Exception('Las fechas son requeridas');
            }

            // Obtener y sanitizar las fechas
            $fechaInicio = filter_var($_GET['fecha_inicio'], FILTER_SANITIZE_STRING);
            $fechaFin = filter_var($_GET['fecha_fin'], FILTER_SANITIZE_STRING);

            // Validar el formato de las fechas
            if (!strtotime($fechaInicio) || !strtotime($fechaFin)) {
                throw new Exception('Formato de fecha inválido');
            }

            // Ajustar las fechas a formato adecuado con horas
            $fechaInicioFormateada = date('Y-m-d 00:00:00', strtotime($fechaInicio));
            $fechaFinFormateada = date('Y-m-d 23:59:59', strtotime($fechaFin));

            // Debug para ver las fechas recibidas
            error_log("Búsqueda - Fecha Inicio: " . $fechaInicioFormateada);
            error_log("Búsqueda - Fecha Fin: " . $fechaFinFormateada);

            // Buscar en la base de datos
            $resultados = Historial::findByFechaEnvio($fechaInicioFormateada, $fechaFinFormateada);

            // Debug para ver los resultados
            error_log("Resultados encontrados: " . json_encode($resultados));

            if ($resultados && count($resultados) > 0) {
                echo json_encode([
                    'tipo' => 'exito',
                    'datos' => $resultados,
                    'cantidad' => count($resultados)
                ]);
            } else {
                echo json_encode([
                    'tipo' => 'info',
                    'mensaje' => 'No se encontraron registros para el rango de fechas especificado.',
                    'debug' => [
                        'fecha_inicio' => $fechaInicioFormateada,
                        'fecha_fin' => $fechaFinFormateada
                    ]
                ]);
            }
        } catch (Exception $e) {
            error_log("Error en buscarAPI: " . $e->getMessage());
            echo json_encode([
                'tipo' => 'error',
                'mensaje' => $e->getMessage(),
                'debug' => true
            ]);
        }
        return;
    }
};
