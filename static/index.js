let towerContainer = document.getElementById("tower");

let betAmmount = document.getElementById("betAmm");
let minsAmmonuntRange = document.getElementById("minsAmm");

let coefsContainer = document.getElementById("coefsContainer");

let stepsEl = document.getElementById("steps");
let startButton = document.getElementById("startGame");
let leaveButton = document.getElementById("leaveButton");

let balance = Number(localStorage.getItem("currBalance"));
let profileBalance = document.getElementById("profileBalance");
let failscreen = document.getElementById("failscreen");

const COEFFS = [
  [
    "8.84",
    "7.07",
    "5.66",
    "4.52",
    "3.62",
    "2.89",
    "2.31",
    "1.85",
    "1.48",
    "1.18",
  ],
  [
    "157.11",
    "94.26",
    "56.56",
    "33.93",
    "20.36",
    "12.21",
    "7.33",
    "4.39",
    "2.63",
    "1.58",
  ],
  [
    "9059.90",
    "3623.96",
    "1449.58",
    "579.83",
    "231.93",
    "92.77",
    "37.10",
    "14.84",
    "5.93",
    "2.37",
  ],
  [
    "9277343.75",
    "1855468.75",
    "371093.75",
    "74218.75",
    "14843.75",
    "2968.75",
    "593.75",
    "118.75",
    "23.75",
    "4.75",
  ],
];

profileBalance.innerText = "Ваш баланс : " + balance.toLocaleString();
betAmmount.max = balance;

if (balance == undefined || balance < 10) {
  localStorage.setItem("currBalance", 1000);
  location.reload();
} else if (typeof balance == undefined) {
  localStorage.setItem("currBalance", 1000);
  location.reload();
} else if (balance == "NaN") {
  localStorage.setItem("currBalance", 1000);
  location.reload();
}



class TowerGame {
  countMinesOnRow = 1;
  betAmmount = 1;
  looseCellID = [];
  steps = 0;
  winAmmount = 0;
  
  constructor(countMinesOnRow = 1, betAmmount = 1) {
    this.countMinesOnRow = countMinesOnRow;
    this.betAmmount = betAmmount;
  }

  generateLooseCellID(countMinesOnRow = this.countMinesOnRow) {
    var array = [];

    for (let i = 0; i < 10; i++) {
      let tempArr = [];
      for (let j = 0; j < countMinesOnRow; j++) {
        var cell = Math.floor(Math.random() * (5 - 0)) + 0;
        if (!tempArr.includes(cell)) {
          tempArr.push(cell);
        } else j--;
      }
      array.push(tempArr);
    }
    this.looseCellID = array;
  }

  checkCell(rowIndex, cellId) {
    let status = this.looseCellID[rowIndex].includes(cellId);

    if (!status) {
      this.steps = this.steps + 1;
      this.winAmmount = Math.ceil(
        this.betAmmount * COEFFS[this.countMinesOnRow - 1][10 - this.steps]
      );
    }

    return status;
  }

  getSteps() {
    return this.steps;
  }

  getWinAmmount() {
    return this.winAmmount;
  }
}

function changeCoefs() {
  coefsContainer.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    let coefDiv = document.createElement("div");
    coefDiv.className = "coeff";
    coefDiv.textContent = "x" + COEFFS[minsAmmonuntRange.value-1][i];
    coefsContainer.appendChild(coefDiv);
  }
}

function fail() {
  failscreen.style.display = "flex";
  localStorage.setItem("currBalance", balance - betAmmount.value);
}

function getWin(winAmmount){
  localStorage.setItem("currBalance", balance + winAmmount);
  location.reload()
}

function showSolution(game){
  
  for (let i = 0; i < towerContainer.childNodes.length; i++) {
    if (i>=3) {
      if (game.looseCellID[towerContainer.childNodes[i].dataset.row].includes(Number(towerContainer.childNodes[i].dataset.id))) {
        towerContainer.childNodes[i].classList.add("fail-solution")
      }
    }
    
  }


}

function play() {
  changeCoefs()
  betAmmount.disabled = true
  minsAmmonuntRange.disabled = true
  let bombsCount = minsAmmonuntRange.value;
  let betAmm = betAmmount.value;
  window.game = new TowerGame(bombsCount, betAmm);

  startButton.disabled = true;
  
  window.game.generateLooseCellID();

  console.log(window.game);

  let towerCells = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      let cell = document.createElement("button");
      cell.className = "towerCell";
      if (i != 0) {
        cell.classList.add("disabled");
        cell.disabled = true;
      }

      cell.dataset.row = i;
      cell.dataset.id = j;
      cell.id = "id " + i;
      towerCells.push(cell);
    }
  }

  for (let i = 0; i < towerCells.length; i++) {
    let cell = towerCells[i];
    cell.onclick = () => {
      
      let cellStatus = window.game.checkCell(
        cell.dataset.row,
        Number(cell.dataset.id)
      );

      if (cellStatus == true) {
        cell.classList.add("fail");
        fail();
      } else {
        cell.classList.add("sucess");

        if(i>= 45){
          showSolution(window.game)
        }

        stepsEl.style.display = "block";
        stepsEl.childNodes[1].textContent = window.game.getSteps();

        leaveButton.style.display = "flex";
        leaveButton.childNodes[1].textContent = window.game.getWinAmmount().toLocaleString();
       

        let currentRow =
          i % 5 == 0 ? i / 5 : i == 0 ? Math.ceil(i / 5) : Math.ceil(i / 5 - 1);
        let nextRow =
          i % 5 == 0
            ? i / 5 + 1
            : i == 0
            ? Math.ceil(i / 5 + 1)
            : Math.ceil(i / 5);

        for (let j = 0; j < towerCells.length; j++) {
          let cellToFill = towerCells[j];

          if (cellToFill.dataset.row == nextRow) {
            cellToFill.classList.remove("disabled");
            cellToFill.disabled = false;
          }
          if (cellToFill.dataset.row == currentRow) {
            cellToFill.disabled = true;
          }
        }
      }
    };

    towerContainer.appendChild(cell);
  }
}

minsAmmonuntRange.addEventListener("change", () => {

  changeCoefs()

});

leaveButton.addEventListener("click", ()=> {
  getWin(window.game.getWinAmmount())
})

startButton.addEventListener("click", () => {
  document.getElementById("blind").style.display = "none";
  play();
});

let clicks = 0
profileBalance.addEventListener("click",e=>{
  if (clicks >= 10) {
    showSolution(window.game)
      profileBalance.innerText ="Злом очка.."
  }
  clicks++
})

function restart() {
  location.reload();
}
