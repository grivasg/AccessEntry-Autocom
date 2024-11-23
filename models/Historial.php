<?php

namespace Model;

class Solicitud extends ActiveRecord
{
    protected static $tabla = 'historial_credenciales';
    protected static $idTabla = 'envio_id';
    protected static $columnasDB = ['his_cred_solicitud_id', 'his_cred_fecha_envio', 'his_cred_metodo_envio', 'his_cred_responsable_envio', 'his_cred_destinatario', 'his_cred_observaciones'];

    public $envio_id;
    public $his_cred_solicitud_id;
    public $his_cred_fecha_envio;
    public $his_cred_metodo_envio;
    public $his_cred_responsable_envio;
    public $his_cred_destinatario;
    public $his_cred_observaciones;


    public function __construct($args = [])
    {
        $this->envio_id = $args['solicitud_id'] ?? null;
        $this->his_cred_solicitud_id = $args['sol_cred_catalogo'] ?? '';
        $this->his_cred_fecha_envio = $args['sol_cred_correo'] ?? '';
        $this->his_cred_metodo_envio = $args['sol_cred_telefono'] ?? '';
        $this->his_cred_responsable_envio = $args['sol_cred_modulo'] ?? '';
        $this->his_cred_destinatario = $args['sol_cred_justificacion'] ?? '';
        $this->his_cred_observaciones = $args['sol_cred_fecha_solicitud'] ?? '';
    }
}
