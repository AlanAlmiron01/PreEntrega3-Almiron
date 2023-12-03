document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('product-list');
    const cart = document.getElementById('cart');
    const totalSpan = document.getElementById('total');
    const clearCartButton = document.getElementById('clear-cart');

    // Manejar clic en productos para agregar o eliminar del carrito
    productList.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            const isInCart = event.target.classList.contains('in-cart');
            if (isInCart) {
                removeFromCart(event.target);
            } else {
                addToCart(event.target);
            }
        }
    });

    // Manejar clic en el botón de vaciar carrito
    clearCartButton.addEventListener('click', function () {
        clearCart();
    });

    // Función para agregar elementos al carrito
    function addToCart(product) {
        const productId = product.dataset.id;
        const productName = product.dataset.name;
        const productPrice = parseFloat(product.dataset.price);

        const cartItem = document.createElement('li');
        cartItem.textContent = `${productName} - $${productPrice}`;
        cartItem.dataset.id = productId;
        cartItem.classList.add('in-cart');
        cart.appendChild(cartItem);

        // Actualizar el total
        updateTotal(productPrice);

        // Almacenar en el Storage
        saveToStorage(productId, productName, productPrice);
    }

    // Función para eliminar elementos del carrito
    function removeFromCart(cartItem) {
        const productId = cartItem.dataset.id;
        const productPrice = parseFloat(cartItem.textContent.split('$')[1]);

        // Eliminar del DOM
        cartItem.remove();

        // Actualizar el total
        updateTotal(-productPrice);

        // Eliminar del Storage
        removeFromStorage(productId);
    }

    // Función para actualizar el total
    function updateTotal(price) {
        let currentTotal = parseFloat(totalSpan.textContent) || 0;
        const newTotal = currentTotal + price;
        totalSpan.textContent = newTotal.toFixed(2); // Mostrar dos decimales
    }

    // Función para almacenar en el Storage
    function saveToStorage(id, name, price) {
        const cartItem = { id, name, price };
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // Función para eliminar del Storage
    function removeFromStorage(id) {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems = cartItems.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // Función para vaciar el carrito
    function clearCart() {
        cart.innerHTML = '';
        totalSpan.textContent = '0';
        localStorage.removeItem('cart');
    }

    // Cargar productos del Storage al cargar la página
    function loadCartFromStorage() {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.textContent = `${item.name} - $${item.price}`;
            cartItem.dataset.id = item.id;
            cartItem.classList.add('in-cart');
            cart.appendChild(cartItem);
            updateTotal(item.price);
        });
    }

    // Cargar productos del Storage al cargar la página
    loadCartFromStorage();
});