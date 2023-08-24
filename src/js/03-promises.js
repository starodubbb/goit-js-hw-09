import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.form'),
};

refs.form.addEventListener('submit', submitHandler);

function submitHandler(e) {
  e.preventDefault();
  const formElements = refs.form.elements;

  const delay = Number(formElements.delay.value);
  const step = Number(formElements.step.value);
  const amount = Number(formElements.amount.value);

  if (!checkFormValidation({ delay, step, amount })) {
    return;
  }

  createAndHandlePromises({ delay, step, amount });
  e.currentTarget.reset();
}

function createAndHandlePromises({ delay, step, amount }) {
  let currentDelay = delay;
  for (let pos = 1; pos <= amount; pos++) {
    createPromise(pos, currentDelay)
      .then(({ position, delay }) => {
        showNotification(
          'success',
          `Fulfilled promise ${position} in ${delay}ms`
        );
      })
      .catch(({ position, delay }) => {
        showNotification(
          'failure',
          `Rejected promise ${position} in ${delay}ms`
        );
      });

    currentDelay += step;
  }
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function checkFormValidation(formData) {
  const isAllPositive = Object.values(formData).every(value => value >= 0);
  if (!isAllPositive) {
    showNotification('warning', 'All values must be positive!');
    return false;
  }
  if (formData.amount === 0) {
    showNotification('warning', 'Amount must be above zero');
    return false;
  }
  if (formData.amount % 1 !== 0) {
    showNotification('warning', 'Amount must be whole number');
    return false;
  }
  return true;
}

function showNotification(type, text) {
  const types = ['success', 'failure', 'warning', 'info'];
  if (!types.includes(type)) {
    return;
  }
  Notify[type](text, { clickToClose: true });
}
