const refs = {
  body: document.querySelector('body'),
  btnStart: document.querySelector('[data-start]'),
  btnStop: document.querySelector('[data-stop]'),
};
const COLOR_INTERVAL = 1500;
let intervalId = null;

btnToggleState(refs.btnStop);

refs.btnStart.addEventListener('click', btnStartClickHandler);
refs.btnStop.addEventListener('click', btnStopClickHandler);

function btnStartClickHandler(e) {
  setRandomBackgroundColor(refs.body);

  intervalId = setInterval(() => {
    setRandomBackgroundColor(refs.body);
  }, COLOR_INTERVAL);

  btnToggleState(refs.btnStart);
  btnToggleState(refs.btnStop);
}

function btnStopClickHandler(e) {
  clearInterval(intervalId);

  btnToggleState(refs.btnStart);
  btnToggleState(refs.btnStop);
}

function btnToggleState(btn) {
  btn.disabled = !btn.disabled;
}

function setRandomBackgroundColor(coloredObj) {
  const nextColor = getRandomHexColor();
  setBackgroundColor(nextColor, coloredObj);
}

function setBackgroundColor(color, coloredObj) {
  coloredObj.style.backgroundColor = color;
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
