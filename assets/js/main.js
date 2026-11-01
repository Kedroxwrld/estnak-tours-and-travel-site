/* =========================================================
   Estnak Tours and Travel — site interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(() => {
  "use strict";

  const WHATSAPP_NUMBER = "256774818301";
  const BUSINESS_EMAIL = "bnasa77@gmail.com";
  const whatsappOrderUrl = (message) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[+()\d][\d\s().-]{6,}$/;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const todayISO = new Date().toISOString().split("T")[0];

  const qs = (selector, context = document) => context.querySelector(selector);
  const qsa = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const on = (el, event, handler, options) => {
    if (el) el.addEventListener(event, handler, options);
  };
  const setText = (el, text) => {
    if (el) el.textContent = text;
  };

  /* ---------------------------------------------------------
     Toasts
     --------------------------------------------------------- */
  let toastHost = null;

  function toast(message, variant = "success") {
    if (!toastHost) {
      toastHost = document.createElement("div");
      toastHost.id = "toast-region";
      toastHost.className =
        "pointer-events-none fixed inset-x-4 bottom-24 z-[110] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end";
      toastHost.setAttribute("aria-live", "polite");
      document.body.appendChild(toastHost);
    }

    const item = document.createElement("div");
    item.className = `toast-item pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-float ${
      variant === "success"
        ? "bg-ink text-white"
        : "border border-slate-200 bg-white text-ink"
    }`;
    item.innerHTML =
      variant === "success"
        ? '<svg class="mt-0.5 h-4 w-4 shrink-0 text-jade-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg class="mt-0.5 h-4 w-4 shrink-0 text-royal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1" stroke-linecap="round"/></svg>';
    const text = document.createElement("span");
    text.textContent = message;
    item.appendChild(text);
    toastHost.appendChild(item);

    window.setTimeout(() => {
      item.style.transition = "opacity .3s ease, transform .3s ease";
      item.style.opacity = "0";
      item.style.transform = "translateY(6px)";
      window.setTimeout(() => item.remove(), 320);
    }, 3800);
  }

  /* ---------------------------------------------------------
     Header, mobile menu, dropdowns
     --------------------------------------------------------- */
  const header = qs("#site-header");
  const menu = qs("#mobile-menu");
  const menuPanel = menu ? qs(".menu-panel", menu) : null;
  let menuTrigger = null;

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 6);
  }
  on(window, "scroll", onScroll, { passive: true });
  onScroll();

  function getFocusable(context) {
    return qsa(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      context
    ).filter((el) => el.offsetParent !== null);
  }

  function openMenu(trigger) {
    if (!menu) return;
    menuTrigger = trigger || document.activeElement;
    menu.classList.add("is-open");
    menu.removeAttribute("inert");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    qsa("[data-menu-toggle]").forEach((btn) => btn.setAttribute("aria-expanded", "true"));
    window.setTimeout(() => {
      const closeBtn = qs("[data-menu-close]", menu);
      (closeBtn || getFocusable(menuPanel)[0])?.focus();
    }, 60);
  }

  function closeMenu() {
    if (!menu || !menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    menu.setAttribute("inert", "");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    qsa("[data-menu-toggle]").forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    menuTrigger?.focus();
  }

  qsa("[data-menu-toggle]").forEach((btn) => {
    on(btn, "click", () => {
      if (menu?.classList.contains("is-open")) closeMenu();
      else openMenu(btn);
    });
  });

  qsa("[data-menu-close]").forEach((btn) => on(btn, "click", closeMenu));
  on(menu ? qs(".menu-overlay", menu) : null, "click", closeMenu);
  qsa("a", menu || document.createElement("div")).forEach((link) => {
    on(link, "click", () => {
      if (link.getAttribute("href")?.startsWith("#")) closeMenu();
      else closeMenu();
    });
  });

  on(document, "keydown", (event) => {
    if (!menu?.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key === "Tab" && menuPanel) {
      const focusable = getFocusable(menuPanel);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Services dropdown: hover on pointer devices, click/tap + keyboard everywhere.
  const navDropdown = qs("[data-nav-dropdown]");
  if (navDropdown) {
    const navSummary = qs("summary", navDropdown);
    on(document, "click", (event) => {
      if (!navDropdown.contains(event.target)) navDropdown.open = false;
    });
    qsa("a", navDropdown).forEach((link) =>
      on(link, "click", () => {
        navDropdown.open = false;
      })
    );
    on(document, "keydown", (event) => {
      if (event.key === "Escape" && navDropdown.open) {
        event.preventDefault();
        navDropdown.open = false;
        navSummary?.focus();
      }
    });
  }

  // Language selector
  const langLabel = qs("[data-lang-label]");
  const langDropdown = qs("[data-lang-dropdown]");
  qsa("[data-lang]").forEach((btn) => {
    on(btn, "click", () => {
      const lang = btn.dataset.lang || "EN";
      setText(langLabel, lang);
      if (langDropdown) langDropdown.open = false;
      if (lang === "EN") {
        toast("English selected.");
      } else {
        toast(`Our ${btn.dataset.langName || lang} site is coming soon. Our team can assist you in ${btn.dataset.langName || lang}.`, "info");
      }
    });
  });
  on(document, "click", (event) => {
    if (langDropdown && !langDropdown.contains(event.target)) langDropdown.open = false;
  });

  /* ---------------------------------------------------------
     Wishlist
     --------------------------------------------------------- */
  const wishlistKey = "pv_wishlist_v1";

  function readWishlist() {
    try {
      const raw = localStorage.getItem(wishlistKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeWishlist(items) {
    try {
      localStorage.setItem(wishlistKey, JSON.stringify(items));
    } catch {
      /* storage can be unavailable in private/file contexts */
    }
  }

  function paintWishlistButton(btn, saved) {
    btn.setAttribute("aria-pressed", saved ? "true" : "false");
    btn.classList.toggle("text-rose-500", saved);
    const icon = qs("svg", btn);
    if (icon) icon.setAttribute("fill", saved ? "currentColor" : "none");
    const label = btn.dataset.wishlistLabel || "tour";
    btn.setAttribute("aria-label", `${saved ? "Remove" : "Save"} ${label} ${saved ? "from" : "to"} your wishlist`);
  }

  let wishlist = readWishlist();
  qsa("[data-wishlist]").forEach((btn) => {
    const id = btn.dataset.wishlist;
    paintWishlistButton(btn, wishlist.includes(id));
    on(btn, "click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const saved = wishlist.includes(id);
      wishlist = saved ? wishlist.filter((item) => item !== id) : [...wishlist, id];
      writeWishlist(wishlist);
      qsa(`[data-wishlist="${CSS.escape(id)}"]`).forEach((el) => paintWishlistButton(el, !saved));
      toast(saved ? "Removed from your wishlist." : "Saved to your wishlist. Find it again on this device.", saved ? "info" : "success");
    });
  });

  /* ---------------------------------------------------------
     Scroll reveal + counters
     --------------------------------------------------------- */
  const revealItems = qsa(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -36px 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const counters = qsa("[data-counter]");
  if (counters.length) {
    const animateCounter = (el) => {
      const target = Number(el.dataset.counter || 0);
      const decimals = Number(el.dataset.decimals || 0);
      const suffix = el.dataset.suffix || "";
      const duration = reduceMotion ? 0 : 1500;
      const start = performance.now();

      const tick = (now) => {
        const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = `${value.toFixed(decimals)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window && !reduceMotion) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((counter) => counterObserver.observe(counter));
    } else {
      counters.forEach((counter) => {
        setText(counter, `${Number(counter.dataset.counter).toFixed(Number(counter.dataset.decimals || 0))}${counter.dataset.suffix || ""}`);
      });
    }
  }

  /* ---------------------------------------------------------
     Carousel
     --------------------------------------------------------- */
  qsa("[data-carousel]").forEach((carousel) => {
    const track = qs("[data-carousel-track]", carousel);
    const prev = qs("[data-carousel-prev]", carousel);
    const next = qs("[data-carousel-next]", carousel);
    const progress = qs("[data-carousel-progress]", carousel);
    if (!track) return;

    const step = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap || "24") || 24;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.85;
    };

    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
      if (progress) {
        const pct = max <= 0 ? 100 : Math.min(100, Math.max(0, (track.scrollLeft / max) * 100));
        progress.style.width = `${pct}%`;
      }
    };

    on(prev, "click", () => track.scrollBy({ left: -step() * 1.35, behavior: "smooth" }));
    on(next, "click", () => track.scrollBy({ left: step() * 1.35, behavior: "smooth" }));
    on(track, "scroll", update, { passive: true });
    on(window, "resize", update);
    update();
  });

  /* ---------------------------------------------------------
     Hero destination combobox
     --------------------------------------------------------- */
  const destinations = [
    { name: "Bwindi Impenetrable Forest", country: "Uganda" },
    { name: "Murchison Falls National Park", country: "Uganda" },
    { name: "Lake Bunyonyi", country: "Uganda" },
    { name: "Zanzibar", country: "Tanzania" },
    { name: "Serengeti National Park", country: "Tanzania" },
    { name: "Ngorongoro Crater", country: "Tanzania" },
    { name: "Maasai Mara", country: "Kenya" },
    { name: "Amboseli National Park", country: "Kenya" },
    { name: "Dubai", country: "United Arab Emirates" },
    { name: "Santorini", country: "Greece" },
    { name: "Bali", country: "Indonesia" },
    { name: "Paris", country: "France" },
    { name: "Maldives", country: "Maldives" },
    { name: "Cape Town", country: "South Africa" },
    { name: "Kyoto", country: "Japan" },
    { name: "Venice", country: "Italy" },
  ];

  const heroForm = qs("#hero-search");
  const heroInput = qs("#hero-destination");
  const heroList = qs("#hero-destination-list");
  const heroWrap = qs("#hero-destination-wrap");
  let activeOption = -1;

  function renderHeroOptions(query = "") {
    if (!heroList) return;
    const term = query.trim().toLowerCase();
    const matches = destinations
      .filter((item) => !term || `${item.name} ${item.country}`.toLowerCase().includes(term))
      .slice(0, 6);

    heroList.innerHTML = "";

    if (!matches.length) {
      const empty = document.createElement("li");
      empty.className = "px-4 py-3.5 text-sm text-slate-500";
      empty.setAttribute("role", "presentation");
      empty.textContent = "No exact match — search all tours instead.";
      heroList.appendChild(empty);
    } else {
      const heading = document.createElement("li");
      heading.className = "px-4 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400";
      heading.setAttribute("role", "presentation");
      heading.textContent = term ? "Matching destinations" : "Popular right now";
      heroList.appendChild(heading);
    }

    matches.forEach((item, index) => {
      const li = document.createElement("li");
      li.id = `hero-option-${index}`;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");
      li.dataset.value = item.name;
      li.className =
        "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-ink transition hover:bg-royal-50";
      li.innerHTML = `<span class="flex min-w-0 items-center gap-2.5">
          <svg class="h-4 w-4 shrink-0 text-royal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5"/></svg>
          <span class="truncate font-medium">${item.name}</span>
        </span>
        <span class="shrink-0 text-[11px] text-slate-400">${item.country}</span>`;
      on(li, "mousedown", (event) => event.preventDefault());
      on(li, "click", () => selectHeroOption(item.name));
      heroList.appendChild(li);
    });

    activeOption = -1;
    heroInput?.removeAttribute("aria-activedescendant");
  }

  function openHeroList() {
    if (!heroList) return;
    heroList.hidden = false;
    heroInput?.setAttribute("aria-expanded", "true");
  }

  function closeHeroList() {
    if (!heroList) return;
    heroList.hidden = true;
    heroInput?.setAttribute("aria-expanded", "false");
    heroInput?.removeAttribute("aria-activedescendant");
    activeOption = -1;
  }

  function selectHeroOption(value) {
    if (!heroInput) return;
    heroInput.value = value;
    closeHeroList();
    heroInput.focus();
  }

  if (heroInput && heroList) {
    renderHeroOptions();
    on(heroInput, "focus", () => {
      renderHeroOptions(heroInput.value);
      openHeroList();
    });
    on(heroInput, "input", () => {
      renderHeroOptions(heroInput.value);
      openHeroList();
    });
    on(heroInput, "keydown", (event) => {
      const options = qsa('[role="option"]', heroList);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (heroList.hidden) {
          renderHeroOptions(heroInput.value);
          openHeroList();
        }
        if (!options.length) return;
        activeOption =
          event.key === "ArrowDown"
            ? (activeOption + 1) % options.length
            : (activeOption - 1 + options.length) % options.length;
        options.forEach((option, index) => option.setAttribute("aria-selected", index === activeOption ? "true" : "false"));
        const active = options[activeOption];
        heroInput.setAttribute("aria-activedescendant", active.id);
        active.scrollIntoView({ block: "nearest" });
      } else if (event.key === "Enter" && !heroList.hidden && activeOption >= 0) {
        event.preventDefault();
        selectHeroOption(options[activeOption].dataset.value);
      } else if (event.key === "Escape") {
        closeHeroList();
      } else if (event.key === "Tab") {
        closeHeroList();
      }
    });
  }

  on(document, "click", (event) => {
    if (heroWrap && !heroWrap.contains(event.target)) closeHeroList();
  });

  on(heroForm, "submit", (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const destination = heroInput?.value.trim();
    if (destination) params.set("q", destination);
    const travellers = qs("#hero-travellers");
    if (travellers?.value && travellers.value !== "2") params.set("travellers", travellers.value);
    const month = qs("#hero-month");
    if (month?.value) params.set("month", month.value);
    window.location.href = `tours.html${params.toString() ? `?${params.toString()}` : ""}`;
  });

  qsa("[data-hero-chip]").forEach((chip) => {
    on(chip, "click", () => {
      if (!heroInput) return;
      heroInput.value = chip.dataset.heroChip || "";
      heroInput.focus();
      renderHeroOptions(heroInput.value);
      openHeroList();
    });
  });

  /* ---------------------------------------------------------
     Booking dialog
     --------------------------------------------------------- */
  const dialogHTML = `
  <dialog id="booking-dialog" class="booking-dialog" aria-labelledby="booking-heading">
    <div class="dialog-card relative w-full overflow-hidden rounded-[28px] bg-white shadow-2xl">
      <div class="dialog-scroll p-6 sm:p-8">
        <button type="button" data-dialog-close class="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-ink" aria-label="Close booking form">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>
        </button>

        <div>
          <p class="eyebrow">Start planning</p>
          <h2 id="booking-heading" class="mt-3 pr-10 text-2xl font-semibold sm:text-3xl">Request this tour</h2>
          <p class="mt-2 text-sm leading-relaxed text-slate-500">No payment now. WhatsApp opens with your order details so you can send them directly to our team.</p>
          <div class="mt-3 rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-slate-600">
            <p class="font-semibold text-ink">Your travel team: Nakibuule Esther, Founder &amp; Managing Director</p>
            <p class="mt-1">Call <a href="tel:+256774818301" class="font-semibold text-royal-700 underline underline-offset-2">+256 774 818 301</a> or email <a href="mailto:${BUSINESS_EMAIL}" class="font-semibold text-royal-700 underline underline-offset-2">${BUSINESS_EMAIL}</a>.</p>
          </div>

          <div class="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-royal-100 bg-royal-50/70 p-4">
            <div class="min-w-0">
              <p data-booking-tour class="truncate font-display text-sm font-semibold text-ink">Selected tour</p>
              <p data-booking-meta class="mt-0.5 text-xs text-slate-500">Tailor-made itinerary</p>
            </div>
            <p data-booking-price class="shrink-0 text-right font-display text-lg font-semibold text-royal-700">On request</p>
          </div>

          <form data-booking-form class="mt-6" novalidate>
            <input type="hidden" name="tour" data-booking-tour-input />
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="field-label" for="bk-name">Full name</label>
                <input class="field-input" id="bk-name" name="name" type="text" autocomplete="name" placeholder="Nakibuule Esther" required />
                <p class="field-error" data-error-for="name" hidden></p>
              </div>
              <div>
                <label class="field-label" for="bk-email">Email address</label>
                <input class="field-input" id="bk-email" name="email" type="email" autocomplete="email" placeholder="Your email address" required />
                <p class="field-error" data-error-for="email" hidden></p>
              </div>
              <div>
                <label class="field-label" for="bk-phone">Phone / WhatsApp</label>
                <input class="field-input" id="bk-phone" name="phone" type="tel" autocomplete="tel" placeholder="Your phone or WhatsApp number" required />
                <p class="field-error" data-error-for="phone" hidden></p>
              </div>
              <div>
                <label class="field-label" for="bk-date">Preferred start date</label>
                <input class="field-input" id="bk-date" name="date" type="date" required />
                <p class="field-error" data-error-for="date" hidden></p>
              </div>
              <div class="sm:col-span-2">
                <label class="field-label" for="bk-travellers">Travellers</label>
                <select class="field-input" id="bk-travellers" name="travellers" required>
                  <option value="">Select group size</option>
                  <option value="1">1 traveller</option>
                  <option value="2">2 travellers</option>
                  <option value="3">3 travellers</option>
                  <option value="4">4 travellers</option>
                  <option value="5-6">5–6 travellers</option>
                  <option value="7+">7+ travellers</option>
                </select>
                <p class="field-error" data-error-for="travellers" hidden></p>
              </div>
              <div class="sm:col-span-2">
                <label class="field-label" for="bk-notes">Anything we should know? <span class="font-normal normal-case tracking-normal text-slate-400">(optional)</span></label>
                <textarea class="field-input min-h-22.5 resize-y" id="bk-notes" name="notes" rows="3" placeholder="Dietary needs, celebrations, preferred pace…"></textarea>
              </div>
            </div>
            <label class="mt-4 flex items-start gap-3 text-xs leading-relaxed text-slate-500">
              <input type="checkbox" name="consent" class="mt-0.5 h-4 w-4 rounded border-slate-300 text-royal-600 focus:ring-royal-500" required />
              <span>I agree to be contacted about this enquiry and accept the <a href="contact.html#privacy" class="font-semibold text-royal-700 underline decoration-royal-200 underline-offset-2">privacy note</a>.</span>
            </label>
            <p class="field-error" data-error-for="consent" hidden></p>
            <button type="submit" class="btn-primary mt-5 w-full">
              Send new order on WhatsApp
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <p class="mt-3 text-center text-[11px] text-slate-400">Typical reply time: under 2 hours during office hours.</p>
          </form>
        </div>

      </div>
    </div>
  </dialog>`;

  document.body.insertAdjacentHTML("beforeend", dialogHTML);
  const bookingDialog = qs("#booking-dialog");
  const bookingForm = qs("[data-booking-form]", bookingDialog);
  const bookingDate = qs("#bk-date", bookingDialog);
  if (bookingDate) bookingDate.min = todayISO;

  function openBooking(button) {
    if (!bookingDialog) return;
    const tour = button?.dataset.tour || "Custom itinerary";
    const price = button?.dataset.price || "On request";
    const meta = button?.dataset.meta || "Tailor-made itinerary";

    setText(qs("[data-booking-tour]", bookingDialog), tour);
    setText(qs("[data-booking-meta]", bookingDialog), meta);
    setText(qs("[data-booking-price]", bookingDialog), price);
    setText(qs("#booking-heading", bookingDialog), price === "On request" ? "Plan a custom trip" : "Request this tour");

    bookingForm?.reset();
    // Set the hidden tour after reset — reset() would otherwise clear it.
    const hiddenTour = qs("[data-booking-tour-input]", bookingDialog);
    if (hiddenTour) hiddenTour.value = tour;
    qsa(".field-error", bookingDialog).forEach((el) => {
      el.hidden = true;
      el.textContent = "";
    });
    qsa("[aria-invalid]", bookingDialog).forEach((el) => el.removeAttribute("aria-invalid"));
    bookingDialog.showModal();
    document.body.classList.add("dialog-open");
    window.setTimeout(() => qs("#bk-name", bookingDialog)?.focus(), 120);
  }

  function closeBooking() {
    if (!bookingDialog?.open) return;
    bookingDialog.close();
  }

  qsa("[data-book]").forEach((button) => {
    on(button, "click", (event) => {
      event.preventDefault();
      openBooking(button);
    });
  });

  qsa("[data-dialog-close]", bookingDialog).forEach((btn) => on(btn, "click", closeBooking));
  on(bookingDialog, "click", (event) => {
    if (event.target === bookingDialog) closeBooking();
  });
  on(bookingDialog, "close", () => {
    document.body.classList.remove("dialog-open");
    window.setTimeout(() => {
      bookingForm?.reset();
      qsa(".field-error", bookingDialog).forEach((el) => {
        el.hidden = true;
        el.textContent = "";
      });
    }, 220);
  });

  /* ---------------------------------------------------------
     Form validation helpers
     --------------------------------------------------------- */
  const messages = {
    name: "Please enter your full name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number.",
    date: "Please choose your preferred start date.",
    travellers: "Please select your group size.",
    subject: "Please choose a subject.",
    message: "Please tell us a little about your trip (at least 10 characters).",
    consent: "Please accept the privacy note to continue.",
  };

  function validateField(field) {
    const form = field.form;
    if (!form) return true;
    const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
    let message = "";

    if (field.type === "checkbox") {
      if (field.required && !field.checked) message = messages[field.name] || "Please tick this box to continue.";
    } else {
      const value = field.value.trim();
      if (field.required && !value) {
        message = messages[field.name] || "This field is required.";
      } else if (value && field.type === "email" && !EMAIL_RE.test(value)) {
        message = messages.email;
      } else if (value && field.type === "tel" && !PHONE_RE.test(value)) {
        message = messages.phone;
      } else if (value && field.name === "date" && value < todayISO) {
        message = "Please choose today or a future date.";
      } else if (value && field.name === "message" && value.length < 10) {
        message = messages.message;
      }
    }

    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }
    return !message;
  }

  function validateForm(form) {
    const fields = qsa("input[required], select[required], textarea[required]", form);
    let firstInvalid = null;
    fields.forEach((field) => {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: true });
      firstInvalid.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      return false;
    }
    return true;
  }

  function bindFieldValidation(form) {
    qsa("input, select, textarea", form).forEach((field) => {
      on(field, "blur", () => {
        if (field.value || field.required || field.getAttribute("aria-invalid") === "true") validateField(field);
      });
      on(field, "input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
      on(field, "change", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });
  }

  if (bookingForm) bindFieldValidation(bookingForm);

  on(bookingForm, "submit", (event) => {
    event.preventDefault();
    if (!validateForm(bookingForm)) return;

    const data = new FormData(bookingForm);
    const tour = qs("[data-booking-tour-input]", bookingDialog)?.value || "Custom itinerary";
    const date = String(data.get("date") || "");
    const travellers = String(data.get("travellers") || "");
    const waMessage = `NEW ORDER REQUEST — Estnak Tours & Travel\n\nTour: ${tour}\nName: ${data.get("name")}\nPreferred date: ${date}\nTravellers: ${travellers}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone")}\nAdditional notes: ${data.get("notes") || "None"}\n\nPlease confirm availability and next steps.`;
    window.location.assign(whatsappOrderUrl(waMessage));
  });

  /* ---------------------------------------------------------
     Contact form
     --------------------------------------------------------- */
  const contactForm = qs("#contact-form");
  if (contactForm) {
    bindFieldValidation(contactForm);

    const messageField = qs("#contact-message", contactForm);
    const countEl = qs("#message-count");
    const subjectField = qs("#contact-subject", contactForm);
    const submitLabel = qs("[data-contact-submit-label]", contactForm);
    on(messageField, "input", () => setText(countEl, String(messageField.value.length)));
    on(subjectField, "change", () => {
      setText(
        submitLabel,
        subjectField.value === "Plan a new trip" ? "Continue to WhatsApp" : "Send message"
      );
    });

    on(contactForm, "submit", (event) => {
      event.preventDefault();
      if (!validateForm(contactForm)) return;

      const data = new FormData(contactForm);
      const name = String(data.get("name") || "").split(" ")[0] || "traveller";
      const summary = qs("#contact-success-summary");
      if (summary) {
        summary.textContent = `${data.get("subject")} — ${String(data.get("message") || "").slice(0, 110)}${String(data.get("message") || "").length > 110 ? "…" : ""}`;
      }

      const isNewTripOrder = data.get("subject") === "Plan a new trip";
      const waMessage = isNewTripOrder
        ? `NEW ORDER REQUEST — Estnak Tours & Travel\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone") || "—"}\nRequest: ${data.get("message")}`
        : `Hello Estnak Tours & Travel!\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone") || "—"}\nSubject: ${data.get("subject")}\n\n${data.get("message")}`;
      const waLink = qs("#contact-whatsapp", contactForm.closest("section") || document);
      if (waLink) waLink.href = whatsappOrderUrl(waMessage);

      if (isNewTripOrder) {
        window.location.assign(whatsappOrderUrl(waMessage));
        return;
      }

      const success = qs("#contact-success");
      contactForm.hidden = true;
      if (success) {
        success.hidden = false;
        const heading = qs("h3", success);
        if (heading) {
          heading.tabIndex = -1;
          window.setTimeout(() => heading.focus({ preventScroll: true }), 80);
        }
      }
      toast(`Thanks, ${name}. Your message is on its way.`);
    });

    on(qs("[data-contact-reset]"), "click", () => {
      contactForm.reset();
      setText(countEl, "0");
      qsa(".field-error", contactForm).forEach((el) => {
        el.hidden = true;
        el.textContent = "";
      });
      qsa("[aria-invalid]", contactForm).forEach((el) => el.removeAttribute("aria-invalid"));
      contactForm.hidden = false;
      const success = qs("#contact-success");
      if (success) success.hidden = true;
      qs("#contact-name")?.focus();
    });
  }

  /* ---------------------------------------------------------
     Newsletter forms
     --------------------------------------------------------- */
  qsa("[data-newsletter]").forEach((form) => {
    on(form, "submit", (event) => {
      event.preventDefault();
      const input = qs('input[type="email"]', form);
      const message = qs("[data-newsletter-msg]", form);
      if (!input || !EMAIL_RE.test(input.value.trim())) {
        if (message) {
          message.textContent = "Please enter a valid email address.";
          message.className = "mt-2 text-xs font-medium text-red-300";
        }
        input?.focus();
        return;
      }
      if (message) {
        message.textContent = "You're in! Look out for our next travel edit.";
        message.className = "mt-2 text-xs font-medium text-jade-300";
      }
      form.reset();
      toast("Subscribed. Travel inspiration is on its way.");
    });
  });

  /* ---------------------------------------------------------
     Tour filtering + sorting
     --------------------------------------------------------- */
  const tourGrid = qs("#tour-grid");
  if (tourGrid) {
    const cards = qsa("[data-tour-card]", tourGrid);
    const searchInput = qs("#tour-search");
    const categoryChips = qsa("[data-filter-category]");
    const destinationSelect = qs("#filter-destination");
    const durationSelect = qs("#filter-duration");
    const priceRange = qs("#filter-price");
    const priceValue = qs("#filter-price-value");
    const sortSelect = qs("#sort-tours");
    const countEl = qs("#tour-count");
    const emptyState = qs("#tour-empty");
    const clearBtns = qsa("[data-clear-filters]");
    const resultsWrap = qs("#tour-results");
    const filterToggle = qs("#filter-toggle");
    const filterPanel = qs("#filter-panel");

    const priceMin = Number(priceRange?.min || 500);
    const priceMax = Number(priceRange?.max || 3500);

    const initialParams = new URLSearchParams(window.location.search);
    const state = {
      q: initialParams.get("q") || "",
      category: initialParams.get("category") || "all",
      destination: initialParams.get("destination") || "all",
      duration: initialParams.get("duration") || "all",
      max: Number(initialParams.get("max")) || priceMax,
      sort: initialParams.get("sort") || "recommended",
    };

    if (searchInput) searchInput.value = state.q;
    if (destinationSelect) destinationSelect.value = state.destination;
    if (durationSelect) durationSelect.value = state.duration;
    if (sortSelect) sortSelect.value = state.sort;

    const paintPrice = () => {
      if (!priceRange) return;
      const pct = ((state.max - priceMin) / (priceMax - priceMin)) * 100;
      priceRange.value = String(state.max);
      priceRange.style.setProperty("--range-progress", `${Math.max(0, Math.min(100, pct))}%`);
      if (priceValue) setText(priceValue, state.max >= priceMax ? "Any price" : `Up to $${state.max.toLocaleString("en-US")}`);
    };

    const paintChips = () => {
      categoryChips.forEach((chip) => {
        const active = chip.dataset.filterCategory === state.category;
        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", active ? "true" : "false");
      });
    };

    const syncUrl = () => {
      const params = new URLSearchParams();
      if (state.q) params.set("q", state.q);
      if (state.category !== "all") params.set("category", state.category);
      if (state.destination !== "all") params.set("destination", state.destination);
      if (state.duration !== "all") params.set("duration", state.duration);
      if (state.max < priceMax) params.set("max", String(state.max));
      if (state.sort !== "recommended") params.set("sort", state.sort);
      const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      try {
        window.history.replaceState(null, "", next);
      } catch {
        /* file:// can block history updates */
      }
    };

    const applyFilters = () => {
      const term = state.q.trim().toLowerCase();
      let visible = 0;

      // Match on any meaningful token so hero searches such as
      // "Bwindi Impenetrable Forest" still find the Bwindi tour.
      const terms = term.split(/\s+/).filter((word) => word.length > 2);

      cards.forEach((card) => {
        const haystack = `${card.dataset.title || ""} ${card.dataset.country || ""} ${card.dataset.keywords || ""}`.toLowerCase();
        const days = Number(card.dataset.days || 0);
        const price = Number(card.dataset.price || 0);

        const matchesSearch =
          !term || (terms.length ? terms.some((word) => haystack.includes(word)) : haystack.includes(term));
        const matchesCategory = state.category === "all" || card.dataset.category === state.category;
        const matchesDestination = state.destination === "all" || card.dataset.country === state.destination;
        const matchesDuration =
          state.duration === "all" ||
          (state.duration === "short" && days <= 4) ||
          (state.duration === "mid" && days >= 5 && days <= 7) ||
          (state.duration === "long" && days >= 8);
        const matchesPrice = price <= state.max;

        const show = matchesSearch && matchesCategory && matchesDestination && matchesDuration && matchesPrice;
        card.classList.toggle("is-filtered", !show);
        if (show) visible += 1;
      });

      const sorted = [...cards].sort((a, b) => {
        const aPrice = Number(a.dataset.price || 0);
        const bPrice = Number(b.dataset.price || 0);
        const aRating = Number(a.dataset.rating || 0);
        const bRating = Number(b.dataset.rating || 0);
        const aOrder = Number(a.dataset.order || 0);
        const bOrder = Number(b.dataset.order || 0);
        if (state.sort === "price-asc") return aPrice - bPrice;
        if (state.sort === "price-desc") return bPrice - aPrice;
        if (state.sort === "rating") return bRating - aRating || bOrder - aOrder;
        return aOrder - bOrder;
      });
      sorted.forEach((card) => tourGrid.appendChild(card));

      if (countEl) setText(countEl, `${visible} ${visible === 1 ? "tour" : "tours"}`);
      if (emptyState) emptyState.hidden = visible !== 0;
      if (resultsWrap) resultsWrap.setAttribute("aria-busy", "false");

      paintPrice();
      paintChips();
      const isFiltered =
        Boolean(state.q) || state.category !== "all" || state.destination !== "all" || state.duration !== "all" || state.max < priceMax;
      clearBtns.forEach((btn) => {
        btn.disabled = !isFiltered;
      });
      syncUrl();
    };

    let searchTimer = null;
    on(searchInput, "input", () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        state.q = searchInput.value;
        applyFilters();
      }, 180);
    });

    categoryChips.forEach((chip) => {
      on(chip, "click", () => {
        state.category = chip.dataset.filterCategory || "all";
        applyFilters();
      });
    });

    on(destinationSelect, "change", () => {
      state.destination = destinationSelect.value;
      applyFilters();
    });
    on(durationSelect, "change", () => {
      state.duration = durationSelect.value;
      applyFilters();
    });
    on(sortSelect, "change", () => {
      state.sort = sortSelect.value;
      applyFilters();
    });
    on(priceRange, "input", () => {
      state.max = Number(priceRange.value);
      applyFilters();
    });

    const resetFilters = () => {
      state.q = "";
      state.category = "all";
      state.destination = "all";
      state.duration = "all";
      state.max = priceMax;
      state.sort = "recommended";
      if (searchInput) searchInput.value = "";
      if (destinationSelect) destinationSelect.value = "all";
      if (durationSelect) durationSelect.value = "all";
      if (sortSelect) sortSelect.value = "recommended";
      applyFilters();
    };

    clearBtns.forEach((btn) => on(btn, "click", resetFilters));

    // Mobile filter drawer
    on(filterToggle, "click", () => {
      const open = filterPanel?.classList.toggle("is-open");
      filterToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    on(document, "click", (event) => {
      if (!filterPanel || !filterToggle) return;
      if (!filterPanel.classList.contains("is-open")) return;
      if (filterPanel.contains(event.target) || filterToggle.contains(event.target)) return;
      filterPanel.classList.remove("is-open");
      filterToggle.setAttribute("aria-expanded", "false");
    });

    applyFilters();
  }

  /* ---------------------------------------------------------
     Destination region filters
     --------------------------------------------------------- */
  const destinationGrid = qs("#destination-grid");
  if (destinationGrid) {
    const regionChips = qsa("button[data-region]");
    const cards = qsa("[data-destination-card]", destinationGrid);
    const countEl = qs("#destination-count");

    const filterDestinations = (region) => {
      let visible = 0;
      cards.forEach((card) => {
        const show = region === "all" || card.dataset.region === region;
        card.classList.toggle("is-filtered", !show);
        if (show) visible += 1;
      });
      regionChips.forEach((chip) => {
        const active = chip.dataset.region === region;
        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", active ? "true" : "false");
      });
      if (countEl) setText(countEl, `${visible} ${visible === 1 ? "destination" : "destinations"}`);
    };

    regionChips.forEach((chip) => {
      on(chip, "click", () => filterDestinations(chip.dataset.region || "all"));
    });
    filterDestinations("all");
  }

  /* ---------------------------------------------------------
     Misc: year, back-to-top, smooth anchor offset
     --------------------------------------------------------- */
  qsa("[data-year]").forEach((el) => setText(el, String(new Date().getFullYear())));

  qsa("[data-back-to-top]").forEach((btn) => {
    on(btn, "click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  qsa('a[href^="#"]').forEach((link) => {
    on(link, "click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = qs(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      try {
        window.history.replaceState(null, "", id);
      } catch {
        /* ignore */
      }
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
})();
