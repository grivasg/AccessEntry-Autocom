<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use MVC\Router;

class UsuarioController
{
    public static function index(Router $router)
    {
        $router->render('usuario/index', []);
    }

    public static function buscarAPI()
    {
        try {
            $solicitudes = Solicitud::CreacionUsuario();
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

    public static function actualizarPasswordAPI()
    {
        // Recibir los datos de la petición (en este caso solo el password y el solicitud_id)
        $data = json_decode(file_get_contents("php://input"), true);

        // Verificar que la solicitud_id y el password estén presentes
        if (isset($data['solicitud_id']) && isset($data['password'])) {

            // Sanitizar los datos para evitar problemas de seguridad
            $solicitud_id = htmlspecialchars($data['solicitud_id']);
            $password = htmlspecialchars($data['password']);

            // Hacer el hash de la contraseña
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            try {
                // Actualizar el campo password de la solicitud correspondiente
                $solicitud = Solicitud::find($solicitud_id); // Buscar la solicitud por ID

                if ($solicitud) {
                    // Si la solicitud existe, actualizamos el password
                    $solicitud->password = $hashedPassword;

                    // Guardar los cambios en la base de datos
                    $solicitud->guardar();

                    // Retornar respuesta de éxito
                    http_response_code(200);
                    echo json_encode([
                        'codigo' => 1,
                        'mensaje' => 'Contraseña actualizada exitosamente'
                    ]);
                } else {
                    // Si la solicitud no existe
                    http_response_code(404);
                    echo json_encode([
                        'codigo' => 0,
                        'mensaje' => 'Solicitud no encontrada'
                    ]);
                }
            } catch (Exception $e) {
                // Si ocurre algún error
                http_response_code(500);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Error al actualizar la contraseña',
                    'detalle' => $e->getMessage(),
                ]);
            }
        } else {
            // Si falta alguno de los datos requeridos
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Datos incompletos, falta la solicitud_id o la contraseña'
            ]);
        }
    }

    public static function enviarAPI()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $solicitud_id = $_POST['solicitud_id'] ?? null;

                if (!$solicitud_id) {
                    throw new Exception('ID de solicitud no proporcionado');
                }

                $resultado = Solicitud::enviarSolicitud($solicitud_id); // Pasamos $solicitud_id aquí

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
