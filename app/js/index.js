import {BatukeitorApp} from "./app.js"

window.addEventListener("DOMContentLoaded", () => {
  $("#loading").hide();

  const app = new BatukeitorApp();
  app.run();
});
