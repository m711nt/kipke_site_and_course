document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const playerNameInput = document.getElementById('player-name');

    authForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const playerName = playerNameInput.value.trim();

        if (playerName) {
            localStorage.setItem('playerName', playerName);
            window.location.href = 'game.html';
        } else {
            alert('Пожалуйста, введите своё имя.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const difficultyScreen = document.getElementById('difficulty-selection');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const submitButton = document.getElementById('submit-btn');
    const nextLevelButton = document.getElementById('next-level-btn');
    const resultMessage = document.getElementById('result-message');
    const intermediateScore = document.getElementById('intermediate-score');
    const restartButton = document.getElementById('restart-btn');
    const restartButtonResult = document.getElementById('restart-btn-result');
    const answersContainer = document.getElementById('answers');

    let timer;
    let timeRemaining;
    let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score'), 10) : 0;
    let difficulty;
    let level = 1;
    let selectedAnswer = null;
    let correctAnswerIndex;
    let stopwatchInterval; 
    let totalElapsedTime = 0; 

    const startStopwatch = () => {
        totalElapsedTime = 0; 
        stopwatchInterval = setInterval(() => {
            totalElapsedTime++;
        }, 1000);
    };

    const stopStopwatch = () => {
        clearInterval(stopwatchInterval);
    };


    const updateTimerDisplay = () => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const startTimer = () => {
        timer = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (timeRemaining <= 0) {
                clearInterval(timer);
                endGame(false);
            }
        }, 1000);
    };

    const startGame = (selectedDifficulty) => {
        difficulty = selectedDifficulty;
        timeRemaining = difficulty === 'novice' ? 30 : 15;
    
        if (level === 1) {
            startStopwatch();
        }
    
        difficultyScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    
        updateTimerDisplay();
        startTimer();
    
        generateQuestion();
    };

    const generateQuestion = () => {
        const questions = [
            { id: 1, answerClass: 'answer1' },
            { id: 2, answerClass: 'answer2' },
            { id: 3, answerClass: 'answer3' },
            { id: 4, answerClass: 'answer4' },
            { id: 5, answerClass: 'answer5' }
        ];
    
       
        const question = questions[Math.floor(Math.random() * questions.length)];
        correctAnswerIndex = question.id;
    
      
        const questionElement = document.getElementById('question');
        questionElement.className = question.answerClass;
    
        const shuffledAnswers = [...questions];
        shuffledAnswers.sort(() => Math.random() - 0.5);
    
       
        answersContainer.innerHTML = '';
        shuffledAnswers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.classList.add('answer', answer.answerClass);
            answerElement.setAttribute('data-id', answer.id);
    
            if (level === 1) {
               
                switch (index) {
                    case 0:
                        answerElement.classList.add('answer-moving-updown');
                        break;
                    case 1:
                        answerElement.classList.add('answer-moving-leftright');
                        break;
                    case 2:
                        answerElement.classList.add('answer-moving-circle');
                        break;
                    case 3:
                        answerElement.classList.add('answer-moving-diagonal');
                        break;
                    case 4:
                        break;
                }
            }
            
             else if (level === 2) {
                const rotations = ['rotate(-90deg)', 'rotate(90deg)', 'rotate(180deg)'];
                const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
            
                answerElement.style.transition = 'transform 0.5s ease-in-out';
                answerElement.style.transform = randomRotation;
            
                const maskElement = document.createElement('div');
                maskElement.style.position = 'absolute';
                maskElement.style.top = '0';
                maskElement.style.left = '0';
                maskElement.style.width = '100%';
                maskElement.style.height = '100%';
                maskElement.style.pointerEvents = 'none';
                maskElement.style.backgroundImage = `repeating-linear-gradient(
                    45deg, 
                    black 0%, 
                    black ${Math.random() * 3 + 1}px, 
                    white ${Math.random() * 5 + 4}px
                )`;
            
                maskElement.style.zIndex = '1';
                maskElement.style.opacity = '0.6';
            
                answerElement.style.position = 'relative';
                answerElement.appendChild(maskElement);
            
                answerElement.addEventListener('mouseenter', () => {
                    answerElement.style.transform = 'rotate(360deg)';
                });
            
                answerElement.addEventListener('mouseleave', () => {
                    answerElement.style.transform = randomRotation;
                });
            } 
            else if (level === 3) {
                const rotations = ['rotate(-90deg)', 'rotate(90deg)', 'rotate(180deg)'];
                const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
                
                answerElement.style.transform = randomRotation;
                
                answerElement.style.animation = 'rotationAnimation 2s infinite linear';
                
                const maskElement = document.createElement('div');
                maskElement.style.position = 'absolute';
                maskElement.style.top = '50%';
                maskElement.style.left = '50%';
                maskElement.style.width = '25px'; 
                maskElement.style.height = '25px'; 
                maskElement.style.backgroundColor = 'black';
                maskElement.style.borderRadius = '50%'; 
                maskElement.style.transform = 'translate(-50%, -50%)'; 
                maskElement.style.pointerEvents = 'none'; 
                maskElement.style.zIndex = '1';
                
                answerElement.style.position = 'relative';
                answerElement.appendChild(maskElement);
            }
            
            
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @keyframes rotationAnimation {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styleElement);
            
    
            answerElement.addEventListener('click', () => {
                handleAnswerSelect(answerElement, answer.id);
            });
    
            answersContainer.appendChild(answerElement);
        });
    };
    

    const handleAnswerSelect = (answerElement, answerId) => {
        document.querySelectorAll('.answer').forEach((el) => {
            el.classList.remove('selected');
        });

        answerElement.classList.add('selected');
        selectedAnswer = answerId;
    };

    const endGame = (correct) => {
        clearInterval(timer);
        if (selectedAnswer === correctAnswerIndex) {
            resultMessage.textContent = 'Правильно!';
            score += (difficulty === 'pro' ? 2 : 1); 
            nextLevelButton.classList.remove('hidden'); 
        } else {
            resultMessage.textContent = 'Неправильно или время истекло.';
            score += (difficulty === 'pro' ? -1 : 0); 
        }
        

        localStorage.setItem('score', score);
        scoreElement.textContent = `Баллы: ${score}`;
        intermediateScore.textContent = `Ваши баллы: ${score}`;

        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    };

    submitButton.addEventListener('click', () => {
        endGame(false); 
    });

    nextLevelButton.addEventListener('click', () => {
        if (level < 3) {
            level += 1;
            resultScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            timeRemaining = difficulty === 'novice' ? 60 : 30;
            updateTimerDisplay();
            startTimer();
            generateQuestion();
        } else {
            
            nextLevelButton.classList.add('hidden');
        
      
            resultMessage.textContent = ''; 
            intermediateScore.textContent = ''; 
            restartButtonResult.classList.add('hidden'); 
        
     
            const finishButton = document.createElement('button');
            finishButton.textContent = 'Подвести итоги и посмотреть список рекордов';
            finishButton.className = 'finish-btn';
            finishButton.addEventListener('click', () => {
                stopStopwatch(); 
                localStorage.setItem('finalTime', totalElapsedTime); 
                localStorage.setItem('finalScore', score);
                saveGameResult(); 
                window.location.href = 'finish.html';
            });
            resultScreen.appendChild(finishButton);
        }
        
    });
    

    restartButton.addEventListener('click', () => {

        localStorage.removeItem('finalScore');
        localStorage.removeItem('finalTime');
        localStorage.removeItem('score');
        window.location.href = 'start.html';
        
    });

    restartButtonResult.addEventListener('click', () => {
     

        localStorage.removeItem('finalScore');
        localStorage.removeItem('finalTime');
        localStorage.removeItem('score');
        window.location.href = 'start.html'; 
    });

    document.querySelectorAll('.difficulty-btn').forEach((btn) => {
        btn.addEventListener('dblclick', () => {
            const level = btn.getAttribute('data-level');
            startGame(level);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {

    const playerScoreElement = document.getElementById('player-score');
    const playerTimeElement = document.getElementById('player-time');
    const playAgainButton = document.getElementById('play-again-btn');

    
    const finalScore = localStorage.getItem('finalScore') || 0;
    const finalTime = localStorage.getItem('finalTime') || 0;


    const minutes = Math.floor(finalTime / 60);
    const seconds = finalTime % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  
    playerScoreElement.textContent = `${finalScore} очков`;
    playerTimeElement.textContent = formattedTime;

    playAgainButton.addEventListener('click', (event) => {
        localStorage.removeItem('finalScore');
        localStorage.removeItem('finalTime');
        localStorage.removeItem('score');
        event.preventDefault(); 
        window.location.href = 'start.html';
    });
    
});

function saveGameResult() {
    const playerName = localStorage.getItem('playerName');
    const finalScore = parseInt(localStorage.getItem('finalScore'), 10) || 0;
    const finalTime = parseInt(localStorage.getItem('finalTime'), 10) || 0;

    const gameResults = JSON.parse(localStorage.getItem('gameResults')) || [];
    const existingPlayerIndex = gameResults.findIndex(result => result.name === playerName);

    if (existingPlayerIndex !== -1) {
        const existingPlayer = gameResults[existingPlayerIndex];
        if (finalScore > existingPlayer.score || finalTime < existingPlayer.time) {
            gameResults[existingPlayerIndex] = {
                name: playerName,
                time: Math.min(existingPlayer.time, finalTime), 
                score: Math.max(existingPlayer.score, finalScore) 
            };
        }
    } else {
        gameResults.push({
            name: playerName,
            time: finalTime,
            score: finalScore
        });
    }

    localStorage.setItem('gameResults', JSON.stringify(gameResults));
}





document.addEventListener('DOMContentLoaded', () => {
    const scoreTableBody = document.getElementById('score-table').querySelector('tbody');
    const gameResults = JSON.parse(localStorage.getItem('gameResults')) || [];

    gameResults.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="drag-handle">⬛</td>
            <td>${result.name}</td>
            <td>${formatTime(result.time)}</td>
            <td>${result.score}</td>
        `;
        scoreTableBody.appendChild(row);
    });

    enableRowDragging();

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
});

function enableRowDragging() {
    const rows = document.querySelectorAll('#score-table tbody tr');

    let draggedRow = null;
    let touchStartY = 0;

    rows.forEach(row => {
        const handle = row.querySelector('.drag-handle'); 
        if (!handle) return;

    
        handle.addEventListener('mousedown', () => {
            row.setAttribute('draggable', 'true');
        });

        handle.addEventListener('mouseup', () => {
            row.removeAttribute('draggable');
        });

        row.addEventListener('dragstart', (e) => {
            draggedRow = row;
            e.dataTransfer.setData('text/html', row.outerHTML);
            row.classList.add('dragging');
        });

        row.addEventListener('dragover', (e) => {
            e.preventDefault();
            const targetRow = e.target.closest('tr');
            if (targetRow && targetRow !== draggedRow) {
                targetRow.parentNode.insertBefore(draggedRow, targetRow.nextSibling);
            }
        });

        row.addEventListener('dragend', () => {
            draggedRow.classList.remove('dragging');
            draggedRow = null;
        });

        handle.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            draggedRow = row;
            row.classList.add('dragging');
        });

        handle.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            const rows = Array.from(document.querySelectorAll('#score-table tbody tr'));
            const currentRowIndex = rows.indexOf(draggedRow);
            
            rows.forEach((otherRow, index) => {
                const otherRowRect = otherRow.getBoundingClientRect();
                if (
                    index !== currentRowIndex &&
                    touchY > otherRowRect.top &&
                    touchY < otherRowRect.bottom
                ) {
                    if (touchY < otherRowRect.top + otherRowRect.height / 2) {
                        otherRow.parentNode.insertBefore(draggedRow, otherRow);
                    } else {
                        otherRow.parentNode.insertBefore(draggedRow, otherRow.nextSibling);
                    }
                }
            });
        });

        handle.addEventListener('touchend', () => {
            row.classList.remove('dragging');
            draggedRow = null;
        });
    });
}


document.getElementById('clear-data-btn').addEventListener('click', () => {
    localStorage.removeItem('gameResults');
    const scoreTableBody = document.getElementById('score-table').querySelector('tbody');
    scoreTableBody.innerHTML = '';

    alert('Данные успешно удалены!');
});
