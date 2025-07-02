const input = document.getElementById("book-input");
const summaryBox = document.getElementById("summary");
const coverImg = document.getElementById("book-cover");

function toggleSummary() {
  const short = document.querySelector('.summary-short');
  const full = document.querySelector('.summary-full');
  const btn = document.querySelector('.read-more-btn');

  if (full.style.display === "none") {
    short.style.display = "none";
    full.style.display = "block";
    btn.textContent = "Read less";
  } else {
    short.style.display = "block";
    full.style.display = "none";
    btn.textContent = "Read more";
  }
}

function searchBook() {
  const book = input.value.trim();
  if (!book) return;

  summaryBox.innerHTML = `Searching summary for "<em>${book}</em>"...`;
  coverImg.src = "";
  coverImg.style.display = "none";

  fetch(`/.netlify/functions/summary?book=${encodeURIComponent(book)}`)
    .then((res) => res.json())
.then((data) => {
  const fullHTML = data.summary;
  
  // Extract summary text from the full HTML
  const match = fullHTML.match(/📝 <strong>Summary:<\/strong> (.*)/s);
  const summaryText = match ? match[1] : "";

  const maxWords = 50;
  const words = summaryText.split(' ');

  if (words.length > maxWords) {
    const shortText = words.slice(0, maxWords).join(' ') + "...";
    summaryBox.innerHTML = `
      ${fullHTML.replace(summaryText, `<span class="summary-short">${shortText}</span><span class="summary-full" style="display:none;">${summaryText}</span> <button class="read-more-btn" onclick="toggleSummary()">Read more</button>`)}
    `;
  } else {
    summaryBox.innerHTML = fullHTML;
  }

  if (data.image) {
    coverImg.src = data.image;
    coverImg.alt = "Book cover";
    coverImg.style.display = "block";
  }
  // recomendations section
  if (data.recommendations && Array.isArray(data.recommendations)) {
  const list = document.getElementById("recommendations");
  list.innerHTML = ""; // Clear old list

  data.recommendations.forEach(book => {
    const li = document.createElement("li");
    li.textContent = book.title;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      input.value = book.title;
      searchBook();
    });
    list.appendChild(li);
  });
}

    if (!recentSearches.includes(book)) {
  recentSearches.unshift(book);
  if (recentSearches.length > 5) recentSearches.pop(); // Limit to 5
  localStorage.setItem("searchHistory", JSON.stringify(recentSearches));
}
    renderRecentSearches();
})
    .catch((err) => {
      console.error("Error:", err);
      summaryBox.innerHTML = "Error fetching summary.";
    });
}

// action buttons 

function openGoogle() {
  const book = input.value.trim();
  if (!book) return;
  const url = `https://www.google.com/search?q=${encodeURIComponent(book)}+book+free+download`;
  window.open(url, "_blank");
}

function openYouTube(type) {
  const book = input.value.trim();
  if (!book) return;

  let query = `${book}`;
  if (type === "summary") {
    query += " book summary";
  } else if (type === "audiobook") {
    query += " audiobook";
  }

  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  window.open(url, "_blank");
}

let recentSearches = JSON.parse(localStorage.getItem("searchHistory")) || [];

function renderRecentSearches() {
  const ul = document.getElementById("recent-searches");
  if (!ul) return;

  ul.innerHTML = "";

  recentSearches.forEach(book => {
    const li = document.createElement("li");
    li.textContent = book;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      input.value = book;
      searchBook();
    });
    ul.appendChild(li);
  });
}

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchBook();
  }
});


window.onload = renderRecentSearches;

const defaultRecommendations = [
  "Atomic Habits",
  "The Power of Now",
  "Rich Dad Poor Dad",
  "Think and Grow Rich",
  "How to Win Friends and Influence People",
  "The Alchemist",
  "Deep Work",
  "The Subtle Art of Not Giving a F*ck",
  "Sapiens",
  "Ikigai"
];

function loadDefaultRecommendations() {
  const list = document.getElementById("recommendations");
  list.innerHTML = "";

  defaultRecommendations.forEach(book => {
    const li = document.createElement("li");
    li.textContent = book;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      input.value = book;
      searchBook();
    });
    list.appendChild(li);
  });
}

// Call it on page load
window.addEventListener("DOMContentLoaded", () => {
  loadDefaultRecommendations();
});

