// Funções de tema
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle('dark-mode');
  
  // Atualizar ícones
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  sunIcon.style.display = isDark ? 'block' : 'none';
  moonIcon.style.display = isDark ? 'none' : 'block';
  
  // Salvar preferência
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    document.body.classList.remove('dark-mode');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

// Função para copiar texto para área de transferência
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Código PIX copiado!');
  }).catch(() => {
    showNotification('Erro ao copiar código PIX');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const screen1 = document.getElementById('screen1');
  const themeToggle = document.getElementById('themeToggle');
  
  // Modal de apoio
  const supportButton = document.getElementById('supportButton');
  const supportModal = document.getElementById('supportModal');
  const closeModal = document.querySelector('#supportModal .close-modal');
  const copyPixButton = document.getElementById('copyPixButton');
  const pixCode = document.getElementById('pixCode');

  // Contar visitas e abrir modal com probabilidade
  let visitCount = parseInt(localStorage.getItem('visitCount') || '0');
  
  visitCount++;
  localStorage.setItem('visitCount', visitCount.toString());

  // 20% de chance a cada visita ou 100% na 3ª visita se não abriu nas 2 anteriores
  const random = Math.random();
  if (random < 0.2 || visitCount >= 3) {
    supportModal.style.display = 'flex';
    localStorage.setItem('visitCount', '0'); // Resetar contador
  }

  // Abrir modal de apoio manualmente
  supportButton.addEventListener('click', () => {
    supportModal.style.display = 'flex';
  });

  // Fechar modal ao clicar no X
  closeModal.addEventListener('click', () => {
    supportModal.style.display = 'none';
  });

  // Fechar modal ao clicar fora
  window.addEventListener('click', (event) => {
    if (event.target === supportModal) {
      supportModal.style.display = 'none';
    }
  });

  // Copiar código PIX
  copyPixButton.addEventListener('click', () => {
    copyToClipboard(pixCode.textContent);
  });
  
  // Configurar ícones de tema
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  sunIcon.addEventListener('click', toggleTheme);
  moonIcon.addEventListener('click', toggleTheme);
  
  // Aplicar tema salvo
  applySavedTheme();
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
    // Recalcular total baseado no modo atual
    let total;
    if (gameType.value === 'customizado') {
      total = playersPerTeam * totalTeams;
    } else {
      // Modos pré-definidos
      switch(gameType.value) {
        case 'volei':
          total = 6 * totalTeams;
          break;
        case 'futebolCampo':
          total = 11 * totalTeams;
          break;
        case 'futebolSalao':
          total = 5 * totalTeams;
          break;
        case 'futebolSete':
          total = 7 * totalTeams;
          break;
        default:
          total = 6 * totalTeams;
      }
    }
    
    // Remover jogadores excedentes se necessário
    if (players.length > total) {
      players = players.slice(0, total);
      showNotification(`✖ Removidos ${players.length - total} jogadores excedentes`);
    }
    
    totalPlayersSpan.textContent = total;
    playersPerTeam = total / totalTeams;
    
    // Atualizar contadores e lista de jogadores
    updatePlayerCounters();
    updatePlayersList();
    
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
      
      // Adicionar indicador de time fixado
      if (player.fixedTeam !== undefined) {
        const fixedTeamBadge = document.createElement('span');
        fixedTeamBadge.className = 'fixed-team-badge';
        fixedTeamBadge.textContent = `Time ${player.fixedTeam + 1}`;
        playerInfo.appendChild(fixedTeamBadge);
      }
      
      playerInfo.appendChild(playerText);
      playerInfo.appendChild(ratingBadge);
      
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'player-actions';
      
      // Botão de fixar time
      const fixButton = document.createElement('button');
      fixButton.className = 'action-btn';
      fixButton.textContent = 'Fixar';
      fixButton.onclick = () => toggleFixedTeam(index);
      
      const editButton = document.createElement('button');
      editButton.className = 'action-btn';
      editButton.textContent = 'Editar';
      editButton.onclick = () => editPlayer(index);
      
      const deleteButton = document.createElement('button');
      deleteButton.className = 'action-btn';
      deleteButton.textContent = 'Excluir';
      deleteButton.onclick = () => deletePlayer(index);
      
      actionsDiv.appendChild(fixButton);
      actionsDiv.appendChild(editButton);
      actionsDiv.appendChild(deleteButton);
      
      playerItem.appendChild(playerInfo);
      playerItem.appendChild(actionsDiv);
      
      playersList.appendChild(playerItem);
    });
    
    updatePlayerCounters();
  }

  function toggleFixedTeam(index) {
    const player = players[index];
    const modal = document.createElement('div');
    modal.className = 'fixed-team-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const title = document.createElement('h3');
    title.textContent = 'Fixar jogador em time específico';
    
    const options = document.createElement('div');
    options.className = 'fixed-team-options';
    
    // Adicionar opção "Nenhum" como default
    const noneOption = document.createElement('button');
    noneOption.className = `fixed-team-option ${player.fixedTeam === undefined ? 'selected' : ''}`;
    noneOption.textContent = 'Nenhum';
    noneOption.onclick = () => {
      player.fixedTeam = undefined;
      updatePlayersList();
      modal.remove();
    };
    
    options.appendChild(noneOption);
    
    // Adicionar opções de times
    for (let i = 0; i < totalTeams; i++) {
      const teamOption = document.createElement('button');
      teamOption.className = `fixed-team-option ${player.fixedTeam === i ? 'selected' : ''}`;
      teamOption.textContent = `Time ${i + 1}`;
      teamOption.onclick = () => {
        // Verificar se o time já atingiu o limite
        const playersInTeam = players.filter(p => p.fixedTeam === i).length;
        if (playersInTeam >= playersPerTeam) {
          showNotification(`✖ Time ${i + 1} já atingiu o limite de ${playersPerTeam} jogadores`);
          return;
        }
        player.fixedTeam = i;
        updatePlayersList();
        modal.remove();
      };
      options.appendChild(teamOption);
    }
    
    modalContent.appendChild(title);
    modalContent.appendChild(options);
    modal.appendChild(modalContent);
    
    // Fechar modal ao clicar fora
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    };
    
    document.body.appendChild(modal);
  }

  function sortTeams() {
    // Verificar se o número total de jogadores não excede o permitido
    const maxPlayers = playersPerTeam * totalTeams;
    if (players.length > maxPlayers) {
      showNotification(`✖ Número máximo de jogadores excedido (${maxPlayers} - ${playersPerTeam} por time)`);
      return;
    }
    
    // Verificar se todos os times têm espaço para os jogadores restantes
    const teamsCount = Array(totalTeams).fill(0);
    players.forEach(player => {
      if (player.fixedTeam !== undefined) {
        teamsCount[player.fixedTeam]++;
      }
    });
    
    const remainingPlayers = players.length - teamsCount.reduce((sum, count) => sum + count, 0);
    const availableSpaces = teamsCount.reduce((sum, count) => sum + (playersPerTeam - count), 0);
    
    if (remainingPlayers > availableSpaces) {
      showNotification(`✖ Não há espaço suficiente nos times para todos os jogadores`);
      return;
    }

    // Ordenar jogadores por nota (decrescente)
    const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
    const teams = Array.from({ length: totalTeams }, () => ({
      players: [],
      totalRating: 0,
      averageRating: 0
    }));

    // Primeiro distribuir jogadores fixados
    sortedPlayers.forEach(player => {
      if (player.fixedTeam !== undefined) {
        // Verificar se o time fixado já atingiu o limite
        if (teams[player.fixedTeam].players.length < playersPerTeam) {
          teams[player.fixedTeam].players.push(player);
          teams[player.fixedTeam].totalRating += parseInt(player.rating);
        } else {
          showNotification(`✖ Time ${player.fixedTeam + 1} já atingiu o limite de ${playersPerTeam} jogadores`);
        }
      }
    });

    // Agrupar jogadores por rating
    const playersByRating = {};
    sortedPlayers.forEach(player => {
      if (player.fixedTeam === undefined) {
        if (!playersByRating[player.rating]) {
          playersByRating[player.rating] = [];
        }
        playersByRating[player.rating].push(player);
      }
    });

    // Distribuir jogadores mantendo o equilíbrio
    Object.values(playersByRating).forEach(playersWithSameRating => {
      // Embaralhar jogadores com o mesmo rating
      for (let i = playersWithSameRating.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playersWithSameRating[i], playersWithSameRating[j]] = [playersWithSameRating[j], playersWithSameRating[i]];
      }

      // Distribuir jogadores alternando entre times
      let currentTeamIndex = 0;
      let direction = 1;
      
      playersWithSameRating.forEach(player => {
        // Encontrar o próximo time que ainda tem espaço
        while (teams[currentTeamIndex].players.length >= playersPerTeam) {
          if (currentTeamIndex === 0) direction = 1;
          if (currentTeamIndex === totalTeams - 1) direction = -1;
          currentTeamIndex += direction;
        }
        
        if (teams[currentTeamIndex].players.length < playersPerTeam) {
          teams[currentTeamIndex].players.push(player);
          teams[currentTeamIndex].totalRating += parseInt(player.rating);
          
          // Alternar time
          if (currentTeamIndex === 0) direction = 1;
          if (currentTeamIndex === totalTeams - 1) direction = -1;
          currentTeamIndex += direction;
        }
      });
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
    
    let newPlayersPerTeam;
    switch(type) {
      case 'volei':
        newPlayersPerTeam = 6;
        break;
      case 'futebolCampo':
        newPlayersPerTeam = 11;
        break;
      case 'futebolSalao':
        newPlayersPerTeam = 5;
        break;
      case 'futebolSete':
        newPlayersPerTeam = 7;
        break;
      case 'customizado':
        newPlayersPerTeam = parseInt(customPlayers.value);
        break;
    }
    
    const maxPlayers = newPlayersPerTeam * totalTeams;
    
    // Remover jogadores excedentes se necessário
    if (players.length > maxPlayers) {
      players = players.slice(0, maxPlayers);
      showNotification(`✖ Removidos jogadores excedentes`);
    }
    
    playersPerTeam = newPlayersPerTeam;
    updateTotalPlayers();
    updatePlayersList();
  });

  customPlayers.addEventListener('change', () => {
    if (gameType.value === 'customizado') {
      const newPlayersPerTeam = parseInt(customPlayers.value);
      const maxPlayers = newPlayersPerTeam * totalTeams;
      
      if (players.length > maxPlayers) {
        // Remover jogadores excedentes
        players = players.slice(0, maxPlayers);
        showNotification(`✖ Removidos jogadores excedentes`);
        updatePlayersList();
      }
      
      playersPerTeam = newPlayersPerTeam;
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

    // Verificar limite máximo de jogadores apenas ao adicionar novo jogador
    if (editingIndex === -1) {
      const maxPlayers = playersPerTeam * totalTeams;
      if (players.length >= maxPlayers) {
        showNotification(`✖ Limite máximo de ${maxPlayers} jogadores atingido (${playersPerTeam} por time)`);
        return;
      }
      
      // Verificar se algum time já atingiu o limite
      const teamsCount = Array(totalTeams).fill(0);
      players.forEach(player => {
        if (player.fixedTeam !== undefined) {
          teamsCount[player.fixedTeam]++;
        }
      });
      
      const teamWithSpace = teamsCount.findIndex(count => count < playersPerTeam);
      if (teamWithSpace === -1) {
        showNotification(`✖ Todos os times já atingiram o limite de ${playersPerTeam} jogadores`);
        return;
      }
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
    
    // Remover validação de limite máximo ao editar
    saveButton.disabled = false;
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
