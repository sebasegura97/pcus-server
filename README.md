# pcus-server
Web server desarrollado con nodejs + apollo server para la gestion de un tramite denominado plan de cambio de uso de suelos.

## El stack tecnologico utilizado: 

* Base de datos: Mysql community server
* Framework de backend: Express + Apollo server 
* ORM: Sequelize

# DOCUMENTOS:

### 1. ADMINISTRACION DEL SISTEMA

#### USUARIOS

Existen 4 roles predefinidos en el sistema con privilegios predeterminados y no actualizables por el usuario de este software:

1. ADMINISTRADOR 
2. PROPONENTE 
3. CONTROL JURIDICO
4. CONTROL TECNICO

Se crearan inicialmente 4 usuarios en modo de prueba y solo 1 en produccion:

1. Administrador (prueba y produccion):   
    -> email: administrador@pcus.com   
    -> contraseña: 123456789   
2. Proponente (prueba):   
    -> email: proponente@pcus.com   
    -> contraseña: 123456789   
3. Control juridico (prueba):   
    -> email: control_juridico@pcus.com  
    -> contraseña: 123456789
4. Control técnico (prueba):  
    -> email: control_tecnico@pcus.com  
    -> contraseña: 123456789  

#### AUTENTICACION Y AUTORIZACION DE USUARIOS:

Cada usuario deberá completar un formulario con sus datos (email, nombre, apellido y contraseña) para registrarse. Nuevos usuarios seran siempre creados con el rol de "PROPONENTE", este valor solo podra ser cambiado por el/los administradores del sistema.

### 2. DICCIONARIO DE DATOS

#### 2.1 PROCEDURE

Un procedimiento o tramite inicia cuando un proponente ingresa los datos necesarios y, por lo tanto, solicita la habilitacion de un PCUS. Termina cuando se aprueba o rechaza la ejecucion del PCUS. 
Se almacenan todos los datos referentes al trámite que son ingresados por el usuario. Tambien, para cada campo almacena su estado y un mensaje.

##### 2.1.1 Estados

Cada procedimiento tiene un estado. Dicho estado puede variar. Los estados posibles son:
* INICIADO
* ESPERANDO CONTROL TECNICO
* ESPERANDO CONTROL JURIDICO
* REVISADO: El unico que puede ser contra-intuitivo. Este estadi indica que el procedimiento ha sido corregido por el proponente (luego de haber sido controlado por el personal jurídico o técnico).
* APROBADO
* RECHAZADO

#### 2.2 PROCEDURE REVIEW  

Una revision es realizada por un usuario sobre un trámite. Este usuario puede tener el rol de: CONTROL TÉCNICO, CONTROL JURIDICO o PROPONENTE. Los usuarios con el rol de ADMINISTRADOR no podran realizar revisiones sobre los trámites.
Una revisión puede consistir en:

1. Aprobar o rechazar los campos que el proponente ha completado previamente si quien realiza dicha revision tiene el rol de CONTROL TECNICO o CONTROL JURIDICO.

2. Corregir los datos previamente ingresados si quien realiza la revision es un PROPONENTE     .


