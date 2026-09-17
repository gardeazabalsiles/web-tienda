# Recursos públicos de Tu Tienda Moda

Esta carpeta contiene recursos estáticos que Vite sirve directamente desde la raíz del sitio. Organiza aquí imágenes y otros archivos que la interfaz necesite mostrar sin importarlos desde `src`.

## Organización actual

- `imagenes/`: contiene recursos gráficos existentes, como la ilustración `hero-woman.svg`. Conserva aquí los recursos que ya utiliza la página.
- `images/`: carpeta de imágenes preparada para recursos visuales adicionales.
- `images/productos/`: espacio reservado para imágenes de prendas y productos que se incorporen al proyecto.

## Recomendaciones para agregar imágenes

1. Mantén los nombres de archivo claros, descriptivos y sin espacios.
2. Conserva las imágenes de productos dentro de `images/productos/` para mantenerlas localizables.
3. No elimines ni renombres recursos existentes sin comprobar primero dónde se utilizan en el código.
4. Ajusta el tamaño y el recorte visual desde los estilos CSS correspondientes; evita modificar el diseño global solo por agregar una imagen.
5. Los archivos `.gitkeep` permiten conservar carpetas vacías en Git. No es necesario borrarlos mientras la carpeta no tenga otros archivos.

## Nota

Este documento solo describe la organización de los recursos públicos. No cambia componentes, estilos, rutas ni el diseño visual de la aplicación.
