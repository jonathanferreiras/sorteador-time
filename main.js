// Funções de tema
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const isDark = body.classList.toggle('dark-mode');
  
  // Atualizar ícone e texto
  themeToggle.innerHTML = isDark ? '☀️' : '🌙';
  
  // Salvar preferência
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const themeToggle = document.getElementById('themeToggle');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.innerHTML = '🌙';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const screen1 = document.getElementById('screen1');
  const themeToggle = document.getElementById('themeToggle');
  
  // Aplicar tema salvo
  applySavedTheme();
  
  // Configurar botão de tema
  themeToggle.addEventListener('click', toggleTheme);
  const screen2 = document.getElementById('screen2');
  const screen3 = document.getElementById('screen3');
  const gameType = document.getElementById('gameType');
  const customPlayersContainer = document.getElementById('customPlayersContainer');
  const customPlayers = document.getElementById('customPlayers');
  const numberOfTeams = document.getElementById('numberOfTeams');
  const totalPlayersSpan = document.getElementById('totalPlayers');
  const nextButton = document.getElementById('nextButton');
  const addPlayerBtn = document.getElementById('addPlayerBtn');
  const playersList = document.getElementById('playersList');
  const addedPlayersSpan = document.getElementById('addedPlayers');
  const remainingPlayersSpan = document.getElementById('remainingPlayers');
  const sortButton = document.getElementById('sortButton');
  const backButton = document.getElementById('backButton');
  const backToPlayersButton = document.getElementById('backToPlayersButton');
  const newSortButton = document.getElementById('newSortButton');
  const playerModal = document.getElementById('playerModal');
  const modalTitle = document.getElementById('modalTitle');
  const playerName = document.getElementById('playerName');
  const playerRating = document.getElementById('playerRating');
  const saveButton = document.getElementById('saveButton');
  const cancelButton = document.getElementById('cancelButton');
  const teamsContainer = document.getElementById('teamsContainer');

  let players = [];
  let editingIndex = -1;
  let playersPerTeam = 6;
  let totalTeams = 2;

  // Funções auxiliares
  function updateTotalPlayers() {
    const total = calculateTotalPlayers();
    totalPlayersSpan.textContent = total;
    return total;
  }

  function calculateTotalPlayers() {
    return playersPerTeam * totalTeams;
  }

  function updatePlayerCounters() {
    const total = calculateTotalPlayers();
    const added = players.length;
    const remaining = total - added;
    
    addedPlayersSpan.textContent = added;
    remainingPlayersSpan.textContent = remaining;
    sortButton.disabled = remaining !== 0;
    addPlayerBtn.disabled = remaining === 0;
  }

  function showScreen(screenNumber) {
    screen1.style.display = screenNumber === 1 ? 'block' : 'none';
    screen2.style.display = screenNumber === 2 ? 'block' : 'none';
    screen3.style.display = screenNumber === 3 ? 'block' : 'none';
  }

  function clearModal() {
    playerName.value = '';
    playerRating.value = '3';
    editingIndex = -1;
    modalTitle.textContent = 'Adicionar Jogador';
    saveButton.textContent = 'Adicionar';
  }

  function updatePlayersList() {
    playersList.innerHTML = '';
    players.forEach((player, index) => {
      const playerItem = document.createElement('div');
      playerItem.className = 'player-item';
      
      const playerInfo = document.createElement('div');
      playerInfo.className = 'player-info';
      
      const playerText = document.createElement('span');
      playerText.textContent = player.name;
      
      const ratingBadge = document.createElement('span');
      ratingBadge.className = 'player-rating';
      ratingBadge.textContent = player.rating;
      
      playerInfo.appendChild(playerText);
      playerInfo.appendChild(ratingBadge);
      
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'player-actions';
      
      const editButton = document.createElement('button');
      editButton.className = 'action-btn';
      editButton.textContent = 'Editar';
      editButton.onclick = () => editPlayer(index);
      
      const deleteButton = document.createElement('button');
      deleteButton.className = 'action-btn';
      deleteButton.textContent = 'Excluir';
      deleteButton.onclick = () => deletePlayer(index);
      
      actionsDiv.appendChild(editButton);
      actionsDiv.appendChild(deleteButton);
      
      playerItem.appendChild(playerInfo);
      playerItem.appendChild(actionsDiv);
      
      playersList.appendChild(playerItem);
    });
    
    updatePlayerCounters();
  }

  function sortTeams() {
    // Ordenar jogadores por nota (decrescente)
    const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
    const teams = Array.from({ length: totalTeams }, () => ({
      players: [],
      totalRating: 0,
      averageRating: 0
    }));

    // Distribuir jogadores usando o método serpentina e balanceamento
    let currentTeamIndex = 0;
    let direction = 1;

    sortedPlayers.forEach((player) => {
      teams[currentTeamIndex].players.push(player);
      teams[currentTeamIndex].totalRating += parseInt(player.rating);

      // Atualizar índice do time usando padrão serpentina
      if (currentTeamIndex === 0) direction = 1;
      if (currentTeamIndex === totalTeams - 1) direction = -1;
      currentTeamIndex += direction;
    });

    // Calcular médias
    teams.forEach(team => {
      team.averageRating = (team.totalRating / team.players.length).toFixed(2);
    });

    // Tentar balancear ainda mais os times trocando jogadores se necessário
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          const diff = Math.abs(teams[i].totalRating - teams[j].totalRating);
          
          // Tentar trocar jogadores para melhorar o equilíbrio
          for (let pi = 0; pi < teams[i].players.length; pi++) {
            for (let pj = 0; pj < teams[j].players.length; pj++) {
              const newDiff = Math.abs(
                (teams[i].totalRating - teams[i].players[pi].rating + teams[j].players[pj].rating) -
                (teams[j].totalRating - teams[j].players[pj].rating + teams[i].players[pi].rating)
              );
              
              if (newDiff < diff) {
                // Trocar jogadores
                const temp = teams[i].players[pi];
                teams[i].players[pi] = teams[j].players[pj];
                teams[j].players[pj] = temp;
                
                // Atualizar ratings totais
                teams[i].totalRating = teams[i].players.reduce((sum, p) => sum + parseInt(p.rating), 0);
                teams[j].totalRating = teams[j].players.reduce((sum, p) => sum + parseInt(p.rating), 0);
                
                // Atualizar médias
                teams[i].averageRating = (teams[i].totalRating / teams[i].players.length).toFixed(2);
                teams[j].averageRating = (teams[j].totalRating / teams[j].players.length).toFixed(2);
                
                improved = true;
              }
            }
          }
        }
      }
    }

    displayTeams(teams);
  }

  function displayTeams(teams) {
    teamsContainer.innerHTML = '';
    
    teams.forEach((team, index) => {
      const teamCard = document.createElement('div');
      teamCard.className = 'team-card';
      
      const teamHeader = document.createElement('div');
      teamHeader.className = 'team-header';
      teamHeader.innerHTML = `<h2>Time ${index + 1}</h2>`;
      
      const teamStats = document.createElement('div');
      teamStats.className = 'team-stats';
      teamStats.innerHTML = `
        <div class="stat-item">
          <div class="stat-label">Total</div>
          <div class="stat-value">${team.totalRating}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Média</div>
          <div class="stat-value">${team.averageRating}</div>
        </div>
      `;
      
      const teamPlayers = document.createElement('div');
      teamPlayers.className = 'team-players';
      
      team.players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'team-player';
        playerDiv.innerHTML = `
          <span>${player.name}</span>
          <span class="player-rating">${player.rating}</span>
        `;
        teamPlayers.appendChild(playerDiv);
      });
      
      teamCard.appendChild(teamHeader);
      teamCard.appendChild(teamStats);
      teamCard.appendChild(teamPlayers);
      
      teamsContainer.appendChild(teamCard);
    });
  }

  // Event Listeners
  gameType.addEventListener('change', () => {
    const type = gameType.value;
    customPlayersContainer.style.display = type === 'customizado' ? 'block' : 'none';
    
    switch(type) {
      case 'volei':
        playersPerTeam = 6;
        break;
      case 'futebolCampo':
        playersPerTeam = 11;
        break;
      case 'futebolSalao':
        playersPerTeam = 5;
        break;
      case 'futebolSete':
        playersPerTeam = 7;
        break;
      case 'customizado':
        playersPerTeam = parseInt(customPlayers.value);
        break;
    }
    updateTotalPlayers();
  });

  customPlayers.addEventListener('change', () => {
    if (gameType.value === 'customizado') {
      playersPerTeam = parseInt(customPlayers.value);
      updateTotalPlayers();
    }
  });

  numberOfTeams.addEventListener('change', () => {
    totalTeams = parseInt(numberOfTeams.value);
    updateTotalPlayers();
  });

  nextButton.addEventListener('click', () => {
    showScreen(2);
    updatePlayerCounters();
  });

  addPlayerBtn.addEventListener('click', () => {
    clearModal();
    playerModal.style.display = 'flex';
  });

  saveButton.addEventListener('click', () => {
    const name = playerName.value.trim();
    const rating = parseInt(playerRating.value);
    
    if (!name) {
      showNotification('✖ Por favor, insira um nome válido');
      return;
    }

    // Verificar se o nome já existe (case-insensitive e ignorando espaços)
    const normalizedName = name.toLowerCase().trim();
    const nameExists = players.some((player, index) => {
      const existingName = player.name.toLowerCase().trim();
      return existingName === normalizedName &&
        (editingIndex === -1 || index !== editingIndex);
    });
    
    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      
      // Remove notification after 4 seconds
      setTimeout(() => {
        notification.remove();
      }, 4000);
    }

    if (nameExists) {
      showNotification('✖ Já existe um jogador com esse nome');
      return;
    }

    // Verificar se o nome contém apenas espaços ou é vazio
    if (!normalizedName || /^\s*$/.test(name)) {
      showNotification('✖ O nome não pode ser vazio ou conter apenas espaços');
      return;
    }

    // Verificar se o nome contém caracteres especiais inválidos
    if (/[^a-zA-ZÀ-ÿ\s'-]/.test(name)) {
      showNotification('✖ Use apenas letras, espaços e hífens');
      return;
    }

    if (name && rating) {
      if (editingIndex === -1) {
        players.push({ name, rating });
      } else {
        players[editingIndex] = { name, rating };
      }
      
      updatePlayersList();
      playerModal.style.display = 'none';
      clearModal();
    }
  });

  cancelButton.addEventListener('click', () => {
    playerModal.style.display = 'none';
    clearModal();
  });

  function editPlayer(index) {
    editingIndex = index;
    const player = players[index];
    playerName.value = player.name;
    playerRating.value = player.rating;
    modalTitle.textContent = 'Editar Jogador';
    saveButton.textContent = 'Salvar';
    playerModal.style.display = 'flex';
  }

  function deletePlayer(index) {
    players.splice(index, 1);
    updatePlayersList();
  }

  sortButton.addEventListener('click', () => {
    sortTeams();
    showScreen(3);
  });

  backButton.addEventListener('click', () => {
    showScreen(1);
  });

  backToPlayersButton.addEventListener('click', () => {
    showScreen(2);
  });

  newSortButton.addEventListener('click', () => {
    players = [];
    showScreen(1);
    updatePlayersList();
  });

  // Inicialização
  updateTotalPlayers();
});
