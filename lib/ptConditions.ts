// Health-condition 1:1 pages — also served at /online-personal-trainer/for/[goal].
//
// These are health pages, so the rules are stricter than the goal pages:
//  - Every line in `evidence` was read on the linked page (checked 2026-11-03). Change a claim
//    only after reading its source. Don't add figures the source doesn't state.
//  - Never promise a medical result, and never describe results for clients with the condition.
//  - Coach Himanshu coaches training and food around medical care. He doesn't diagnose or treat,
//    and medication questions always go to the doctor.

import { LOWEST_ELITE_PRICE, formatINR, planPriceLabel } from '@/lib/pricing';
import type { PTGoal } from '@/lib/ptGoals';

const FROM = `From ${formatINR(LOWEST_ELITE_PRICE)}.`;
export const CONDITIONS_REVIEWED = '2026-11-03';

const WHO_PCOS = 'https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome';
const ATA_WEIGHT = 'https://www.thyroid.org/thyroid-and-weight/';
const WHO_BP = 'https://www.who.int/news-room/fact-sheets/detail/hypertension';
const NHS_LIVER = 'https://www.nhs.uk/conditions/non-alcoholic-fatty-liver-disease/';
const WHO_BACK = 'https://www.who.int/news-room/fact-sheets/detail/low-back-pain';
const NHS_BACK = 'https://www.nhs.uk/conditions/back-pain/';
const NHS_OA = 'https://www.nhs.uk/conditions/osteoarthritis/treatment/';
const WHO_OA = 'https://www.who.int/news-room/fact-sheets/detail/osteoarthritis';
const NHS_POSTNATAL = 'https://www.nhs.uk/conditions/baby/support-and-services/your-post-pregnancy-body/';

const REHAB_NOTE = `If you don't need live sessions, the Rehabilitation Plan (${planPriceLabel('Rehabilitation Plan')}) gives you a customised programme with video tutorials and two one-on-one consultations a month.`;

export const PT_CONDITIONS: PTGoal[] = [
  {
    slug: 'pcos',
    name: 'PCOS',
    sentenceName: 'PCOS',
    metaTitle: 'Online Personal Trainer for PCOS — Live 1-on-1',
    metaDescription: `Live 1-on-1 strength training and an Indian diet plan for women with PCOS, coached alongside your doctor's care by a NASM-certified coach. ${FROM}`,
    heroLead: 'Train With PCOS',
    heroTail: 'with a Live 1-on-1 Coach',
    intro:
      "PCOS has no cure, but the WHO says lifestyle changes, medicines and fertility treatment can reduce symptoms, and that healthy eating and physical activity matter for every woman with PCOS, even when they don't lead to weight loss. Live 1-on-1 coaching helps you keep that routine going, with training and Indian meals built around you.",
    approachHeading: 'How Coach Himanshu Coaches Clients With PCOS',
    approach: [
      { title: 'Goals beyond the scale', text: "Your progress is tracked through strength, consistency and measurements as well as weight, so a slow week on the scale doesn't mean the work has stopped counting." },
      { title: 'Strength training, coached live', text: 'You learn the main movements with your form corrected in real time, starting at your level and progressing only when you are ready.' },
      { title: 'An Indian diet you can keep', text: 'Meals are built around the foods you already eat, whether veg, non-veg or eggetarian, without banning entire food groups.' },
      { title: 'Planned around your cycle and energy', text: 'Share how your cycle and energy levels change, and sessions can be adjusted for that week instead of pushing through the same plan.' },
    ],
    timeline:
      "PCOS varies a lot between women, so nobody can honestly promise a date for changes in your cycle or symptoms. What you can expect is a routine you can sustain, and strength you can measure from session to session.",
    focusChips: ['Strength training', 'Indian diet plan', 'Progress beyond the scale', 'Cycle-aware sessions', 'Sustainable routine', 'Train from home or gym'],
    faqs: [
      { question: 'Can a personal trainer help with PCOS?', answer: "A trainer can help with the lifestyle side: regular physical activity and healthy eating, which the WHO calls important for all women with PCOS. A trainer doesn't diagnose or treat PCOS, so your doctor stays in charge of tests and medicines." },
      { question: 'Is exercise still worth it if I am not losing weight?', answer: "Yes. The WHO says healthy lifestyle behaviours are important for women with PCOS even if they don't lead to weight loss. That is why your progress is tracked through more than the scale." },
      { question: 'Can PCOS be cured with diet and exercise?', answer: 'No. The WHO states there is no cure for PCOS. Lifestyle changes, medicines and fertility treatments can reduce symptoms. Be careful with any programme that promises to cure or reverse it.' },
      { question: 'Do I need a gym for PCOS training?', answer: 'No. Sessions can be programmed for a gym, basic home equipment or bodyweight. Share your setup in the free consultation.' },
    ],
    health: {
      aboutType: 'MedicalCondition',
      aboutName: 'Polycystic ovary syndrome',
      evidence: [
        { text: 'PCOS affects an estimated 10–13% of women of reproductive age, and there is no cure.', source: 'WHO', url: WHO_PCOS },
        { text: 'Lifestyle changes, medicines and fertility treatments can reduce symptoms.', source: 'WHO', url: WHO_PCOS },
        { text: "Healthy eating and physical activity are important for all women with PCOS, even if they don't lead to weight loss.", source: 'WHO', url: WHO_PCOS },
      ],
      doctorNote: 'Please see a doctor for diagnosis, blood tests, medicines and fertility questions. Tell your coach about any medicines you take. Your coach will never ask you to change them.',
      guides: [
        { title: 'PCOS Weight Loss: Diet & Exercise Plan for Indian Women', href: '/blog/pcos-weight-loss-diet-exercise-plan-for-indian-women' },
        { title: 'PCOS & Strength Training', href: '/blog/pcos-strength-training-the-most-underrated-solution-for-hormonal-balance' },
      ],
      ctaHeading: 'Build Your PCOS Routine — Live 1-on-1',
    },
  },
  {
    slug: 'thyroid',
    name: 'Hypothyroidism',
    sentenceName: 'hypothyroidism',
    metaTitle: 'Online Personal Trainer for Thyroid — Live 1-on-1',
    metaDescription: `Live 1-on-1 training and an Indian diet plan for people with hypothyroidism, coached alongside your thyroid treatment by a NASM-certified coach. ${FROM}`,
    heroLead: 'Train With Hypothyroidism',
    heroTail: 'with a Live 1-on-1 Coach',
    intro:
      'According to the American Thyroid Association, about 5–10 pounds (roughly 2–4.5 kg) of weight gain may be related to the thyroid in most patients, mostly from salt and water, and treatment returns body weight to what it was before hypothyroidism started. If you want to lose more than that, food and training usually matter too. Live 1-on-1 coaching works on those, while your doctor manages your thyroid.',
    approachHeading: 'How Coach Himanshu Coaches Clients With Hypothyroidism',
    approach: [
      { title: 'Treatment first', text: 'Your doctor manages your thyroid levels and medicine. Training and diet are planned around that care, never in place of it.' },
      { title: 'A realistic calorie target', text: 'Your meal plan is set around your current weight, routine and appetite using Indian foods, without crash dieting.' },
      { title: 'Training that matches your energy', text: 'Sessions start at a level you can recover from and build gradually. Tired that day? Your coach can see it live and adjust the session.' },
      { title: 'Regular accountability', text: 'Scheduled sessions and WhatsApp check-ins help you stay consistent through the weeks when motivation is low.' },
    ],
    timeline:
      'Your rate of progress depends on your thyroid treatment, starting point and consistency, so no honest coach can give you a fixed date. Start by getting your levels checked with your doctor. Then we track your weight, measurements and strength over the weeks.',
    focusChips: ['Works alongside treatment', 'Indian diet plan', 'No crash dieting', 'Training matched to energy', 'Strength progress', 'Weekly accountability'],
    faqs: [
      { question: 'How much weight gain is caused by hypothyroidism?', answer: 'The American Thyroid Association says about 5–10 pounds (roughly 2–4.5 kg) of weight gain may be related to the thyroid for most patients, depending on severity, and that most of it is salt and water.' },
      { question: 'Will thyroid medicine make me lose weight?', answer: 'The American Thyroid Association says treatment returns body weight to what it was before hypothyroidism started. Your doctor should guide your treatment, and food and training can then work on any further fat-loss goal.' },
      { question: 'Can I work out with hypothyroidism?', answer: 'Ask your doctor first, especially if you were recently diagnosed or your levels are not yet under control. Once you are cleared, your coach starts at a level you can recover from and builds gradually.' },
      { question: 'Will the coach change my thyroid medicine or diet around it?', answer: 'Your coach will not change your medicine or its timing. That is for your doctor. Your meal plan can be arranged around the instructions your doctor gives you.' },
    ],
    health: {
      aboutType: 'MedicalCondition',
      aboutName: 'Hypothyroidism',
      evidence: [
        { text: 'For most patients, about 5–10 pounds of weight gain may be related to the thyroid, depending on severity.', source: 'American Thyroid Association', url: ATA_WEIGHT },
        { text: 'Most of the weight gained is due to retaining salt and water.', source: 'American Thyroid Association', url: ATA_WEIGHT },
        { text: 'Treatment returns body weight to what it was before hypothyroidism started.', source: 'American Thyroid Association', url: ATA_WEIGHT },
      ],
      doctorNote: 'Please get your thyroid levels and medicine reviewed by your doctor, and ask whether you are ready to start training. Your coach does not interpret test results or change medicine.',
      guides: [{ title: 'Thyroid and Weight Loss: Complete Guide for Indian Women', href: '/blog/thyroid-and-weight-loss-complete-guide-for-indian-women' }],
      ctaHeading: 'Train Around Your Thyroid Care — Live 1-on-1',
    },
  },
  {
    slug: 'high-blood-pressure',
    name: 'High Blood Pressure',
    sentenceName: 'high blood pressure',
    metaTitle: 'Online Personal Trainer for High Blood Pressure',
    metaDescription: `Live 1-on-1 training and an Indian diet plan for people with high blood pressure, started gradually and with your doctor's clearance. ${FROM}`,
    heroLead: 'Train With High Blood Pressure',
    heroTail: 'with a Live 1-on-1 Coach',
    intro:
      'The WHO lists being physically active and losing weight among the lifestyle changes that can help lower high blood pressure. With your doctor\'s clearance, live 1-on-1 coaching helps you start gradually, with a coach watching your session, and keep the routine going alongside your treatment.',
    approachHeading: 'How Coach Himanshu Coaches Clients With High Blood Pressure',
    approach: [
      { title: "Your doctor's clearance first", text: 'Before you start, you share your diagnosis, medicines and latest readings, along with any limits your doctor has set.' },
      { title: 'A gradual start', text: 'Sessions begin at a manageable effort and build slowly, so your first weeks are about learning the movements and not about testing your limits.' },
      { title: 'Breathing and form, coached live', text: 'Your coach watches every set and cues steady breathing, so you are not holding your breath through hard reps.' },
      { title: 'Food and daily habits', text: 'Your Indian meal plan and activity targets are built around your routine, including weight loss if that is part of your goal.' },
    ],
    timeline:
      'Keep measuring your blood pressure and reviewing it with your doctor, who decides on any change to your treatment. Coaching focuses on what you can control: regular sessions, daily movement and your food.',
    focusChips: ["Doctor's clearance first", 'Gradual progression', 'Live breathing and form cues', 'Indian diet plan', 'Daily activity habits', 'Weight loss if needed'],
    faqs: [
      { question: 'Can I do strength training with high blood pressure?', answer: "Ask your doctor first, because the answer depends on your readings, medicines and health history. Once you are cleared, your coach starts with manageable effort, watches your form live and cues steady breathing." },
      { question: 'Can exercise lower blood pressure?', answer: 'The WHO says lifestyle changes can help lower high blood pressure, including losing weight and being physically active. Results vary between people, so keep monitoring your readings with your doctor.' },
      { question: 'Can I stop my blood pressure medicine if I start training?', answer: 'Not on your own. Only your doctor should change or stop your medicine. Your coach will never advise you to.' },
      { question: 'When should I not train?', answer: 'Do not train if you have severe headache, chest pain, dizziness or difficulty breathing. The WHO says to seek care immediately if you have these symptoms and high blood pressure.' },
    ],
    health: {
      aboutType: 'MedicalCondition',
      aboutName: 'Hypertension',
      evidence: [
        { text: 'Lifestyle changes can help lower high blood pressure, including losing weight and being physically active.', source: 'WHO', url: WHO_BP },
        { text: "Most people with hypertension don't feel any symptoms, so measuring it is the way to know.", source: 'WHO', url: WHO_BP },
      ],
      doctorNote: 'Please get your doctor\'s clearance before starting, and share your latest readings and medicines with your coach. Only your doctor should change your medicine.',
      urgent: {
        heading: 'Stop and seek care immediately if you have high blood pressure and:',
        items: ['Severe headache', 'Chest pain', 'Dizziness', 'Difficulty breathing'],
        source: 'WHO',
        url: WHO_BP,
      },
      guides: [{ title: 'Hypertension & Strength Training: A Scientific Guide', href: '/blog/hypertension-strength-training-a-scientific-guide-to-controlling-high-blood-pressure-naturally' }],
      ctaHeading: 'Start Training Safely — Live 1-on-1',
    },
  },
  {
    slug: 'fatty-liver',
    name: 'Fatty Liver',
    sentenceName: 'fatty liver',
    metaTitle: 'Online Personal Trainer for Fatty Liver — Live 1-on-1',
    metaDescription: `Live 1-on-1 training and an Indian diet plan for people with non-alcoholic fatty liver disease, coached alongside your doctor's care. ${FROM}`,
    heroLead: 'Train With Fatty Liver',
    heroTail: 'with a Live 1-on-1 Coach',
    intro:
      'For non-alcoholic fatty liver disease, the NHS says healthy lifestyle changes can reduce the build-up of fat in your liver, including at least 150 minutes of exercise a week and losing weight if you are overweight. Live 1-on-1 coaching turns that advice into a weekly routine, with Indian meals and training you can sustain.',
    approachHeading: 'How Coach Himanshu Coaches Clients With Fatty Liver',
    approach: [
      { title: 'A weekly activity target', text: 'Live sessions and daily movement are planned so you can build towards at least 150 minutes of exercise a week from wherever you are starting.' },
      { title: 'An Indian diet in a sensible deficit', text: 'If you are overweight, your meal plan is built around everyday Indian foods in a manageable calorie deficit, without crash dieting.' },
      { title: 'Strength training coached live', text: 'Form is corrected in real time, so you can exercise regularly without fear of doing it wrong.' },
      { title: 'Accountability that lasts', text: 'These are long-term habits. Scheduled sessions and WhatsApp check-ins help you keep going after the first burst of motivation.' },
    ],
    timeline:
      'Your doctor uses your tests and scans to judge how your liver is doing. Coaching tracks what you control week to week: exercise minutes, food, weight and strength.',
    focusChips: ['150 minutes a week target', 'Indian diet plan', 'Weight loss if overweight', 'Live form correction', 'Long-term habits', 'Works alongside your doctor'],
    faqs: [
      { question: 'Can exercise help fatty liver?', answer: 'The NHS says healthy lifestyle changes can reduce the build-up of fat in the liver with non-alcoholic fatty liver disease. Its advice includes at least 150 minutes of exercise a week and losing weight if you are overweight.' },
      { question: 'How much should I exercise with fatty liver?', answer: 'The NHS advises aiming for at least 150 minutes of exercise a week. If that is far from your current level, your coach builds up to it gradually.' },
      { question: 'Do I need medicine for fatty liver?', answer: 'That is a question for your doctor. The NHS says you will not need other treatment unless the condition has progressed, and that a liver specialist may prescribe treatment for fibrosis or cirrhosis.' },
      { question: 'Can you coach me if I have cirrhosis or advanced liver disease?', answer: 'Only with your liver specialist\'s explicit guidance. Please share their advice in the free consultation so you can both decide whether live training is suitable right now.' },
    ],
    health: {
      aboutType: 'MedicalCondition',
      aboutName: 'Non-alcoholic fatty liver disease',
      evidence: [
        { text: 'Healthy lifestyle changes can reduce the build-up of fat in your liver.', source: 'NHS', url: NHS_LIVER },
        { text: 'Aim to do at least 150 minutes of exercise a week, and lose weight if you are overweight.', source: 'NHS', url: NHS_LIVER },
        { text: 'You will not need other treatment unless the condition has progressed. A liver specialist may treat fibrosis or cirrhosis.', source: 'NHS', url: NHS_LIVER },
      ],
      doctorNote: 'Please see your doctor to confirm the diagnosis and stage. This page covers non-alcoholic fatty liver disease. If you have fibrosis, cirrhosis or alcohol-related liver disease, follow your specialist\'s advice first.',
      guides: [{ title: "Fatty Liver Isn't Just an Alcohol Problem Anymore", href: '/blog/fatty-liver-isn-t-just-an-alcohol-problem-anymore-here-s-what-it-actually-is' }],
      ctaHeading: 'Build a Liver-Friendly Routine — Live 1-on-1',
    },
  },
  {
    slug: 'back-pain',
    name: 'Back Pain',
    sentenceName: 'back pain',
    metaTitle: 'Online Personal Trainer for Back Pain — Live 1-on-1',
    metaDescription: `Live 1-on-1 strength training for people with non-specific low back pain, with form corrected in real time and a gradual return to activity. ${FROM}`,
    heroLead: 'Train With Back Pain',
    heroTail: 'with a Live 1-on-1 Coach',
    intro:
      'The NHS advises staying active with back pain and trying to continue your daily activities, and the WHO lists therapies that improve muscle strength and help you return to activity among the treatments for non-specific low back pain. Live 1-on-1 coaching helps you rebuild strength gradually, with your form watched on every rep.',
    approachHeading: 'How Coach Himanshu Coaches Clients With Back Pain',
    approach: [
      { title: 'Check the warning signs first', text: 'Serious symptoms need a doctor, not a trainer. You share your diagnosis, any scans and what makes the pain better or worse before training starts.' },
      { title: 'Movements you can do comfortably', text: 'Training starts with movements you can control and builds from there, instead of pushing into positions that aggravate your pain.' },
      { title: 'Live form correction', text: 'Your coach watches how you hinge, squat and lift, and corrects your technique in real time, including for movements you use in daily life.' },
      { title: 'Desk-job habits', text: 'If you sit for long hours, your plan can include movement breaks and simple routines that fit your workday.' },
    ],
    timeline:
      'Back pain varies widely, so no honest coach can promise when it will settle. The plan is to stay active, rebuild strength step by step and adjust whenever your symptoms change. If your pain worsens or does not improve, see your doctor.',
    focusChips: ['Non-specific low back pain', 'Strength rebuilding', 'Live form correction', 'Desk-job routines', 'Gradual progression', 'Home or gym'],
    faqs: [
      { question: 'Should I exercise with back pain or rest?', answer: 'The NHS advises staying active and trying to continue your daily activities. If you have any of the urgent symptoms listed on this page, get medical help immediately and do not train.' },
      { question: 'Can a personal trainer fix my back pain?', answer: 'A trainer does not diagnose or treat back pain. For non-specific low back pain, a coach can help you build strength and return to activity, which the WHO recognises as part of treatment. See a doctor or physiotherapist for diagnosis.' },
      { question: 'Can you train me with a slip disc or after back surgery?', answer: 'Only after your doctor or physiotherapist clears you. Share their advice and restrictions in the free consultation so your coach can work within them.' },
      { question: 'Do you offer a plan without live sessions?', answer: `Yes. ${REHAB_NOTE}` },
    ],
    health: {
      aboutType: 'MedicalCondition',
      aboutName: 'Low back pain',
      evidence: [
        { text: 'Low back pain affected 619 million people globally in 2020.', source: 'WHO', url: WHO_BACK },
        { text: 'Treatments for non-specific low back pain include physical therapies to improve muscle strength and help you resume activity and exercise.', source: 'WHO', url: WHO_BACK },
        { text: 'Stay active and try to continue with your daily activities.', source: 'NHS', url: NHS_BACK },
      ],
      doctorNote: 'Please see a doctor or physiotherapist if your pain is new, severe, follows an injury or is not improving. Live coaching is for building strength, not for diagnosis or treatment.',
      urgent: {
        heading: 'Do not train. Get emergency medical help if you have back pain and:',
        items: [
          'Pain, tingling, weakness or numbness in both legs',
          'Loss of feeling around your genitals or anus',
          'Changes in your bladder or bowels, such as difficulty peeing or losing control',
        ],
        source: 'NHS',
        url: NHS_BACK,
      },
      guides: [{ title: 'Desk Job Posture: Reduce Back Pain, Rounded Shoulders and Hip Stiffness', href: '/blog/desk-job-posture-how-to-reduce-back-pain-rounded-shoulders-and-hip-stiffness' }],
      ctaHeading: 'Rebuild Your Strength — Live 1-on-1',
    },
  },
  {
    slug: 'knee-pain',
    name: 'Knee Pain',
    sentenceName: 'knee pain',
    metaTitle: 'Online Personal Trainer for Knee Pain — Live 1-on-1',
    metaDescription: `Live 1-on-1 strength training and an Indian diet plan for people with knee osteoarthritis, built around what your knees can comfortably do. ${FROM}`,
    heroLead: 'Train With Knee Pain',
    heroTail: 'with a Live 1-on-1 Coach',
    intro:
      'The NHS calls exercise one of the most important treatments for osteoarthritis, including exercises that strengthen your muscles, and advises losing weight if you are overweight. Live 1-on-1 coaching helps you do both, with movements adjusted to what your knees can comfortably handle and your form watched on every rep.',
    approachHeading: 'How Coach Himanshu Coaches Clients With Knee Pain',
    approach: [
      { title: 'Know the cause first', text: 'This coaching suits knee osteoarthritis or pain your doctor has already assessed. Share your diagnosis, scans and any restrictions before starting.' },
      { title: 'Strength around the joint', text: 'Exercises for your thighs and hips are chosen and adjusted to your comfort, then progressed gradually.' },
      { title: 'Movement options that fit', text: 'Squats, steps and floor work can be modified for your range of motion. This matters at home, where getting up and down is part of daily life.' },
      { title: 'Weight management with Indian food', text: 'If you are overweight, your meal plan is built around your regular foods in a manageable calorie deficit.' },
    ],
    timeline:
      'Osteoarthritis symptoms vary, so no honest coach can promise when your pain will change. Progress is tracked through what you can do comfortably, such as stairs, sitting and standing, and your strength over time.',
    focusChips: ['Knee osteoarthritis', 'Thigh and hip strength', 'Modified movements', 'Weight management', 'Seniors welcome', 'Train from home'],
    faqs: [
      { question: 'Is exercise safe with knee osteoarthritis?', answer: 'The NHS says exercise is one of the most important treatments for osteoarthritis, and that activity should include exercises to strengthen your muscles. Ask your doctor about your specific knee, and your coach will adjust movements around your comfort.' },
      { question: 'Will losing weight help my knee pain?', answer: 'The NHS advises trying to lose weight if you are overweight or obese, and the WHO says staying active and keeping a healthy weight can help reduce osteoarthritis symptoms and their progression.' },
      { question: 'Can you train me after a knee replacement or knee injury?', answer: 'Only after your surgeon or physiotherapist clears you. If your knee is badly swollen, locks or gives way, or the pain started after an injury, get it checked before you train.' },
      { question: 'Do you offer a plan without live sessions?', answer: `Yes. ${REHAB_NOTE}` },
    ],
    health: {
      aboutType: 'MedicalCondition',
      aboutName: 'Knee osteoarthritis',
      evidence: [
        { text: 'Exercise is one of the most important treatments for people with osteoarthritis, and should include exercises to strengthen your muscles.', source: 'NHS', url: NHS_OA },
        { text: 'If you are overweight or obese, try to lose weight through more physical activity and a healthier diet.', source: 'NHS', url: NHS_OA },
        { text: 'Staying active and maintaining a healthy weight can help reduce osteoarthritis symptoms and the risk of progression.', source: 'WHO', url: WHO_OA },
      ],
      doctorNote: 'Please see a doctor or physiotherapist if you have not had your knee assessed, or if it is badly swollen, locks, gives way or was recently injured.',
      guides: [{ title: 'After 40, Joint Pain Is Not Normal', href: '/blog/after-40-joint-pain-is-not-normal-it-s-your-poor-lifestyle' }],
      ctaHeading: 'Strengthen Around Your Knees — Live 1-on-1',
    },
  },
  {
    slug: 'postpartum',
    name: 'Postpartum Fitness',
    sentenceName: 'postpartum fitness',
    metaTitle: 'Online Postpartum Personal Trainer — Live 1-on-1',
    metaDescription: `Live 1-on-1 postpartum training from home with an Indian diet plan for new mothers. Starts gently, after your doctor clears you to exercise. ${FROM}`,
    heroLead: 'Rebuild After Birth',
    heroTail: 'with a Live 1-on-1 Coach',
    intro:
      'The NHS recommends pelvic floor exercises after birth, and says to avoid sit-ups, planks and high-impact exercise to start with. Once your doctor clears you to train, live 1-on-1 coaching lets you rebuild strength gradually from home, with your form watched and your plan adjusted around your baby and your recovery.',
    approachHeading: 'How Coach Himanshu Coaches New Mothers',
    approach: [
      { title: "Your doctor's clearance first", text: 'You start live training after your doctor clears you. This matters even more after a caesarean or a complicated birth.' },
      { title: 'A gradual rebuild', text: 'The first sessions focus on the basics, and harder core and high-impact work comes later, only when you are ready for it.' },
      { title: 'Training from home', text: 'Sessions work with your home setup and can be planned around your baby\'s routine and the sleep you are getting.' },
      { title: 'A diet without crash dieting', text: 'Your Indian meal plan is built around recovery, energy and any feeding needs you share, with no extreme restrictions.' },
    ],
    timeline:
      'Every recovery is different, so there is no set date to "get your body back". Your coach will take the pace from your doctor\'s advice and how you feel, and progress you gradually.',
    focusChips: ['Starts after clearance', 'Pelvic floor awareness', 'Train from home', 'Gradual core rebuilding', 'Indian diet plan', 'No crash dieting'],
    faqs: [
      { question: 'When can I start exercising after giving birth?', answer: 'Ask your doctor, because it depends on your birth and recovery. The NHS encourages pelvic floor exercises and describes a postnatal check at around 6 to 8 weeks. We start live training only after your doctor clears you.' },
      { question: 'Which exercises should I avoid at first?', answer: 'The NHS says to avoid sit-ups, planks and high-impact exercises to start with. Your coach brings harder work in gradually.' },
      { question: 'What about the gap in my stomach muscles?', answer: 'The NHS says the separation between your stomach muscles will usually go back to normal by the time your baby is 8 weeks old. If you are concerned, ask your doctor or physiotherapist to check it.' },
      { question: 'Can I train after a caesarean?', answer: 'Only after your doctor clears you. Share your delivery details in the free consultation so your plan starts at the right level.' },
    ],
    health: {
      aboutType: null,
      aboutName: 'Postpartum recovery',
      evidence: [
        { text: 'Build up to 10 repeats of each pelvic floor exercise, at least 3 times a day.', source: 'NHS', url: NHS_POSTNATAL },
        { text: 'Try to avoid sit-ups, planks and high-impact exercises to start with.', source: 'NHS', url: NHS_POSTNATAL },
        { text: 'The separation between your stomach muscles will usually go back to normal by the time your baby is 8 weeks old.', source: 'NHS', url: NHS_POSTNATAL },
      ],
      doctorNote: 'Please get your doctor\'s clearance before live training, especially after a caesarean or complicated birth. Pain, bleeding or leakage should be discussed with your doctor.',
      guides: [{ title: 'Postpartum Weight Loss: Safe Exercise and Diet Plan for New Moms', href: '/blog/postpartum-weight-loss-safe-exercise-and-diet-plan-for-new-moms' }],
      ctaHeading: 'Rebuild at Your Own Pace — Live 1-on-1',
    },
  },
];
