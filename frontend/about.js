document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('message-status').innerText = data;
        document.getElementById('contact-form').reset();
    })
    .catch(error => {
        document.getElementById('message-status').innerText = 'Error sending message';
        console.error('Error:', error);
    });
});
