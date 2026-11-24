(function () {
  "use strict";

  var bins = [
    {
      n: "Organic",
      e: "Food scraps, peels, leaves",
      g: "Compost / wet-waste bin",
      tip: "Keep food scraps separate and compost them where facilities are available.",
      c: "#2a7f5a"
    },
    {
      n: "Plastic",
      e: "Bottles, containers, wrappers",
      g: "Recycling bin (where accepted)",
      tip: "Empty and clean recyclable plastic containers before placing them in the dry-waste stream.",
      c: "#3b6db3"
    },
    {
      n: "Paper",
      e: "Newspapers, boxes, cartons",
      g: "Dry-recyclables bin",
      tip: "Keep paper dry and separate from food or liquid contamination.",
      c: "#c26a1a"
    },
    {
      n: "Hazardous / E-waste",
      e: "Batteries, bulbs, old electronics",
      g: "Special collection point",
      tip: "Never mix batteries or electronic waste with ordinary household waste.",
      c: "#c84f50"
    }
  ];

  var tabs = document.getElementById("tabs");
  var card = document.getElementById("binCard");
  var slider = document.getElementById("rs");

  function show(index) {
    var item = bins[index];
    if (!item || !card || !tabs) return;

    card.style.background = item.c;
    card.innerHTML =
      '<div><small>Category</small><h3></h3><p class="bin-examples"></p></div>' +
      '<div><small>Goes to</small><div class="go"></div><p class="bin-tip"></p></div>';

    card.querySelector("h3").textContent = item.n;
    card.querySelector(".bin-examples").textContent = item.e;
    card.querySelector(".go").textContent = item.g;
    card.querySelector(".bin-tip").textContent = item.tip;

    Array.prototype.forEach.call(tabs.children, function (tab, i) {
      var selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.setAttribute("tabindex", selected ? "0" : "-1");
      tab.style.background = selected ? item.c : "";
      tab.style.color = selected ? "#fff" : "";
    });
  }

  if (tabs && card) {
    bins.forEach(function (item, index) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.id = "waste-tab-" + index;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", "binCard");
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
      tab.textContent = item.n;

      tab.addEventListener("click", function () {
        show(index);
      });

      tab.addEventListener("keydown", function (event) {
        var next = index;
        if (event.key === "ArrowRight") next = (index + 1) % bins.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + bins.length) % bins.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = bins.length - 1;
        else return;

        event.preventDefault();
        show(next);
        tabs.children[next].focus();
      });

      tabs.appendChild(tab);
    });

    show(0);
  }

  function updateConfidence() {
    if (!slider) return;

    var value = Number(slider.value);
    var isLow = value < 60;
    var resultName = document.getElementById("rn");
    var resultConfidence = document.getElementById("rc");
    var meter = document.getElementById("rm");
    var recommendation = document.getElementById("rr");
    var rangeValue = document.getElementById("rangeValue");

    if (resultName) resultName.textContent = isLow ? "Uncertain" : "Organic";
    if (resultConfidence) resultConfidence.textContent = value + "% confidence";
    if (meter) {
      meter.style.width = value + "%";
      meter.style.background = isLow ? "#c84f50" : "#2a7f5a";
    }
    if (recommendation) {
      recommendation.textContent = isLow
        ? "The result is uncertain. Check the item yourself or retake the photo."
        : "Place food scraps and other accepted organic waste in the compost / wet-waste stream.";
    }
    if (rangeValue) rangeValue.textContent = value + "%";
  }

  if (slider) {
    slider.addEventListener("input", updateConfidence);
    updateConfidence();
  }
})();