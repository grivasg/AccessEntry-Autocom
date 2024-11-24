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
}
