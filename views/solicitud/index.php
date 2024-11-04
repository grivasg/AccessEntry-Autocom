<h1 class="text-center">Formulario de Solicitud de Usuario</h1>
<div class="row justify-content-center mb-4">
    <form id="formularioSolicitud" class="border shadow p-4 col-lg-10">
        <input type="hidden" name="solicitud_id" id="solicitud_id">
        <div class="row mb-3">
            <div class="col-md-6">
                <label for="sol_cred_catalogo" class="form-label">Catalogo</label>
                <input type="number" name="sol_cred_catalogo" id="sol_cred_catalogo" class="form-control">
            </div>
            <div class="col-md-6">
                <label for="sol_cred_correo" class="form-label">Correo Electronico</label>
                <input type="text" name="sol_cred_correo" id="sol_cred_correo" class="form-control">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-6">
                <label for="sol_cred_telefono" class="form-label">Telefono</label>
                <input type="text" name="sol_cred_telefono" id="sol_cred_telefono" class="form-control">
            </div>
            <div class="col-md-6">
                <label for="sol_cred_fecha_solicitud" class="form-label">Fecha de Solicitud</label>
                <input type="date" name="sol_cred_fecha_solicitud" id="sol_cred_fecha_solicitud" class="form-control">
            </div>
        </div>

        <div class="row text-center">
            <div class="col">
                <button type="submit" form="formularioSolicitud" id="btnGuardar" class="btn btn-primary w-100">Guardar</button>
            </div>
            <div class="col">
                <button type="button" id="btnModificar" class="btn btn-warning w-100">Modificar</button>
            </div>
            <div class="col">
                <button type="button" id="btnCancelar" class="btn btn-danger w-100">Cancelar</button>
            </div>
        </div>
    </form>
</div>
<h2 class="text-center mb-4">Solicitudes Recibidas</h2>
<div class="row">
    <div class="col table-responsive">
        <table class="table table-bordered table-hover w-100" id="tablaSolicitudes">
        </table>
    </div>
</div>
<script src="<?= asset('./build/js/solicitud/index.js') ?>"></script>
