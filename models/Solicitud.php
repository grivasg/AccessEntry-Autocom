<?php

namespace Model;

class Solicitud extends ActiveRecord
{
    protected static $tabla = 'solicitud_credenciales';
    protected static $idTabla = 'solicitud_id';
    protected static $columnasDB = ['sol_cred_catalogo', 'sol_cred_correo', 'sol_cred_telefono', 'sol_cred_fecha_solicitud', 'sol_cred_modulo', 'sol_cred_justificacion', 'sol_cred_usuario', 'sol_cred_estado_solicitud', 'sol_cred_modulos_autorizados', 'sol_cred_justificacion_autorizacion'];

    public $solicitud_id;
    public $sol_cred_catalogo;
    public $sol_cred_correo;
    public $sol_cred_telefono;
    public $sol_cred_modulo;
    public $sol_cred_justificacion;
    public $sol_cred_fecha_solicitud;
    public $sol_cred_usuario;
    public $sol_cred_estado_solicitud;
    public $sol_cred_modulos_autorizados;
    public $sol_cred_justificacion_autorizacion;


    public function __construct($args = [])
    {
        $this->solicitud_id = $args['solicitud_id'] ?? null;
        $this->sol_cred_catalogo = $args['sol_cred_catalogo'] ?? '';
        $this->sol_cred_correo = $args['sol_cred_correo'] ?? '';
        $this->sol_cred_telefono = $args['sol_cred_telefono'] ?? '';
        $this->sol_cred_modulo = $args['sol_cred_modulo'] ?? '';
        $this->sol_cred_justificacion = $args['sol_cred_justificacion'] ?? '';
        $this->sol_cred_fecha_solicitud = $args['sol_cred_fecha_solicitud'] ?? '';
        $this->sol_cred_usuario = $args['sol_cred_usuario'] ?? '';
        $this->sol_cred_estado_solicitud = $args['sol_cred_estado_solicitud'] ?? 1;
        $this->sol_cred_modulos_autorizados = $args['sol_cred_modulos_autorizados'] ?? '';
        $this->sol_cred_justificacion_autorizacion = $args['sol_cred_justificacion_autorizacion'] ?? '';
    }

    public function guardars()
    {
        // Validar que los datos no estén vacíos
        if (empty($this->modulos) || empty($this->justificaciones)) {
            error_log("Módulos o justificaciones vacíos");
            return false;
        }

        // Si modulos y justificaciones ya son strings separados por coma, úsalos directamente
        $this->sol_cred_modulo = $this->modulos;
        $this->sol_cred_justificacion = $this->justificaciones;

        if (!is_null($this->solicitud_id)) {
            return $this->actualizar();
        } else {
            return $this->crear();
        }
    }

    // Método para obtener los módulos y justificaciones como array
    public function getModulosJustificaciones()
    {
        return [
            'modulos' => json_decode($this->sol_cred_modulo, true) ?? [],
            'justificaciones' => json_decode($this->sol_cred_justificacion, true) ?? []
        ];
    }



    public static function obtenerSolicitudes()
    {
        $sql = "SELECT 
            (trim(g.gra_desc_lg) || ' DE ' || trim(a.arm_desc_lg) || ' ' || 
                trim(m.per_nom1) || ' ' || trim(m.per_nom2) || ' ' || 
                trim(m.per_ape1) || ' ' || trim(m.per_ape2)) AS Nombres_Solicitante,
                sc.sol_cred_catalogo,
            TRIM(org.org_plaza_desc) || ' - ' || TRIM(d.dep_desc_lg) AS Puesto_Dependencia,  
            sc.solicitud_id,
            sc.sol_cred_correo,
            sc.sol_cred_telefono,
            sc.sol_cred_fecha_solicitud,
            sc.sol_cred_modulo,
            sc.sol_cred_justificacion,
            sc.sol_cred_usuario,
            e.estado_cred_id,
            e.estado_cred_nombre AS Estado_Solicitud,
            sc.sol_cred_justificacion_autorizacion -- Asegúrate de incluir este campo en la consulta
        FROM solicitud_credenciales sc
        JOIN mper m ON sc.sol_cred_catalogo = m.per_catalogo
        JOIN morg org ON m.per_plaza = org.org_plaza
        JOIN mdep d ON org.org_dependencia = d.dep_llave
        JOIN estado_credenciales e ON sc.sol_cred_estado_solicitud = e.estado_cred_id
        JOIN grados g ON m.per_grado = g.gra_codigo
        JOIN armas a ON m.per_arma = a.arm_codigo
        WHERE sc.sol_cred_estado_solicitud > 0
        ORDER BY sc.solicitud_id ASC";  // Ordenar por solicitud_id de manera ascendente
        return self::fetchArray($sql);
    }


    public static function SolicitudesNuevas()
    {
        $sql = "SELECT (trim(g.gra_desc_lg) || ' DE ' || trim(a.arm_desc_lg) || ' ' || 
                trim(m.per_nom1) || ' ' || trim(m.per_nom2) || ' ' || 
                trim(m.per_ape1) || ' ' || trim(m.per_ape2)) AS Nombres_Solicitante,
                sc.sol_cred_catalogo,
                TRIM(per_desc_empleo) || ' - ' || TRIM(d.dep_desc_lg) AS Puesto_Dependencia,
                sc.solicitud_id,
                sc.sol_cred_correo,
                sc.sol_cred_telefono,
                sc.sol_cred_fecha_solicitud,
                sc.sol_cred_modulo, 
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
                WHERE sc.sol_cred_estado_solicitud = 1
                ORDER BY sc.solicitud_id ASC";
        return self::fetchArray($sql);
    }

    public static function CreacionUsuario()
    {
        $sql = "SELECT (trim(g.gra_desc_lg) || ' DE ' || trim(a.arm_desc_lg) || ' ' || 
                trim(m.per_nom1) || ' ' || trim(m.per_nom2) || ' ' || 
                trim(m.per_ape1) || ' ' || trim(m.per_ape2)) AS nombres_solicitante,
                sc.sol_cred_catalogo,
                TRIM(per_desc_empleo) || ' - ' || TRIM(d.dep_desc_lg) AS Puesto_Dependencia,
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
                WHERE sc.sol_cred_estado_solicitud = 2
                ORDER BY sc.solicitud_id ASC";
        return self::fetchArray($sql);
    }

    public static function OtorgarPermisos()
    {
        $sql = "SELECT (trim(g.gra_desc_lg) || ' DE ' || trim(a.arm_desc_lg) || ' ' || 
                trim(m.per_nom1) || ' ' || trim(m.per_nom2) || ' ' || 
                trim(m.per_ape1) || ' ' || trim(m.per_ape2)) AS nombres_solicitante,
                sc.sol_cred_catalogo,
                TRIM(per_desc_empleo) || ' - ' || TRIM(d.dep_desc_lg) AS Puesto_Dependencia,
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
                WHERE sc.sol_cred_estado_solicitud = 3
                ORDER BY sc.solicitud_id ASC";
        return self::fetchArray($sql);
    }


    public static function SolicitudesFinalizadas()
    {
        $sql = "SELECT (g.gra_desc_lg || ' DE ' || a.arm_desc_lg) AS Grado_Arma,
                (m.per_nom1 || ' ' || m.per_nom2 || ' ' || m.per_ape1 || ' ' || m.per_ape2 || ' ' || m.per_ape3) AS Nombres_Apellidos,  -- Nombre completo del solicitante
                sc.sol_cred_catalogo,
                TRIM(per_desc_empleo) || ' - ' || TRIM(d.dep_desc_lg) AS Puesto_Dependencia,
                sc.solicitud_id,
                sc.sol_cred_correo,
                sc.sol_cred_telefono,
                sc.sol_cred_fecha_solicitud,
                sc.sol_cred_modulo, 
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
                WHERE sc.sol_cred_estado_solicitud = 4
                ORDER BY sc.solicitud_id ASC";
        return self::fetchArray($sql);
    }

    public static function SolicitudesCambio()
    {
        $sql = "SELECT (trim(g.gra_desc_lg) || ' DE ' || trim(a.arm_desc_lg) || ' ' || 
                trim(m.per_nom1) || ' ' || trim(m.per_nom2) || ' ' || 
                trim(m.per_ape1) || ' ' || trim(m.per_ape2)) AS nombres_solicitante,
                sc.sol_cred_catalogo,
                TRIM(per_desc_empleo) || ' - ' || TRIM(d.dep_desc_lg) AS Puesto_Dependencia,
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
                WHERE sc.sol_cred_estado_solicitud = 7
                ORDER BY sc.solicitud_id ASC";
        return self::fetchArray($sql);
    }

    public static function PendientesConfirmacion()
    {
        $sql = "SELECT (trim(g.gra_desc_lg) || ' DE ' || trim(a.arm_desc_lg) || ' ' || 
                trim(m.per_nom1) || ' ' || trim(m.per_nom2) || ' ' || 
                trim(m.per_ape1) || ' ' || trim(m.per_ape2)) AS nombres_solicitante,
                sc.sol_cred_catalogo,
                TRIM(per_desc_empleo) || ' - ' || TRIM(d.dep_desc_lg) AS Puesto_Dependencia,
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
                WHERE sc.sol_cred_estado_solicitud = 6
                ORDER BY sc.solicitud_id ASC";
        return self::fetchArray($sql);
    }

    public static function verificarSolicitud($solicitud_id)
    {
        $sql = "UPDATE solicitud_credenciales 
            SET sol_cred_estado_solicitud = 2 
            WHERE solicitud_id = ?";
        $stmt = self::prepare($sql);
        $stmt->bindParam(1, $solicitud_id);
        return $stmt->execute(); // Devuelve true si la actualización es exitosa, false si no lo es
    }

    public static function verificarSolicitudSi($solicitud_id)
    {
        $sql = "UPDATE solicitud_credenciales 
            SET sol_cred_estado_solicitud = 7 
            WHERE solicitud_id = ?";
        $stmt = self::prepare($sql);
        $stmt->bindParam(1, $solicitud_id);
        return $stmt->execute(); // Devuelve true si la actualización es exitosa, false si no lo es
    }

    public static function enviarSolicitud($solicitud_id)
    {
        $sql = "UPDATE solicitud_credenciales 
            SET sol_cred_estado_solicitud = 3 
            WHERE solicitud_id = ?";
        $stmt = self::prepare($sql);
        $stmt->bindParam(1, $solicitud_id);
        return $stmt->execute(); // Devuelve true si la actualización es exitosa, false si no lo es
    }

    public static function permisoOtorgado($solicitud_id)
    {
        $sql = "UPDATE solicitud_credenciales 
            SET sol_cred_estado_solicitud = 6 
            WHERE solicitud_id = ?";
        $stmt = self::prepare($sql);
        $stmt->bindParam(1, $solicitud_id);
        return $stmt->execute(); // Devuelve true si la actualización es exitosa, false si no lo es
    }

    public static function cambiarEstado($solicitud_id)
    {
        $sql = "UPDATE solicitud_credenciales 
            SET sol_cred_estado_solicitud = 4 
            WHERE solicitud_id = ?";
        $stmt = self::prepare($sql);
        $stmt->bindParam(1, $solicitud_id);
        return $stmt->execute(); // Devuelve true si la actualización es exitosa, false si no lo es
    }

    public static function rechazarSolicitud($solicitud_id, $justificacion_rechazo)
    {
        // Aquí usamos el marcador de posición ? para los parámetros
        $sql = "UPDATE solicitud_credenciales 
            SET sol_cred_estado_solicitud = 5,
                sol_cred_justificacion_autorizacion = ?
            WHERE solicitud_id = ?";

        $stmt = self::prepare($sql);
        $stmt->bindParam(1, $justificacion_rechazo);
        $stmt->bindParam(2, $solicitud_id);

        // Ejecutamos la consulta
        return $stmt->execute(); // Devuelve true si la actualización es exitosa, false si no lo es
    }






    // Agregar estos métodos en la clase Solicitud del Modelo

    public static function catalogoExiste($catalogo)
    {
        $sql = "SELECT COUNT(*) FROM mper WHERE per_catalogo = ?";
        $stmt = self::prepare($sql);
        $stmt->bindParam(1, $catalogo);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public static function obtenerDatosPersonal($catalogo)
    {
        $sql = "SELECT 
    (trim(g.gra_desc_lg) || ' DE ' || trim(a.arm_desc_lg) || ' ' || 
                trim(m.per_nom1) || ' ' || trim(m.per_nom2) || ' ' || 
                trim(m.per_ape1) || ' ' || trim(m.per_ape2)) AS nombres_completos,
                TRIM(per_desc_empleo) || ' - ' || TRIM(d.dep_desc_lg) AS puesto
FROM mper m
JOIN morg org ON m.per_plaza = org.org_plaza
JOIN mdep d ON org.org_dependencia = d.dep_llave
JOIN grados g ON m.per_grado = g.gra_codigo
JOIN armas a ON m.per_arma = a.arm_codigo
WHERE m.per_catalogo = ?
";

        $stmt = self::prepare($sql);
        $stmt->bindParam(1, $catalogo);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }


    public static function actualizarJustificacion($solicitud_id, $modulosAutorizados, $justificacion)
    {
        // Validar y escapar adecuadamente los datos, evitando un escape doble
        $modulosAutorizados = json_encode($modulosAutorizados);  // Convertir array a JSON

        // Consulta SQL para actualizar los campos de la solicitud
        $sql = "UPDATE solicitud_credenciales
            SET sol_cred_modulos_autorizados = :modulosAutorizados,
                sol_cred_justificacion_autorizacion = :justificacion
            WHERE solicitud_id = :solicitud_id";

        // Preparar la consulta
        $stmt = self::prepare($sql);

        // Vincular los parámetros
        $stmt->bindParam(':modulosAutorizados', $modulosAutorizados);
        $stmt->bindParam(':justificacion', $justificacion);
        $stmt->bindParam(':solicitud_id', $solicitud_id);

        // Ejecutar la consulta
        $stmt->execute();

        // Verificar si la actualización fue exitosa
        return $stmt->rowCount() > 0;
    }


    public static function obtenerDatosSolicitud($solicitud_id)
    {
        $sql = "SELECT solicitud_id, sol_cred_modulos_autorizados, sol_cred_justificacion_autorizacion, sol_cred_usuario FROM solicitud_credenciales WHERE solicitud_id = :solicitud_id";
        $stmt = self::prepare($sql);
        $stmt->bindParam(':solicitud_id', $solicitud_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Desescapar el JSON en caso de que sea necesario
            $modulosAutorizados = json_decode($row['sol_cred_modulos_autorizados'], true);

            // Si el JSON es válido, devolvemos la data
            return [
                'solicitud_id' => $row['solicitud_id'],
                'sol_cred_modulos_autorizados' => $modulosAutorizados,
                'sol_cred_justificacion_autorizacion' => $row['sol_cred_justificacion_autorizacion'],
                'sol_cred_usuario' => $row['sol_cred_usuario']
            ];
        }
        return null;  // Si no se encuentra la solicitud
    }

    public static function justificarModulos($solicitud_id, $modulosSeleccionados, $justificacion)
    {
        // Usar json_encode con opciones para manejar caracteres especiales
        $modulosAutorizados = json_encode($modulosSeleccionados, JSON_UNESCAPED_UNICODE);

        // Asegúrate de que la justificación se maneje correctamente
        $justificacion = trim($justificacion);

        $sql = "UPDATE solicitud_credenciales 
        SET sol_cred_modulos_autorizados = :modulos,
            sol_cred_justificacion_autorizacion = :justificacion
        WHERE solicitud_id = :solicitud_id";

        $stmt = self::prepare($sql);
        $stmt->bindParam(':modulos', $modulosAutorizados);
        $stmt->bindParam(':justificacion', $justificacion);
        $stmt->bindParam(':solicitud_id', $solicitud_id);

        return $stmt->execute();
    }
};
