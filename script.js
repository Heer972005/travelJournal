const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('theme') || 'light';

function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    themeToggle.textContent = theme === 'dark' ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙';
}
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
});

const map = L.map('map').setView([20.5937, 78.9629], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let currentLatLng = [20.5937, 78.9629];
const planeMarker = L.marker(currentLatLng, {
    icon: L.icon({
        iconUrl: 'assest/—Pngtree—passenger airplane 3d illustration flying_15139415.png',
        iconSize: [40, 40]
    })
}).addTo(map);

async function getCoordinates(placeName) {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${placeName}&key=339ad1040e054a56827be35cecec620e`);
    const data = await response.json();
    if (data.results.length > 0) {
        return [data.results[0].geometry.lat, data.results[0].geometry.lng];
    } else {
        alert('Place not found!');
        return null;
    }
}

async function flyToPlace(placeName) {
    const destination = await getCoordinates(placeName);
    if (!destination) return;

    const path = L.polyline([currentLatLng, destination], { color: 'blue' }).addTo(map);

    let index = 0;
    const steps = 200;
    const latStep = (destination[0] - currentLatLng[0]) / steps;
    const lngStep = (destination[1] - currentLatLng[1]) / steps;

    const interval = setInterval(() => {
        if (index >= steps) {
            clearInterval(interval);
            currentLatLng = destination;
        } else {
            const newLat = currentLatLng[0] + latStep * index;
            const newLng = currentLatLng[1] + lngStep * index;
            planeMarker.setLatLng([newLat, newLng]);
            index++;
        }
    }, 20);

    map.panTo(destination);
}

document.getElementById('flyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const place = document.getElementById('placeInput').value;
    flyToPlace(place);
});

const form = document.getElementById('journalForm');
const entriesDiv = document.getElementById('entries');
let entries = JSON.parse(localStorage.getItem('travelEntries')) || [];
displayEntries();

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const location = document.getElementById('placeInput').value;
    const travelDate = document.getElementById('travelDate').value;
    const memory = document.getElementById('memory').value;
    const mode = document.getElementById('mode').value;
    const photoInput = document.getElementById('photo');
    const photo = photoInput.files[0];

    const reader = new FileReader();
    reader.onload = function () {
        const imageURL = reader.result;
        const newEntry = { location, travelDate, memory, mode, imageURL };
        entries.push(newEntry);
        localStorage.setItem('travelEntries', JSON.stringify(entries));
        displayEntries();
        form.reset();
    };

    if (photo) {
        reader.readAsDataURL(photo);
    } else {
        const newEntry = { location, travelDate, memory, mode, imageURL: '' };
        entries.push(newEntry);
        localStorage.setItem('travelEntries', JSON.stringify(entries));
        displayEntries();
        form.reset();
    }
});

function displayEntries() {
    entriesDiv.innerHTML = '';
    entries.forEach(entry => {
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-4';
        col.innerHTML = `
                    <div class="card shadow-sm">
                        ${entry.imageURL ? `<img src="${entry.imageURL}" class="card-img-top" alt="Travel photo">` : ''}
                        <div class="card-body">
                            <h5 class="card-title">${entry.location} ${entry.mode}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${entry.travelDate}</h6>
                            <p class="card-text">${entry.memory}</p>
                        </div>
                    </div>
                `;
        entriesDiv.appendChild(col);
    });
}