const MESSAGES = {
  WIN: 'You win !!!',
  LOSE: 'You lose …',
  DRAW: 'Draw ! Try again',
  IDLE: 'Press the start button',
  SELECT_HAND: 'Select your hand',
};

// 要素生成 *************************************************************************

const pointNumber = [1,2,3,4,5,6,7,8,9,10,11,12]
function createSlices() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 12; index++) {
    const slice = document.createElement('div');
    slice.classList.add('slice');

    const sliceColor = document.createElement('span');
    sliceColor.classList.add('slice-color');
    sliceColor.classList.add(index % 2 === 0 ? 'even' : 'odd');

    const sliceNumber = document.createElement('span');
    sliceNumber.classList.add('slice-number');
    sliceNumber.textContent = getRandomElement(pointNumber);

    slice.append(sliceColor, sliceNumber);
    fragment.appendChild(slice);
  }

  const roulette = document.querySelector('#roulette');
  roulette.appendChild(fragment);
}

createSlices();

// ルーレット *************************************************************************
const slices = document.querySelectorAll('.slice-color');
const elmStopRouletteBtn = document.querySelector('#stop-roulette');

elmStopRouletteBtn.addEventListener('click', stopRoulette);

let sliceIndex = 0;
const changeSliceColor = () => {
  if (slices.length === 0) return;

  resetSliceColor();
  slices[sliceIndex].classList.add('active');
  sliceIndex = (sliceIndex + 1) % slices.length;
};

let rouletteIntevalId = null;
function startRoulette() {
  rouletteIntevalId = setInterval(changeSliceColor, 10);
}

function stopRoulette() {
  clearInterval(rouletteIntevalId);
  setTimeout(() => {
    resetSliceColor();
    showMessage(MESSAGES.IDLE);
  }, 1000);

  disableAllControlButtons('start-janken');
}

const resetSliceColor = () => {
  slices.forEach((slice, index) => {
    slice.classList.remove('active');
    slice.classList.add(index % 2 === 0 ? 'even' : 'odd');
  });
};

// じゃんけん *************************************************************************
const elmStartJankenBtn = document.querySelector('#start-janken');
const elmJankenHandButtons = document.querySelectorAll('.janken-hand-button');
const elmJankenImg = document.querySelector('#janken-hand');

elmStartJankenBtn.addEventListener('click', startJanken);

elmJankenHandButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    stopJanken();
    const judge = judgeJanken(parseInt(e.currentTarget.dataset.jankenPattern));

    if (judge === 'WIN') {
      startRoulette();
      disableAllControlButtons('stop-roulette');
    } else if (judge === 'DRAW') {
      setTimeout(startJanken, 500);
    } else if (judge === 'LOSE') {
      setTimeout(() => {
        showMessage(MESSAGES.IDLE);
      }, 1000);
      resetSliceColor();
      disableAllControlButtons('start-janken');
    }

    showMessage(MESSAGES[judge]);
  });
});

const jankenHands = ['gu', 'choki', 'pa'];
let jankenIntevalId = null;
let jankenIndex = 0;

const changeJankenHandImage = () => {
  elmJankenImg.src = `./janken_${jankenHands[jankenIndex]}.png`;
  jankenIndex = (jankenIndex + 1) % jankenHands.length;
  // jankenIndex = Math.floor(Math.random() * 3);
};

function startJanken() {
  jankenIntevalId = setInterval(changeJankenHandImage, 10);
  enableAllControlButtons('start-janken', 'stop-roulette');
  showMessage(MESSAGES.SELECT_HAND);
}

function stopJanken() {
  clearInterval(jankenIntevalId);
}

function judgeJanken(playerHand) {
  const regex = /janken_(gu|choki|pa)\.png/;
  const match = elmJankenImg.src.match(regex);
  const machineHand = jankenHands.findIndex((hand) => hand === match[1]);
  const diff = (playerHand - machineHand + 3) % 3;

  return diff === 0 ? 'DRAW' : diff === 1 ? 'LOSE' : 'WIN';
}

// コントロールボタン *************************************************************************
function setControlButtonAvailability(isDisabled, exclusions) {
  const controlButtons = document.querySelectorAll('.control-button');

  controlButtons.forEach((button) => {
    const isExcluded = exclusions.includes(button.id) || exclusions.some((e) => button.classList.contains(e));
    button.disabled = isExcluded ? !isDisabled : isDisabled;
  });
}

function enableAllControlButtons(...exclusions) {
  setControlButtonAvailability(false, exclusions);
}

function disableAllControlButtons(...exclusions) {
  setControlButtonAvailability(true, exclusions);
}

// メッセージ *************************************************************************
function showMessage(message) {
  const elmMessageArea = document.querySelector('#message-area');
  elmMessageArea.textContent = message;
}

// キーボードショートカットキー *************************************************************************
const keyToButtonMap = {
  1: elmJankenHandButtons[0],
  2: elmJankenHandButtons[1],
  3: elmJankenHandButtons[2],
  s: elmStartJankenBtn,
  p: elmStopRouletteBtn,
};

document.addEventListener('keydown', (event) => {
  const button = keyToButtonMap[event.key];
  if (button) {
    button.click();
  }
});

// 共通 *************************************************************************
function getRandomElement(arr) {
  const index = Math.floor(Math.random() * arr.length);
  const element = arr[index];
  arr.splice(index, 1);
  return element;
}
