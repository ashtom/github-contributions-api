const API_URL = "/api/v1/";

export function fetchData(username) {
  return fetch(API_URL + username).then(res => res.json());
}
