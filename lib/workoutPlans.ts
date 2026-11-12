/**
 * Free workout plans (/workout-plans). Every plan is built from the EXERCISES catalogue, and
 * everything the pages say about a plan — weekly sets per muscle, session length, which
 * muscle groups are trained how often — is COMPUTED here from that data.
 *
 * `planIssues()` is enforced in generateStaticParams, so a bad edit fails the build:
 *  - every exercise key must exist in EXERCISES,
 *  - a plan may only use the equipment it promises (e.g. the home plan is bodyweight only),
 *  - every NHS major muscle group must be worked on at least 2 days a week,
 *  - a session can't run past the plan's stated maximum.
 *
 * External guidance quoted on the pages (read on the source pages, 2026-11-12):
 *  NHS, Physical activity guidelines for adults aged 19 to 64 —
 *   "do strengthening activities that work all the major muscle groups (legs, hips, back,
 *    abdomen, chest, shoulders and arms) on at least 2 days a week" and
 *   "do at least 150 minutes of moderate intensity activity a week or 75 minutes of vigorous
 *    intensity activity a week".
 *  WHO, Physical activity fact sheet — "all age groups should limit the amount of time being sedentary".
 */

export const WORKOUT_PLANS_BASE = 'https://coachhimanshu.com/workout-plans';
export const NHS_URL = 'https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/';
export const WHO_URL = 'https://www.who.int/news-room/fact-sheets/detail/physical-activity';
export const PLANS_UPDATED = '2026-11-12';

export type Muscle = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core';
export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight';

export const MUSCLE_LABEL: Record<Muscle, string> = {
  chest: 'Chest', back: 'Back', shoulders: 'Shoulders', biceps: 'Biceps', triceps: 'Triceps',
  quads: 'Quads', hamstrings: 'Hamstrings', glutes: 'Glutes', calves: 'Calves', core: 'Core',
};
export const MUSCLES = Object.keys(MUSCLE_LABEL) as Muscle[];

/** The NHS list of major muscle groups, mapped onto our muscles. */
export const NHS_GROUPS: { label: string; muscles: Muscle[] }[] = [
  { label: 'Legs', muscles: ['quads', 'hamstrings', 'calves'] },
  { label: 'Hips', muscles: ['glutes'] },
  { label: 'Back', muscles: ['back'] },
  { label: 'Abdomen', muscles: ['core'] },
  { label: 'Chest', muscles: ['chest'] },
  { label: 'Shoulders', muscles: ['shoulders'] },
  { label: 'Arms', muscles: ['biceps', 'triceps'] },
];

interface ExerciseDef { name: string; equipment: Equipment; primary: Muscle[]; secondary?: Muscle[]; cue: string }

export const EXERCISES = {
  // Lower body
  back_squat: { name: 'Barbell Back Squat', equipment: 'barbell', primary: ['quads', 'glutes'], secondary: ['hamstrings', 'core'], cue: 'Brace, sit between your hips, knees track over toes.' },
  goblet_squat: { name: 'Goblet Squat', equipment: 'dumbbell', primary: ['quads', 'glutes'], secondary: ['core'], cue: 'Hold the dumbbell at your chest, chest up, sit down between your heels.' },
  leg_press: { name: 'Leg Press', equipment: 'machine', primary: ['quads', 'glutes'], secondary: ['hamstrings'], cue: 'Lower until your hips start to tuck, then press through mid-foot.' },
  romanian_deadlift: { name: 'Romanian Deadlift', equipment: 'barbell', primary: ['hamstrings', 'glutes'], secondary: ['back'], cue: 'Push hips back with soft knees, bar close to the legs, flat back.' },
  db_romanian_deadlift: { name: 'Dumbbell Romanian Deadlift', equipment: 'dumbbell', primary: ['hamstrings', 'glutes'], secondary: ['back'], cue: 'Hinge at the hips, dumbbells slide down the thighs, stop when the back wants to round.' },
  hip_thrust: { name: 'Barbell Hip Thrust', equipment: 'barbell', primary: ['glutes'], secondary: ['hamstrings'], cue: 'Upper back on a bench, chin tucked, squeeze glutes hard at the top.' },
  db_hip_thrust: { name: 'Dumbbell Hip Thrust', equipment: 'dumbbell', primary: ['glutes'], secondary: ['hamstrings'], cue: 'Shoulders on a sofa or bed edge, dumbbell on the hips, pause at the top.' },
  walking_lunge: { name: 'Dumbbell Walking Lunge', equipment: 'dumbbell', primary: ['quads', 'glutes'], secondary: ['hamstrings'], cue: 'Long step, back knee to just above the floor, push through the front heel.' },
  bulgarian_split_squat: { name: 'Bulgarian Split Squat', equipment: 'dumbbell', primary: ['quads', 'glutes'], secondary: ['hamstrings'], cue: 'Back foot on a bench, most weight on the front leg, go straight down.' },
  leg_curl: { name: 'Leg Curl (machine)', equipment: 'machine', primary: ['hamstrings'], cue: 'Hips pinned down, curl slowly, control the way back.' },
  leg_extension: { name: 'Leg Extension (machine)', equipment: 'machine', primary: ['quads'], cue: 'Knee lined up with the machine pivot, squeeze at the top.' },
  calf_raise_machine: { name: 'Standing Calf Raise', equipment: 'machine', primary: ['calves'], cue: 'Full stretch at the bottom, pause at the top.' },
  db_calf_raise: { name: 'Dumbbell Calf Raise', equipment: 'dumbbell', primary: ['calves'], cue: 'Balls of the feet on a step, full range, pause at the top.' },
  // Upper body — push
  bench_press: { name: 'Barbell Bench Press', equipment: 'barbell', primary: ['chest'], secondary: ['triceps', 'shoulders'], cue: 'Shoulder blades pinned, bar to lower chest, feet planted.' },
  db_bench_press: { name: 'Dumbbell Bench Press', equipment: 'dumbbell', primary: ['chest'], secondary: ['triceps', 'shoulders'], cue: 'Elbows about 45 degrees from the body, dumbbells to chest level.' },
  incline_db_press: { name: 'Incline Dumbbell Press', equipment: 'dumbbell', primary: ['chest', 'shoulders'], secondary: ['triceps'], cue: 'Bench at 30 degrees, press up and slightly in.' },
  db_floor_press: { name: 'Dumbbell Floor Press', equipment: 'dumbbell', primary: ['chest'], secondary: ['triceps', 'shoulders'], cue: 'Lie on the floor, lower until the upper arms touch, press up.' },
  cable_fly: { name: 'Cable Fly', equipment: 'cable', primary: ['chest'], cue: 'Slight bend in the elbows, hug a big tree, squeeze in the middle.' },
  overhead_press: { name: 'Barbell Overhead Press', equipment: 'barbell', primary: ['shoulders'], secondary: ['triceps', 'core'], cue: 'Squeeze glutes, press the bar up in a straight line past the face.' },
  db_shoulder_press: { name: 'Dumbbell Shoulder Press', equipment: 'dumbbell', primary: ['shoulders'], secondary: ['triceps'], cue: 'Seated or standing, press up without arching the lower back.' },
  lateral_raise: { name: 'Dumbbell Lateral Raise', equipment: 'dumbbell', primary: ['shoulders'], cue: 'Lead with the elbows, stop at shoulder height, light weight.' },
  triceps_pushdown: { name: 'Triceps Pushdown', equipment: 'cable', primary: ['triceps'], cue: 'Elbows pinned to your sides, straighten fully.' },
  db_overhead_triceps: { name: 'Overhead Dumbbell Triceps Extension', equipment: 'dumbbell', primary: ['triceps'], cue: 'Elbows point forward, lower behind the head, straighten up.' },
  // Upper body — pull
  lat_pulldown: { name: 'Lat Pulldown', equipment: 'machine', primary: ['back'], secondary: ['biceps'], cue: 'Chest up, pull the bar to the upper chest, elbows down and back.' },
  pull_up: { name: 'Pull-Up (or assisted)', equipment: 'bodyweight', primary: ['back'], secondary: ['biceps'], cue: 'Full hang to chin over bar; use the assisted machine or a band if needed.' },
  seated_cable_row: { name: 'Seated Cable Row', equipment: 'cable', primary: ['back'], secondary: ['biceps'], cue: 'Tall spine, pull to the belly, squeeze the shoulder blades.' },
  barbell_row: { name: 'Barbell Row', equipment: 'barbell', primary: ['back'], secondary: ['biceps', 'hamstrings'], cue: 'Hinge to about 45 degrees, pull to the lower ribs, no jerking.' },
  one_arm_db_row: { name: 'One-Arm Dumbbell Row', equipment: 'dumbbell', primary: ['back'], secondary: ['biceps'], cue: 'Hand and knee on a bench or chair, pull the dumbbell to the hip.' },
  face_pull: { name: 'Face Pull', equipment: 'cable', primary: ['shoulders'], secondary: ['back'], cue: 'Rope to eye level, pull apart, thumbs point back.' },
  db_reverse_fly: { name: 'Dumbbell Reverse Fly', equipment: 'dumbbell', primary: ['shoulders'], secondary: ['back'], cue: 'Hinge forward, raise the arms out wide, light weight.' },
  db_curl: { name: 'Dumbbell Curl', equipment: 'dumbbell', primary: ['biceps'], cue: 'Elbows still, no swinging, lower slowly.' },
  hammer_curl: { name: 'Hammer Curl', equipment: 'dumbbell', primary: ['biceps'], cue: 'Thumbs up, curl without moving the elbows.' },
  // Core
  plank: { name: 'Plank', equipment: 'bodyweight', primary: ['core'], cue: 'Elbows under shoulders, squeeze glutes, straight line head to heels.' },
  side_plank: { name: 'Side Plank', equipment: 'bodyweight', primary: ['core'], cue: 'Hips high, body in one line, both sides.' },
  dead_bug: { name: 'Dead Bug', equipment: 'bodyweight', primary: ['core'], cue: 'Lower back pressed into the floor, opposite arm and leg reach out slowly.' },
  bird_dog: { name: 'Bird Dog', equipment: 'bodyweight', primary: ['core'], secondary: ['back', 'glutes'], cue: 'On all fours, reach opposite arm and leg, hips stay level.' },
  hanging_knee_raise: { name: 'Hanging Knee Raise', equipment: 'bodyweight', primary: ['core'], cue: 'Hang from a bar, curl the knees up to the chest, no swinging.' },
  mountain_climber: { name: 'Mountain Climber', equipment: 'bodyweight', primary: ['core'], secondary: ['shoulders'], cue: 'Hands under shoulders, drive the knees in at a steady pace.' },
  // Bodyweight
  bodyweight_squat: { name: 'Bodyweight Squat', equipment: 'bodyweight', primary: ['quads', 'glutes'], cue: 'Arms forward, sit down as low as you control, stand tall.' },
  reverse_lunge: { name: 'Reverse Lunge', equipment: 'bodyweight', primary: ['quads', 'glutes'], secondary: ['hamstrings'], cue: 'Step back, back knee to just above the floor, push through the front foot.' },
  step_up: { name: 'Step-Up (stairs)', equipment: 'bodyweight', primary: ['quads', 'glutes'], cue: 'Whole foot on the step, push through that leg, step down slowly.' },
  wall_sit: { name: 'Wall Sit', equipment: 'bodyweight', primary: ['quads'], cue: 'Back flat on the wall, thighs about parallel to the floor.' },
  glute_bridge: { name: 'Glute Bridge', equipment: 'bodyweight', primary: ['glutes'], secondary: ['hamstrings'], cue: 'Feet flat, push through the heels, squeeze at the top.' },
  single_leg_glute_bridge: { name: 'Single-Leg Glute Bridge', equipment: 'bodyweight', primary: ['glutes'], secondary: ['hamstrings'], cue: 'One foot down, other knee to chest, hips stay level.' },
  calf_raise: { name: 'Calf Raise', equipment: 'bodyweight', primary: ['calves'], cue: 'On a step edge if you can, full range, slow.' },
  push_up: { name: 'Push-Up (incline if needed)', equipment: 'bodyweight', primary: ['chest'], secondary: ['triceps', 'shoulders', 'core'], cue: 'Body in one line; hands on a table or bed edge to make it easier.' },
  pike_push_up: { name: 'Pike Push-Up', equipment: 'bodyweight', primary: ['shoulders'], secondary: ['triceps'], cue: 'Hips high in an upside-down V, lower the head between the hands.' },
  chair_dip: { name: 'Chair Dip', equipment: 'bodyweight', primary: ['triceps'], secondary: ['chest', 'shoulders'], cue: 'Sturdy chair, elbows point back, stop if the shoulders pinch.' },
  superman: { name: 'Superman Hold', equipment: 'bodyweight', primary: ['back'], secondary: ['glutes'], cue: 'Lie face down, lift arms and legs a little, hold 2 seconds each rep.' },
  reverse_snow_angel: { name: 'Reverse Snow Angel', equipment: 'bodyweight', primary: ['back'], secondary: ['shoulders'], cue: 'Face down, arms hover, sweep from the hips to overhead and back.' },
} satisfies Record<string, ExerciseDef>;
export type ExerciseKey = keyof typeof EXERCISES;

export interface PlanItem { ex: ExerciseKey; sets: number; reps: string; restSec: number; timedSec?: number; note?: string }
export interface PlanDay { label: string; weekday: string; focus: string; items?: PlanItem[]; cardio?: string }
export interface WorkoutPlan {
  slug: string;
  name: string;            // short label for links
  h1: string;
  metaTitle: string;
  keywords: string[];
  level: 'Beginner' | 'Beginner to intermediate' | 'Intermediate';
  goal: string;
  where: 'Gym' | 'Home';
  equipment: Equipment[];  // allowed equipment — enforced
  maxMinutes: number;      // promised upper bound per session — enforced
  forWho: string;
  why: string;             // why this structure (coaching reasoning, no claims about clients)
  progression: 'load' | 'bodyweight';
  days: PlanDay[];
  extraFaqs: { question: string; answer: string }[];
  blogs: string[];         // live blog slugs (checked against the DB)
  coachingGoal?: string;   // /online-personal-trainer/for/<goal>
}

const r = (ex: ExerciseKey, sets: number, reps: string, restSec: number, extra: Partial<PlanItem> = {}): PlanItem => ({ ex, sets, reps, restSec, ...extra });

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    slug: 'beginner-gym-workout-plan',
    name: 'Beginner gym plan (3 days)',
    h1: 'Beginner Gym Workout Plan: 3 Days a Week, Full Body',
    metaTitle: 'Beginner Gym Workout Plan (3 Days, Full Body)',
    keywords: ['beginner gym workout plan', 'gym workout plan for beginners', 'full body workout plan', '3 day workout plan', 'gym schedule for beginners'],
    level: 'Beginner',
    goal: 'Learn the main lifts, build a base of strength and muscle',
    where: 'Gym',
    equipment: ['dumbbell', 'machine', 'cable', 'bodyweight', 'barbell'],
    maxMinutes: 60,
    forWho: 'Anyone new to the gym, or coming back after a long break, who can train 3 days a week.',
    why: 'Three full-body days let you practise every movement pattern three times a week, which is how a beginner gets good at lifting fastest. Machines and dumbbells come first because they are easier to learn safely than heavy barbell lifts.',
    progression: 'load',
    days: [
      { label: 'Day 1', weekday: 'Monday', focus: 'Full body A', items: [
        r('goblet_squat', 3, '8–12', 90), r('db_bench_press', 3, '8–12', 90), r('lat_pulldown', 3, '10–12', 75),
        r('db_romanian_deadlift', 3, '10–12', 90), r('plank', 3, '20–40 s', 45, { timedSec: 30 }),
      ] },
      { label: 'Day 2', weekday: 'Wednesday', focus: 'Full body B', items: [
        r('leg_press', 3, '10–12', 90), r('db_shoulder_press', 3, '8–12', 90), r('seated_cable_row', 3, '10–12', 75),
        r('hip_thrust', 3, '10–12', 75), r('dead_bug', 3, '8 each side', 45),
      ] },
      { label: 'Day 3', weekday: 'Friday', focus: 'Full body C', items: [
        r('walking_lunge', 3, '8 each leg', 90), r('incline_db_press', 3, '8–12', 90), r('one_arm_db_row', 3, '10–12 each side', 60),
        r('leg_curl', 3, '10–15', 60), r('triceps_pushdown', 2, '12–15', 45), r('db_curl', 2, '12–15', 45), r('calf_raise_machine', 2, '12–15', 45),
      ] },
    ],
    extraFaqs: [
      { question: 'Should a beginner do a full body or a split routine?', answer: 'Full body, three days a week, is the simplest start: each muscle gets worked three times and you practise every lift often. A split such as upper/lower makes more sense once you can train four days and your sessions are getting long.' },
      { question: 'What weight should I start with?', answer: 'Pick a weight you can lift for the bottom of the rep range with 2 or 3 reps left in the tank and clean form. The first two weeks are for learning the movements, not for testing your limits.' },
    ],
    blogs: ['muscle-confusion-is-a-myth-why-progressive-overload-actually-builds-muscle', 'how-much-protein-per-day-indian-guide-to-muscle-fat-loss', 'soft-tissue-injury-the-silent-damage-behind-most-gym-injuries'],
    coachingGoal: 'beginners',
  },
  {
    slug: 'upper-lower-split-workout-plan',
    name: 'Upper/lower split (4 days)',
    h1: 'Upper Lower Split Workout Plan: 4 Days a Week',
    metaTitle: 'Upper Lower Split Workout Plan (4 Day Split)',
    keywords: ['upper lower split', '4 day workout split', '4 day gym workout plan', 'upper lower workout plan', 'intermediate workout plan'],
    level: 'Beginner to intermediate',
    goal: 'Build muscle and strength with each muscle trained twice a week',
    where: 'Gym',
    equipment: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight'],
    maxMinutes: 75,
    forWho: 'People with 3 to 6 months of steady training who can now give the gym 4 days a week.',
    why: 'Splitting upper and lower body means each session has room for more sets per muscle while still training everything twice a week. Heavy compound lifts open each day; lighter accessory work follows.',
    progression: 'load',
    days: [
      { label: 'Day 1', weekday: 'Monday', focus: 'Upper A (strength)', items: [
        r('bench_press', 4, '6–8', 120), r('barbell_row', 4, '6–8', 120), r('db_shoulder_press', 3, '8–10', 90),
        r('lat_pulldown', 3, '10–12', 75), r('triceps_pushdown', 2, '10–12', 60), r('db_curl', 2, '10–12', 60),
      ] },
      { label: 'Day 2', weekday: 'Tuesday', focus: 'Lower A (strength)', items: [
        r('back_squat', 4, '6–8', 150), r('romanian_deadlift', 3, '8–10', 120), r('bulgarian_split_squat', 3, '8–10 each leg', 90),
        r('leg_curl', 3, '10–12', 60), r('calf_raise_machine', 3, '10–15', 60), r('plank', 3, '30–45 s', 45, { timedSec: 40 }),
      ] },
      { label: 'Day 3', weekday: 'Thursday', focus: 'Upper B (volume)', items: [
        r('incline_db_press', 3, '8–10', 90), r('pull_up', 3, '6–10', 120), r('seated_cable_row', 3, '10–12', 75),
        r('cable_fly', 2, '12–15', 60), r('lateral_raise', 3, '12–15', 45), r('db_overhead_triceps', 2, '10–12', 60), r('hammer_curl', 2, '10–12', 60),
      ] },
      { label: 'Day 4', weekday: 'Friday', focus: 'Lower B (volume)', items: [
        r('leg_press', 3, '10–12', 90), r('hip_thrust', 3, '8–12', 90), r('walking_lunge', 2, '10 each leg', 90),
        r('leg_extension', 2, '12–15', 60), r('calf_raise_machine', 3, '12–15', 45), r('hanging_knee_raise', 3, '8–12', 60),
      ] },
    ],
    extraFaqs: [
      { question: 'Can I do the upper lower split 3 days a week?', answer: 'Yes: rotate through the four days in order, so week one is Upper A, Lower A, Upper B and week two starts with Lower B. Each muscle is then trained about 1.5 times a week instead of twice, so progress is a little slower.' },
      { question: 'Is upper lower better than push pull legs?', answer: 'Neither is better on its own. Upper/lower fits 4 days a week; push/pull/legs fits 3 or 6. Pick the one that matches how many days you can actually train every week.' },
    ],
    blogs: ['the-ultimate-structured-training-model-for-strength-muscle-growth-endurance', 'muscle-recovery-guide-nutrition-sleep-supplements-for-faster-growth', 'best-diet-plan-for-muscle-building-in-india'],
    coachingGoal: 'muscle-gain',
  },
  {
    slug: 'push-pull-legs-workout-plan',
    name: 'Push pull legs (6 days)',
    h1: 'Push Pull Legs Workout Plan: 6-Day PPL Split',
    metaTitle: 'Push Pull Legs Workout Plan (6-Day PPL Split)',
    keywords: ['push pull legs', 'ppl workout plan', 'push pull legs split', '6 day workout plan', 'ppl routine'],
    level: 'Intermediate',
    goal: 'Maximise muscle growth with high weekly volume',
    where: 'Gym',
    equipment: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight'],
    maxMinutes: 75,
    forWho: 'Lifters with at least 6 to 12 months of consistent training, good recovery and time to train 6 days a week.',
    why: 'Grouping pushing muscles, pulling muscles and legs means each day hits related muscles hard, and running the cycle twice a week trains everything twice. It is a lot of volume, so it suits people whose sleep and diet are already in order.',
    progression: 'load',
    days: [
      { label: 'Day 1', weekday: 'Monday', focus: 'Push A', items: [
        r('bench_press', 4, '6–8', 150), r('overhead_press', 3, '6–8', 120), r('incline_db_press', 3, '8–10', 90),
        r('lateral_raise', 3, '12–15', 45), r('triceps_pushdown', 3, '10–12', 60),
      ] },
      { label: 'Day 2', weekday: 'Tuesday', focus: 'Pull A', items: [
        r('barbell_row', 4, '6–8', 120), r('pull_up', 3, '6–10', 120), r('seated_cable_row', 3, '10–12', 75),
        r('face_pull', 3, '12–15', 45), r('db_curl', 3, '10–12', 60),
      ] },
      { label: 'Day 3', weekday: 'Wednesday', focus: 'Legs A', items: [
        r('back_squat', 4, '6–8', 150), r('romanian_deadlift', 3, '8–10', 120), r('leg_press', 3, '10–12', 90),
        r('leg_curl', 3, '10–12', 60), r('calf_raise_machine', 3, '10–15', 45),
      ] },
      { label: 'Day 4', weekday: 'Thursday', focus: 'Push B', items: [
        r('db_shoulder_press', 3, '8–10', 90), r('db_bench_press', 3, '8–10', 90), r('cable_fly', 3, '12–15', 60),
        r('lateral_raise', 3, '12–15', 45), r('db_overhead_triceps', 3, '10–12', 60),
      ] },
      { label: 'Day 5', weekday: 'Friday', focus: 'Pull B', items: [
        r('lat_pulldown', 3, '10–12', 75), r('one_arm_db_row', 3, '8–10 each side', 75), r('face_pull', 3, '12–15', 45),
        r('hammer_curl', 3, '10–12', 60), r('hanging_knee_raise', 3, '8–12', 60),
      ] },
      { label: 'Day 6', weekday: 'Saturday', focus: 'Legs B', items: [
        r('hip_thrust', 3, '8–12', 90), r('bulgarian_split_squat', 3, '8–10 each leg', 90), r('leg_extension', 3, '12–15', 60),
        r('leg_curl', 3, '12–15', 60), r('calf_raise_machine', 3, '12–15', 45), r('plank', 3, '30–45 s', 45, { timedSec: 40 }),
      ] },
    ],
    extraFaqs: [
      { question: 'Can I do push pull legs 3 days a week?', answer: 'Yes. Do Push A, Pull A and Legs A one week and the B days the next. Each muscle is then trained once a week, so add a set to the main lifts and expect slower progress than the 6-day version.' },
      { question: 'Is a 6-day split too much?', answer: 'For a beginner, usually yes. It works when you sleep 7 hours or more, eat enough protein and can still add reps or weight most weeks. If your lifts stall and you feel run down, drop to the 4-day upper/lower plan.' },
    ],
    blogs: ['the-ultimate-structured-training-model-for-strength-muscle-growth-endurance', 'creatine-for-beginners-complete-guide-for-indians', 'muscle-recovery-guide-nutrition-sleep-supplements-for-faster-growth'],
    coachingGoal: 'muscle-gain',
  },
  {
    slug: '5-day-gym-workout-plan',
    name: '5-day gym plan',
    h1: '5 Day Gym Workout Plan: Upper, Lower, Push, Pull, Legs',
    metaTitle: '5 Day Gym Workout Plan (Weekly Schedule)',
    keywords: ['5 day workout plan', '5 day gym workout plan', '5 day workout split', 'weekly gym schedule', 'gym workout plan for men'],
    level: 'Intermediate',
    goal: 'Build muscle with weekends free',
    where: 'Gym',
    equipment: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight'],
    maxMinutes: 75,
    forWho: 'Intermediate lifters who like 5 sessions a week and want Wednesday and Sunday off.',
    why: 'Two heavier days (upper, lower) early in the week and a push, pull, legs block after a rest day train every muscle twice in 5 sessions, with shoulders and arms getting extra direct work on the second pass.',
    progression: 'load',
    days: [
      { label: 'Day 1', weekday: 'Monday', focus: 'Upper', items: [
        r('bench_press', 4, '6–8', 150), r('barbell_row', 4, '6–8', 120), r('db_shoulder_press', 3, '8–10', 90),
        r('lat_pulldown', 3, '10–12', 75), r('db_curl', 2, '10–12', 60), r('triceps_pushdown', 2, '10–12', 60),
      ] },
      { label: 'Day 2', weekday: 'Tuesday', focus: 'Lower', items: [
        r('back_squat', 4, '6–8', 150), r('romanian_deadlift', 3, '8–10', 120), r('walking_lunge', 2, '10 each leg', 90),
        r('leg_curl', 3, '10–12', 60), r('calf_raise_machine', 3, '10–15', 45), r('plank', 3, '30–45 s', 45, { timedSec: 40 }),
      ] },
      { label: 'Day 3', weekday: 'Thursday', focus: 'Push', items: [
        r('incline_db_press', 4, '8–10', 90), r('cable_fly', 3, '12–15', 60), r('lateral_raise', 4, '12–15', 45),
        r('db_overhead_triceps', 3, '10–12', 60), r('triceps_pushdown', 2, '12–15', 45),
      ] },
      { label: 'Day 4', weekday: 'Friday', focus: 'Pull', items: [
        r('pull_up', 4, '6–10', 120), r('seated_cable_row', 3, '10–12', 75), r('face_pull', 3, '12–15', 45),
        r('hammer_curl', 3, '10–12', 60), r('db_curl', 2, '12–15', 45), r('hanging_knee_raise', 3, '8–12', 60),
      ] },
      { label: 'Day 5', weekday: 'Saturday', focus: 'Legs', items: [
        r('leg_press', 4, '10–12', 90), r('hip_thrust', 3, '8–12', 90), r('leg_extension', 3, '12–15', 60),
        r('leg_curl', 3, '12–15', 60), r('calf_raise_machine', 3, '12–15', 45),
      ] },
    ],
    extraFaqs: [
      { question: 'Which days should be rest days on a 5 day split?', answer: 'This plan rests on Wednesday and Sunday so you never train more than three days in a row. If your week is different, keep at least one rest day between Lower and Legs.' },
    ],
    blogs: ['best-diet-plan-for-muscle-building-in-india', 'indian-vegetarian-bodybuilding-complete-protein-and-workout-guide', 'how-much-sleep-do-you-need-for-weight-loss-muscle'],
    coachingGoal: 'muscle-gain',
  },
  {
    slug: 'home-workout-plan-without-equipment',
    name: 'Home workout, no equipment',
    h1: 'Home Workout Plan Without Equipment: 3 Days a Week',
    metaTitle: 'Home Workout Plan Without Equipment (Beginners)',
    keywords: ['home workout plan', 'home workout without equipment', 'workout at home for beginners', 'bodyweight workout plan', 'no equipment workout plan'],
    level: 'Beginner',
    goal: 'Get stronger and fitter at home with only your bodyweight',
    where: 'Home',
    equipment: ['bodyweight'],
    maxMinutes: 45,
    forWho: 'Beginners who want to start at home, travel often, or have no gym nearby. You need a floor, a wall, a sturdy chair and a staircase.',
    why: 'Each day mixes a squat or lunge, a push, a hip exercise, a back exercise and core work, so every major muscle group is covered twice or more a week. The honest gap is pulling: without a bar or band there is no true row or pull-up, so the back work here is lighter. A resistance band is the cheapest fix.',
    progression: 'bodyweight',
    days: [
      { label: 'Day 1', weekday: 'Monday', focus: 'Full body A', items: [
        r('bodyweight_squat', 3, '12–20', 60), r('push_up', 3, '6–15', 60), r('glute_bridge', 3, '12–20', 45),
        r('superman', 3, '10–12', 45), r('plank', 3, '20–40 s', 45, { timedSec: 30 }),
      ] },
      { label: 'Day 2', weekday: 'Wednesday', focus: 'Full body B', items: [
        r('reverse_lunge', 3, '8–12 each leg', 60), r('pike_push_up', 3, '6–10', 60), r('single_leg_glute_bridge', 3, '8–12 each leg', 45),
        r('reverse_snow_angel', 3, '10–12', 45), r('side_plank', 3, '20–30 s each side', 45, { timedSec: 50 }), r('calf_raise', 3, '15–25', 30),
      ] },
      { label: 'Day 3', weekday: 'Friday', focus: 'Full body C', items: [
        r('step_up', 3, '10–12 each leg', 60), r('push_up', 3, '6–15', 60), r('chair_dip', 3, '8–12', 60),
        r('wall_sit', 3, '30–45 s', 45, { timedSec: 40 }), r('bird_dog', 3, '8 each side', 30), r('mountain_climber', 3, '20–30 s', 45, { timedSec: 25 }),
      ] },
    ],
    extraFaqs: [
      { question: 'Can you build muscle at home without equipment?', answer: 'A beginner can, as long as the exercises keep getting harder: more reps, slower lowering, then harder versions such as moving from incline to floor push-ups. After a few months most people need added load, like a resistance band or dumbbells, to keep progressing.' },
      { question: 'How do I train my back at home without equipment?', answer: 'This plan uses superman holds, reverse snow angels and bird dogs. They train the back muscles but cannot load them like rows. A resistance band tied to a door anchor gives you real rows and pulldowns for very little money.' },
    ],
    blogs: ['top-10-home-workout-exercises-for-beginners-in-india', 'home-workouts-with-resistance-bands-the-complete-guide-to-building-strength-anywhere', 'how-to-lose-weight-without-going-to-the-gym'],
    coachingGoal: 'beginners',
  },
  {
    slug: 'dumbbell-workout-plan-at-home',
    name: 'Dumbbell-only home plan (4 days)',
    h1: 'Dumbbell Workout Plan at Home: 4 Days, Upper and Lower',
    metaTitle: 'Dumbbell Only Workout Plan at Home (4 Days)',
    keywords: ['dumbbell workout plan', 'dumbbell only workout', 'home workout with dumbbells', 'dumbbell workout at home', 'home gym workout plan'],
    level: 'Beginner to intermediate',
    goal: 'Build muscle at home with a pair of adjustable dumbbells',
    where: 'Home',
    equipment: ['dumbbell', 'bodyweight'],
    maxMinutes: 60,
    forWho: 'People with a pair of dumbbells (ideally adjustable) and a sturdy chair or sofa, training 4 days a week.',
    why: 'Dumbbells cover every movement pattern if you pick exercises that load the muscles from the right angle: floor press instead of a bench, one-arm rows on a chair, split squats and hip thrusts for legs. An upper/lower split trains everything twice a week.',
    progression: 'load',
    days: [
      { label: 'Day 1', weekday: 'Monday', focus: 'Upper A', items: [
        r('db_floor_press', 4, '8–12', 90), r('one_arm_db_row', 4, '8–12 each side', 75), r('db_shoulder_press', 3, '8–12', 75),
        r('db_curl', 3, '10–12', 45), r('db_overhead_triceps', 3, '10–12', 45),
      ] },
      { label: 'Day 2', weekday: 'Tuesday', focus: 'Lower A', items: [
        r('goblet_squat', 4, '10–15', 90), r('db_romanian_deadlift', 4, '10–12', 90), r('walking_lunge', 3, '10 each leg', 75),
        r('db_calf_raise', 3, '12–20', 45), r('plank', 3, '30–45 s', 45, { timedSec: 40 }),
      ] },
      { label: 'Day 3', weekday: 'Thursday', focus: 'Upper B', items: [
        r('push_up', 3, '8–20', 60), r('one_arm_db_row', 3, '10–12 each side', 60), r('db_reverse_fly', 3, '12–15', 45),
        r('lateral_raise', 3, '12–15', 45), r('hammer_curl', 3, '10–12', 45), r('chair_dip', 2, '8–12', 60),
      ] },
      { label: 'Day 4', weekday: 'Friday', focus: 'Lower B', items: [
        r('bulgarian_split_squat', 3, '8–12 each leg', 75), r('db_hip_thrust', 3, '10–15', 75), r('db_romanian_deadlift', 3, '10–12', 75),
        r('db_calf_raise', 3, '12–20', 45), r('dead_bug', 3, '8 each side', 45),
      ] },
    ],
    extraFaqs: [
      { question: 'What dumbbell weight should I buy?', answer: 'Adjustable dumbbells are the best value because legs and back soon need far more weight than arms and shoulders. If you buy fixed pairs, get a light pair for raises and arms and a heavier pair for squats, rows and presses.' },
      { question: 'Can I build muscle with only dumbbells?', answer: 'Yes, for a long time, as long as you keep adding reps or weight. Legs are the first to outgrow light dumbbells; slower reps and single-leg exercises like the split squat buy you time before you need heavier ones.' },
    ],
    blogs: ['how-to-build-a-home-gym-in-india-under-rs-10-000', 'home-workouts-with-resistance-bands-the-complete-guide-to-building-strength-anywhere', 'how-much-protein-per-day-indian-guide-to-muscle-fat-loss'],
    coachingGoal: 'muscle-gain',
  },
  {
    slug: 'gym-workout-plan-for-women',
    name: 'Gym plan for women (3 days)',
    h1: 'Gym Workout Plan for Women: 3 Days, Full Body',
    metaTitle: 'Gym Workout Plan for Women (3 Days a Week)',
    keywords: ['gym workout plan for women', 'workout plan for women', 'female gym workout plan', 'weight training for women', 'glute workout plan'],
    level: 'Beginner to intermediate',
    goal: 'Get stronger and build shape, with extra work for glutes and legs',
    where: 'Gym',
    equipment: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight'],
    maxMinutes: 60,
    forWho: 'Women who want a straightforward 3-day gym plan, from first-timers to those with a few months of lifting.',
    why: 'The training principles are the same for women and men. This version simply spends more of the weekly sets on glutes and legs, a common goal, while still training the upper body twice or more a week. Swap the emphasis if your goals differ.',
    progression: 'load',
    days: [
      { label: 'Day 1', weekday: 'Monday', focus: 'Full body, squat focus', items: [
        r('goblet_squat', 3, '10–12', 90), r('hip_thrust', 3, '8–12', 90), r('db_bench_press', 3, '8–12', 75),
        r('lat_pulldown', 3, '10–12', 75), r('dead_bug', 3, '8 each side', 45),
      ] },
      { label: 'Day 2', weekday: 'Wednesday', focus: 'Full body, hinge focus', items: [
        r('db_romanian_deadlift', 3, '10–12', 90), r('bulgarian_split_squat', 3, '8–10 each leg', 75), r('db_shoulder_press', 3, '8–12', 75),
        r('seated_cable_row', 3, '10–12', 75), r('plank', 3, '20–40 s', 45, { timedSec: 30 }),
      ] },
      { label: 'Day 3', weekday: 'Friday', focus: 'Full body, glute focus', items: [
        r('leg_press', 3, '10–15', 90), r('hip_thrust', 3, '10–12', 75), r('leg_curl', 3, '10–15', 60),
        r('incline_db_press', 3, '8–12', 75), r('one_arm_db_row', 3, '10–12 each side', 60), r('lateral_raise', 2, '12–15', 45),
      ] },
    ],
    extraFaqs: [
      { question: 'Will lifting weights make women bulky?', answer: 'No. Building large, visible muscle takes years of hard training and eating in a calorie surplus. On a normal diet, lifting makes most women look leaner and firmer and makes everyday tasks easier.' },
      { question: 'Can I follow this plan during my period?', answer: 'Usually yes. Train as normal if you feel fine; on days with heavy cramps or fatigue, drop a set from each exercise or swap the session for a walk. If periods are very painful or irregular, speak to a doctor.' },
    ],
    blogs: ['pcos-strength-training-the-most-underrated-solution-for-hormonal-balance', 'plank-exercise-explained-benefits-muscles-worked-proper-form', 'how-much-protein-per-day-indian-guide-to-muscle-fat-loss'],
    coachingGoal: 'toning',
  },
  {
    slug: 'fat-loss-workout-plan',
    name: 'Fat loss workout plan',
    h1: 'Fat Loss Workout Plan: 4 Strength Days + 2 Cardio Days',
    metaTitle: 'Fat Loss Workout Plan (Gym, 4 + 2 Days)',
    keywords: ['fat loss workout plan', 'weight loss workout plan', 'gym workout for weight loss', 'workout plan to lose belly fat', 'fat burning workout'],
    level: 'Beginner to intermediate',
    goal: 'Lose fat while keeping muscle',
    where: 'Gym',
    equipment: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight'],
    maxMinutes: 60,
    forWho: 'Anyone whose main goal is fat loss and who can train 4 days a week plus 2 short cardio sessions.',
    why: 'Fat loss comes mostly from eating fewer calories than you burn; training decides whether the weight you lose is fat or muscle. Strength work keeps the muscle, and the cardio days plus daily walking add to the calories you burn. Spot reduction does not work: no exercise burns belly fat specifically.',
    progression: 'load',
    days: [
      { label: 'Day 1', weekday: 'Monday', focus: 'Upper A', items: [
        r('db_bench_press', 3, '8–12', 75), r('lat_pulldown', 3, '10–12', 75), r('db_shoulder_press', 3, '8–12', 75),
        r('seated_cable_row', 3, '10–12', 60), r('plank', 3, '30–45 s', 45, { timedSec: 40 }),
      ] },
      { label: 'Day 2', weekday: 'Tuesday', focus: 'Lower A', items: [
        r('goblet_squat', 3, '8–12', 90), r('db_romanian_deadlift', 3, '10–12', 90), r('walking_lunge', 2, '10 each leg', 75),
        r('leg_curl', 2, '10–15', 60), r('calf_raise_machine', 2, '12–15', 45),
      ] },
      { label: 'Cardio', weekday: 'Wednesday', focus: 'Cardio', cardio: '30–40 min brisk walk, incline treadmill walk or cycling at a pace where you can talk but not sing' },
      { label: 'Day 3', weekday: 'Thursday', focus: 'Upper B', items: [
        r('incline_db_press', 3, '8–12', 75), r('one_arm_db_row', 3, '10–12 each side', 60), r('lateral_raise', 2, '12–15', 45),
        r('triceps_pushdown', 2, '10–15', 45), r('db_curl', 2, '10–15', 45), r('dead_bug', 3, '8 each side', 45),
      ] },
      { label: 'Day 4', weekday: 'Friday', focus: 'Lower B', items: [
        r('leg_press', 3, '10–12', 90), r('hip_thrust', 3, '8–12', 75), r('bulgarian_split_squat', 2, '8–10 each leg', 75),
        r('leg_extension', 2, '12–15', 45), r('hanging_knee_raise', 2, '8–12', 60),
      ] },
      { label: 'Cardio', weekday: 'Saturday', focus: 'Cardio', cardio: '30–40 min of the same, or a sport you enjoy (badminton, swimming, a long walk)' },
    ],
    extraFaqs: [
      { question: 'Is cardio or weights better for fat loss?', answer: 'You want both, plus a calorie deficit. Weights protect your muscle while you lose weight; cardio and daily walking raise the calories you burn. Diet sets the pace of fat loss more than either.' },
      { question: 'Can I lose belly fat with exercise?', answer: 'Not from one area on purpose. Ab exercises strengthen the core but do not burn the fat over it. Belly fat comes off as your overall body fat drops, which needs a steady calorie deficit.' },
    ],
    blogs: ['how-to-lose-weight-without-going-to-the-gym', 'how-much-sleep-do-you-need-for-weight-loss-muscle', 'how-much-protein-per-day-indian-guide-to-muscle-fat-loss'],
    coachingGoal: 'weight-loss',
  },
];

export const BLOG_TITLES: Record<string, string> = {
  'best-diet-plan-for-muscle-building-in-india': 'Best Diet Plan for Muscle Building in India',
  'creatine-for-beginners-complete-guide-for-indians': 'Creatine for Beginners: Complete Guide for Indians',
  'home-workouts-with-resistance-bands-the-complete-guide-to-building-strength-anywhere': 'Home Workouts with Resistance Bands',
  'how-much-protein-per-day-indian-guide-to-muscle-fat-loss': 'How Much Protein Per Day? Indian Guide',
  'how-much-sleep-do-you-need-for-weight-loss-muscle': 'How Much Sleep Do You Need for Weight Loss & Muscle?',
  'how-to-build-a-home-gym-in-india-under-rs-10-000': 'How to Build a Home Gym in India Under Rs 10,000',
  'how-to-lose-weight-without-going-to-the-gym': 'How to Lose Weight Without Going to the Gym',
  'indian-vegetarian-bodybuilding-complete-protein-and-workout-guide': 'Indian Vegetarian Bodybuilding Guide',
  'muscle-confusion-is-a-myth-why-progressive-overload-actually-builds-muscle': 'Why Progressive Overload Builds Muscle',
  'muscle-recovery-guide-nutrition-sleep-supplements-for-faster-growth': 'Muscle Recovery Guide',
  'pcos-strength-training-the-most-underrated-solution-for-hormonal-balance': 'PCOS & Strength Training',
  'plank-exercise-explained-benefits-muscles-worked-proper-form': 'Plank Exercise Explained',
  'soft-tissue-injury-the-silent-damage-behind-most-gym-injuries': 'Soft Tissue Injury: Avoiding Gym Injuries',
  'the-ultimate-structured-training-model-for-strength-muscle-growth-endurance': 'Structured Training for Strength & Muscle',
  'top-10-home-workout-exercises-for-beginners-in-india': 'Top 10 Home Workout Exercises for Beginners',
};

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ---------------------------------------------------------------------------
// Computations
// ---------------------------------------------------------------------------
export const ex = (k: ExerciseKey): ExerciseDef => EXERCISES[k] as ExerciseDef;
export const strengthDays = (p: WorkoutPlan) => p.days.filter((d) => d.items?.length);
export const cardioDays = (p: WorkoutPlan) => p.days.filter((d) => d.cardio);

const WARMUP_MIN = 8;
const WORK_SEC = 45; // a rep-based set, including setting up

/** Estimated minutes for a session: warm-up + every set's work and rest + changeover between exercises. */
export function sessionMinutes(day: PlanDay): number {
  if (!day.items) return 0;
  let sec = WARMUP_MIN * 60;
  for (const it of day.items) {
    const work = it.timedSec ?? WORK_SEC;
    sec += it.sets * work + (it.sets - 1) * it.restSec + 60;
  }
  return Math.round(sec / 60);
}
export function sessionRange(p: WorkoutPlan) {
  const mins = strengthDays(p).map(sessionMinutes);
  return { min: Math.min(...mins), max: Math.max(...mins) };
}

/** Weekly sets per muscle: a primary muscle counts the full set, a secondary one half. */
export function weeklySets(p: WorkoutPlan): Record<Muscle, number> {
  const out = Object.fromEntries(MUSCLES.map((m) => [m, 0])) as Record<Muscle, number>;
  for (const d of strengthDays(p)) for (const it of d.items!) {
    const e = ex(it.ex);
    for (const m of e.primary) out[m] += it.sets;
    for (const m of e.secondary ?? []) out[m] += it.sets / 2;
  }
  for (const m of MUSCLES) out[m] = Math.round(out[m] * 2) / 2;
  return out;
}

/** How many days a week each NHS major muscle group is worked (primary or secondary). */
export function nhsGroupDays(p: WorkoutPlan) {
  return NHS_GROUPS.map((g) => ({
    label: g.label,
    days: strengthDays(p).filter((d) => d.items!.some((it) => {
      const e = ex(it.ex);
      return [...e.primary, ...(e.secondary ?? [])].some((m) => g.muscles.includes(m));
    })).length,
  }));
}

export const totalWeeklySets = (p: WorkoutPlan) => strengthDays(p).reduce((a, d) => a + d.items!.reduce((b, it) => b + it.sets, 0), 0);
export const equipmentUsed = (p: WorkoutPlan) => Array.from(new Set(strengthDays(p).flatMap((d) => d.items!.map((it) => ex(it.ex).equipment))));

const EQUIP_LABEL: Record<Equipment, string> = { barbell: 'barbell', dumbbell: 'dumbbells', machine: 'machines', cable: 'cable station', bodyweight: 'bodyweight' };
export const equipmentLabel = (p: WorkoutPlan) => equipmentUsed(p).map((e) => EQUIP_LABEL[e]).join(', ');

export function planIssues(): string[] {
  const issues: string[] = [];
  const slugs = new Set<string>();
  for (const p of WORKOUT_PLANS) {
    if (slugs.has(p.slug)) issues.push(`${p.slug}: duplicate slug`);
    slugs.add(p.slug);
    for (const d of p.days) {
      if (!WEEKDAYS.includes(d.weekday)) issues.push(`${p.slug} ${d.label}: bad weekday ${d.weekday}`);
      for (const it of d.items ?? []) {
        if (!(it.ex in EXERCISES)) { issues.push(`${p.slug} ${d.label}: unknown exercise ${it.ex}`); continue; }
        const e = ex(it.ex);
        if (!p.equipment.includes(e.equipment)) issues.push(`${p.slug} ${d.label}: ${e.name} needs ${e.equipment}, plan allows ${p.equipment.join('/')}`);
      }
      if (d.items && sessionMinutes(d) > p.maxMinutes) issues.push(`${p.slug} ${d.label}: ~${sessionMinutes(d)} min, over the ${p.maxMinutes} min promise`);
    }
    if (new Set(p.days.map((d) => d.weekday)).size !== p.days.length) issues.push(`${p.slug}: two sessions on one weekday`);
    for (const g of nhsGroupDays(p)) if (g.days < 2) issues.push(`${p.slug}: ${g.label} worked on ${g.days} day(s), NHS asks for at least 2`);
    for (const b of p.blogs) if (!BLOG_TITLES[b]) issues.push(`${p.slug}: blog ${b} has no title (check it is live)`);
  }
  return issues;
}

export const getWorkoutPlan = (slug: string) => WORKOUT_PLANS.find((p) => p.slug === slug);

export function planFaqs(p: WorkoutPlan): { question: string; answer: string }[] {
  const s = sessionRange(p);
  const n = strengthDays(p).length;
  const c = cardioDays(p).length;
  const mins = s.min === s.max ? `about ${s.min} minutes` : `about ${s.min} to ${s.max} minutes`;
  const progress = p.progression === 'load'
    ? 'Use double progression: stay at one weight until you reach the top of the rep range on every set with good form, then add the smallest jump available (2.5 kg on a barbell, 1 to 2 kg per dumbbell) and work back up the range.'
    : 'Add reps until you reach the top of the range on every set. Then make the exercise harder: lower more slowly (3 seconds down), pause at the hardest point, or move to a harder version, such as from incline to floor push-ups.';
  return [
    { question: 'How many days a week does this plan train?', answer: `${n} strength sessions a week${c ? ` plus ${c} cardio sessions` : ''}, with ${7 - n - c} full rest day${7 - n - c === 1 ? '' : 's'}. Each strength session takes ${mins} including an ${WARMUP_MIN}-minute warm-up.` },
    { question: 'How do I progress on this plan?', answer: progress },
    ...p.extraFaqs,
    { question: 'Do I need a diet plan with this workout plan?', answer: 'Yes. Training gives the signal; food decides the result. Eat enough protein every day, and set your calories for your goal: a small deficit to lose fat, a small surplus to gain muscle. The free Indian diet plans and calculators on this site are a good starting point.' },
  ];
}

export function hubFaqs(): { question: string; answer: string }[] {
  return [
    { question: 'Which workout plan should I choose?', answer: `Choose by the number of days you can train every week, not the number you hope to. New to training: the 3-day beginner gym plan or the no-equipment home plan. 4 days: upper/lower. 5 or 6 days with good recovery: the 5-day plan or push pull legs. Main goal fat loss: the fat loss plan.` },
    { question: 'How many days a week should I work out?', answer: 'The NHS advises adults to do strengthening activities that work all the major muscle groups on at least 2 days a week, plus at least 150 minutes of moderate activity or 75 minutes of vigorous activity a week. Every plan here trains each of those muscle groups on at least 2 days.' },
    { question: 'How long should a workout take?', answer: `The sessions in these plans run about ${Math.min(...WORKOUT_PLANS.map((p) => sessionRange(p).min))} to ${Math.max(...WORKOUT_PLANS.map((p) => sessionRange(p).max))} minutes including warm-up. Longer is not better; consistent, hard sets are what count.` },
    { question: 'How do I know if a workout plan is working?', answer: 'Track it. Write down every set, the weight and the reps; if those numbers go up over weeks, the plan is working. Take body measurements and photos monthly, because the scale alone can hide fat loss while you build muscle.' },
  ];
}
