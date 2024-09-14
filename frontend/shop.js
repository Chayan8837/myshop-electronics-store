import products from '../frontend/product.js';

function renderProducts(products, containerId) {
    const productsContainer = document.getElementById(containerId);
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('product-img');

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        imgContainer.appendChild(img);

        productDiv.appendChild(imgContainer);

        const name = document.createElement('div');
        name.classList.add('product-name');
        name.textContent = product.name;
        productDiv.appendChild(name);

        const description = document.createElement('div');
        description.classList.add('product-description');
        description.textContent = product.description;
        productDiv.appendChild(description);

        const prices = document.createElement('div');
        prices.classList.add('product-prices');

        const newPrice = document.createElement('div');
        newPrice.classList.add('product-price');
        newPrice.textContent = `${product.newPrice}`;
        prices.appendChild(newPrice);

        const oldPrice = document.createElement('div');
        oldPrice.classList.add('product-old-price');
        oldPrice.textContent = `${product.oldPrice}`;
        prices.appendChild(oldPrice);

        productDiv.appendChild(prices);

        productDiv.addEventListener('click', () => {
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'sproduct.html';
        });

        productsContainer.appendChild(productDiv);
    });

    // Ensure the number of product elements is a multiple of 3
    const numPlaceholders = (3 - (products.length % 3)) % 3;
    for (let i = 0; i < numPlaceholders; i++) {
        const placeholderDiv = document.createElement('div');
        placeholderDiv.classList.add('product-placeholder');
        productsContainer.appendChild(placeholderDiv);
    }
}

hide();
function hide(){
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.style.display = 'none';


}

function filterProducts(searchTerm) {
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               product.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
    renderProducts(filteredProducts, 'product-list');
}

function showSuggestions(searchTerm) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    if (searchTerm.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const suggestions = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    }).slice(0, 5); // Show top 5 suggestions

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = suggestion.name;
        suggestionItem.addEventListener('click', () => {
            document.getElementById('shop-search').value = suggestion.name;
            filterProducts(suggestion.name);
            suggestionsContainer.style.display = 'none';
        });
        suggestionsContainer.appendChild(suggestionItem);
    });

    if (suggestions.length > 0) {
        suggestionsContainer.style.display = 'block';
        // console.log()
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Event listener for search input on shop page
document.getElementById('shop-search').addEventListener('input', (event) => {
    const query = event.target.value;
    showSuggestions(query);
});

document.getElementById('shop-search-button').addEventListener('click', () => {
    const query = document.getElementById('shop-search').value;
    filterProducts(query);
    document.getElementById('suggestions').style.display = 'none';
});

// Check for search query from home page
document.addEventListener('DOMContentLoaded', () => {
    const searchQuery = localStorage.getItem('searchQuery');
    if (searchQuery) {
        filterProducts(searchQuery);
        localStorage.removeItem('searchQuery'); 
    } else {
        renderProducts(products, 'product-list'); 
    }
});
