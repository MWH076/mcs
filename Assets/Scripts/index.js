document.addEventListener("DOMContentLoaded", function () {
    const filtersUrl = "./Data/filters.json";
    const seedsUrl = "./Data/seeds.json";

    // Fetch filters and populate UI
    fetch(filtersUrl)
        .then(res => res.json())
        .then(data => {
            const accordion = document.getElementById("filterAccordion");
            Object.entries(data).forEach(([key, values]) => {
                const filterHtml = `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${key.replace(/\s+/g, '')}Filters">${key}</button>
                    </h2>
                    <div id="${key.replace(/\s+/g, '')}Filters" class="accordion-collapse collapse" data-bs-parent="#filterAccordion">
                        <div class="accordion-body">
                            ${values.map(value => `
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="${value}" data-filter="${key}">
                                    <label class="form-check-label">${value}</label>
                                </div>`).join('')}
                        </div>
                    </div>
                </div>`;
                accordion.insertAdjacentHTML("beforeend", filterHtml);
            });
        });

    // Fetch seeds and populate UI
    fetch(seedsUrl)
        .then(res => res.json())
        .then(data => {
            const grid = document.querySelector(".row.g-3");
            data.forEach(seed => {
                const cardHtml = `
                <div class="col-md-4">
                    <div class="card" style="border-radius: 10px; overflow: hidden;">
                        <img src="${seed.image}" class="card-img-top" alt="${seed.name}">
                        <div class="d-flex align-items-center p-3">
                            <img src="https://via.placeholder.com/50" class="rounded me-3" alt="Profile Image">
                            <div class="d-flex justify-content-between align-items-center w-100">
                                <div>
                                    <h6 class="mb-0">${seed.name}</h6>
                                    <small class="text-muted">${seed.version} ${seed.edition}</small>
                                </div>
                                <button class="btn btn-outline-success btn-sm ms-3" data-seed='${JSON.stringify(seed)}' onclick="showSeedDetails(this)">View</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                grid.insertAdjacentHTML("beforeend", cardHtml);
            });
        });

    // Search functionality
    document.querySelector("input[placeholder='Search...']").addEventListener("input", function (e) {
        const searchValue = e.target.value.toLowerCase();
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            const seedName = card.querySelector("h6").innerText.toLowerCase();
            card.parentElement.style.display = seedName.includes(searchValue) ? "" : "none";
        });
    });
});

function showSeedDetails(button) {
    const seed = JSON.parse(button.dataset.seed);
    const modalContent = `
    <h5>${seed.name}</h5>
    <img src="${seed.image}" class="img-fluid mb-3" alt="${seed.name}">
    <p><strong>Version:</strong> ${seed.version}</p>
    <p><strong>Edition:</strong> ${seed.edition}</p>
    <p><strong>Spawn Location:</strong> ${seed.spawnLocation}</p>
    <p><strong>Structures:</strong> ${seed.structures.join(', ')}</p>
    <p><strong>Biomes:</strong> ${seed.biomes.join(', ')}</p>
    <p><strong>Best Suited For:</strong> ${seed.bestSuitedFor.join(', ')}</p>`;
    const offcanvasBody = document.querySelector(".offcanvas-body");
    offcanvasBody.innerHTML = modalContent;
}
