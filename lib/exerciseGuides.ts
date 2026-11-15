/**
 * Exercise library (/exercises). One how-to page per exercise in the EXERCISES catalogue that
 * the free workout plans are built from, plus one page per muscle.
 *
 * The how-to copy (steps, mistakes) lives here; everything else a page says — muscles worked,
 * equipment, which free plans use it and with what sets/reps, alternatives, home options — is
 * COMPUTED from lib/workoutPlans.ts, so it can't drift from the plans.
 *
 * `exerciseIssues()` runs in generateStaticParams, so a bad edit fails the build. The
 * `satisfies Record<ExerciseKey, Guide>` below makes a missing guide a type error.
 *
 * No external figures or studies are quoted here. Steps and mistakes are standard coaching
 * technique written for this site; flag for the coach to review.
 */
import {
  EXERCISES,
  MUSCLES,
  MUSCLE_LABEL,
  WORKOUT_PLANS,
  ex,
  type Equipment,
  type ExerciseKey,
  type Muscle,
  type WorkoutPlan,
} from '@/lib/workoutPlans';

export const EXERCISES_BASE = 'https://coachhimanshu.com/exercises';
export const EXERCISES_UPDATED = '2026-11-14';

interface Guide {
  slug: string;
  steps: string[];
  mistakes: string[];
  /** Optional: an easier or harder version that is also in the catalogue. */
  easier?: ExerciseKey;
  harder?: ExerciseKey;
  blog?: string;
}

const GUIDES = {
  // Lower body
  back_squat: {
    slug: 'barbell-back-squat',
    steps: [
      'Set the bar in the rack at upper-chest height. Step under it and rest it on your upper back, not your neck, hands just outside the shoulders.',
      'Stand up to lift the bar out, take two or three steps back and set your feet about shoulder-width apart, toes turned out slightly.',
      'Breathe in, brace your stomach as if about to be poked, then bend at the hips and knees together and sit down between your hips.',
      'Go as low as you can while keeping your back flat and heels down, ideally until the hip crease is level with or below the knees.',
      'Drive up through the whole foot, keeping your chest up and knees pushing out in line with your toes. Breathe out near the top.',
    ],
    mistakes: [
      'Knees caving inwards on the way up. Think of spreading the floor apart with your feet.',
      'Heels lifting or weight shifting onto the toes, which usually means going deeper than your ankles allow yet.',
      'Squatting without the rack safety bars set. Set them just below your lowest point so you can bail out safely.',
    ],
    easier: 'goblet_squat',
  },
  goblet_squat: {
    slug: 'goblet-squat',
    steps: [
      'Hold one dumbbell upright against your chest with both hands under the top plate, elbows pointing down.',
      'Stand with feet shoulder-width apart or a little wider, toes turned out slightly.',
      'Brace your stomach and sit straight down between your heels, keeping the chest tall and the dumbbell against you.',
      'Lower until your elbows come close to the inside of your knees, or as low as you can with a flat back.',
      'Push through the whole foot to stand up tall.',
    ],
    mistakes: [
      'Letting the dumbbell drift away from the chest, which pulls you forward and rounds the back.',
      'Bending forward at the hips instead of sitting down. Keep the chest facing the wall in front of you.',
    ],
    easier: 'bodyweight_squat',
    harder: 'back_squat',
  },
  leg_press: {
    slug: 'leg-press',
    steps: [
      'Sit with your back and hips flat against the pad and place your feet on the platform about shoulder-width apart.',
      'Press the platform up and release the safety handles, keeping a slight bend in the knees.',
      'Lower the platform slowly by bending the knees towards your chest.',
      'Stop just before your lower back starts to lift or your hips begin to tuck off the seat.',
      'Press back up through the middle of your feet without locking the knees hard at the top.',
    ],
    mistakes: [
      'Going so deep that the lower back peels off the pad. Range is only useful while the back stays down.',
      'Loading more weight than you can lower slowly, then bouncing out of the bottom.',
    ],
  },
  romanian_deadlift: {
    slug: 'romanian-deadlift',
    steps: [
      'Stand tall holding a barbell at your thighs with an overhand grip, hands just outside the legs, feet hip-width apart.',
      'Unlock the knees slightly and keep them at that angle for the whole rep.',
      'Push your hips straight back, letting the bar slide down the front of your thighs with your back flat.',
      'Lower until you feel a strong stretch in your hamstrings, usually around mid-shin, or until your back wants to round.',
      'Drive the hips forward to stand up, squeezing your glutes at the top without leaning back.',
    ],
    mistakes: [
      'Bending the knees more as you go down, which turns it into a squat and takes work off the hamstrings.',
      'Letting the bar drift away from the legs, which loads the lower back.',
      'Chasing depth by rounding the back. Stop where your flat back ends.',
    ],
    easier: 'db_romanian_deadlift',
  },
  db_romanian_deadlift: {
    slug: 'dumbbell-romanian-deadlift',
    steps: [
      'Stand with feet hip-width apart, a dumbbell in each hand resting on the front of your thighs.',
      'Soften the knees and keep them there.',
      'Push your hips back and let the dumbbells slide down the front of your legs, back flat, chest proud.',
      'Stop when you feel a strong hamstring stretch or the back wants to round.',
      'Squeeze your glutes and push the hips forward to stand back up.',
    ],
    mistakes: [
      'Letting the dumbbells hang out in front of you instead of close to the legs.',
      'Looking up at the ceiling, which arches the neck. Keep your gaze a little ahead on the floor.',
    ],
    harder: 'romanian_deadlift',
  },
  hip_thrust: {
    slug: 'barbell-hip-thrust',
    steps: [
      'Sit on the floor with your upper back against the edge of a bench, a padded barbell over your hip crease.',
      'Plant your feet flat about hip-width apart, so your shins are vertical at the top of the movement.',
      'Tuck your chin, brace, and drive through your heels to lift your hips until your body is flat from shoulders to knees.',
      'Squeeze your glutes hard for a second at the top without arching your lower back.',
      'Lower the hips under control until they are just above the floor.',
    ],
    mistakes: [
      'Overarching the lower back at the top instead of finishing with the glutes. Keep the ribs down.',
      'Feet too close or too far, which shifts the work to the quads or hamstrings. Adjust until the shins are vertical at the top.',
    ],
    easier: 'glute_bridge',
  },
  db_hip_thrust: {
    slug: 'dumbbell-hip-thrust',
    steps: [
      'Sit with your upper back against the edge of a sofa, bed or bench and place one dumbbell across your hips, holding it in place.',
      'Plant your feet flat, hip-width apart.',
      'Tuck your chin and push through your heels to lift your hips until your body is flat from shoulders to knees.',
      'Pause and squeeze your glutes for one to two seconds.',
      'Lower slowly and repeat.',
    ],
    mistakes: [
      'Using a sofa that slides. Push it against a wall first.',
      'Rushing the top. The pause is where most of the glute work happens with a light dumbbell.',
    ],
    easier: 'glute_bridge',
    harder: 'hip_thrust',
  },
  walking_lunge: {
    slug: 'dumbbell-walking-lunge',
    steps: [
      'Stand tall with a dumbbell in each hand at your sides.',
      'Take a long step forward and lower your back knee towards the floor, both knees bending to about 90 degrees.',
      'Keep your torso upright and the front knee in line with your toes.',
      'Push through your front heel to stand and bring the back foot forward into the next step.',
      'Alternate legs as you walk forward.',
    ],
    mistakes: [
      'Steps too short, so the front knee shoots far past the toes and the heel lifts.',
      'Walking on a tightrope. Keep your feet about hip-width apart side to side for balance.',
    ],
    easier: 'reverse_lunge',
  },
  bulgarian_split_squat: {
    slug: 'bulgarian-split-squat',
    steps: [
      'Stand about two steps in front of a bench and place the top of your back foot on it.',
      'Hold dumbbells at your sides, or no weight to start.',
      'Lower straight down by bending the front knee until your back knee is just above the floor.',
      'Keep most of your weight on the front leg and your front heel down.',
      'Push through the front foot to stand. Finish all reps on one leg, then switch.',
    ],
    mistakes: [
      'Standing too close to the bench, which cramps the front knee. Find the distance before adding weight.',
      'Pushing off the back foot. It is there for balance only.',
    ],
    easier: 'reverse_lunge',
  },
  leg_curl: {
    slug: 'leg-curl',
    steps: [
      'Set the machine so the pad sits just above your heels and your knees line up with the machine pivot.',
      'Lie face down (or sit, on a seated machine) and hold the handles to keep your hips pinned.',
      'Curl your heels towards your glutes in a smooth movement.',
      'Squeeze the hamstrings for a moment at the end.',
      'Lower slowly over two to three seconds.',
    ],
    mistakes: [
      'Hips lifting off the pad to swing the weight up.',
      'Letting the weight drop back. The lowering half builds as much as the lifting half.',
    ],
  },
  leg_extension: {
    slug: 'leg-extension',
    steps: [
      'Adjust the seat so your knees line up with the machine pivot and the pad sits on your lower shins.',
      'Sit back against the pad and hold the handles.',
      'Straighten your legs until they are fully extended.',
      'Squeeze your quads at the top for a second.',
      'Lower slowly to the start.',
    ],
    mistakes: [
      'Kicking the weight up fast and letting it crash down.',
      'Knees not lined up with the pivot, which puts odd stress on the joint. Fix the seat before you start.',
    ],
  },
  calf_raise_machine: {
    slug: 'standing-calf-raise',
    steps: [
      'Stand on the machine platform with the balls of your feet on the edge and shoulders under the pads.',
      'Straighten your legs, keeping a tiny bend in the knees.',
      'Lower your heels as far as they go for a full stretch.',
      'Rise up onto your toes as high as you can.',
      'Pause for a second at the top, then lower slowly.',
    ],
    mistakes: [
      'Bouncing through short, fast reps. Calves respond to the full stretch and the pause.',
      'Bending the knees to help push the weight.',
    ],
    easier: 'calf_raise',
  },
  db_calf_raise: {
    slug: 'dumbbell-calf-raise',
    steps: [
      'Stand with the balls of your feet on a step, a dumbbell in one or both hands. Hold a wall or rail with a free hand if needed.',
      'Let your heels drop below the step for a full stretch.',
      'Rise onto your toes as high as you can.',
      'Pause at the top, then lower slowly.',
    ],
    mistakes: [
      'Rolling onto the outside or inside of the foot. Push through the big toe and second toe.',
      'Skipping the stretch at the bottom.',
    ],
    easier: 'calf_raise',
  },
  // Upper body — push
  bench_press: {
    slug: 'barbell-bench-press',
    steps: [
      'Lie on the bench with your eyes under the bar, feet flat on the floor.',
      'Grip the bar a little wider than shoulder-width, then pull your shoulder blades back and down into the bench.',
      'Lift the bar out of the rack and hold it over your shoulders with straight arms.',
      'Breathe in and lower the bar to your lower chest, elbows at roughly 45 degrees from your body.',
      'Press the bar back up and slightly back towards the rack, breathing out near the top.',
    ],
    mistakes: [
      'Elbows flared straight out at 90 degrees, which strains the shoulders.',
      'Bouncing the bar off the chest.',
      'Benching heavy without a spotter or safety arms.',
    ],
    easier: 'db_bench_press',
  },
  db_bench_press: {
    slug: 'dumbbell-bench-press',
    steps: [
      'Sit on the end of a flat bench with the dumbbells on your thighs, then lie back and bring them to your chest.',
      'Press them up above your chest, palms facing your feet, shoulder blades pulled back.',
      'Lower the dumbbells slowly to chest level, elbows about 45 degrees from your body.',
      'Press back up, bringing the dumbbells slightly together at the top without clanking them.',
    ],
    mistakes: [
      'Dropping the dumbbells out to the sides at the end of a set. Bring them back to your chest and sit up.',
      'Lowering too deep, past where the shoulders feel comfortable.',
    ],
    easier: 'db_floor_press',
    harder: 'bench_press',
  },
  incline_db_press: {
    slug: 'incline-dumbbell-press',
    steps: [
      'Set the bench to about 30 degrees and sit back with a dumbbell on each thigh.',
      'Lie back and bring the dumbbells to shoulder level, palms facing forward.',
      'Press up and slightly in until the arms are straight over your upper chest.',
      'Lower slowly back to the top of your chest.',
    ],
    mistakes: [
      'Setting the bench too steep, which turns it into a shoulder press.',
      'Arching off the bench to push heavier weight.',
    ],
  },
  db_floor_press: {
    slug: 'dumbbell-floor-press',
    steps: [
      'Lie on your back on the floor, knees bent, a dumbbell in each hand at chest level.',
      'Press the dumbbells up over your chest until your arms are straight.',
      'Lower slowly until your upper arms touch the floor, elbows about 45 degrees from the body.',
      'Pause lightly, without relaxing, then press back up.',
    ],
    mistakes: [
      'Slamming the elbows into the floor. Touch down softly.',
      'Elbows flared straight out to the sides.',
    ],
    harder: 'db_bench_press',
  },
  cable_fly: {
    slug: 'cable-fly',
    steps: [
      'Set both cable pulleys at chest height or a little higher and hold a handle in each hand.',
      'Take a step forward with a staggered stance, arms out to the sides with a slight bend in the elbows.',
      'Bring your hands together in front of your chest in a wide arc, as if hugging a big tree.',
      'Squeeze the chest for a moment, then let the arms open slowly until you feel a stretch.',
    ],
    mistakes: [
      'Bending and straightening the elbows, which turns it into a press. Keep the elbow angle fixed.',
      'Going so heavy that the shoulders roll forward.',
    ],
  },
  overhead_press: {
    slug: 'barbell-overhead-press',
    steps: [
      'Set the bar at upper-chest height, grip it just outside shoulder-width and unrack it onto the front of your shoulders.',
      'Stand with feet hip-width apart, squeeze your glutes and brace your stomach.',
      'Press the bar straight up, moving your head slightly back so the bar passes your face.',
      'Once the bar passes your forehead, bring your head through so the bar finishes over the middle of your feet.',
      'Lower under control back to your shoulders.',
    ],
    mistakes: [
      'Leaning back and arching the lower back to finish the rep.',
      'Pressing the bar out in front instead of straight up.',
    ],
    easier: 'db_shoulder_press',
  },
  db_shoulder_press: {
    slug: 'dumbbell-shoulder-press',
    steps: [
      'Sit on a bench with back support, or stand, holding dumbbells at shoulder height, palms facing forward.',
      'Brace your stomach and keep your ribs down.',
      'Press the dumbbells up until your arms are straight, bringing them slightly together overhead.',
      'Lower slowly back to shoulder level.',
    ],
    mistakes: [
      'Arching the lower back as the set gets hard.',
      'Lowering only halfway. Bring the dumbbells down to about ear level each rep.',
    ],
    easier: 'pike_push_up',
    harder: 'overhead_press',
  },
  lateral_raise: {
    slug: 'dumbbell-lateral-raise',
    steps: [
      'Stand with a light dumbbell in each hand at your sides, elbows slightly bent.',
      'Raise your arms out to the sides, leading with the elbows.',
      'Stop at shoulder height, with your hands no higher than your elbows.',
      'Lower slowly over two to three seconds.',
    ],
    mistakes: [
      'Swinging the body to get heavy dumbbells up. This exercise works with light weight.',
      'Shrugging the shoulders up towards the ears.',
    ],
  },
  triceps_pushdown: {
    slug: 'triceps-pushdown',
    steps: [
      'Attach a rope or straight bar to a high cable and stand facing it.',
      'Grip the attachment with elbows bent and tucked to your sides.',
      'Push down until your arms are fully straight, keeping the elbows still.',
      'Squeeze the triceps, then let the attachment rise back until your forearms are just above parallel to the floor.',
    ],
    mistakes: [
      'Elbows moving forward and back, which brings the shoulders and chest in.',
      'Leaning over the cable to push with bodyweight.',
    ],
  },
  db_overhead_triceps: {
    slug: 'overhead-dumbbell-triceps-extension',
    steps: [
      'Sit or stand holding one dumbbell with both hands under the top plate, arms straight overhead.',
      'Keep your upper arms close to your head with the elbows pointing forward.',
      'Bend the elbows to lower the dumbbell behind your head until you feel a stretch in the triceps.',
      'Straighten the arms back up.',
    ],
    mistakes: [
      'Elbows flaring wide out to the sides.',
      'Arching the lower back. Brace, or sit on a bench with back support.',
    ],
  },
  // Upper body — pull
  lat_pulldown: {
    slug: 'lat-pulldown',
    steps: [
      'Set the thigh pad so your legs are locked in, then grip the bar a little wider than shoulder-width.',
      'Sit tall with your chest up and lean back very slightly.',
      'Pull the bar down to your upper chest, driving your elbows down and back.',
      'Squeeze your shoulder blades together at the bottom.',
      'Let the bar rise slowly until your arms are straight and you feel a stretch in your lats.',
    ],
    mistakes: [
      'Pulling the bar behind the neck.',
      'Leaning far back and rocking to move the weight.',
    ],
    harder: 'pull_up',
  },
  pull_up: {
    slug: 'pull-up',
    steps: [
      'Hang from a bar with an overhand grip a little wider than shoulder-width, arms straight.',
      'Pull your shoulder blades down and back, as if putting them in your back pockets.',
      'Pull yourself up by driving your elbows down until your chin is over the bar.',
      'Lower all the way to a straight-arm hang under control.',
      'Can not do one yet? Use the assisted pull-up machine, a resistance band looped on the bar, or the lat pulldown.',
    ],
    mistakes: [
      'Half reps that never reach a full hang.',
      'Kicking and swinging the legs to get up.',
    ],
    easier: 'lat_pulldown',
  },
  seated_cable_row: {
    slug: 'seated-cable-row',
    steps: [
      'Sit at the cable row with feet on the platform and knees slightly bent, holding the handle with straight arms.',
      'Sit tall with your chest up.',
      'Pull the handle to your stomach, driving the elbows back close to your body.',
      'Squeeze your shoulder blades together for a moment.',
      'Let your arms straighten slowly, allowing the shoulders to move forward a little for the stretch without rounding your back.',
    ],
    mistakes: [
      'Rocking the torso back and forth to move the weight.',
      'Shrugging the shoulders up instead of pulling them back.',
    ],
  },
  barbell_row: {
    slug: 'barbell-row',
    steps: [
      'Hold a barbell with an overhand grip, hands just outside the knees, feet hip-width apart.',
      'Soften the knees and hinge forward at the hips until your torso is at about 45 degrees, back flat.',
      'Pull the bar to your lower ribs, driving the elbows back.',
      'Squeeze the shoulder blades together, then lower the bar until your arms are straight.',
      'Keep the torso angle the same from the first rep to the last.',
    ],
    mistakes: [
      'Standing up more with every rep until it becomes a shrug.',
      'Rounding the lower back. If you can not hold a flat back, use a lighter weight or the one-arm dumbbell row.',
    ],
    easier: 'one_arm_db_row',
  },
  one_arm_db_row: {
    slug: 'one-arm-dumbbell-row',
    steps: [
      'Place your left hand and left knee on a bench or sturdy chair, right foot on the floor, back flat.',
      'Hold a dumbbell in your right hand with the arm hanging straight down.',
      'Pull the dumbbell up towards your hip, keeping the elbow close to your body.',
      'Lower slowly until the arm is straight and you feel a stretch. Finish all reps, then switch sides.',
    ],
    mistakes: [
      'Twisting the torso open to lift a heavier dumbbell.',
      'Pulling towards the chest instead of the hip, which shifts the work away from the lats.',
    ],
    harder: 'barbell_row',
  },
  face_pull: {
    slug: 'face-pull',
    steps: [
      'Set a rope attachment on a cable at about eye level and hold one end in each hand, thumbs towards you.',
      'Step back so the arms are straight and the weight stack lifts.',
      'Pull the rope towards your face, separating your hands and driving the elbows high and wide.',
      'Finish with your hands beside your ears and thumbs pointing back, then return slowly.',
    ],
    mistakes: [
      'Pulling with the lower back by leaning away from the cable.',
      'Using too much weight so the elbows drop and it becomes a row.',
    ],
  },
  db_reverse_fly: {
    slug: 'dumbbell-reverse-fly',
    steps: [
      'Hold a light dumbbell in each hand and hinge forward at the hips until your torso is almost parallel to the floor, back flat.',
      'Let the arms hang down with a slight bend in the elbows, palms facing each other.',
      'Raise the arms out wide to the sides until they are level with your body.',
      'Squeeze between your shoulder blades, then lower slowly.',
    ],
    mistakes: [
      'Swinging the torso up to lift the weights.',
      'Going too heavy. The rear shoulders are small muscles.',
    ],
  },
  db_curl: {
    slug: 'dumbbell-curl',
    steps: [
      'Stand tall with a dumbbell in each hand, arms straight, palms facing forward.',
      'Keep your elbows by your sides and curl the dumbbells up towards your shoulders.',
      'Squeeze the biceps at the top.',
      'Lower slowly until your arms are fully straight.',
    ],
    mistakes: [
      'Swinging the body to get the weight up.',
      'Stopping short of a straight arm at the bottom.',
    ],
  },
  hammer_curl: {
    slug: 'hammer-curl',
    steps: [
      'Stand with a dumbbell in each hand, palms facing your body, thumbs pointing forward.',
      'Keep your elbows still at your sides and curl the dumbbells up, keeping the palms facing in.',
      'Pause near the shoulders.',
      'Lower slowly to straight arms.',
    ],
    mistakes: [
      'Elbows drifting forward as you curl.',
      'Rushing the lowering half.',
    ],
  },
  // Core
  plank: {
    slug: 'plank',
    steps: [
      'Lie face down, then lift onto your forearms and toes with elbows directly under your shoulders.',
      'Squeeze your glutes and brace your stomach so your body forms a straight line from head to heels.',
      'Keep your neck neutral, looking at the floor just ahead of your hands.',
      'Breathe steadily and hold for the time set, stopping when your hips start to sag.',
    ],
    mistakes: [
      'Hips sagging towards the floor, which loads the lower back.',
      'Hips piked high in the air, which makes it easier but works the core less.',
      'Holding your breath.',
    ],
    harder: 'side_plank',
    blog: 'plank-exercise-explained-benefits-muscles-worked-proper-form',
  },
  side_plank: {
    slug: 'side-plank',
    steps: [
      'Lie on your side with your elbow directly under your shoulder and feet stacked.',
      'Lift your hips so your body forms a straight line from head to feet.',
      'Keep your hips high and stacked, not rolling forward or back.',
      'Hold for the time set, then switch sides. Bend the knees and rest on them to make it easier.',
    ],
    mistakes: [
      'Hips dropping towards the floor.',
      'Elbow too far from the shoulder, which strains the shoulder.',
    ],
    easier: 'plank',
  },
  dead_bug: {
    slug: 'dead-bug',
    steps: [
      'Lie on your back with arms pointing up to the ceiling and knees bent to 90 degrees over your hips.',
      'Press your lower back gently into the floor and keep it there.',
      'Slowly reach your right arm back overhead and straighten your left leg towards the floor.',
      'Return to the start and repeat with the other arm and leg.',
    ],
    mistakes: [
      'Lower back arching off the floor as the leg goes out. Do not lower the leg as far.',
      'Moving fast. This works best slow, with a breath out as you reach.',
    ],
    harder: 'hanging_knee_raise',
  },
  bird_dog: {
    slug: 'bird-dog',
    steps: [
      'Start on all fours, hands under shoulders and knees under hips, back flat.',
      'Brace your stomach and slowly reach your right arm forward and left leg back until both are level with your body.',
      'Hold for a breath, keeping your hips level.',
      'Return to the start and repeat on the other side.',
    ],
    mistakes: [
      'Twisting the hips up as the leg lifts. Imagine balancing a glass of water on your lower back.',
      'Lifting the leg too high and arching the back.',
    ],
  },
  hanging_knee_raise: {
    slug: 'hanging-knee-raise',
    steps: [
      'Hang from a pull-up bar with an overhand grip, arms straight, shoulders pulled down slightly.',
      'Keep your legs together and still.',
      'Curl your knees up towards your chest, tilting your pelvis up at the top.',
      'Lower the legs slowly without swinging.',
    ],
    mistakes: [
      'Swinging the whole body to lift the knees.',
      'Only lifting the thighs to hip level without curling the pelvis, which works the hip flexors more than the abs.',
    ],
    easier: 'dead_bug',
  },
  mountain_climber: {
    slug: 'mountain-climber',
    steps: [
      'Start in a high plank, hands under shoulders and body in a straight line.',
      'Drive your right knee towards your chest, then return it.',
      'Switch legs, driving the left knee in.',
      'Keep alternating at a steady pace, with your hips level and shoulders over your hands.',
    ],
    mistakes: [
      'Hips bouncing up and down.',
      'Shoulders drifting back behind the hands.',
    ],
  },
  // Bodyweight
  bodyweight_squat: {
    slug: 'bodyweight-squat',
    steps: [
      'Stand with feet shoulder-width apart, toes turned out slightly.',
      'Reach your arms forward for balance and brace your stomach.',
      'Sit down between your hips, bending the hips and knees together, chest up.',
      'Go as low as you can while keeping your heels down and back flat.',
      'Stand back up by pushing through the whole foot.',
    ],
    mistakes: [
      'Knees falling inwards.',
      'Heels lifting. Squat to a chair or bed first if needed and slowly go lower over the weeks.',
    ],
    harder: 'goblet_squat',
  },
  reverse_lunge: {
    slug: 'reverse-lunge',
    steps: [
      'Stand tall with feet hip-width apart, hands on your hips or out for balance.',
      'Take a big step back with one foot and lower the back knee towards the floor.',
      'Stop just above the floor with the front shin roughly vertical.',
      'Push through the front foot to bring the back leg forward to the start.',
      'Alternate legs, or finish one side first.',
    ],
    mistakes: [
      'Leaning far forward over the front knee.',
      'A short step back, which crowds the front knee.',
    ],
    harder: 'walking_lunge',
  },
  step_up: {
    slug: 'step-up',
    steps: [
      'Stand facing a stair, sturdy box or bench about knee height or lower.',
      'Place your whole right foot on the step.',
      'Push through the right foot to stand up on the step, bringing the left foot up.',
      'Step down slowly with the left foot first. Finish the reps on one side, then switch.',
    ],
    mistakes: [
      'Pushing off the bottom foot. Let the top leg do the work.',
      'A step so high that the hips twist to get up.',
    ],
  },
  wall_sit: {
    slug: 'wall-sit',
    steps: [
      'Stand with your back flat against a wall and feet about two feet in front of it.',
      'Slide down until your thighs are about parallel to the floor and knees are over your ankles.',
      'Keep your back flat on the wall and arms off your legs.',
      'Hold for the time set and breathe steadily.',
    ],
    mistakes: [
      'Hands pushing on the thighs to make it easier.',
      'Knees in front of the toes because the feet are too close to the wall.',
    ],
  },
  glute_bridge: {
    slug: 'glute-bridge',
    steps: [
      'Lie on your back with knees bent and feet flat on the floor, hip-width apart, arms at your sides.',
      'Brace your stomach and push through your heels to lift your hips.',
      'Rise until your body is straight from shoulders to knees.',
      'Squeeze your glutes at the top for one to two seconds, then lower slowly.',
    ],
    mistakes: [
      'Arching the lower back to lift higher.',
      'Feeling it mostly in the hamstrings. Bring your feet a little closer to your hips.',
    ],
    harder: 'single_leg_glute_bridge',
  },
  single_leg_glute_bridge: {
    slug: 'single-leg-glute-bridge',
    steps: [
      'Lie on your back with one foot flat on the floor and the other knee pulled towards your chest.',
      'Push through the heel of the planted foot to lift your hips.',
      'Keep both sides of your hips level at the top and squeeze the glute.',
      'Lower slowly. Finish the reps, then switch legs.',
    ],
    mistakes: [
      'One hip dropping lower than the other.',
      'Pushing up through the toes instead of the heel.',
    ],
    easier: 'glute_bridge',
    harder: 'db_hip_thrust',
  },
  calf_raise: {
    slug: 'calf-raise',
    steps: [
      'Stand on the edge of a step with the balls of your feet on it, holding a wall or rail for balance.',
      'Lower your heels below the step for a stretch.',
      'Rise onto your toes as high as you can.',
      'Pause, then lower slowly. Do it on one leg when two legs gets easy.',
    ],
    mistakes: [
      'Fast, bouncing half reps.',
      'Leaning on the wall so much that the calves do little.',
    ],
    harder: 'db_calf_raise',
  },
  push_up: {
    slug: 'push-up',
    steps: [
      'Place your hands on the floor slightly wider than shoulder-width, or on a table or bed edge to make it easier.',
      'Walk your feet back so your body forms a straight line from head to heels, glutes and stomach tight.',
      'Lower your chest towards the floor with elbows at about 45 degrees from your body.',
      'Push the floor away to straighten your arms, keeping your body in one line.',
    ],
    mistakes: [
      'Hips sagging or sticking up.',
      'Elbows flared straight out to the sides.',
      'Doing knee push-ups forever. Incline push-ups on a lower and lower surface lead to the floor faster.',
    ],
    harder: 'db_bench_press',
  },
  pike_push_up: {
    slug: 'pike-push-up',
    steps: [
      'Start in a push-up position, then walk your feet towards your hands so your hips rise into an upside-down V.',
      'Hands slightly wider than shoulder-width, arms straight.',
      'Bend your elbows to lower the top of your head towards the floor between your hands.',
      'Push back up to straight arms.',
    ],
    mistakes: [
      'Hips dropping so it becomes a normal push-up.',
      'Elbows flaring straight out to the sides.',
    ],
    harder: 'db_shoulder_press',
  },
  chair_dip: {
    slug: 'chair-dip',
    steps: [
      'Sit on the edge of a sturdy chair or bench (pushed against a wall) and place your hands beside your hips, fingers forward.',
      'Slide your hips off the edge, knees bent and feet flat on the floor.',
      'Bend your elbows straight back to lower your body until the upper arms are about parallel to the floor.',
      'Push back up to straight arms. Stop the set if your shoulders pinch.',
    ],
    mistakes: [
      'Going too deep, which strains the front of the shoulders.',
      'Elbows flaring out to the sides.',
    ],
  },
  superman: {
    slug: 'superman-exercise',
    steps: [
      'Lie face down with your arms stretched out in front and legs straight.',
      'Squeeze your glutes and lift your arms, chest and legs a few centimetres off the floor.',
      'Hold for two seconds, keeping your neck in line by looking at the floor.',
      'Lower slowly and repeat.',
    ],
    mistakes: [
      'Cranking the head up to look forward.',
      'Lifting as high as possible. A small lift with a pause works better.',
    ],
  },
  reverse_snow_angel: {
    slug: 'reverse-snow-angel',
    steps: [
      'Lie face down with your arms by your sides, palms facing down, and lift your arms and chest slightly off the floor.',
      'Keeping the arms hovering, sweep them out to the sides and up towards your head in a wide arc.',
      'Turn the palms as you go so the thumbs point up when the arms are overhead.',
      'Sweep back down to your sides and repeat without letting the arms touch the floor.',
    ],
    mistakes: [
      'Letting the arms rest on the floor between reps.',
      'Rushing. Slow sweeps make this light exercise much harder.',
    ],
  },
} satisfies Record<ExerciseKey, Guide>;

// ---------------------------------------------------------------------------
// Computed views
// ---------------------------------------------------------------------------
export const EXERCISE_KEYS = Object.keys(EXERCISES) as ExerciseKey[];
export const guide = (k: ExerciseKey): Guide => GUIDES[k] as Guide;
export const exerciseSlug = (k: ExerciseKey) => guide(k).slug;
export const exerciseBySlug = (slug: string) => EXERCISE_KEYS.find((k) => guide(k).slug === slug);
/** "Pull-Up (or assisted)" → "Pull-Up"; "Leg Curl (machine)" → "Leg Curl". */
export const shortName = (k: ExerciseKey) => ex(k).name.replace(/\s*\(.*\)\s*$/, '');

export const EQUIPMENT_LABEL: Record<Equipment, string> = {
  barbell: 'Barbell', dumbbell: 'Dumbbells', machine: 'Machine', cable: 'Cable', bodyweight: 'Bodyweight',
};
/** Can it be done at home with no equipment or a pair of dumbbells? (Pull-ups need a bar.) */
export const atHome = (k: ExerciseKey) =>
  (ex(k).equipment === 'bodyweight' || ex(k).equipment === 'dumbbell') && k !== 'pull_up' && k !== 'hanging_knee_raise';

export const worked = (k: ExerciseKey): Muscle[] => [...ex(k).primary, ...(ex(k).secondary ?? [])];

/** Every free plan that uses this exercise, with the prescription each day gives it. */
export function plansUsing(k: ExerciseKey): { plan: WorkoutPlan; uses: { day: string; sets: number; reps: string }[] }[] {
  return WORKOUT_PLANS.map((plan) => ({
    plan,
    uses: plan.days.flatMap((d) => (d.items ?? []).filter((it) => it.ex === k).map((it) => ({ day: `${d.label}: ${d.focus}`, sets: it.sets, reps: it.reps }))),
  })).filter((x) => x.uses.length);
}

/**
 * Alternatives: other exercises whose primary muscles overlap this one's, ranked by overlap,
 * then preferring a different piece of equipment (that is why people look for a swap).
 */
export function alternatives(k: ExerciseKey, n = 6): ExerciseKey[] {
  const p = ex(k).primary;
  // Must share the exercise's first (main) muscle, so a chest press never suggests a face pull.
  return EXERCISE_KEYS.filter((o) => o !== k && ex(o).primary.includes(p[0]))
    .map((o) => {
      const op = ex(o).primary;
      const shared = op.filter((m) => p.includes(m)).length;
      const union = new Set([...op, ...p]).size;
      return { o, score: shared / union + (ex(o).equipment !== ex(k).equipment ? 0.05 : 0) };
    })
    .filter((x) => x.score > 0.05)
    .sort((a, b) => b.score - a.score || shortName(a.o).localeCompare(shortName(b.o)))
    .slice(0, n)
    .map((x) => x.o);
}

/** Exercises for a muscle: primary ones first, then those where it helps. */
export function forMuscle(m: Muscle) {
  return {
    primary: EXERCISE_KEYS.filter((k) => ex(k).primary.includes(m)),
    secondary: EXERCISE_KEYS.filter((k) => !ex(k).primary.includes(m) && (ex(k).secondary ?? []).includes(m)),
  };
}

// Muscle pages: only muscles with enough exercises to be useful (thin pages hurt more than help).
const MIN_FOR_PAGE = 5;
export const MUSCLE_SLUG: Record<Muscle, string> = {
  chest: 'chest', back: 'back', shoulders: 'shoulders', biceps: 'biceps', triceps: 'triceps',
  quads: 'quads', hamstrings: 'hamstrings', glutes: 'glutes', calves: 'calves', core: 'abs-and-core',
};
export const MUSCLE_PAGES: Muscle[] = MUSCLES.filter((m) => {
  const f = forMuscle(m);
  return f.primary.length + f.secondary.length >= MIN_FOR_PAGE && f.primary.length >= 2;
});
export const muscleBySlug = (slug: string) => MUSCLE_PAGES.find((m) => MUSCLE_SLUG[m] === slug);
export const muscleTitle = (m: Muscle) => (m === 'core' ? 'Abs and Core' : MUSCLE_LABEL[m]);

/** The 1:1 goal page an exercise reader is most likely to want. */
export function coachingGoalForExercise(k: ExerciseKey): string {
  if (ex(k).equipment === 'bodyweight') return 'beginners';
  if (ex(k).primary.includes('glutes') && !ex(k).primary.includes('quads')) return 'toning';
  return 'muscle-gain';
}

export function exerciseFaqs(k: ExerciseKey): { question: string; answer: string }[] {
  const e = ex(k);
  const name = shortName(k);
  const lower = name.toLowerCase();
  const prim = e.primary.map((m) => MUSCLE_LABEL[m].toLowerCase());
  const sec = (e.secondary ?? []).map((m) => MUSCLE_LABEL[m].toLowerCase());
  const used = plansUsing(k);
  const alts = alternatives(k, 4).map(shortName);
  const homeAlts = alternatives(k, 12).filter(atHome).slice(0, 3).map(shortName);
  const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

  const faqs = [
    {
      question: `What muscles does the ${lower} work?`,
      answer: `The ${lower} mainly works the ${list(prim)}${sec.length ? `, with the ${list(sec)} helping` : ''}.`,
    },
    {
      question: `Can I do the ${lower} at home?`,
      answer: atHome(k)
        ? `Yes. It needs ${e.equipment === 'bodyweight' ? 'no equipment beyond a floor, wall, chair or step' : 'only dumbbells'}, which is why it appears in home routines.`
        : `Not as written: it needs ${e.equipment === 'bodyweight' ? 'a bar to hang from' : `a ${e.equipment === 'cable' ? 'cable machine' : e.equipment}`}. ${homeAlts.length ? `At home, ${list(homeAlts)} work${homeAlts.length === 1 ? 's' : ''} similar muscles.` : ''}`.trim(),
    },
  ];
  if (used.length) {
    const presc = Array.from(new Set(used.flatMap((u) => u.uses.map((x) => `${x.sets} sets of ${x.reps}`))));
    const timed = used.some((u) => u.uses.some((x) => /\d\s*s\b/.test(x.reps)));
    const rule = timed
      ? 'Hold with good form for the bottom of the time range, then add 5 to 10 seconds a week until you reach the top, and move to a harder version.'
      : e.equipment === 'bodyweight'
        ? 'Stop each set with 1 or 2 good reps left. Once you reach the top of the range on every set, make it harder: lower more slowly, pause at the hardest point or move to a harder version.'
        : 'Pick a weight you can lift for the bottom of the rep range with 1 or 2 good reps left, and add weight once you reach the top of the range on every set.';
    faqs.push({
      question: `How many sets and reps of the ${lower} should I do?`,
      answer: `In the free plans on this site it is programmed as ${list(presc.slice(0, 4))}. ${rule}`,
    });
  }
  if (alts.length) {
    faqs.push({ question: `What can I do instead of the ${lower}?`, answer: `${list(alts)} train${alts.length === 1 ? 's' : ''} the same main muscles.` });
  }
  return faqs;
}

export function exerciseIssues(): string[] {
  const issues: string[] = [];
  const slugs = new Set<string>();
  for (const k of EXERCISE_KEYS) {
    const g = guide(k);
    if (!g) { issues.push(`${k}: no guide`); continue; }
    if (slugs.has(g.slug)) issues.push(`${k}: duplicate slug ${g.slug}`);
    slugs.add(g.slug);
    if (!/^[a-z0-9-]+$/.test(g.slug)) issues.push(`${k}: bad slug ${g.slug}`);
    if (g.slug === 'muscle') issues.push(`${k}: slug clashes with the /exercises/muscle route`);
    if (g.steps.length < 3) issues.push(`${k}: needs at least 3 steps`);
    if (g.mistakes.length < 2) issues.push(`${k}: needs at least 2 mistakes`);
    for (const v of [g.easier, g.harder]) if (v && !(v in EXERCISES)) issues.push(`${k}: unknown variation ${v}`);
    if (g.easier === k || g.harder === k) issues.push(`${k}: variation points at itself`);
  }
  return issues;
}
