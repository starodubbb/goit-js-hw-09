import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/light.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  dateTimePicker: document.querySelector('#datetime-picker'),
  daysField: document.querySelector('[data-days]'),
  hoursField: document.querySelector('[data-hours]'),
  minutesField: document.querySelector('[data-minutes]'),
  secondsField: document.querySelector('[data-seconds]'),
  startBtn: document.querySelector('[data-start]'),
};

class Timer {
  #timePicker = null;
  #onInit = null;
  #onStart = null;
  #onTick = null;
  #onStop = null;

  #isStarted = null;
  #TICK_VALUE = null;
  #intervalId = null;

  constructor({ onInit, onStart, onTick, onStop }) {
    this.#onInit = onInit;
    this.#onStart = onStart;
    this.#onTick = onTick;
    this.#onStop = onStop;

    this.#isStarted = false;
    this.#TICK_VALUE = 1000;
  }
  init(timePicker) {
    this.#timePicker = timePicker;

    this.#onInit();
  }
  start() {
    if (!this.#timePicker) {
      return;
    }

    this.#isStarted = true;
    const selectedUnixDate = this.#timePicker.selectedDates[0].getTime();
    this.#handleTick(selectedUnixDate);

    this.#intervalId = setInterval(() => {
      this.#handleTick(selectedUnixDate);
    }, this.#TICK_VALUE);

    this.#onStart();
  }
  #handleTick(selectedUnixDate) {
    const actualUnixDate = Date.now();
    const deltaTime = selectedUnixDate - actualUnixDate;
    const timeData = this.#convertMs(deltaTime);

    this.#onTick(timeData);

    if (deltaTime < this.#TICK_VALUE) {
      this.stop();
    }
  }
  stop() {
    this.#isStarted = false;
    clearInterval(this.#intervalId);

    this.#onStop();
  }
  getIsStarted() {
    return this.#isStarted;
  }
  #convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
}

const timer = new Timer({ onInit, onStart, onTick, onStop });
const fp = flatpickr(refs.dateTimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (timer.getIsStarted()) {
      return;
    }
    const selectedUnixDate = selectedDates[0].getTime();
    const actualUnixDate = Date.now();
    if (selectedUnixDate - actualUnixDate <= 0) {
      showNotification('failure', 'Please choose a date in the future');
      btnDisabled(refs.startBtn);
      return;
    }
    btnEnabled(refs.startBtn);
  },
});
timer.init(fp);

refs.startBtn.addEventListener('click', timer.start.bind(timer));

function onInit() {
  btnDisabled(refs.startBtn);
}
function onStart() {
  btnDisabled(refs.startBtn);
}
function onTick({ days, hours, minutes, seconds }) {
  refs.daysField.textContent = addLeadingZero(days);
  refs.hoursField.textContent = addLeadingZero(hours);
  refs.minutesField.textContent = addLeadingZero(minutes);
  refs.secondsField.textContent = addLeadingZero(seconds);
}
function onStop() {
  btnEnabled(refs.startBtn);
  showNotification('success', 'Timer is over');
}
function btnEnabled(btn) {
  btn.disabled = false;
}
function btnDisabled(btn) {
  btn.disabled = true;
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
function showNotification(type, text) {
  const types = ['success', 'failure', 'warning', 'info'];
  if (!types.includes(type)) {
    return;
  }
  Notify[type](text, { clickToClose: true });
}
