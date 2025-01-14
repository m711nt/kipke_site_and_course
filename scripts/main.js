const questions = [
    {
        question: "Если человека назвали мордофиля, то это...",
        answers: [
            { text: "Значит, что он тщеславный.", correct: true, explanation: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный." },
            { text: "Значит, что у него лицо как у хряка.", correct: false },
            { text: "Значит, что чумазый.", correct: false }
        ]
    },
    {
        question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
        answers: [
            { text: "Он маленький и невзрачный.", correct: true, explanation: "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи." },
            { text: "Он тот еще алкоголик.", correct: false },
            { text: "Он не держит свое слово.", correct: false }
        ]
    },
    {
        question: "Если человека прозвали пятигузом, значит, он...",
        answers: [
            { text: "Не держит слово.", correct: true, explanation: "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек." },
            { text: "Изменяет жене.", correct: false },
            { text: "Без гроша в кармане.", correct: false }
        ]
    },
    {
        question: "Кто такой шлындра?",
        answers: [
            { text: "Обманщик.", correct: false },
            { text: "Нытик.", correct: false },
            { text: "Бродяга.", correct: true, explanation: "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться." }
        ]
    }
];

function shuffleQuestions(array) {
    return array.sort(() => Math.random() - 0.5);
}

let shuffledQuestions = shuffleQuestions([...questions]); 
let currentQuestionIndex = 0; 
let correctAnswersCount = 0; 

const leftButton = document.querySelector('.left-button');

function showNextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length) {
        const question = shuffledQuestions[currentQuestionIndex];
        
        const questionContainer = document.createElement('div');
        questionContainer.style.display = 'flex';
        questionContainer.style.alignItems = 'center'; 
        questionContainer.style.marginBottom = '10px'; 
        questionContainer.style.marginTop = '40px'; 
        questionContainer.style.paddingTop = '40px'; 
        questionContainer.classList.add('question-container'); 
        
        const questionButton = document.createElement('button');
        questionButton.textContent = `${currentQuestionIndex + 1}. ${question.question}`; 
        questionButton.style.marginRight = '20px'; 
        questionButton.style.width = '400px'; 
        questionButton.style.height = '140px'; 
        questionButton.style.cursor = 'pointer';
        questionButton.style.backgroundColor = '#f0f0f0';
        questionButton.style.border = '1px solid #ccc';
        
        questionContainer.appendChild(questionButton);
        
        const answersContainer = document.createElement('div');
        answersContainer.style.display = 'flex';
        answersContainer.style.gap = '10px'; 
        answersContainer.style.transition = 'transform 0.5s ease, opacity 0.5s ease'; 
        answersContainer.style.opacity = '1'; 
        answersContainer.classList.add('answers-container'); 
        
        
        let answered = false;
        
        question.answers.forEach(answer => {
            const answerButton = document.createElement('button');
            answerButton.textContent = answer.text;
            answerButton.style.width = '250px';
            answerButton.style.height = '70px'; 
            answerButton.style.backgroundColor = '#f0f0f0';
            answerButton.style.border = '1px solid #ccc';
            answerButton.style.cursor = 'pointer';
            
            answerButton.addEventListener('click', () => {
                if (!answered) {
                
                    answerButton.classList.add('shake');
                    
                    if (answer.correct) {
                        questionButton.style.backgroundColor = '#A8E6CF'; 
                        correctAnswersCount++;
                        
                        
                        answerButton.style.height = '140px';
                        const explanationDiv = document.createElement('div');
                        explanationDiv.textContent = answer.explanation;
                        explanationDiv.style.marginTop = '10px';
                        explanationDiv.style.fontSize = '14px';
                        explanationDiv.style.color = '#333';
                        explanationDiv.classList.add('explanation'); 
                        answerButton.appendChild(explanationDiv);
                        
                        setTimeout(() => {
                            answersContainer.childNodes.forEach(btn => {
                                if (!btn.textContent.includes(answer.text)) {
                                    btn.classList.add('hide'); 
                                }
                            });
                        }, 500);
                        
                    } else {
                        questionButton.style.backgroundColor = '#FFABAB'; 
                        
                        setTimeout(() => {
                            answersContainer.childNodes.forEach(btn => {
                                btn.classList.add('hide'); 
                            });
                        }, 500);
                    }
                    
                    leftButton.disabled = false;
                    answered = true;
                }
    
            });
            
            answersContainer.appendChild(answerButton);
        });
        
        questionContainer.appendChild(answersContainer);
        document.body.appendChild(questionContainer);

        questionButton.addEventListener('click', () => {
            if (currentQuestionIndex >= shuffledQuestions.length) {
                const correctAnswer = question.answers.find(a => a.correct).text; 
                const explanationText = question.answers.find(a => a.correct).explanation;
                alert(`Правильный ответ: ${correctAnswer}\n\n${explanationText}`);
                
            }
        });

        currentQuestionIndex++;
    } else {
        const endMessage = document.createElement('div');
        endMessage.textContent = "Вопросы закончились!";
        endMessage.style.fontSize = '24px';
        endMessage.style.fontWeight = 'bold';
        endMessage.style.marginTop = '10px';
        document.body.appendChild(endMessage);
        
        const statisticsMessage = document.createElement('div');
        statisticsMessage.textContent = `Правильных ответов: ${correctAnswersCount} из ${shuffledQuestions.length}`;
        statisticsMessage.style.fontSize = '20px';
        statisticsMessage.style.marginTop = '10px';
        document.body.appendChild(statisticsMessage);
        
        leftButton.disabled = true; 
    }
}

leftButton.addEventListener('click', () => {
    if (currentQuestionIndex === 0 || !leftButton.disabled) {
        const answerButtons = document.querySelectorAll('.answers-container button');
        
        setTimeout(() => {
            answerButtons.forEach(btn => {
                btn.classList.add('hide'); 
            });
        }, 1000); 
        
        showNextQuestion();
    }
    leftButton.disabled = true; 
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.getElementById('mobileLinks');

    mobileMenu.addEventListener('click', () => {
        mobileLinks.classList.toggle('active'); 
        if (mobileLinks.classList.contains('active')) {
            mobileLinks.style.display = 'flex';
        } else {
            mobileLinks.style.display = 'none';
        }
    });
});

