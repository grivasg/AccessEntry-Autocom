<?php

namespace Model;

class Solicitud extends ActiveRecord
{
    protected static $tabla = 'solicitud_credenciales';
    protected static $idTabla = 'solicitud_id';
    protected static $columnasDB = ['sol_cred_catalogo', 'sol_cred_correo', 'sol_cred_telefono', 
                                    'sol_cred_fecha_solicitud', 'sol_cred_modulo', 'sol_cred_justificacion',
                                     'sol_cred_usuario', 'sol_cred_estado_solicitud'];

    public $solicitud_id;
    public $sol_cred_catalogo;
    public $sol_cred_correo;
    public $sol_cred_telefono;
    public $sol_cred_fecha_solicitud;
    public $sol_cred_modulo;
    public $sol_cred_justificacion;
    public $sol_cred_usuario;
    public $sol_cred_estado_solicitud;

    public function __construct($args = [])
    {
        $this->solicitud_id = $args['solicitud_id'] ?? null;
        $this->sol_cred_catalogo = $args['sol_cred_catalogo'] ?? '';
        $this->sol_cred_correo = $args['sol_cred_correo'] ?? '';
        $this->sol_cred_telefono = $args['sol_cred_telefono'] ?? '';
        $this->sol_cred_fecha_solicitud = $args['sol_cred_fecha_solicitud'] ?? '';
        $this->sol_cred_modulo = $args['sol_cred_modulo'] ?? '';
        $this->sol_cred_justificacion = $args['sol_cred_justificacion'] ?? '';
        $this->sol_cred_usuario = $args['sol_cred_usuario'] ?? '';
        $this->sol_cred_estado_solicitud = $args['sol_cred_estado_solicitud'] ?? 1; // Valor por defecto
    }

    public static function obtenerSolicitudes()
    {
        $sql = "SELECT (g.gra_desc_ct || ' DE ' || a.arm_desc_ct) AS Grado_Arma, (m.per_nom1 || ' ' 
                        || m.per_nom2 || ' ' || m.per_ape1 || ' ' || m.per_ape2 || ' ' || m.per_ape3) AS Nombres_Apellidos,
                        sc.sol_cred_catalogo,
                        TRIM(org.org_plaza_desc) || ' - ' || TRIM(d.dep_desc_lg) AS Puesto_Dependencia,  -- Combina plaza y dependencia
                        sc.sol_cred_correo,
                        sc.sol_cred_telefono,
                        sc.sol_cred_fecha_solicitud,
                        sc.sol_cred_modulo,
                        sc.sol_cred_justificacion,
                        sc.sol_cred_usuario,
                        sc.solicitud_id,
                        e.estado_cred_nombre AS Estado_Solicitud
                FROM solicitud_credenciales sc
                JOIN mper m ON sc.sol_cred_catalogo = m.per_catalogo
                JOIN morg org ON m.per_plaza = org.org_plaza
                JOIN mdep d ON org.org_dependencia = d.dep_llave
                JOIN estado_credenciales e ON sc.sol_cred_estado_solicitud = e.estado_cred_id
                JOIN grados g ON m.per_grado = g.gra_codigo
                JOIN armas a ON m.per_arma = a.arm_codigo";
                return self::fetchArray($sql);
    }
    
}