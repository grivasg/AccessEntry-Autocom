<?php

namespace Controllers;

use Exception;
use Model\PasswordTemp;

class PasswordsController
{

    public static function guardarTempAPI()
    {
        try {
            $rawInput = file_get_contents("php://input");
            error_log("Raw input received: " . $rawInput);

            $data = json_decode($rawInput, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON data received: ' . json_last_error_msg());
            }

            error_log("Decoded data: " . print_r($data, true));

            // Verificar que todos los campos necesarios estén presentes
            $requiredFields = ['solicitud_id', 'password_encriptada', 'pass_token', 'encryption_key'];
            $missingFields = [];

            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    $missingFields[] = $field;
                }
            }

            if (!empty($missingFields)) {
                throw new Exception('Faltan campos requeridos: ' . implode(', ', $missingFields));
            }

            // Crear nueva instancia de PasswordTemp
            $passwordTemp = new PasswordTemp([
                'pass_solicitud_id' => $data['solicitud_id'],
                'password_encriptada' => $data['password_encriptada'],
                'pass_token' => $data['pass_token'],
                'encryption_key' => $data['encryption_key'],
                'pass_fecha_creacion' => date('Y-m-d')
            ]);

            // Verificar que el modelo sea válido antes de guardar
            if (!$passwordTemp->pass_solicitud_id || !$passwordTemp->password_encriptada) {
                throw new Exception('Datos inválidos en el modelo');
            }

            // Guardar en la base de datos
            if ($passwordTemp->guardar()) {
                error_log("Password saved successfully for solicitud_id: " . $data['solicitud_id']);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Contraseña temporal guardada exitosamente'
                ]);
            } else {
                throw new Exception('Error al guardar la contraseña temporal: ' . print_r($passwordTemp->getErrors(), true));
            }
        } catch (Exception $e) {
            error_log("Error in guardarTempAPI: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());

            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al guardar la contraseña temporal',
                'detalle' => $e->getMessage()
            ]);
        }


    }


    
    public static function obtenerPasswordAPI()
    {
        ob_clean();
        header('Content-Type: application/json');

        try {
            $solicitudId = $_GET['solicitudId'] ?? null;

            error_log("Received solicitudId: " . print_r($solicitudId, true));

            if (!$solicitudId) {
                throw new Exception('ID de solicitud no proporcionado');
            }

            $passwordTemp = PasswordTemp::recuperarPasswordTemporal($solicitudId);

            if (!$passwordTemp) {
                throw new Exception('No se encontró password temporal para solicitudId: ' . $solicitudId);
            }

            echo json_encode([
                'codigo' => 1,
                'password_encriptada' => $passwordTemp['password_encriptada'],
                'pass_token' => $passwordTemp['pass_token'],  // Add this line
                'encryption_key' => $passwordTemp['encryption_key']
            ]);
            exit;
        } catch (Exception $e) {
            error_log("Error in obtenerPasswordAPI: " . $e->getMessage());
            echo json_encode([
                'codigo' => 0,
                'error' => $e->getMessage()
            ]);
            exit;
        }
    }
};
