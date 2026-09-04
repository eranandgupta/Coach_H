// Goal-specific live 1:1 pages — /online-personal-trainer/for/[goal]
//
// Targets high-intent queries like "online personal trainer for weight loss" —
// a different axis from the city pages. Each goal has genuinely distinct content
// (approach, timeline, focus areas, FAQs) so it earns its place in the index.

export interface PTGoalFaq {
  question: string;
  answer: string;
}

export interface PTGoal {
  slug: string;
  name: string;            // "Weight Loss"
  metaTitle: string;
  metaDescription: string;
  heroLead: string;        // gradient part of H1
  heroTail: string;        // rest of H1
  intro: string;
  approachHeading: string;
  approach: { title: string; text: string }[];
  timeline: string;        // honest expectation line
  focusChips: string[];
  faqs: PTGoalFaq[];
}

export const PT_GOALS: PTGoal[] = [
  {
    slug: 'weight-loss',
    name: 'Weight Loss',
    metaTitle: 'Online Personal Trainer for Weight Loss — Live 1-on-1',
    metaDescription:
      'Lose weight with a live 1-on-1 online personal trainer. Coach Himanshu builds a fat-loss workout + Indian diet plan, corrects your form live, and keeps you accountable. From ₹7,999.',
    heroLead: 'Lose Weight',
    heroTail: 'with a Live 1-on-1 Coach',
    intro:
      'Real, sustainable weight loss comes from a manageable calorie deficit, the right training to hold onto muscle, and week-after-week consistency. In live 1-on-1 sessions, Coach Himanshu programs all three around your body and your Indian diet — and keeps you accountable so the weight actually stays off.',
    approachHeading: 'How Coach Himanshu Coaches Weight Loss',
    approach: [
      { title: 'A diet you can stick to', text: 'A personalised Indian meal plan in a sensible calorie deficit — built around foods you already eat, not bland "diet food" you\'ll quit in a week.' },
      { title: 'Training that protects muscle', text: 'Live-coached strength + conditioning so you lose fat, not muscle — the difference between looking "skinny-fat" and looking lean and toned.' },
      { title: 'Live form correction', text: 'Every rep is watched and corrected in real time, so you train hard safely and burn more without injuring yourself.' },
      { title: 'Weekly accountability', text: 'Scheduled live sessions plus WhatsApp check-ins keep you consistent — the single biggest reason people succeed or stall.' },
    ],
    timeline:
      'A safe, sustainable rate is roughly 0.5–1 kg per week. Most clients see clear changes in the mirror and on the scale within the first 4–6 weeks.',
    focusChips: ['Fat loss without crash dieting', 'Belly-fat focus', 'PCOS/thyroid-aware plans', 'Hold onto muscle', 'Indian-food diet', 'Sustainable habits'],
    faqs: [
      { question: 'Can I really lose weight with an online personal trainer?', answer: 'Yes. Weight loss is driven by a consistent calorie deficit and the right training — both of which a live 1-on-1 online coach programs and monitors precisely. Coach Himanshu watches your form live, adjusts your plan weekly, and keeps you accountable, which is exactly what makes weight loss stick.' },
      { question: 'How fast will I lose weight?', answer: 'A safe, sustainable pace is about 0.5–1 kg per week. Crash diets lose muscle and water and rebound fast; Coach Himanshu\'s approach targets fat and keeps it off. Most clients notice clear changes within 4–6 weeks.' },
      { question: 'Will my diet be an Indian meal plan?', answer: 'Yes. Your plan is built around Indian foods — dal, roti, sabzi, paneer, eggs, chicken, curd — portioned into a calorie deficit that fits your routine and preferences (veg, non-veg, or eggetarian).' },
      { question: 'Do I need a gym to lose weight?', answer: 'No. Coach Himanshu can program effective fat-loss training for a full gym, minimal home equipment, or bodyweight only — whatever you have. Tell him your setup in the free consultation.' },
    ],
  },
  {
    slug: 'muscle-gain',
    name: 'Muscle Gain',
    metaTitle: 'Online Personal Trainer for Muscle Gain — Live 1-on-1',
    metaDescription:
      'Build muscle with a live 1-on-1 online personal trainer. Coach Himanshu programs progressive training + a high-protein Indian diet and corrects your form live. From ₹7,999.',
    heroLead: 'Build Muscle',
    heroTail: 'with a Live 1-on-1 Coach',
    intro:
      'Building muscle needs progressive overload, enough protein, and clean technique on the big lifts. In live 1-on-1 sessions, Coach Himanshu programs your training progression, dials in a high-protein Indian diet, and fixes your form in real time so every session actually builds size and strength.',
    approachHeading: 'How Coach Himanshu Coaches Muscle Gain',
    approach: [
      { title: 'Progressive overload, planned', text: 'A structured progression on the lifts that matter, so you add weight and reps over time instead of spinning your wheels.' },
      { title: 'High-protein Indian diet', text: 'A meal plan that hits your protein target using Indian foods — paneer, eggs, chicken, dal, curd, whey — in a controlled surplus so you gain muscle, not just fat.' },
      { title: 'Live form correction', text: 'Clean technique on squats, presses, rows and deadlifts means more muscle worked and fewer injuries — corrected live, rep by rep.' },
      { title: 'Recovery dialled in', text: 'Guidance on sleep, volume and supplements so you actually recover and grow between sessions.' },
    ],
    timeline:
      'Beginners can gain noticeable muscle in the first 8–12 weeks. Strength on the main lifts often improves within the first few weeks as technique sharpens.',
    focusChips: ['Progressive overload', 'High-protein Indian diet', 'Clean lifting technique', 'Lean bulk (minimal fat)', 'Home or gym', 'Beginner to advanced'],
    faqs: [
      { question: 'Can I build muscle with an online personal trainer?', answer: 'Yes. Muscle growth needs progressive overload, adequate protein, and good technique — all of which a live 1-on-1 coach programs and checks. Coach Himanshu watches your lifts on video, corrects form in real time, and progresses your plan every week.' },
      { question: 'How much protein will I need?', answer: 'Roughly 1.6–2.2 g of protein per kg of bodyweight, built into your Indian meal plan using paneer, eggs, chicken, dal, curd and whey. Coach Himanshu sets your exact target and makes it practical to hit.' },
      { question: 'Can I build muscle at home without a gym?', answer: 'Yes, especially as a beginner. With dumbbells, bands or bodyweight progressions, Coach Himanshu can program real muscle growth at home, then adapt as you add equipment or join a gym.' },
      { question: 'Will I get too bulky?', answer: 'No — building visible muscle is a slow, deliberate process you control. Coach Himanshu tailors your training and diet to the look you want, whether that\'s lean and athletic or bigger and stronger.' },
    ],
  },
  {
    slug: 'weight-gain',
    name: 'Weight Gain',
    metaTitle: 'Online Personal Trainer for Weight Gain — Live 1-on-1',
    metaDescription:
      'Gain healthy weight with a live 1-on-1 online personal trainer. For skinny/hardgainers — Coach Himanshu builds a calorie-surplus Indian diet + strength plan. From ₹7,999.',
    heroLead: 'Gain Weight',
    heroTail: 'the Healthy Way, 1-on-1',
    intro:
      'If you\'re naturally skinny and struggle to put on size, the fix is a consistent calorie surplus, progressive strength training, and enough patience. In live 1-on-1 sessions, Coach Himanshu builds a realistic Indian eating plan and a strength program so you gain lean weight — not just belly fat.',
    approachHeading: 'How Coach Himanshu Coaches Healthy Weight Gain',
    approach: [
      { title: 'A realistic calorie surplus', text: 'A structured Indian meal plan that adds enough calories to grow, split into meals you can actually finish through the day.' },
      { title: 'Strength-first training', text: 'Progressive compound lifts so the extra calories build muscle and strength, giving you a solid, athletic frame.' },
      { title: 'Live coaching for hardgainers', text: 'Technique and intensity coached live so every session counts — crucial when your body resists gaining.' },
      { title: 'Appetite & digestion tips', text: 'Practical strategies — calorie-dense foods, meal timing, shakes — for people who "can\'t eat that much".' },
    ],
    timeline:
      'A healthy pace is about 0.25–0.5 kg per week. Most hardgainers see the scale and their lifts moving within the first 4–8 weeks once eating is consistent.',
    focusChips: ['For skinny / hardgainers', 'Calorie-surplus Indian diet', 'Strength progression', 'Lean gains, not belly fat', 'Appetite strategies', 'Home or gym'],
    faqs: [
      { question: 'I\'m very skinny and can\'t gain weight — can this help?', answer: 'Yes. "Hardgainers" almost always undereat relative to their metabolism. Coach Himanshu builds a realistic calorie-surplus Indian meal plan plus strength training so you gain lean weight steadily, and coaches you live to make every session count.' },
      { question: 'Will I just get fat?', answer: 'No. A controlled surplus paired with progressive strength training directs most of the gain toward muscle. Coach Himanshu monitors your progress and adjusts so you build a solid frame, not just belly fat.' },
      { question: 'What if I can\'t eat that much?', answer: 'That\'s the most common hurdle. Your plan uses calorie-dense Indian foods, smart meal timing, and shakes so you can hit your target without feeling stuffed all day.' },
      { question: 'Do I need supplements to gain weight?', answer: 'Not necessarily. Food comes first; a simple whey or mass-gainer can help if you struggle to eat enough. Coach Himanshu recommends only what you actually need — no wasteful stacks.' },
    ],
  },
  {
    slug: 'beginners',
    name: 'Beginners',
    metaTitle: 'Online Personal Trainer for Beginners — Live 1-on-1',
    metaDescription:
      'New to fitness? Start with a live 1-on-1 online personal trainer. Coach Himanshu teaches correct form from day one with a beginner-friendly plan + Indian diet. From ₹7,999.',
    heroLead: 'Start Right',
    heroTail: 'as a Complete Beginner',
    intro:
      'The best time to learn correct form is before bad habits set in. If you\'ve never trained — or you\'re coming back after years off — live 1-on-1 coaching means Coach Himanshu teaches every movement step by step, so you build confidence, avoid injury, and see results from week one.',
    approachHeading: 'How Coach Himanshu Coaches Beginners',
    approach: [
      { title: 'Form taught from scratch', text: 'Every exercise demonstrated and coached live, so you learn to move correctly before adding weight — the foundation of long-term progress.' },
      { title: 'A simple, doable plan', text: 'No overwhelming 6-day splits. A beginner-friendly routine and Indian diet you can actually keep up with real life.' },
      { title: 'Confidence, not intimidation', text: 'Private 1-on-1 sessions from home mean no gym anxiety, no judgment — just you and your coach.' },
      { title: 'Habits that last', text: 'Coach Himanshu builds the routine and mindset so fitness becomes permanent, not a two-week burst.' },
    ],
    timeline:
      'Most beginners feel stronger and more energetic within 2–3 weeks, and see visible changes by 6–8 weeks as technique and consistency build.',
    focusChips: ['Learn correct form', 'No gym anxiety', 'Simple starter plan', 'Injury-free progress', 'Indian-food diet', 'Build lasting habits'],
    faqs: [
      { question: 'I\'ve never worked out — is online personal training right for me?', answer: 'Yes — arguably it\'s ideal. Beginners benefit most from learning correct form early, and live 1-on-1 coaching means Coach Himanshu teaches every movement step by step from the comfort of your home, with no gym intimidation.' },
      { question: 'Will it be too hard for a beginner?', answer: 'No. Your plan starts at your level and progresses gradually. Coach Himanshu coaches each session live, so the intensity always matches what you can safely handle.' },
      { question: 'Do I need any equipment to start?', answer: 'Not necessarily. Many beginners start with bodyweight and minimal equipment at home. Tell Coach Himanshu what you have and your plan is built around it.' },
      { question: 'What if I feel awkward on camera?', answer: 'That\'s completely normal and passes within a session or two. It\'s just you and your coach — a private, supportive space designed to build your confidence.' },
    ],
  },
  {
    slug: 'toning',
    name: 'Toning',
    metaTitle: 'Online Personal Trainer for Toning — Live 1-on-1',
    metaDescription:
      'Get toned and lean with a live 1-on-1 online personal trainer. Coach Himanshu combines strength training + an Indian diet for definition — coached live. From ₹7,999.',
    heroLead: 'Get Toned',
    heroTail: '& Lean, 1-on-1',
    intro:
      '"Toning" really means building a little muscle while losing enough fat to reveal it — body recomposition. In live 1-on-1 sessions, Coach Himanshu combines the right strength training with a precise Indian diet so you get firmer, more defined, and athletic rather than just "smaller".',
    approachHeading: 'How Coach Himanshu Coaches Toning & Definition',
    approach: [
      { title: 'Strength for shape', text: 'Resistance training that builds the lean muscle which creates a toned, defined look — cardio alone can\'t do this.' },
      { title: 'A precise Indian diet', text: 'Enough protein and a slight deficit so you lose fat while keeping muscle — the exact recipe for definition.' },
      { title: 'Live technique coaching', text: 'Targeted, well-executed training coached rep by rep so you actually work the muscles you want to shape.' },
      { title: 'Recomposition tracking', text: 'Coach Himanshu tracks the mirror and measurements, not just the scale — because toning often happens even when weight barely moves.' },
    ],
    timeline:
      'Visible definition typically shows over 6–12 weeks, depending on your starting point. The scale may move slowly while your shape changes noticeably.',
    focusChips: ['Lean & defined look', 'Strength + fat loss', 'High-protein Indian diet', 'Body recomposition', 'Home or gym', 'For women & men'],
    faqs: [
      { question: 'What does "toning" actually mean?', answer: 'Toning is building a bit of muscle while losing enough fat to reveal it — body recomposition. Coach Himanshu combines strength training with a precise Indian diet to give you a firmer, more defined, athletic look rather than just being "smaller".' },
      { question: 'Will lifting weights make me bulky?', answer: 'No. Building large amounts of muscle is slow and deliberate. Strength training is exactly what creates the lean, toned look you want — Coach Himanshu tailors it precisely to your goal.' },
      { question: 'Why isn\'t the scale moving even though I look better?', answer: 'Because you\'re losing fat and gaining a little muscle at the same time — the scale can stay flat while your shape changes a lot. That\'s why Coach Himanshu tracks the mirror and measurements too.' },
      { question: 'Can I tone up at home?', answer: 'Yes. With resistance bands, dumbbells or bodyweight progressions and the right diet, Coach Himanshu can coach real definition at home, adapting as you add equipment.' },
    ],
  },
];

export function getGoalBySlug(slug: string): PTGoal | undefined {
  return PT_GOALS.find((g) => g.slug === slug);
}

export function getAllGoalSlugs(): string[] {
  return PT_GOALS.map((g) => g.slug);
}
