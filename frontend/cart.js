document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();
    getAddress();
});

async function fetchCartItems() {
    const cartList = document.querySelector('.cart');
    cartList.classList.add('hide');
    const cartnot = document.querySelector('.cart-hide');

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
        } else {
            displayCartItems(cart.products);
            updateCartSummary(cart.products);
            hideCart(cart.products);
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
    document.getElementById('oldprice').innerText = totalOldPrice.toFixed(2);
    document.getElementById('newprice').innerText = totalNewPrice.toFixed(2);

}

function hideCart(products) {
    const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);
    const cartList = document.querySelector('.cart');
    
    if (totalQuantity === 0) {
        cartList.classList.add('hide');
    } else {
        cartList.classList.remove('hide');
    }
}

function checkout() {
    alert('Proceed to checkout');
    window.location.href="checkout.html";
}

document.querySelector(".checkout-button").addEventListener("click",()=>{
   checkout()
})




import products from '../frontend/product.js';
hide();
function hide(){
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.style.display = 'none';


}

function homeshowSuggestions(searchTerm) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    if (searchTerm.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const suggestions = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    }).slice(0, 5);

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = suggestion.name;
        suggestionItem.addEventListener('click', () => {
            document.getElementById('home-search').value = suggestion.name;
            localStorage.setItem('searchQuery', suggestion.name);
            window.location.href = 'shop.html';
        });
        suggestionsContainer.appendChild(suggestionItem);
    });

    if (suggestions.length > 0) {
        suggestionsContainer.style.display = 'block';
        console.log(suggestions.length);
        
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

document.getElementById('home-search').addEventListener('input', (event) => {
    const query = event.target.value;
    homeshowSuggestions(query);
});

document.getElementById('home-search-button').addEventListener('click', () => {
    const query = document.getElementById('home-search').value;
    localStorage.setItem('searchQuery', query);
    window.location.href = 'shop.html';
});


document.getElementById('add-address-btn').addEventListener('click', function() {
    window.location.href = 'address.html'; // Replace with your actual page URL
});


async function getAddress() {
    const user = localStorage.getItem('user');
    const addspace = document.getElementById('address-info');
    try {
        const response = await fetch(`http://localhost:3000/get-address/${user}`);
        const result = await response.json();
        if (response.ok) {
            document.getElementById('add-address-btn').style.display = 'none';
            addspace.innerText = `
                ${result.name}
                ${result.phone}, ${result.street}, ${result.city}, ${result.state}, ${result.zip}
            `;
        } else {
            console.log('Address not found or error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

