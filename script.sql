CREATE TABLE solicitud_credenciales  ( 
	solicitud_id                       	SERIAL NOT NULL,
	sol_cred_catalogo                  	INTEGER NOT NULL,
	sol_cred_correo                    	VARCHAR(100),
	sol_cred_telefono                  	VARCHAR(15),
	sol_cred_modulo                    	VARCHAR(255),
	sol_cred_justificacion             	VARCHAR(255),
	sol_cred_fecha_solicitud           	DATE,
	sol_cred_usuario                   	VARCHAR(2),
	sol_cred_estado_solicitud          	INTEGER,
	sol_cred_modulos_autorizados       	VARCHAR(255),
	sol_cred_justificacion_autorizacion	VARCHAR(255),
	PRIMARY KEY(solicitud_id)
	ENABLED
)


CREATE TABLE passwords_temp  ( 
	pass_id            	SERIAL NOT NULL,
	pass_solicitud_id  	INTEGER NOT NULL,
	password_encriptada	VARCHAR(255) NOT NULL,
	pass_token         	VARCHAR(255) NOT NULL,
	encryption_key     	VARCHAR(255) NOT NULL,
	pass_fecha_creacion	DATE,
	PRIMARY KEY(pass_id)
	ENABLED
)


CREATE TABLE historial_credenciales  ( 
	envio_id                  	SERIAL NOT NULL,
	his_cred_solicitud_id     	INTEGER NOT NULL,
	his_cred_fecha_envio      	DATETIME YEAR to SECOND,
	his_cred_metodo_envio     	VARCHAR(50),
	his_cred_responsable_envio	INTEGER,
	his_cred_destinatario     	VARCHAR(100),
	his_cred_observaciones    	TEXT 
	)


CREATE TABLE estado_credenciales  ( 
	estado_cred_id    	SERIAL NOT NULL,
	estado_cred_nombre	VARCHAR(50),
	PRIMARY KEY(estado_cred_id)
	ENABLED
)
