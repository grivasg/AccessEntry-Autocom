import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaPanelCau', {
    data: null,
    language: lenguaje,
    pageLength: '15',
    lengthMenu: [3, 9, 11, 25, 100],
    columns: [
        {
            title: 'No.',
            data: 'solicitud_id',
            width: '2%',
            render: (data, type, row, meta) => {
                return meta.row + 1;
            }
        },
        {
            title: 'Grado y Arma',
            data: 'grado_arma'
        },
        {
            title: 'Nombres del Solicitante',
            data: 'nombres_apellidos'
        },
        {
            title: 'Puesto',
            data: 'puesto_dependencia'
        },
        {
            title: 'Catalogo',
            data: 'sol_cred_catalogo'
        },
        {
            title: 'Modulos para habilitar',
            data: 'sol_cred_modulo'
        },
        {
            title: 'Justificacion',
            data: 'sol_cred_justificacion'
        },
        {
            title: '¿Tiene Usuario de AUTOCOM?',
            data: 'sol_cred_usuario'
        },
        {
            title: 'Fecha de Solicitud',
            data: 'sol_cred_fecha_solicitud',
            render: (data, type, row) => {
                if (!data) return "";
                const fecha = new Date(data);
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                const año = fecha.getFullYear();
                return `${dia}/${mes}/${año}`;
            }
        },
        {
            title: 'Estado de Solicitud',
            data: 'estado_solicitud'
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                switch (row.estado_solicitud.toUpperCase()) {
                    case 'SOLICITUD RECIBIDA':
                        return `
                            <button class='btn btn-info accion' data-estado="SOLICITUD RECIBIDA" title="Solicitud Recibida">
                                <i class='bi bi-envelope-check'></i>
                            </button>`;
                    case 'GENERANDO USUARIO':
                        return `
                            <button class='btn btn-primary accion' data-estado="GENERANDO USUARIO" title="Generando Usuario">
                                <i class='bi bi-person-plus'></i>
                            </button>`;
                    case 'OTORGANDO PERMISOS':
                        return `
                            <button class='btn btn-warning accion' data-estado="OTORGANDO PERMISOS" title="Otorgando Permisos">
                                <i class='bi bi-key'></i>
                            </button>`;
                    case 'CREDENCIALES ENVIADOS':
                        return `
                            <button class='btn btn-success accion' data-estado="CREDENCIALES ENVIADOS" title="Credenciales Enviados">
                                <i class='bi bi-check-circle'></i>
                            </button>`;
                    case 'SOLICITUD RECHAZADA':
                        return `
                            <button class='btn btn-danger accion' data-estado="SOLICITUD RECHAZADA" title="Solicitud Rechazada">
                                <i class='bi bi-x-circle'></i>
                            </button>`;
                    default:
                        return `
                            <button class='btn btn-secondary accion' data-estado="DESCONOCIDO" title="Ver detalles">
                                <i class='bi bi-eye'></i>
                            </button>`;
                }
            }
        }
    ]
});

const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/panel/buscar";
        const config = {
            method: 'GET'
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        console.log('Datos recibidos:', data);

        if (data && data.datos) {
            datatable.clear();
            datatable.rows.add(data.datos).draw();
        }
    } catch (error) {
        console.error('Error en buscar:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al cargar los datos'
        });
    }
};

// Event listener simplificado que solo muestra una alerta
datatable.on('click', '.accion', function(e) {
    const estado = this.getAttribute('data-estado');
    alert(`Esta es la función para: ${estado}`);
});

// Iniciar la búsqueda cuando se carga la página
buscar();



datatable.on('click', '.accion');
