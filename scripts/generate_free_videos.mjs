import { execSync } from "child_process";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "public", "videos");
const TEMP_DIR = path.join(process.cwd(), "temp_video_assets");

const videos = [
  {
    id: 1,
    filename: "video_1.mp4",
    title: "Orientation",
    script:
      "Welcome to Pyro Prep Academy, your command centre for passing the California Pyrotechnic Operator exam. This orientation video explains the platform layout: the Student Dashboard tracks your mastery percentage, questions completed, and per-module progress rings. Practice by Module mode delivers 25-question randomized study sessions with instant feedback. Exam mode runs a balanced 100-question mock exam under timed conditions. Premium access unlocks all modules and features. Start with the dashboard, pick a module, and build toward your 70%+ passing target.",
    bullets: [
      "Student Dashboard with mastery tracking",
      "Practice by Module - 25 questions per session",
      "Exam Mode - 100-question timed mock",
      "Premium access unlocks all content",
    ],
  },
  {
    id: 2,
    filename: "video_2.mp4",
    title: "Module Primer - California Fireworks Law",
    script:
      "California Fireworks Law is the regulatory backbone of your exam. You must know the licensing structure: the Basic Commercial, General Commercial, and Special Effects Class C licenses, their scope, and their renewal requirements. Understand the role of the Office of the State Fire Marshal, what Live Scan DOJ/FBI background checks entail, and the mandatory annual renewal cycle. Pay close attention to non-transferability rules, reciprocity limitations with other states, and the consequences of operating with an expired license. Title 19 governs every operational detail in this module.",
    bullets: [
      "Licensing structure: Basic, General, Special Effects",
      "OSFM oversight and Live Scan requirements",
      "Annual renewal cycle",
      "Non-transferability and reciprocity rules",
    ],
  },
  {
    id: 3,
    filename: "video_3.mp4",
    title: "Module Primer - Pyrotechnic Chemistry",
    script:
      "Pyrotechnic Chemistry covers the science behind fireworks effects. Know the chemical composition of stars, the function of oxidizers, fuels, binders, and effect producers. Understand how different metal salts create specific colours: strontium reds, barium greens, sodium yellows, copper blues. Study burn rates, sensitivity classifications from 1.1G through 1.4G, and the difference between display fireworks and special effects pyrotechnics. Memorize common incompatibilities and the hazards of moisture, static electricity, and friction. Safety data sheets and hazard classifications are fair game.",
    bullets: [
      "Chemical composition of stars",
      "Metal salts and colour production",
      "Sensitivity classifications 1.1G-1.4G",
      "Storage incompatibilities and hazards",
    ],
  },
  {
    id: 4,
    filename: "video_4.mp4",
    title: "Module Primer - Display Operations",
    script:
      "Display Operations focuses on safe setup, firing, and post-show procedures. You must know site selection criteria, fall-out zone calculations, minimum safety distances, and wind limits. Understand the role of the Authority Having Jurisdiction, required permits, display site plans, and the duties of the Operator in Charge. Study mortar setup techniques, loading sequences, electronic versus manual firing systems, and malfunction response protocols including the mandatory wait period before approaching a loaded mortar. Post-show accounting of unfired shells is required.",
    bullets: [
      "Site selection and fall-out zones",
      "AHJ requirements and permits",
      "Mortar setup and loading sequences",
      "Malfunction response and post-show procedures",
    ],
  },
  {
    id: 5,
    filename: "video_5.mp4",
    title: "Module Primer - Emergency & Safety",
    script:
      "Emergency and Safety covers hazard recognition, incident response, and medical protocols at fireworks displays. Know the four general classes of fire and which extinguishing agent is appropriate for each, especially Class B for flammable liquids and gases common in pyrotechnics. Understand first aid for burns, eye injuries, and inhalation of smoke or toxic chemicals. Study the emergency action plan: how to evacuate an audience, notify emergency services, and secure the display site after an incident. Personal protective equipment requirements and decontamination procedures are essential knowledge.",
    bullets: [
      "Fire classes and extinguishing agents",
      "First aid for burns and injuries",
      "Emergency action plans",
      "PPE and decontamination procedures",
    ],
  },
  {
    id: 6,
    filename: "video_6.mp4",
    title: "Tricky Question Breakdown - California Fireworks Law",
    script:
      "Let's break down a tricky California Fireworks Law question about out-of-state operators. Many candidates assume reciprocity exists because they hold a valid Nevada license. It does not. California requires every operator to hold a current OSFM license issued specifically by California. The key distinctions are: reciprocity is limited and does not substitute for the CA license; the sponsor cannot override licensing rules; and the AHJ cannot grant permission to operate without the proper state credential. Memorize the phrase 'California does not offer direct reciprocity' as a rule.",
    bullets: [
      "No reciprocity with other states",
      "Sponsors cannot override licensing rules",
      "AHJs cannot grant exceptions",
      "Must hold valid California OSFM license",
    ],
  },
  {
    id: 7,
    filename: "video_7.mp4",
    title: "Tricky Question Breakdown - Pyrotechnic Chemistry",
    script:
      "This tricky chemistry question focuses on colour production in fireworks. A common trap is confusing the metal compound with the colour it produces. For example, sodium compounds create yellow-orange light, not green. Copper chloride produces blue, which is notoriously difficult to achieve because copper compounds are easily contaminated by sodium impurities, turning them yellow. Remember that strontium salts give red, barium salts give green, and calcium salts give orange. When you see a question about inconsistent colours, think contamination or temperature instability.",
    bullets: [
      "Sodium = yellow-orange, not green",
      "Copper chloride = blue (hard to achieve)",
      "Strontium = red, Barium = green",
      "Inconsistent colours = contamination",
    ],
  },
  {
    id: 8,
    filename: "video_8.mp4",
    title: "Tricky Question Breakdown - Display Operations",
    script:
      "Tricky Display Operations questions often revolve around malfunction protocols. The critical rule is the mandatory 30-minute wait before approaching a loaded mortar that did not fire, known as the hang-fire or dud protocol. A frequent wrong answer suggests approaching after 5 or 10 minutes. The correct response is 30 minutes minimum. Also, remember that loading multiple shells into a single mortar before firing is prohibited. Each shot requires a clean, properly inspected mortar. Site security after the show requires a final sweep for unfired shells before the site is reopened.",
    bullets: [
      "30-minute wait for duds/hang-fires",
      "One shell per mortar only",
      "No exceptions for time pressure",
      "Post-show sweep required",
    ],
  },
  {
    id: 9,
    filename: "video_9.mp4",
    title: "Tricky Question Breakdown - Emergency & Safety",
    script:
      "This Emergency and Safety breakdown tests your knowledge of fire classes and extinguishers. Class A is ordinary combustibles like wood, suppressed with water or ABC dry chemical. Class B is flammable liquids and gases, common at display sites because of gasoline and pyrotechnic compositions; use BC dry chemical or foam. Class C is energized electrical equipment; cut power first, then use non-conductive agents. Class D is combustible metals, rare but possible with magnesium components; use dry powder. The tricky part: never use water on Class B or C fires.",
    bullets: [
      "Class A: water or ABC",
      "Class B: BC dry chemical or foam",
      "Class C: cut power first, then non-conductive",
      "Never use water on B or C fires",
    ],
  },
  {
    id: 10,
    filename: "video_10.mp4",
    title: "Tricky Question Breakdown - Exam Strategy",
    script:
      "Exam strategy matters. Read every answer choice before selecting. The distractors often contain elements of truth but one critical detail makes them wrong. For licensing questions, watch for words like 'transferable', 'reciprocal', 'grace period', and 'verbal permission'. California law is explicit and literal. For chemistry questions, link metal salts directly to colours and cross-check with temperature sensitivity. For operations questions, apply the strictest safety standard, not the fastest one. When in doubt, choose the answer that reflects written regulation over informal practice. There is no partial credit on the real exam.",
    bullets: [
      "Read all answer choices carefully",
      "Watch for key regulatory keywords",
      "Choose strictest safety standard",
      "No partial credit - pick the correct answer",
    ],
  },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function escapeHtml(str) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

function generateSlideHtml(video) {
  const bulletItems = video.bullets
    .map(
      (b, i) =>
        `<li class="flex items-start gap-4">
          <span class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-400/60 text-amber-400 text-xs font-bold">
            ${String(i + 1).padStart(2, "0")}
          </span>
          <span class="text-lg sm:text-xl text-zinc-200 leading-relaxed">${escapeHtml(b)}</span>
        </li>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1920, height=1080">
  <title>${escapeHtml(video.title)}</title>
  <script src="https://cdn.tailwindcss"></script>
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body class="bg-zinc-950 text-white antialiased">
  <div class="relative min-h-screen flex flex-col justify-center px-16 sm:px-24">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(234,88,12,0.12),transparent_60%)]" aria-hidden="true"></div>
    <div class="relative">
      <p class="text-[11px] font-mono uppercase tracking-[0.3em] text-amber-400 mb-6">Pyro Prep Academy</p>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white mb-10">
        ${escapeHtml(video.title)}
      </h1>
      <ul class="space-y-5 max-w-4xl">
        ${bulletItems}
      </ul>
    </div>
  </div>
</body>
</html>`;
}

async function generateAudio(video) {
  const audioPath = path.join(TEMP_DIR, `temp_audio_${video.id}.mp3`);
  console.log(`  [Audio] Generating TTS for video ${video.id}...`);
  try {
    execSync(
      `edge-tts --voice en-US-ChristopherNeural --text "${video.script.replace(/"/g, '\\"')}" --write-media "${audioPath}"`,
      { encoding: "utf8", stdio: "inherit" }
    );
    console.log(`  [Audio] Saved to ${audioPath}`);
    return audioPath;
  } catch (err) {
    console.error(`  [Audio] Failed for video ${video.id}:`, err.message);
    throw err;
  }
}

async function captureSlide(video) {
  const htmlPath = path.join(TEMP_DIR, `slide_${video.id}.html`);
  const pngPath = path.join(TEMP_DIR, `slide_${video.id}.png`);
  const html = generateSlideHtml(video);

  await fs.writeFile(htmlPath, html, "utf8");
  console.log(`  [Slide] HTML written to ${htmlPath}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
    await page.screenshot({ path: pngPath, type: "png" });
    console.log(`  [Slide] Screenshot saved to ${pngPath}`);
    return pngPath;
  } finally {
    await browser.close();
  }
}

async function combineAudioAndSlide(audioPath, pngPath, outputPath) {
  console.log(`  [FFmpeg] Combining assets into ${outputPath}...`);
  try {
    execSync(
      `ffmpeg -loop 1 -i "${pngPath}" -i "${audioPath}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -movflags +faststart "${outputPath}"`,
      { encoding: "utf8", stdio: "inherit" }
    );
    console.log(`  [FFmpeg] Video written to ${outputPath}`);
  } catch (err) {
    console.error(`  [FFmpeg] Failed for ${outputPath}:`, err.message);
    throw err;
  }
}

async function generateVideo(video) {
  console.log(`\n[${video.id}/10] Generating: ${video.title}`);
  const audioPath = await generateAudio(video);
  const pngPath = await captureSlide(video);
  const outputPath = path.join(OUTPUT_DIR, video.filename);
  await combineAudioAndSlide(audioPath, pngPath, outputPath);

  const stats = await fs.stat(outputPath);
  return { id: video.id, filename: video.filename, size: stats.size };
}

async function main() {
  console.log("Starting free local video generation pipeline...");
  await ensureDir(OUTPUT_DIR);
  await ensureDir(TEMP_DIR);

  const results = [];
  for (const video of videos) {
    const result = await generateVideo(video);
    results.push(result);
    console.log(`  Done: ${result.filename} (${result.size} bytes)`);
  }

  console.log("\nAll videos generated successfully:");
  results.forEach((r) => console.log(`  - ${r.filename}: ${r.size} bytes`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
