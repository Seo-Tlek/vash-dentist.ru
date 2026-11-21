(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var prose = document.querySelector(".sheet .prose");
  var toc = document.getElementById("toc");
  if (prose && toc) {
    var heads = prose.querySelectorAll("h2");
    if (heads.length >= 2) {
      var list = toc.querySelector("ol");
      heads.forEach(function (head, index) {
        if (!head.id) head.id = "razdel-" + (index + 1);
        var item = document.createElement("li");
        var link = document.createElement("a");
        link.href = "#" + head.id;
        link.textContent = head.textContent;
        item.appendChild(link);
        list.appendChild(item);
      });
      toc.hidden = false;
    }
  }

  var app = document.getElementById("search-app");
  if (!app) return;
  var params = new URLSearchParams(window.location.search);
  var query = (params.get("q") || "").trim();
  var box = document.getElementById("q");
  if (box && query) box.value = query;
  var status = document.getElementById("search-status");
  var results = document.getElementById("search-results");
  fetch(app.getAttribute("data-index"))
    .then(function (response) { return response.json(); })
    .then(function (items) {
      var needle = query.toLowerCase();
      var found = items.filter(function (item) {
        if (!needle) return true;
        return (item.title + " " + item.description + " " + item.category).toLowerCase().indexOf(needle) !== -1;
      });
      var fallback = document.getElementById("search-fallback");
      if (fallback) fallback.hidden = true;
      results.hidden = false;
      results.innerHTML = "";
      if (!found.length) {
        status.textContent = "По запросу «" + query + "» в опубликованных материалах ничего нет.";
        return;
      }
      status.textContent = query
        ? "Найдено: " + found.length
        : "Опубликованные материалы";
      found.forEach(function (item) {
        var li = document.createElement("li");
        var link = document.createElement("a");
        link.href = item.url;
        link.textContent = item.title;
        var text = document.createElement("p");
        text.textContent = item.description;
        li.appendChild(link);
        li.appendChild(text);
        results.appendChild(li);
      });
    })
    .catch(function () {
      status.textContent = "Поиск сейчас не открылся. Ниже список материалов.";
    });
})();
