document.addEventListener("DOMContentLoaded", function () {

    fetch('./mods.json')
        .then(response => response.json())
        .then(data => {

            const modContainer = document.getElementById('modContainer');
            const categorySelect = document.getElementById('categorySelect');
            const apiSelect = document.getElementById('apiSelect');
            const searchInput = document.getElementById('searchInput');

            const mods = data.mods;

            function createCard(mod) {
                const card = document.createElement('div');
                card.className = 'col-sm-6 col-md-6 col-lg-4 col-xl-3';

                card.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <div class="card-body p-3">
                            <div class="d-flex align-items-start">
                                <img src="${mod.icon}" 
                                     class="mod-icon me-3 rounded" 
                                     alt="${mod['display-name']} Icon"
                                     style="width:48px;height:48px;object-fit:cover;">
                                <div>
                                    <h6 class="card-title m-0">${mod['display-name']}</h6>
                                    <small class="text-muted">API: ${mod.api}</small>
                                    <br>
                                    <small class="author-text">
                                        Author: 
                                        <a href="user/?user=${mod.author}" class="link-light">
                                            ${mod.author}
                                        </a>
                                    </small>
                                </div>
                            </div>

                            <p class="card-text mt-3 small">
                                ${mod.description}
                            </p>
                        </div>

                        <div class="card-footer d-flex justify-content-between">
                            <a href="${mod['repo-link']}" 
                               class="btn btn-outline-light btn-sm" 
                               target="_blank">
                               Source
                            </a>

                            <a href="${mod['download-link']}" 
                               class="btn btn-success btn-sm" 
                               download 
                               target="_blank">
                               Download
                            </a>
                        </div>
                    </div>
                `;

                return card;
            }

            function populateSelect(selectElement, values) {
                const uniqueValues = [...new Set(values)].sort();

                uniqueValues.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    selectElement.appendChild(option);
                });
            }

            populateSelect(categorySelect, mods.map(m => m.category));
            populateSelect(apiSelect, mods.map(m => m.api));

            function renderMods(modList) {
                modContainer.innerHTML = '';

                if (modList.length === 0) {
                    modContainer.innerHTML = `
                        <div class="col-12 text-center mt-5">
                            <p class="text-muted">No mods found.</p>
                        </div>
                    `;
                    return;
                }

                modList.forEach(mod => {
                    modContainer.appendChild(createCard(mod));
                });
            }

            function filterMods() {
                const searchValue = searchInput.value.trim().toLowerCase();
                const selectedCategory = categorySelect.value;
                const selectedApi = apiSelect.value;

                let filtered = mods.filter(mod => {
                    const matchesSearch =
                        mod['display-name'].toLowerCase().includes(searchValue) ||
                        mod.description.toLowerCase().includes(searchValue) ||
                        mod.author.toLowerCase().includes(searchValue);

                    const matchesCategory =
                        selectedCategory === 'All' || mod.category === selectedCategory;

                    const matchesApi =
                        selectedApi === 'All' || mod.api === selectedApi;

                    return matchesSearch && matchesCategory && matchesApi;
                });

                filtered.sort((a, b) =>
                    a['display-name'].localeCompare(b['display-name'])
                );

                renderMods(filtered);
            }

            function debounce(func, delay = 250) {
                let timeout;
                return (...args) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), delay);
                };
            }

            searchInput.addEventListener('input', debounce(filterMods));
            categorySelect.addEventListener('change', filterMods);
            apiSelect.addEventListener('change', filterMods);

            renderMods(mods);

        })
        .catch(error => console.error('Error fetching mods.json:', error));
});

// fuck you
