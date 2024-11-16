import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaEstado', {
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
            title: 'Catalogo',
            data: 'sol_cred_catalogo'
        },
        {
            title: 'Puesto',
            data: 'puesto_dependencia'
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
            title: 'Estado de Solicitud',
            data: 'estado_solicitud',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                // Crear el botón como elemento HTML
                const button = document.createElement('button');
                button.className = 'btn btn-warning ver';
                button.innerHTML = '<i class="bi bi-eye-fill"></i> VER';

                // Guardar los datos completos de la fila en un atributo data
                button.setAttribute('data-row', JSON.stringify({
                    solicitud_id: row.solicitud_id,
                    estado_solicitud: row.estado_solicitud
                }));

                return button.outerHTML;
            }
        },
    ]
});

const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/estado/buscar";
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
            icon: 'error',
            title: 'Error al cargar los datos'
        });
    }
};

const ver = async (e) => {
    try {
        // Encontrar el botón que fue clickeado
        const button = e.target.closest('.ver');
        if (!button) return;

        // Obtener y parsear los datos guardados en el botón
        const rowData = JSON.parse(button.getAttribute('data-row'));

        console.log('Datos de la fila:', rowData); // Para debug

        if (!rowData) {
            throw new Error('No se encontraron datos para esta solicitud');
        }

        // Mostrar la ventana de alerta con la información
        await Swal.fire({
            title: `${rowData.estado_solicitud}`,
            imageUrl: "/AccessEntry-Autocom/public/images/recibido.png",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Custom image"
        });

    } catch (error) {
        console.error('Error en ver:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al mostrar los detalles'
        });
    }
};

// Agregar el event listener usando delegación de eventos
document.querySelector('#tablaEstado').addEventListener('click', function (e) {
    if (e.target.closest('.ver')) {
        ver(e);
    }
});

// Iniciar la búsqueda cuando se carga la página
buscar();