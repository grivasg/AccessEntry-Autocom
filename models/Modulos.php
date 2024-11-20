<?php

namespace Model;

class Modulos extends ActiveRecord
{
    protected static $tabla = 'grupo_menuautocom';
    protected static $idTabla = 'gma_codigo';
    protected static $columnasDB = ['gma_desc', 'gma_fecha_creada', 'gma_descripcion', 'gma_situacion'];

    public $gma_codigo;
    public $gma_desc;
    public $gma_fecha_creada;
    public $gma_descripcion;
    public $gma_situacion;


    public function __construct($args = [])
    {
        $this->gma_codigo = $args['gma_codigo'] ?? null;
        $this->gma_desc = $args['gma_desc'] ?? '';
        $this->gma_fecha_creada = $args['gma_fecha_creada'] ?? '';
        $this->gma_descripcion = $args['gma_descripcion'] ?? '';
        $this->gma_situacion = $args['gma_situacion'] ?? '';
    }

    public static function obtenerModeloconQuery()
    {
        $sql = "SELECT * FROM grupo_menuautocom";

        return self::fetchArray($sql);
    }

}
