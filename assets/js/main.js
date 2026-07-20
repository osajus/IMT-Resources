"use strict";

const state = {
    query: "",
    category: "All",
    activeTags: new Set(),
}

const els = {
    grid: document.getElementById("grid"),
    searchInput: document.getElementById("search-Input"),
    categoryList: document.getElementById("category-menu")
}

function mapResources(r) {
    return {
        id: r.id || String(Math.random()),
        title: r.title || "Not Named",
        filename: r.filename || "",
        path: r.path || "",
        categories: Array.isArray(r.categories) ? r.categories : [] || "Uncategorized",
        tags: Array.isArray(r.tags) ? r.tags : [],
        date: r.date || "Unknown",
        description: r.description || "No description",
    };
}

/* =================
    Categories
   ================= */

function getCategories() {
    const counts = {};
    NORMALIZED_RESOURCES.forEach(r => {
        r.categories.forEach(c => {
            counts[c] = (counts[c] || 0) + 1;    
        });        
    });
    return counts;
}

function renderCategories() {
    const counts = getCategories();
    const cats = ["All", ...Object.keys(counts).sort()];
    const total = NORMALIZED_RESOURCES.length;
        
    els.categoryList.innerHTML = cats.map(cat => {
        const n = cat === "All" ? total : counts[cat];
        const activeClass = state.category === cat ? "active" : "";
        return `<li>
            <button class="${activeClass}" data-category="${cat}">
                <span>${cat}</span>
                <span class="count">${n}</span>
            </button>
        </li>`;     
    }).join("");

    els.categoryList.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            state.category = btn.dataset.category;
            reRender();
            console.log(state.category);
        });
    });
}

function renderCards() {
    els.grid.innerHTML = "";

    const matches = NORMALIZED_RESOURCES
        .filter(item => state.category === "All" || item.categories.includes(state.category))
        .map(item => ({ item, score: scoreMatch(item, state.query) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score);

    for (const { item } of matches) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
    <div class="card__header">
        <span class="card__title">${item.title}</span>
    </div>
    <div class="card__subheader">
        <span class="card__added">Added: ${item.date}</span>
    </div>
    <div class="card__body">
        <h3 class="card__filename">${item.filename}</h3>
        <p class="card__desc">${item.description}</p>
        <div class="card__category">Categories: ${item.categories.map(c => `<span>${c}</span>`).join(", ")}</div>
        <div class="card__tags">Tags: ${item.tags.map(t => `<span>${t}</span>`).join("")}</div>
        <a class="card__open" href="${item.path}" download="${item.filename}">
            Download Document
        </a>
    </div>
    `;
    els.grid.appendChild(card);
    }
}

function scoreMatch(resource, query) {
  if (!query) return 1;
  const q = query.toLowerCase();
  let score = 0;

  if (resource.title.toLowerCase().includes(q)) score += 30;
  if (resource.filename.toLowerCase().includes(q)) score += 15;
  if (resource.tags.some(t => t.toLowerCase().includes(q))) score += 20;
  if (resource.description.toLowerCase().includes(q)) score += 8;
  if (resource.categories.some(c => c.toLowerCase().includes(q))) score += 10;

  return score;
}

function reRender() {
    renderCategories();
    renderCards();
}

const NORMALIZED_RESOURCES = RESOURCES.map(mapResources);

els.searchInput.addEventListener("input", (e) => {
  state.query = e.target.value.trim();
  renderCards(); 
  renderCategories();
});

reRender();