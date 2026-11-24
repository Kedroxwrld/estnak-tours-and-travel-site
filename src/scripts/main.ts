import { createIcons } from "lucide";
import { iconLibrary } from "../data/icons";

const WHATSAPP_NUMBER = "256769532299";
const BUSINESS_EMAIL = "estnaktoursandtravel@gmail.com";
const CURRENCY_KEY = "estnak-currency";
const RATES = { USD: 1, UGX: 3700, EUR: 0.92, GBP: 0.79 } as const;

type Currency = keyof typeof RATES;
type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type ContactFieldName = "name" | "email" | "phone" | "service" | "dates" | "message" | "consent";
type ContactErrors = Partial<Record<ContactFieldName, string>>;

const isCurrency = (value: string | null): value is Currency =>
  value !== null && value in RATES;

const getFormControl = (form: HTMLFormElement, name: string): FormControl | null => {
  const field = form.elements.namedItem(name);
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLSelectElement ||
    field instanceof HTMLTextAreaElement
  ) {
    return field;
  }
  return null;
};

const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const readCurrency = (): Currency => {
  try {
    const value = localStorage.getItem(CURRENCY_KEY);
    return isCurrency(value) ? value : "USD";
  } catch {
    return "USD";
  }
};

const formatPrice = (value: number, currency: Currency) =>
  new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value * RATES[currency]);

const initIcons = () => createIcons({ icons: iconLibrary });

const initHeader = () => {
  const header = document.querySelector<HTMLElement>("#site-header");
  const updateHeader = () => header?.classList.toggle("is-stuck", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll<HTMLElement>("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll<HTMLButtonElement>("[data-back-to-top]").forEach((button) => {
    button.addEventListener("click", () => {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      window.scrollTo({ top: 0, behavior });
    });
  });

  document.querySelectorAll<HTMLDetailsElement>("[data-settings-dropdown]").forEach((dropdown) => {
    dropdown.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        dropdown.open = false;
        dropdown.querySelector("summary")?.focus();
      }
    });
  });

  document.addEventListener("click", (event) => {
    document.querySelectorAll<HTMLDetailsElement>("[data-settings-dropdown][open]").forEach((dropdown) => {
      if (!(event.target instanceof Node) || !dropdown.contains(event.target)) dropdown.open = false;
    });
  });
};

const initMobileMenu = () => {
  const menu = document.querySelector<HTMLElement>("#mobile-menu");
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const closeButton = document.querySelector<HTMLButtonElement>("[data-menu-close]");
  if (!menu || !toggle) return;

  let lastFocused: Element | null = null;

  const focusableItems = (): HTMLElement[] =>
    Array.from(
      menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((item) => item.getClientRects().length);

  const openMenu = () => {
    lastFocused = document.activeElement;
    menu.classList.add("is-open");
    menu.inert = false;
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    window.setTimeout(() => {
      if (menu.classList.contains("is-open")) closeButton?.focus();
    }, 0);
  };

  const closeMenu = () => {
    menu.classList.remove("is-open");
    menu.inert = true;
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };

  toggle.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  });
  closeButton?.addEventListener("click", closeMenu);
  menu.querySelector(".menu-overlay")?.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (!menu.classList.contains("is-open")) return;
    if (event.key === "Escape") closeMenu();
    if (event.key !== "Tab") return;
    const items = focusableItems();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1280 && menu.classList.contains("is-open")) closeMenu();
  });
};

const initCurrency = () => {
  const selects = document.querySelectorAll<HTMLSelectElement>("[data-currency]");
  const prices = document.querySelectorAll<HTMLElement>("[data-price]");
  let currency = readCurrency();

  const applyCurrency = (nextCurrency: string, persist = true) => {
    currency = isCurrency(nextCurrency) ? nextCurrency : "USD";
    selects.forEach((select) => {
      select.value = currency;
    });
    prices.forEach((price) => {
      const value = Number(price.dataset.price);
      if (Number.isFinite(value)) price.textContent = formatPrice(value, currency);
    });
    if (persist) {
      try {
        localStorage.setItem(CURRENCY_KEY, currency);
      } catch {
        return;
      }
    }
  };

  selects.forEach((select) => {
    select.addEventListener("change", () => applyCurrency(select.value));
  });
  applyCurrency(currency, false);
};

const initActiveNavigation = () => {
  if (new URLSearchParams(window.location.search).get("category") !== "global") return;
  document.querySelectorAll<HTMLAnchorElement>('[data-nav-link="tours"]').forEach((link) => {
    link.removeAttribute("aria-current");
  });
  document.querySelectorAll<HTMLAnchorElement>("[data-global-link]").forEach((link) => {
    link.setAttribute("aria-current", "page");
  });
};

const initReveal = () => {
  const items = document.querySelectorAll<HTMLElement>(".reveal");
  if (!items.length) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  document.documentElement.classList.add("js");

  const groups = new Map<HTMLElement, HTMLElement[]>();
  items.forEach((item) => {
    const parent = item.parentElement;
    if (!parent) return;
    const siblings = groups.get(parent) || [];
    siblings.push(item);
    groups.set(parent, siblings);
  });
  groups.forEach((siblings, parent) => {
    if (siblings.length < 2) return;
    const style = getComputedStyle(parent);
    const columns = style.display === "grid" && style.gridTemplateColumns !== "none"
      ? style.gridTemplateColumns.split(" ").length
      : Math.min(siblings.length, 3);
    siblings.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${(index % columns) * 65}ms`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  items.forEach((item) => observer.observe(item));
};

const initHeroSearch = () => {
  const form = document.querySelector<HTMLFormElement>("#hero-search");
  const input = document.querySelector<HTMLInputElement>("#hero-destination");
  const list = document.querySelector<HTMLUListElement>("#hero-destination-list");
  if (!form || !input || !list) return;

  const suggestions = [
    "Bwindi Impenetrable Forest",
    "Queen Elizabeth National Park",
    "Murchison Falls National Park",
    "Serengeti National Park",
    "Zanzibar",
    "Rwanda",
    "Kenya",
    "Kampala",
    "Dubai",
    "Paris",
    "Cape Town",
    "Bali",
    "Maldives",
    "Flight booking",
    "Visa assistance",
    "Vehicle rental",
  ];
  let activeIndex = -1;
  let visibleOptions: string[] = [];

  const closeList = () => {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
  };

  const renderList = () => {
    const query = input.value.trim().toLowerCase();
    visibleOptions = suggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(query))
      .slice(0, 7);
    list.replaceChildren();
    visibleOptions.forEach((suggestion, index) => {
      const option = document.createElement("li");
      option.id = `hero-option-${index}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      option.className = "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-royal-50";
      option.innerHTML = '<i data-lucide="map-pin" class="h-4 w-4 text-royal-500" aria-hidden="true"></i>';
      option.append(document.createTextNode(suggestion));
      option.addEventListener("mousedown", (event) => event.preventDefault());
      option.addEventListener("click", () => {
        input.value = suggestion;
        closeList();
        input.focus();
      });
      list.append(option);
    });
    list.hidden = visibleOptions.length === 0;
    input.setAttribute("aria-expanded", String(visibleOptions.length > 0));
    activeIndex = -1;
    initIcons();
  };

  const setActiveOption = (index: number) => {
    const options = Array.from(list.querySelectorAll<HTMLLIElement>('[role="option"]'));
    if (!options.length) return;
    activeIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      option.setAttribute("aria-selected", String(optionIndex === activeIndex));
    });
    const activeOption = options[activeIndex];
    if (!activeOption) return;
    input.setAttribute("aria-activedescendant", activeOption.id);
    activeOption.scrollIntoView({ block: "nearest" });
  };

  input.addEventListener("focus", renderList);
  input.addEventListener("input", renderList);
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (list.hidden) renderList();
      setActiveOption(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (list.hidden) renderList();
      setActiveOption(activeIndex - 1);
    } else if (event.key === "Enter" && activeIndex >= 0 && !list.hidden) {
      event.preventDefault();
      const selectedOption = visibleOptions[activeIndex];
      if (selectedOption === undefined) return;
      input.value = selectedOption;
      closeList();
    } else if (event.key === "Escape") {
      closeList();
    }
  });
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node) || !form.contains(event.target)) closeList();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const term = input.value.trim();
    const serviceTerm = term.toLowerCase();
    if (/flight|air ticket/.test(serviceTerm)) {
      window.location.href = "destinations.html#tour-starter";
      return;
    }
    if (/visa|document/.test(serviceTerm)) {
      window.location.href = "destinations.html#tour-starter";
      return;
    }
    if (/hotel|accommodation/.test(serviceTerm)) {
      window.location.href = "destinations.html#tour-starter";
      return;
    }
    if (/transport|vehicle/.test(serviceTerm)) {
      window.location.href = "destinations.html#transport";
      return;
    }
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    const month = form.querySelector<HTMLSelectElement>('[name="month"]')?.value;
    const travellers = form.querySelector<HTMLSelectElement>('[name="travellers"]')?.value;
    if (month) params.set("month", month);
    if (travellers) params.set("travellers", travellers);
    window.location.href = `tours.html${params.size ? `?${params}` : ""}`;
  });

  document.querySelectorAll<HTMLButtonElement>("[data-hero-chip]").forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.dataset.heroChip || "";
      form.requestSubmit();
    });
  });
};

const initCarousels = () => {
  document.querySelectorAll<HTMLElement>("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector<HTMLElement>("[data-carousel-track]");
    const previous = carousel.querySelector<HTMLButtonElement>("[data-carousel-prev]");
    const next = carousel.querySelector<HTMLButtonElement>("[data-carousel-next]");
    if (!track) return;

    const updateControls = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (previous) previous.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= maxScroll - 4;
    };
    const scroll = (direction: number) => {
      const card = track.querySelector<HTMLElement>("article");
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 20;
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      track.scrollBy({ left: direction * ((card?.clientWidth || track.clientWidth) + gap), behavior });
    };

    previous?.addEventListener("click", () => scroll(-1));
    next?.addEventListener("click", () => scroll(1));
    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    updateControls();
    window.setTimeout(updateControls, 0);
  });
};

const initTourFilters = () => {
  const grid = document.querySelector<HTMLElement>("#tour-grid");
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-tour-card]"));
  const search = document.querySelector<HTMLInputElement>("#tour-search");
  const destination = document.querySelector<HTMLSelectElement>("#filter-destination");
  const duration = document.querySelector<HTMLSelectElement>("#filter-duration");
  const price = document.querySelector<HTMLInputElement>("#filter-price");
  const priceValue = document.querySelector<HTMLElement>("#filter-price-value");
  const sort = document.querySelector<HTMLSelectElement>("#sort-tours");
  const count = document.querySelector<HTMLElement>("#tour-count");
  const empty = document.querySelector<HTMLElement>("#tour-empty");
  const clear = document.querySelector<HTMLButtonElement>("[data-clear-filters]");
  const filterToggle = document.querySelector<HTMLButtonElement>("#filter-toggle");
  const filterPanel = document.querySelector<HTMLElement>("#filter-panel");
  const categoryButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-filter-category]"));
  const params = new URLSearchParams(window.location.search);
  let category = params.get("category") || "all";
  let hasQueryCategory = params.has("category");

  const queryParam = params.get("q");
  const requestedDestination = params.get("destination");
  if (search && queryParam) search.value = queryParam;
  if (destination && requestedDestination) {
    const matchingOption = Array.from(destination.options).find(
      (option) => option.value.toLowerCase() === requestedDestination.toLowerCase()
    );
    if (matchingOption) destination.value = matchingOption.value;
  }

  filterToggle?.addEventListener("click", () => {
    const open = filterPanel?.classList.toggle("is-open");
    filterToggle.setAttribute("aria-expanded", String(Boolean(open)));
  });

  const updateRange = () => {
    if (!price || !priceValue) return;
    const max = Number(price.max);
    const value = Number(price.value);
    const progress = ((value - Number(price.min)) / (max - Number(price.min))) * 100;
    price.style.setProperty("--range-progress", `${progress}%`);
    priceValue.textContent = value >= max ? "Any price" : `Up to $${value.toLocaleString("en-US")}`;
  };

  const applyFilters = () => {
    const query = search?.value.trim().toLowerCase() || "";
    const selectedDestination = destination?.value || "all";
    const selectedDuration = duration?.value || "all";
    const priceMaximum = Number(price?.max || 3000);
    const maxPrice = Number(price?.value || priceMaximum);
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesCategory = category === "all" || card.dataset.category === category;
      const matchesQuery =
        !query ||
        `${card.dataset.title || ""} ${card.dataset.keywords || ""} ${card.dataset.destination || ""}`
          .toLowerCase()
          .includes(query);
      const matchesDestination =
        selectedDestination === "all" || card.dataset.destination === selectedDestination;
      const days = Number(card.dataset.days || 0);
      const matchesDuration =
        selectedDuration === "all" ||
        (selectedDuration === "short" && days <= 4) ||
        (selectedDuration === "mid" && days >= 5 && days <= 7) ||
        (selectedDuration === "long" && days >= 8);
      const matchesPrice = Number(card.dataset.price || 0) <= maxPrice;
      const visible = matchesCategory && matchesQuery && matchesDestination && matchesDuration && matchesPrice;
      card.classList.toggle("is-filtered", !visible);
      card.setAttribute("aria-hidden", String(!visible));
      if (visible) visibleCount += 1;
    });

    if (sort?.value === "price-asc") {
      cards.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    } else if (sort?.value === "price-desc") {
      cards.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    } else if (sort?.value === "duration") {
      cards.sort((a, b) => Number(a.dataset.days) - Number(b.dataset.days));
    } else {
      cards.sort((a, b) => Number(a.dataset.order || 0) - Number(b.dataset.order || 0));
    }
    cards.forEach((card) => grid.append(card));
    if (count) count.textContent = `${visibleCount} ${visibleCount === 1 ? "tour" : "tours"}`;
    if (empty) empty.hidden = visibleCount !== 0;
    if (clear) {
      clear.disabled = category === "all" && !query && selectedDestination === "all" && selectedDuration === "all" && maxPrice >= priceMaximum;
    }
    categoryButtons.forEach((button) => {
      const active = button.dataset.filterCategory === category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    updateRange();
  };

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.filterCategory || "all";
      hasQueryCategory = false;
      applyFilters();
    });
  });
  [search, destination, duration, price, sort].forEach((control) => {
    control?.addEventListener(control === search ? "input" : "change", applyFilters);
  });

  clear?.addEventListener("click", () => {
    category = "all";
    hasQueryCategory = false;
    if (search) search.value = "";
    if (destination) destination.value = "all";
    if (duration) duration.value = "all";
    if (price) price.value = price.max;
    if (sort) sort.value = "recommended";
    applyFilters();
  });

  if (hasQueryCategory && !categoryButtons.some((button) => button.dataset.filterCategory === category)) {
    category = "all";
  }
  applyFilters();
};

const initDestinationFilters = () => {
  const grid = document.querySelector<HTMLElement>("#destination-grid");
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-destination-card]"));
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button[data-region]"));
  const count = document.querySelector<HTMLElement>("#destination-count");
  const total = cards.length;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const region = button.dataset.region || "all";
      let visible = 0;
      cards.forEach((card) => {
        const matches = region === "all" || card.dataset.region === region;
        card.classList.toggle("is-filtered", !matches);
        card.setAttribute("aria-hidden", String(!matches));
        if (matches) visible += 1;
      });
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      if (count) count.textContent = `${visible} of ${total} destinations`;
    });
  });
};

const initContactForm = () => {
  const form = document.querySelector<HTMLFormElement>("#contact-form");
  if (!form) return;
  const status = document.querySelector<HTMLElement>("#contact-status");
  const message = getFormControl(form, "message");
  const count = document.querySelector<HTMLElement>("#message-count");
  const fields: ContactFieldName[] = ["name", "email", "phone", "service", "dates", "message", "consent"];

  const setError = (name: ContactFieldName, error: string) => {
    const field = getFormControl(form, name);
    const errorNode = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (errorNode) {
      errorNode.textContent = error;
      errorNode.hidden = !error;
    }
    field?.setAttribute("aria-invalid", String(Boolean(error)));
  };

  const validate = (): ContactErrors => {
    const data = new FormData(form);
    const errors: ContactErrors = {};
    if (String(data.get("name") || "").trim().length < 2) errors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") || "").trim())) {
      errors.email = "Please enter a valid email address.";
    }
    const phone = String(data.get("phone") || "").trim();
    if (phone && phone.replace(/\D/g, "").length < 7) errors.phone = "Please enter a valid phone or WhatsApp number.";
    if (!data.get("service")) errors.service = "Please choose the service you need.";
    if (String(data.get("message") || "").trim().length < 10) errors.message = "Please add a little more detail about your trip.";
    if (!data.get("consent")) errors.consent = "Please confirm that we may contact you about this enquiry.";
    fields.forEach((name) => setError(name, errors[name] || ""));
    return errors;
  };

  const updateCount = () => {
    if (count) count.textContent = String(message?.value.length || 0);
  };
  message?.addEventListener("input", updateCount);
  updateCount();

  fields.forEach((name) => {
    const field = getFormControl(form, name);
    if (!field) return;
    field.addEventListener(field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input", () => {
      if (field.getAttribute("aria-invalid") === "true") validate();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errors = validate();
    const firstInvalid = fields.find((name) => errors[name]);
    if (firstInvalid) {
      getFormControl(form, firstInvalid)?.focus();
      if (status) status.textContent = "Please check the highlighted fields before continuing.";
      return;
    }
    const data = new FormData(form);
    const travelDates = String(data.get("dates") || "").trim() || "Flexible / not sure yet";
    const phone = String(data.get("phone") || "").trim() || "Not provided";
    const enquiry = [
      "Hello Estnak Tours and Travel, I'd like help planning a trip.",
      "",
      `Name: ${String(data.get("name")).trim()}`,
      `Email: ${String(data.get("email")).trim()}`,
      `Phone / WhatsApp: ${phone}`,
      `Service needed: ${data.get("service")}`,
      `Travel dates: ${travelDates}`,
      "",
      `Message: ${String(data.get("message")).trim()}`,
    ].join("\n");
    const url = whatsappUrl(enquiry);
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    else window.location.href = url;
    if (status) {
      status.textContent = "Your enquiry is ready in WhatsApp. Review it and tap Send.";
    }
  });
};

const initNewsletter = () => {
  document.querySelectorAll<HTMLFormElement>("[data-newsletter]").forEach((form) => {
    const input = form.querySelector<HTMLInputElement>('input[type="email"]');
    const status = form.querySelector<HTMLElement>("[data-newsletter-msg]");
    const defaultMessage = status?.textContent || "";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = input?.value.trim() || "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        input?.setAttribute("aria-invalid", "true");
        if (status) status.textContent = "Please enter a valid email address.";
        input?.focus();
        return;
      }
      input?.removeAttribute("aria-invalid");
      const subject = encodeURIComponent("Newsletter subscription request");
      const body = encodeURIComponent(`Hello Estnak Tours and Travel,\n\nPlease add ${email} to your travel newsletter list.`);
      if (status) status.textContent = "Your email app will open a subscription request. Nothing is sent yet.";
      window.location.href = `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;
      window.setTimeout(() => {
        if (status) status.textContent = defaultMessage;
      }, 8000);
    });
  });
};

const initWhatsAppLinks = () => {
  document.querySelectorAll<HTMLAnchorElement>("[data-whatsapp]").forEach((link) => {
    const message = link.dataset.whatsapp || "Hello Estnak Tours and Travel, I'd like help planning a trip.";
    link.href = whatsappUrl(message);
  });
};

initIcons();
initHeader();
initMobileMenu();
initCurrency();
initActiveNavigation();
initReveal();
initHeroSearch();
initCarousels();
initTourFilters();
initDestinationFilters();
initContactForm();
initNewsletter();
initWhatsAppLinks();
