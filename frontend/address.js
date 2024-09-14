document.getElementById('addressForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = localStorage.getItem('user'); // Adjust 'user' to the key where you store the email
    const phone = document.getElementById('phone').value;
    const name = document.getElementById('name').value;
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;

    const addressData = { email, phone, name, street, city, state, zip };

    try {
        const response = await fetch('http://localhost:3000/add-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addressData),
        });

        const result = await response.text();
        alert(result);
        window.location.href="cart.html";
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving address');
    }
});
