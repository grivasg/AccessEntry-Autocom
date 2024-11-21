<?php

namespace Model;

class PasswordTemp extends ActiveRecord
{
    protected static $tabla = 'passwords_temp';
    protected static $idTabla = 'pass_id';
    protected static $columnasDB = ['pass_solicitud_id', 'password_encriptada', 'pass_token', 'encryption_key', 'pass_fecha_creacion'];

    public $pass_id;
    public $pass_solicitud_id;
    public $password_encriptada;
    public $pass_token;
    public $encryption_key;
    public $pass_fecha_creacion;


    public function __construct($args = [])
    {
        $this->pass_id = $args['pass_id'] ?? null;
        $this->pass_solicitud_id = $args['pass_solicitud_id'] ?? '';
        $this->password_encriptada = $args['password_encriptada'] ?? '';
        $this->pass_token = $args['pass_token'] ?? '';
        $this->encryption_key = $args['encryption_key'] ?? '';
        $this->pass_fecha_creacion = $args['pass_fecha_creacion'] ?? '';
    }



};