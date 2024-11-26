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

    public static function obtenerHistorialporId()
    {
        $sql = "SELECT (trim(g.gra_desc_lg) || ' DE ' || trim(a.arm_desc_lg) || ' ' || 
                trim(m.per_nom1) || ' ' || trim(m.per_nom2) || ' ' || 
                trim(m.per_ape1) || ' ' || trim(m.per_ape2)) AS Nombres_Solicitante,
                sc.sol_cred_catalogo,
                sc.sol_cred_fecha_solicitud,
                he.his_cred_fecha_envio AS Fecha_Envio,
                (trim(gr_res.gra_desc_lg) || ' DE ' || trim(ar_res.arm_desc_lg) || ' ' || 
                trim(mr.per_nom1) || ' ' || trim(mr.per_nom2) || ' ' || 
                trim(mr.per_ape1) || ' ' || trim(mr.per_ape2)) AS Nombres_Responsable,
                sc.sol_cred_correo,
                sc.sol_cred_telefono,
                sc.sol_cred_modulo,
                sc.sol_cred_justificacion,
                sc.sol_cred_usuario,
                sc.sol_cred_modulos_autorizados,
                sc.sol_cred_justificacion_autorizacion,
                e.estado_cred_id,
                e.estado_cred_nombre AS Estado_Solicitud,
                he.his_cred_metodo_envio
                FROM solicitud_credenciales sc
                JOIN mper m ON sc.sol_cred_catalogo = m.per_catalogo
                JOIN grados g ON m.per_grado = g.gra_codigo
                JOIN armas a ON m.per_arma = a.arm_codigo
                LEFT JOIN historial_credenciales he ON sc.solicitud_id = he.his_cred_solicitud_id
                LEFT JOIN mper mr ON he.his_cred_responsable_envio = mr.per_catalogo
                LEFT JOIN grados gr_res ON mr.per_grado = gr_res.gra_codigo
                LEFT JOIN armas ar_res ON mr.per_arma = ar_res.arm_codigo
                JOIN estado_credenciales e ON sc.sol_cred_estado_solicitud = e.estado_cred_id
                WHERE sc.sol_cred_estado_solicitud = 4
                ORDER BY sc.solicitud_id ASC";
        return self::fetchArray($sql);
    }

    public static function obtenerHistorial()
    {
        $sql = "SELECT 
                sc.solicitud_id, 
                (trim(g.gra_desc_lg) || ' DE ' || trim(a.arm_desc_lg) || ' ' || 
                trim(m.per_nom1) || ' ' || trim(m.per_nom2) || ' ' || 
                trim(m.per_ape1) || ' ' || trim(m.per_ape2)) AS Nombres_Solicitante,
                sc.sol_cred_catalogo,
                sc.sol_cred_fecha_solicitud,
                he.his_cred_fecha_envio AS Fecha_Envio,
                (trim(gr_res.gra_desc_lg) || ' DE ' || trim(ar_res.arm_desc_lg) || ' ' || 
                trim(mr.per_nom1) || ' ' || trim(mr.per_nom2) || ' ' || 
                trim(mr.per_ape1) || ' ' || trim(mr.per_ape2)) AS Nombres_Responsable,
                sc.sol_cred_correo,
                sc.sol_cred_telefono,
                sc.sol_cred_modulo,
                sc.sol_cred_justificacion,
                sc.sol_cred_usuario,
                sc.sol_cred_modulos_autorizados,
                sc.sol_cred_justificacion_autorizacion,
                e.estado_cred_id,
                e.estado_cred_nombre AS Estado_Solicitud,
                he.his_cred_metodo_envio
            FROM solicitud_credenciales sc
            JOIN mper m ON sc.sol_cred_catalogo = m.per_catalogo
            JOIN grados g ON m.per_grado = g.gra_codigo
            JOIN armas a ON m.per_arma = a.arm_codigo
            LEFT JOIN historial_credenciales he ON sc.solicitud_id = he.his_cred_solicitud_id
            LEFT JOIN mper mr ON he.his_cred_responsable_envio = mr.per_catalogo
            LEFT JOIN grados gr_res ON mr.per_grado = gr_res.gra_codigo
            LEFT JOIN armas ar_res ON mr.per_arma = ar_res.arm_codigo
            JOIN estado_credenciales e ON sc.sol_cred_estado_solicitud = e.estado_cred_id
            WHERE sc.sol_cred_estado_solicitud = 4
            ORDER BY sc.solicitud_id ASC";
        return self::fetchArray($sql);
    }
}
