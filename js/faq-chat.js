/* Approved-answer chat. No network calls. A typed question gets a reply
   only when its keywords match exactly one of the seven answers. */
(function () {
  if (document.querySelector("[data-faq-chat]")) return;

  var QUESTIONS = [
    {
      q: "What happens during an evaluation?",
      a: "An evaluation is a 60-minute session. We video your putting, chipping, wedge swings, and full swing, then sit down with you to go over your game and build a custom plan for your goals.",
      keys: ["evaluation", "eval"]
    },
    {
      q: "Can I take an evaluation with one coach and lessons with another?",
      a: "No. Your evaluation and your lessons are with the same coach. Our coaches share a similar philosophy, but each has their own coaching style, and the evaluation is built to set up that coach's program for you.",
      keys: ["coach", "instructor"]
    },
    {
      q: "Do I need an evaluation?",
      a: "Yes. Everyone starts with an evaluation, from complete beginners to tour players. Every body moves differently, so we also go over your injury history, athletic background, and goal timeline to build the right plan for you.",
      keys: ["beginner", "need"]
    },
    {
      q: "How does a lesson series work?",
      a: "Lessons are 30 or 60 minutes, once a week. Based on your current ability and your goals, we'll build either a 6-week or a 12-week program.",
      keys: ["series", "program", "6-week", "12-week"]
    },
    {
      q: "How does sim time work with the lesson programs?",
      a: "Each program includes practice time: 3 hours with the 6-week program and 6 hours with the 12-week. Most players practice for 30 minutes right after their lesson, but you can use your practice hours however you like.",
      keys: ["sim", "practice", "hours"]
    },
    {
      q: "What's the expiration?",
      a: "A 6-week program, including its practice hours, has to be used within 70 days, and a 12-week program within 100 days. That gives you some room to work around travel or a busy week.",
      keys: ["expire", "expiration", "deadline"]
    },
    {
      q: "What if I miss a week?",
      a: "Things come up. We have a 24-hour cancellation policy. If you let us know at least a day ahead, we'll move your lesson to another day that week or add it to the end of your program. If you've had to cancel several times and your deadline is getting close, we can schedule two lessons in one week or turn a 30-minute lesson into a 60-minute one.",
      keys: ["miss", "cancel", "reschedule"]
    }
  ];

  var root = document.createElement("div");
  root.className = "faq-chat";
  root.setAttribute("data-faq-chat", "");

  var launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "faq-chat-launcher";
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "faq-chat-panel");
  launcher.textContent = "Questions?";

  var panel = document.createElement("section");
  panel.id = "faq-chat-panel";
  panel.className = "faq-chat-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "faq-chat-title");

  var header = document.createElement("div");
  header.className = "faq-chat-header";
  var title = document.createElement("h2");
  title.id = "faq-chat-title";
  title.textContent = "Questions?";
  var closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "faq-chat-close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "Close";
  header.appendChild(title);
  header.appendChild(closeBtn);

  var log = document.createElement("div");
  log.className = "faq-chat-log";
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");
  log.setAttribute("aria-relevant", "additions");

  var suggestions = document.createElement("div");
  suggestions.className = "faq-chat-suggestions";
  suggestions.setAttribute("role", "group");
  suggestions.setAttribute("aria-label", "Common questions");

  var form = document.createElement("form");
  form.className = "faq-chat-form";
  form.setAttribute("action", "");
  var label = document.createElement("label");
  label.className = "sr-only";
  label.htmlFor = "faq-chat-input";
  label.textContent = "Type your question";
  var input = document.createElement("input");
  input.id = "faq-chat-input";
  input.type = "text";
  input.setAttribute("autocomplete", "off");
  input.setAttribute("maxlength", "200");
  input.placeholder = "Type your question";
  var send = document.createElement("button");
  send.type = "submit";
  send.className = "faq-chat-send";
  send.textContent = "Send";
  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(send);

  panel.appendChild(header);
  panel.appendChild(log);
  panel.appendChild(suggestions);
  panel.appendChild(form);
  root.appendChild(panel);
  root.appendChild(launcher);
  document.body.appendChild(root);

  addMessage("Hi! Pick a question below or type your own.", "bot");
  QUESTIONS.forEach(function (item) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = item.q;
    button.addEventListener("click", function () {
      ask(item.q, item);
    });
    suggestions.appendChild(button);
  });

  launcher.addEventListener("click", function () {
    if (panel.hidden) openPanel();
    else closePanel();
  });
  closeBtn.addEventListener("click", closePanel);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    ask(text, matchQuestion(text));
    input.focus();
  });

  var lastFocus = null;

  function openPanel() {
    lastFocus = document.activeElement;
    panel.hidden = false;
    root.classList.add("is-open");
    document.body.classList.add("faq-chat-open");
    launcher.setAttribute("aria-expanded", "true");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closePanel() {
    panel.hidden = true;
    root.classList.remove("is-open");
    document.body.classList.remove("faq-chat-open");
    launcher.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKeydown);
    launcher.focus();
  }

  function onKeydown(event) {
    if (panel.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
      return;
    }
    if (event.key !== "Tab") return;
    var items = focusable(panel);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function ask(text, item) {
    addMessage(text, "user");
    var reply = addMessage("", "bot");
    if (item) {
      reply.textContent = item.a;
    } else {
      reply.appendChild(fallback());
    }
    log.scrollTop = log.scrollHeight;
  }

  function addMessage(text, who) {
    var p = document.createElement("p");
    p.className = "faq-chat-msg is-" + who;
    p.textContent = text;
    log.appendChild(p);
    return p;
  }

  function fallback() {
    var span = document.createElement("span");
    span.appendChild(document.createTextNode("Good question! I can only answer a few common questions here. Please send us a message on our "));
    var contact = document.createElement("a");
    contact.href = "/contact-us";
    contact.textContent = "Contact Us page";
    span.appendChild(contact);
    span.appendChild(document.createTextNode(" or email "));
    var mail = document.createElement("a");
    mail.href = "mailto:Filindo@gogolfsj.com";
    mail.textContent = "Filindo@gogolfsj.com";
    span.appendChild(mail);
    span.appendChild(document.createTextNode(" and we'll get back to you."));
    return span;
  }

  function matchQuestion(text) {
    var found = null;
    for (var i = 0; i < QUESTIONS.length; i++) {
      if (!hasKeyword(text, QUESTIONS[i].keys)) continue;
      if (found) return null;
      found = QUESTIONS[i];
    }
    return found;
  }

  function hasKeyword(text, keys) {
    for (var i = 0; i < keys.length; i++) {
      if (keywordIn(text, keys[i])) return true;
    }
    return false;
  }

  function keywordIn(text, keyword) {
    var hay = normalize(text);
    var needle = normalize(keyword);
    if (!needle) return false;
    if (needle.indexOf(" ") !== -1) return hay.indexOf(needle) !== -1;
    var words = hay.split(" ");
    for (var i = 0; i < words.length; i++) {
      if (wordHit(words[i], needle)) return true;
    }
    return false;
  }

  function wordHit(word, keyword) {
    if (word === keyword) return true;
    if (keyword === "sim") {
      return word === "sims" || word === "simulator" || word === "simulators";
    }
    if (keyword === "eval") return word.indexOf("eval") === 0;
    if (keyword.length >= 4 && word.indexOf(keyword) === 0) return true;
    return false;
  }

  function normalize(text) {
    return String(text)
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/[-–—]/g, " ")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function focusable(container) {
    var nodes = container.querySelectorAll("button, a[href], input");
    var list = [];
    for (var i = 0; i < nodes.length; i++) {
      if (!nodes[i].disabled && nodes[i].getClientRects().length) list.push(nodes[i]);
    }
    return list;
  }
})();
