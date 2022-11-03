const Player = (name,letter)=>{
    let _turn = true;
    const playerTurn = ()=>{
        _turn = !_turn;
        // console.log(_turn);
    }
    const getTurn = ()=>{
        return _turn;
    };
    return {name,letter,playerTurn,getTurn};
}

const GameBoard = (()=>{
    // const _gameboard = ["s1","s2","s3","s4","s5","s6","s7","s8","s9"];
    const _gameboard = new Array(9).fill(null);

    const setGrid = (position,letter)=>{
        _gameboard[position] = letter;
    };
    const getGrid = () =>{
        return _gameboard;
    };
    const resetGrid = ()=>{
        _gameboard = new Array(9).fill(null);
    };

    return{
        setGrid,
        getGrid,
        resetGrid
    };
})();

const GameControl = (()=>{
    const playRound = (doc,player,position)=>{
        GameBoard.setGrid(position,player.letter);
        DisplayController.updateGameBoard(doc,player);
        if(GameControl.gameCheck()){
            alert(`${player.name} Wins!`)
            console.log("Win has been found")
        } 
        player.playerTurn();
    };
    const splitArray = (board, cutSize) =>{
        const checkArray = [];
        for (let i = 0; i<board.length; i+=cutSize){
            const cut = board.slice(i,i+cutSize);
            checkArray.push(cut)
        }
        return checkArray;
    }
    const diagonalCheck = (checkBoard)=>{
        if(checkBoard[0][0] !== null && checkBoard[0][0] === checkBoard [1][1] && checkBoard[1][1] === checkBoard[2][2]){
            return true
        }else if(checkBoard[0][2] !== null && checkBoard[0][2] === checkBoard[1][1] && checkBoard[1][1] === checkBoard[2][0]){
            return true;
        }else{
            return false;
        }
       
    };
    const horizontalCheck = (checkBoard)=>{
        let win = false;
        checkBoard.forEach(girdBlock =>{
            if(girdBlock[0] !== null){
                const check = girdBlock.every(space => space === girdBlock[0] && girdBlock[0] !== null);
                if(check)win = true;
            }
        })
        if(win)return true;
    };

    const verticalCheck = (checkBoard)=>{
        let win = false;
        checkBoard.forEach((girdBlock,index)=>{
            let check = checkBoard.map(col => col[index])
            if(check[0] !== null){
                const winCheck = check.every(val => val === check[0])
                if(winCheck)win=true;
            }    
        })
       if(win)return true;                   
    }

    const gameCheck = ()=>{
        let check = splitArray(GameBoard.getGrid(),3);
        if(horizontalCheck(check) || verticalCheck(check) ||diagonalCheck(check)){
            return true
        }else if(!GameBoard.getGrid().includes(null) ){
            console.log('draw')
        }
        

    };
    return{
        playRound,
        gameCheck
    };
})();


const DisplayController = (()=>{
    const updateGameBoard = (docselect,player)=>{
        const gridDiv = document.createElement('div');
        gridDiv.classList.add('grid-text');
        gridDiv.innerText = player.letter;
        docselect.append(gridDiv);
    }
    const createPlayer = (form,sign)=>{
        return Player(form['player-name'].value,sign);
    }

    const startGame = (form1,form2)=>{
        document.querySelector('.menu-wrapper').setAttribute('style','visibility:hidden;');
        document.querySelector('.game-wrapper').setAttribute('style','visibility:visible;');

        const player1 = createPlayer(form1,'X');
        const player2 = createPlayer(form2,'O');
        const grid = document.querySelectorAll('.field');
        grid.forEach(space => {
            space.addEventListener('click',(e)=>{
                if(e.target.innerText === ""){
                    if(player1.getTurn() === true){
                        GameControl.playRound(e.target,player1,e.target.getAttribute('data-space'));
                        player2.playerTurn();
            
                    }else{
                        GameControl.playRound(e.target,player2,e.target.getAttribute('data-space'));
                        player1.playerTurn();
                    }
                }
                
            })
        })
    } 
    const gameStart = document.querySelector('.player-submit');
    const player1Form = document.querySelector('#playerInfo1');
    const player2Form = document.querySelector('#playerInfo2');

    gameStart.addEventListener('click',()=>startGame(player1Form,player2Form));
    return{
        updateGameBoard
    }
})();

