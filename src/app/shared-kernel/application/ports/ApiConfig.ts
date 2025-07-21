/**
 * Описывает структуру эндпоинтов API, сгруппированных по доменам.
 */
export interface ApiEndpoints {
  user: {
    rewards: string; // -> /score/
  };
  game: {
    list: string; // -> /gamelinks/
    initialize: string; // -> /gameinit/
    finish: string; // -> /gamefinish/
  };
  datamatrix: {
    scan: string; // -> /datamatrix/
  };
}

/**
 * Интерфейс для объекта конфигурации API.
 */
export interface ApiConfig {
  endpoints: ApiEndpoints;
}
