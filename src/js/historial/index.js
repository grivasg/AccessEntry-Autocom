import { Dropdown } from "bootstrap";
import { ocultarLoader, Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaHistorial', {
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
            title: 'Datos del Solicitante',
            data: 'nombres_solicitante'
        },
        {
            title: 'Catalogo',
            data: 'sol_cred_catalogo'
        },
        {
            title: 'Fecha de Solicitud',
            data: 'sol_cred_fecha_solicitud',
            render: (data) => {
                // Asegurarse de que la fecha es válida
                const date = new Date(data);
                if (!isNaN(date)) {
                    let day = date.getDate().toString().padStart(2, '0'); // Asegura 2 dígitos para el día
                    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0, por eso +1
                    let year = date.getFullYear(); // Obtiene el año completo
                    return `${day}/${month}/${year}`; // dd/mm/aaaa
                }
                return data; // Si la fecha no es válida, devolver el dato original
            }
        },
        {
            title: 'Fecha de Envio',
            data: 'fecha_envio',
            render: (data) => {
                // Asegurarse de que la fecha es válida
                const date = new Date(data);
                if (!isNaN(date)) {
                    let day = date.getDate().toString().padStart(2, '0'); // Asegura 2 dígitos para el día
                    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0, por eso +1
                    let year = date.getFullYear(); // Obtiene el año completo
                    return `${day}/${month}/${year}`; // dd/mm/aaaa
                }
                return data; // Si la fecha no es válida, devolver el dato original
            }
        },
        {
            title: 'Nombres del Responsable',
            data: 'nombres_responsable'
        },
        {
            title: 'Ver Detalles',
            data: 'estado_solicitud',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                // Crear el botón como elemento HTML
                const button = document.createElement('button');
                button.className = 'btn btn-warning ver';
                button.innerHTML = '<i class="bi bi-eye-fill"></i>';

                // Guardar los datos completos de la fila en un atributo data
                button.setAttribute('data-row', JSON.stringify({
                    solicitud_id: row.solicitud_id,
                    estado_solicitud: row.estado_solicitud,
                    sol_cred_justificacion_autorizacion: row.sol_cred_justificacion_autorizacion,
                    id_estado: row.estado_cred_id
                }));

                return button.outerHTML;
            }
        },
    ]
});


ocultarLoader();

const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/historial/buscar";
        const config = {
            method: 'GET'
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        console.log('Datos recibidos:', data); // Para debug

        if (data && data.datos) {
            datatable.clear();
            datatable.rows.add(data.datos).draw();
        }
    } catch (error) {
        console.error('Error en buscar:', error);
        Toast.fire({
            icon: 'info',
            title: 'No se encontraron Datos en esta pagina'
        });
    }
};
// Iniciar la búsqueda cuando se carga la página




const ver = async () => {
    alert('esta funcion enseñará el detalle')
};
buscar();


datatable.on('click', '.ver', ver);
