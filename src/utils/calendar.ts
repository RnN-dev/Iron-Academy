export function futureDay(offset: number): { weekday: number; dateLabel: string } {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return {
    weekday: d.getDay(),
    dateLabel: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
  }
}
