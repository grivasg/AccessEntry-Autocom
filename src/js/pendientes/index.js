import CryptoJS from 'crypto-js';
import { PDFDocument, rgb } from 'pdf-lib';
import jQuery from 'jquery';
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
                <button class='btn btn-danger pdf' 
                data-solicitud_id="${data}">
                <i class="bi bi-file-earmark-pdf-fill" title="GENERAR Y ENVIAR CREDENCIALES"></i><i class="bi bi-send-check-fill"></i></button>`
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

const generar = async (solicitudId) => {
    try {
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

        return passwordDesencriptada;

    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
        throw error; // Lanza el error para manejarlo fuera de la función
    }
};

const modificarPdfConContraseña = async (pdfUrl, passwordDesencriptada) => {
    const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const page = pages[0];  // Edita la primera página

    // POSISICON DE IMPRESION DE CONTRASEÑA
    page.drawText(`_____________ ${passwordDesencriptada}`, {
        x: 58,  // Distancia desde la izquierda
        y: page.getHeight() - 240,  // Distancia desde la parte superior
        size: 16,  // Tamaño de la fuente
        color: rgb(0, 0, 0)  // Color negro
    });

    const pdfBytesModified = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytesModified], { type: 'application/pdf' });
    const pdfUrlModified = URL.createObjectURL(pdfBlob);

    return pdfUrlModified;
};

function initializePdfModal() {
    const modalHTML = `
        <div id="pdfModal" class="modal-background">
            <div class="modal-container">
                <iframe id="pdfViewer" style="width: 1000px; height: 450px; border: none;"></iframe>
                <div class="button-container">
                    <button class="btn-enviar">Enviar</button>
                    <button class="btn-rechazar">Rechazar</button>
                </div>
            </div>
        </div>

        <style>
        .modal-background {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }

        .modal-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 1001;
        }

        .button-container {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
        }

        .btn-enviar, .btn-rechazar {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }

        .btn-enviar {
            background: #4CAF50;
            color: white;
        }

        .btn-rechazar {
            background: #f44336;
            color: white;
        }
        </style>
    `;

    jQuery('body').append(modalHTML);

    // Manejo del botón de "Enviar"
    jQuery('#pdfModal .btn-enviar').on('click', function () {
        Swal.fire({
            title: 'Ingresar Catálogo',
            html: `
                <input type="text" id="catalogoInput" class="swal2-input" placeholder="Ingrese el catálogo" />
                <button id="validarCatalogo" class="swal2-confirm swal2-styled" style="display:none">Validar</button>
            `,
            preConfirm: () => {
                const catalogo = jQuery('#catalogoInput').val();
                if (!catalogo) {
                    Swal.showValidationMessage('Por favor ingrese un catálogo.');
                    return false;
                }
                return catalogo;
            },
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            willOpen: () => {
                jQuery('#validarCatalogo').show();  // Muestra el botón de "Validar"
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const catalogo = result.value;
                const valid = await validarCatalogo(catalogo);
                if (valid) {
                    Swal.fire('Catálogo válido', '', 'success');
                    // Aquí puedes agregar la lógica para continuar con el envío
                } else {
                    Swal.fire('Catálogo no encontrado', '', 'error');
                }
            }
        });

        // Cuando se haga clic en el botón de "Validar"
        jQuery('#validarCatalogo').on('click', async function () {
            const catalogo = jQuery('#catalogoInput').val();
            const valid = await validarCatalogo(catalogo);
            if (valid) {
                Swal.fire('Catálogo válido', '', 'success');
            } else {
                Swal.fire('Catálogo no encontrado', '', 'error');
            }
        });
    });

    // Manejo del botón de "Rechazar"
    jQuery('#pdfModal .btn-rechazar').on('click', closeModal);

    // Cerrar el modal si se hace clic fuera de la caja
    jQuery('#pdfModal').on('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });
}


const validarCatalogo = async (catalogo) => {
    try {
        const url = '/AccessEntry-Autocom/API/pendientes/catalogoexiste'; // La URL correcta para la API
        const formData = new FormData();
        formData.append('sol_cred_catalogo', catalogo);  // Agregamos el parámetro al FormData

        const response = await fetch(url, {
            method: 'POST',  // Cambiar a POST
            body: formData   // Enviar los datos como body en POST
        });

        const data = await response.json();

        // Si el código es 1, el catálogo es válido
        return data.codigo === 1;
    } catch (error) {
        Swal.fire('Error', 'Hubo un problema al verificar el catálogo', 'error');
        return false;
    }
};



function showModal() {
    jQuery('#pdfModal').show();
}

function closeModal() {
    jQuery('#pdfModal').hide();
    jQuery('#pdfViewer').attr('src', '');
}

const pdf = async (e) => {
    e.preventDefault();
    const data = e.currentTarget.dataset;
    const solicitudId = data.solicitud_id;
    const pdfUrl = `/AccessEntry-Autocom/reporte/generarCredenciales?solicitud=${solicitudId}`;

    if (!jQuery('#pdfModal').length) {
        initializePdfModal();
    }

    Swal.fire({
        title: 'Generando PDF',
        html: `
            <div class="progress-bar-container">
                <div class="progress-bar"></div>
            </div>
            <div class="progress-text">Procesando credenciales...</div>
        `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    try {
        const passwordDesencriptada = await generar(solicitudId);
        const pdfUrlModified = await modificarPdfConContraseña(pdfUrl, passwordDesencriptada);
        Swal.close();

        jQuery('#pdfViewer').attr('src', pdfUrlModified);
        showModal();

    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al generar el PDF',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        console.error('Error al generar o modificar el PDF:', error);
    }
};

jQuery(document).ready(function ($) {
    var datatable = $('#tuDataTable').DataTable();
    datatable.on('click', '.pdf', pdf);
});

const styles = `
<style>
    .swal2-popup {
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(10px);
        padding: 2em;
        border-radius: 15px;
    }

    .swal2-title {
        color: #333;
        font-size: 1.4em;
        margin-bottom: 1.5em;
    }

    .progress-bar-container {
        width: 100%;
        height: 4px;
        background: #f0f0f0;
        margin: 20px auto;
        border-radius: 2px;
        overflow: hidden;
        position: relative;
    }

    .progress-bar {
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #8BC34A);
        animation: progressAnimation 2s infinite linear;
        transform-origin: left;
    }

    .progress-text {
        color: #666;
        font-size: 0.9em;
        margin-top: 15px;
        text-align: center;
    }

    @keyframes progressAnimation {
        0% {
            transform: translateX(-100%);
        }
        50% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(100%);
        }
    }

    /* Ocultar el spinner predeterminado de SweetAlert2 */
    .swal2-loading {
        .swal2-loader {
            display: none !important;
        }
    }
</style>
`;


// Agregar los estilos al documento
jQuery('head').append(styles);
buscar();
datatable.on('click', '.generar', generar);
datatable.on('click', '.pdf', pdf);
