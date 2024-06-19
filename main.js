const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const TarjetaProducto = (producto) => {
    const ContenedorProductos = document.getElementById("ContenedorProductos");
    if (ContenedorProductos) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";
        tarjeta.id = producto.id;
        tarjeta.innerHTML = `
            <h3>${producto.titulo}</h3>
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <p>${producto.descripcion}</p>
            <span>$${producto.precio.toFixed(2)}</span>
            <input class="cantidad" type="number" max="${producto.stock}" min="1" value="1">
            <button class="btn-agregar-carrito">Agregar al Carrito</button>
        `;
        ContenedorProductos.append(tarjeta);
    }
}

const TarjetaProductoCarrito = (producto) => {
    const CarritoProductos = document.getElementById("CarritoProductos");
    if (CarritoProductos) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";
        tarjeta.id = producto.id;
        const precioTotal = (producto.precio * producto.cantidad).toFixed(2);
        tarjeta.innerHTML = `
            <h3>${producto.titulo}</h3>
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <p>${producto.descripcion}</p>
            <span>Precio unitario: $${producto.precio.toFixed(2)}</span>
            <span>Cantidad: ${producto.cantidad}</span>
            <span>Precio total: $${precioTotal}</span>
            <button class="btn-eliminar-producto-carrito">Eliminar</button>
            <button class="btn-comprar">Comprar</button>
        `;
        CarritoProductos.append(tarjeta);
    }
}

const traerProductos = async () => {
    try {
        const respuesta = await fetch("./productos.json");
        const productos = await respuesta.json();
        productos.forEach(producto => {
            TarjetaProducto(producto);
        });
        return productos;
    } catch (error) {
    }
}

const agregarProductoCarrito = (productos) => {
    const ContenedorProductos = document.getElementById("ContenedorProductos");
    if (ContenedorProductos) {
        ContenedorProductos.addEventListener("click", (event) => {
            if (event.target && event.target.classList.contains("btn-agregar-carrito")) {
                const parentElement = event.target.parentElement;
                const id = parentElement.id;
                const cantidad = parseInt(parentElement.getElementsByClassName("cantidad")[0].value);
                const producto = productos.find(producto => producto.id == id);

                if (cantidad > producto.stock) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No puedes agregar más del stock disponible',
                    });
                } else if (cantidad < 1) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Debes agregar al menos un producto',
                    });
                } else {
                    carrito.push({ ...producto, cantidad });
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    Swal.fire({
                        icon: 'success',
                        title: 'Agregado al carrito',
                        showConfirmButton: false,
                        timer: 800
                    });
                    mostrarTotalCarrito();
                }
            }
        });
    }
}

const eliminarProductoCarrito = () => {
    const CarritoProductos = document.getElementById("CarritoProductos");
    if (CarritoProductos) {
        CarritoProductos.addEventListener("click", (event) => {
            if (event.target && event.target.classList.contains("btn-eliminar-producto-carrito")) {
                const parentElement = event.target.parentElement;
                const id = parentElement.id;
                const index = carrito.findIndex(producto => producto.id == id);
                if (index !== -1) {
                    carrito.splice(index, 1);
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    parentElement.remove();
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado del carrito',
                        showConfirmButton: false,
                        timer: 800
                    });
                    mostrarTotalCarrito();
                }
            }
        });
    }
}

const verCarrito = () => {
    const CarritoProductos = document.getElementById("CarritoProductos");
    if (CarritoProductos) {
        carrito.forEach(producto => {
            TarjetaProductoCarrito(producto);
        });
        mostrarTotalCarrito();
        eliminarProductoCarrito();
    }
}

const mostrarTotalCarrito = () => {
    const totalCarrito = document.getElementById("totalCarrito");
    if (totalCarrito) {
        const total = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
        totalCarrito.innerHTML = `Total del carrito: $${total.toFixed(2)}`;
    }
}

const principal = async () => {
    const productos = await traerProductos();
    agregarProductoCarrito(productos);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("ContenedorProductos")) {
        principal();
    } else if (document.getElementById("CarritoProductos")) {
        verCarrito();
    }
});
