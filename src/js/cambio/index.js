import { jsPDF } from "jspdf";
import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaCambio', {
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
            data: 'sol_cred_modulos_autorizados'
        },
        {
            title: 'Permisos Solicitados',
            data: 'sol_cred_justificacion'
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                const datosGuardados = localStorage.getItem(`datosGuardados_${data}`);
                if (datosGuardados) {
                    return ` 
                        <button class='btn btn-success enviar'>
                            <i class="bi bi-send-fill"></i>
                        </button>`;
                } else {
                    return ` 
                        <button class='btn btn-dark ingresar'>
                            <i class="bi bi-pencil-square"></i>
                        </button>`;
                }
            }
        }
    ]
});

// Función para buscar los datos
const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/cambio/buscar";
        const config = { method: 'GET' };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        if (data && data.datos) {
            datatable.clear();
            datatable.rows.add(data.datos).draw();
        }
    } catch (error) {
        Toast.fire({
            icon: 'error',
            title: 'Error al cargar los datos'
        });
    }
};


const ingresar = async () => {
    alert('funcion ingresar');
    
};

const enviar = async () => {
    alert('funcion enviar');

    
};



// Delegar eventos para los botones dinámicos
datatable.on('click', '.ingresar', ingresar);
datatable.on('click', '.enviar', enviar);

// Asegurarnos de cargar los datos y mostrar el estado correcto después de recargar la página
buscar();
