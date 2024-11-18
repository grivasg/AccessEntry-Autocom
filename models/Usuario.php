<?php

namespace Model;

class Usuario extends ActiveRecord
{
    protected static $tabla = 'usu_cred';
    protected static $idTabla = 'usu_id';
    protected static $columnasDB = ['usuario', 'password'];

    public $usu_id;
    public $usuario;
    public $password;


    public function __construct($args = [])
    {
        $this->usu_id = $args['usu_id'] ?? null;
        $this->usuario = $args['usuario'] ?? '';
        $this->password = $args['password'] ?? '';
    }
}
