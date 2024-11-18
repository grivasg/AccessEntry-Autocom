<?php

namespace Model;

class Producto extends ActiveRecord
{
    protected static $tabla = 'productos';
    protected static $idTabla = 'id';
    protected static $columnasDB = ['nombre', 'precio', 'situacion'];

    public $id;
    public $nombre;
    public $precio;
    public $situacion;

    public function __construct($args = [])
    {
        $this->id = $args['com_code'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->precio = $args['precio'] ?? '';
        $this->situacion = $args['situacion'] ?? '1';
    }
}