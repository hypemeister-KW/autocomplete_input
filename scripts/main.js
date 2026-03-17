import { data } from "./data.js";

const input = document.getElementById("autocomplete-input");
const list = document.getElementById("autocomplete-list");

let currentIndex = -1;

function filterData(query) {
  return data.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text, query) {
  const escaped = escapeRegex(query);
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, `<span class="highlight">$1</span>`);
}

function renderList(items, query) {
  list.innerHTML = "";
  currentIndex = -1;

  if (items.length === 0) {
    list.innerHTML = "<li>Brak wyników</li>";
    list.classList.remove("hidden");
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = highlightMatch(item, query);

    li.addEventListener("click", () => {
      input.value = item;
      hideList();
    });

    list.appendChild(li);
  });

  list.classList.remove("hidden");
}

function hideList() {
  list.classList.add("hidden");
}

input.addEventListener("input", () => {
  const query = input.value.trim();

  if (!query) {
    hideList();
    return;
  }

  const results = filterData(query);
  renderList(results, query);
});

input.addEventListener("keydown", (e) => {
  const items = list.querySelectorAll("li");

  if (!items.length) return;

  if (e.key === "ArrowDown") {
    currentIndex++;
  } else if (e.key === "ArrowUp") {
    currentIndex--;
  } else if (e.key === "Enter") {
    if (currentIndex >= 0) {
      items[currentIndex].click();
    }
    return;
  }

  if (currentIndex >= items.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = items.length - 1;

  items.forEach((item) => item.classList.remove("active"));
  items[currentIndex].classList.add("active");
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".autocomplete")) {
    hideList();
  }
});
