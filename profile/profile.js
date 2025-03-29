// Dynamically populate calendar days
const daysContainer = document.querySelector('.days');
const totalDays = 31;

for (let i = 1; i <= totalDays; i++) {
    const day = document.createElement('span');
    day.textContent = i;
    daysContainer.appendChild(day);
}

// Add click event to calendar days
const dayElements = document.querySelectorAll('.days span');
dayElements.forEach(day => {
    day.addEventListener('click', () => {
        alert(`You selected January ${day.textContent}, 2017`);
    });
});