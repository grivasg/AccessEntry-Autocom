<?php

namespace Model;

class Estado extends ActiveRecord
{
    protected static $tabla = 'estado_credenciales';
    protected static $idTabla = 'estado_cred_id';
    protected static $columnasDB = ['estado_cred_nombre'];

    public $estado_cred_id;
    public $estado_cred_nombre;

    public function __construct($args = [])
    {
        $this->estado_cred_id = $args['estado_cred_id'] ?? null;
        $this->estado_cred_nombre = $args['estado_cred_nombre'] ?? '';
    }
}
