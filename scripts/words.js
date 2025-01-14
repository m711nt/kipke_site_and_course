const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const parseButton = document.getElementById("parse-button");
const verticalBlockLeft = document.querySelector(".vertical-block-left");
const horizontalBlock = document.querySelector(".horizontal-block");
const container = document.querySelector(".container");


function resetElements() {
    verticalBlockLeft.innerHTML = ""; 
    outputText.value = ""; 
    horizontalBlock.innerHTML = ""; 
    container.style.height = "500px"; 
}


parseButton.addEventListener("click", () => {
    const input = inputText.value.trim();

    
    resetElements();

    
    if (!input) {
    return;
    }

   
    const elements = input.split(/\s*-\s*|\s*—\s*/).map(item => item.trim()).filter(Boolean);
    
    
    const wordsLowercase = [];
    const wordsUppercase = [];
    const numbers = [];

    
    elements.forEach(element => {
        element = element.replace(/[-—]/g, '').trim();

        if (!isNaN(element)) {
            numbers.push(parseInt(element, 10));
        } else if (element.charAt(0) === element.charAt(0).toUpperCase()) {
            wordsUppercase.push(element);
        } else {
            wordsLowercase.push(element);
        }
    });

    
    wordsLowercase.sort((a, b) => a.localeCompare(b));
    wordsUppercase.sort((a, b) => a.localeCompare(b));
    numbers.sort((a, b) => a - b);

   
    const resultMap = {};
    let index = 1;

    
    wordsLowercase.forEach(word => {
        resultMap[`a${index}`] = word;
        index++;
    });

   
    index = 1;
    wordsUppercase.forEach(word => {
        resultMap[`b${index}`] = word;
        index++;
    });

   
    index = 1;
    numbers.forEach(number => {
        resultMap[`n${index}`] = number;
        index++;
    });


 
    displayResults(resultMap);
});


function displayResults(resultMap) {
    verticalBlockLeft.innerHTML = ""; 

    const entries = Object.entries(resultMap);
    const totalItems = entries.length;

    
    const increaseStep = 16;
    const baseHeight = 500;
    const additionalHeight = Math.floor(totalItems / increaseStep) * baseHeight;

  
    container.style.height = `${baseHeight + additionalHeight}px`;

    
    entries.forEach(([key, value], index) => {
        const item = document.createElement("div");
        item.textContent = `${key}: ${value}`;
        item.style.width = "100px";
        item.style.height = "25px";
        const originalColor = getRandomColor();
        item.style.backgroundColor = originalColor;
        item.style.color = "#fff";
        item.style.margin = "5px auto";
        item.style.display = "flex";
        item.style.justifyContent = "center";
        item.style.alignItems = "center";
        item.style.borderRadius = "5px";
        item.draggable = true; 

       
        item.setAttribute("data-original-color", originalColor);
        
        
        item.setAttribute("data-original-index", index);

        item.addEventListener("click", () => {
            if (horizontalBlock.contains(item)) {
                
                const word = item.textContent.split(": ")[1];
        
                
                outputText.value += (outputText.value ? " " : "") + word;
            }
        });

        
        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text", e.target.textContent); 
        });

        
        verticalBlockLeft.appendChild(item);

        
        horizontalBlock.addEventListener("dragover", (e) => {
            e.preventDefault(); 
        });

        horizontalBlock.addEventListener("drop", (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text");

            
            const draggedItem = Array.from(verticalBlockLeft.children).find(child => child.textContent === data);

            if (draggedItem) {
                
                verticalBlockLeft.removeChild(draggedItem);
                horizontalBlock.appendChild(draggedItem);

                
                draggedItem.style.backgroundColor = "black";

                
                draggedItem.style.position = "absolute";
                draggedItem.style.left = `${e.clientX - horizontalBlock.offsetLeft - 100}px`; 
                draggedItem.style.top = `${e.clientY - horizontalBlock.offsetTop - 37}px`; 
            }
        });

        
        verticalBlockLeft.addEventListener("dragover", (e) => {
            e.preventDefault(); 
        });

        verticalBlockLeft.addEventListener("drop", (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text");

            
            const draggedItem = Array.from(horizontalBlock.children).find(child => child.textContent === data);

            if (draggedItem) {
                
                horizontalBlock.removeChild(draggedItem);
                verticalBlockLeft.appendChild(draggedItem);

                
                const originalColor = draggedItem.getAttribute("data-original-color");
                draggedItem.style.backgroundColor = originalColor;

                
                draggedItem.style.position = "relative"; 
                draggedItem.style.left = "0"; 
                draggedItem.style.top = "0"; 

                
                const sortedItems = Array.from(verticalBlockLeft.children)

                .sort((a, b) => {
                const indexA = parseInt(a.getAttribute("data-original-index"));
                const indexB = parseInt(b.getAttribute("data-original-index"));
                return indexA - indexB; 
                });

                
                sortedItems.forEach(item => {
                    verticalBlockLeft.appendChild(item);
                });
            }
        });

       
        horizontalBlock.addEventListener("dragover", (e) => {
            e.preventDefault(); 
        });

        horizontalBlock.addEventListener("drop", (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text");

            
            const draggedItem = Array.from(horizontalBlock.children).find(child => child.textContent === data);

            if (draggedItem) {
                
                draggedItem.style.position = "absolute";
                draggedItem.style.left = `${e.clientX - horizontalBlock.offsetLeft - 100}px`;
                draggedItem.style.top = `${e.clientY - horizontalBlock.offsetTop - 37}px`;
            }
        });
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

