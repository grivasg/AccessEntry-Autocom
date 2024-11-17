import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaFinalizadas', {
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
            data: 'estado_solicitud',
            render: (data, type, row) => {
                // Aquí decides qué imagen se mostrará dependiendo del valor del estado_solicitud
                let imagen = '';
                let estado = data.toUpperCase();

                // Puedes agregar imágenes condicionales para cada estado
                switch (estado) {
                    case 'OTORGANDO PERMISOS':
                        imagen = `<img src='/AccessEntry-Autocom/public/images/PERMISOS1.png' alt='Recibida' style='width: 80px; height: 80px;' />`;
                        break;
                }

                // Retorna el HTML que incluye la imagen y el texto
                return `
                    <div style="display: flex; align-items: center;">
                        ${imagen}
                        <span style="margin-left: 5px;">${data}</span>
                    </div>
                `;
            }
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                    <button class='btn btn-success verificar'><i class="bi bi-clipboard-check"></i> </button>

                    <button class='btn btn-danger rechazar'><i class="bi bi-hand-thumbs-down"></i></button>`;
            }
        }
    ]
});

const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/finalizadas/buscar";
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

const verificar = async () => {
    alert('SU SOLICITUD HA SIDO VERIFICADA')
};

const rechazar = async () => {
    alert('SU SOLICITUD HA SIDO RECHAZADA')
};


buscar();



datatable.on('click', '.verificar', verificar);
datatable.on('click', '.rechazar', rechazar);


