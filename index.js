import ansiEscapes from "ansi-escapes";
import ansiStyles from "ansi-styles";

const makeBlue = (text) =>
  `${ansiStyles.blue.open}${text}${ansiStyles.blue.close}`;
const makeGray = (text) =>
  `${ansiStyles.gray.open}${text}${ansiStyles.gray.close}`;
const makeGreen = (text) =>
  `${ansiStyles.green.open}${text}${ansiStyles.green.close}`;
const makeRed = (text) =>
  `${ansiStyles.red.open}${text}${ansiStyles.red.close}`;
const makeYellow = (text) =>
  `${ansiStyles.yellow.open}${text}${ansiStyles.yellow.close}`;
const makeMagenta = (text) =>
  `${ansiStyles.magenta.open}${text}${ansiStyles.magenta.close}`;

const greenTick = makeGreen("'");
const redTick = makeRed("'");

const subWidth = 16;
const subHeight = 7;
const submarine = [
  "  o",
  "  |______|_",
  "/\\/" +
    greenTick +
    " " +
    redTick +
    " " +
    greenTick +
    " " +
    redTick +
    " " +
    greenTick +
    "\\",
  "<|= ___////( )",
  "\\/\\(___)____/",
  "  |/      \\,\\,",
  "  o",
];

const submarineExhaust = [
  makeBlue("'  ,  ' .  "),
  makeBlue("    .  ' .~"),
  makeBlue("      . '  "),
  makeBlue(" ,         "),
];
const subExhaustWidth = 11;
const subExhaustHeight = 4;

const stone = [makeGray("  ___"), makeGray(" /   \\_"), makeGray("/      \\")];
const stoneWidth = 9;

const fishRight = [makeMagenta("|>=,(°>")];
const fishLeft = [makeMagenta("<°,)=<|")];

// Store the submarine and the exhaust in an array
const drawSubmarine = () => {
  const lines = [];

  for (let i = 0; i < submarine.length; ++i) {
    let out = "";
    if (i < 2 || i > 4) {
      for (let o = 0; o < subExhaustWidth; ++o) out += " ";
    } else {
      out += submarineExhaust[i - 2];
    }
    out += submarine[i] + "\n";
    lines.push(out);
  }
  return lines;
};

const drawStone = () => {
  return stone;
};

/**
 * Make a line of ocean waves with randomized color (gray, blue)
 * @param width the width of the ocean
 * @returns {string}
 */
const waveLine = (width = 80) => {
  let out = "";
  for (let i = 0; i < width; ++i) {
    out += Math.random() > 0.3 ? makeGray("~") : makeBlue("~");
  }
  return out;
};

const sandLine = (width = 80) => {
  let out = "";
  for (let i = 0; i < width; ++i) {
    out += makeYellow("_");
  }
  return out;
};

const render = (px = 0, py = 0) => {
  // At the beginning of each render call
  // move the cursor to the upper left corner to start redrawing
  process.stdout.write(ansiEscapes.cursorTo(0, 0));

  // draw the grid (ocean)
  const grid = [];
  for (let y = 0; y < 19; ++y) {
    grid.push(waveLine().split(""));
  }
  grid.push(sandLine().split(""));
  grid.forEach((line) => {
    process.stdout.write(line.join("") + "\n");
  });

  // store the last cursor position
  process.stdout.write(ansiEscapes.cursorSavePosition);

  // draw a single stone moving from right to left
  let sy = 17;
  drawStone().forEach((line) => {
    process.stdout.write(ansiEscapes.cursorTo(80 - stoneWidth - px, sy));
    sy++;
    process.stdout.write(line);
  });

  // draw a single fish
  fishRight.forEach((line) => {
    process.stdout.write(ansiEscapes.cursorTo(px + 15, 2));
    process.stdout.write(line);
  });
  fishLeft.forEach((line) => {
    process.stdout.write(ansiEscapes.cursorTo(80 - 7 - 10 - px, 15));
    process.stdout.write(line);
  });

  // draw the submarine
  let y = py;
  submarine.forEach((line) => {
    process.stdout.write(ansiEscapes.cursorTo(px, y++));
    process.stdout.write(line);
  });

  // restore cursor position at the end
  process.stdout.write(ansiEscapes.cursorRestorePosition);
};

// Driver Code
let x = 0;
let y = 0;
let yDirection = true;
setInterval(() => {
  render(x, y);
  if (y > 8) yDirection = false;
  if (y < 4) yDirection = true;
  // only a 20% chance that the submarine will change depth
  if (yDirection && Math.random() > 0.8) y++;
  else if (!yDirection && Math.random() > 0.8) y--;

  if (x > 54) x = 0;
  else x++;
}, 100);
