# IBM-Kubernetes-Service-PostgreSQL-LAB
Ejercicio con Aplicación en Angular en NodeJS base de datos PostgreSQL

# Estructura de la aplicación

Se tiene una aplicación construida para realizar el CRUD del registro de peliculas, como lo son su identificador ID, el titulo, una descripcion, su director y el año en la cual fue el estreno de la misma; En la parte del cliente esta construida con Angular_Js y por la parte del servidor Node_Js, con un almacenamiento en la base de datos relacional Postgresql.

![Arquitectura Postgresql](https://user-images.githubusercontent.com/40369712/69654066-30277680-1042-11ea-99d7-7cb1d1b98ca1.jpg)


A continuación se presenta un Hands on para realizar el despliegue de esta aplicación Node.js en kubernetes.

## Índice

* Prerrequisitos.
* Correr imagen localmente.
* Despliegue imagen en el clúster de kubernetes creado previamente.
* Verificación del despliegue de la imagen.
* Referencias.

## Prerrequisitos

* Tener creada una aplicación de node.js.
* Tener un clúster aprovisionado y configurado correctamente.
* Debe tener el Dockerfile de la aplicación, para realizar la habilitación de la aplicación de node.js para el correcto despliegue en la nube y su respectiva creación del Dockerfile se puede dirigir al siguiente enlace: https://cloud.ibm.com/docs/node?topic=nodejs-enable_existing&locale=es 

## Correr imagen localmente

Para poder correr la imagen localmente, primero debe descargar o clonar el Git, luego debe abrir en la terminal la carpeta del proyecto que descargo del Git y descomprimió.

![image](https://user-images.githubusercontent.com/40369712/69812571-64c03d00-11be-11ea-90df-bbcd1cbc5a50.png)

Luego debe abrir la terminal en la carpeta y copiar la ruta de la misma, e iniciar sesión en consola como super usuario, a continuación, vera el código de cómo acceder como super usuario a la carpeta.

```
sudo –i
cd ..
cd  home/user/<Ruta del proyecto>
```
![image](https://user-images.githubusercontent.com/40369712/69813100-866df400-11bf-11ea-944d-80d8b27465a5.png)
`Nota: En el recuadro amarillo está el usuario correspondiente a su máquina.`

Luego usted debe crear la imagen Docker con el Docker local, para realizar esta acción debe ejecutar el siguiente comando tal cual como esta sin omitir puntos ni nada, lo único que debe modificar es el espacio donde esta el nombre de la imagen por el nombre que usted desee asignar, para esto si debe quitar los símbolos de mayor y menor.

```
docker build -t <Nombre de la imagen> .
Ejemplo: docker build -t appnode .
```

Después de ejecutar el comando le aparecerán varios datos de la compilación del comando, pero debe estar pendiente de que al final de todo pueda ver lo siguiente que es la confirmación de la creación de la imagen, donde vera primero el ID y luego la etiqueta de la imagen.

<img width="500" height="50" src=https://user-images.githubusercontent.com/40369712/69813423-2f1c5380-11c0-11ea-8988-2ca48434064c.png>

Luego usted debe verificar que se ha creado la imagen Docker eso lo realiza con el siguiente comando.

```
docker images
```

Luego debe correr la imagen docker que se previamente creo, para esto debe ejecutar el siguiente comando, donde debe modificar el puerto de salida, el puerto de entrada y el nombre de la imagen. 

`Nota: El puerto está en el 3000 por defecto, pero si usted desea que se realice a otro puerto debe realizar el mapeo sobre el puerto al que quiere exponer la aplicación, en este caso se mapeo para exponer la aplicación en el puerto 8000.`

```
docker run -p <Port de salida>:<Port de entrada> -d <nombre de la imagen>
Ejemplo: docker run -p 8000:3000 -d appnode
```

<img width="700" alt="4" src="https://user-images.githubusercontent.com/40369712/69813896-24ae8980-11c1-11ea-8d58-29fb6354b847.png">

Luego puede verificar el despliegue en el localhost:8000, el localhost depende del que usted asigno para su aplicación, en este caso es el 8000, para verificar en su navegador ingrese localhost:8000 y podrá ver su aplicación como se ve a continuación.

<img width="928" alt="Recorte2" src="https://user-images.githubusercontent.com/40369712/69816694-e4520a00-11c6-11ea-80fa-871840e59884.png">

## Creacion y despliegue de una imagen en el clúster de kubernetes creado previamente

Para realizar el despliegue de la aplicación correctamente, primero debe configurar el espacio de trabajo como se ve a continuación (region, grupo de recurso y cluster).


Inicio de sesion en la consola de IBM Cloud en la region y el grupo de recursos del cluster

```
ibmcloud login -a cloud.ibm.com -r <region> -g <grupo de recursos>
Ejemplo: ibmcloud login -a cloud.ibm.com -r us-east -g app-demo
```

Inicio de sesion en IBM Cloud Container Registry

```
ibmcloud cr login
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
<img width="500" height="150" alt="7" src="https://user-images.githubusercontent.com/40369712/69817031-a86b7480-11c7-11ea-8d8f-bb69f37a1745.png">

Luego debe hacer el push de la imagen local que se ha creado anteriormente, para esto es necesario renombrar la imagen docker con el formato neceario para hacer el push, para esto desde la linea de comando ejecutamos el siguiente comando.

```
docker tag <source_image>:<tag> <region>.icr.io/<my_namespace>/<new_image_repo>:<new_tag>
Ejemplo: docker tag postgresqlapp us.icr.io/pruebanamespace/postgresqlapp
```
para verifiacr que la imagen tenga el nuevo tag, puede ejecutar el siguiente comando.
```
docker images
```
![image](https://user-images.githubusercontent.com/40369712/69827008-9992bb00-11e3-11ea-92c6-17df458641f3.png)

Una vez renombrada la imagen, ya puede relizar el push de la imagen en el Container Registry

```
docker push <region>.icr.io/<my_namespace>/<image_repo>:<tag>
Ejemplo:    docker push us.icr.io/pruebanamespace/postgresqlapp
```
![image](https://user-images.githubusercontent.com/40369712/69827093-f68e7100-11e3-11ea-91f8-ca74554cd465.png)

Para verificar que la imagen locar se haya cargado correctamente ejecutamos el siguiente comando.

```
ibmcloud cr image-list
```
![image](https://user-images.githubusercontent.com/40369712/69827293-b4b1fa80-11e4-11ea-9a6c-6a7d3558a4b4.png)

Despues de eso debe crear el servicio del despliegue en kubernetes para realizar eso ejecutara los siguientes comandos y para verificar que se realizo correctamente vera la siguiente imagen.

```
kubectl create deployment <nombreimagen> --image=us.icr.io/<manespace>/<nombreimagen> 
Ejemplo: kubectl create deployment postgresqlapp --image=us.icr.io/pruebanamespace/postgresqlapp
```

<img width="900" height="30" alt="9" src="https://user-images.githubusercontent.com/40369712/69827480-a57f7c80-11e5-11ea-9d20-1eeb21a85096.png">

Luego usted debe exponer la imagen docker en el puerto que configuro.

```
kubectl expose deployment/<nombreimagen> --type=NodePort --port=<Port entrada>
Ejemplo: kubectl expose deployment/postgresqlapp --type=NodePort --port=3000
```

<img width="900" height="30" alt="10" src="https://user-images.githubusercontent.com/40369712/69827551-d2339400-11e5-11ea-9f76-270d9a596d6f.png">


## Verificación del despliegue de la imagen.

Para verificar el despliegue de la imagen usted primero debe verificar el nombre de su cluster, eso lo puede hacer con el siguiente comando.

```
ibmcloud cs clusters
```

<img width="700" alt="11" src="https://user-images.githubusercontent.com/40369712/69827624-29396900-11e6-11ea-8326-a3e5587869a4.png">

Despues debe tomar nota de la ip publica del cluster ejecutando el siguiente comando.

```
ibmcloud cs workers <nombre del cluster>
Ejemplo: ibmcloud cs workers iks-demo
```

<img width="700" alt="12" src="https://user-images.githubusercontent.com/40369712/69827689-70bff500-11e6-11ea-886a-2344f905a67f.png">

Luego debe verificar el nombre del servicio que se ha creado, esta acción la puede realizar ejecutando el siguiente comando. 

```
kubectl get services
```

<img width="500" height="100" alt="13" src="https://user-images.githubusercontent.com/40369712/69827737-a82ea180-11e6-11ea-9905-0f4dd0151bf6.png">

Verifique en su navegador la aplicación en la dirección como vera a continuación: 

```
<IP publica>:<NodePort>
169.47.168.98:31832
```

![image](https://user-images.githubusercontent.com/40369712/69827791-f348b480-11e6-11ea-9825-d7e1d07b8a3f.png)

## Referencias

* Habilitar aplicaciones Node.js existentes para despliegue en la nube
      https://cloud.ibm.com/docs/node?topic=nodejs-enable_existing&locale=es
* Contenerizar una aplicacion web Node.js
      https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
* Instalacion de docker en SO Ubuntu
      https://docs.docker.com/install/linux/docker-ce/ubuntu/
* Iniciación a IBM Cloud Container Registry
      https://cloud.ibm.com/docs/Registry?topic=registry-getting-started
