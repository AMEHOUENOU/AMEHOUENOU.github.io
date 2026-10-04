/* Projets d'automatisation + filtres dans la section « Projets » (index.html)
   Ajouter un projet : copier un objet dans AUTOMATIONS. Les médias sont dans /automatisation/ */
(() => {
  const AUTOMATIONS = [
    {
      title: "Chatbot IA pour hôtel",
      category: "Automatisation",
      summary: "Un assistant Telegram qui répond aux clients à toute heure à partir de la FAQ de l'hôtel et prévient le personnel pour les réservations et réclamations.",
      cover: "/images/automatisation/auto_2.png",
      // Vidéos : { type: "file", src: "/automatisation/xxx.mp4" } ou { type: "youtube", id: "ID" }
      videos: [
        { type: "file", src: "/automatisation/vide_auto_1.mp4", label: "Démo 1" },
        { type: "file", src: "/images/automatisation/vide_auto_2.mp4", label: "Démo 2" }
      ],
      photos: [
        { src: "/images/automatisation/auto_1.png", alt: "Workflow n8n et accueil du bot sur Telegram" },
        { src: "/images/automatisation/auto_2.png", alt: "Le bot répond aux tarifs de l'hôtel" }
      ],
      sections: [
        { title: "Le problème", text: "Les clients posent sans cesse les mêmes questions (tarifs, horaires, services) et un message resté sans réponse peut faire perdre une réservation." },
        { title: "La solution", text: "Un agent IA construit avec n8n et Google Gemini répond sur Telegram en s'appuyant uniquement sur les informations de l'hôtel. Quand il ne sait pas, il ne devine pas : il alerte un humain." },
        { title: "Ce qu'il fait", list: [
          "Répond aux questions sur les prix, les horaires, les services et le paiement",
          "Se souvient de la conversation de chaque client",
          "Alerte le personnel pour une réservation, une plainte ou une demande hors FAQ",
          "Refuse poliment les sujets sans rapport avec l'hôtel"
        ] },
        { title: "Mise en place", text: "n8n hébergé avec Docker, relié à Telegram par un webhook sécurisé. Démo en direct sur demande." }
      ],
      tags: ["n8n", "Google Gemini", "Telegram", "Docker"],
      links: [{ label: "Workflow sur GitHub", url: "" }]
    }
  ];
  const LABELS = { web: "Web", mobile: "Mobile", infra: "Infrastructure", desktop: "Desktop", auto: "Automatisation" };

  const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
  const icon = (c) => { const i = h("i"); i.className = c; i.setAttribute("aria-hidden", "true"); return i; };
  const picture = (src, alt) => {
    const i = h("img"); i.src = src; i.alt = alt || ""; i.loading = "lazy";
    i.addEventListener("error", () => { i.style.visibility = "hidden"; i.parentElement?.classList.add("is-empty"); });
    return i;
  };

  const grid = document.querySelector("#projects .projects-grid");
  if (!grid) return;
  const css = h("link"); css.rel = "stylesheet"; css.href = "automatisation.css"; document.head.append(css);

  // Fenêtre de démo
  const dlg = h("dialog", "auto-modal");
  dlg.setAttribute("aria-labelledby", "auto-title");
  dlg.innerHTML = '<div class="auto-modal__inner"><button type="button" class="auto-close" aria-label="Fermer"><i class="fas fa-xmark" aria-hidden="true"></i></button>' +
    '<div class="auto-media"><div class="auto-stage"></div><div class="auto-thumbs"></div></div>' +
    '<div class="auto-info"><p class="auto-cat"></p><h3 id="auto-title"></h3><div class="auto-desc"></div><div class="auto-tags"></div><div class="auto-links"></div></div></div>';
  document.body.append(dlg);
  const $ = (s) => dlg.querySelector(s);
  const stage = $(".auto-stage"), thumbs = $(".auto-thumbs");
  let items = [], current = null;

  function show(i) {
    stage.replaceChildren(); stage.classList.remove("is-empty");
    thumbs.querySelectorAll(".auto-thumb").forEach((t, k) => t.setAttribute("aria-current", String(k === i)));
    const it = items[i];
    if (!it) { stage.classList.add("is-empty"); stage.append(h("p", null, "Les médias de ce projet arrivent bientôt.")); return; }
    if (it.kind === "video") {
      const v = it.v;
      if (v.type === "youtube") {
        const f = h("iframe");
        f.src = "/images/automatisation/vide_auto_2.mp4" + encodeURIComponent(v.id) + "?rel=0";
        f.title = "Démo : " + current.title; f.allow = "encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true;
        stage.append(f);
      } else {
        const m = h("video"); m.controls = true; m.playsInline = true; m.preload = "metadata"; m.poster = current.cover; m.src = v.src;
        stage.append(m);
      }
    } else stage.append(picture(it.src, it.alt));
  }

  function openProject(a) {
    current = a;
    $(".auto-cat").textContent = a.category;
    $("#auto-title").textContent = a.title;
    const d = $(".auto-desc"); d.replaceChildren();
    a.sections.forEach((s) => {
      d.append(h("h4", null, s.title));
      if (s.text) d.append(h("p", null, s.text));
      if (s.list) { const ul = h("ul"); s.list.forEach((t) => ul.append(h("li", null, t))); d.append(ul); }
    });
    const tg = $(".auto-tags"); tg.replaceChildren(); a.tags.forEach((t) => tg.append(h("span", null, t)));
    const ln = $(".auto-links"); ln.replaceChildren();
    (a.links || []).filter((l) => l.url).forEach((l) => { const el = h("a", null, l.label); el.href = l.url; el.target = "_blank"; el.rel = "noopener"; ln.append(el); });
    items = [];
    (a.videos || []).filter((v) => v.id || v.src).forEach((v) => items.push({ kind: "video", v }));
    (a.photos || []).forEach((p) => items.push({ kind: "photo", ...p }));
    thumbs.replaceChildren();
    items.forEach((it, i) => {
      const b = h("button", "auto-thumb" + (it.kind === "video" ? " is-video" : "")); b.type = "button";
      b.setAttribute("aria-label", it.kind === "video" ? "Voir la vidéo : " + (it.v.label || i + 1) : "Voir la photo : " + (it.alt || i + 1));
      b.append(picture(it.kind === "video" ? a.cover : it.src, ""));
      if (it.kind === "video") b.append(icon("fas fa-play"));
      b.addEventListener("click", () => show(i));
      thumbs.append(b);
    });
    show(0);
    document.body.classList.add("auto-lock");
    dlg.showModal(); dlg.scrollTop = 0;
  }
  $(".auto-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { stage.replaceChildren(); document.body.classList.remove("auto-lock"); });

  // Cartes d'automatisation, au même format que les autres projets
  AUTOMATIONS.forEach((a) => {
    const card = h("div", "project-card is-demo"); card.dataset.cat = "auto";
    const img = h("div", "project-img"); img.append(picture(a.cover, a.title));
    const body = h("div", "project-content");
    const tech = h("div", "project-tech"); a.tags.forEach((t) => tech.append(h("span", "tech-tag", t)));
    const links = h("div", "project-links");
    const open = h("a"); open.href = "#"; open.append(icon("fas fa-circle-play"), " Voir la démo");
    open.addEventListener("click", (e) => e.preventDefault());
    links.append(open);
    body.append(h("h3", null, a.title), h("p", null, a.summary), tech, links);
    card.append(img, body);
    card.addEventListener("click", () => openProject(a));
    grid.append(card);
  });

  // Filtres : Tout / catégories présentes
  const cards = [...grid.querySelectorAll(".project-card")];
  const cats = [...new Set(cards.map((c) => c.dataset.cat).filter(Boolean))];
  const bar = h("div", "proj-filters"); bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "Filtrer les projets");
  ["all", ...cats].forEach((k) => {
    const b = h("button", "proj-filter" + (k === "all" ? " is-active" : ""), k === "all" ? "Tout" : LABELS[k] || k);
    b.type = "button"; b.setAttribute("aria-pressed", String(k === "all"));
    b.addEventListener("click", () => {
      bar.querySelectorAll("button").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
      cards.forEach((c) => { c.hidden = !(k === "all" || c.dataset.cat === k); });
    });
    bar.append(b);
  });
  grid.before(bar);
})();