import { Dropdown } from "bootstrap";
import { ocultarLoader, mostrarLoader, Toast, validarFormulario } from "../funciones";
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
            title: 'Permisos a Otorgar en Modulos',
            data: 'sol_cred_modulos_autorizados'
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                    <button class='btn btn-success otorgar' title='ASIGNAR PERMISO'>
                    <i class="bi bi-key"></i> </button>`;
            }
        }
    ]
});

ocultarLoader();  // Asegúrate de ocultar el loader después de cargar la página

const buscar = async () => {
    mostrarLoader();  // Muestra el loader antes de comenzar la búsqueda
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
            icon: 'info',
            title: 'No se encontraron Datos en esta página'
        });
    } finally {
        ocultarLoader();  // Oculta el loader una vez completada la búsqueda
    }
};

const otorgar = async (e) => {
    e.preventDefault();

    const fila = e.target.closest('tr');
    const datos = datatable.row(fila).data(); // Asegúrate de obtener los datos correctos de la fila
    const sol_cred_catalogo = datos.sol_cred_catalogo; // Obtener el campo sol_cred_catalogo de la fila

    // Parsear los módulos autorizados
    const modulosAutorizados = datos.sol_cred_modulos_autorizados
        ? datos.sol_cred_modulos_autorizados.split(',').map(m => m.trim())
        : [];

    // Confirmación de si los permisos han sido concedidos y selección de módulos
    const { value: permisosConcedidos, isConfirmed } = await Swal.fire({
        title: 'Permisos a Nivel Aplicación.',
        html: ` 
            <div class="alert alert-success mb-4" role="alert">
                <strong>Instrucciones:</strong> Por favor, seleccione los módulos a los cuales
                ha otorgado <strong>Permisos a Nivel de Aplicación</strong> para el 
                <strong>Catálogo ${sol_cred_catalogo}</strong>.
            </div>
            <div class="text-start" style="display: flex; flex-direction: column; align-items: center;">
                ${modulosAutorizados.map((modulo, index) => `
                    <div class="form-check">
                        <input 
                            class="form-check-input modulo-checkbox" 
                            type="checkbox" 
                            id="modulo-${index}" 
                            value="${modulo}"
                        >
                        <label class="form-check-label" for="modulo-${index}">
                            ${modulo}
                        </label>
                    </div>
                `).join('')}
            </div>
        `,
        icon: 'question',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        didRender: () => {
            // Ajustamos el ancho del modal a 800px
            const modal = Swal.getPopup();
            modal.style.width = '800px';  // Ajuste del ancho aquí

            // Agregamos listener para los checkboxes
            const checkboxes = document.querySelectorAll('.modulo-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
                    if (checkedBoxes.length === modulosAutorizados.length) {
                        // Si todos los checkboxes están marcados, mostramos el botón de confirmación
                        const confirmButton = Swal.getConfirmButton();
                        confirmButton.style.display = 'block';
                        confirmButton.textContent = 'Permisos Concedidos';
                    } else {
                        const confirmButton = Swal.getConfirmButton();
                        confirmButton.style.display = 'none';
                    }
                });
            });
        },
        preConfirm: () => {
            const checkboxes = document.querySelectorAll('.modulo-checkbox');
            const seleccionados = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            return seleccionados.length === modulosAutorizados.length
                ? seleccionados
                : false;
        }
    });

    // Si el usuario no confirma la selección de módulos, se detiene el flujo
    if (!isConfirmed) {
        return;
    }

    mostrarLoader();  // Muestra el loader mientras se procesan los datos de otorgar permisos

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
    } finally {
        ocultarLoader();  // Oculta el loader una vez que la operación se haya completado
    }
};

buscar();

datatable.on('click', '.otorgar', otorgar);
