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
    // Evitar el comportamiento predeterminado del evento si es necesario
    e.preventDefault();

    // Obtener el botón "Ingresar" y el contenedor donde se encuentra el botón
    const botonIngresar = e.target;
    const botonContainer = botonIngresar.closest('td');  // Suponiendo que los botones están en una celda de tabla

    // Mostrar el cuadro de diálogo de selección de archivo
    const { value: file } = await Swal.fire({
        title: "Selecciona un documento o imagen",
        input: "file",
        inputAttributes: {
            "accept": "image/*, application/pdf, .doc, .docx",  // Ajusta los tipos de archivo según lo que desees permitir
            "aria-label": "Cargar tu archivo"
        },
        showCancelButton: true, // Agregar un botón de cancelación
        confirmButtonText: 'Subir',
        cancelButtonText: 'Cancelar'
    });

    // Si el usuario selecciona un archivo
    if (file) {
        // Si es una imagen, mostramos una vista previa
        if (file.type.startsWith('image')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                Swal.fire({
                    title: "Vista previa de la imagen",
                    imageUrl: e.target.result,
                    imageAlt: "Imagen cargada",
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar'
                });
            };
            reader.readAsDataURL(file);
        } else {
            // Si no es una imagen, mostramos un mensaje que el archivo fue cargado
            Swal.fire({
                title: "Archivo cargado",
                text: `Has seleccionado el archivo: ${file.name}`,
                icon: 'success'
            });
        }

        // 1. Ocultar el botón "Ingresar" completamente
        botonIngresar.style.display = 'none';  // Ocultamos el botón "Ingresar"

        // 2. Eliminar contenido residual de la celda
        botonContainer.innerHTML = ''; // Eliminar todo el contenido (esto incluye el fondo y espacio residual)

        // 3. Crear y mostrar el botón "Enviar" con un icono
        const botonEnviar = document.createElement('button');
        botonEnviar.classList.add('btn', 'btn-success');

        // Agregar un icono dentro del botón (por ejemplo, el icono de "paper-plane" de Bootstrap Icons)
        botonEnviar.innerHTML = '<i class="bi bi-send"></i>';  // Icono de enviar de Bootstrap Icons

        // Establecer un evento para el botón "Enviar"
        botonEnviar.addEventListener('click', () => {
            // Al hacer clic en "Enviar", mostramos el alert
            alert('Aquí se envía');
        });

        // Añadir el botón "Enviar" al contenedor de la celda
        botonContainer.appendChild(botonEnviar);

        // 4. Forzar que DataTable actualice el layout
        datatable.draw();  // Forzamos el redibujado de la tabla
    } else {
        Swal.fire({
            title: "No se seleccionó archivo",
            text: "Por favor selecciona un archivo para continuar.",
            icon: "error"
        });
    }
};










buscar();



datatable.on('click', '.ingresar', ingresar);


