<div style="font-size: 18px; margin: 20px 0;">
    <table style="width: 100%;">
        <tr>
            <td style="text-align: left; padding: 5px; font-size: 18px;"><strong>USUARIO :</strong> <?php echo $solicitud['sol_cred_catalogo'] ?? ''; ?></td>
        </tr>
        <tr>
            <td style="text-align: left; padding: 5px; font-size: 18px;"><strong>CONTRASEÑA :</strong> <?php echo $solicitud['password'] ?? ''; ?></td>
        </tr>
    </table>
</div>
<div style="text-align: justify; margin: 15px 0; font-size: 18px;"><strong>PUESTO :</strong>
    <?php echo $solicitud['puesto_dependencia'] ?? ''; ?>
</div>
<div style="text-align: justify; font-size: 18px; margin: 20px 0;">
    <table style="width: 100%;">
        <tr>
            <td style="text-align: center; padding: 5px; font-size: 18px;"><strong>MÓDULOS AUTORIZADOS:</strong></td>
        </tr>
        <tr>
            <td style="padding: 5px; font-size: 18px;">✔ <?php echo $solicitud['sol_cred_modulos_autorizados'] ?? ''; ?></td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 5px; font-size: 18px;"><strong>MÓDULOS NO AUTORIZADOS</strong></td>
        </tr>
        <tr>
            <td style="font-size: 18px;"><?php echo $solicitud['sol_cred_justificacion_autorizacion'] ?? ''; ?></td>
        </tr>
    </table>
</div>

<div style="text-align: justify; color: red; font-size: 11pt; margin: 20px 0; line-height: 1.4;">
    <strong>AL COMPARTIR O EXTRAVIAR SU USUARIO Y CONTRASEÑA SERA COMPLETA RESPONSABILIDAD SUYA, EL USO Y/O
        MANIPULACIÓN DE LA INFORMACIÓN ALOJADA EN LA BASE DE DATOS DEL MINISTERIO DE LA DEFENSA NACIONAL.
        RECUERDE QUE TODO INGRESO, EDICIÓN O MAL USO DE LA MISMA SE REGISTRA EN LAS TABLAS DE AUDITORIA,
        QUEDANDO SUJETO A LAS SANCIONES QUE DE ACUERDO AL REGLAMENTO PARA EL SERVICIO DEL EJÉRCITO EN
        TIEMPOS DE PAZ, REGLAMENTO DE SANCIONES DISCIPLINARIAS (ACUERDO GUBERNATIVO NO.2-2008),
        DIRECTIVA DE CLASIFICACIÓN DE LA INFORMACIÓN MILITAR (NO. MDN-008-SAGE-2009) Y DIRECTIVA DE
        TRANSMISIÓN DE INFORMACIÓN MILITAR (NO. MDN-009-SAGE-2009), LE CORRESPONDA.</strong>
</div>

<div style="margin-top: 10px; text-align: center;">
    <div style="margin: 20px 0; font-size: 14pt;"><strong>
            Fecha de Generación y Envío de Usuario:
        </strong>
    </div>

    <div style="margin-top: 30px; font-size: 14pt;"><strong>
            Guatemala, <?php echo date('d'); ?> de
            <?php
            $meses = array("enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre");
            echo $meses[date('n') - 1];
            ?>
            de <?php echo date('Y'); ?>
        </strong>
    </div>
    <div style="margin-top: 10px; font-size: 14pt;"><strong>
            Hora: <?php echo date('H:i:s'); ?>
        </strong>
    </div>
</div>