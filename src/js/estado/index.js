import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";



let contador = 1;

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
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                let html = `
                <button class='btn btn-warning ver' data-solicitud_id="${data}"><i class="bi bi-eye-fill"></i> VER</button>
                `

                return html;
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
        const { datos } = data; // Obtén los datos correctamente

        datatable.clear().draw(); // Limpia la tabla antes de añadir los nuevos datos

        if (datos) {
            datatable.rows.add(datos).draw(); // Añade los datos a la tabla y dibuja
        }
    } catch (error) {
        console.log(error);
    }
};
buscar();


const ver = async (e) => {
    Swal.fire({
        title: "Solicitud Recibida:",
        text: "Su solicitud fue recibida y se encuentra en verificacion de Datos para poder crear Usuario",
        imageUrl: "/AccessEntry-Autocom/public/images/recibido.png",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Custom image"
    });
};


datatable.on('click', '.ver', ver);
