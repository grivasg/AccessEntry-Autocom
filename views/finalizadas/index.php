<h1 class="text-center">Historial de Envíos de Credenciales</h1>
<div class="row justify-content-center mb-4">
    <form id="formularioAlumnos" class="border shadow p-4 col-lg-10">
        <input type="hidden" name="busqueda_id" id="busqueda_id">
        <div class="row mb-3">
            <div class="col-md-6">
                <label for="busqueda_1" class="form-label">Primer Rango de Busqueda</label>
                <input type="date" name="busqueda_1" id="busqueda_1" class="form-control">
            </div>
            <div class="col-md-6">
                <label for="busqueda_2" class="form-label">Segundo Rango de Busqueda</label>
                <input type="date" name="busqueda_2" id="busqueda_2" class="form-control">
            </div>
        </div>

        <div class="row text-center">
            <div class="col">
                <button type="button" id="btnBuscar" class="btn btn-success w-100">Buscar</button>
            </div>
            <div class="col">
                <button type="button" id="btnCancelar" class="btn btn-danger w-100">Cancelar</button>
            </div>
        </div>
    </form>
</div>

<h2 class="text-center mb-4">Solicitues Encontradas</h2>
<div class="row">
    <div class="col table-responsive">
        <table class="table table-bordered table-hover w-100" id="tablaFinalizadas">
        </table>
    </div>
</div>




<script src="<?= asset('./build/js/finalizadas/index.js') ?>"></script>