const API_URL = "/api/v1/";

export function fetchData(username) {
  return fetch(API_URL + username).then(res => res.json());
}

export function download(canvas) {
  try {
    const dataUrl = canvas.toDataURL();
    const a = document.createElement("a");
    document.body.insertAdjacentElement("beforeend", a);
    a.download = "contributions.png";
    a.href = dataUrl;
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error(err);
  }
}
