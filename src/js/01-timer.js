import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const timerDisplay = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]')
};

let userSelectedDate = null;
let countdownInterval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate <= new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDate;
            startButton.disabled = false;
        }
    },
};

flatpickr(datetimePicker, options);

startButton.addEventListener('click', () => {
    if (!userSelectedDate) return;
    startButton.disabled = true;
    countdownInterval = setInterval(updateCountdown, 1000);
});

function updateCountdown() {
    const now = new Date();
    const timeRemaining = userSelectedDate - now;

    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        displayTime(0, 0, 0, 0);
        return;
    }

    const time = convertMs(timeRemaining);
    displayTime(time.days, time.hours, time.minutes, time.seconds);
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function displayTime(days, hours, minutes, seconds) {
    timerDisplay.days.textContent = addLeadingZero(days);
    timerDisplay.hours.textContent = addLeadingZero(hours);
    timerDisplay.minutes.textContent = addLeadingZero(minutes);
    timerDisplay.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}
