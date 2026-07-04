import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import './App.css';
import supinoImg from './exercises/supino-reto.webp'';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  History,
  ChevronLeft,
  Download,
  Upload,
  Settings,
  ChevronRight,
  Calendar,
  Pencil,
  Check,
  X,
} from 'lucide-react';

// ==========================================
// DADOS FALSOS INICIAIS (MOCKS)
// ==========================================
const MOCK_WORKOUTS = [
  { id: 1, name: 'Treino A', focus: 'Peito, Ombro e Tríceps' },
  { id: 2, name: 'Treino B', focus: 'Costas, Bíceps e Abdômen' },
  { id: 3, name: 'Treino C', focus: 'Pernas Completas' },
];

const MOCK_EXERCISES = [
  {
    id: 1,
    workoutId: 1,
    name: 'Supino Reto',
    muscleGroup: 'Peito',
    equipment: 'Barra',
    prescribedGoal: '4 séries de 8 a 10',
    imageGifUrl: supinoImg,
  },
  {
    id: 2,
    workoutId: 1,
    name: 'Tríceps Corda',
    muscleGroup: 'Tríceps',
    equipment: 'Polia',
    prescribedGoal: '3 séries de 12',
    imageGifUrl:
      'https://placehold.co/600x400/131824/ff6b35?text=Triceps+Corda',
  },
  {
    id: 3,
    workoutId: 2,
    name: 'Puxada Frontal',
    muscleGroup: 'Dorsal',
    equipment: 'Polia',
    prescribedGoal: '3 séries de 10 a 12',
    imageGifUrl:
      'https://placehold.co/600x400/131824/ff6b35?text=Puxada+Frontal',
  },
  {
    id: 4,
    workoutId: 2,
    name: 'Rosca Direta',
    muscleGroup: 'Bíceps',
    equipment: 'Barra W',
    prescribedGoal: '3 séries até a falha',
    imageGifUrl: 'https://placehold.co/600x400/131824/ff6b35?text=Rosca+Direta',
  },
  {
    id: 5,
    workoutId: 3,
    name: 'Agachamento',
    muscleGroup: 'Quadríceps',
    equipment: 'Barra',
    prescribedGoal: '4 séries de 8',
    imageGifUrl: 'https://placehold.co/600x400/131824/ff6b35?text=Agachamento',
  },
];

// ==========================================
// COMPONENTE 1: TELA INICIAL (MEUS TREINOS)
// ==========================================
function HomeScreen({ onSelectWorkout }) {
  return (
    <div className="screen">
      <header className="screen__header screen__header--static">
        <h1 className="app-title">Meus Treinos</h1>
        <p className="app-subtitle">Selecione o treino de hoje</p>
      </header>

      <main className="workout-list">
        {MOCK_WORKOUTS.map((workout) => (
          <button
            key={workout.id}
            onClick={() => onSelectWorkout(workout)}
            className="workout-card"
          >
            <div className="workout-card__left">
              <div className="workout-card__icon">
                <Calendar size={22} />
              </div>
              <div>
                <h2 className="workout-card__name">{workout.name}</h2>
                <p className="workout-card__focus">{workout.focus}</p>
              </div>
            </div>
            <ChevronRight className="workout-card__chevron" size={20} />
          </button>
        ))}
      </main>
    </div>
  );
}

// ==========================================
// COMPONENTE 2: TELA DA LISTA DE EXERCÍCIOS
// ==========================================
function WorkoutScreen({ workout, onBack, onSelectExercise }) {
  const exercises = MOCK_EXERCISES.filter((ex) => ex.workoutId === workout.id);

  return (
    <div className="screen">
      <header className="screen__header">
        <div className="header-left">
          <button onClick={onBack} className="icon-button icon-button--accent">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="screen-title">{workout.name}</h1>
            <p className="screen-subtitle">Exercícios do dia</p>
          </div>
        </div>
      </header>

      <main className="exercise-list">
        {exercises.map((exercise, index) => (
          <button
            key={exercise.id}
            onClick={() => onSelectExercise(exercise)}
            className="exercise-row"
          >
            <div className="exercise-row__thumb">
              <img src={exercise.imageGifUrl} alt={exercise.name} />
            </div>
            <div className="exercise-row__body">
              <span className="exercise-row__eyebrow">
                Exercício {index + 1}
              </span>
              <h3 className="exercise-row__name">{exercise.name}</h3>
              <p className="exercise-row__meta">
                {exercise.muscleGroup} • {exercise.prescribedGoal}
              </p>
            </div>
            <div className="exercise-row__chevron">
              <ChevronRight size={18} />
            </div>
          </button>
        ))}
      </main>
    </div>
  );
}

// ==========================================
// COMPONENTE 3: TELA DE EXECUÇÃO DO EXERCÍCIO
// ==========================================
function ExerciseScreen({ exercise, onBack }) {
  const [repsInput, setRepsInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [unit, setUnit] = useState('kg');
  const [showSettings, setShowSettings] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [editingSetId, setEditingSetId] = useState(null);
  const [editReps, setEditReps] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const fileInputRef = useRef(null);

  const lastSessionInfo = useLiveQuery(async () => {
    if (!exercise) return null;
    const sessions = await db.sessions
      .where('exerciseId')
      .equals(exercise.id)
      .sortBy('date');
    if (sessions.length === 0) return null;
    const lastSession = sessions[sessions.length - 1];
    const sets = await db.sets
      .where('sessionId')
      .equals(lastSession.id)
      .toArray();
    return { date: lastSession.date, sets };
  }, [exercise]);

  const formatDisplayDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
  };

  const todayDateString = new Date().toISOString().split('T')[0];
  const todaySets = useLiveQuery(async () => {
    if (!exercise) return null;
    const todaySession = await db.sessions
      .where({ exerciseId: exercise.id, date: todayDateString })
      .first();
    if (todaySession)
      return await db.sets.where('sessionId').equals(todaySession.id).toArray();
    return [];
  }, [exercise]);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && time > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0 && isTimerActive) {
      setIsTimerActive(false);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, time]);

  const startTimer = () => {
    setTime(restDuration);
    setIsTimerActive(true);
  };
  const toggleTimer = () => setIsTimerActive(!isTimerActive);
  const resetTimer = () => {
    setIsTimerActive(false);
    setTime(0);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Cálculo do anel de progresso do timer (elemento de assinatura)
  const ringRadius = 20;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = restDuration > 0 ? time / restDuration : 0;
  const ringOffset = ringCircumference * (1 - ringProgress);

  const handleAddSet = async () => {
    if (!repsInput || !weightInput) return;
    try {
      let session = await db.sessions
        .where({ exerciseId: exercise.id, date: todayDateString })
        .first();
      if (!session) {
        const sessionId = await db.sessions.add({
          exerciseId: exercise.id,
          date: todayDateString,
        });
        session = { id: sessionId };
      }
      await db.sets.add({
        sessionId: session.id,
        exerciseId: exercise.id,
        reps: parseInt(repsInput, 10),
        weight: parseFloat(weightInput),
        weightUnit: unit,
        createdAt: Date.now(),
      });
      setRepsInput('');
      startTimer();
    } catch (error) {
      console.error('Erro ao salvar série:', error);
    }
  };

  const startEditSet = (set) => {
    setEditingSetId(set.id);
    setEditReps(String(set.reps));
    setEditWeight(String(set.weight));
  };

  const cancelEditSet = () => {
    setEditingSetId(null);
    setEditReps('');
    setEditWeight('');
  };

  const saveEditSet = async (setId) => {
    if (!editReps || !editWeight) return;
    try {
      await db.sets.update(setId, {
        reps: parseInt(editReps, 10),
        weight: parseFloat(editWeight),
      });
      setEditingSetId(null);
    } catch (error) {
      console.error('Erro ao editar série:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const data = {
        workouts: await db.workouts.toArray(),
        exercises: await db.exercises.toArray(),
        sessions: await db.sessions.toArray(),
        sets: await db.sets.toArray(),
      };
      const json = JSON.stringify(data);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workout_backup_${todayDateString}.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert('Backup exportado com sucesso!');
    } catch (error) {
      alert('Erro ao exportar o backup.');
    }
  };

  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        await db.transaction(
          'rw',
          db.workouts,
          db.exercises,
          db.sessions,
          db.sets,
          async () => {
            await db.workouts.clear();
            await db.exercises.clear();
            await db.sessions.clear();
            await db.sets.clear();
            if (data.workouts) await db.workouts.bulkAdd(data.workouts);
            if (data.exercises) await db.exercises.bulkAdd(data.exercises);
            if (data.sessions) await db.sessions.bulkAdd(data.sessions);
            if (data.sets) await db.sets.bulkAdd(data.sets);
          }
        );
        alert('Backup importado com sucesso!');
        setShowSettings(false);
      } catch (error) {
        alert('Erro ao importar backup. Arquivo inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="screen">
      <header className="screen__header">
        <div className="header-left">
          <button onClick={onBack} className="icon-button icon-button--accent">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="screen-title">{exercise.name}</h1>
            <p className="screen-subtitle">
              {exercise.muscleGroup} • {exercise.equipment}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="icon-button icon-button--filled"
        >
          <Settings size={18} />
        </button>
      </header>

      {showSettings && (
        <div className="settings-menu">
          <h3 className="settings-menu__title">Opções de Dados</h3>
          <button
            onClick={handleExportData}
            className="settings-menu__item settings-menu__item--accent"
          >
            <Download size={17} /> Exportar Backup (.json)
          </button>
          <button
            onClick={() => fileInputRef.current.click()}
            className="settings-menu__item"
          >
            <Upload size={17} /> Importar Backup
          </button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImportData}
            style={{ display: 'none' }}
          />
        </div>
      )}

      <main className="exercise-body">
        <div className="hero-media">
          <img src={exercise.imageGifUrl} alt={exercise.name} />
        </div>

        <div className="goal-banner">
          <div>
            <p className="goal-banner__label">Meta do Treino</p>
            <p className="goal-banner__value">{exercise.prescribedGoal}</p>
          </div>
        </div>

        {lastSessionInfo && lastSessionInfo.sets.length > 0 && (
          <div className="history">
            <div className="history__header">
              <History size={15} />
              <span>
                Última Execução — {formatDisplayDate(lastSessionInfo.date)}
              </span>
            </div>
            <div className="chips">
              {lastSessionInfo.sets.map((set, idx) => (
                <div key={set.id} className="chip">
                  <span className="chip__index">{idx + 1}º:</span>
                  <span className="chip__reps">{set.reps}x</span>
                  <span className="chip__weight">
                    {set.weight}
                    {set.weightUnit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="set-form">
          <h3 className="set-form__title">Registrar Série</h3>

          <div className="field-row">
            <div className="field">
              <label className="field__label">Reps</label>
              <input
                type="number"
                value={repsInput}
                onChange={(e) => setRepsInput(e.target.value)}
                className="field__input"
                placeholder="0"
                inputMode="numeric"
              />
            </div>
            <div className="field">
              <label className="field__label">Carga</label>
              <input
                type="number"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="field__input"
                placeholder="0"
                inputMode="decimal"
              />
            </div>
            <div className="field field--unit">
              <label className="field__label">Unid</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="field__select"
              >
                <option value="kg">KG</option>
                <option value="placas">Placas</option>
                <option value="hal">Halt</option>
              </select>
            </div>
          </div>

          <div className="action-row">
            <button
              onClick={handleAddSet}
              disabled={!repsInput || !weightInput}
              className="save-button save-button--compact"
            >
              <Plus size={18} />
              <span>Salvar</span>
            </button>

            <div className="timer">
              <div className="timer__ring-wrap">
                <svg
                  className="timer__ring-svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                >
                  <circle
                    className="timer__ring-track"
                    cx="24"
                    cy="24"
                    r={ringRadius}
                  />
                  <circle
                    className="timer__ring-progress"
                    cx="24"
                    cy="24"
                    r={ringRadius}
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={time > 0 ? ringOffset : ringCircumference}
                  />
                </svg>
                <span className="timer__time">{formatTime(time)}</span>
              </div>

              <div className="timer__duration">
                <label className="timer__duration-label">Descanso</label>
                <div className="timer__duration-input-wrap">
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={restDuration}
                    onChange={(e) =>
                      setRestDuration(Math.max(0, Number(e.target.value)))
                    }
                    className="timer__duration-input"
                  />
                  <span className="timer__duration-suffix">s</span>
                </div>
              </div>

              <div className="timer__controls">
                <button onClick={time === 0 ? startTimer : toggleTimer}>
                  {isTimerActive ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button onClick={resetTimer}>
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          </div>

          {todaySets && todaySets.length > 0 && (
            <div className="today-sets">
              <h4 className="today-sets__title">Séries de Hoje</h4>
              {todaySets.map((set, idx) =>
                editingSetId === set.id ? (
                  <div key={set.id} className="set-row set-row--editing">
                    <span className="set-row__index">{idx + 1}.</span>
                    <input
                      type="number"
                      value={editReps}
                      onChange={(e) => setEditReps(e.target.value)}
                      className="set-row__edit-input"
                      inputMode="numeric"
                      autoFocus
                    />
                    <span className="set-row__edit-unit-label">reps</span>
                    <input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="set-row__edit-input"
                      inputMode="decimal"
                    />
                    <span className="set-row__edit-unit-label">
                      {set.weightUnit}
                    </span>
                    <button
                      onClick={() => saveEditSet(set.id)}
                      className="set-row__edit-action set-row__edit-action--confirm"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      onClick={cancelEditSet}
                      className="set-row__edit-action"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div key={set.id} className="set-row">
                    <span className="set-row__index">{idx + 1}.</span>
                    <span className="set-row__reps">
                      {set.reps} <span>reps</span>
                    </span>
                    <span className="set-row__weight">
                      {set.weight} <span>{set.weightUnit}</span>
                    </span>
                    <button
                      onClick={() => startEditSet(set)}
                      className="set-row__edit-btn"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// LIMPEZA DE HISTÓRICO ANTIGO
// ==========================================
const HISTORY_DAYS_LIMIT = 5;

async function pruneOldHistory() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - HISTORY_DAYS_LIMIT);
  const cutoffDateString = cutoff.toISOString().split('T')[0];

  try {
    const oldSessions = await db.sessions
      .where('date')
      .below(cutoffDateString)
      .toArray();

    if (oldSessions.length === 0) return;

    const oldSessionIds = oldSessions.map((session) => session.id);

    await db.transaction('rw', db.sessions, db.sets, async () => {
      await db.sets.where('sessionId').anyOf(oldSessionIds).delete();
      await db.sessions.bulkDelete(oldSessionIds);
    });
  } catch (error) {
    console.error('Erro ao limpar histórico antigo:', error);
  }
}

// ==========================================
// ROTEADOR PRINCIPAL (GERENCIA AS TELAS)
// ==========================================
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // home | workout | exercise
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    pruneOldHistory();
  }, []);

  const navigateToWorkout = (workout) => {
    setSelectedWorkout(workout);
    setCurrentScreen('workout');
  };

  const navigateToExercise = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentScreen('exercise');
  };

  const navigateBack = () => {
    if (currentScreen === 'exercise') setCurrentScreen('workout');
    else if (currentScreen === 'workout') setCurrentScreen('home');
  };

  if (currentScreen === 'home') {
    return <HomeScreen onSelectWorkout={navigateToWorkout} />;
  }

  if (currentScreen === 'workout') {
    return (
      <WorkoutScreen
        workout={selectedWorkout}
        onSelectExercise={navigateToExercise}
        onBack={navigateBack}
      />
    );
  }

  if (currentScreen === 'exercise') {
    return <ExerciseScreen exercise={selectedExercise} onBack={navigateBack} />;
  }

  return null;
}
