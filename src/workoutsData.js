import { exerciseImages } from './exercises/importImages.js';

// ==========================================
// DADOS DOS TREINOS E EXERCÍCIOS
// ==========================================
// Pra adicionar um treino novo: acrescente um objeto aqui com um "id" único.
// Pra adicionar um exercício: acrescente um objeto em MOCK_EXERCISES com
// "workoutId" apontando pro "id" do treino ao qual ele pertence.

export const MOCK_WORKOUTS = [
  { id: 1, name: 'Treino A', focus: 'Peito, Ombro e Tríceps' },
  { id: 2, name: 'Treino B', focus: 'Costas, Bíceps e Abdômen' },
  { id: 3, name: 'Treino C', focus: 'Pernas Completas' },
];

export const MOCK_EXERCISES = [
  {
    id: 1,
    workoutId: 1,
    name: 'Alongamento no Espaldar',
    muscleGroup: 'Alongamento',
    equipment: 'Espaldar',
    prescribedGoal: 'Até sentir confortável para iniciar.',
    imageGifUrl: exerciseImages.alongamentoEspaldar,
  },
  {
    id: 2,
    workoutId: 1,
    name: 'Mobilidade de ombro - Rotação com bastão',
    muscleGroup: 'Alongamento',
    equipment: 'Barra',
    prescribedGoal: 'Até sentir confortável para iniciar.',
    imageGifUrl: exerciseImages.ombroRotacaoBastao,
  },
  {
    id: 3,
    workoutId: 1,
    name: 'Supino Reto com Barra',
    muscleGroup: 'Peito',
    equipment: 'Barra',
    prescribedGoal: '3 séries de 10 a 12',
    imageGifUrl: exerciseImages.supinoReto,
  },
  {
    id: 4,
    workoutId: 1,
    name: 'Crucifixo inclinado com halteres',
    muscleGroup: 'Peito',
    equipment: 'Halter',
    prescribedGoal: '3 séries de 12 a 15',
    imageGifUrl: exerciseImages.crucifixoInclinadoHalter,
  },
  {
    id: 5,
    workoutId: 1,
    name: 'Supino inclinado com halteres',
    muscleGroup: 'Peito',
    equipment: 'Halter',
    prescribedGoal: '3 séries de 10 a 12',
    imageGifUrl: exerciseImages.supinoInclinadoHalter,
  },
  {
    id: 6,
    workoutId: 1,
    name: 'Peito crucifixo na máquina',
    muscleGroup: 'Peito',
    equipment: 'Máquina Crucifixo',
    prescribedGoal: '3 séries de 15',
    imageGifUrl: exerciseImages.peitoCrucifixoMaquina,
  },
  {
    id: 7,
    workoutId: 1,
    name: 'Tríceps Pulley Pronado (P. Alta)',
    muscleGroup: 'Tríceps',
    equipment: 'Polia',
    prescribedGoal: '3 séries de 15 a 20',
    imageGifUrl: exerciseImages.tricepsPulleyPronado,
  },
  {
    id: 8,
    workoutId: 1,
    name: 'Tríceps Testa (P. Alta)',
    muscleGroup: 'Tríceps',
    equipment: 'Polia',
    prescribedGoal: '3 séries de 10 a 12',
    imageGifUrl: exerciseImages.tricepsTestaPoliaAlta,
  },
  {
    id: 9,
    workoutId: 2,
    name: 'Puxada Frontal',
    muscleGroup: 'Dorsal',
    equipment: 'Polia',
    prescribedGoal: '3 séries de 10 a 12',
    imageGifUrl:
      'https://placehold.co/600x400/131824/ff6b35?text=Puxada+Frontal',
  },
  {
    id: 10,
    workoutId: 2,
    name: 'Rosca Direta',
    muscleGroup: 'Bíceps',
    equipment: 'Barra W',
    prescribedGoal: '3 séries até a falha',
    imageGifUrl: 'https://placehold.co/600x400/131824/ff6b35?text=Rosca+Direta',
  },
  {
    id: 11,
    workoutId: 3,
    name: 'Agachamento',
    muscleGroup: 'Quadríceps',
    equipment: 'Barra',
    prescribedGoal: '4 séries de 8',
    imageGifUrl: 'https://placehold.co/600x400/131824/ff6b35?text=Agachamento',
  },
];
