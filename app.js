const OFFERS = [
  {
    id: "melbet", name: "Мелбет", logo: "assets/logos/melbet.png", amount: 30000, rating: 4.4, deposit: true,
    type: "Бонус новым игрокам", ribbon: "Максимум", ribbonGold: true,
    points: ["Первый депозит от 1 000 ₽", "Серия из пяти ставок", "Бонус начисляется частями"]
  },
  {
    id: "fonbet", name: "Фонбет", logo: "assets/logos/fonbet.png", amount: 15000, rating: 4.9, deposit: false,
    type: "Фрибет за регистрацию", ribbon: "Топ",
    points: ["Регистрация и идентификация", "Депозит не требуется", "Получение после проверки"]
  },
  {
    id: "marathonbet", name: "Marathonbet", logo: "assets/logos/marathonbet.png", amount: 11111, rating: 4.6, deposit: true,
    type: "Фрибет для новичков",
    points: ["Депозит от 500 ₽", "Шесть фрибетов этапами", "Ставки с коэффициентом от 2.00"]
  },
  {
    id: "winline", name: "Winline", logo: "assets/logos/winline.png", amount: 10000, rating: 4.8, deposit: true,
    type: "Фрибет новым игрокам", ribbon: "Популярный",
    points: ["До десяти фрибетов", "Верификация аккаунта", "Депозит от 1 000 ₽"]
  },
  {
    id: "betboom", name: "BetBoom", logo: "assets/logos/betboom.png", amount: 10000, rating: 4.7, deposit: true,
    type: "Серия фрибетов за депозит",
    points: ["Пять фрибетов", "Депозит от 100 ₽", "В приложении возможен бездеп"]
  },
  {
    id: "pari", name: "PARI", logo: "assets/logos/pari.png", amount: 5000, rating: 4.5, deposit: true,
    type: "Серия фрибетов",
    points: ["Пять фрибетов по 1 000 ₽", "Идентификация аккаунта", "Первый депозит от 1 000 ₽"]
  },
  {
    id: "baltbet", name: "Балтбет", logo: "assets/logos/baltbet.png", amount: 8000, rating: 4.3, deposit: false,
    type: "Приветственный фрибет",
    points: ["Барабан после регистрации", "Фрибет до 8 000 ₽", "Требуется идентификация"]
  },
  {
    id: "betcity", url: "https://r.dalead.pro/go-xe10d7d80df29e300?subid=ff", name: "БЕТСИТИ", logo: "assets/logos/betcity.png", amount: 2000, rating: 4.2, deposit: false,
    type: "Фрибеты за регистрацию",
    points: ["Фрибет до 2 000 ₽", "Регистрация и проверка", "Депозит не требуется"]
  },
  {
    id: "leon", name: "Leon", logo: "assets/logos/leon.png", amount: 3000, rating: 4.1, deposit: true,
    type: "Фрибет новым игрокам",
    points: ["Промокод при регистрации", "Первая ставка от 1 000 ₽", "Дополнительная акция до 3 000 ₽"]
  }
];

const state = { filter: "all", query: "", sort: "amount" };
const grid = document.querySelector("#offersGrid");
const count = document.querySelector("#resultCount");
const empty = document.querySelector("#emptyState");
const dialog = document.querySelector("#offerDialog");
const dialogContent = document.querySelector("#dialogContent");
const toast = document.querySelector("#toast");
const money = value => new Intl.NumberFormat("ru-RU").format(value) + " ₽";

function visibleOffers() {
  const query = state.query.trim().toLocaleLowerCase("ru");
  return OFFERS
    .filter(offer => state.filter === "all" || (state.filter === "free" ? !offer.deposit : offer.deposit))
    .filter(offer => !query || offer.name.toLocaleLowerCase("ru").includes(query))
    .sort((a, b) => state.sort === "name"
      ? a.name.localeCompare(b.name, "ru")
      : b[state.sort] - a[state.sort]);
}

function renderOffers() {
  const offers = visibleOffers();
  grid.innerHTML = offers.map(offer => `
    <article class="offer-card reveal is-visible">
      ${offer.ribbon ? `<span class="offer-ribbon ${offer.ribbonGold ? "is-gold" : ""}">${offer.ribbon}</span>` : ""}
      <div class="offer-head">
        <div class="bookmaker-logo"><img src="${offer.logo}" alt="${offer.name}" loading="lazy"></div>
        <div class="offer-brand"><strong>${offer.name}</strong><span>${offer.type}</span></div>
      </div>
      <p class="offer-amount-label">Фрибет до</p>
      <p class="offer-amount">${money(offer.amount)}</p>
      <div class="offer-tags">
        <span class="tag tag-green"><i class="ph ph-sparkle" aria-hidden="true"></i> Новый игрок</span>
        <span class="tag tag-blue">${offer.deposit ? "С депозитом" : "Без депозита"}</span>
      </div>
      <ul class="offer-points">
        ${offer.points.map(point => `<li><i class="ph ph-check" aria-hidden="true"></i><span>${point}</span></li>`).join("")}
      </ul>
      <div class="offer-actions">
        ${offer.url
          ? `<a class="button button-primary" href="${offer.url}" rel="sponsored">Получить</a>`
          : `<button class="button button-primary" type="button" data-get="${offer.id}">Получить</button>`}
        <button class="button button-secondary" type="button" data-offer="${offer.id}">Условия</button>
      </div>
      <div class="offer-meta">
        <span class="rating"><i class="ph ph-star" aria-hidden="true"></i> ${offer.rating}</span>
        <span>18+ · Играйте ответственно</span>
      </div>
    </article>
  `).join("");
  count.textContent = `${offers.length} ${pluralize(offers.length, "предложение", "предложения", "предложений")}`;
  empty.hidden = offers.length > 0;
}

function pluralize(number, one, few, many) {
  const mod10 = number % 10;
  const mod100 = number % 100;
  return mod10 === 1 && mod100 !== 11 ? one : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? few : many;
}

function openOffer(id) {
  const offer = OFFERS.find(item => item.id === id);
  if (!offer) return;
  dialogContent.innerHTML = `
    <div class="dialog-body">
      <div class="feature-brand">
        <div class="bookmaker-logo"><img src="${offer.logo}" alt="${offer.name}"></div>
        <div><span>${offer.name}</span><small>${offer.type}</small></div>
      </div>
      <p>Фрибет до</p>
      <h2>${money(offer.amount)}</h2>
      <div class="feature-tags">
        <span class="tag tag-green">Новый игрок</span>
        <span class="tag tag-blue">${offer.deposit ? "С депозитом" : "Без депозита"}</span>
      </div>
      <ul>${offer.points.map(point => `<li><i class="ph ph-check" aria-hidden="true"></i><span>${point}</span></li>`).join("")}</ul>
      <p class="dialog-note">${offer.url ? "" : "Партнёрская ссылка пока не подключена. "}Перед участием проверьте полные и актуальные правила акции на официальном сайте букмекера.</p>
      <button class="button button-primary button-wide" type="button" data-notify>Понятно</button>
    </div>
  `;
  dialog.showModal();
}

document.querySelector(".filter-tabs").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("is-active", item === button));
  renderOffers();
});

document.querySelector("#offerSearch").addEventListener("input", event => {
  state.query = event.target.value;
  renderOffers();
});

document.querySelector("#offerSort").addEventListener("change", event => {
  state.sort = event.target.value;
  renderOffers();
});

document.querySelector("#resetFilters").addEventListener("click", () => {
  state.filter = "all";
  state.query = "";
  state.sort = "amount";
  document.querySelector("#offerSearch").value = "";
  document.querySelector("#offerSort").value = "amount";
  document.querySelectorAll("[data-filter]").forEach(button => button.classList.toggle("is-active", button.dataset.filter === "all"));
  renderOffers();
});

document.addEventListener("click", event => {
  const offerButton = event.target.closest("[data-offer]");
  const getButton = event.target.closest("[data-get]");
  if (offerButton) openOffer(offerButton.dataset.offer);
  if (getButton) openOffer(getButton.dataset.get);
  if (event.target.closest("[data-dialog-close]")) dialog.close();
  if (event.target.closest("[data-notify]")) {
    dialog.close();
    toast.textContent = "Условия сохранены. Проверьте актуальные правила на сайте букмекера.";
    toast.classList.add("is-visible");
    setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }
  if (event.target.closest("[data-search-focus]")) {
    document.querySelector("#offers").scrollIntoView();
    setTimeout(() => document.querySelector("#offerSearch").focus(), 450);
  }
});

dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .08 });

document.querySelectorAll(".reveal").forEach(item => observer.observe(item));
document.querySelectorAll("[data-year]").forEach(item => { item.textContent = new Date().getFullYear(); });

renderOffers();
console.assert(visibleOffers().length === 9 && visibleOffers()[0].id === "melbet", "Offer sorting check failed");
