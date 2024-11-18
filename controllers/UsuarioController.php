<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use Model\Usuario;
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

    public static function guardarAPI()
    {
        // Recibir los datos como JSON
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['usu_id'], $data['usuario'], $data['password'])) {
            // Sanitizar los datos
            $usu_id = htmlspecialchars($data['usu_id']);
            $usuario = htmlspecialchars($data['usuario']);
            $password = htmlspecialchars($data['password']);

            try {
                // Crear un nuevo objeto Usuario con los datos recibidos
                $usuarioModel = new Usuario([
                    'usu_id' => $usu_id,
                    'usuario' => $usuario,  // El nombre de usuario o ID de usuario
                    'password' => $password  // Contraseña
                ]);

                // Guardar el nuevo usuario en la base de datos
                $resultado = $usuarioModel->crear();

                // Retornar respuesta de éxito
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Credenciales Guardadas Exitosamente',
                ]);
            } catch (Exception $e) {
                // Manejo de errores
                http_response_code(500);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Error al Guardar Credenciales',
                    'detalle' => $e->getMessage(),
                ]);
            }
        } else {
            // Si faltan datos
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Datos incompletos'
            ]);
        }
    }
};
