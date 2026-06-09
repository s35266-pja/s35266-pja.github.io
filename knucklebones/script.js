const rollButton = document.getElementById('roll-button');
const diceImage = document.getElementById('dice-image');
const cells = document.querySelectorAll('.grid div');
const playerCol1Score= document.getElementById('player-col-1')
const playerCol2Score= document.getElementById('player-col-2')
const playerCol3Score= document.getElementById('player-col-3')
const playerTotal= document.getElementById('player-total')

let currentDiceValue = 0;
let isRolled = false;

const botCol1Score= document.getElementById('bot-col-1')
const botCol2Score= document.getElementById('bot-col-2')
const botCol3Score= document.getElementById('bot-col-3')
const botTotal= document.getElementById('bot-total')


function updateCell(cell, value){
    const textNode = cell.querySelector('.cell-text');
    if(textNode !== null){textNode.textContent = value}

    const allSvg = cell.querySelectorAll('.dice-svg')
    allSvg.forEach(function(svg){
        svg.style.display = 'none'
    })
    if(parseInt(value)>0)
    {
        const targetSvg = cell.querySelector(".dice-"+ value)
        if(targetSvg!==null)
        {
            targetSvg.style.display ='block'
        }
    
    }
}

function getValue(cell)
{
    const textNode = cell.querySelector(".cell-text");
    return textNode?parseInt(textNode.textContent) || 0 : 0;
}



function handleRoll(){
    if(isRolled)
    {
        alert('Już rzuciłeś')
        return;
    }
    else
    {
        const diceResult = Math.floor(Math.random() * 6) + 1
        diceImage.src =  diceResult +  '.png'
        diceImage.style.display = 'block'
        currentDiceValue = diceResult;
        isRolled = true;
    }
    
}
rollButton.addEventListener('mouseenter', function(){
    rollButton.style.backgroundColor = '#d32626';
});
rollButton.addEventListener('mouseleave', function() {
    rollButton.style.backgroundColor = '';
});
rollButton.addEventListener('click', handleRoll);
diceImage.addEventListener('dragstart', function(event){
    event.dataTransfer.setData('text/plain', currentDiceValue);
});
function calculateCollumns(num,num1,num2)
{
    let colScore = 0;
    let counts = {}
    let collumn = [num,num1,num2]

    collumn.forEach(function(num)
    {
        if(num>0)
        {
            if (counts[num] === undefined)
            {
                counts[num] = 1
            }
            else
            {
                counts[num]+=1
            }
        }
    })
    for(let key in counts)
        {
            let value = parseInt(key)
            let count = counts[key]
            colScore += (value * count) * count

        }
    return[colScore,counts];    
}

function zeroCounter()
{
    const playerCells = document.querySelectorAll('.grid[data-player="player"] div');
    const botCells = document.querySelectorAll('.grid[data-player="bot"] div')

    let playerZeroCount = 0;
    playerCells.forEach(function(cell)
    {
        if (getValue(cell) === 0) { playerZeroCount++; }
    })


    let botZeroCount = 0
    botCells.forEach(function(cell)
    {
        if (getValue(cell) === 0) { botZeroCount++; }
    })
    return [botZeroCount, playerZeroCount];
}

function cellsReset()
{
    const cells = document.querySelectorAll('.grid div');

    cells.forEach(function(cell)
    {
        updateCell(cell,0);
        cell.style.backgroundColor = '#333333'
    })
    botTotal.textContent = 0
    playerTotal.textContent = 0
    botCol1Score.textContent = 0
    botCol2Score.textContent = 0
    botCol3Score.textContent = 0
    playerCol1Score.textContent =  0
    playerCol2Score.textContent = 0
    playerCol3Score.textContent = 0
}


cells.forEach(function(cell){
    cell.addEventListener('dragover', function(event){event.preventDefault();});
    cell.addEventListener('drop',function(event)
    {
        event.preventDefault();
        const parentGrid = cell.closest('.grid');

        const playerType = parentGrid.getAttribute('data-player')
        if (playerType === 'bot' || getValue(cell) > 0){
            alert('NIE RÓB TAK')
            return;
        }
        
        const droppedValue = event.dataTransfer.getData('text/plain');
        if (droppedValue > 0) {
        updateCell(cell,droppedValue);
        diceImage.style.display = 'none';
        currentDiceValue = 0;
        
        let playerCurrentValue = []
        const playerCells = document.querySelectorAll('.grid[data-player="player"] div')
        playerCells.forEach(function(playerCell){
            playerCurrentValue.push(parseInt(getValue(playerCell)))
        })
        let result = calculateCollumns(playerCurrentValue[0], playerCurrentValue[3], playerCurrentValue[6]);
        let result1 = calculateCollumns(playerCurrentValue[1], playerCurrentValue[4], playerCurrentValue[7]);
        let result2 = calculateCollumns(playerCurrentValue[2], playerCurrentValue[5], playerCurrentValue[8]);
        playerCol1Score.textContent = result[0];
        playerCol2Score.textContent = result1[0];
        playerCol3Score.textContent = result2[0];
        playerTotal.textContent = result[0] + result1[0] + result2[0];
        const count = result[1];
        const count1 = result1[1];
        const count2 = result2[1];
        let col1Cells = [playerCells[0], playerCells[3],playerCells[6]];
        let col2Cells = [playerCells[1], playerCells[4],playerCells[7]];
        let col3Cells = [playerCells[2], playerCells[5],playerCells[8]];


        col1Cells.forEach(function(item) {
            let val = getValue(item);
            const rects = item.getElementsByTagName('rect');
            
            if (val > 0 && count[val] === 2) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(255, 251, 0)'; }
            } 
            else if (val > 0 && count[val] === 3) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(155, 255, 250)'; }
            } 
            else if (val > 0) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'white'; }
            }
        });
        col2Cells.forEach(function(item) {
            let val = getValue(item);
            const rects = item.getElementsByTagName('rect');
            
            if (val > 0 && count1[val] === 2) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(255, 251, 0)'; }
            } 
            else if (val > 0 && count1[val] === 3) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(155, 255, 250)'; }
            } 
            else if (val > 0) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'white'; }
            }
        });
        col3Cells.forEach(function(item) {
            let val = getValue(item);
            const rects = item.getElementsByTagName('rect');
            
            if (val > 0 && count2[val] === 2) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(255, 251, 0)'; }
            } 
            else if (val > 0 && count2[val] === 3) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(155, 255, 250)'; }
            } 
            else if (val > 0) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'white'; }
            }
        });
        

        let botCells = document.querySelectorAll('.grid[data-player="bot"] div');


        const playerCellIndex = Array.from(playerCells).indexOf(cell);
        const collumnIndex = playerCellIndex % 3;
        let targetBotCollumn = [botCells[collumnIndex], botCells[collumnIndex + 3], botCells[collumnIndex + 6]];

        targetBotCollumn.forEach(function(bCell)
        {
            let botValue = getValue(bCell);
            if (botValue === parseInt(droppedValue))
            {
                updateCell(bCell, 0);
                bCell.style.backgroundColor = '#333333';
            }    
        });
        

        let isFind = false;
        let attempts = 0;
        while(isFind === false && attempts < 20)
        {
            const randomCell = Math.floor(Math.random() * 9);
            if(getValue(botCells[randomCell]) === 0)
            {
                let diceRollValue =  Math.floor(Math.random() * 6) + 1
                updateCell(botCells[randomCell],diceRollValue);
                botCells[randomCell].style.backgroundColor = "white"
                isFind = true
                
                const botCellIndex = randomCell
                const botCollumnIndex = botCellIndex % 3;
                let targetBotCollumn = [playerCells[botCollumnIndex], playerCells[botCollumnIndex + 3] , playerCells[botCollumnIndex + 6]];

                targetBotCollumn.forEach(function(pCell)
                {
                    playerValue = getValue(pCell)
                    if (playerValue === diceRollValue)
                    {
                        updateCell(pCell, 0)
                        pCell.style.backgroundColor = '#333333'
                    }    
                });
            }
            attempts++;
        }    

        if(isFind === false)
        {
            let i = 0
            while(i < 9)
            {
                if(getValue(botCells[i]) === 0)
                {
                    updateCell(botCells[i], Math.floor(Math.random() * 6) + 1);
                    break;
                }
                i++
            }
            
        }
        bot_currentValue = [];
            botCells.forEach(function(bCell) {
                bot_currentValue.push(getValue(bCell));
            });
        let botResult = calculateCollumns(bot_currentValue[0], bot_currentValue[3], bot_currentValue[6]);
        let botResult1 = calculateCollumns(bot_currentValue[1], bot_currentValue[4], bot_currentValue[7]);
        let botResult2 = calculateCollumns(bot_currentValue[2], bot_currentValue[5], bot_currentValue[8]);
        
        const botCount = botResult[1];
        const botCount1 = botResult1[1];
        const botCount2 = botResult2[1];
        
        let botCol1Cells = [botCells[0], botCells[3],botCells[6]];
        let botCol2Cells = [botCells[1], botCells[4],botCells[7]];
        let botCol3Cells = [botCells[2], botCells[5],botCells[8]];
        
        botCol1Cells.forEach(function(item)
        {
            let val = getValue(item);
            const rects = item.getElementsByTagName('rect');
            if (val > 0 && botCount[val] === 2)
            {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(255, 251, 0)'; }
            } 
            else if (val > 0 && botCount[val] === 3) 
            {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(155, 255, 250)'; }
            } 
            else if (val > 0) 
            {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'white'; }
            }                  

        });
        botCol2Cells.forEach(function(item)
        {
            let val = getValue(item);
            const rects = item.getElementsByTagName('rect');
            if (val > 0 && botCount1[val] === 2)
            {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(255, 251, 0)'; }
            } 
            else if (val > 0 && botCount1[val] === 3) 
            {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(155, 255, 250)'; }
            } 
            else if (val > 0)
            {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'white'; }
            }            

        });
        botCol3Cells.forEach(function(item)
        {
            let val = getValue(item);
            const rects = item.getElementsByTagName('rect');
            if (val > 0 && botCount2[val] === 2) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(255, 251, 0)'; }
            } 
            else if (val > 0 && botCount2[val] === 3) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'rgb(155, 255, 250)'; }
            } 
            else if (val > 0) {
                for (let i = 0; i < rects.length; i++) { rects[i].style.fill = 'white'; }
            }             
        });
        isRolled = false;
        zeroCount = zeroCounter();
        
        botCol1Score.textContent = botResult[0];
        botCol2Score.textContent = botResult1[0];
        botCol3Score.textContent = botResult2[0];
        botTotal.textContent = botResult[0] + botResult1[0] + botResult2[0];

        setTimeout(function(){
        if (zeroCount[0] === 0 || zeroCount[1] === 0)
        {
            if(parseInt(playerTotal.textContent) >  botTotal.textContent)
            {
                alert('Wygrałeś')
                cellsReset();
            }
            else
            {
                alert('Przegrałeś')
                cellsReset();
            }
        } 
    }, 100);

    }
    });    
});