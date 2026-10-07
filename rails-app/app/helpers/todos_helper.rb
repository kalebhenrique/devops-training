module TodosHelper
  # Formata uma duração em segundos como H:MM:SS (ou MM:SS abaixo de 1h).
  def format_duration(seconds)
    seconds = seconds.to_i
    h, rem = seconds.divmod(3600)
    m, s = rem.divmod(60)
    h.positive? ? format("%d:%02d:%02d", h, m, s) : format("%02d:%02d", m, s)
  end
end
