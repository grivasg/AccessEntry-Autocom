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
            // console.log('El estado de la solicitud es 1');
            Swal.fire({
                title: 'Solicitud Recibida',
                text: 'Su solicitud ha sido recibida y está en proceso de verificación.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso1.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else if (estado === 2) {
            // console.log('El estado de la solicitud es 2');
            Swal.fire({
                title: 'Generando Usuario',
                text: 'Estamos generando el usuario para usted. Espere un momento.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso2.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else if (estado === 3) {
            // console.log('El estado de la solicitud es 3');
            Swal.fire({
                title: 'Otorgando Permisos',
                text: 'Estamos otorgando los permisos necesarios para su cuenta.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso3.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else if (estado === 4) {
            // console.log('El estado de la solicitud es 4');
            Swal.fire({
                title: 'Credenciales Enviadas',
                text: 'Las credenciales han sido enviadas. Revise su correo para más detalles.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso4.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else if (estado === 5) {
            // console.log('El estado de la solicitud es 5');
            Swal.fire({
                title: 'Solicitud Rechazada',
                text: 'Lamentablemente, su solicitud ha sido rechazada. Para mas Información revise el Informe',
                footer: '<a href="#" id="verInforme">Ver Informe</a>',  // Agregar un ID al enlace para identificarlo
                imageUrl: "/AccessEntry-Autocom/public/images/rechazado.png",
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: "Custom image"
            }).then((result) => {
                // Este bloque maneja cuando el modal principal se cierra
                if (result.dismiss === Swal.DismissReason.close) {
                    // Podrías agregar algo aquí si necesitas saber cuándo el primer modal se cierra
                }
            });

            // Agregar un manejador de eventos para el enlace 'Ver Informe'
            document.querySelector('#verInforme').addEventListener('click', function (e) {
                e.preventDefault();  // Evitar que el enlace haga su acción por defecto (navegar a '#')

                // Mostrar el segundo modal con la información del informe
                Swal.fire({
                    title: 'Informe Detallado',
                    text: 'Aquí puedes agregar el contenido del informe de la solicitud rechazada.',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            });
        } else if (estado === 6) {
            // console.log('El estado de la solicitud es 6');
            Swal.fire({
                title: 'Otorgando Permisos',
                text: 'Estamos otorgando los permisos necesarios para su cuenta.',
                imageUrl: "/AccessEntry-Autocom/public/images/caso3.png",
                imageWidth: 490,
                imageHeight: 270,
                imageAlt: "Custom image"
            });
        } else if (estado === 7) {
            // console.log('El estado de la solicitud es 3');
            Swal.fire({
                title: 'Otorgando Permisos',
                text: 'Estamos otorgando los permisos necesarios para su cuenta.',
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