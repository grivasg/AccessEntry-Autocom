import { jsPDF } from "jspdf";
import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaUsuario', {
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
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                const generatedPdf = localStorage.getItem(`pdfGenerated_${data}`);
                if (generatedPdf) {
                    return `
                        <button class='btn btn-success subir'>
                            <i class="bi bi-file-earmark-arrow-up-fill"></i>
                        </button>`;
                } else {
                    return `
                        <button class='btn btn-dark ingresar'>
                            <i class="bi bi-file-earmark-arrow-up-fill"></i> 
                        </button>`;
                }
            }
        }
    ]
});

const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/usuario/buscar";
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

const ingresar = async (e) => {
    e.preventDefault();

    const fila = e.target.closest('tr');
    const datos = datatable.row(fila).data();

    // Mostrar el formulario con dos campos usando HTML personalizado
    const { value: formData } = await Swal.fire({
        title: 'Ingrese los credenciales del Usuario Creado',
        html: `
            <form id="FormCredenciales">
                <div class="mb-3">
                    <label for="usuario" class="form-label">Ingrese Usuario</label>
                    <input type="text" id="usuario" class="form-control" placeholder="Escribe algo...">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Ingrese Contraseña</label>
                    <input type="text" id="password" class="form-control" placeholder="Escribe algo...">
                </div>
            </form>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const usuario = document.getElementById('usuario').value;
            const password = document.getElementById('password').value;

            if (!usuario || !password) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false;
            }

            return { usuario, password };
        }
    });

    if (formData) {
        // Crear PDF con los datos
        const pdf = new jsPDF();

        // Encabezado - "RESERVADO" en rojo y tamaño 16
        pdf.setTextColor(255, 0, 0);  // Color rojo
        pdf.setFontSize(16);
        pdf.text('RESERVADO', 105, 20, null, null, 'center');  // Centrado en la parte superior

        // Configurar el contenido del PDF
        pdf.setTextColor(0, 0, 0);  // Volver al color negro para el contenido
        pdf.setFontSize(16);
        pdf.text('Credenciales de Usuario', 20, 40);

        pdf.setFontSize(12);
        // Agregar datos del usuario de la fila seleccionada
        pdf.text(`Grado y Arma: ${datos.grado_arma}`, 20, 60);
        pdf.text(`Nombres: ${datos.nombres_apellidos}`, 20, 70);
        pdf.text(`Puesto: ${datos.puesto_dependencia}`, 20, 80);

        // Agregar línea separadora
        pdf.line(20, 90, 190, 90);

        // Agregar credenciales
        pdf.text('Credenciales de Acceso:', 20, 105);
        pdf.text(`Usuario: ${formData.usuario}`, 20, 115);
        pdf.text(`Contraseña: ${formData.password}`, 20, 125);

        // Obtener fecha y hora actual
        const fecha = new Date();
        const fechaFormateada = fecha.toLocaleDateString(); // Formato de fecha
        const horaFormateada = fecha.toLocaleTimeString(); // Formato de hora

        // Agregar fecha y hora al PDF
        pdf.setFontSize(10);
        pdf.text(`Documento generado el: ${fechaFormateada} a las ${horaFormateada}`, 20, 140);

        // Pie de página - "RESERVADO" en rojo y tamaño 16
        pdf.setTextColor(255, 0, 0);  // Color rojo
        pdf.setFontSize(16);
        pdf.text('RESERVADO', 105, 285, null, null, 'center');  // Centrado en la parte inferior

        // Guardar el PDF
        pdf.save(`credenciales_${formData.usuario}.pdf`);

        // Guardar el estado de que el PDF ya fue generado
        localStorage.setItem(`pdfGenerated_${datos.solicitud_id}`, 'true');

        // Actualizar el botón para que diga "Aquí se envía PDF" y deshabilitarlo
        Swal.fire({
            title: 'PDF Generado',
            text: 'El archivo PDF con las credenciales ha sido generado exitosamente',
            icon: 'success'
        });

        // Recargar la tabla para reflejar el cambio de estado del botón
        datatable.clear();
        buscar();
    } else {
        Swal.fire({
            title: 'Operación cancelada',
            text: 'No se generó el PDF.',
            icon: 'info'
        });
    }
};



let pdfUrl = '';  // Global variable to store PDF URL
let solicitudId = null;  // Global variable to store current solicitud_id

const subirArchivo = async (e) => {
    // Obtener el ID de la solicitud desde la fila clicada
    const fila = e.target.closest('tr');
    solicitudId = datatable.row(fila).data().solicitud_id;

    // Crear Swal para cargar el archivo PDF
    const { value: archivo } = await Swal.fire({
        title: 'Sube un archivo PDF',
        input: 'file',
        inputAttributes: {
            'accept': 'application/pdf', // Solo aceptar archivos PDF
            'aria-label': 'Selecciona un archivo PDF'
        },
        showCancelButton: true,
        confirmButtonText: 'Subir',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return '¡Necesitas seleccionar un archivo!';
            }
        }
    });

    if (archivo) {
        try {
            // Crear un FormData para enviar el archivo
            const formData = new FormData();
            formData.append('archivo', archivo);
            formData.append('solicitudId', solicitudId);  // Agregar solicitud_id al FormData

            const url = '/AccessEntry-Autocom/API/ftp/subir';
            const config = {
                method: 'POST',
                body: formData
            };

            const respuesta = await fetch(url, config);
            const data = await respuesta.json();
            const { codigo, mensaje, archivoUrl } = data;

            if (codigo === 1) {
                Toast.fire({
                    icon: 'success',
                    title: mensaje
                });

                pdfUrl = archivoUrl;

                // Reemplazar el botón actual con dos nuevos botones
                const cell = fila.querySelector('.subir').closest('td');
                cell.innerHTML = `
                    <div class="btn-group" role="group">
                        <button class="btn btn-info ver-pdf" data-url="${pdfUrl}">
                            <i class="bi bi-eye-fill"></i> Ver
                        </button>
                        <button class="btn btn-primary enviar-pdf">
                            <i class="bi bi-send-fill"></i> Enviar
                        </button>
                    </div>
                `;
            } else {
                Toast.fire({
                    icon: 'error',
                    title: mensaje
                });
            }
        } catch (error) {
            console.error(error);
            Toast.fire({
                icon: 'error',
                title: 'Hubo un error al intentar subir el archivo'
            });
        }
    }
};

// Delegar eventos para los botones dinámicos
datatable.on('click', '.ver-pdf', function () {
    const pdfUrl = this.dataset.url;

    // Crear un iframe para mostrar el PDF
    const iframeHtml = `
        <iframe src="${pdfUrl}" width="100%" height="500px"></iframe>
    `;

    Swal.fire({
        title: 'Vista previa del PDF',
        html: iframeHtml,
        width: '80%',
        showCloseButton: true,
        showConfirmButton: false
    });
});

datatable.on('click', '.enviar-pdf', function () {
    alert('Enviar PDF');
});




buscar();

datatable.on('click', '.ingresar', ingresar);
datatable.on('click', '.subir', subirArchivo);
