# IBM-Kubernetes-Service-PostgreSQL-LAB
Ejercicio con Aplicación en Angular en NodeJS base de datos PostgreSQL

# Estructura de la aplicación

Se tiene una aplicación construida para realizar el CRUD de los datos correspondientes a peliculas, como lo son su identificador ID, el titulo, una descripcion, su director y el año en la cual fue el estreno de la misma; En la parte del cliente esta construida con Angular_Js y por la parte del servidor Node_Js, con un almacenamiento en la base de datos relacional Postgresql.

![Arquitectura Postgresql](https://user-images.githubusercontent.com/40369712/69654066-30277680-1042-11ea-99d7-7cb1d1b98ca1.jpg)


A continuación se presenta un Hands on para realizar el despliegue de esta aplicación Node.js en kubernetes.

## Índice

* Prerrequisitos.
* Correr imagen localmente.
* Despliegue imagen en el clúster de kubernetes creado previamente.
* Verificación del despliegue de la imagen.
* Referencias.

## Requisitos previos

* Tener creada una aplicación de node.js.
* Tener un clúster aprovisionado y configurado correctamente.
* Debe tener el Dockerfile de la aplicación, para realizar la habilitación de la aplicación de node.js para el correcto despliegue en la nube y su respectiva creación del Dockerfile se puede dirigir al siguiente enlace: https://cloud.ibm.com/docs/node?topic=nodejs-enable_existing&locale=es 

## Correr imagen localmente

Para poder correr la imagen localmente, primero debe descargar o clonar el Git, luego debe abrir en la terminal la carpeta del proyecto que descargo del Git y descomprimió.

Luego debe abrir la terminal en la carpeta y copiar la ruta de la misma, e iniciar sesión en consola como super usuario, a continuación, vera el código de cómo acceder como super usuario a la carpeta.

<img width="927" alt="Recorte1" src="https://user-images.githubusercontent.com/40369712/68488077-4ba51b80-0212-11ea-8703-0189f18b7195.png">

```
sudo –i
cd ..
cd  home/user/<Ruta del proyecto>
```
<img width="500" alt="2" src="https://user-images.githubusercontent.com/50923637/68408076-b5f68700-0152-11ea-9283-a4583fd0b55d.png">

`Nota: En el recuadro amarillo está el usuario correspondiente a su máquina.`

Luego usted debe crear la imagen Docker con el Docker local, para realizar esta acción debe ejecutar el siguiente comando tal cual como esta sin omitir puntos ni nada, lo único que debe modificar es el espacio donde esta el nombre de la imagen por el nombre que usted desee asignar, para esto si debe quitar los símbolos de mayor y menor.

```
docker build -t <Nombre de la imagen> .
Ejemplo: docker build -t appnode .
```

Después de ejecutar el comando le aparecerán varios datos de la compilación del comando, pero debe estar pendiente de que al final de todo pueda ver lo siguiente que es la confirmación de la creación de la imagen, donde vera primero el ID y luego la etiqueta de la imagen.

<img width="500" height="50" alt="3" src="https://user-images.githubusercontent.com/50923637/68408681-cbb87c00-0153-11ea-8ec3-47666ce80af8.png">

Luego usted debe verificar que se ha creado la imagen Docker eso lo realiza con el siguiente comando.

```
docker 	images
```

Luego debe correr la imagen docker que se previamente creo, para esto debe ejecutar el siguiente comando, donde debe modificar el puerto de salida, el puerto de entrada y el nombre de la imagen. 

`Nota: El puerto está en el 3000 por defecto, pero si usted desea que se realice a otro puerto debe realizar el mapeo sobre el puerto al que quiere exponer la aplicación, en este caso se mapeo para exponer la aplicación en el puerto 8000.`

```
docker 	run -p <Port de salida>:<Port de entrada> -d <nombre de la imagen>
Ejemplo: docker 	run -p 8000:3000 -d appnode
```

<img width="700" alt="4" src="https://user-images.githubusercontent.com/50923637/68409894-e5f35980-0155-11ea-870e-f6b3e7edc736.png">

Luego puede verificar el despliegue en el localhost:8000, el localhost depende del que usted asigno para su aplicación, en este caso es el 8000, para verificar en su navegador ingrese localhost:8000 y podrá ver su aplicación como se ve a continuación.

<img width="928" alt="Recorte2" src="https://user-images.githubusercontent.com/40369712/68488783-cc184c00-0213-11ea-9031-32f72eb25498.png">

## Creacion y despliegue de una imagen en el clúster de kubernetes creado previamente

Para realizar el despliegue de la aplicación correctamente, primero debe configurar el espacio de trabajo como se ve a continuación (region, grupo de recurso y cluster).


Inicio de sesion en la consola de IBM Cloud en la region y el grupo de recursos del cluster

```
ibmcloud login -a cloud.ibm.com -r <region> -g <grupo de recursos>
Ejemplo: ibmcloud login -a cloud.ibm.com -r us-east -g app-demo
```

Descarga de los archivos de configuracion para el cluster

```
ibmcloud ks cluster config --cluster <ID_Cluster>
Ejemplo: ibmcloud ks cluster config --cluster bl1gdkaw09sj8dmer1cg
```


Luego de realizar el paso anterior usted debe crear el namespace donde alojara su aplicación, para hacer eso usted debe ejecutar el siguiente comando en su terminal.

```
ibmcloud cr namespace-add <my_namespace>

Ejemplo: ibmcloud cr namespace-add pruebanamespace
```
<img width="500" height="150" alt="7" src="https://user-images.githubusercontent.com/50923637/68423795-bbfb6080-0170-11ea-84d4-e631ddbbebc7.png">

Luego debe crear la imagen docker en el container register de IBM Cloud, para realizar esta acción debe ejecutar los siguientes comandos y podrá ver lo que aparece en la siguiente imagen, donde aparecen todos los namespaces que tenga creados.

```
ibmcloud cr build --tag us.icr.io/<namespace>/<nombre de la imagen> .
Ejemplo: ibmcloud cr build --tag us.icr.io/pruebanamespace/appnodemongos .
ibmcloud cr namespace-list
```

<img width="500" alt="8" src="https://user-images.githubusercontent.com/50923637/68424929-067ddc80-0173-11ea-9705-d2ed048abd72.png">

Despues de eso debe crear el servicio del despliegue en kubernetes para realizar eso ejecutara los siguientes comandos y para verificar que se realizo correctamente vera la siguiente imagen.

```
kubectl create deployment <nombreimagen> --image=us.icr.io/<manespace>/<nombreimagen> 
Ejemplo: kubectl create deployment appnodemongos --image=us.icr.io/pruebanamespace/appnodemongos
```

<img width="900" height="30" alt="9" src="https://user-images.githubusercontent.com/50923637/68425142-768c6280-0173-11ea-8b9c-c55af3cca981.png">

Luego usted debe exponer la imagen docker en el puerto que configuro.

```
kubectl expose deployment/<nombreimagen> --type=NodePort --port=<Port entrada>
Ejemplo: kubectl expose deployment/appnodemongos --type=NodePort --port=3000
```

<img width="900" height="30" alt="10" src="https://user-images.githubusercontent.com/50923637/68425518-409bae00-0174-11ea-9ff3-2453eb3cc566.png">


## Verificación del despliegue de la imagen.

Para verificar el despliegue de la imagen usted primero debe verificar el nombre de su cluster, eso lo puede hacer con el siguiente comando.

```
ibmcloud cs clusters
```

<img width="700" alt="11" src="https://user-images.githubusercontent.com/50923637/68425917-07177280-0175-11ea-8739-bb5635dbd58a.png">

Despues debe tomar nota de la ip publica del cluster ejecutando el siguiente comando.

```
ibmcloud cs workers <nombre del cluster>
Ejemplo: ibmcloud cs workers iks-demo
```

<img width="700" alt="12" src="https://user-images.githubusercontent.com/50923637/68426065-5493df80-0175-11ea-86ba-9b9b3e96063c.png">

Luego debe verificar el nombre del servicio que se ha creado, esta acción la puede realizar ejecutando el siguiente comando. 

```
kubectl get services
```

<img width="500" height="100" alt="13" src="https://user-images.githubusercontent.com/50923637/68426247-b3f1ef80-0175-11ea-84c4-3118a0cc3daf.png">

Verifique en su navegador la aplicación en la dirección como vera a continuación: 

```
<IP publica>:<NodePort>
169.47.168.98:30925
```

<img width="500" alt="13" src="https://user-images.githubusercontent.com/50923637/68426378-016e5c80-0176-11ea-9700-2dcfc4c10be1.png">

## Referencias

* Habilitar aplicaciones Node.js existentes para despliegue en la nube
      https://cloud.ibm.com/docs/node?topic=nodejs-enable_existing&locale=es
* Contenerizar una aplicacion web Node.js
      https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
* Instalacion de docker en SO Ubuntu
      https://docs.docker.com/install/linux/docker-ce/ubuntu/
