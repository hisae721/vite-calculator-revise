import { setupEventListeners } from "./ui/events";

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
  });
}
