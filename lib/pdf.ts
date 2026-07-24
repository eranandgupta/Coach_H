// Vector PDF builders for the client-facing printables (Transformation Logbook,
// Habit Tracker month grid).
//
// These draw real text + tables with jsPDF primitives instead of screenshotting
// the DOM with html2canvas. Result: crisp, selectable text, perfect table
// alignment, and page breaks that never cut a row or heading. Uses only jsPDF
// core APIs (stable across v2–v4) — no extra dependency.
//
// Fonts are the built-in Helvetica (WinAnsi), so PDF text is kept ASCII to
// guarantee correct glyphs (no rupee/curly-quote/em-dash surprises).

type RGB = [number, number, number];
const BLUE: RGB = [23, 95, 255];
const NAVY: RGB = [11, 18, 36];
const BORDER: RGB = [203, 213, 225];
const INK: RGB = [15, 23, 42];
const MUTED: RGB = [71, 85, 105];
const ZEBRA: RGB = [241, 245, 249];

const PT = 0.352778; // pt → mm

// A4 portrait geometry
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 12;
const MARGIN_TOP = 14;
const MARGIN_BOTTOM = 14;
const CONTENT_W = PAGE_W - MARGIN_X * 2; // 186
const PAGE_BOTTOM = PAGE_H - MARGIN_BOTTOM;

async function newDoc() {
  const { jsPDF } = await import('jspdf');
  return new jsPDF('p', 'mm', 'a4');
}

interface Ctx {
  pdf: any;
  y: number;
}

function setFill(pdf: any, c: RGB) { pdf.setFillColor(c[0], c[1], c[2]); }
function setText(pdf: any, c: RGB) { pdf.setTextColor(c[0], c[1], c[2]); }
function setDraw(pdf: any, c: RGB) { pdf.setDrawColor(c[0], c[1], c[2]); }

// Vertically-centred, wrapped cell text.
function cellText(pdf: any, text: string, x: number, w: number, y: number, rowH: number, align: 'left' | 'center', fontSize: number, pad: number) {
  const lineH = fontSize * PT * 1.15;
  const maxW = w - pad * 2;
  const lines: string[] = pdf.splitTextToSize(text, maxW);
  const totalH = lines.length * lineH;
  let ty = y + (rowH - totalH) / 2 + fontSize * PT * 0.8;
  const tx = align === 'left' ? x + pad : x + w / 2;
  lines.forEach((ln) => {
    pdf.text(ln, tx, ty, { align });
    ty += lineH;
  });
}

// Height a row needs for its (possibly wrapping) content.
function measureRowH(pdf: any, cells: string[], widths: number[], fontSize: number, pad: number) {
  const lineH = fontSize * PT * 1.15;
  let maxLines = 1;
  cells.forEach((c, i) => {
    const lines: string[] = pdf.splitTextToSize(String(c ?? ''), widths[i] - pad * 2);
    if (lines.length > maxLines) maxLines = lines.length;
  });
  return maxLines * lineH + pad * 2;
}

interface TableOpts {
  headers: string[];
  rows: string[][];
  widths: number[];       // must sum to CONTENT_W
  fontSize?: number;
  zebra?: boolean;
  lastColBlue?: boolean;   // render final column bold blue (the "Change"/"Improvement" col)
}

function drawTable(ctx: Ctx, opts: TableOpts) {
  const { pdf } = ctx;
  const { headers, rows, widths } = opts;
  const fontSize = opts.fontSize ?? 9;
  const pad = 2;
  const totalW = widths.reduce((a, b) => a + b, 0);

  const drawHeader = () => {
    const h = measureRowH(pdf, headers, widths, fontSize, pad) + 1;
    setFill(pdf, BLUE);
    pdf.rect(MARGIN_X, ctx.y, totalW, h, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(fontSize);
    setText(pdf, [255, 255, 255]);
    let cx = MARGIN_X;
    headers.forEach((htext, i) => {
      cellText(pdf, htext, cx, widths[i], ctx.y, h, i === 0 ? 'left' : 'center', fontSize, pad);
      cx += widths[i];
    });
    setDraw(pdf, BORDER);
    cx = MARGIN_X;
    for (let i = 0; i <= widths.length; i++) { pdf.line(cx, ctx.y, cx, ctx.y + h); cx += widths[i] || 0; }
    pdf.rect(MARGIN_X, ctx.y, totalW, h);
    ctx.y += h;
  };

  drawHeader();

  rows.forEach((row, ri) => {
    const rowH = measureRowH(pdf, row, widths, fontSize, pad);
    if (ctx.y + rowH > PAGE_BOTTOM) {
      pdf.addPage();
      ctx.y = MARGIN_TOP;
      drawHeader();
    }
    if (opts.zebra && ri % 2 === 1) {
      setFill(pdf, ZEBRA);
      pdf.rect(MARGIN_X, ctx.y, totalW, rowH, 'F');
    }
    pdf.setFontSize(fontSize);
    let cx = MARGIN_X;
    row.forEach((cell, i) => {
      const isLastBlue = opts.lastColBlue && i === row.length - 1;
      pdf.setFont('helvetica', isLastBlue ? 'bold' : 'normal');
      setText(pdf, isLastBlue ? BLUE : INK);
      cellText(pdf, String(cell ?? ''), cx, widths[i], ctx.y, rowH, i === 0 ? 'left' : 'center', fontSize, pad);
      cx += widths[i];
    });
    setDraw(pdf, BORDER);
    cx = MARGIN_X;
    for (let i = 0; i <= widths.length; i++) { pdf.line(cx, ctx.y, cx, ctx.y + rowH); cx += widths[i] || 0; }
    pdf.line(MARGIN_X, ctx.y + rowH, MARGIN_X + totalW, ctx.y + rowH);
    ctx.y += rowH;
  });
}

function ensureSpace(ctx: Ctx, h: number) {
  if (ctx.y + h > PAGE_BOTTOM) {
    ctx.pdf.addPage();
    ctx.y = MARGIN_TOP;
  }
}

function sectionTitle(ctx: Ctx, text: string) {
  const { pdf } = ctx;
  ctx.y += 5;
  ensureSpace(ctx, 12);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  const w = pdf.getTextWidth(text.toUpperCase()) + 8;
  setFill(pdf, NAVY);
  pdf.roundedRect(MARGIN_X, ctx.y, w, 7.5, 1.4, 1.4, 'F');
  setText(pdf, [255, 255, 255]);
  pdf.text(text.toUpperCase(), MARGIN_X + 4, ctx.y + 5.2);
  ctx.y += 10;
}

// ─────────────────────────── numeric helpers ───────────────────────────
const numOf = (v: any): number | null => {
  if (v === '' || v == null) return null;
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? null : n;
};
const changeOf = (p: { d1?: string; d30?: string } = {}): string => {
  const a = numOf(p.d1), b = numOf(p.d30);
  if (a == null || b == null) return '-';
  const d = Math.round((b - a) * 100) / 100;
  return d > 0 ? `+${d}` : `${d}`;
};
const val = (v: any) => (v == null || v === '' ? '' : String(v));

// ════════════════════════ Transformation Logbook ════════════════════════

export async function downloadLogbookPdf(
  meta: { userName?: string; title?: string; startDate?: string; endDate?: string },
  data: any,
  filename: string,
) {
  const pdf = await newDoc();
  const ctx: Ctx = { pdf, y: MARGIN_TOP };
  const fmtDate = (s?: string) => (s ? new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '____________');

  // Masthead
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  setText(pdf, NAVY);
  pdf.text('Coach Himanshu', MARGIN_X, ctx.y + 4);
  pdf.setFontSize(19);
  setText(pdf, BLUE);
  pdf.text('30-DAY TRANSFORMATION', MARGIN_X, ctx.y + 12);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  setText(pdf, MUTED);
  pdf.text('ASSESSMENT LOGBOOK - MEASURE PROGRESS, NOT JUST WEIGHT', MARGIN_X, ctx.y + 17);
  // dates (right)
  pdf.setFontSize(9);
  setText(pdf, NAVY);
  pdf.text(`START:  ${fmtDate(meta.startDate)}`, PAGE_W - MARGIN_X, ctx.y + 5, { align: 'right' });
  pdf.text(`END:    ${fmtDate(meta.endDate)}`, PAGE_W - MARGIN_X, ctx.y + 11, { align: 'right' });
  ctx.y += 21;
  setDraw(pdf, NAVY);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN_X, ctx.y, PAGE_W - MARGIN_X, ctx.y);
  pdf.setLineWidth(0.2);
  ctx.y += 4;

  // Client Information
  sectionTitle(ctx, 'Client Information');
  const ci = data.clientInfo || {};
  const field = (label: string, value: string, x: number, w: number, y: number) => {
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); setText(pdf, MUTED);
    pdf.text(`${label}:`, x, y);
    const lw = pdf.getTextWidth(`${label}: `);
    pdf.setFont('helvetica', 'normal'); setText(pdf, INK);
    pdf.text(value || '', x + lw + 1, y);
    setDraw(pdf, BORDER);
    pdf.line(x + lw + 1, y + 1.3, x + w, y + 1.3);
  };
  const colL = MARGIN_X, colR = MARGIN_X + CONTENT_W / 2 + 4;
  const halfW = CONTENT_W / 2 - 6;
  field('Name', meta.userName || '', colL, halfW, ctx.y);
  field('Age', val(ci.age), colR, halfW, ctx.y); ctx.y += 7;
  field('Gender', val(ci.gender), colL, halfW, ctx.y);
  field('Height', val(ci.height), colR, halfW, ctx.y); ctx.y += 7;
  field('Starting Weight', val(ci.startingWeight), colL, halfW, ctx.y);
  field('Logbook', meta.title || '', colR, halfW, ctx.y); ctx.y += 8;

  // Goals (checkboxes)
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); setText(pdf, MUTED);
  pdf.text('Goal:', colL, ctx.y);
  const goals: [string, boolean][] = [
    ['Fat Loss', !!ci.goals?.fatLoss], ['Muscle Gain', !!ci.goals?.muscleGain], ['Strength', !!ci.goals?.strength],
    ['General Fitness', !!ci.goals?.generalFitness], ['Sports Performance', !!ci.goals?.sportsPerformance],
  ];
  let gx = colL + 12;
  pdf.setFont('helvetica', 'normal'); setText(pdf, INK);
  goals.forEach(([label, on]) => {
    setDraw(pdf, MUTED);
    pdf.rect(gx, ctx.y - 3, 3.2, 3.2);
    if (on) { pdf.setFont('helvetica', 'bold'); pdf.text('X', gx + 0.55, ctx.y - 0.4); pdf.setFont('helvetica', 'normal'); }
    pdf.text(label, gx + 4.5, ctx.y);
    gx += pdf.getTextWidth(label) + 12;
    if (gx > PAGE_W - MARGIN_X - 30) { gx = colL + 12; ctx.y += 6; }
  });
  ctx.y += 7;
  field('Other Goals / Notes', val(ci.otherGoals), colL, CONTENT_W, ctx.y); ctx.y += 4;

  const W4 = [CONTENT_W * 0.4, CONTENT_W * 0.2, CONTENT_W * 0.2, CONTENT_W * 0.2];
  const f = data.fitness || {};

  // Fitness Performance
  sectionTitle(ctx, 'Fitness Performance Assessment');
  drawTable(ctx, {
    headers: ['Test', 'Day 1', 'Day 30', 'Improvement'], widths: W4, zebra: true, lastColBlue: true,
    rows: [
      ['12-Minute Run Test (Distance)', val(f.run12min?.d1), val(f.run12min?.d30), changeOf(f.run12min)],
      ['Push-ups in 60 sec', val(f.pushups60?.d1), val(f.pushups60?.d30), changeOf(f.pushups60)],
      ['Squats in 60 sec', val(f.squats60?.d1), val(f.squats60?.d30), changeOf(f.squats60)],
      ['Plank Hold Time', val(f.plankHold?.d1), val(f.plankHold?.d30), changeOf(f.plankHold)],
      ['Sit & Reach Test', val(f.sitReach?.d1), val(f.sitReach?.d30), changeOf(f.sitReach)],
    ],
  });

  // Strength
  const s = data.strength || {};
  sectionTitle(ctx, 'Strength Assessment');
  ensureSpace(ctx, 8);
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); setText(pdf, MUTED);
  pdf.text('Primary Lift / Exercise:', MARGIN_X, ctx.y);
  const plw = pdf.getTextWidth('Primary Lift / Exercise: ');
  pdf.setFont('helvetica', 'normal'); setText(pdf, INK);
  pdf.text(val(s.primaryLift), MARGIN_X + plw, ctx.y);
  ctx.y += 4;
  drawTable(ctx, {
    headers: ['1RM (kg)', 'Day 1', 'Day 30', 'Improvement'], widths: W4, lastColBlue: true,
    rows: [['Primary Lift 1RM', val(s.primary1RM?.d1), val(s.primary1RM?.d30), changeOf(s.primary1RM)]],
  });
  ctx.y += 2;
  ensureSpace(ctx, 6);
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8); setText(pdf, MUTED);
  pdf.text('Additional Lifts (optional)', MARGIN_X, ctx.y); ctx.y += 2;
  drawTable(ctx, {
    headers: ['Exercise', 'Day 1', 'Day 30', 'Change'], widths: W4, zebra: true, lastColBlue: true,
    rows: [
      ['Bench Press', val(s.bench?.d1), val(s.bench?.d30), changeOf(s.bench)],
      ['Squat', val(s.squat?.d1), val(s.squat?.d30), changeOf(s.squat)],
      ['Deadlift', val(s.deadlift?.d1), val(s.deadlift?.d30), changeOf(s.deadlift)],
      ['Shoulder Press', val(s.shoulderPress?.d1), val(s.shoulderPress?.d30), changeOf(s.shoulderPress)],
      ['Row / Pull-up', val(s.rowPullup?.d1), val(s.rowPullup?.d30), changeOf(s.rowPullup)],
    ],
  });

  // Body Measurements
  const m = data.measurements || {};
  const unit = m.unit || 'cm';
  sectionTitle(ctx, 'Body Measurements');
  const parts: [string, string][] = [
    ['Neck', 'neck'], ['Shoulders', 'shoulders'], ['Chest', 'chest'], ['Right Biceps', 'rightBiceps'],
    ['Left Biceps', 'leftBiceps'], ['Waist', 'waist'], ['Belly', 'belly'], ['Hips', 'hips'],
    ['Right Thigh', 'rightThigh'], ['Left Thigh', 'leftThigh'], ['Right Calf', 'rightCalf'], ['Left Calf', 'leftCalf'],
  ];
  drawTable(ctx, {
    headers: ['Body Part', `Day 1 (${unit})`, `Day 30 (${unit})`, 'Change'], widths: W4, zebra: true, lastColBlue: true,
    rows: parts.map(([label, key]) => [label, val(m[key]?.d1), val(m[key]?.d30), changeOf(m[key])]),
  });

  // Body Composition
  const comp = data.composition || {};
  sectionTitle(ctx, 'Body Composition');
  drawTable(ctx, {
    headers: ['Measurement', 'Day 1', 'Day 30', 'Change'], widths: W4, zebra: true, lastColBlue: true,
    rows: [
      ['Weight (kg)', val(comp.weight?.d1), val(comp.weight?.d30), changeOf(comp.weight)],
      ['Body Fat (%)', val(comp.bodyFat?.d1), val(comp.bodyFat?.d30), changeOf(comp.bodyFat)],
      ['Muscle Mass (kg)', val(comp.muscleMass?.d1), val(comp.muscleMass?.d30), changeOf(comp.muscleMass)],
      ['BMI', val(comp.bmi?.d1), val(comp.bmi?.d30), changeOf(comp.bmi)],
    ],
  });

  // Progress Summary
  sectionTitle(ctx, 'Progress Summary');
  drawTable(ctx, {
    headers: ['Metric', 'Day 1', 'Day 30', 'Change'], widths: W4, zebra: true, lastColBlue: true,
    rows: [
      ['Weight (kg)', val(comp.weight?.d1) || '-', val(comp.weight?.d30) || '-', changeOf(comp.weight)],
      ['Waist', val(m.waist?.d1) || '-', val(m.waist?.d30) || '-', changeOf(m.waist)],
      ['Push-ups (reps)', val(f.pushups60?.d1) || '-', val(f.pushups60?.d30) || '-', changeOf(f.pushups60)],
      ['Squats (reps)', val(f.squats60?.d1) || '-', val(f.squats60?.d30) || '-', changeOf(f.squats60)],
      ['Plank (sec)', val(f.plankHold?.d1) || '-', val(f.plankHold?.d30) || '-', changeOf(f.plankHold)],
      ['Run (distance)', val(f.run12min?.d1) || '-', val(f.run12min?.d30) || '-', changeOf(f.run12min)],
      ['1RM (kg)', val(s.primary1RM?.d1) || '-', val(s.primary1RM?.d30) || '-', changeOf(s.primary1RM)],
    ],
  });

  // Self Reflection
  const r = data.reflection || {};
  sectionTitle(ctx, 'Self Reflection');
  const reflectBlock = (label: string, value: string) => {
    ensureSpace(ctx, 20);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); setText(pdf, MUTED);
    pdf.text(label, MARGIN_X, ctx.y); ctx.y += 2;
    setDraw(pdf, BORDER);
    pdf.roundedRect(MARGIN_X, ctx.y, CONTENT_W, 13, 1, 1);
    if (value) {
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); setText(pdf, INK);
      const lines: string[] = pdf.splitTextToSize(value, CONTENT_W - 4);
      pdf.text(lines.slice(0, 3), MARGIN_X + 2, ctx.y + 4);
    }
    ctx.y += 16;
  };
  reflectBlock('What went well in the last 30 days?', val(r.wentWell));
  reflectBlock('What challenges did you face?', val(r.challenges));
  reflectBlock('What will you do better in the next 30 days?', val(r.doBetter));
  reflectBlock('Any other notes for yourself:', val(r.otherNotes));

  // Footer
  ctx.y += 3;
  ensureSpace(ctx, 16);
  setDraw(pdf, BORDER);
  pdf.line(MARGIN_X, ctx.y, PAGE_W - MARGIN_X, ctx.y);
  ctx.y += 6;
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); setText(pdf, NAVY);
  pdf.text('"WHAT GETS MEASURED GETS IMPROVED."', PAGE_W / 2, ctx.y, { align: 'center' });
  ctx.y += 5;
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); setText(pdf, MUTED);
  pdf.text('Coach Himanshu  -  www.coachhimanshu.com  -  Evidence-Based Fitness. Real Results.', PAGE_W / 2, ctx.y, { align: 'center' });

  pdf.save(filename);
}

// ════════════════════════ Habit Tracker (month) ════════════════════════

export async function downloadHabitMonthPdf(
  meta: { monthName: string; year: number },
  days: { day: number; weekday: string; protein: string; water: string; workout: string; steps: string; sleep: string; notes: string }[],
  filename: string,
) {
  const pdf = await newDoc();
  const ctx: Ctx = { pdf, y: MARGIN_TOP };

  // Masthead
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(12); setText(pdf, NAVY);
  pdf.text('Coach Himanshu', MARGIN_X, ctx.y + 4);
  pdf.setFontSize(19); setText(pdf, BLUE);
  pdf.text('HABIT TRACKER', MARGIN_X, ctx.y + 12);
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8); setText(pdf, MUTED);
  pdf.text(`${meta.monthName} ${meta.year} - SMALL DAILY HABITS CREATE BIG TRANSFORMATIONS`, MARGIN_X, ctx.y + 17);
  // Name / Month (right)
  pdf.setFontSize(9); setText(pdf, NAVY);
  pdf.text('Name: ______________________', PAGE_W - MARGIN_X, ctx.y + 5, { align: 'right' });
  pdf.text(`Month: ${meta.monthName} ${meta.year}`, PAGE_W - MARGIN_X, ctx.y + 11, { align: 'right' });
  ctx.y += 21;
  setDraw(pdf, NAVY); pdf.setLineWidth(0.5);
  pdf.line(MARGIN_X, ctx.y, PAGE_W - MARGIN_X, ctx.y);
  pdf.setLineWidth(0.2);
  ctx.y += 5;

  const widths = [22, 25, 24, 26, 24, 25, 40]; // = 186
  drawTable(ctx, {
    headers: ['Day', 'Protein (g)', 'Water (L)', 'Workout', 'Steps', 'Sleep (h)', 'Notes'],
    widths, zebra: true, fontSize: 8.5,
    rows: days.map((d) => [`${d.day} ${d.weekday}`, d.protein, d.water, d.workout, d.steps, d.sleep, d.notes]),
  });

  // Footer
  ctx.y += 5;
  ensureSpace(ctx, 14);
  setDraw(pdf, BORDER);
  pdf.line(MARGIN_X, ctx.y, PAGE_W - MARGIN_X, ctx.y);
  ctx.y += 6;
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); setText(pdf, NAVY);
  pdf.text('"SMALL DAILY HABITS CREATE BIG TRANSFORMATIONS."', PAGE_W / 2, ctx.y, { align: 'center' });
  ctx.y += 5;
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); setText(pdf, MUTED);
  pdf.text('Coach Himanshu  -  www.coachhimanshu.com', PAGE_W / 2, ctx.y, { align: 'center' });

  pdf.save(filename);
}
