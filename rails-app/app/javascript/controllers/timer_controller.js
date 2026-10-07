import { Controller } from "@hotwired/stimulus"

// Cronômetro por tarefa: acumula em segundos_spent e persiste ao pausar
// (e ao esconder a aba, para não perder tempo em andamento).
export default class extends Controller {
  static values = {
    seconds: Number,
    url: String,
    running: { type: Boolean, default: false },
  }

  connect() {
    this.tick = this.tick.bind(this)
    this.persist = this.persist.bind(this)
    this.flushIfHidden = () => { if (document.hidden && this.runningValue) this.persist() }
    if (this.runningValue) this.startInterval()
    document.addEventListener("visibilitychange", this.flushIfHidden)
  }

  disconnect() {
    this.stopInterval()
    document.removeEventListener("visibilitychange", this.flushIfHidden)
  }

  toggle() {
    this.runningValue ? this.pause() : this.resume()
  }

  resume() {
    this.runningValue = true
    this.startInterval()
    this.render()
  }

  pause() {
    this.runningValue = false
    this.stopInterval()
    this.persist()
    this.render()
  }

  tick() {
    this.secondsValue += 1
    this.render()
  }

  // Envia o total acumulado ao servidor via PATCH.
  // Chamado ao pausar e ao esconder a aba (timer segue rodando localmente).
  persist() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content
    fetch(this.urlValue, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ todo: { seconds_spent: this.secondsValue } }),
      keepalive: true,
    })
  }

  startInterval() {
    if (this.interval) return
    this.interval = setInterval(this.tick, 1000)
  }

  stopInterval() {
    clearInterval(this.interval)
    this.interval = null
  }

  render() {
    this.timeTarget.textContent = this.format(this.secondsValue)
    this.toggleTarget.setAttribute("aria-pressed", String(this.runningValue))
    this.toggleTarget.title = this.runningValue ? "Pausar" : "Iniciar"
    this.element.classList.toggle("timer-running", this.runningValue)
  }

  format(total) {
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    const mm = String(m).padStart(2, "0")
    const ss = String(s).padStart(2, "0")
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
  }
}
