const formulario = document.getElementById('formArchivo');
import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";

// Función para manejar la subida del archivo
const subir = async (e) => {
    e.preventDefault();

    // Verificar si se seleccionó un archivo
    if (!formulario.archivo.files[0]) {
        Toast.fire({
            icon: "warning",
            title: "Debe cargar un archivo",
        });
        return;
    }

    try {
        // Crear un objeto FormData con los datos del formulario
        const body = new FormData(formulario);
        const url = '/AccessEntry-Autocom/API/ftp/subir';  // Ruta a la que se enviará el archivo
        const config = {
            method: 'POST',
            body
        };

        // Enviar el archivo al servidor
        const respuesta = await fetch(url, config);
        const data = await respuesta.json();

        // Desestructurar la respuesta del servidor
        const { codigo, mensaje, detalle } = data;

        // Verificar si la subida fue exitosa
        if (codigo === 1) {
            // Alerta de éxito, el archivo se subió correctamente
            Toast.fire({
                icon: "success",
                title: "¡Archivo subido correctamente!",
            });
            formulario.reset();  // Limpiar el formulario
        } else {
            // Alerta de error, si no se pudo subir el archivo
            Toast.fire({
                icon: "error",
                title: mensaje,
            });
            console.log(detalle);  // Imprimir detalles del error en consola
        }
    } catch (error) {
        // Manejar errores de red o problemas con la subida
        console.log(error);
        Toast.fire({
            icon: "error",
            title: "Hubo un problema al subir el archivo",
        });
    }
};

// Añadir el listener al formulario para que se ejecute la función 'subir' cuando se envíe
formulario.addEventListener('submit', subir);
