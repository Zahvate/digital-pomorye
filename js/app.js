/* ==========================================================================
   ЦИФРОВОЕ ПОМОРЬЕ — Интерактивная логика v2 (js/app.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initRouteCardsFilter();
  initSmartQuiz();
  initDayPlannerV2();
  initCraftsFilter();
});

/* 1. Мобильное меню */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

/* 2. Фильтрация карточек маршрутов */
function initRouteCardsFilter() {
  const filterBtns = document.querySelectorAll("[data-route-filter]");
  const cards = document.querySelectorAll("[data-route-category]");
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const val = btn.getAttribute("data-route-filter");
      cards.forEach((c) => {
        c.style.display = val === "all" || c.getAttribute("data-route-category") === val ? "flex" : "none";
      });
    });
  });
}

/* 3. База мест с реальными координатами, стоимостью и карточками Яндекс Карт */
const PLACES = {
  // --- Архангельск и Приморский округ ---
  korely: {
    name: "Музей-заповедник «Малые Корелы»",
    note: "Осмотр деревянных храмов и крестьянских усадеб (2,5 часа)",
    cost: 400,
    lat: 64.4556,
    lon: 40.9419,
    url: "https://yandex.ru/maps/org/arkhangelskiy_gosudarstvenny_muzey_zapovednik_derevyannogo_zodchestva_i_narodnogo_iskusstva_malyye_korely/1032274192/"
  },
  gostiny: {
    name: "Архангельские Гостиные дворы (Краеведческий музей)",
    note: "Экспозиция истории освоения Русского Севера, наб. Северной Двины, 85/86",
    cost: 350,
    lat: 64.5348,
    lon: 40.5159,
    url: "https://yandex.ru/maps/org/arkhangelskiy_krayevedcheskiy_muzey/1043289936/"
  },
  maritime: {
    name: "Северный морской музей",
    note: "История поморского мореходства и Арктики, наб. Северной Двины, 80",
    cost: 300,
    lat: 64.5332,
    lon: 40.5184,
    url: "https://yandex.ru/maps/org/severny_morskoy_muzey/1190329563/"
  },
  borisov_museum: {
    name: "Музей художественного освоения Арктики им. А.А. Борисова",
    note: "Арктические пейзажи первого художника полярных широт, ул. Поморская, 3",
    cost: 250,
    lat: 64.5382,
    lon: 40.5162,
    url: "https://yandex.ru/maps/?ll=40.5162%2C64.5382&z=17&text=Музей%20художественного%20освоения%20Арктики%20им.%20А.А.%20Борисова"
  },
  chumbarovka: {
    name: "Проспект Чумбарова-Лучинского и сувенирные лавки",
    note: "Пешеходная заповедная улица, Музей архангельского пряника, лавка «Беломорские узоры»",
    cost: 500,
    lat: 64.5396,
    lon: 40.5218,
    url: "https://yandex.ru/maps/?ll=40.5218%2C64.5396&z=16&text=Проспект%20Чумбарова-Лучинского%20Архангельск"
  },
  // Питание Архангельск / Малые Корелы
  food_korely_rest: {
    name: "Обед: ресторан «Малые Карелы» (рядом с музеем)",
    note: "Уха по-поморски, калитки, северные ягоды",
    cost: 950,
    lat: 64.4581,
    lon: 40.9452,
    url: "https://yandex.ru/maps/?ll=40.9452%2C64.4581&z=16&text=Ресторан%20Малые%20Карелы"
  },
  food_korely_cafe: {
    name: "Обед (бюджетно): чайный дом / кафе у входа в «Малые Корелы»",
    note: "Выпечка, горячий суп, чай на северных травах",
    cost: 450,
    lat: 64.4551,
    lon: 40.9408,
    url: "https://yandex.ru/maps/?ll=40.9408%2C64.4551&z=16&text=Чайный%20дом%20Малые%20Корелы"
  },
  food_arkh_pomorsky: {
    name: "Ужин: ресторан поморской кухни «Поморский»",
    note: "Царская уха, треска по-поморски, строганина (ул. Поморская, 5)",
    cost: 1400,
    lat: 64.5385,
    lon: 40.5171,
    url: "https://yandex.ru/maps/?ll=40.5171%2C64.5385&z=17&text=Ресторан%20Поморский%20Архангельск"
  },
  food_arkh_cafe: {
    name: "Обед / ужин (средний чек): кафе «Грядка» или «Блинная» в центре",
    note: "Домашняя кухня, северная выпечка, быстрое обслуживание",
    cost: 600,
    lat: 64.5405,
    lon: 40.5225,
    url: "https://yandex.ru/maps/?ll=40.5225%2C64.5405&z=16&text=Кафе%20Грядка%20Архангельск"
  },
  food_arkh_canteen: {
    name: "Обед / ужин (бюджетно): столовая «Съем Слона» в центре Архангельска",
    note: "Полноценный горячий обед по доступной цене",
    cost: 350,
    lat: 64.5412,
    lon: 40.5240,
    url: "https://yandex.ru/maps/?ll=40.5240%2C64.5412&z=16&text=Столовая%20Съем%20Слона%20Архангельск"
  },

  // --- Каргополь и Ошевенск ---
  kargopol_sobor: {
    name: "Соборная площадь и Христорождественский собор (г. Каргополь)",
    note: "Архитектурный ансамбль XVI века и смотровая площадка колокольни",
    cost: 300,
    lat: 61.5034,
    lon: 38.9472,
    url: "https://yandex.ru/maps/org/kargopolskiy_muzey_dom_blokhina/1194447842/"
  },
  kargopol_bereginya: {
    name: "Центр народных ремёсел «Берегиня» (г. Каргополь)",
    note: "Экспозиция и мастерская каргопольской глиняной игрушки",
    cost: 350,
    lat: 61.5018,
    lon: 38.9445,
    url: "https://yandex.ru/maps/?ll=38.9445%2C61.5018&z=16&text=Центр%20народных%20ремёсел%20Берегиня%20Каргополь"
  },
  oshevensk: {
    name: "Старинное село Ошевенское (45 км от Каргополя)",
    note: "Александро-Ошевенский монастырь, Георгиевская часовня, обетные кресты",
    cost: 200,
    lat: 61.8569,
    lon: 38.7905,
    url: "https://yandex.ru/maps/?ll=38.7905%2C61.8569&z=14&text=Село%20Ошевенское%20Каргопольский%20район"
  },
  food_kargopol_rest: {
    name: "Обед / ужин в Каргополе: ресторан гостиницы «Каргополь»",
    note: "Блюда каргопольской кухни, пироги с рыбой и грибами",
    cost: 850,
    lat: 61.5042,
    lon: 38.9460,
    url: "https://yandex.ru/maps/?ll=38.9460%2C61.5042&z=16&text=Гостиница%20Каргополь%20ресторан"
  },
  food_kargopol_cafe: {
    name: "Обед / ужин в Каргополе (бюджетно): кафе «У истока» / столовая",
    note: "Горячие первые блюда и местная выпечка",
    cost: 420,
    lat: 61.5029,
    lon: 38.9451,
    url: "https://yandex.ru/maps/?ll=38.9451%2C61.5029&z=16&text=Кафе%20У%20истока%20Каргополь"
  },

  // --- Кенозерский национальный парк (д. Вершинино) ---
  kenozero_visitor: {
    name: "Визит-центр Кенозерского парка и Никольская часовня (д. Вершинино)",
    note: "Подъём на холм к символу Кенозерья, обзорная панорама озёр",
    cost: 400,
    lat: 62.0815,
    lon: 38.2044,
    url: "https://yandex.ru/maps/org/natsionalny_park_kenozerskiy/183052217174/"
  },
  kenozero_museum: {
    name: "Музей «В начале было Слово» и «Рухлядный амбар»",
    note: "Экспозиция о крестьянской культуре, ремёслах и «небесах» храмов",
    cost: 350,
    lat: 62.0822,
    lon: 38.2058,
    url: "https://yandex.ru/maps/?ll=38.2058%2C62.0822&z=16&text=Музей%20В%20начале%20было%20Слово%20Вершинино"
  },
  kenozero_trail: {
    name: "Экологическая тропа «Трансэкотропа» и водяная мельница",
    note: "Пешая прогулка по заповедному лесу и действующей мельнице в д. Зехнова",
    cost: 300,
    lat: 62.0680,
    lon: 38.1890,
    url: "https://yandex.ru/maps/?ll=38.1890%2C62.0680&z=14&text=Водяная%20мельница%20Зехнова%20Кенозерский%20парк"
  },
  food_kenozero_pocha: {
    name: "Обед в Кенозерье: трактир «Поча» / гостевой дом в Вершинино",
    note: "Традиционная кенозерская уха, ряпушка, пироги",
    cost: 750,
    lat: 62.0810,
    lon: 38.2035,
    url: "https://yandex.ru/maps/?ll=38.2035%2C62.0810&z=16&text=Трактир%20Поча%20Вершинино"
  },
  food_kenozero_tea: {
    name: "Чаепитие и обед (бюджетно): чайная в визит-центре Вершинино",
    note: "Калитки, морс из брусники, травяной чай",
    cost: 400,
    lat: 62.0816,
    lon: 38.2046,
    url: "https://yandex.ru/maps/?ll=38.2046%2C62.0816&z=16&text=Визит-центр%20Кенозерского%20парка%20Вершинино"
  },

  // --- Кимжа и Мезень ---
  kimzha_church: {
    name: "Одигитриевская церковь и мельницы-столбовки (д. Кимжа)",
    note: "Самые северные ветряные мельницы в мире и шатровый храм 1709 года",
    cost: 300,
    lat: 65.5714,
    lon: 44.6147,
    url: "https://yandex.ru/maps/geo/derevnya_kimzha/53125670/"
  },
  kimzha_politov: {
    name: "Музей крестьянского быта «Политов дом» (д. Кимжа)",
    note: "Экскурсия по старинному мезенскому дому-двору",
    cost: 250,
    lat: 65.5720,
    lon: 44.6155,
    url: "https://yandex.ru/maps/?ll=44.6155%2C65.5720&z=16&text=Музей%20Политов%20дом%20Кимжа"
  },
  food_kimzha: {
    name: "Обед в Кимже: гостевой дом «У Елены» (по предварительной договорённости)",
    note: "Домашняя мезенская кухня: рыбник, шаньги, чай",
    cost: 650,
    lat: 65.5718,
    lon: 44.6150,
    url: "https://yandex.ru/maps/?ll=44.6150%2C65.5718&z=16&text=Гостевой%20дом%20У%20Елены%20Кимжа"
  },
  mezen_museum: {
    name: "Мезенский историко-краеведческий музей (г. Мезень, 40 км от Кимжи)",
    note: "История поморских промыслов и мезенской росписи",
    cost: 200,
    lat: 65.8475,
    lon: 44.2412,
    url: "https://yandex.ru/maps/?ll=44.2412%2C65.8475&z=16&text=Мезенский%20историко-краеведческий%20музей"
  },

  // --- Холмогоры и с. Ломоносово ---
  lomonosovo_museum: {
    name: "Историко-мемориальный музей М.В. Ломоносова (с. Ломоносово)",
    note: "Родина великого учёного, экспозиция о жизни и научных открытиях",
    cost: 300,
    lat: 64.2345,
    lon: 41.7312,
    url: "https://yandex.ru/maps/org/istoriko_memorialny_muzey_m_v_lomonosova/1071767868/"
  },
  lomonosovo_bone: {
    name: "Косторезная мастерская в с. Ломоносово",
    note: "Знакомство с холмогорской резьбой по кости и сувенирная лавка",
    cost: 250,
    lat: 64.2352,
    lon: 41.7325,
    url: "https://yandex.ru/maps/?ll=41.7325%2C64.2352&z=16&text=Холмогорская%20резьба%20по%20кости%20Ломоносово"
  },
  kholmogory_sobor: {
    name: "Спасо-Преображенский собор и краеведческий музей (с. Холмогоры)",
    note: "Исторический центр Двинской земли XVII века",
    cost: 200,
    lat: 64.2225,
    lon: 41.6540,
    url: "https://yandex.ru/maps/?ll=41.6540%2C64.2225&z=16&text=Спасо-Преображенский%20собор%20Холмогоры"
  },
  food_kholmogory: {
    name: "Обед в с. Холмогоры: местное кафе в центре села",
    note: "Домашний обед перед возвращением в Архангельск",
    cost: 480,
    lat: 64.2238,
    lon: 41.6562,
    url: "https://yandex.ru/maps/?ll=41.6562%2C64.2238&z=15&text=Холмогоры%20кафе"
  }
};

/* 4. Географически согласованные маршруты полного дня с альтернативами для каждого слота */
const ITINERARIES = {
  arkh_korely: {
    title: "Деревянное зодчество и набережная Двины (Архангельск + Малые Корелы)",
    subtitle: "Утро за городом в музее-заповеднике, возвращение в Архангельск днём и вечерняя прогулка по набережной.",
    steps: [
      {
        time: "10:00 – 12:30",
        transit: "Выезд из центра Архангельска в 09:20 (35 мин в пути)",
        selected: "korely",
        alternatives: ["korely"]
      },
      {
        time: "12:40 – 13:40",
        transit: "5 минут пешком от центрального входа музея",
        selected: "food_korely_rest",
        alternatives: ["food_korely_rest", "food_korely_cafe"]
      },
      {
        time: "14:30 – 16:00",
        transit: "Возвращение в центр Архангельска (~40 мин)",
        selected: "maritime",
        alternatives: ["maritime", "gostiny", "borisov_museum"]
      },
      {
        time: "16:15 – 18:00",
        transit: "10 минут пешком по набережной до пр. Чумбарова-Лучинского",
        selected: "chumbarovka",
        alternatives: ["chumbarovka", "borisov_museum"]
      },
      {
        time: "18:15 – 19:45",
        transit: "5 минут пешком в центре города",
        selected: "food_arkh_pomorsky",
        alternatives: ["food_arkh_pomorsky", "food_arkh_cafe", "food_arkh_canteen"]
      }
    ]
  },

  arkh_city: {
    title: "Морской и купеческий Архангельск (пеший маршрут)",
    subtitle: "Насыщенный день в историческом центре города без выезда за город.",
    steps: [
      {
        time: "10:00 – 11:45",
        transit: "Старт на набережной Северной Двины",
        selected: "gostiny",
        alternatives: ["gostiny", "maritime"]
      },
      {
        time: "12:00 – 13:15",
        transit: "5 минут пешком вдоль набережной",
        selected: "maritime",
        alternatives: ["maritime", "borisov_museum"]
      },
      {
        time: "13:30 – 14:30",
        transit: "7 минут пешком в сторону ул. Поморской",
        selected: "food_arkh_cafe",
        alternatives: ["food_arkh_cafe", "food_arkh_canteen", "food_arkh_pomorsky"]
      },
      {
        time: "14:45 – 16:30",
        transit: "3 минуты пешком до Музея освоения Арктики",
        selected: "borisov_museum",
        alternatives: ["borisov_museum", "gostiny"]
      },
      {
        time: "16:45 – 18:30",
        transit: "5 минут пешком до пешеходного проспекта и сувениров",
        selected: "chumbarovka",
        alternatives: ["chumbarovka"]
      },
      {
        time: "18:45 – 20:00",
        transit: "В шаговой доступности в центре",
        selected: "food_arkh_pomorsky",
        alternatives: ["food_arkh_pomorsky", "food_arkh_cafe", "food_arkh_canteen"]
      }
    ]
  },

  kargopol_day: {
    title: "Белокаменный Каргополь и село Ошевенск",
    subtitle: "Весь день проходит в Каргопольском округе — обед и ужин в самом Каргополе, днём выезд в Ошевенск.",
    steps: [
      {
        time: "10:00 – 12:00",
        transit: "Старт на Соборной площади г. Каргополя",
        selected: "kargopol_sobor",
        alternatives: ["kargopol_sobor", "kargopol_bereginya"]
      },
      {
        time: "12:15 – 13:15",
        transit: "5 минут пешком в центре Каргополя",
        selected: "food_kargopol_rest",
        alternatives: ["food_kargopol_rest", "food_kargopol_cafe"]
      },
      {
        time: "13:30 – 15:00",
        transit: "5 минут пешком до центра ремёсел",
        selected: "kargopol_bereginya",
        alternatives: ["kargopol_bereginya", "kargopol_sobor"]
      },
      {
        time: "15:45 – 18:00",
        transit: "Переезд на авто/такси в с. Ошевенское (~45 мин)",
        selected: "oshevensk",
        alternatives: ["oshevensk"]
      },
      {
        time: "18:50 – 20:00",
        transit: "Возвращение в Каргополь (~45 мин)",
        selected: "food_kargopol_cafe",
        alternatives: ["food_kargopol_cafe", "food_kargopol_rest"]
      }
    ]
  },

  kenozero_day: {
    title: "Заповедное Кенозерье (д. Вершинино и окрестности)",
    subtitle: "Пеший и экологический день по культурному ландшафту Кенозерского национального парка.",
    steps: [
      {
        time: "10:00 – 11:45",
        transit: "Старт у визит-центра в д. Вершинино",
        selected: "kenozero_visitor",
        alternatives: ["kenozero_visitor", "kenozero_museum"]
      },
      {
        time: "12:00 – 13:15",
        transit: "5 минут пешком по деревне Вершинино",
        selected: "kenozero_museum",
        alternatives: ["kenozero_museum", "kenozero_visitor"]
      },
      {
        time: "13:30 – 14:30",
        transit: "Обед в д. Вершинино",
        selected: "food_kenozero_pocha",
        alternatives: ["food_kenozero_pocha", "food_kenozero_tea"]
      },
      {
        time: "15:00 – 18:00",
        transit: "Выход на экологическую тропу и к водяной мельнице",
        selected: "kenozero_trail",
        alternatives: ["kenozero_trail"]
      }
    ]
  },

  kimzha_day: {
    title: "Мезенский край: историческая деревня Кимжа и Мезень",
    subtitle: "Путешествие в одну из самых красивых деревень России с продолжением в г. Мезень.",
    steps: [
      {
        time: "10:00 – 12:00",
        transit: "Осмотр ансамбля Одигитриевской церкви и мельниц в Кимже",
        selected: "kimzha_church",
        alternatives: ["kimzha_church", "kimzha_politov"]
      },
      {
        time: "12:15 – 13:30",
        transit: "5 минут пешком по деревне",
        selected: "kimzha_politov",
        alternatives: ["kimzha_politov", "kimzha_church"]
      },
      {
        time: "13:45 – 14:45",
        transit: "Обед в гостевом доме в Кимже",
        selected: "food_kimzha",
        alternatives: ["food_kimzha"]
      },
      {
        time: "15:45 – 17:30",
        transit: "Переезд в г. Мезень (40 км, ~50 мин в пути)",
        selected: "mezen_museum",
        alternatives: ["mezen_museum"]
      }
    ]
  },

  lomonosovo_day: {
    title: "Холмогоры и село Ломоносово (Куростров)",
    subtitle: "Поездка на родину М.В. Ломоносова (75 км от Архангельска).",
    steps: [
      {
        time: "10:30 – 12:15",
        transit: "Дорога из Архангельска + переправа на Куростров (~1,5 ч)",
        selected: "lomonosovo_museum",
        alternatives: ["lomonosovo_museum", "lomonosovo_bone"]
      },
      {
        time: "12:30 – 13:30",
        transit: "5 минут пешком по с. Ломоносово",
        selected: "lomonosovo_bone",
        alternatives: ["lomonosovo_bone", "lomonosovo_museum"]
      },
      {
        time: "14:15 – 15:15",
        transit: "Переправа в с. Холмогоры (~30 мин)",
        selected: "food_kholmogory",
        alternatives: ["food_kholmogory"]
      },
      {
        time: "15:30 – 17:00",
        transit: "Осмотр исторического центра Холмогор перед выездом обратно",
        selected: "kholmogory_sobor",
        alternatives: ["kholmogory_sobor"]
      }
    ]
  }
};

let activeRouteKey = "arkh_korely";

function initDayPlannerV2() {
  const timelineEl = document.getElementById("dayTimeline");
  if (!timelineEl) return;

  // Проверяем URL-параметр ?route=...
  const params = new URLSearchParams(window.location.search);
  const routeParam = params.get("route");
  if (routeParam && ITINERARIES[routeParam]) {
    activeRouteKey = routeParam;
  }

  renderItinerary(activeRouteKey);

  // Переключение вкладок маршрутов
  document.querySelectorAll("[data-route-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rid = btn.getAttribute("data-route-id");
      if (ITINERARIES[rid]) {
        activeRouteKey = rid;
        renderItinerary(rid);
      }
    });
  });

  // Кнопки "Открыть в планировщике" на карточках сверху
  document.querySelectorAll("[data-load-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rid = btn.getAttribute("data-load-route");
      if (ITINERARIES[rid]) {
        activeRouteKey = rid;
        renderItinerary(rid);
        document.getElementById("plannerSection")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function renderItinerary(routeKey) {
  const route = ITINERARIES[routeKey];
  const timelineEl = document.getElementById("dayTimeline");
  const headingEl = document.getElementById("activeRouteHeading");
  const subEl = document.getElementById("activeRouteSub");
  const totalCostEl = document.getElementById("plannerTotalCost");
  const countEl = document.getElementById("plannerStopsCount");
  const buildRouteLink = document.getElementById("yandexBuildRouteLink");
  const mapDirectLink = document.getElementById("yandexDirectLink");
  const mapFrame = document.getElementById("yandexMapFrame");
  const mapLabel = document.getElementById("mapRouteLabel");

  if (!route || !timelineEl) return;

  // Подсветка активной вкладки
  document.querySelectorAll("[data-route-id]").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-route-id") === routeKey);
  });

  if (headingEl) headingEl.textContent = `Маршрут: ${route.title}`;
  if (subEl) subEl.textContent = route.subtitle;
  if (mapLabel) mapLabel.textContent = route.title;

  let totalCost = 0;
  const coordsYandexPt = [];
  const coordsRtext = [];
  let sumLat = 0;
  let sumLon = 0;

  timelineEl.innerHTML = route.steps
    .map((step, idx) => {
      const place = PLACES[step.selected];
      totalCost += place.cost;
      sumLat += place.lat;
      sumLon += place.lon;

      // Для виджета Яндекс Карт pt=lon,lat,pm2rdm1 (с номером точки!)
      coordsYandexPt.push(`${place.lon},${place.lat},pm2rdm${idx + 1}`);
      coordsRtext.push(`${place.lat},${place.lon}`);

      const altHtml =
        step.alternatives && step.alternatives.length > 1
          ? `<div class="alt-select-row">
              <span style="color:var(--text-muted);">Заменить на вариант поблизости:</span>
              <select aria-label="Выбор альтернативы" onchange="changeStepAlternative('${routeKey}', ${idx}, this.value)">
                ${step.alternatives
                  .map(
                    (altId) =>
                      `<option value="${altId}" ${altId === step.selected ? "selected" : ""}>${PLACES[altId].name} (~${PLACES[altId].cost} ₽)</option>`
                  )
                  .join("")}
              </select>
            </div>`
          : "";

      return `
        <div class="timeline-item">
          <div class="timeline-top">
            <span class="timeline-time">${idx + 1}. ${step.time}</span>
            <span class="timeline-travel">${step.transit}</span>
          </div>
          <a href="${place.url}" target="_blank" rel="noopener" class="timeline-title-link" title="Перейти на официальный ресурс объекта">
            ${place.name} ↗
          </a>
          <div class="timeline-note">${place.note} · ~${place.cost} ₽</div>
          ${altHtml}
        </div>
      `;
    })
    .join("");

  if (countEl) countEl.textContent = route.steps.length;
  if (totalCostEl) totalCostEl.textContent = `${totalCost.toLocaleString("ru-RU")} ₽`;

  // Обновляем карту сразу со ВСЕМИ пронумерованными точками маршрута (pm2rdm1~pm2rdm2~...)
  const avgLat = (sumLat / route.steps.length).toFixed(4);
  const avgLon = (sumLon / route.steps.length).toFixed(4);
  const zoom = routeKey === "arkh_city" ? 14 : routeKey === "arkh_korely" ? 10 : 9;
  const ptParam = coordsYandexPt.join("~");

  if (mapFrame) {
    mapFrame.src = `https://yandex.ru/map-widget/v1/?ll=${avgLon}%2C${avgLat}&z=${zoom}&pt=${encodeURIComponent(ptParam)}`;
  }

  const fullRouteUrl = `https://yandex.ru/maps/?rtext=${encodeURIComponent(coordsRtext.join("~"))}&rtt=auto`;
  if (buildRouteLink) buildRouteLink.href = fullRouteUrl;
  if (mapDirectLink) mapDirectLink.href = fullRouteUrl;
}

window.changeStepAlternative = function (routeKey, stepIdx, newPlaceId) {
  const route = ITINERARIES[routeKey];
  if (!route || !route.steps[stepIdx] || !PLACES[newPlaceId]) return;
  route.steps[stepIdx].selected = newPlaceId;
  renderItinerary(routeKey);
};

/* 5. Умный опросник подбора маршрута под бюджет и интересы */
function initSmartQuiz() {
  const form = document.getElementById("smartRouteQuiz");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const area = document.getElementById("qArea").value;
    const budget = document.getElementById("qBudget").value;
    const interest = document.getElementById("qInterest").value;

    let chosenRoute = "arkh_korely";

    if (area === "arkh") {
      chosenRoute = interest === "sea" ? "arkh_city" : "arkh_korely";
    } else if (area === "south") {
      chosenRoute = interest === "crafts" ? "kargopol_day" : "kenozero_day";
    } else if (area === "north") {
      chosenRoute = "kimzha_day";
    }

    // Автоматически подстраиваем питание и музеи в выбранном маршруте под критерии пользователя
    const route = ITINERARIES[chosenRoute];
    route.steps.forEach((step) => {
      if (budget === "budget") {
        const cheapAlt = step.alternatives.find(
          (id) => id.includes("cafe") || id.includes("canteen") || id.includes("tea")
        );
        if (cheapAlt) step.selected = cheapAlt;
      } else if (budget === "gastro") {
        const gastroAlt = step.alternatives.find(
          (id) => id.includes("rest") || id.includes("pomorsky") || id.includes("pocha")
        );
        if (gastroAlt) step.selected = gastroAlt;
      }

      if (interest === "sea" && step.alternatives.includes("maritime")) {
        step.selected = "maritime";
      } else if (interest === "crafts" && step.alternatives.includes("kargopol_bereginya")) {
        step.selected = "kargopol_bereginya";
      }
    });

    activeRouteKey = chosenRoute;
    renderItinerary(chosenRoute);
    document.getElementById("plannerSection")?.scrollIntoView({ behavior: "smooth" });
  });
}

/* 6. Фильтр на странице промыслов (crafts.html) */
function initCraftsFilter() {
  const btns = document.querySelectorAll("[data-craft-filter]");
  const cards = document.querySelectorAll("[data-craft-type]");
  if (!btns.length || !cards.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const val = btn.getAttribute("data-craft-filter");
      cards.forEach((c) => {
        c.style.display = val === "all" || c.getAttribute("data-craft-type") === val ? "flex" : "none";
      });
    });
  });
}
