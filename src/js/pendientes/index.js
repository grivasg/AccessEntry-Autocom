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
                <button class='btn btn-success generar' 
                data-solicitud_id="${data}">
                <i class="bi bi-clipboard-check"></i></button>
                <button class='btn btn-danger pdf' 
                data-solicitud_id="${data}">
                <i class="bi bi-file-earmark-pdf-fill" title="GENERAR PDF"></i></button>`
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

    jQuery('#pdfModal .btn-enviar').on('click', function () {
        alert('procedimiento para enviar');
        closeModal();
    });

    jQuery('#pdfModal .btn-rechazar').on('click', closeModal);

    jQuery('#pdfModal').on('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

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

    try {
        const passwordDesencriptada = await generar(solicitudId);
        const pdfUrlModified = await modificarPdfConContraseña(pdfUrl, passwordDesencriptada);

        jQuery('#pdfViewer').attr('src', pdfUrlModified);
        showModal();

    } catch (error) {
        console.error('Error al generar o modificar el PDF:', error);
    }
};

jQuery(document).ready(function ($) {
    var datatable = $('#tuDataTable').DataTable();
    datatable.on('click', '.pdf', pdf);
});

buscar();
datatable.on('click', '.generar', generar);
datatable.on('click', '.pdf', pdf);
