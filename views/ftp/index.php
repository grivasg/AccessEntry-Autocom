<h1 class="text-center">Formulario de archivos</h1>
<div class="row justify-content-center">
    <form class="col-lg-4 bg-light border p-4 shadow" enctype="multipart/form-data" id="formArchivo">
        <div class="row mb-3">
            <div class="col">
                <label for="archivo">Archivo</label>
                <input accept=".pdf" type="file" name="archivo" id="archivo" class="form-control">
            </div>
        </div>
        <div class="row">
            <div class="col"><button type="submit" class="btn btn-primary w-100">Cargar</button></div>
        </div>
    </form>
</div>
<script src="<?= asset('./build/js/ftp/index.js') ?>"></script>
