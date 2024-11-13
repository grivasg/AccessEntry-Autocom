import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

const formulario = document.getElementById('formularioSolicitud');
const btnGuardar = document.getElementById('btnGuardar');

// Funciones para avanzar entre pasos
const nextStepBtn = document.getElementById('next-step');
const backStepBtn = document.getElementById('back-step');

// Asegurarse de que los elementos existan antes de añadir event listeners
if (nextStepBtn) {
    nextStepBtn.addEventListener('click', function () {
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'block';
    });
}

if (backStepBtn) {
    backStepBtn.addEventListener('click', function () {
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

        // Dependiendo del código de respuesta, mostrar mensaje y tomar acción
        if (codigo === 1) {
            icon = 'success';
            formulario.reset();
            // Asumiendo que existe la función buscar()
            buscar();
        } else {
            icon = 'error';
            console.error(detalle); // Es mejor utilizar console.error para errores
        }

        // Mostrar mensaje Toast con la respuesta
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

// Añadir el evento al formulario
if (formulario) {
    formulario.addEventListener('submit', guardar);
}
