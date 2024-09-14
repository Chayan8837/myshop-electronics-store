let slideIndex = 0;
showSlides();

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    if (n >= slides.length) {
        slideIndex = 0;
    }
    if (n < 0) {
        slideIndex = slides.length - 1;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
}

setInterval(() => {
    plusSlides(1);
}, 3000);

const product = [
    { id: 1, name: "Smartphone", description: "70H Playtime | 40mm driver", oldPrice: "44,999", newPrice: "37,499", image: "https://www.gonoise.com/cdn/shop/files/1_2807dbd9-3951-481c-9e9a-61af0420cd37.webp?v=1720759165" },
    { id: 2, name: "Wireless Earbuds", description: "1.85 Amoled | Limited Edition", oldPrice: "11,999", newPrice: "10,299", image: "https://www.gonoise.com/cdn/shop/files/1_5a161ac2-8bdf-477a-9cd5-5d744b456160.png?v=1716531547" },
    { id: 3, name: "Fitness Tracker", description: "1.1 Amoled Diamond Cut Display", oldPrice: "13,999", newPrice: "12,499", image: "https://www.gonoise.com/cdn/shop/files/Rose2_c8fad402-53ce-4e06-a530-94b4c30ea0d9.png?v=1719210417" },
    { id: 4, name: "Smartwatch", description: "1.46 Amoled | BT calling", oldPrice: "28,999", newPrice: "24,999", image: "https://www.gonoise.com/cdn/shop/files/Rectangle13_6b481810-57d2-4cd4-8ba4-23ec59483b53.png?v=1706680393" }
];

const justLaunchedProducts = [
    { id: 5, name: "New Headphones", description: "Noise Cancelling | Wireless", oldPrice: "14,999", newPrice: "13,499", image: "https://www.gonoise.com/cdn/shop/files/1_2807dbd9-3951-481c-9e9a-61af0420cd37.webp?v=1720759165" },
    { id: 6, name: "Smart Home Speaker", description: "Voice Assistant | Premium Sound", oldPrice: "18,999", newPrice: "16,499", image: "https://www.gonoise.com/cdn/shop/files/1_5a161ac2-8bdf-477a-9cd5-5d744b456160.png?v=1716531547" },
    { id: 7, name: "Bluetooth Earphones", description: "Waterproof | Sports Edition", oldPrice: "6,999", newPrice: "5,999", image: "https://www.gonoise.com/cdn/shop/files/Rose2_c8fad402-53ce-4e06-a530-94b4c30ea0d9.png?v=1719210417" },
    { id: 8, name: "Wireless Speaker", description: "Portable | Long Battery Life", oldPrice: "8,999", newPrice: "6,999", image: "https://www.gonoise.com/cdn/shop/files/Rectangle13_6b481810-57d2-4cd4-8ba4-23ec59483b53.png?v=1706680393" }
];

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
}

renderProducts(product, 'hotSellingList');
renderProducts(justLaunchedProducts, 'justLaunchedList');

document.querySelectorAll('.best-seller-video video').forEach(video => {
    video.addEventListener('mouseover', () => {
        video.play();
    });
    video.addEventListener('mouseout', () => {
        video.pause();
        video.currentTime = 0; // Reset video to start
    });
});

const sendOtpButton = document.getElementById('send-otp-button');
sendOtpButton.addEventListener('click', sendOTP);

function togglePopup() {
    const popup = document.getElementById('side-popup');
    if (popup.style.display === 'none' || !popup.style.display) {
        popup.style.display = 'block';
        popup.style.transform = 'translateX(0)';
    } else {
        popup.style.display = 'none';
        popup.style.transform = 'translateX(100%)';
    }
}

async function sendOTP() {
    const email = document.getElementById('email').value;
    const otpSection = document.getElementById('otp-section');

    if (!email) {
        alert('Please enter your email id');
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/request-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            sendOtpButton.style.display = 'none';
            otpSection.style.display = 'block';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again later.');
    }

    setTimeout(() => {
        sendOtpButton.style.display = 'block';
    }, 500000); 
}

async function verifyOTP() {
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;

    if (!email || !otp) {
        alert('Please enter your email and OTP');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp })
        });

        const result = await response.json();

        if (response.ok) {
            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', email);
                alert('Login successful!');
                togglePopup();
                updateLoginStatus();
            } else {
                alert('Error: ' + result.message);
            }
        } else {
            alert('Error: ' + result.message);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to verify OTP. Please try again.');
    }
}

document.getElementById('login-link').addEventListener('click', function(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        togglePopup();
    } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert("You are logged out");
        updateLoginStatus();
    }
});

function updateLoginStatus() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('login-link');
    if (token) {
        loginLink.innerText = "Log out";
    } else {
        loginLink.innerText = "Log in";
    }
}

document.addEventListener('DOMContentLoaded', updateLoginStatus);
