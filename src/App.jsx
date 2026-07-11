import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import './App.css';
import { MOCK_WORKOUTS, MOCK_EXERCISES } from './workoutsData';
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
  Home,
  Dumbbell,
  ClipboardCheck,
} from 'lucide-react';

// Atualize esse número a cada nova versão publicada
const APP_VERSION = '1.0.0';

// ==========================================
// COMPONENTE 0: TELA DE BOAS-VINDAS (RAIZ DO APP)
// ==========================================
function WelcomeScreen({ onGoToWorkouts, onGoToCheckin }) {
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef(null);
  const todayDateString = new Date().toISOString().split('T')[0];

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
      <header className="screen__header screen__header--static">
        <div>
          <h1 className="app-title">App Academia</h1>
          <p className="app-subtitle">O que você quer fazer agora?</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="icon-button icon-button--filled"
        >
          <Settings size={18} />
        </button>
      </header>

      {showSettings && (
        <div className="settings-menu settings-menu--static">
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

      <main className="workout-list">
        <button onClick={onGoToWorkouts} className="workout-card">
          <div className="workout-card__left">
            <div className="workout-card__icon">
              <Dumbbell size={22} />
            </div>
            <div>
              <h2 className="workout-card__name">Meus Treinos</h2>
              <p className="workout-card__focus">
                Ver treinos e registrar séries
              </p>
            </div>
          </div>
          <ChevronRight className="workout-card__chevron" size={20} />
        </button>

        <button onClick={onGoToCheckin} className="workout-card">
          <div className="workout-card__left">
            <div className="workout-card__icon">
              <ClipboardCheck size={22} />
            </div>
            <div>
              <h2 className="workout-card__name">Check-in</h2>
              <p className="workout-card__focus">
                Marcar o que você treinou hoje
              </p>
            </div>
          </div>
          <ChevronRight className="workout-card__chevron" size={20} />
        </button>
      </main>

      <footer className="app-footer">
        App Academia · v{APP_VERSION} · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

// ==========================================
// COMPONENTE 1: TELA INICIAL (MEUS TREINOS)
// ==========================================
function HomeScreen({ onSelectWorkout, onBack }) {
  return (
    <div className="screen">
      <header className="screen__header screen__header--static">
        <div className="header-left">
          <button onClick={onBack} className="icon-button icon-button--accent">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="app-title">Meus Treinos</h1>
            <p className="app-subtitle">Selecione o treino de hoje</p>
          </div>
        </div>
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
function ExerciseScreen({ exercise, onBack, onGoHome }) {
  const [repsInput, setRepsInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [unit, setUnit] = useState('kg');
  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [editingSetId, setEditingSetId] = useState(null);
  const [editReps, setEditReps] = useState('');
  const [editWeight, setEditWeight] = useState('');

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
          onClick={onGoHome}
          className="icon-button icon-button--filled"
          aria-label="Ir para o início"
        >
          <Home size={18} />
        </button>
      </header>

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
// COMPONENTE: TELA DE CHECK-IN
// ==========================================
function CheckinScreen({ onBack }) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const todayDateString = new Date().toISOString().split('T')[0];

  const formatDisplayDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
  };

  // Reaproveita a tabela de sessões que já existe — marcar check-in de um
  // TREINO cria uma sessão (sem séries ainda) para cada exercício daquele
  // treino, na data de hoje. Assim continua tudo dentro do mesmo backup.
  const workoutCheckins = useLiveQuery(async () => {
    const allSessions = await db.sessions.toArray();

    // Agrupa as sessões por combinação de treino + data
    const groups = new Map();
    for (const session of allSessions) {
      const exercise = MOCK_EXERCISES.find((e) => e.id === session.exerciseId);
      if (!exercise) continue;
      const key = `${session.date}__${exercise.workoutId}`;
      if (!groups.has(key)) {
        groups.set(key, {
          date: session.date,
          workoutId: exercise.workoutId,
          sessionIds: [],
        });
      }
      groups.get(key).sessionIds.push(session.id);
    }

    const results = [];
    for (const { date, workoutId, sessionIds } of groups.values()) {
      const workout = MOCK_WORKOUTS.find((w) => w.id === workoutId);
      if (!workout) continue;
      const totalExercises = MOCK_EXERCISES.filter(
        (e) => e.workoutId === workoutId
      ).length;
      const setsCounts = await Promise.all(
        sessionIds.map((id) => db.sets.where('sessionId').equals(id).count())
      );
      const hasAnySets = setsCounts.some((count) => count > 0);

      results.push({
        key: `${date}__${workoutId}`,
        date,
        workout,
        doneCount: sessionIds.length,
        totalCount: totalExercises,
        isComplete: sessionIds.length === totalExercises,
        hasAnySets,
        sessionIds,
      });
    }

    results.sort((a, b) => (a.date < b.date ? 1 : -1));
    return results;
  }, [todayDateString]);

  const handleCheckin = async () => {
    if (!selectedWorkoutId) return;
    const workoutId = Number(selectedWorkoutId);
    const exercises = MOCK_EXERCISES.filter((ex) => ex.workoutId === workoutId);
    try {
      await db.transaction('rw', db.sessions, async () => {
        for (const exercise of exercises) {
          const existing = await db.sessions
            .where({ exerciseId: exercise.id, date: todayDateString })
            .first();
          if (!existing) {
            await db.sessions.add({
              exerciseId: exercise.id,
              date: todayDateString,
            });
          }
        }
      });
      setSelectedWorkoutId('');
    } catch (error) {
      console.error('Erro ao registrar check-in do treino:', error);
    }
  };

  // Só permite remover se nenhum exercício do treino já tiver série
  // registrada nele (pra nunca apagar dado de treino de verdade)
  const handleRemoveCheckin = async (sessionIds) => {
    try {
      await db.sessions.bulkDelete(sessionIds);
    } catch (error) {
      console.error('Erro ao remover check-in:', error);
    }
  };

  return (
    <div className="screen">
      <header className="screen__header">
        <div className="header-left">
          <button onClick={onBack} className="icon-button icon-button--accent">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="screen-title">Check-in</h1>
            <p className="screen-subtitle">
              Hoje, {formatDisplayDate(todayDateString)}
            </p>
          </div>
        </div>
      </header>

      <main className="exercise-body">
        <div className="set-form">
          <h3 className="set-form__title">Hoje você fez qual treino?</h3>
          <div className="checkin-picker">
            <select
              value={selectedWorkoutId}
              onChange={(e) => setSelectedWorkoutId(e.target.value)}
              className="checkin-picker__select"
            >
              <option value="">Selecione um treino</option>
              {MOCK_WORKOUTS.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleCheckin}
              disabled={!selectedWorkoutId}
              className="save-button checkin-picker__button"
            >
              <Check size={18} />
              <span>Check-in</span>
            </button>
          </div>
        </div>

        <div className="today-sets">
          <h4 className="today-sets__title">
            Histórico de Check-ins
            {workoutCheckins ? ` (${workoutCheckins.length})` : ''}
          </h4>

          {(!workoutCheckins || workoutCheckins.length === 0) && (
            <p className="checkin-empty">Nenhum treino registrado ainda.</p>
          )}

          {workoutCheckins &&
            workoutCheckins.map(
              ({
                key,
                date,
                workout,
                doneCount,
                totalCount,
                isComplete,
                hasAnySets,
                sessionIds,
              }) => (
                <div key={key} className="set-row">
                  <span className="checkin-row__check">
                    <ClipboardCheck size={16} />
                  </span>
                  <div className="checkin-row__info">
                    <span className="checkin-row__name">
                      {workout.name} — {formatDisplayDate(date)}
                    </span>
                    {!isComplete && (
                      <span className="checkin-row__partial">
                        {doneCount}/{totalCount} exercícios
                      </span>
                    )}
                  </div>
                  {!hasAnySets && (
                    <button
                      onClick={() => handleRemoveCheckin(sessionIds)}
                      className="set-row__edit-btn"
                      aria-label="Remover check-in"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )
            )}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// ROTEADOR PRINCIPAL (GERENCIA AS TELAS)
// ==========================================
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome | home | workout | exercise | checkin
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    pruneOldHistory();
  }, []);

  // Garante que a tela de boas-vindas tenha uma entrada própria no histórico
  useEffect(() => {
    window.history.replaceState({ screen: 'welcome' }, '');
  }, []);

  // Sincroniza o estado da app com o botão voltar/avançar do NAVEGADOR
  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state || { screen: 'welcome' };

      if (state.screen === 'exercise') {
        const exercise = MOCK_EXERCISES.find((e) => e.id === state.exerciseId);
        const workout = MOCK_WORKOUTS.find((w) => w.id === exercise?.workoutId);
        setSelectedWorkout(workout || null);
        setSelectedExercise(exercise || null);
        setCurrentScreen('exercise');
      } else if (state.screen === 'workout') {
        const workout = MOCK_WORKOUTS.find((w) => w.id === state.workoutId);
        setSelectedWorkout(workout || null);
        setCurrentScreen('workout');
      } else if (state.screen === 'checkin') {
        setCurrentScreen('checkin');
      } else if (state.screen === 'home') {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('welcome');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navegações "para frente" registram uma nova entrada no histórico
  const navigateToWelcome = () => {
    window.history.pushState({ screen: 'welcome' }, '');
    setCurrentScreen('welcome');
  };

  const navigateToHome = () => {
    window.history.pushState({ screen: 'home' }, '');
    setCurrentScreen('home');
  };

  const navigateToCheckin = () => {
    window.history.pushState({ screen: 'checkin' }, '');
    setCurrentScreen('checkin');
  };

  const navigateToWorkout = (workout) => {
    window.history.pushState({ screen: 'workout', workoutId: workout.id }, '');
    setSelectedWorkout(workout);
    setCurrentScreen('workout');
  };

  const navigateToExercise = (exercise) => {
    window.history.pushState(
      { screen: 'exercise', exerciseId: exercise.id },
      ''
    );
    setSelectedExercise(exercise);
    setCurrentScreen('exercise');
  };

  // Voltar usa o histórico real do navegador — assim o botão "voltar"
  // do navegador e o botão "voltar" da app fazem exatamente a mesma coisa
  const navigateBack = () => {
    window.history.back();
  };

  if (currentScreen === 'welcome') {
    return (
      <WelcomeScreen
        onGoToWorkouts={navigateToHome}
        onGoToCheckin={navigateToCheckin}
      />
    );
  }

  if (currentScreen === 'home') {
    return <HomeScreen onSelectWorkout={navigateToWorkout} onBack={navigateBack} />;
  }

  if (currentScreen === 'checkin') {
    return <CheckinScreen onBack={navigateBack} />;
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
    return (
      <ExerciseScreen
        exercise={selectedExercise}
        onBack={navigateBack}
        onGoHome={navigateToWelcome}
      />
    );
  }

  return null;
}
