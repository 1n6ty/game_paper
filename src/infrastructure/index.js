export async function fetchGameLinks() {
  try {
    // Do smth with json data {name_1: {"draw_url": draw_url_1, "cover_url": cover_url_1}, 
    //                         name_2: {"draw_url": draw_url_2, "cover_url": cover_url_2}...}
    const response = await fetch("/gamelinks/");
    if (!response.ok) {
      throw new Error("Ошибка сети");
    }

    return await response.json();
  } catch (e) {
    throw new Error("Ошибка запроса (fetchGameLinks): " + e.message);
  }
}

export async function fetchScore(authRawData) {
  try {
  // Do smth with json data {score: int, coupons: int, score_for_coupon: int}
    const response = await fetch("/score/", { method: "GET", headers: { Authorization: authRawData } });

    if (!response.ok) {
      throw new Error("Ошибка сети");
    }

    return await response.json();
  } catch (e) {
    throw new Error("Ошибка запроса (fetchScore): " + e.message);
  }
}

export async function fetchDataMatrix(authRawData, text) {
  const response = await fetch("/datamatrix/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authRawData,
    },
    body: JSON.stringify({ text }),
  });

  console.log(response);

  // Клиентская ошибка (уже просканировано и т.п.)
  if (response.status >= 400 && response.status < 500) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody.message || `Client error: ${response.status}`;
    const err = new Error(message);
    err.isClientError = true;
    throw err;
  }

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}