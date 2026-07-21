"use strict";

const state = {
    fileHandle: null,
    header: "",
    tail: "",
    resources: [],
    selectedIndex: -1,
    query: "",
    dirty: false,
};

const els = {
    btnOpen: document.getElementById("btn-open"),
    btnSave: document.getElementById("btn-save"),
    btnAdd: document.getElementById("btn-add"),
    btnDelete: document.getElementById("btn-delete"),
    fileStatus: document.getElementById("file-status"),
    unsupportedBanner: document.getElementById("unsupported-banner"),
    searchInput: document.getElementById("search-input"),
    itemList: document.getElementById("item-list"),
    emptyState: document.getElementById("empty-state"),
    itemForm: document.getElementById("item-form"),
    fieldTitle: document.getElementById("field-title"),
    fieldBasepath: document.getElementById("field-basepath"),
    fieldFilename: document.getElementById("field-filename"),
    fieldDate: document.getElementById("field-date"),
    fieldDescription: document.getElementById("field-description"),
    chipCategories: document.getElementById("chip-categories"),
    chipTags: document.getElementById("chip-tags"),
    computedPath: document.getElementById("computed-path"),
};

/* =================
    Parsing / Serializing
   ================= */

function findArrayEnd(text, startIndex) {
    let depth = 0;
    let inString = false;
    let quoteChar = "";
    let inLineComment = false;
    let inBlockComment = false;

    for (let i = startIndex; i < text.length; i++) {
        const c = text[i];
        const next = text[i + 1];

        if (inLineComment) {
            if (c === "\n") inLineComment = false;
            continue;
        }
        if (inBlockComment) {
            if (c === "*" && next === "/") { inBlockComment = false; i++; }
            continue;
        }
        if (inString) {
            if (c === "\\") { i++; continue; }
            if (c === quoteChar) inString = false;
            continue;
        }
        if (c === "\"" || c === "'" || c === "`") { inString = true; quoteChar = c; continue; }
        if (c === "/" && next === "/") { inLineComment = true; i++; continue; }
        if (c === "/" && next === "*") { inBlockComment = true; i++; continue; }

        if (c === "[") depth++;
        else if (c === "]") {
            depth--;
            if (depth === 0) return i;
        }
    }
    throw new Error("Could not find the end of the RESOURCES array literal.");
}

function normalizeItem(r) {
    return {
        title: r.title || "",
        basepath: r.basepath || "",
        filename: r.filename || "",
        categories: Array.isArray(r.categories) ? r.categories.slice() : [],
        tags: Array.isArray(r.tags) ? r.tags.slice() : [],
        date: r.date || "",
        description: r.description || "",
    };
}

function parseManifestText(text) {
    const declRe = /const\s+RESOURCES\s*=\s*/;
    const m = declRe.exec(text);
    if (!m) throw new Error('Could not find "const RESOURCES = " in this file.');

    const arrayStart = m.index + m[0].length;
    if (text[arrayStart] !== "[") {
        throw new Error("Expected an array literal after the RESOURCES assignment.");
    }
    const arrayEnd = findArrayEnd(text, arrayStart);

    const header = text.slice(0, arrayStart);
    const arrayText = text.slice(arrayStart, arrayEnd + 1);
    const tail = text.slice(arrayEnd + 1);

    let items;
    try {
        items = new Function("return " + arrayText)();
    } catch (e) {
        throw new Error("Failed to parse the RESOURCES array: " + e.message);
    }
    if (!Array.isArray(items)) throw new Error("RESOURCES is not an array.");

    return { header, tail, items: items.map(normalizeItem) };
}

function arrayToSource(arr) {
    return "[" + arr.map((v) => JSON.stringify(v)).join(", ") + "]";
}

function itemToSource(item) {
    const lines = [
        `        title: ${JSON.stringify(item.title)}`,
        `        basepath: ${JSON.stringify(item.basepath)}`,
        `        filename: ${JSON.stringify(item.filename)}`,
        `        categories: ${arrayToSource(item.categories)}`,
        `        tags: ${arrayToSource(item.tags)}`,
        `        date: ${JSON.stringify(item.date)}`,
        `        description: ${JSON.stringify(item.description)}`,
    ];
    return "    {\n" + lines.join(",\n") + "\n    }";
}

function serializeItems(items) {
    const body = items.map(itemToSource).join(",\n");
    return "[\n" + body + "\n]";
}

/* =================
    File I/O
   ================= */

async function ensureWritePermission(handle) {
    const opts = { mode: "readwrite" };
    if ((await handle.queryPermission(opts)) === "granted") return true;
    if ((await handle.requestPermission(opts)) === "granted") return true;
    return false;
}

async function openManifest() {
    try {
        const [handle] = await window.showOpenFilePicker({
            types: [{ description: "JavaScript", accept: { "text/javascript": [".js"] } }],
            excludeAcceptAllOption: false,
            multiple: false,
        });
        const file = await handle.getFile();
        const text = await file.text();
        const parsed = parseManifestText(text);

        state.fileHandle = handle;
        state.header = parsed.header;
        state.tail = parsed.tail;
        state.resources = parsed.items;
        state.selectedIndex = -1;
        state.dirty = false;
        state.query = "";
        els.searchInput.value = "";

        els.fileStatus.textContent = file.name;
        els.btnSave.disabled = true;
        els.btnAdd.disabled = false;

        renderList();
        renderDetail();
    } catch (e) {
        if (e.name !== "AbortError") {
            alert("Failed to open file:\n" + e.message);
        }
    }
}

async function saveManifest() {
    if (!state.fileHandle) return;
    try {
        const granted = await ensureWritePermission(state.fileHandle);
        if (!granted) {
            alert("Write permission was not granted for this file.");
            return;
        }
        const newText = state.header + serializeItems(state.resources) + state.tail;
        const writable = await state.fileHandle.createWritable();
        await writable.write(newText);
        await writable.close();

        state.dirty = false;
        els.btnSave.disabled = true;
    } catch (e) {
        alert("Failed to save file:\n" + e.message);
    }
}

/* =================
    Rendering
   ================= */

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
}

function renderList() {
    const q = state.query.trim().toLowerCase();
    els.itemList.innerHTML = "";

    state.resources.forEach((item, index) => {
        if (q) {
            const haystack = [item.title, item.filename, item.description, ...item.categories, ...item.tags]
                .join(" ").toLowerCase();
            if (!haystack.includes(q)) return;
        }
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = index === state.selectedIndex ? "active" : "";
        btn.innerHTML = `<span class="item-title">${escapeHtml(item.title || "(untitled)")}</span>` +
            `<span class="item-meta">${escapeHtml(item.filename)}</span>`;
        btn.addEventListener("click", () => selectItem(index));
        li.appendChild(btn);
        els.itemList.appendChild(li);
    });
}

function collectAllValues(key) {
    const set = new Set();
    state.resources.forEach((r) => r[key].forEach((v) => set.add(v)));
    return Array.from(set).sort();
}

function updateComputedPath() {
    const item = state.resources[state.selectedIndex];
    els.computedPath.textContent = item ? item.basepath + item.filename : "";
}

function renderDetail() {
    const item = state.resources[state.selectedIndex];
    if (!item) {
        els.emptyState.hidden = false;
        els.itemForm.hidden = true;
        return;
    }
    els.emptyState.hidden = true;
    els.itemForm.hidden = false;

    els.fieldTitle.value = item.title;
    els.fieldBasepath.value = item.basepath;
    els.fieldFilename.value = item.filename;
    els.fieldDate.value = item.date;
    els.fieldDescription.value = item.description;
    updateComputedPath();

    renderChipInput(els.chipCategories, item.categories, "categories");
    renderChipInput(els.chipTags, item.tags, "tags");
}

function renderChipInput(container, values, key) {
    container.innerHTML = "";

    values.forEach((val, i) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = `<span>${escapeHtml(val)}</span>`;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "×";
        removeBtn.addEventListener("click", () => {
            values.splice(i, 1);
            markDirty();
            renderChipInput(container, values, key);
        });
        chip.appendChild(removeBtn);
        container.appendChild(chip);
    });

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Add...";
    container.appendChild(input);

    const suggestBox = document.createElement("div");
    suggestBox.className = "chip-suggestions";
    suggestBox.hidden = true;
    container.appendChild(suggestBox);

    function commit(value) {
        const v = value.trim();
        if (!v) return;
        if (values.some((existing) => existing.toLowerCase() === v.toLowerCase())) {
            input.value = "";
            suggestBox.hidden = true;
            return;
        }
        values.push(v);
        markDirty();
        renderChipInput(container, values, key);
    }

    function updateSuggestions() {
        const q = input.value.trim().toLowerCase();
        const pool = collectAllValues(key).filter(
            (s) => !values.some((v) => v.toLowerCase() === s.toLowerCase())
        );
        const filtered = q ? pool.filter((s) => s.toLowerCase().includes(q)) : pool;

        if (!filtered.length) {
            suggestBox.hidden = true;
            suggestBox.innerHTML = "";
            return;
        }
        suggestBox.innerHTML = "";
        filtered.slice(0, 8).forEach((s) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = s;
            btn.addEventListener("mousedown", (e) => {
                e.preventDefault();
                commit(s);
            });
            suggestBox.appendChild(btn);
        });
        suggestBox.hidden = false;
    }

    input.addEventListener("focus", updateSuggestions);
    input.addEventListener("input", updateSuggestions);
    input.addEventListener("blur", () => setTimeout(() => { suggestBox.hidden = true; }, 100));

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit(input.value);
        } else if (e.key === "Backspace" && input.value === "" && values.length) {
            values.pop();
            markDirty();
            renderChipInput(container, values, key);
        }
    });
}

/* =================
    Actions
   ================= */

function markDirty() {
    state.dirty = true;
    els.btnSave.disabled = false;
}

function selectItem(index) {
    state.selectedIndex = index;
    renderList();
    renderDetail();
}

function addItem() {
    const newItem = {
        title: "New Item",
        basepath: "resources/",
        filename: "",
        categories: [],
        tags: [],
        date: new Date().toISOString().slice(0, 10),
        description: "",
    };
    state.resources.push(newItem);
    markDirty();
    state.query = "";
    els.searchInput.value = "";
    selectItem(state.resources.length - 1);
    els.fieldTitle.focus();
    els.fieldTitle.select();
}

function deleteItem() {
    if (state.selectedIndex < 0) return;
    const item = state.resources[state.selectedIndex];
    if (!confirm(`Delete "${item.title || item.filename}"? This cannot be undone.`)) return;

    state.resources.splice(state.selectedIndex, 1);
    state.selectedIndex = -1;
    markDirty();
    renderList();
    renderDetail();
}

function bindField(el, key, onChange) {
    el.addEventListener("input", () => {
        const item = state.resources[state.selectedIndex];
        if (!item) return;
        item[key] = el.value;
        markDirty();
        if (onChange) onChange();
    });
}

/* =================
    Init
   ================= */

function init() {
    if (!("showOpenFilePicker" in window)) {
        els.unsupportedBanner.hidden = false;
        els.btnOpen.disabled = true;
        return;
    }

    els.btnOpen.addEventListener("click", openManifest);
    els.btnSave.addEventListener("click", saveManifest);
    els.btnAdd.addEventListener("click", addItem);
    els.btnDelete.addEventListener("click", deleteItem);

    els.searchInput.addEventListener("input", (e) => {
        state.query = e.target.value;
        renderList();
    });

    bindField(els.fieldTitle, "title", renderList);
    bindField(els.fieldBasepath, "basepath", updateComputedPath);
    bindField(els.fieldFilename, "filename", () => { renderList(); updateComputedPath(); });
    bindField(els.fieldDate, "date");
    bindField(els.fieldDescription, "description");

    window.addEventListener("beforeunload", (e) => {
        if (state.dirty) {
            e.preventDefault();
            e.returnValue = "";
        }
    });
}

init();
