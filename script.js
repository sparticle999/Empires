class EmpiresGame {
	constructor() {
		this.players = [];
		this.playerNames = []; // Store actual player names
		this.currentRound = 1;
		this.fakeEntries = 0;
		this.answers = [];
		this.guesses = {};
		this.scores = {};
		this.teams = [];
		this.allAnswers = []; // Store all answers from all rounds (including fakes)
		this.selectedFakes = []; // Store the fake answers selected for this round
		this.categories = [
			'Animals', 'Fruits', 'Countries', 'Celebrities', 'Movies', 
			'Books', 'Sports', 'Food', 'Colors', 'Cities', 'Jobs', 
			'Hobbies', 'Musical Instruments', 'Famous Landmarks', 'Superheroes',
			'Video Games', 'TV Shows', 'Historical Figures', 'Inventions', 'Plants'
		];
		this.fakeAnswers = {
			'Animals': ['dog', 'cat', 'bird', 'fish', 'horse'],
			'Fruits': ['apple', 'banana', 'orange', 'grape', 'strawberry'],
			'Countries': ['usa', 'canada', 'mexico', 'brazil', 'argentina'],
			'Celebrities': ['tom hanks', 'brad pitt', 'angelina jolie', 'leonardo dicaprio', 'jennifer lawrence'],
			'Movies': ['titanic', 'avatar', 'star wars', 'the lion king', 'frozen'],
			'Books': ['harry potter', 'the bible', 'the hobbit', '1984', 'to kill a mockingbird'],
			'Sports': ['soccer', 'basketball', 'baseball', 'tennis', 'golf'],
			'Food': ['pizza', 'hamburger', 'hot dog', 'french fries', 'ice cream'],
			'Colors': ['red', 'blue', 'green', 'yellow', 'purple'],
			'Cities': ['new york', 'london', 'paris', 'tokyo', 'sydney'],
			'Jobs': ['teacher', 'doctor', 'engineer', 'lawyer', 'chef'],
			'Hobbies': ['reading', 'swimming', 'cooking', 'gardening', 'photography'],
			'Musical Instruments': ['guitar', 'piano', 'drums', 'violin', 'trumpet'],
			'Famous Landmarks': ['eiffel tower', 'statue of liberty', 'big ben', 'sydney opera house', 'taj mahal'],
			'Superheroes': ['superman', 'batman', 'spider-man', 'wonder woman', 'iron man'],
			'Video Games': ['minecraft', 'fortnite', 'call of duty', 'grand theft auto', 'pokemon'],
			'TV Shows': ['friends', 'the office', 'breaking bad', 'game of thrones', 'stranger things'],
			'Historical Figures': ['abraham lincoln', 'george washington', 'martin luther king jr.', 'albert einstein', 'nelson mandela'],
			'Inventions': ['the wheel', 'the light bulb', 'the telephone', 'the computer', 'the internet'],
			'Plants': ['rose', 'tulip', 'sunflower', 'daisy', 'lily']
		};
		
		this.currentCategory = '';
		this.readCount = 0;
		this.currentInputPlayer = 0; // legacy multi-input helper (unused in entry flow)
		
		// Entry flow state
		this.currentEntryIndex = 0;
		this.enteredAnswersLower = new Set();
		this.roundEntryAnswers = [];
		
		// Load saved player names from localStorage
		this.loadSavedPlayerNames();
		
		// Populate player name inputs with saved names if they exist
		this.populatePlayerNameInputs();
		
		this.initializeEventListeners();
	}

	initializeEventListeners() {
		// Setup screen
		document.getElementById('start-game').addEventListener('click', () => this.startGame());
		document.getElementById('clear-names').addEventListener('click', () => this.clearSavedNames());
		
		// Fake entries slider
		const fakeEntriesSlider = document.getElementById('fake-entries');
		const fakeEntriesValue = document.getElementById('fake-entries-value');
		fakeEntriesSlider.addEventListener('input', (e) => {
			fakeEntriesValue.textContent = e.target.value;
		});
		
		// Entry screen
		document.getElementById('save-answer').addEventListener('click', () => this.saveCurrentEntry());
		const singleAnswerInput = document.getElementById('single-answer');
		singleAnswerInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.saveCurrentEntry();
		});
		singleAnswerInput.addEventListener('input', () => this.checkSingleDuplicate());
		
		// Game screen (kept for layout/back-compat)
		document.getElementById('submit-all-answers').addEventListener('click', () => this.submitAllAnswers());
		
		// Reading phase
		document.getElementById('hide-answers').addEventListener('click', () => this.hideAnswers());
		
		// End game phase
		document.getElementById('end-game-button').addEventListener('click', () => this.endGame());
		
		// Guessing phase (removed from flow but kept for compatibility)
		document.getElementById('submit-guesses').addEventListener('click', () => this.submitGuesses());
		
		// Results phase
		document.getElementById('manage-teams').addEventListener('click', () => this.showTeamManagement());
		document.getElementById('next-round').addEventListener('click', () => this.nextRound());
		document.getElementById('end-game').addEventListener('click', () => this.endGame());
		
		// Team management
		document.getElementById('move-player').addEventListener('click', () => this.movePlayer());
		document.getElementById('back-to-game').addEventListener('click', () => this.backToGame());
		document.getElementById('continue-from-teams').addEventListener('click', () => this.continueFromTeams());
		
		// Final screen
		document.getElementById('play-again').addEventListener('click', () => this.playAgain());
		
		// Reveal screen
		document.getElementById('play-again-from-reveal').addEventListener('click', () => this.playAgain());
	}

	startGame() {
		const fakeEntries = parseInt(document.getElementById('fake-entries').value);
		
		if (fakeEntries < 1 || fakeEntries > 5) {
			alert('Please enter between 1 and 5 fake entries.');
			return;
		}
		
		// Get player names from the input fields
		const playerNameInputs = document.querySelectorAll('.player-name-input');
		const playerNames = [];
		
		playerNameInputs.forEach(input => {
			const name = input.value.trim();
			if (name) {
				playerNames.push(name);
			}
		});
		
		if (playerNames.length < 2) {
			alert('Please enter at least 2 player names.');
			return;
		}
		
		if (playerNames.length > 12) {
			alert('Maximum 12 players allowed.');
			return;
		}
		
		// Check for duplicate names
		const uniqueNames = new Set(playerNames.map(name => name.toLowerCase()));
		if (uniqueNames.size !== playerNames.length) {
			alert('Please ensure all player names are unique.');
			return;
		}
		
		this.fakeEntries = fakeEntries;
		this.players = [...playerNames];
		this.playerNames = [...playerNames];
		
		// Save player names to localStorage for future games
		this.savePlayerNames();
		
		// Initialize scores
		this.scores = {};
		this.players.forEach(player => {
			this.scores[player] = 0;
		});
		
		// Initialize teams - each player starts in their own team
		this.teams = this.players.map(player => ({
			leader: player,
			members: [player],
			entry: ''
		}));
		
		this.startRound();
	}



	startRound() {
		this.currentCategory = this.getRandomCategory();
		this.answers = [];
		this.guesses = {};
		this.readCount = 0;
		this.currentInputPlayer = 0; // legacy
		
		// Entry flow state
		this.currentEntryIndex = 0;
		this.enteredAnswersLower = new Set();
		this.roundEntryAnswers = [];
		
		// Select fake entries first
		this.selectFakeEntries();
		
		document.getElementById('category-text').textContent = this.currentCategory;
		document.getElementById('round-number').textContent = this.currentRound;
		
		// Begin per-player entry
		this.showEntryForCurrentPlayer();
	}

	selectFakeEntries() {
		const fakeAnswers = this.fakeAnswers[this.currentCategory] || this.fakeAnswers['Animals'];
		const shuffled = [...fakeAnswers].sort(() => Math.random() - 0.5);
		
		this.selectedFakes = [];
		for (let i = 0; i < this.fakeEntries; i++) {
			this.selectedFakes.push(shuffled[i] || `Fake Answer ${i + 1}`);
		}
		
		// Add fake answers to the set of used answers (lowercase)
		this.selectedFakes.forEach(fake => {
			this.enteredAnswersLower.add(fake.toLowerCase());
		});
	}

	getRandomCategory() {
		return this.categories[Math.floor(Math.random() * this.categories.length)];
	}

	showEntryForCurrentPlayer() {
		const playerName = this.players[this.currentEntryIndex];
		this.showScreen('entry-screen');
		document.getElementById('entry-category').textContent = this.currentCategory;
		document.getElementById('entry-player-name').textContent = playerName;
		const input = document.getElementById('single-answer');
		const warn = document.getElementById('entry-duplicate-warning');
		input.value = '';
		warn.style.display = 'none';
		input.focus();
	}

	checkSingleDuplicate() {
		const input = document.getElementById('single-answer');
		const warn = document.getElementById('entry-duplicate-warning');
		const val = input.value.trim().toLowerCase();
		if (val && this.enteredAnswersLower.has(val)) {
			warn.style.display = 'block';
			return true;
		} else {
			warn.style.display = 'none';
			return false;
		}
	}

	saveCurrentEntry() {
		const input = document.getElementById('single-answer');
		const valRaw = input.value.trim();
		if (!valRaw) {
			alert('Please enter an answer.');
			input.focus();
			return;
		}
		const valLower = valRaw.toLowerCase();
		if (this.enteredAnswersLower.has(valLower)) {
			this.checkSingleDuplicate();
			return;
		}
		
		// Save answer for current player
		const playerName = this.players[this.currentEntryIndex];
		this.roundEntryAnswers.push({
			player: playerName,
			answer: valLower,
			round: this.currentRound,
			category: this.currentCategory
		});
		this.enteredAnswersLower.add(valLower);
		
		// Next player or proceed
		this.currentEntryIndex++;
		if (this.currentEntryIndex < this.players.length) {
			this.showEntryForCurrentPlayer();
		} else {
			// Finalize round answers
			this.answers = [...this.roundEntryAnswers];
			this.allAnswers.push(...this.roundEntryAnswers);
			this.addFakeEntries();
			this.startReadingPhase();
		}
	}

	// Legacy multi-input (not used in entry flow) -----------------------------
	startInputPhase() {
		this.showPhase('input-phase');
		this.createAnswerInputs();
	}

	createAnswerInputs() {
		const answerInputs = document.getElementById('answer-inputs');
		answerInputs.innerHTML = '';
		
		this.players.forEach((player, index) => {
			const inputDiv = document.createElement('div');
			inputDiv.className = 'answer-input';
			inputDiv.innerHTML = `
				<input type="text" id="answer-${index}" placeholder="${player}'s answer" maxlength="50" data-player="${player}" data-index="${index}">
				<div class="duplicate-warning" style="display: none;">This answer has already been used. Please choose a different one.</div>
				<div class="hidden-label" style="display: none;">This player's answer will be hidden from others</div>
			`;
			answerInputs.appendChild(inputDiv);
			
			// Add event listeners
			const input = inputDiv.querySelector('input');
			input.addEventListener('input', () => this.checkForDuplicates());
			input.addEventListener('focus', () => this.showCurrentPlayer(index));
		});
		
		document.getElementById('category-display').textContent = this.currentCategory;
		this.updateInputVisibility();
	}

	showCurrentPlayer(index) {
		this.currentInputPlayer = index;
		this.updateInputVisibility();
	}

	updateInputVisibility() {
		const inputs = document.querySelectorAll('.answer-input input');
		const labels = document.querySelectorAll('.hidden-label');
		
		inputs.forEach((input, index) => {
			const isCurrentPlayer = index === this.currentInputPlayer;
			const hasValue = input.value.trim() !== '';
			
			if (isCurrentPlayer || hasValue) {
				input.classList.remove('hidden');
				input.disabled = false;
				labels[index].style.display = 'none';
			} else {
				input.classList.add('hidden');
				input.disabled = true;
				labels[index].style.display = 'block';
			}
		});
	}

	checkForDuplicates() {
		const inputs = document.querySelectorAll('.answer-input input');
		const answers = Array.from(inputs).map(input => input.value.trim().toLowerCase());
		const warnings = document.querySelectorAll('.duplicate-warning');
		
		inputs.forEach((input, index) => {
			const answer = input.value.trim().toLowerCase();
			const isDuplicate = answer !== '' && answers.filter(a => a === answer).length > 1;
			
			input.classList.toggle('duplicate', isDuplicate);
			warnings[index].style.display = isDuplicate ? 'block' : 'none';
		});
	}

	submitAllAnswers() {
		const inputs = document.querySelectorAll('.answer-input input');
		const answers = Array.from(inputs).map(input => input.value.trim());
		
		// Check for empty answers
		if (answers.some(answer => answer === '')) {
			alert('Please enter answers for all players.');
			return;
		}
		
		// Check for duplicates
		const uniqueAnswers = new Set(answers.map(a => a.toLowerCase()));
		if (uniqueAnswers.size !== answers.length) {
			alert('Please ensure all answers are unique.');
			return;
		}
		
		// Store answers
		this.answers = answers.map((answer, index) => ({
			player: this.players[index],
			answer: answer.toLowerCase(),
			round: this.currentRound,
			category: this.currentCategory
		}));
		
		// Store for final reveal
		this.allAnswers.push(...this.answers);
		
		this.addFakeEntries();
		this.startReadingPhase();
	}
	// ------------------------------------------------------------------------

	addFakeEntries() {
		// Use the pre-selected fake entries
		this.selectedFakes.forEach((fake, index) => {
			const fakeEntry = {
				player: 'FAKE',
				answer: fake,
				round: this.currentRound,
				category: this.currentCategory
			};
			this.answers.push(fakeEntry);
			this.allAnswers.push(fakeEntry); // include in reveal history
		});
		
		// Shuffle all answers
		this.answers.sort(() => Math.random() - 0.5);
	}

	startReadingPhase() {
		this.showScreen('game-screen');
		this.showPhase('reading-phase');
		this.readAnswers();
	}

	readAnswers() {
		const answersList = document.getElementById('answers-list');
		answersList.innerHTML = '';
		
		this.answers.forEach((item, index) => {
			const answerDiv = document.createElement('div');
			answerDiv.className = 'answer-item';
			answerDiv.textContent = `${index + 1}. ${item.answer}`;
			answersList.appendChild(answerDiv);
		});
		
		this.readCount++;
		
		if (this.readCount >= 2) {
			document.getElementById('read-again').style.display = 'none';
		}
	}

	hideAnswers() {
		this.showEndGameButton();
	}

	showEndGameButton() {
		this.showScreen('game-screen');
		this.showPhase('end-game-phase');
	}

	startGuessingPhase() {
		this.showPhase('guessing-phase');
		this.createGuessingGrid();
	}

	createGuessingGrid() {
		const guessingGrid = document.getElementById('guessing-grid');
		guessingGrid.innerHTML = '';
		
		this.answers.forEach((item, index) => {
			const guessDiv = document.createElement('div');
			guessDiv.className = 'guess-item';
			
			const select = document.createElement('select');
			select.className = 'guess-select';
			select.id = `guess-${index}`;
			
			// Add default option
			const defaultOption = document.createElement('option');
			defaultOption.value = '';
			defaultOption.textContent = 'Select a player...';
			select.appendChild(defaultOption);
			
			// Add player options
			this.players.forEach(player => {
				const option = document.createElement('option');
				option.value = player;
				option.textContent = player;
				select.appendChild(option);
			});
			
			guessDiv.innerHTML = `<h4>Answer ${index + 1}: ${item.answer}</h4>`;
			guessDiv.appendChild(select);
			guessingGrid.appendChild(guessDiv);
		});
	}

	submitGuesses() {
		const allGuessed = this.answers.every((_, index) => {
			const select = document.getElementById(`guess-${index}`);
			return select.value !== '';
		});
		
		if (!allGuessed) {
			alert('Please make a guess for all answers.');
			return;
		}
		
		// Collect guesses
		this.answers.forEach((_, index) => {
			const select = document.getElementById(`guess-${index}`);
			this.guesses[index] = select.value;
		});
		
		this.calculateResults();
	}

	calculateResults() {
		const results = [];
		const teamChanges = [];
		
		this.answers.forEach((item, index) => {
			const guessedPlayer = this.guesses[index];
			const correctPlayer = item.player;
			const isCorrect = guessedPlayer === correctPlayer;
			
			if (isCorrect && correctPlayer !== 'FAKE') {
				this.scores[correctPlayer]++;
				
				// Check if this creates a team change
				const guesserTeam = this.findPlayerTeam(guessedPlayer);
				const correctTeam = this.findPlayerTeam(correctPlayer);
				
				if (guesserTeam !== correctTeam) {
					teamChanges.push({
						guesser: guessedPlayer,
						correct: correctPlayer,
						answer: item.answer
					});
				}
			}
			
			results.push({
				answer: item.answer,
				correctPlayer: correctPlayer,
				guessedPlayer: guessedPlayer,
				isCorrect: isCorrect
			});
		});
		
		this.processTeamChanges(teamChanges);
		this.showResults(results, teamChanges);
	}

	findPlayerTeam(player) {
		return this.teams.find(team => team.members.includes(player));
	}

	processTeamChanges(teamChanges) {
		teamChanges.forEach(change => {
			const guesserTeam = this.findPlayerTeam(change.guesser);
			const correctTeam = this.findPlayerTeam(change.correct);
			
			if (guesserTeam && correctTeam && guesserTeam !== correctTeam) {
				// Move the correct player to the guesser's team
				correctTeam.members = correctTeam.members.filter(member => member !== change.correct);
				guesserTeam.members.push(change.correct);
				
				// Remove empty teams
				this.teams = this.teams.filter(team => team.members.length > 0);
			}
		});
	}

	showResults(results, teamChanges) {
		this.showScreen('game-screen');
		this.showPhase('results-phase');
		const resultsContent = document.getElementById('results-content');
		resultsContent.innerHTML = '';
		
		// Show team changes first
		if (teamChanges.length > 0) {
			const teamChangesDiv = document.createElement('div');
			teamChangesDiv.className = 'result-item';
			teamChangesDiv.style.borderLeftColor = '#ffc107';
			
			let teamChangesText = '<h4>🏆 Team Changes!</h4>';
			teamChanges.forEach(change => {
				teamChangesDiv.innerHTML += `
					<div class="result-details">
						<strong>${change.guesser}</strong> correctly guessed <strong>${change.correct}</strong>'s answer: "${change.answer}"
						<br>${change.correct} has joined ${change.guesser}'s team!
					</div>
				`;
			});
			
			resultsContent.appendChild(teamChangesDiv);
		}
		
		// Show individual results
		results.forEach((result, index) => {
			const resultDiv = document.createElement('div');
			resultDiv.className = `result-item ${result.isCorrect ? '' : 'incorrect'}`;
			
			let details = '';
			if (result.correctPlayer === 'FAKE') {
				details = `This was a fake answer! ${result.guessedPlayer} guessed it was ${result.guessedPlayer}.`;
			} else {
				details = `${result.guessedPlayer} guessed it was ${result.guessedPlayer}. ${result.isCorrect ? 'Correct!' : `Wrong! It was actually ${result.correctPlayer}.`}`;
			}
			
			resultDiv.innerHTML = `
				<h4>Answer ${index + 1}: ${result.answer}</h4>
				<div class="result-details">${details}</div>
			`;
			
			resultsContent.appendChild(resultDiv);
		});
	}

	showTeamManagement() {
		this.showScreen('teams-screen');
		this.updateTeamDisplay();
		this.updateTeamControls();
	}

	updateTeamDisplay() {
		const teamsDisplay = document.getElementById('teams-display');
		teamsDisplay.innerHTML = '';
		
		this.teams.forEach(team => {
			const teamDiv = document.createElement('div');
			teamDiv.className = 'team';
			
			const membersHtml = team.members.map(member => 
				`<span class="team-member">${member}</span>`
			).join('');
			
			teamDiv.innerHTML = `
				<div class="team-header">
					<span class="team-name">Team ${team.leader}</span>
					<span class="team-leader">Leader</span>
				</div>
				<div class="team-members">
					${membersHtml}
				</div>
			`;
			
			teamsDisplay.appendChild(teamDiv);
		});
	}

	updateTeamControls() {
		const playerSelect = document.getElementById('player-select');
		const teamSelect = document.getElementById('team-select');
		
		// Update player select
		playerSelect.innerHTML = '<option value="">Select a player...</option>';
		this.players.forEach(player => {
			const option = document.createElement('option');
			option.value = player;
			option.textContent = player;
			playerSelect.appendChild(option);
		});
		
		// Update team select
		teamSelect.innerHTML = '<option value="">Select a team...</option>';
		this.teams.forEach(team => {
			const option = document.createElement('option');
			option.value = team.leader;
			option.textContent = `Team ${team.leader}`;
			teamSelect.appendChild(option);
		});
	}

	movePlayer() {
		const player = document.getElementById('player-select').value;
		const teamLeader = document.getElementById('team-select').value;
		
		if (!player || !teamLeader) {
			alert('Please select both a player and a team.');
			return;
		}
		
		const targetTeam = this.teams.find(team => team.leader === teamLeader);
		const currentTeam = this.findPlayerTeam(player);
		
		if (currentTeam && targetTeam && currentTeam !== targetTeam) {
			// Remove player from current team
			currentTeam.members = currentTeam.members.filter(member => member !== player);
			
			// Add player to target team
			targetTeam.members.push(player);
			
			// Remove empty teams
			this.teams = this.teams.filter(team => team.members.length > 0);
			
			this.updateTeamDisplay();
			this.updateTeamControls();
		}
	}

	backToGame() {
		this.showScreen('game-screen');
		this.showPhase('results-phase');
	}

	continueFromTeams() {
		this.showScreen('game-screen');
		this.showPhase('results-phase');
	}

	nextRound() {
		this.currentRound++;
		this.startRound();
	}

	endGame() {
		// Directly reveal all answers on end game
		this.showRevealScreen();
	}

	showFinalResults() {
		this.showScreen('final-screen');
		
		const finalScores = document.getElementById('final-scores');
		finalScores.innerHTML = '';
		
		// Sort players by score
		const sortedPlayers = Object.entries(this.scores)
			.sort(([,a], [,b]) => b - a);
		
		sortedPlayers.forEach(([player, score], index) => {
			const scoreDiv = document.createElement('div');
			scoreDiv.className = `score-item ${index === 0 ? 'winner' : ''}`;
			
			scoreDiv.innerHTML = `
				<span class="score-name">${player}</span>
				<span class="score-points">${score} points</span>
			`;
			
			finalScores.appendChild(scoreDiv);
		});
		
		// Add reveal button
		const revealButton = document.createElement('button');
		revealButton.className = 'btn btn-secondary';
		revealButton.textContent = 'Reveal All Answers';
		revealButton.style.marginTop = '20px';
		revealButton.addEventListener('click', () => this.showRevealScreen());
		finalScores.appendChild(revealButton);
	}

	showRevealScreen() {
		this.showScreen('reveal-screen');
		this.createRevealContent();
	}

	createRevealContent() {
		const revealContent = document.getElementById('reveal-content');
		revealContent.innerHTML = '';
		
		// Display all answers in the requested format
		this.allAnswers.forEach((answer, index) => {
			const answerDiv = document.createElement('div');
			answerDiv.className = `reveal-item ${answer.player === 'FAKE' ? 'fake' : 'real'}`;
			
			const playerLabel = answer.player === 'FAKE' ? 'FAKE' : answer.player;
			answerDiv.innerHTML = `
				<div class="answer-text"><strong>${answer.answer} - ${playerLabel}</strong></div>
			`;
			
			revealContent.appendChild(answerDiv);
		});
	}

	playAgain() {
		this.currentRound = 1;
		this.scores = {};
		this.teams = [];
		this.allAnswers = [];
		
		// Restore saved player names instead of clearing them
		this.loadSavedPlayerNames();
		
		// Auto-fill the player name inputs with saved names
		this.populatePlayerNameInputs();
		
		this.showScreen('setup-screen');
	}

	showScreen(screenId) {
		document.querySelectorAll('.screen').forEach(screen => {
			screen.classList.remove('active');
		});
		document.getElementById(screenId).classList.add('active');
	}

	showPhase(phaseId) {
		document.querySelectorAll('.phase').forEach(phase => {
			phase.classList.remove('active');
		});
		document.getElementById(phaseId).classList.add('active');
		
		// Hide round counter and player display for end-game phase and reading phase
		const roundInfo = document.getElementById('round-info');
		const currentPlayer = document.getElementById('current-player');
		
		if (phaseId === 'end-game-phase' || phaseId === 'reading-phase') {
			roundInfo.style.display = 'none';
			currentPlayer.style.display = 'none';
		} else {
			roundInfo.style.display = 'inline';
			currentPlayer.style.display = 'inline';
		}
	}

	updateGameInfo() {
		document.getElementById('category-text').textContent = this.currentCategory;
		document.getElementById('round-number').textContent = this.currentRound;
	}

	loadSavedPlayerNames() {
		const savedPlayerNames = localStorage.getItem('playerNames');
		if (savedPlayerNames) {
			this.playerNames = JSON.parse(savedPlayerNames);
			this.players = [...this.playerNames]; // Ensure players array is updated
		}
	}

	savePlayerNames() {
		localStorage.setItem('playerNames', JSON.stringify(this.playerNames));
	}
	
	populatePlayerNameInputs() {
		const playerNameInputs = document.querySelectorAll('.player-name-input');
		
		// Clear all inputs first
		playerNameInputs.forEach(input => {
			input.value = '';
			input.classList.remove('auto-filled');
		});
		
		// Fill in saved player names
		if (this.playerNames && this.playerNames.length > 0) {
			this.playerNames.forEach((name, index) => {
				if (playerNameInputs[index]) {
					playerNameInputs[index].value = name;
					playerNameInputs[index].classList.add('auto-filled');
				}
			});
		}
		
		// Add event listeners to remove auto-filled class when user starts typing
		playerNameInputs.forEach(input => {
			input.addEventListener('input', () => {
				input.classList.remove('auto-filled');
			});
		});
	}
	
	clearSavedNames() {
		// Clear from localStorage
		localStorage.removeItem('playerNames');
		
		// Clear from memory
		this.playerNames = [];
		this.players = [];
		
		// Clear all input fields
		const playerNameInputs = document.querySelectorAll('.player-name-input');
		playerNameInputs.forEach(input => {
			input.value = '';
		});
		
		// Show confirmation
		alert('Saved player names have been cleared. You can now enter new names.');
	}
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
	new EmpiresGame();
}); 