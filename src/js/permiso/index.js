import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaPermisos', {
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
            title: 'Modulos a Habilitar Permisos',
            data: 'sol_cred_modulos_autorizados'
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                    <button class='btn btn-success otorgar'><i class="bi bi-clipboard-check"></i> </button>`;
            }
        }
    ]
});

const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/permiso/buscar";
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

const otorgar = async (e) => {
    e.preventDefault();

    const fila = e.target.closest('tr');
    const datos = datatable.row(fila).data(); // Asegúrate de obtener los datos correctos de la fila

    // Confirmación de si los permisos han sido concedidos
    const { value: permisosConcedidos } = await Swal.fire({
        title: '¿Ha concedido los permisos a nivel Aplicación?',
        text: 'Por favor, asegúrese de haber otorgado los permisos necesarios antes de continuar.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, ya se concedieron',
        cancelButtonText: 'No, aún no'
    });

    // Si el usuario no confirma los permisos, se detiene el flujo
    if (!permisosConcedidos) {
        Swal.fire({
            title: 'Acción cancelada',
            text: 'Debe conceder los permisos antes de continuar.',
            icon: 'info'
        });
        return; // No continuar si no se concedieron los permisos
    }

    try {
        
        // Preparar los datos para enviarlos
        const formData = new FormData();
        formData.append('solicitud_id', datos.solicitud_id); // Usamos 'solicitud_id' desde los datos de la fila

        // URL de la API para enviar la solicitud
        const url = "/AccessEntry-Autocom/API/permiso/otorgar";
        const config = {
            method: 'POST',
            body: formData
        };

        // Enviar los datos al servidor
        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        if (data.codigo === 1) {
            // Mostrar mensaje de éxito
            Toast.fire({
                icon: 'success',
                title: data.mensaje
            });
            await buscar(); // Actualiza la tabla con los nuevos datos
        } else {
            // Mostrar mensaje de error si la respuesta no es exitosa
            throw new Error(data.detalle || 'Hubo un problema al otorgar los Permisos');
        }
    } catch (error) {
        console.error('Error al otorgar permisos:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al verificar la solicitud'
        });
    }
};




buscar();



datatable.on('click', '.otorgar', otorgar);


