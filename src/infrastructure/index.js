const BASE_URL = "/";

async function fetchGameLinks() {
  // Do smth with json data {name_1: {"draw_url": draw_url_1, "cover_url": cover_url_1}, 
  //                         name_2: {"draw_url": draw_url_2, "cover_url": cover_url_2}...}
  const response = await fetch(BASE_URL + "gamelinks/");
  if (!response.ok) {
    throw new Error("Ошибка сети");
  }

  return await response.json();
}

async function fetchScore(authRawData) {
  // Do smth with json data {score: int, coupons: int, score_for_coupon: int}
  const response = await fetch(BASE_URL + "score/", { method: "GET", headers: { Authorization: authRawData } });

  if (!response.ok) {
    throw new Error("Ошибка сети");
  }

  return await response.json();
}

async function fetchDataMatrix(authRawData, text) {
  try {
    const response = await fetch(BASE_URL + "datamatrix/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authRawData // Tg authorization
      },
      body: JSON.stringify({ text: text })
    });

    // do smth with {score: int}
    return await response.json();
  } catch (e) {
    // This method enables when codeReader.stopAsyncDecode
    // console.error(err);
  }
}

export { fetchGameLinks, fetchScore, fetchDataMatrix };