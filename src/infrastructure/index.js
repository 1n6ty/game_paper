const BASE_URL = "/";

// Do smth with json data {name_1: {"draw_url": draw_url_1, "cover_url": cover_url_1}, 
//                         name_2: {"draw_url": draw_url_2, "cover_url": cover_url_2}...}
async function fetchGameLinks() {
  const response = await fetch(BASE_URL + 'gamelinks/');
  if (!response.ok) {
    throw new Error('Ошибка сети');
  }
  return await response.json();
}

// Do smth with json data {score: int, score_for_coupon: int}
async function fetchScore(authRawData) {
  const response = await fetch(BASE_URL + 'score/', { method: "GET", headers: { 'Authorization': authRawData } });
  if (!response.ok) {
    throw new Error('Ошибка сети');
  }
  return await response.json();
}

export { fetchGameLinks, fetchScore };