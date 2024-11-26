import { Dropdown } from "bootstrap";
import { ocultarLoader, Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaHistorial', {
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
            title: 'Fecha de Solicitud',
            data: 'sol_cred_fecha_solicitud',
            render: (data) => {
                // Asegurarse de que la fecha es válida
                const date = new Date(data);
                if (!isNaN(date)) {
                    let day = date.getDate().toString().padStart(2, '0'); // Asegura 2 dígitos para el día
                    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0, por eso +1
                    let year = date.getFullYear(); // Obtiene el año completo
                    return `${day}/${month}/${year}`; // dd/mm/aaaa
                }
                return data; // Si la fecha no es válida, devolver el dato original
            }
        },
        {
            title: 'Fecha de Envio',
            data: 'fecha_envio',
            render: (data) => {
                // Asegurarse de que la fecha es válida
                const date = new Date(data);
                if (!isNaN(date)) {
                    let day = date.getDate().toString().padStart(2, '0'); // Asegura 2 dígitos para el día
                    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0, por eso +1
                    let year = date.getFullYear(); // Obtiene el año completo
                    return `${day}/${month}/${year}`; // dd/mm/aaaa
                }
                return data; // Si la fecha no es válida, devolver el dato original
            }
        },
        {
            title: 'Ver Detalles',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                const button = document.createElement('button');
                button.className = 'btn btn-warning ver';
                button.innerHTML = '<i class="bi bi-book-half" title="DETALLES"></i>';

                // Guardar TODOS los datos de la fila
                button.setAttribute('data-row', JSON.stringify(row));

                return button.outerHTML;
            }
        },
    ]
});


ocultarLoader();

const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/historial/buscar";
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
// Iniciar la búsqueda cuando se carga la página

buscar();


const configuracionCampos = {
    'solicitud_id': {
        nombre: 'Número de Solicitud',
        transformar: (valor) => `#${valor}`
    },
    'nombres_solicitante': {
        nombre: 'Datos del Solicitante',
        transformar: (valor) => valor
    },
    'sol_cred_catalogo': {
        nombre: 'Catálogo/Usuario',
        transformar: (valor) => valor
    },
    'sol_cred_fecha_solicitud': {
        nombre: 'Fecha de Solicitud',
        transformar: (valor) => {
            const date = new Date(valor);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    },
    'fecha_envio': {
        nombre: 'Fecha y Hora de Envío',
        transformar: (valor) => {
            const date = new Date(valor);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    'nombres_responsable': {
        nombre: 'Responsable del Envío',
        transformar: (valor) => valor
    },
    'sol_cred_usuario': {
        nombre: '¿Tenia Usuario?',
        transformar: (valor) => valor
    },
    'sol_cred_correo': {
        nombre: 'Envíado a Correo',
        transformar: (valor) => valor
    },
    'sol_cred_telefono': {
        nombre: 'Teléfono',
        transformar: (valor) => valor
    },
    'sol_cred_modulo': {
        nombre: 'Módulo(s) Solicitado',
        transformar: (valor) => valor
    },
    'sol_cred_justificacion': {
        nombre: 'Justificación',
        transformar: (valor) => valor
    },
    'sol_cred_modulos_autorizados': {
        nombre: 'Módulos(s) Autorizado(s)',
        transformar: (valor) => valor
    },
    'sol_cred_justificacion_autorizacion': {
        nombre: 'Módulos(s) NO Autorizado(s) Motivo',
        transformar: (valor) => valor
    },
    'estado_cred_id': {
        nombre: 'ID de Estado',
        transformar: (valor) => valor
    },
    'estado_solicitud': {
        nombre: 'Estado de la Solicitud',
        transformar: (valor) => valor
    },

};

const generarTablaDetalles = (datos) => {
    let html = '<table class="table table-striped table-bordered">';
    html += '<thead><tr><th>DETALLES</th><th>INFORMACIÓN</th></tr></thead>';
    html += '<tbody>';

    // Ordenar los campos de manera específica
    const camposOrdenados = [
        'solicitud_id',
        'nombres_solicitante',
        'sol_cred_catalogo',
        'sol_cred_fecha_solicitud',
        'fecha_envio',
        'nombres_responsable',
        'sol_cred_usuario',
        'sol_cred_correo',
        'sol_cred_telefono',
        'sol_cred_modulo',
        'sol_cred_modulos_autorizados',
        'sol_cred_justificacion_autorizacion',
        'estado_solicitud',
    ];

    camposOrdenados.forEach(key => {
        const value = datos[key];

        // Solo mostrar si el valor no es null, undefined o cadena vacía
        if (value !== null && value !== undefined && value !== '') {
            const config = configuracionCampos[key] || {};

            const nombreFormateado = config.nombre ||
                key.replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());

            const valorFormateado = config.transformar
                ? config.transformar(value)
                : value;

            html += `
                <tr>
                    <td><strong>${nombreFormateado}</strong></td>
                    <td>${valorFormateado}</td>
                </tr>
            `;
        }
    });

    html += '</tbody></table>';
    return html;
};

const ver = async (e) => {
    // Obtener los datos guardados en el botón
    const rowDataString = e.currentTarget.getAttribute('data-row');

    if (!rowDataString) {
        console.error('No se encontraron datos en el botón');
        return;
    }

    const rowData = JSON.parse(rowDataString);
    console.log('Datos de la fila obtenidos:', rowData);

    try {
        // Usar el ID específico de esta solicitud
        const url = `/AccessEntry-Autocom/API/historial/detalle?id=${rowData.solicitud_id}`;
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        console.log('Resultado completo:', resultado);

        // Verificar si se encontraron datos
        if (resultado.codigo === 1 && resultado.datos.length > 0) {
            const solicitud = resultado.datos[0];

            Swal.fire({
                title: 'Detalles Completos de la Solicitud',
                html: generarTablaDetalles(rowData), // Asegúrate de que `generarTablaDetalles` usa los datos correctos
                width: '80%',
                showCloseButton: true,
                showConfirmButton: false,
                customClass: {
                    popup: 'my-custom-popup-class'
                },
                didOpen: () => {
                    // Añadir estilos personalizados si es necesario
                    const style = document.createElement('style');
                    style.textContent = `
                        .my-custom-popup-class .table {
                            width: 100%;
                            max-width: 100%;
                            margin-bottom: 1rem;
                            background-color: transparent;
                        }
                        .my-custom-popup-class .table th,
                        .my-custom-popup-class .table td {
                            padding: 0.75rem;
                            vertical-align: top;
                            border: 1px solid #dee2e6;
                        }
                        .my-custom-popup-class .table-striped tbody tr:nth-of-type(odd) {
                            background-color: rgba(0,0,0,.05);
                        }
                    `;
                    document.head.appendChild(style);
                }
            });
        } else {
            Toast.fire({
                icon: 'info',
                title: 'No se encontraron detalles para esta solicitud'
            });
        }
    } catch (error) {
        console.error('Error al obtener detalles:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al cargar los detalles'
        });
    }
};

datatable.on('click', '.ver', ver);
