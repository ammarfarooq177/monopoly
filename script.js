const boardSpaces = [
  {
    name: "Start",
    type: "Collect $200 when you pass!",
    price: 0,
  },
  {
    name: "Park Blvd",
    type: "Street",
    price: 120,
  },
  {
    name: "Telegraph Ave",
    type: "Street",
    price: 140,
  },
  {
    name: "Community Surprise",
    type: "Pick a happy event",
    price: 0,
  },
  {
    name: "Grand Ave",
    type: "Street",
    price: 160,
  },
  {
    name: "Fruitvale Ave",
    type: "Street",
    price: 130,
  },
  {
    name: "Playground",
    type: "Take a snack break",
    price: 0,
  },
  {
    name: "College Ave",
    type: "Street",
    price: 150,
  },
  {
    name: "International Blvd",
    type: "Street",
    price: 110,
  },
  {
    name: "Piedmont Ave",
    type: "Street",
    price: 170,
  },
  {
    name: "MacArthur Blvd",
    type: "Street",
    price: 180,
  },
  {
    name: "Broadway",
    type: "Street",
    price: 200,
  },
];

const state = {
  money: 600,
  position: 0,
  owned: new Set(),
  canBuy: false,
  lastRoll: 0,
};

const boardEl = document.querySelector(".board");
const moneyEl = document.querySelector("#money");
const diceEl = document.querySelector("#dice");
const positionEl = document.querySelector("#position");
const messageEl = document.querySelector("#message");
const ownedListEl = document.querySelector("#owned-list");
const rollButton = document.querySelector("#roll");
const buyButton = document.querySelector("#buy");
const resetButton = document.querySelector("#reset");

const renderBoard = () => {
  boardEl.innerHTML = "";
  boardSpaces.forEach((space, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    if (index === state.position) {
      tile.classList.add("current");
      const token = document.createElement("div");
      token.className = "token";
      token.textContent = "⭐";
      tile.appendChild(token);
    }

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = space.name;
    tile.appendChild(title);

    const type = document.createElement("div");
    type.className = "type";
    type.textContent = space.type;
    tile.appendChild(type);

    if (space.price > 0) {
      const price = document.createElement("div");
      price.className = "price";
      price.textContent = `Price: $${space.price}`;
      tile.appendChild(price);
    }

    if (state.owned.has(space.name)) {
      const ownedBadge = document.createElement("div");
      ownedBadge.className = "price";
      ownedBadge.textContent = "Owned ✅";
      tile.appendChild(ownedBadge);
    }

    boardEl.appendChild(tile);
  });
};

const updateStats = () => {
  moneyEl.textContent = `$${state.money}`;
  diceEl.textContent = state.lastRoll ? state.lastRoll : "-";
  positionEl.textContent = boardSpaces[state.position].name;
};

const updateOwnedList = () => {
  ownedListEl.innerHTML = "";
  if (state.owned.size === 0) {
    const li = document.createElement("li");
    li.textContent = "No streets yet. Buy one when you land on it!";
    ownedListEl.appendChild(li);
    return;
  }

  [...state.owned].forEach((street) => {
    const li = document.createElement("li");
    li.textContent = street;
    li.className = "owned-item";
    ownedListEl.appendChild(li);
  });
};

const showMessage = (text) => {
  messageEl.textContent = text;
};

const handleLanding = () => {
  const space = boardSpaces[state.position];
  state.canBuy = false;
  buyButton.disabled = true;

  if (space.price === 0) {
    if (space.name === "Community Surprise") {
      showMessage("Community Surprise! You found a friendly neighbor who gives you $40.");
      state.money += 40;
    } else if (space.name === "Playground") {
      showMessage("Playground break! Collect $20 for sharing your snacks.");
      state.money += 20;
    } else {
      showMessage("Welcome back to Start. Take a deep breath and plan your next roll!");
    }
    return;
  }

  if (state.owned.has(space.name)) {
    showMessage(`You already own ${space.name}. Decorate it with stickers!`);
    return;
  }

  if (state.money < space.price) {
    showMessage(`Uh oh! ${space.name} costs $${space.price}, but you need more money.`);
    return;
  }

  state.canBuy = true;
  buyButton.disabled = false;
  showMessage(`You landed on ${space.name}. Want to buy it for $${space.price}?`);
};

const rollDice = () => {
  const roll = Math.floor(Math.random() * 6) + 1;
  state.lastRoll = roll;

  const nextPosition = (state.position + roll) % boardSpaces.length;
  if (state.position + roll >= boardSpaces.length) {
    state.money += 200;
    showMessage("You passed Start! Collect $200.");
  }

  state.position = nextPosition;
  updateStats();
  renderBoard();
  handleLanding();
  updateStats();
};

const buyStreet = () => {
  const space = boardSpaces[state.position];
  if (!state.canBuy) {
    return;
  }

  state.money -= space.price;
  state.owned.add(space.name);
  state.canBuy = false;
  buyButton.disabled = true;
  showMessage(`Nice! You bought ${space.name}. Great choice.`);
  updateStats();
  renderBoard();
  updateOwnedList();
};

const resetGame = () => {
  state.money = 600;
  state.position = 0;
  state.owned.clear();
  state.lastRoll = 0;
  state.canBuy = false;
  buyButton.disabled = true;
  updateStats();
  renderBoard();
  updateOwnedList();
  showMessage("Game reset! Roll the dice to start again.");
};

rollButton.addEventListener("click", rollDice);
buyButton.addEventListener("click", buyStreet);
resetButton.addEventListener("click", resetGame);

renderBoard();
updateStats();
updateOwnedList();
