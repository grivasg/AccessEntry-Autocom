<?php

namespace Controllers;

use Exception;
use Model\Solicitud;
use Mpdf\Mpdf;
use MVC\Router;

class ReporteController
{
    public static function credencialesPDF(Router $router)
    {
        $solicitudId = $_GET['solicitud'] ?? '';
        $sql = "SELECT 
                (g.gra_desc_lg || ' DE ' || a.arm_desc_lg) AS Grado_Arma, 
                (m.per_nom1 || ' ' || m.per_nom2 || ' ' || m.per_ape1 || ' ' || m.per_ape2 || ' ' || m.per_ape3) AS Nombres_Apellidos,
                sc.sol_cred_catalogo,
                TRIM(per_desc_empleo) || ' - ' || TRIM(d.dep_desc_lg)  AS Puesto_Dependencia,  
                sc.solicitud_id,
                sc.sol_cred_correo,
                sc.sol_cred_telefono,
                sc.sol_cred_fecha_solicitud,
                sc.sol_cred_modulos_autorizados,
                sc.sol_cred_justificacion_autorizacion,
                sc.sol_cred_justificacion,
                sc.sol_cred_usuario,
                e.estado_cred_id,
                e.estado_cred_nombre AS Estado_Solicitud  -- Asegúrate de que esto sea 'estado_cred_nombre'
            FROM solicitud_credenciales sc
            JOIN mper m ON sc.sol_cred_catalogo = m.per_catalogo
            JOIN morg org ON m.per_plaza = org.org_plaza
            JOIN mdep d ON org.org_dependencia = d.dep_llave
            JOIN estado_credenciales e ON sc.sol_cred_estado_solicitud = e.estado_cred_id
            JOIN grados g ON m.per_grado = g.gra_codigo
            JOIN armas a ON m.per_arma = a.arm_codigo
            WHERE sc.sol_cred_estado_solicitud = 6
            AND solicitud_id = $solicitudId";




        try {

            $solicitudes = Solicitud::fetchArray($sql);

            $mpdf = new Mpdf([
                'mode' => 'utf-8',
                'format' => 'Letter',
                'orientation' => 'P',
                'margin_left' => 20,
                'margin_right' => 20,
                'margin_top' => 70,
                'margin_bottom' => 20,
                'margin_header' => 10,
                'margin_footer' => 10,
                'default_font' => 'Arial'
            ]);

            // Importante: establecer el modo de CSS
            $mpdf->showImageErrors = true;
            $mpdf->defaultCssFile = true;

            // Establecer las variables para las vistas
            $fecha_creacion = date('d/m/Y');
            $datos = [
                'solicitud' => $solicitudes[0],
                'fecha_creacion' => $fecha_creacion
            ];

            $header = $router->load('pdf/header1', $datos);
            $html = $router->load('pdf/credenciales', $datos);
            $footer = $router->load('pdf/footer1', $datos);

            $mpdf->SetHTMLHeader($header);
            $mpdf->SetHTMLFooter($footer);
            $mpdf->WriteHTML($html);

            $mpdf->Output('Credenciales.pdf', 'I');
        } catch (Exception $e) {
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al generar el PDF: ' . $e->getMessage()
            ]);
        }
    }

    public static function permisosPDF(Router $router)
    {
        $solicitudId = $_GET['solicitud'] ?? '';
        $sql = "SELECT 
                (g.gra_desc_lg || ' DE ' || a.arm_desc_lg) AS Grado_Arma, 
                (m.per_nom1 || ' ' || m.per_nom2 || ' ' || m.per_ape1 || ' ' || m.per_ape2 || ' ' || m.per_ape3) AS Nombres_Apellidos,
                sc.sol_cred_catalogo,
                TRIM(per_desc_empleo) || ' - ' || TRIM(d.dep_desc_lg)  AS Puesto_Dependencia,  
                sc.solicitud_id,
                sc.sol_cred_correo,
                sc.sol_cred_telefono,
                sc.sol_cred_fecha_solicitud,
                sc.sol_cred_modulos_autorizados,
                sc.sol_cred_justificacion_autorizacion,
                sc.sol_cred_justificacion,
                sc.sol_cred_usuario,
                e.estado_cred_id,
                e.estado_cred_nombre AS Estado_Solicitud  -- Asegúrate de que esto sea 'estado_cred_nombre'
            FROM solicitud_credenciales sc
            JOIN mper m ON sc.sol_cred_catalogo = m.per_catalogo
            JOIN morg org ON m.per_plaza = org.org_plaza
            JOIN mdep d ON org.org_dependencia = d.dep_llave
            JOIN estado_credenciales e ON sc.sol_cred_estado_solicitud = e.estado_cred_id
            JOIN grados g ON m.per_grado = g.gra_codigo
            JOIN armas a ON m.per_arma = a.arm_codigo
            WHERE sc.sol_cred_estado_solicitud = 6
            AND solicitud_id = $solicitudId";




        try {

            $solicitudes = Solicitud::fetchArray($sql);

            $mpdf = new Mpdf([
                'mode' => 'utf-8',
                'format' => 'Letter',
                'orientation' => 'P',
                'margin_left' => 20,
                'margin_right' => 20,
                'margin_top' => 70,
                'margin_bottom' => 20,
                'margin_header' => 10,
                'margin_footer' => 10,
                'default_font' => 'Arial'
            ]);

            // Importante: establecer el modo de CSS
            $mpdf->showImageErrors = true;
            $mpdf->defaultCssFile = true;

            // Establecer las variables para las vistas
            $fecha_creacion = date('d/m/Y');
            $datos = [
                'solicitud' => $solicitudes[0],
                'fecha_creacion' => $fecha_creacion
            ];

            $header = $router->load('pdf/header2', $datos);
            $html = $router->load('pdf/permisos', $datos);
            $footer = $router->load('pdf/footer2', $datos);

            $mpdf->SetHTMLHeader($header);
            $mpdf->SetHTMLFooter($footer);
            $mpdf->WriteHTML($html);

            $mpdf->Output('Credenciales.pdf', 'I');
        } catch (Exception $e) {
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al generar el PDF: ' . $e->getMessage()
            ]);
        }
    }
}
