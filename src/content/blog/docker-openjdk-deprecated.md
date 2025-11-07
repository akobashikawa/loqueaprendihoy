---
title: OpenJDK deprecado en docker
description: Cómo solucionar la falta de openjdk
pubDate: 2025-11-07
heroImage: "@/assets/docker-openjdk-deprecated.png"
tags:
  - docker
  - openjdk
  - eclipse
  - temurin
  - deprecated
  - devops
---
*La imagen oficial `openjdk` (la que vive en `library/openjdk`) **ha sido deprecada (declarada obsoleta)**.*


## OpenJDK está deprecada

Docker Hub y la comunidad de Java han movido el mantenimiento de las imágenes de OpenJDK a los propios proveedores que compilan el JDK. La imagen genérica `openjdk` ya no recibe actualizaciones y, como estás viendo, sus etiquetas (tags) están empezando a ser eliminadas o ya no se pueden resolver.


## El problema

Cuando se requiera una imagen openjdk para hacer algún build, fallará, indicando algo como:

```
failed to solve: openjdk:17-jdk-slim: failed to resolve source metadata for docker.io/library/openjdk:17-jdk-slim: docker.io/library/openjdk:17-jdk-slim: not found
```


## La solución inmediata

La solución es cambiar tu imagen base por la que ahora se considera la sucesora estándar: **`eclipse-temurin`**. Esta imagen es mantenida por el proyecto Eclipse Adoptium (antes conocido como AdoptOpenJDK) y es un reemplazo directo.

Por ejemplo:

Antes:
```dockerfile
FROM openjdk:17-jdk-slim
```

Ahora:
```dockerfile
FROM eclipse-temurin:17-jdk-jammy
```

También se podría usar una imagen más ligera, como alpine, pero adaptando las diferencias que tiene con una distribución tipo debian:
```dockerfile
FROM eclipse-temurin:17-jdk-alpine
# adaptar cosas como apt-get por apk
```

## Links
- [Docker Deprecation Alert: Why You Should Use Eclipse-Temurin Instead of OpenJDK - YouTube](https://www.youtube.com/watch?v=DRXBR23Y7dU)