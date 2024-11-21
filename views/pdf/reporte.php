<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Credenciales</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
        }

        .titulo {
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .datos {
            margin-bottom: 10px;
        }

        .label {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="titulo">Credenciales del Usuario</div>

    <?php foreach ($solicitudes as $solicitud): ?>
        <div class="datos">
            <p><span class="label">Grado y Arma:</span> <?php echo htmlspecialchars($solicitud['Grado_Arma']); ?></p>
            <p><span class="label">Nombres y Apellidos:</span> <?php echo htmlspecialchars($solicitud['Nombres_Apellidos']); ?></p>
            <p><span class="label">Puesto:</span> <?php echo htmlspecialchars($solicitud['Puesto_Dependencia']); ?></p>
            <p><span class="label">Catálogo:</span> <?php echo htmlspecialchars($solicitud['sol_cred_catalogo']); ?></p>
            <p><span class="label">Correo:</span> <?php echo htmlspecialchars($solicitud['sol_cred_correo']); ?></p>
            <p><span class="label">Teléfono:</span> <?php echo htmlspecialchars($solicitud['sol_cred_telefono']); ?></p>
            <p><span class="label">Fecha de Solicitud:</span> <?php echo htmlspecialchars($solicitud['sol_cred_fecha_solicitud']); ?></p>
            <p><span class="label">Módulos:</span> <?php echo htmlspecialchars($solicitud['sol_cred_modulo']); ?></p>
            <p><span class="label">Justificación:</span> <?php echo htmlspecialchars($solicitud['sol_cred_justificacion']); ?></p>
        </div>
        <hr>
    <?php endforeach; ?>
</body>

</html>