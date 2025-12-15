const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateToken = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

class DB {
  constructor() {
    this.countries = {
      115: {
        name: "Туреччина",
        id: "115",
        flag: "https://flagcdn.com/w40/tr.png",
      },
      43: {
        name: "Єгипет",
        id: "43",
        flag: "https://flagcdn.com/w40/eg.png",
      },
      34: {
        name: "Греція",
        id: "34",
        flag: "https://flagcdn.com/w40/gr.png",
      },
      724: {
        name: "Іспанія",
        id: "724",
        flag: "https://flagcdn.com/w40/es.png",
      },
      380: {
        name: "Україна",
        id: "380",
        flag: "https://flagcdn.com/w40/ua.png",
      },
    };

    this.cities = {
      // Єгипет
      712: { countryId: "43", id: 712, name: "Хургада" },
      1262: { countryId: "43", id: 1262, name: "Макаді Бей" },
      1247: { countryId: "43", id: 1247, name: "Марса Алам" },
      713: { countryId: "43", id: 713, name: "Шарм-ель-Шейх" },
      // Туреччина
      953: { countryId: "115", id: 953, name: "Аланія" },
      954: { countryId: "115", id: 954, name: "Анталія" },
      955: { countryId: "115", id: 955, name: "Кемер" },
      956: { countryId: "115", id: 956, name: "Сіде" },
      // Греція
      341: { countryId: "34", id: 341, name: "Афіни" },
      342: { countryId: "34", id: 342, name: "Санторіні" },
      343: { countryId: "34", id: 343, name: "Крит" },
      344: { countryId: "34", id: 344, name: "Новий Афон" },
      // Іспанія
      7241: { countryId: "724", id: 7241, name: "Барселона" },
      7242: { countryId: "724", id: 7242, name: "Мадрид" },
      7243: { countryId: "724", id: 7243, name: "Малага" },
      7244: { countryId: "724", id: 7244, name: "Новий Орлеан" },
      // Україна
      3801: { countryId: "380", id: 3801, name: "Одеса" },
      3802: { countryId: "380", id: 3802, name: "Затока" },
    };

    this.hotels = {
      // Єгипет - Хургада
      7953: {
        id: 7953,
        name: "Marlin Inn Azur Resort",
        img: "https://newimg.otpusk.com/2/400x300/00/03/97/88/3978846.webp",
        cityId: 712,
        cityName: "Хургада",
        countryId: "43",
        countryName: "Єгипет",
      },
      7954: {
        id: 7954,
        name: "Sunrise Garden Beach Resort",
        img: "https://newimg.otpusk.com/2/400x300/00/04/88/41/4884132.webp",
        cityId: 712,
        cityName: "Хургада",
        countryId: "43",
        countryName: "Єгипет",
      },
      // Єгипет - Макаді Бей
      18183: {
        id: 18183,
        name: "Albatros Makadi Resort",
        img: "https://newimg.otpusk.com/2/400x300/00/04/88/41/4884132.webp",
        cityId: 1262,
        cityName: "Макаді Бей",
        countryId: "43",
        countryName: "Єгипет",
      },
      // Єгипет - Марса Алам
      84183: {
        id: 84183,
        name: "Protels Beach Club & SPA",
        img: "https://newimg.otpusk.com/2/400x300/00/03/95/62/3956278.webp",
        cityId: 1247,
        cityName: "Марса Алам",
        countryId: "43",
        countryName: "Єгипет",
      },
      // Єгипет - Шарм-ель-Шейх
      7955: {
        id: 7955,
        name: "Rixos Sharm El Sheikh",
        img: "https://newimg.otpusk.com/2/400x300/00/03/97/88/3978846.webp",
        cityId: 713,
        cityName: "Шарм-ель-Шейх",
        countryId: "43",
        countryName: "Єгипет",
      },
      // Туреччина - Аланія
      7898: {
        id: 7898,
        name: "Saphir Hotel & Villas",
        img: "https://newimg.otpusk.com/2/400x300/00/04/37/33/4373386.webp",
        cityId: 953,
        cityName: "Аланія",
        countryId: "115",
        countryName: "Туреччина",
      },
      7899: {
        id: 7899,
        name: "Lonicera Resort & Spa",
        img: "https://newimg.otpusk.com/2/400x300/00/03/95/62/3956278.webp",
        cityId: 953,
        cityName: "Аланія",
        countryId: "115",
        countryName: "Туреччина",
      },
      // Туреччина - Анталія
      7900: {
        id: 7900,
        name: "Titanic Beach Lara",
        img: "https://newimg.otpusk.com/2/400x300/00/04/88/41/4884132.webp",
        cityId: 954,
        cityName: "Анталія",
        countryId: "115",
        countryName: "Туреччина",
      },
      // Туреччина - Кемер
      7901: {
        id: 7901,
        name: "Rixos Sungate",
        img: "https://newimg.otpusk.com/2/400x300/00/03/97/88/3978846.webp",
        cityId: 955,
        cityName: "Кемер",
        countryId: "115",
        countryName: "Туреччина",
      },
      // Греція - Санторіні
      3401: {
        id: 3401,
        name: "Santorini Palace",
        img: "https://newimg.otpusk.com/2/400x300/00/04/37/33/4373386.webp",
        cityId: 342,
        cityName: "Санторіні",
        countryId: "34",
        countryName: "Греція",
      },
      // Греція - Крит
      3402: {
        id: 3402,
        name: "Creta Maris Beach Resort",
        img: "https://newimg.otpusk.com/2/400x300/00/03/95/62/3956278.webp",
        cityId: 343,
        cityName: "Крит",
        countryId: "34",
        countryName: "Греція",
      },
      // Іспанія - Барселона
      72401: {
        id: 72401,
        name: "Hotel Arts Barcelona",
        img: "https://newimg.otpusk.com/2/400x300/00/04/88/41/4884132.webp",
        cityId: 7241,
        cityName: "Барселона",
        countryId: "724",
        countryName: "Іспанія",
      },
      // Україна - Одеса
      38001: {
        id: 38001,
        name: "Готель Лондонська",
        img: "https://newimg.otpusk.com/2/400x300/00/03/97/88/3978846.webp",
        cityId: 3801,
        cityName: "Одеса",
        countryId: "380",
        countryName: "Україна",
      },
      // Україна - Затока
      38002: {
        id: 38002,
        name: "Готель «Новий світ»",
        img: "https://newimg.otpusk.com/2/400x300/00/04/37/33/4373386.webp",
        cityId: 3802,
        cityName: "Затока",
        countryId: "380",
        countryName: "Україна",
      },
      // Греція - Новий Афон
      3403: {
        id: 3403,
        name: "Afon Palace Hotel",
        img: "https://newimg.otpusk.com/2/400x300/00/03/95/62/3956278.webp",
        cityId: 344,
        cityName: "Новий Афон",
        countryId: "34",
        countryName: "Греція",
      },
      // Іспанія - Новий Орлеан
      72402: {
        id: 72402,
        name: "Orleans Grand Hotel",
        img: "https://newimg.otpusk.com/2/400x300/00/04/88/41/4884132.webp",
        cityId: 7244,
        cityName: "Новий Орлеан",
        countryId: "724",
        countryName: "Іспанія",
      },
    };

    this.searches = new Map();
  }

  getCountries = () => this.countries;
  getCities = () => this.cities;
  getHotels = () => this.hotels;

  getHotel = (hotelID) => {
    const hotel = Object.values(this.hotels).find((h) => h.id === hotelID);
    if (hotel) {
      return {
        ...hotel,
        description:
          "Готель розташований на березі моря. Затишна територія, комфортабельні номери.",
        services: { wifi: "yes", pool: "yes", spa: "yes", parking: "yes" },
      };
    }
    return {};
  };

  getHotelsByCountryID = (countryID) => {
    return Object.fromEntries(
      Object.entries(this.hotels).filter(([, h]) => h.countryId === countryID)
    );
  };

  addSearch = (token, search) => this.searches.set(token, search);
  deleteSearch = (token) => this.searches.delete(token);
  hasSearch = (token) => this.searches.has(token);
  getSearch = (token) => this.searches.get(token) ?? null;
}

class Price {
  static futureDate(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split("T")[0];
  }

  static generate() {
    return {
      id: generateToken(),
      amount: randomInt(1500, 4000),
      currency: "usd",
      startDate: this.futureDate(randomInt(2, 5)),
      endDate: this.futureDate(randomInt(7, 12)),
    };
  }
}

class Search {
  constructor(token, params = {}) {
    this._token = token;
    this._params = params;
    this.readyTimestamp = Date.now() + randomInt(2, 4) * 1000;
  }

  get isReady() {
    return Date.now() >= this.readyTimestamp;
  }

  getMockPrices(db) {
    const hotels = db.getHotelsByCountryID(this._params.countryID);
    return Object.fromEntries(
      Object.entries(hotels).map(([hotelID]) => {
        const price = Price.generate();
        return [price.id, { ...price, hotelID }];
      })
    );
  }
}

const db = new DB();

// ============ API Methods ============

export const getCountries = () => {
  const response = new Response(JSON.stringify(db.getCountries()), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  return Promise.resolve(response);
};

// Fuzzy search helpers
function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
  for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

function normalizeText(text) {
  return text.toLowerCase().trim();
}

export const searchGeo = (string) => {
  if (!string || string.trim().length === 0) {
    return Promise.resolve(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
  }

  const searchTerm = normalizeText(string);
  const countries = Object.values(db.getCountries()).map((c) => ({
    ...c,
    type: "country",
  }));
  const cities = Object.values(db.getCities()).map((c) => ({
    ...c,
    type: "city",
  }));
  const hotels = Object.values(db.getHotels()).map((h) => ({
    ...h,
    type: "hotel",
  }));

  const matches = [];

  const getMatchScore = (name) => {
    const normalizedName = normalizeText(name);

    // Точний збіг на початку слова (найвищий пріоритет)
    if (normalizedName.startsWith(searchTerm)) {
      return { score: -2, type: "startsWith" };
    }

    // Містить підрядок
    if (normalizedName.includes(searchTerm)) {
      return { score: -1, type: "includes" };
    }

    // Fuzzy search для запитів 3+ символи
    if (searchTerm.length >= 3) {
      const distance = levenshteinDistance(searchTerm, normalizedName);
      const maxLength = Math.max(searchTerm.length, normalizedName.length);
      const similarity = 1 - distance / maxLength;

      if (similarity > 0.5) {
        return { score: distance, type: "fuzzy", similarity };
      }
    }

    return null;
  };

  // Пошук країн
  countries.forEach((country) => {
    const match = getMatchScore(country.name);
    if (match) {
      matches.push({ entity: country, ...match });
    }
  });

  // Пошук міст
  cities.forEach((city) => {
    const match = getMatchScore(city.name);
    if (match) {
      const country = countries.find((c) => c.id === city.countryId);
      matches.push({
        entity: {
          ...city,
          countryName: country?.name,
          countryFlag: country?.flag,
        },
        ...match,
      });
    }
  });

  // Пошук готелів
  hotels.forEach((hotel) => {
    const nameMatch = getMatchScore(hotel.name);
    const cityMatch = getMatchScore(hotel.cityName);

    const bestMatch = [nameMatch, cityMatch]
      .filter(Boolean)
      .sort((a, b) => a.score - b.score)[0];

    if (bestMatch) {
      const country = countries.find((c) => c.id === hotel.countryId);
      matches.push({
        entity: { ...hotel, countryFlag: country?.flag },
        ...bestMatch,
      });
    }
  });

  // Сортування: startsWith > includes > fuzzy
  matches.sort((a, b) => a.score - b.score);

  const geo = {};
  matches.forEach((m) => {
    geo[m.entity.id] = m.entity;
  });

  return Promise.resolve(
    new Response(JSON.stringify(geo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );
};

export const startSearchPrices = (countryID) => {
  if (!countryID) {
    return Promise.reject(
      new Response(
        JSON.stringify({
          code: 400,
          error: true,
          message: "Country id is required param.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    );
  }

  const token = generateToken();
  const search = new Search(token, { countryID });
  db.addSearch(token, search);

  return Promise.resolve(
    new Response(
      JSON.stringify({
        token,
        waitUntil: new Date(search.readyTimestamp).toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );
};

export const getSearchPrices = (token) => {
  const search = db.getSearch(token);

  if (!search) {
    return Promise.reject(
      new Response(
        JSON.stringify({
          code: 404,
          error: true,
          message: "Search with this token was not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    );
  }

  if (!search.isReady) {
    return Promise.reject(
      new Response(
        JSON.stringify({
          code: 425,
          error: true,
          message: "Search results are not ready yet.",
          waitUntil: new Date(search.readyTimestamp).toISOString(),
        }),
        { status: 425, headers: { "Content-Type": "application/json" } }
      )
    );
  }

  return Promise.resolve(
    new Response(
      JSON.stringify({
        prices: search.getMockPrices(db),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );
};

export const stopSearchPrices = (token) => {
  if (!token || !db.hasSearch(token)) {
    return Promise.reject(
      new Response(
        JSON.stringify({
          code: 404,
          error: true,
          message: "Search with this token was not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    );
  }

  db.deleteSearch(token);

  return Promise.resolve(
    new Response(
      JSON.stringify({
        message: "Search has been cancelled successfully.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );
};

export const getHotels = (countryID) => {
  const hotels = db.getHotelsByCountryID(countryID);
  const countries = db.getCountries();

  const hotelsWithFlags = Object.fromEntries(
    Object.entries(hotels).map(([id, hotel]) => {
      const country = countries[hotel.countryId];
      return [id, { ...hotel, countryFlag: country?.flag }];
    })
  );

  return Promise.resolve(
    new Response(JSON.stringify(hotelsWithFlags), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );
};

export const getHotel = (hotelId) => {
  const hotel = db.getHotel(hotelId);

  if (!hotel || !hotel.id) {
    return Promise.reject(
      new Response(
        JSON.stringify({
          code: 404,
          error: true,
          message: "Hotel with this ID was not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    );
  }

  return Promise.resolve(
    new Response(JSON.stringify(hotel), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );
};

export const getPrice = (priceId) => {
  if (!priceId) {
    return Promise.reject(
      new Response(
        JSON.stringify({
          code: 404,
          error: true,
          message: "Offer with this ID was not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    );
  }

  return Promise.resolve(
    new Response(
      JSON.stringify({
        ...Price.generate(),
        id: priceId,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );
};
