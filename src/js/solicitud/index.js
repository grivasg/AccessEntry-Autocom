import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const formulario = document.getElementById('formularioSolicitud');
const btnGuardar = document.getElementById('btnGuardar');
const next_step = document.getElementById('next-step');

// Funciones para avanzar entre pasos
const nextStepBtn = document.getElementById('next-step');
const backStepBtn = document.getElementById('back-step');

// Asegurarse de que los elementos existan antes de añadir event listeners
if (nextStepBtn) {
    nextStepBtn.addEventListener('click', function() {
        // La navegación se manejará en la función siguiente()
    });
}

if (backStepBtn) {
    backStepBtn.addEventListener('click', function() {
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-1').style.display = 'block';
    });
}

// Función para guardar la solicitud
const guardar = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de continuar
    if (!validarFormulario(formulario, ['solicitud_id'])) {
        Swal.fire({
            title: "Campos vacíos",
            text: "Debe llenar todos los campos",
            icon: "info",
        });
        return;
    }

    try {
        const body = new FormData(formulario);
        const url = "/AccessEntry-Autocom/API/solicitud/guardar";
        const config = {
            method: 'POST',
            body
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle } = data;
        let icon = 'info';

        if (codigo === 1) {
            icon = 'success';
            formulario.reset();
            buscar();
        } else {
            icon = 'error';
            console.error(detalle);
        }

        Toast.fire({
            icon: icon,
            title: mensaje,
            timer: 8000
        });

    } catch (error) {
        console.error('Error al guardar la solicitud:', error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al procesar la solicitud. Inténtalo de nuevo más tarde.",
            icon: "error",
        });
    }
};

const siguiente = async (e) => {
    e.preventDefault();

    // Obtener el valor del catálogo
    const catalogo = formulario.sol_cred_catalogo.value.trim();

    // Validar que se haya ingresado un catálogo
    if (!catalogo) {
        Swal.fire({
            title: "Campo vacío",
            text: "Debe ingresar un número de catálogo",
            icon: "warning"
        });
        return;
    }

    try {
        // Verificar si existe el catálogo
        const body = new FormData(formulario);
        const url = "/AccessEntry-Autocom/API/solicitud/catalogoExiste";
        const config = {
            method: 'POST',
            body
        };

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        if (data.codigo === 1) {
            // El catálogo existe, obtener los datos del personal
            const urlDatos = "/AccessEntry-Autocom/API/solicitud/obtenerDatosPersonal";
            const respuestaDatos = await fetch(urlDatos, config);
            const datosPersonal = await respuestaDatos.json();

            if (datosPersonal.codigo === 1) {
                // Llenar los campos con los datos obtenidos
                document.getElementById('sol_cred_solicitante').value = datosPersonal.datos.nombres_completos;
                document.getElementById('sol_cred_puesto').value = datosPersonal.datos.puesto;
                document.getElementById('sol_cred_dependencia').value = datosPersonal.datos.dependencia;

                // Mostrar el segundo paso
                document.getElementById('step-1').style.display = 'none';
                document.getElementById('step-2').style.display = 'block';

                Toast.fire({
                    icon: 'success',
                    title: 'Catálogo verificado correctamente'
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron obtener los datos del personal",
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "Catálogo no encontrado",
                text: "El número de catálogo ingresado no existe en la base de datos",
                icon: "error"
            });
        }

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al verificar el catálogo",
            icon: "error"
        });
    }
};

// Event Listeners
formulario.addEventListener('submit', guardar);
next_step.addEventListener('click', siguiente);