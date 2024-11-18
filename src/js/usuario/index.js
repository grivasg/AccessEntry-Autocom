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
                return `
                    <button class='btn btn-dark ingresar'><i class="bi bi-file-earmark-arrow-up-fill"></i> </button>`;
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

        // Mostrar mensaje de éxito
        Swal.fire({
            title: 'PDF Generado',
            text: 'El archivo PDF con las credenciales ha sido generado exitosamente',
            icon: 'success'
        });
    } else {
        Swal.fire({
            title: 'Operación cancelada',
            text: 'No se generó el PDF.',
            icon: 'info'
        });
    }
};

buscar();

datatable.on('click', '.ingresar', ingresar);
