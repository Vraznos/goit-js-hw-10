import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let timerInterval = null;

const refs = {
  startButton: document.querySelector('button[data-start]'),
  datetimePicker: document.getElementById('datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let countdownInterval = null;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSet(selectedDates[0]);
  },
});

function timer() {
  refs.startButton.setAttribute('disabled', '');
  refs.datetimePicker.setAttribute('disabled', '');
  const nowDate = new Date();

  let intervalId;
  let timerInterval = userSelectedDate - nowDate;

  intervalId = setInterval(() => {
    timerWriter(convertMs(timerInterval));
    timerInterval -= 1000;
    if (timerInterval <= 0) {
      clearInterval(intervalId);
      stop();
    }
    // console.log(timerInterval);
  }, 1000);
}

function userSet(userData) {
  const nowDate = new Date();
  if (nowDate > userData) {
    // console.log('Please choose a date in the future');
    iziToast.error({
      message: 'Please choose a date in the future',
      backgroundColor: '#ef4040',
      messageColor: '#fff',
      messageSize: '16',
      imageWidth: 302,
      close: true,
      closeOnEscape: true,
      closeOnClick: true,
      progressBar: true,
      progressBarColor: '#b51b1b',
      transitionIn: 'flipInX',
      transitionOut: 'flipOutX',
      position: 'topRight',
    });
    stop();
    return;
  }
  start(userData);
}

function start(userData) {
  refs.startButton.removeAttribute('disabled');
  refs.startButton.addEventListener('click', timer);
  userSelectedDate = userData;
}

function stop() {
  refs.startButton.removeEventListener('click', timer);
  refs.startButton.setAttribute('disabled', '');
  refs.datetimePicker.removeAttribute('disabled');
  userSelectedDate = null;
}

function convertMs(ms) {
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

function timerWriter(time) {
  //   console.log(time);
  //   console.log(time.seconds);
  let days = time.days;
  let hours = time.hours;
  let minutes = time.minutes;
  let seconds = time.seconds;

  refs.days.textContent = days.toString().padStart(2, '0');
  refs.hours.textContent = hours.toString().padStart(2, '0');
  refs.minutes.textContent = minutes.toString().padStart(2, '0');
  refs.seconds.textContent = seconds.toString().padStart(2, '0');
}
