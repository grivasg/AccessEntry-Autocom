<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use MVC\Router;
use phpseclib3\Net\SFTP;

class FTPController
{
    public static function subir(Router $router)
    {
        $router->render('ftp/index');
    }

    public static function subirAPI()
    {
        $db = Solicitud::getDB();
        $db->beginTransaction();

        try {
            // Verificar si el archivo está presente y sin errores
            if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] != UPLOAD_ERR_OK) {
                throw new Exception('No se ha recibido el archivo o hay un error en la subida', 400);
            }

            // Obtener los detalles del archivo
            $files = $_FILES['archivo'];

            // Datos de conexión al servidor SFTP
            $ftpServer = $_ENV['FILE_SERVER'];
            $ftpUsername = $_ENV['FILE_USER'];
            $ftpPassword = $_ENV['FILE_PASSWORD'];
            $remoteFilePath = $_ENV['FILE_DIR'];

            // Conectar al servidor SFTP
            $sftp = new SFTP($ftpServer);
            if (!$sftp->login($ftpUsername, $ftpPassword)) {
                throw new Exception('No se pudo conectar al servidor SFTP', 500);
            }

            // Crear un nombre único para el archivo y obtener su extensión
            $nombre = uniqid();
            $partes = explode('.', $files['name']);
            $extension = strtolower($partes[1]);
            $ruta = $remoteFilePath . $nombre . "." . $extension;

            // Subir el archivo al servidor SFTP
            $subido = $sftp->put($ruta, $files['tmp_name'], SFTP::SOURCE_LOCAL_FILE);

            if ($subido) {
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Archivo subido correctamente',
                ]);
            } else {
                throw new Exception("No se subió el archivo", 500);
            }

            // Desconectar del servidor SFTP
            $sftp->disconnect();
            $db->commit();
        } catch (Exception $e) {
            // En caso de error, se muestra un mensaje
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al subir el archivo',
                'detalle' => $e->getMessage()
            ]);
            $db->rollBack();
        }
    }
}
