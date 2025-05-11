document.addEventListener('DOMContentLoaded', () => {
    const gamesContainer = document.getElementById('gamesContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const modal = document.getElementById('gameModal');
    const modalContent = document.getElementById('gameContent');
    const closeButton = document.querySelector('.close');

    // Display all games
    function displayGames(gamesToShow = games) {
        gamesContainer.innerHTML = '';
        gamesToShow.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.dataset.gameId = game.id;
            gameCard.innerHTML = `
                <h2>${game.title}</h2>
                <p>${game.description}</p>
                <div class="players">
                    <i class="fas fa-users"></i>
                    <span>${game.players} player${game.players > 1 ? 's' : ''}</span>
                </div>
                ${game.players === 1 ? `
                    <div class="high-score">
                        <i class="fas fa-trophy"></i>
                        <span>High Score: ${localStorage.getItem(`${game.id}-highscore`) || '0'}</span>
                    </div>
                ` : ''}
            `;
            gameCard.addEventListener('click', () => {
                const gameId = gameCard.dataset.gameId;
                const selectedGame = games.find(g => g.id === gameId);
                if (selectedGame) {
                    // Create a new page for the game
                    const gamePage = document.createElement('div');
                    gamePage.className = 'game-page';
                    gamePage.innerHTML = `
                        <div class="game-header">
                            <h2>${selectedGame.title}</h2>
                            <button id="backToHub">Back to Game Hub</button>
                        </div>
                        <div class="game-content">
                            ${selectedGame.template}
                        </div>
                    `;
                    
                    // Clear the main content and show the game page
                    document.querySelector('.container').innerHTML = '';
                    document.querySelector('.container').appendChild(gamePage);
                    
                    // Initialize the game
                    selectedGame.script();
                    
                    // Add back button functionality
                    document.getElementById('backToHub').addEventListener('click', () => {
                        window.location.reload();
                    });
                }
            });
            gamesContainer.appendChild(gameCard);
        });
    }

    // Open game in modal
    function openGame(game) {
        modalContent.innerHTML = game.template;
        modal.style.display = 'block';
        game.script();
    }

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        modalContent.innerHTML = '';
    }

    // Search games
    function searchGames(query) {
        const filteredGames = games.filter(game => 
            game.title.toLowerCase().includes(query.toLowerCase()) ||
            game.description.toLowerCase().includes(query.toLowerCase())
        );
        displayGames(filteredGames);
    }

    // Event listeners
    searchButton.addEventListener('click', () => {
        searchGames(searchInput.value);
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchGames(searchInput.value);
        }
    });

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Initial display
    displayGames();
}); 