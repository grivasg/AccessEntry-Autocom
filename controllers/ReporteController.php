<?php

namespace Controllers;

use Model\Solicitud;
use Mpdf\Mpdf;
use MVC\Router;

class ReporteController
{
    public static function pdf(Router $router)
    {
        $sql = "SELECT (g.gra_desc_lg || ' DE ' || a.arm_desc_lg) AS Grado_Arma,
                (m.per_nom1 || ' ' || m.per_nom2 || ' ' || m.per_ape1 || ' ' || m.per_ape2 || ' ' || m.per_ape3) AS Nombres_Apellidos,  -- Nombre completo del solicitante
                sc.sol_cred_catalogo,
                TRIM(org.org_plaza_desc) || ' - ' || TRIM(d.dep_desc_lg) AS Puesto_Dependencia,
                sc.solicitud_id,
                sc.sol_cred_correo,
                sc.sol_cred_telefono,
                sc.sol_cred_fecha_solicitud,
                sc.sol_cred_modulos_autorizados, 
                sc.sol_cred_justificacion,
                sc.sol_cred_usuario,
                e.estado_cred_id,
                e.estado_cred_nombre AS Estado_Solicitud 
                FROM solicitud_credenciales sc
                JOIN mper m ON sc.sol_cred_catalogo = m.per_catalogo 
                JOIN morg org ON m.per_plaza = org.org_plaza 
                JOIN mdep d ON org.org_dependencia = d.dep_llave 
                JOIN estado_credenciales e ON sc.sol_cred_estado_solicitud = e.estado_cred_id
                JOIN grados g ON m.per_grado = g.gra_codigo
                JOIN armas a ON m.per_arma = a.arm_codigo
                WHERE sc.sol_cred_estado_solicitud = 6";
        $solicitudes = Solicitud::fetchArray($sql);
        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'Letter',
            'orientation' => 'P',
            'default_font' => 'ARIAL',
            'margin_bottom' => '35',
        ]);

        $header = $router->load('pdf/header');
        $footer = $router->load('pdf/footer');
        $html = $router->load('pdf/reporte', [
            'solicitudes' => $solicitudes,

        ]);
        $altura = $mpdf->_getHtmlHeight($header);
        $mpdf->SetTopMargin($altura + 5);
        $mpdf->SetHTMLHeader($header);
        $mpdf->SetHTMLFooter($footer);
        $mpdf->WriteHTML($html);

        $mpdf->Output();
    }
}
