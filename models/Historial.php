<?php

namespace Model;

class Historial extends ActiveRecord
{
    protected static $tabla = 'historial_credenciales';
    protected static $idTabla = 'envio_id';
    protected static $columnasDB = [
        'envio_id',
        'his_cred_solicitud_id',
        'his_cred_fecha_envio',
        'his_cred_metodo_envio',
        'his_cred_responsable_envio',
        'his_cred_destinatario',
        'his_cred_observaciones'
    ];

    public $envio_id;
    public $his_cred_solicitud_id;
    public $his_cred_fecha_envio;
    public $his_cred_metodo_envio;
    public $his_cred_responsable_envio;
    public $his_cred_destinatario;
    public $his_cred_observaciones;

    public function __construct($args = [])
    {
        $this->envio_id = $args['envio_id'] ?? null;
        $this->his_cred_solicitud_id = $args['his_cred_solicitud_id'] ?? '';
        $this->his_cred_fecha_envio = date('Y-m-d H:i:s');
        $this->his_cred_metodo_envio = $args['his_cred_metodo_envio'] ?? '';
        $this->his_cred_responsable_envio = $args['his_cred_responsable_envio'] ?? '';
        $this->his_cred_destinatario = $args['his_cred_destinatario'] ?? '';
        $this->his_cred_observaciones = $args['his_cred_observaciones'] ?? '';
    }

    public static function obtenerCorreoDestinatario($solicitudId)
    {
        try {
            $query = "SELECT sol_cred_correo FROM solicitud_credenciales WHERE solicitud_id = " .
                self::$db->quote($solicitudId);

            $resultado = self::fetchFirst($query);

            if ($resultado && isset($resultado['sol_cred_correo'])) {
                return $resultado['sol_cred_correo'];
            }
            return null;
        } catch (\Exception $e) {
            error_log("Error al obtener correo: " . $e->getMessage());
            return null;
        }
    }

    public function guardar1()
    {
        try {
            if (!$this->envio_id) {
                // Si es un nuevo registro, usamos el método crear() del ActiveRecord
                return parent::crear();
            } else {
                // Si es una actualización, usamos el método actualizar() del ActiveRecord
                return parent::actualizar();
            }
        } catch (\Exception $e) {
            error_log("Error al guardar historial: " . $e->getMessage());
            return [
                'resultado' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    // Método para validar que todos los campos requeridos estén presentes
    public function validar()
    {
        if (!$this->his_cred_solicitud_id) {
            self::setAlerta('error', 'El ID de solicitud es obligatorio');
        }
        if (!$this->his_cred_metodo_envio) {
            self::setAlerta('error', 'El método de envío es obligatorio');
        }
        if (!$this->his_cred_responsable_envio) {
            self::setAlerta('error', 'El responsable del envío es obligatorio');
        }
        if (!$this->his_cred_destinatario) {
            self::setAlerta('error', 'El destinatario es obligatorio');
        }

        return self::getAlertas();
    }

    public static function findByFechaEnvio($fechaInicio, $fechaFin)
    {
        try {
            // Debug para ver las fechas
            error_log("Fecha Inicio: " . $fechaInicio);
            error_log("Fecha Fin: " . $fechaFin);

            // Consulta SQL para buscar registros entre las fechas
            $query = "SELECT h.*, 
           s.solicitud_id,
           m.per_nom1 as responsable_nombre
        FROM historial_credenciales h
        LEFT JOIN solicitud_credenciales s ON h.his_cred_solicitud_id = s.solicitud_id
        LEFT JOIN mper m ON h.his_cred_responsable_envio = m.per_catalogo
        WHERE h.his_cred_fecha_envio BETWEEN ? AND ?
        ORDER BY h.his_cred_fecha_envio DESC";

            // Parametros de búsqueda
            $params = [$fechaInicio, $fechaFin];

            // Realizar la consulta y devolver los resultados
            $resultados = static::consultarSQL($query, $params);

            // Debug para ver los resultados
            error_log("Cantidad de resultados: " . count($resultados));

            return $resultados;
        } catch (\Exception $e) {
            error_log("Error en findByFechaEnvio: " . $e->getMessage());
            return [];
        }
    }
}
