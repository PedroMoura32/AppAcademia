import { exerciseImages } from './exercises/importImages.js';

// ==========================================
// DADOS DOS TREINOS E EXERCÍCIOS
// ==========================================
// Pra adicionar um treino novo: acrescente um objeto aqui com um "id" único.
// Pra adicionar um exercício: acrescente um objeto em MOCK_EXERCISES com
// "workoutId" apontando pro "id" do treino ao qual ele pertence.

export const MOCK_WORKOUTS = [
  { id: 1, name: 'Segunda-Feira', focus: 'Peito, Ombro e Tríceps' },
  { id: 2, name: 'Terça-Feira', focus: 'Costas, Bíceps e Abdômen' },
  { id: 3, name: 'Quarta-Feira', focus: 'Pernas Completas' },
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
    name: 'Mobilidade torácica - extensão torácica rolo',
    muscleGroup: 'Articular, Alongamentos',
    equipment: 'Rolo',
    prescribedGoal: '20 rep',
    imageGifUrl:
      'https://placehold.co/600x400/131824/ff6b35?text=Mobilidade+Torácica',
  },
  {
    id: 10,
    workoutId: 2,
    name: 'Estabilidade Escapular - T borracha',
    muscleGroup: 'Alongamento',
    equipment: 'Elástico',
    prescribedGoal: '3 séries até a falha',
    imageGifUrl: 'https://placehold.co/600x400/131824/ff6b35?text=Estabilidade+Escapular',
  },
  {
  id: 11,
  workoutId: 2,
  name: '10 Costas Puxada Frente (Pronada)',
  muscleGroup: 'Costas',
  equipment: 'Puxador (Polia Alta)',
  prescribedGoal: '3 séries de 10 rep',
  imageGifUrl:
    'https://placehold.co/600x400/131824/ff6b35?text=Puxada+Frente+Pronada',
  },
  {
    id: 12,
    workoutId: 2,
    name: '10 Costas Remada Máquina (Aberta)',
    muscleGroup: 'Costas',
    equipment: 'Máquina de Remada',
    prescribedGoal: '3 séries de 10 rep',
    imageGifUrl:
      'https://placehold.co/600x400/131824/ff6b35?text=Remada+Máquina',
  },
  {
    id: 13,
    workoutId: 2,
    name: '08 Costas Pull Down (Polia Alta)',
    muscleGroup: 'Costas',
    equipment: 'Polia Alta',
    prescribedGoal: '3 séries de 8 rep',
    imageGifUrl:
      'https://placehold.co/600x400/131824/ff6b35?text=Pull+Down',
  },
  {
    id: 14,
    workoutId: 2,
    name: '08 Barra Fixa',
    muscleGroup: 'Bíceps, Costas',
    equipment: 'Barra Fixa',
    prescribedGoal: '3 séries de 8 rep',
    imageGifUrl:
      'https://placehold.co/600x400/131824/ff6b35?text=Barra+Fixa',
  },
  {
    id: 15,
    workoutId: 2,
    name: 'Bíceps Rosca Direta (Barra W)',
    muscleGroup: 'Bíceps',
    equipment: 'Barra W',
    prescribedGoal: '3 séries de 10 rep',
    imageGifUrl:
      'https://placehold.co/600x400/131824/ff6b35?text=Rosca+Direta',
  },
  {
    id: 16,
    workoutId: 2,
    name: 'Bíceps Rosca Alternada (Halteres)',
    muscleGroup: 'Bíceps',
    equipment: 'Halteres',
    prescribedGoal: '3 séries de 10 rep',
    imageGifUrl:
      'https://placehold.co/600x400/131824/ff6b35?text=Rosca+Alternada',
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
