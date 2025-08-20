# Empires Game

A modern web-based implementation of the classic "Empires" guessing game with team formation mechanics where players try to identify who said what and form alliances.

## How to Play

### Game Setup
1. **Number of Players**: Choose between 2-12 players
2. **Fake Entries**: Select how many fake answers to add (1-5)
3. **Start Game**: Players will be automatically assigned as Player 1, Player 2, etc.

### Game Flow

#### 1. Input Phase
- Ask each player for their answer in real life
- **Hidden Input System**: Only the current player's input field is active - others are hidden to prevent cheating
- Enter answers one by one as each player provides them
- **No Duplicate Answers**: Each answer must be unique - the game will warn you if duplicates are entered
- Submit all answers when ready

#### 2. Reading Phase
- All answers (including fake ones) are displayed as a numbered list
- The answers are read twice to help players remember them
- After the second reading, answers are hidden

#### 3. Guessing Phase
- Players try to guess which player wrote each answer
- Each answer must be assigned to a player
- Players can guess their own answers

#### 4. Results Phase
- Points are awarded for correct guesses
- **Team Formation**: When a player correctly guesses another player's answer, the guessed player joins the guesser's team
- Results show who guessed what and whether they were correct
- Team changes are highlighted with special formatting

#### 5. Team Management (Optional)
- After each round, you can manually manage teams
- Move players between teams using the dropdown menus
- Visual display shows all current teams and their members
- Continue to next round when ready

#### 6. Final Results & Reveal
- When the game ends, final scores are displayed
- **Reveal All Answers**: Click the reveal button to see which answer belonged to which player
- All answers from all rounds are shown, clearly marked as real or fake
- Perfect for settling debates and revealing the truth!

### Team Mechanics

#### Automatic Team Formation
- **Starting Teams**: Each player begins in their own team
- **Team Merging**: When Player A correctly guesses Player B's answer, Player B joins Player A's team
- **Team Leaders**: The player who successfully recruited others becomes the team leader
- **Empty Teams**: Teams with no members are automatically removed

#### Manual Team Management
- **Move Players**: Use the team management screen to manually move players between teams
- **Visual Display**: See all teams and their current members
- **Flexible Control**: Adjust teams as needed between rounds

### Scoring
- **Correct Guess**: 1 point for the player whose answer was correctly identified
- **Fake Answers**: No points awarded (these are just to make guessing harder)
- **Team Benefits**: Being on a larger team increases your chances of scoring points
- **Multiple Rounds**: Play multiple rounds to accumulate points
- **Winner**: Player with the most points at the end

### Features

- **Modern UI**: Beautiful, responsive design that works on all devices
- **Hidden Input System**: Prevents cheating by hiding other players' entries during input
- **Duplicate Prevention**: Real-time checking prevents duplicate answers
- **Team Formation**: Automatic and manual team management
- **Random Categories**: 20 different categories including Animals, Movies, Celebrities, etc.
- **Fake Entries**: Configurable number of fake answers to increase difficulty
- **Score Tracking**: Automatic point calculation and leaderboard
- **Visual Team Display**: Clear visualization of team structures
- **Final Reveal**: Complete reveal of all answers at the end of the game
- **Multiple Rounds**: Play as many rounds as you want
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## How to Run

1. Download all files (`index.html`, `styles.css`, `script.js`)
2. Open `index.html` in any modern web browser
3. No internet connection required - everything runs locally

## Game Categories

The game includes 20 randomly selected categories:
- Animals
- Fruits
- Countries
- Celebrities
- Movies
- Books
- Sports
- Food
- Colors
- Cities
- Jobs
- Hobbies
- Musical Instruments
- Famous Landmarks
- Superheroes
- Video Games
- TV Shows
- Historical Figures
- Inventions
- Plants

## Tips for Playing

1. **Be Creative**: Try to think of unique answers that others might not guess
2. **Pay Attention**: Listen carefully during the reading phase
3. **Consider Personalities**: Think about each player's interests and writing style
4. **Fake Answers**: Remember that some answers are fake and don't belong to anyone
5. **Team Strategy**: Forming teams can help you score more points
6. **Multiple Rounds**: The more rounds you play, the better you'll get at guessing
7. **Unique Answers**: Make sure each player gives a different answer to avoid conflicts
8. **Hidden Input**: Only the current player's input is visible to prevent accidental cheating

## Team Strategy

- **Early Game**: Focus on guessing correctly to build your team
- **Mid Game**: Use your team's combined knowledge to make better guesses
- **Late Game**: Larger teams have more opportunities to score points
- **Manual Management**: Use the team management screen to optimize team composition

## Final Reveal

At the end of the game, you can reveal all answers to see:
- Which answer belonged to which player
- Which answers were fake
- All answers organized by round and category
- Perfect for settling any disputes or satisfying curiosity!

Enjoy playing Empires! 🎮 