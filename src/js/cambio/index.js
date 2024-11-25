import { jsPDF } from "jspdf";
import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const datatable = new DataTable('#tablaCambio', {
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
            data: 'sol_cred_modulos_autorizados'
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                    <button class='btn btn-warning otorgar' title='CAMBIAR'>
                    <i class="bi bi-arrow-left-right"></i></button>`;
            }
        }
    ]
});

// Función para buscar los datos
const buscar = async () => {
    try {
        const url = "/AccessEntry-Autocom/API/cambio/buscar";
        const config = { method: 'GET' };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        if (data && data.datos) {
            datatable.clear();
            datatable.rows.add(data.datos).draw();
        }
    } catch (error) {
        Toast.fire({
            icon: 'info',
            title: 'No se encontraron Datos en esta pagina'
        });
    }
};


const otorgar = async (e) => {
    e.preventDefault();

    const fila = e.target.closest('tr');
    const datos = datatable.row(fila).data(); // Asegúrate de obtener los datos correctos de la fila
    const solCredModulosAutorizados = datos.sol_cred_modulos_autorizados; // El campo con los módulos autorizados

    // Convertir los módulos autorizados (cadena separada por comas) en un array
    const modulosAutorizados = solCredModulosAutorizados
        ? solCredModulosAutorizados.split(',').map(m => m.trim())
        : [];

    // Si no hay módulos autorizados, mostramos un mensaje de error
    if (modulosAutorizados.length === 0) {
        Swal.fire({
            title: 'Error',
            text: 'No hay módulos autorizados disponibles.',
            icon: 'error'
        });
        return;
    }

    // Confirmación de si los permisos han sido concedidos
    const { value: permisosConcedidos, isConfirmed } = await Swal.fire({
        title: 'Permisos a Nivel Base de Datos.',
        html: `
            <div class="alert alert-info mb-4" role="alert">
                <strong>Instrucciones:</strong> Por favor, marque los módulos a los cuales
                 ya se les ha <strong>Agregado Nuevos Permisos a Nivel de Base de Datos</strong>
                 mediante el CLI, para el catálogo <strong>${datos.sol_cred_catalogo}</strong>.
                 Recuerde que este usuario ya cuenta con acceso al AUTOCOM.
            </div>
            <p class="text-start mb-3">Por favor, marque los permisos que ha concedido:</p>
            <div class="text-center" style="display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 10px;">
                ${modulosAutorizados.map((modulo, index) => `
                    <div class="form-check">
                        <input class="form-check-input modulo-checkbox" type="checkbox" id="modulo-${index}" value="${modulo}">
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
        cancelButtonText: 'No, aún no',
        confirmButtonText: 'Sí, ya se concedieron',
        didRender: () => {
            // Deshabilitamos el botón de confirmación inicialmente
            const confirmButton = Swal.getConfirmButton();
            confirmButton.style.display = 'none';

            // Ajustamos el ancho del modal
            const modal = Swal.getPopup();
            modal.style.width = '800px';

            // Agregamos el listener para los checkboxes
            const checkboxes = document.querySelectorAll('.modulo-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
                    if (checkedBoxes.length === modulosAutorizados.length) {
                        // Si todos los checkboxes están seleccionados, mostramos el botón de confirmación
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

            // Verificamos que todos los módulos estén seleccionados antes de continuar
            return seleccionados.length === modulosAutorizados.length
                ? seleccionados
                : false;
        }
    });

    // Si el usuario no confirma los módulos, cancelamos
    if (!isConfirmed) {
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
        const url = "/AccessEntry-Autocom/API/cambio/otorgar";
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