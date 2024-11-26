import { Dropdown } from "bootstrap";
import { ocultarLoader, Toast, validarFormulario } from "../funciones";
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
            title: 'Datos del Solicitante',
            data: 'nombres_solicitante'
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
            title: 'Modulos Solicitados',
            data: 'sol_cred_modulo',
            render: (data, type, row) => {
                // Limpiar la cadena de módulos, eliminando posibles caracteres no deseados
                const modulosSeleccionados = data
                    .replace(/[\\"\[\]]/g, '') // Elimina barras, comillas, corchetes
                    .replace(/\\u00d1/g, 'Ñ') // Reemplaza la representación Unicode de Ñ
                    .split(',')
                    .map(m => m.trim())
                    .filter(m => m) // Elimina elementos vacíos
                    .join(', '); // Reúne los módulos en una cadena legible

                return modulosSeleccionados;
            }
        },
        {
            title: 'Fecha de Solicitud',
            data: 'sol_cred_fecha_solicitud',
            render: (data, type, row) => {
                if (!data) return "";
                // Crear objeto Date
                const fecha = new Date(data);
                // Formatear la fecha
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                const año = fecha.getFullYear();
                return `${dia}/${mes}/${año}`;
            }
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
                button.innerHTML = '<i class="bi bi-eye-fill"></i>';

                // Guardar los datos completos de la fila en un atributo data
                button.setAttribute('data-row', JSON.stringify({
                    solicitud_id: row.solicitud_id,
                    estado_solicitud: row.estado_solicitud,
                    sol_cred_justificacion_autorizacion: row.sol_cred_justificacion_autorizacion,
                    id_estado: row.estado_cred_id
                }));

                return button.outerHTML;
            }
        },
    ]
});

ocultarLoader();

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
            icon: 'info',
            title: 'No se encontraron Datos en esta pagina'
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

        // Convertir id_estado a un número
        const estado = parseInt(rowData.id_estado, 10);

        // Evaluar el valor de estado
        if (estado === 1) {
            Swal.fire({
                title: 'Solicitud Recibida',
                text: 'Su solicitud ha sido recibida y está en proceso de verificación.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso1.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else if (estado === 2) {
            Swal.fire({
                title: 'Generando Usuario',
                text: 'Estamos en proceso de crear su cuenta y generar las credenciales necesarias para habilitar su acceso.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso2.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else if (estado === 3) {
            Swal.fire({
                title: 'Otorgando Permisos',
                text: 'Estamos otorgando los permisos correspondientes para garantizar el correcto funcionamiento de su cuenta de usuario.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso3.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else if (estado === 4) {
            Swal.fire({
                title: 'Credenciales Enviadas',
                text: 'Las credenciales han sido enviadas. Revise el correo electrónico registrado para mas detalles.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso4.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else if (estado === 5) {
            // Aquí mostramos el modal con la justificación directamente en el mensaje
            const justificacionAutorizacion = rowData.sol_cred_justificacion_autorizacion;

            Swal.fire({
                title: 'Lamentablemente, su solicitud ha sido rechazada.',
                html: justificacionAutorizacion ? `<br><strong>MOTIVO:</strong><br>${justificacionAutorizacion}` : '',
                imageUrl: "/AccessEntry-Autocom/public/images/rechazado.png",
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: "Custom image"
            });

        } else if (estado === 6) {
            Swal.fire({
                title: 'Otorgando Permisos',
                text: 'Estamos otorgando los permisos correspondientes para garantizar el correcto funcionamiento de su cuenta de usuario.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso3.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else if (estado === 7) {
            Swal.fire({
                title: 'Otorgando Permisos',
                text: 'Estamos otorgando los permisos correspondientes para garantizar el correcto funcionamiento de su cuenta de usuario.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso3.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else {
            console.log('Estado desconocido');
            Swal.fire({
                title: 'Estado Desconocido',
                text: 'No se pudo determinar el estado de su solicitud.',
                icon: 'warning',
            });
        }

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