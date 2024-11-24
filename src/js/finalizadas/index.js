import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

let datatable;

// Función para formatear fecha
const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return fecha;

    // Formatear fecha
    return date.toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

// Inicializar DataTable
const inicializarDataTable = () => {
    datatable = new DataTable('#tablaFinalizadas', {
        language: lenguaje,
        columns: [
            { title: "ID", data: "envio_id" },
            { title: "Solicitud", data: "his_cred_solicitud_id" },
            {
                title: "Fecha de Envío",
                data: "his_cred_fecha_envio",
                render: function (data) {
                    return formatearFecha(data);
                }
            },
            { title: "Método de Envío", data: "his_cred_metodo_envio" },
            { title: "Responsable", data: "his_cred_responsable" },
            { title: "Destinatario", data: "his_cred_destinatario" },
            { title: "Observaciones", data: "his_cred_observaciones" }
        ],
        responsive: true,
        order: [[2, 'desc']], // Ordenar por fecha de envío descendente
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: 'Exportar a Excel',
                className: 'btn btn-success',
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                text: 'Exportar a PDF',
                className: 'btn btn-danger',
                exportOptions: {
                    columns: ':visible'
                }
            }
        ]
    });
};

const buscar = async () => {
    const fechaInicio = document.getElementById('busqueda_1').value;
    const fechaFin = document.getElementById('busqueda_2').value;

    // Validación de fechas
    if (!fechaInicio || !fechaFin) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Requeridos',
            text: 'Por favor, seleccione ambas fechas para realizar la búsqueda.'
        });
        return;
    }

    // Validar que la fecha inicial no sea mayor que la final
    if (new Date(fechaInicio) > new Date(fechaFin)) {
        Swal.fire({
            icon: 'error',
            title: 'Error en fechas',
            text: 'La fecha inicial no puede ser mayor a la fecha final.'
        });
        return;
    }

    try {
        const url = `/AccessEntry-Autocom/API/finalizadas/buscar?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.tipo === 'exito' && data.datos) {
            datatable.clear();
            datatable.rows.add(data.datos).draw();

            Toast.fire({
                icon: 'success',
                title: `Se encontraron ${data.datos.length} registros`
            });
        } else {
            datatable.clear().draw();
            Toast.fire({
                icon: 'info',
                title: data.mensaje || 'No se encontraron registros en este rango de fechas'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al realizar la búsqueda. Por favor, intente nuevamente.'
        });
    }
};

// Limpiar búsqueda
const limpiar = () => {
    document.getElementById('formularioAlumnos').reset();
    datatable.clear().draw();
};

document.addEventListener('DOMContentLoaded', () => {
    inicializarDataTable();
    document.getElementById('btnBuscar').addEventListener('click', buscar);
    document.getElementById('btnCancelar').addEventListener('click', limpiar);
});