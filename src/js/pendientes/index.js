import CryptoJS from 'crypto-js';
import { Dropdown } from "bootstrap";
import { Toast } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaPendientes', {
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
            title: 'Modulos Habilitados',
            data: 'sol_cred_modulos_autorizados'
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
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => `
                <button class='btn btn-success generar' 
                data-solicitud_id="${data}">
                <i class="bi bi-clipboard-check"></i></button>`
        },
    ]
});

const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/pendientes/buscar";
        const config = {
            method: 'GET'
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

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



const generar = async (e) => {
    try {
        const solicitudId = e.currentTarget.dataset.solicitud_id;
        const url = `/AccessEntry-Autocom/API/passwords/obtenerPassword?solicitudId=${solicitudId}`;
        console.log('Full URL:', url);

        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.codigo !== 1) {
            throw new Error(datos.error || 'Error desconocido');
        }

        // Desencriptar la contraseña
        const passwordDesencriptada = CryptoJS.AES.decrypt(
            datos.password_encriptada,
            datos.encryption_key,
            {
                iv: CryptoJS.enc.Hex.parse(datos.pass_token)
            }
        ).toString(CryptoJS.enc.Utf8);

        if (!passwordDesencriptada) {
            throw new Error('Error al desencriptar la contraseña');
        }

        // Mostrar la contraseña desencriptada
        await Swal.fire({
            title: 'Contraseña Desencriptada',
            text: passwordDesencriptada,
            icon: 'success'
        });

    } catch (error) {
        Swal.fire({
            title: 'Error', 
            text: error.message,
            icon: 'error'
        });
    }
};
// Event listeners
buscar();
datatable.on('click', '.generar', generar);
