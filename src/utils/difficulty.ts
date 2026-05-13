import type { Difficulty } from '../types/domain'

export function difficultyLabel(d: Difficulty): string {
  switch (d) {
    case 'iniciante':
      return 'Iniciante'
    case 'intermediario':
      return 'Intermediário'
    case 'avancado':
      return 'Avançado'
    default:
      return d
  }
}
