<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use MVC\Router;

class ManualController
{
    public static function index(Router $router)
    {
        $router->render('manual/index', []);
    }
}
