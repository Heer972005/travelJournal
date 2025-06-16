const form = document.getElementById("entryForm");
const cityInput = document.getElementById("city");
const descriptionInput = document.getElementById("description");
const emojiInput = document.getElementById("emoji");
const imageInput = document.getElementById("image");
const previewImage = document.getElementById("previewImage");
const entriesContainer = document.getElementById("journalEntries");

// Load entries on page load
window.addEventListener("DOMContentLoaded", displayEntries);

// Show preview when image is selected
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// Handle form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const city = cityInput.value.trim();
    const description = descriptionInput.value.trim();
    const emoji = emojiInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!city || !description || !emoji) return;

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            saveEntry(city, description, emoji, imageData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveEntry(city, description, emoji, null);
    }

    // Reset form
    form.reset();
    previewImage.style.display = "none";
});

// Save entry to localStorage
function saveEntry(city, description, emoji, image) {
    const entry = {
        id: Date.now(),
        city,
        description,
        emoji,
        image,
    };

    const entries = getEntries();
    entries.push(entry);
    localStorage.setItem("travelJournal", JSON.stringify(entries));
    displayEntries();
}

// Get entries from localStorage
function getEntries() {
    return JSON.parse(localStorage.getItem("travelJournal")) || [];
}

// Display entries
function displayEntries() {
    const entries = getEntries();
    entriesContainer.innerHTML = "";

    entries.reverse().forEach((entry) => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4 mb-4";

        const card = document.createElement("div");
        card.className = "card h-100";

        if (entry.image) {
            const img = document.createElement("img");
            img.src = entry.image;
            img.alt = "Uploaded photo";
            img.className = "card-img-top travel-card-img";
            card.appendChild(img);
        }

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const emoji = document.createElement("div");
        emoji.className = "emoji-badge text-center";
        emoji.textContent = entry.emoji;
        cardBody.appendChild(emoji);

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = entry.city;
        cardBody.appendChild(title);

        const desc = document.createElement("p");
        desc.className = "card-text";
        desc.textContent = entry.description;
        cardBody.appendChild(desc);

        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-delete btn-sm rounded-pill";
        delBtn.textContent = "🗑️ Delete Entry";
        delBtn.onclick = () => deleteEntry(entry.id);
        cardBody.appendChild(delBtn);

        card.appendChild(cardBody);
        col.appendChild(card);
        entriesContainer.appendChild(col);
    });
}

// Delete entry
function deleteEntry(id) {
    let entries = getEntries();
    entries = entries.filter((entry) => entry.id !== id);
    localStorage.setItem("travelJournal", JSON.stringify(entries));
    displayEntries();
}
