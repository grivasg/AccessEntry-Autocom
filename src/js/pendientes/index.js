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

async function obtenerYDesencriptarPassword(solicitudId) {
    try {
        const response = await fetch(`/AccessEntry-Autocom/API/passwords/obtener/${solicitudId}`);

        // Capturar la respuesta como texto para ver si es HTML o JSON
        const responseText = await response.text(); // Obtenemos la respuesta como texto

        // Verificar si la respuesta tiene el tipo de contenido correcto
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error('La respuesta no es JSON, tipo de contenido:', contentType);
            console.error('Respuesta del servidor:', responseText);
            throw new Error('La respuesta del servidor no es válida JSON');
        }

        // Si la respuesta es JSON, la convertimos
        const data = JSON.parse(responseText); // Convertimos el texto a JSON

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (data.codigo === 1) {
            const bytes = CryptoJS.AES.decrypt(
                data.datos.password_encriptada,
                data.datos.encryption_key
            );
            return bytes.toString(CryptoJS.enc.Utf8);
        } else {
            throw new Error(data.mensaje);
        }
    } catch (error) {
        console.error('Error al obtener o desencriptar la contraseña:', error);
        throw error;
    }
}



const generar = async (e) => {
    try {
        const button = e.target.closest('.generar');
        const solicitudId = button.dataset.solicitud_id;

        // Mostrar loading
        Swal.fire({
            title: 'Obteniendo credenciales',
            text: 'Por favor espere...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Obtener y desencriptar la contraseña
        const passwordDesencriptada = await obtenerYDesencriptarPassword(solicitudId);

        // Cerrar el loading
        Swal.close();

        // Mostrar modal con la contraseña
        await Swal.fire({
            title: 'Contraseña del Usuario',
            html: `
                <div class="mb-3">
                    <div class="input-group">
                        <input type="text" 
                            class="form-control" 
                            value="${passwordDesencriptada}" 
                            id="passwordField" 
                            readonly>
                        <button class="btn btn-outline-secondary" 
                            type="button" 
                            id="copyButton">
                            <i class="bi bi-clipboard"></i>
                        </button>
                    </div>
                </div>
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#6c757d',
            didRender: () => {
                // Agregar funcionalidad de copiar al portapapeles
                const copyButton = document.getElementById('copyButton');
                const passwordField = document.getElementById('passwordField');

                copyButton.addEventListener('click', () => {
                    passwordField.select();
                    document.execCommand('copy');
                    Toast.fire({
                        icon: 'success',
                        title: 'Contraseña copiada al portapapeles'
                    });
                });
            }
        });
    } catch (error) {
        console.error('Error en generar:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la contraseña del usuario'
        });
    }
};

// Event listeners
buscar();
datatable.on('click', '.generar', generar);
