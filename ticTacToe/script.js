let boxes = document.querySelectorAll(".box");
let reset = document.querySelector("#reset");
let winnerBox = document.querySelector(".winnerBox");

let turnO = true;

const winningPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// functionality to reset the game
let resetGame = () => {
    turnO = true;
    boxes.forEach((box)=>{
        box.innerText = "";
    });
    enableAllBoxes();
    winnerBox.classList.add("hide");
    boxes.forEach((box)=>{
        box.style.backgroundColor = "#003049";
        box.style.color = "#fdf0d5";
    });
    // reset.classList.add("hide");
}

// to disable all the boxes when the game is over
const disableAllBoxes = () => {
    boxes.forEach((box)=>{
        box.disabled = true;
    })
}
// to enable all the boxes when the game is over
const enableAllBoxes = () => {
    boxes.forEach((box)=>{
        box.disabled = false;
    })
}
// to display the winner and reset button when the first game is over
const showWinner = (winner) => {
    winnerBox.innerText = `${winner} is the winner!`;
    winnerBox.classList.remove("hide");
    disableAllBoxes();
}

// to check if there is a winner after every move, if there is a winner then call the showWinner function
const checkWinner = () => {
    for (let pattern of winningPatterns) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val !== "" && pos2val !== "" && pos3val !== "" ){
            if (pos1val === pos2val && pos2val === pos3val) {
                showWinner(pos1val);
                boxes[pattern[0]].style.backgroundColor = "#ffc300";
                boxes[pattern[0]].style.color = "#003049";
                boxes[pattern[1]].style.backgroundColor = "#ffc300";
                boxes[pattern[1]].style.color = "#003049";
                boxes[pattern[2]].style.backgroundColor = "#ffc300";
                boxes[pattern[2]].style.color = "#003049";
                return;
            }
        }
    }
};

// to decide whose move it is and to disable the box after clicking on it
boxes.forEach((box)=>{
    box.addEventListener("click",()=>{
        console.log("box clicked");
        box.innerText = turnO ? "O" : "X";
        turnO = !turnO;
        box.disabled = true;
        checkWinner();
    })
});

// firing reset
reset.addEventListener("click", resetGame);

