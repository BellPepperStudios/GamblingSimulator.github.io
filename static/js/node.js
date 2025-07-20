let money = 0;
let timeractive = false;


function startTimer(duration) {
    timeractive = true;
    let currentTime = duration;
    const displayElement = document.getElementById("timer");

    displayElement.disabled = true;
    displayElement.innerHTML = "Time Until More Money: " + currentTime;

    const countdownInterval = setInterval(function () {
        currentTime--;

        if (currentTime > 0) {
            displayElement.innerHTML = "Time Until More Money: " + currentTime;
        } else {
            clearInterval(countdownInterval);
            displayElement.innerHTML = "Add Funds";
            displayElement.disabled = false;
            timeractive = false;
        }
    }, 1000);
}

function addMoney() {
    if (!timeractive && money <= 500) {
        const moneyElement = document.getElementById("money");
        money += 500;
        moneyElement.innerText = money;
        startTimer(100);
    } else {
        alert("You must wait for the timer to finish before adding more money. OR you have too much money already and need to be under 500 bucks.");
    }
}

// Weighted operators:
// '-' and '/' are lossier → higher chance
const weightedOperators = [
  { op: "-", weight: 40 },
  { op: "/", weight: 40 },
  { op: "+", weight: 10 },
  { op: "*", weight: 10 }
];

function getWeightedOperator() {
  const totalWeight = weightedOperators.reduce((sum, o) => sum + o.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const opObj of weightedOperators) {
    if (rand < opObj.weight) return opObj.op;
    rand -= opObj.weight;
  }
}

function getWeightedNumber() {
  if (hasExplodingDice) {
    return Math.random() < 0.7
      ? Math.floor(Math.random() * 60) + 1
      : Math.floor(Math.random() * 140) + 61;
  } else {
    return Math.random() < 0.7
      ? Math.floor(Math.random() * 30) + 1
      : Math.floor(Math.random() * 70) + 31;
  }
}




function gamble() {
  if (money <= 0) {
    alert("No money left, add funds.");
    return;
  }

  let betAmount = parseInt(document.getElementById("betAmount").value);
  if (isNaN(betAmount) || betAmount <= 0) {
    alert("Enter valid bet.");
    return;
  }

  // Increase max bet if High Roller
  const maxBet = hasHighRoller ? money * 1.5 : money;
  if (betAmount > maxBet) betAmount = Math.floor(maxBet);

  if (money < betAmount) {
    alert("Not enough money.");
    return;
  }

  money -= betAmount;
  document.getElementById("money").innerText = money;

  const operationDisplay = document.getElementById("operationResult");
  const numberDisplay = document.getElementById("randomNumber");

  // Fortune Teller shows operator early
  let predictedOperator = null;
  if (hasFortuneTeller) {
    predictedOperator = getWeightedOperator();
    operationDisplay.innerText = predictedOperator + " (Predicted)";
  }

  let spinCount = 0;
  const spinInterval = setInterval(() => {
    const fakeOperator = getWeightedOperator();
    const fakeNumber = getWeightedNumber();

    var clicksound = new Audio("static/sounds/click.mp3");
    clicksound.play();


    operationDisplay.innerText = fakeOperator;
    numberDisplay.innerText = fakeNumber;

    spinCount++;
    if (spinCount > 20) {
      clearInterval(spinInterval);

      const finalOperator = predictedOperator || getWeightedOperator();
      const finalNumber = getWeightedNumber();

      operationDisplay.innerText = finalOperator;
      numberDisplay.innerText = finalNumber;

      let result;
      try {
        if (finalOperator === "/" && finalNumber === 0) {
          result = 0;
        } else {
          result = eval(`${betAmount} ${finalOperator} ${finalNumber}`);
        }

        result = Math.floor(result);

        // VIP Card reduces loss by 25%
        if (hasVIPCard && result < 0) {
          result = Math.floor(result * 0.75);
        }

        money += result;
        

        // Fancy Hat 10% surprise bonus
        if (hasFancyHat && Math.random() < 0.1) {
          const bonus = 1000;
          money += bonus;
          alert(`Fancy Hat gave you a $${bonus} surprise bonus!`);
        }

        // Lucky Rabbit doubles wins 15%
        if (hasLuckyRabbit && result > 0 && Math.random() < 0.15) {
          money += result; // double the win amount
          alert("Lucky Rabbit doubled your win!");
        }

        // Stock Boost +$100 on losses
        if (hasStockBoost && result < 0) {
          money += 100;
          alert("Stock Boost softened your loss by $100.");
        }

        // Golden Chip 5% jackpot (double total money)
        if (hasGoldenChip && Math.random() < 0.05) {
          money *= 2;
          alert("Golden Chip hit the jackpot! Money doubled!");
        }

        // Mystery Box random effect
        if (hasMysteryBox) {
          const effects = [
            () => {
              money += 500;
              alert("Mystery Box gave you $500 bonus!");
            },
            () => {
              money -= 500;
              alert("Mystery Box cursed you for $500!");
            },
            () => {
              money = Math.floor(money * 1.5);
              alert("Mystery Box multiplied your money by 1.5!");
            },
            () => {
              money = Math.floor(money * 0.5);
              alert("Mystery Box halved your money!");
            },
          ];
          const randomEffect = effects[Math.floor(Math.random() * effects.length)];
          randomEffect();
        }

        // Debt Collector recovers 10% of last loss
        if (hasDebtCollector && result < 0) {
          const recover = Math.floor(Math.abs(result) * 0.1);
          money += recover;
          alert(`Debt Collector recovered $${recover} for you.`);
        }

        document.getElementById("money").innerText = money;

      } catch (e) {
        console.error(e);
      }
    }
  }, 50);
}


let inventory = [];

function buyItem(name, cost) {
  // Check if already owned:
  if (
    (name === "Fancy Hat" && hasFancyHat) ||
    (name === "Exploding Dice" && hasExplodingDice) ||
    (name === "Stock Boost" && hasStockBoost) ||
    (name === "Lucky Rabbit" && hasLuckyRabbit) ||
    (name === "VIP Card" && hasVIPCard) ||
    (name === "Golden Chip" && hasGoldenChip) ||
    (name === "Mystery Box" && hasMysteryBox) ||
    (name === "High Roller" && hasHighRoller) ||
    (name === "Debt Collector" && hasDebtCollector) ||
    (name === "Fortune Teller" && hasFortuneTeller)
  ) {
    alert("You already own " + name + "!");
    return;
  }

  if (money >= cost) {
    switch (name) {
      case "Fancy Hat":
        hasFancyHat = true;
        activateFancyHat();
        break;
      case "Exploding Dice":
        hasExplodingDice = true;
        alert("Exploding Dice equipped! Bigger swings incoming!");
        break;
      case "Stock Boost":
        hasStockBoost = true;
        alert("Stock Boost purchased! Get $100 bonus on losses.");
        break;
      case "Lucky Rabbit":
        hasLuckyRabbit = true;
        alert("Lucky Rabbit on board! More double wins ahead!");
        break;
      case "VIP Card":
        hasVIPCard = true;
        alert("VIP status! Losses are now smaller.");
        break;
      case "Golden Chip":
        hasGoldenChip = true;
        alert("Golden Chip acquired! Jackpot chances increased.");
        break;
      case "Mystery Box":
        hasMysteryBox = true;
        alert("Mystery Box opened! Random effects activated.");
        break;
      case "High Roller":
        hasHighRoller = true;
        alert("High Roller unlocked! Max bets increased.");
        break;
      case "Debt Collector":
        hasDebtCollector = true;
        alert("Debt Collector hired! Recover losses!");
        break;
      case "Fortune Teller":
        hasFortuneTeller = true;
        alert("Fortune Teller sees your fate!");
        break;
    }

    // checks if all items are owned
    if (hasFancyHat && hasExplodingDice && hasStockBoost && hasLuckyRabbit &&
        hasVIPCard && hasGoldenChip && hasMysteryBox && hasHighRoller &&
        hasDebtCollector && hasFortuneTeller) {
      alert("Congratulations! You are a true gambling master! All items owned!");
    }
    money -= cost;
    document.getElementById("money").innerText = money;

    const inventoryList = document.getElementById("inventory");
    const itemElement = document.createElement("li");
    itemElement.textContent = name;
    inventoryList.appendChild(itemElement);

  } else {
    alert("Not enough money to buy " + name);
  }
}


let hasFancyHat = false;
let hasExplodingDice = false;
let hasStockBoost = false;
let hasLuckyRabbit = false;
let hasVIPCard = false;
let hasGoldenChip = false;
let hasMysteryBox = false;
let hasHighRoller = false;
let hasDebtCollector = false;
let hasFortuneTeller = false;


function activateFancyHat() {
    hasFancyHat = true;
    const hatImg = document.getElementById("fancyHatImage");
    const message = document.getElementById("funnyMessage");

    hatImg.src = "static/img/fancyhat.png";
    hatImg.style.display = "block";
    message.innerText = "You're now 300% classier. Probably luckier too.";
}

// Inside your gamble() after final result:
if (hasFancyHat && Math.random() < 0.1) {
    money += 1000;
    alert("Your hat's elegance gave you a surprise $1000 bonus!");
}
