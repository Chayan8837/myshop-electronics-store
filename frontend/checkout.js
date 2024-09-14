document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();
    getAddress();

    const paymentForm = document.getElementById('payment-form');
    const qrCodeDiv = document.getElementById('qr-code');
    const qrCodeElement = document.getElementById('qrcode');
    const addressInfo = document.getElementById('address-info');

    paymentForm.addEventListener('change', (event) => {
        if (event.target.value === 'online') {
            qrCodeDiv.style.display = 'block';
            const orderId = 'ORD' + Math.floor(Math.random() * 1000000);
            const paymentUrl = `http://localhost:3000/accept-payment?orderId=${orderId}`;
            generateQRCode(qrCodeElement, paymentUrl);
        } else {
            qrCodeDiv.style.display = 'none';
        }
    });

    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const orderId = 'ORD' + Math.floor(Math.random() * 1000000);

        const orderData = {
            user:localStorage.getItem('user'),
            orderId: orderId,
            address: addressInfo.textContent.trim().replace(/\s+/g, ' '),
            cartItems: getCartItems(),
            paymentMethod: selectedPaymentMethod,
        };
        console.log('Order Data:', orderData);

        // Calculate delivery date (7 days from today)
        const currentDate = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(currentDate.getDate() + 7);
        const deliveryDateString = deliveryDate.toDateString();

        // Hide the cart and other elements
        const cartDiv = document.querySelector('.cart');
        cartDiv.style.display = 'none';

        // Create and display the order success message with animation
        const successMessage = document.createElement('div');
        successMessage.classList.add('order-success');
        successMessage.innerHTML = `
            <h2>Order Placed Successfully</h2>
            <p>Your Order ID: <strong>${orderId}</strong></p>
            <p>Estimated Delivery Date: <strong>${deliveryDateString}</strong></p>
            <div class="animation">🎉</div>
            <button id="shop-more">Shop More</button>
        `;
        document.body.appendChild(successMessage);

        // Add event listener to "Shop More" button
        document.querySelector('#shop-more').addEventListener('click', () => {
            window.location.href = 'shop.html'; // Redirect to shop page
        });

        // Add some animation for the success message
        const animationElement = document.querySelector('.animation');
        animationElement.style.fontSize = '50px';
        animationElement.style.animation = 'bounce 2s infinite';
    });
});

function generateQRCode(element, data) {
    new QRCode(element, {
        text: data,
        width: 400,
        height: 400
    });
}

async function fetchCartItems() {
    const cartList = document.querySelector('.cart');
    cartList.classList.add('hide');
    const cartnot = document.querySelector('.cart-not');

    try {
        const user = localStorage.getItem('user');
        if (!user) {
            throw new Error('User not found in localStorage');
        }
        const response = await fetch(`http://localhost:3000/cart/${user}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }
        const cart = await response.json();
        
        if (!cart.products || cart.products.length === 0) {
            cartList.classList.add('hide');
            cartnot.classList.remove('hide');
        } else {
            displayCartItems(cart.products);
            updateCartSummary(cart.products);
            cartList.classList.remove('hide');
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
        cartList.classList.add('hide');
        cartnot.classList.remove('hide');
    }
}

function displayCartItems(products) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    if (!products || products.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5">No items in cart</td></tr>';
        return;
    }

    products.forEach(product => {
        const cartItem = document.createElement('tr');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" class="cart-item-image"></td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>₹${product.newPrice}</td>
            <td>${product.quantity}</td>
        `;

        cartItemsContainer.appendChild(cartItem);
    });
}

function sanitizePrice(price) {
    return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
}

function updateCartSummary(products) {
    const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);
    const totalOldPrice = products.reduce((total, product) => total + (sanitizePrice(product.oldPrice) * product.quantity), 0);
    const totalNewPrice = products.reduce((total, product) => total + (sanitizePrice(product.newPrice) * product.quantity), 0);

    document.getElementById('total-quantity').innerText = totalQuantity;
    document.getElementById('price').innerText = totalOldPrice.toFixed(2);
    document.getElementById('discount').innerText = (totalOldPrice - totalNewPrice).toFixed(2);
    document.getElementById('totalAmount').innerText = totalNewPrice.toFixed(2);
}

async function getAddress() {
    const user = localStorage.getItem('user');
    const addspace = document.getElementById('address-info');
    try {
        const response = await fetch(`http://localhost:3000/get-address/${user}`);
        const result = await response.json();
        if (response.ok) {
            addspace.innerText = `${result.name} ${result.phone}, ${result.street}, ${result.city}, ${result.state}, ${result.zip}`;
        } else {
            console.log('Address not found or error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function getCartItems() {
    const cartItems = [];
    const rows = document.querySelectorAll('#cart-items tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cartItems.push({
            image: cells[0].innerHTML,
            name: cells[1].textContent,
            description: cells[2].textContent,
            price: cells[3].textContent,
            quantity: cells[4].textContent,
        });
    });

    return cartItems;
}
