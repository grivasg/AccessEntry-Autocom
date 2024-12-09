<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="build/js/app.js"></script>
    <link rel="shortcut icon" href="<?= asset('images/cit.png') ?>" type="image/x-icon">
    <link rel="stylesheet" href="<?= asset('build/styles.css') ?>">
    <title>ACCESS ENTRY AUTOCOM</title>
</head>

<body>
    <div id="loader" style="width: 100vw; height:100vh; z-index:5000; position:fixed; margin-top:0" class="d-flex flex-column bg-light opacity-75 justify-content-center align-items-center">
        <div class="spinner-grow text-warning" role="status">
        </div>
        <p id="loaderText" class="text-dark h5 fw-bold">CARGANDO</p>
    </div>
    <nav class="navbar navbar-expand-lg navbar-dark  bg-dark">

        <div class="container-fluid">

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand" href="/AccessEntry-Autocom/">
                <img src="<?= asset('./images/cit.png') ?>" width="35px'" alt="cit">
            </a>
            <div class="collapse navbar-collapse" id="navbarToggler">

                <ul class="navbar-nav me-auto mb-2 mb-lg-0" style="margin: 0;">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/AccessEntry-Autocom/"><i class="bi bi-house-fill me-2"></i>Inicio</a>
                    </li>

                    <div class="nav-item dropdown ">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            <i class="bi bi-person-raised-hand"></i> Admin Atención al Usuario
                        </a>
                        <ul class="dropdown-menu  dropdown-menu-dark " id="dropwdownRevision" style="margin: 0;">
                            <!-- <h6 class="dropdown-header">Información</h6> -->
                            <li>
                                <a class="dropdown-item nav-link text-white " href="/AccessEntry-Autocom/nuevas"><i class="bi bi-bell"></i> Nuevas Solicitudes</a>
                            </li>
                            <li>
                                <a class="dropdown-item nav-link text-white " href="/AccessEntry-Autocom/permiso"><i class="bi bi-toggles2"></i><i class="bi bi-file-lock2-fill"></i> Otorgar Permisos</a>
                            </li>
                            <li>
                                <a class="dropdown-item nav-link text-white " href="/AccessEntry-Autocom/pendientes"><i class="bi bi-send-check-fill"></i> Solicitudes a Enviar</a>
                            </li>
                        </ul>
                    </div>
                    <div class="nav-item dropdown ">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            <i class="bi bi-terminal"></i> Admin Sistemas
                        </a>
                        <ul class="dropdown-menu  dropdown-menu-dark " id="dropwdownRevision" style="margin: 0;">
                            <!-- <h6 class="dropdown-header">Información</h6> -->
                            <li>
                                <a class="dropdown-item nav-link text-white " href="/AccessEntry-Autocom/usuario"><i class="bi bi-person-plus-fill"></i> Creación de Usuarios</a>
                            </li>
                            <li>
                                <a class="dropdown-item nav-link text-white " href="/AccessEntry-Autocom/cambio"><i class="bi bi-database-lock"></i> Cambio de Permisos</a>
                            </li>
                        </ul>
                    </div>
                    <div class="nav-item dropdown ">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            <i class="bi bi-clock-history"></i> Estado de Solicitudes
                        </a>
                        <ul class="dropdown-menu  dropdown-menu-dark " id="dropwdownRevision" style="margin: 0;">
                            <!-- <h6 class="dropdown-header">Información</h6> -->
                            <li>
                                <a class="dropdown-item nav-link text-white " href="/AccessEntry-Autocom/estado"><i class="bi bi-eye-fill"></i> Verificar Estado </a>
                            </li>

                        </ul>
                    </div>
                    <div class="nav-item dropdown ">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            <i class="bi bi-card-checklist"></i> Finalizadas
                        </a>
                        <ul class="dropdown-menu  dropdown-menu-dark " id="dropwdownRevision" style="margin: 0;">
                            <!-- <h6 class="dropdown-header">Información</h6> -->
                            <li>
                                <a class="dropdown-item nav-link text-white " href="/AccessEntry-Autocom/historial"><i class="bi bi-hourglass-split"></i> Historial de Envios</a>
                            </li>
                        </ul>
                    </div>
                    <div class="nav-item dropdown ">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            <i class="bi bi-question-circle-fill"></i> Ayuda
                        </a>
                        <ul class="dropdown-menu  dropdown-menu-dark " id="dropwdownRevision" style="margin: 0;">
                            <!-- <h6 class="dropdown-header">Información</h6> -->
                            <li>
                                <a class="dropdown-item nav-link text-white " href="/AccessEntry-Autocom/manual"><i class="bi bi-journal-bookmark-fill"></i> Manual de Usuario</a>
                            </li>
                        </ul>
                    </div>

                </ul>
                <div class="col-lg-1 d-grid mb-lg-0 mb-2">
                    <!-- Ruta relativa desde el archivo donde se incluye menu.php -->
                    <a href="/menu/" class="btn btn-danger"><i class="bi bi-arrow-bar-left"></i>MENÚ</a>
                </div>


            </div>
        </div>

    </nav>
    <div class="progress fixed-bottom" style="height: 6px;">
        <div class="progress-bar progress-bar-animated bg-danger" id="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="container-fluid ">
        <div class="container-fluid pt-5 mb-4" style="min-height: 85vh">

            <?php echo $contenido; ?>
        </div>
        <div class="row justify-content-center text-center">
            <div class="col-12">
                <p style="font-size:xx-small; font-weight: bold;">
                    Comando de Informática y Tecnología, <?= date('Y') ?> &copy;
                </p>
            </div>
        </div>
    </div>
</body>

</html>