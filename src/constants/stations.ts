export type StationParticle = "diya" | "mote" | "seed";

export interface StationConfig {
  label: string;
  roman: string;
  freq: string;
  chatter: string[];
  now: string;
  accent: string;
  accent2: string;
  particle: StationParticle;
  image: string;
  scene: {
    sky: string;
    base: string;
    floor: string;
    gold: string;
    glow: string;
  };
  stage: {
    sky: string;
    gold: string;
    glow: string;
  };
}

import garbaImg from "../assets/wall-garba.jpg";
import dayroImg from "../assets/wall-dayro.jpg";
import cinemaImg from "../assets/wall-cinema.jpg";

export const STATION_CONFIGS: StationConfig[] = [
  {
    label: "ગરબા",
    roman: "Garba",
    freq: "91.2",
    chatter: ["એક તાળી... બોલો જય માતાજી!", "ઢોલ ઢબૂકે, પગ થિરકે — તૈયાર?", "હવે ત્રણ તાળી, જોર થી!"],
    now: "તારા વિના શ્યામ મને એકલડું લાગે · પરંપરાગત ગરબો · નવરાત્રિ ૨૦૨૫",
    accent: "#f5a524",
    accent2: "#b3122b",
    particle: "diya",
    image: garbaImg,
    scene: {
      sky: "linear-gradient(178deg,#2b0710 0%,#5a1220 42%,#a8331d 74%,#e0873a 100%)",
      base: "#2b0710",
      floor: "linear-gradient(180deg,#4a1416,#26080c)",
      gold: "#e8b923",
      glow: "rgba(245,165,36,.55)",
    },
    stage: {
      sky: "radial-gradient(80% 70% at 50% 34%, #7a0f22 0%, #43081a 52%, #23050e 100%)",
      gold: "#e8b923",
      glow: "rgba(245,165,36,.55)",
    },
  },
  {
    label: "ડાયરો",
    roman: "Dayro",
    freq: "94.5",
    chatter: ["રામ રામ... બેસો, દાયરો જામ્યો છે.", "એક વાત કહું? સાચી છે હોં.", "હાર્મોનિયમ તૈયાર — હવે ભજન."],
    now: "શામળિયો રે ધણી · લોકવાર્તા અને ભજન · શમિયાણા લાઇવ",
    accent: "#ffb75e",
    accent2: "#e8873a",
    particle: "mote",
    image: dayroImg,
    scene: {
      sky: "linear-gradient(178deg,#1b1008 0%,#3d2410 45%,#7a4a1c 76%,#c98a3e 100%)",
      base: "#1b1008",
      floor: "linear-gradient(180deg,#3a2412,#170e06)",
      gold: "#f0c274",
      glow: "rgba(255,183,94,.5)",
    },
    stage: {
      sky: "radial-gradient(80% 70% at 30% 40%, #5a3617 0%, #2e1c0c 55%, #150c05 100%)",
      gold: "#f0c274",
      glow: "rgba(255,183,94,.5)",
    },
  },
  {
    label: "ગુજરાતી સિનેમા",
    roman: "Cinema",
    freq: "102.7",
    chatter: ["શો શરૂ થવાની તૈયારીમાં છે...", "બાલ્કની ની ટિકિટ, બે રૂપિયા.", "પડદો ઊંચકાય છે — ધ્યાન થી."],
    now: "મહેંદી તે વાવી માળવે · ગુજરાતી સિનેમા · ૧૯૭૦–૯૦ ના ગીતો",
    accent: "#5fc9c0",
    accent2: "#7a2230",
    particle: "mote",
    image: cinemaImg,
    scene: {
      sky: "linear-gradient(178deg,#08161a 0%,#12333a 46%,#2e7c7b 76%,#8d4a4a 100%)",
      base: "#08161a",
      floor: "linear-gradient(180deg,#2a2224,#0d1416)",
      gold: "#d8b98a",
      glow: "rgba(95,201,192,.42)",
    },
    stage: {
      sky: "radial-gradient(80% 70% at 50% 40%, #17454a 0%, #0d2429 55%, #07161a 100%)",
      gold: "#d8b98a",
      glow: "rgba(95,201,192,.42)",
    },
  },
];
