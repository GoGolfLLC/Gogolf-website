/* Square checkout links for the Merchandise page.
   Fill in a URL for an item id. Leave it as "" to show "Available at the front desk".
   To change a photo, replace that card's img src with a file in /images/merch/. */
var MERCH_LINKS = {
  "side-logo-hat": "",
  "front-logo-snapback": "",
  "womens-dotted-hat": "",
  "mens-puma-polo": "",
  "womens-puma-polo": "",
  "unisex-puma-hoodie": "",
  "microfiber-towel": "",
  "chrome-soft-balls": "",
  "triple-track-balls": "",
  "chrome-super-soft-balls": "",
  "golf-glove": "",
  "birtee": "",
  "pride-tees": "",
  "tour-velvet": "",
  "winn-oversize": "",
  "winn-standard": "",
  "winn-vision": "",
  "grip-installation": ""
};

function applyMerchLinks() {
  var cards = document.querySelectorAll("[data-merch]");
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var id = card.getAttribute("data-merch");
    var slot = card.querySelector("[data-merch-buy]");
    if (!slot || !Object.prototype.hasOwnProperty.call(MERCH_LINKS, id)) continue;
    var url = String(MERCH_LINKS[id] || "").trim();
    slot.textContent = "";
    if (!url || url.indexOf("https://") !== 0) {
      slot.textContent = "Available at the front desk";
      continue;
    }
    var link = document.createElement("a");
    link.className = "btn";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.appendChild(document.createTextNode("Buy"));
    var note = document.createElement("span");
    note.className = "sr-only";
    note.textContent = " (opens in a new tab)";
    link.appendChild(note);
    slot.appendChild(link);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyMerchLinks);
} else {
  applyMerchLinks();
}
