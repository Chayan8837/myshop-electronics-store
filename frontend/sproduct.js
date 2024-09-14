let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("prodetails-photo");
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

let quantity = 1;

function changeQuantity(n) {
    quantity += n;
    if (quantity < 1) {
        quantity = 1;
    }
    document.getElementById("quantity").innerText = quantity;
}

async function addToCart() {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    const user = localStorage.getItem('user'); // Assuming user email is stored in local storage after login

    if (!user) {
        alert("Please log in to add products to your cart.");
        return;
    }

    const productToAdd = {
        ...product,
        quantity: quantity
    };



    console.log(productToAdd);

    try {
        const response = await fetch('http://localhost:3000/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: user,
                product: productToAdd
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Added " + quantity + " item(s) to the cart.");
        } else {
            alert("Failed to add to cart: " + result.message);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add to cart. Please try again later.');
    }
}

function displayProductDetails(product) {
    const productName = document.getElementById('product-name');
    const productDescription = document.querySelector('.prodetails-desc');
    const newPrice = document.getElementById('new-price');
    const oldPrice = document.getElementById('old-price');

    productName.textContent = product.name;
    productDescription.textContent = product.description;
    newPrice.textContent = `${product.newPrice}`;
    oldPrice.textContent = `${product.oldPrice}`;

    const slides = document.querySelectorAll('.prodetails-photo img');
    slides.forEach(slide => {
        slide.src = product.image;
    });

    const productOffers = document.querySelector('.prodetails-offers .prodetails-offer');
    productOffers.textContent = product.offers || "Extra ₹50 off on all prepaid orders";

    const productIdElement = document.getElementById('product-id');
    if (productIdElement) {
        productIdElement.textContent = product.id;
    }
}

const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
if (selectedProduct) {
    displayProductDetails(selectedProduct);
} else {
    const productDetailsContainer = document.querySelector('.prodetails-right');
    productDetailsContainer.textContent = 'Product details not found.';
}

document.addEventListener('DOMContentLoaded', function () {
    showSlides(slideIndex);
});
