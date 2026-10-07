import { Controller } from "@hotwired/stimulus"

// Alternador de tema claro/escuro. Persiste a escolha no localStorage.
export default class extends Controller {
  toggle() {
    const html = document.documentElement
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark"
    html.setAttribute("data-theme", next)
    localStorage.setItem("theme", next)
  }
}
