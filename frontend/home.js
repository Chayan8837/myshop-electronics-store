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
