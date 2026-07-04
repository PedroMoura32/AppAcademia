import Dexie from 'dexie';
export const db = new Dexie('WorkoutAppDB');
db.version(1).stores({
  workouts: '++id, day, name', 
  exercises: '++id, workoutId, name, muscleGroup, equipment',
  sessions: '++id, exerciseId, date',
  sets: '++id, sessionId, exerciseId, reps, weight, weightUnit, createdAt'
});