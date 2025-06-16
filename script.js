const form = document.getElementById('journalForm');
const entriesDiv = document.getElementById('entries');

// Load saved entries
let entries = JSON.parse(localStorage.getItem('travelEntries')) || [];
displayEntries();

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const location = document.getElementById('location').value;
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
    entries.forEach((entry, index) => {
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
