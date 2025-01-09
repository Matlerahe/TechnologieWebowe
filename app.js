document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.querySelector('.products');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalPriceEl = document.getElementById('total-price');
    const cartCountEl = document.getElementById('cart-count');

    function fetchProducts() {
        fetch('api/get_products.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Polaczenie nie udalo sie');
                }
                return response.json();
            })
            .then(products => {
                console.log(products);
                renderProducts(products);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania produktów:', error);
            });
    }

    function renderProducts(products) {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <img src="uploads/${product.image_url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${parseFloat(product.price).toFixed(2)} PLN</p>
                <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image_url="${product.image_url}">Dodaj do koszyka</button>
            `;
            productContainer.appendChild(productDiv);
        });

        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const name = e.target.getAttribute('data-name');
                const price = parseFloat(e.target.getAttribute('data-price'));
                const image_url = e.target.getAttribute('data-image_url');
                addToCart(id, name, price, image_url);
            });
        });
        updateCart();
    }

    function addToCart(id, name, price, image_url) {
        const product = { id, name, price, image_url };
        cartItems.push(product);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }

    function removeFromCart(id) {
        const index = cartItems.findIndex(item => item.id === id);
        if (index !== -1) {
            cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCart();
        }
    }


    function updateCart() {
        const cartListEl = document.getElementById('cart-items');
        const cartSummaryEl = document.getElementById('cart-summary');
        cartListEl.innerHTML = ''; 
        let total = 0;

        cartItems.forEach(item => {
            total += item.price;
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} - ${item.price.toFixed(2)} PLN
                <button class="remove-from-cart" data-id="${item.id}">Usuń</button>
            `;
            cartListEl.appendChild(li);
        });

        totalPriceEl.textContent = total.toFixed(2);
        cartCountEl.textContent = cartItems.length; 

        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                removeFromCart(productId);
            });
        });

        updateCartCount();
    }

    function updateCartCount() {
        cartCountEl.textContent = cartItems.length;
    }


    fetchProducts();
});
