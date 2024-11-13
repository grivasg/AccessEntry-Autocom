
const datatable = new DataTable('#tablaSolicitudes', {
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
            title: 'Correo',
            data: 'sol_cred_correo'
        },
        {
            title: 'Telefono',
            data: 'sol_cred_telefono'
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
            title: '¿Cuénta con Usuario y contraseña para AUTOCOM?',
            data: 'sol_cred_usuario'
        },
        {
            title: 'Estado de Solicitud',
            data: 'estado_solicitud'
        },
        {
            title: 'Acciones',
            data: 'solicitud_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                let html = `
                <button class='btn btn-warning modificar' 
                data-solicitud_id="${data}" 
                data-sol_cred_catalogo="${row.sol_cred_catalogo}" 
                data-sol_cred_correo="${row.sol_cred_correo}"  
                data-sol_cred_telefono="${row.sol_cred_telefono}" 
                data-sol_cred_fecha_solicitud="${row.sol_cred_fecha_solicitud}" 
                data-sol_cred_modulo="${row.sol_cred_modulo}" 
                data-sol_cred_justificacion="${row.sol_cred_justificacion}" 
                data-sol_cred_usuario="${row.sol_cred_usuario}" 
                data-sol_cred_estado_solicitud="${row.sol_cred_estado_solicitud}"><i class='bi bi-pencil-square'></i></button>
                
                <button class='btn btn-danger eliminar' data-solicitud_id="${data}"><i class="bi bi-trash3-fill"></i></i></button>
                <button class='btn btn-success verificar' 
                data-solicitud_id="${data}" 
                data-sol_cred_estado_solicitud="${row.sol_cred_estado_solicitud}"><i class='bi bi-pencil-square'></i>VERIFICAR</button>`
                
                return html;
            }
        },
    ]
});












<!-- <h2 class="text-center mb-4">Estado de Solicitudes</h2>
<div class="row">
    <div class="col table-responsive">
        <table class="table table-bordered table-hover w-100" id="tablaSolicitudes">
        </table>
    </div>
</div> -->