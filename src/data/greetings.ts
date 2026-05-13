export const GREETINGS = [
  'Bom treino hoje',
  'Hora de evoluir',
  'Foco total, resultado vem',
  'Mais um passo na direção certa',
  'Corpo em movimento, mente afiada',
  'Disciplina vence talento',
  'Respira fundo e executa',
  'Hoje é dia de progresso real',
]

export function greetingForDate(dateKey: string): string {
  let h = 0
  for (let i = 0; i < dateKey.length; i++) h = (h + dateKey.charCodeAt(i) * (i + 1)) % 997
  return GREETINGS[h % GREETINGS.length]
}
