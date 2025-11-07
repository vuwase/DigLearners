// Comprehensive Gamified Content Data for All Grades and Ages
const sampleGamifiedContent = [
  
  // ===== GRADE 1 (Ages 6-7) - Early Elementary =====
  {
    title: "Colorful Shapes Adventure",
    description: "Learn basic shapes and colors through fun matching games",
    grade: "Grade 1",
    ageGroup: "6-7",
    gameType: "puzzle",
    difficulty: "beginner",
    subject: "Math",
    content: JSON.stringify({
      gameType: "shape-matching",
      levels: 3,
      shapes: ["circle", "square", "triangle", "rectangle"],
      colors: ["red", "blue", "green", "yellow"]
    }),
    instructions: "Tap the matching shape and color! Start with circles and squares.",
    learningObjectives: "Recognize basic shapes and colors, develop visual discrimination skills",
    estimatedTime: 8,
    pointsReward: 15,
    badgeReward: "Shape Master",
    isActive: true
  },
  {
    title: "Number Counting Farm",
    description: "Count animals on the farm and learn numbers 1-10",
    grade: "Grade 1",
    ageGroup: "6-7",
    gameType: "interactive",
    difficulty: "beginner",
    subject: "Math",
    content: JSON.stringify({
      gameType: "counting",
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      animals: ["cow", "pig", "chicken", "sheep", "horse"]
    }),
    instructions: "Count the animals and click the correct number!",
    learningObjectives: "Learn to count from 1 to 10, recognize numbers",
    estimatedTime: 10,
    pointsReward: 20,
    badgeReward: "Counting Champion",
    isActive: true
  },
  {
    title: "Letter Sound Safari",
    description: "Match letters with their sounds in a fun safari adventure",
    grade: "Grade 1",
    ageGroup: "6-7",
    gameType: "quiz",
    difficulty: "beginner",
    subject: "Language",
    content: JSON.stringify({
      gameType: "letter-sounds",
      letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      sounds: ["ah", "buh", "kuh", "duh", "eh", "fuh", "guh", "huh", "ih", "juh"]
    }),
    instructions: "Listen to the sound and find the matching letter!",
    learningObjectives: "Learn letter-sound relationships, phonics basics",
    estimatedTime: 12,
    pointsReward: 25,
    badgeReward: "Letter Detective",
    isActive: true
  },
  {
    title: "My First Computer",
    description: "Learn about computer parts and how to use a mouse",
    grade: "Grade 1",
    ageGroup: "6-7",
    gameType: "interactive",
    difficulty: "beginner",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "computer-basics",
      parts: ["monitor", "keyboard", "mouse", "computer"],
      activities: ["click", "drag", "type"]
    }),
    instructions: "Click on computer parts and practice using the mouse!",
    learningObjectives: "Identify computer parts, develop mouse skills",
    estimatedTime: 15,
    pointsReward: 30,
    badgeReward: "Computer Explorer",
    isActive: true
  },

  // ===== GRADE 2 (Ages 7-8) - Elementary =====
  {
    title: "Addition Garden",
    description: "Plant flowers by solving simple addition problems",
    grade: "Grade 2",
    ageGroup: "7-8",
    gameType: "quiz",
    difficulty: "beginner",
    subject: "Math",
    content: JSON.stringify({
      gameType: "addition",
      range: [1, 10],
      problems: 15,
      flowers: ["rose", "tulip", "daisy", "sunflower"]
    }),
    instructions: "Solve addition problems to plant beautiful flowers in your garden!",
    learningObjectives: "Practice addition within 20, develop math fluency",
    estimatedTime: 15,
    pointsReward: 25,
    badgeReward: "Math Gardener",
    isActive: true
  },
  {
    title: "Word Building Castle",
    description: "Build a castle by creating words from letters",
    grade: "Grade 2",
    ageGroup: "7-8",
    gameType: "puzzle",
    difficulty: "beginner",
    subject: "Language",
    content: JSON.stringify({
      gameType: "word-building",
      wordLength: [3, 4, 5],
      categories: ["animals", "colors", "family", "food"]
    }),
    instructions: "Drag letters to build words and construct your castle!",
    learningObjectives: "Build vocabulary, practice spelling, letter recognition",
    estimatedTime: 18,
    pointsReward: 30,
    badgeReward: "Word Architect",
    isActive: true
  },
  {
    title: "Safe Internet Heroes",
    description: "Learn internet safety rules by helping digital heroes",
    grade: "Grade 2",
    ageGroup: "7-8",
    gameType: "story",
    difficulty: "beginner",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "safety-story",
      scenarios: ["stranger danger", "password safety", "screen time", "cyberbullying"]
    }),
    instructions: "Help the heroes make safe choices online!",
    learningObjectives: "Learn basic internet safety, digital citizenship",
    estimatedTime: 20,
    pointsReward: 35,
    badgeReward: "Safety Hero",
    isActive: true
  },
  {
    title: "Pattern Detective",
    description: "Solve pattern mysteries and complete sequences",
    grade: "Grade 2",
    ageGroup: "7-8",
    gameType: "puzzle",
    difficulty: "intermediate",
    subject: "Math",
    content: JSON.stringify({
      gameType: "patterns",
      types: ["color", "shape", "number", "size"],
      difficulty: ["simple", "medium"]
    }),
    instructions: "Look at the pattern and choose what comes next!",
    learningObjectives: "Recognize and extend patterns, logical thinking",
    estimatedTime: 12,
    pointsReward: 20,
    badgeReward: "Pattern Master",
    isActive: true
  },

  // ===== GRADE 3 (Ages 8-9) - Elementary =====
  {
    title: "Multiplication Space Mission",
    description: "Travel through space solving multiplication problems",
    grade: "Grade 3",
    ageGroup: "8-9",
    gameType: "quiz",
    difficulty: "intermediate",
    subject: "Math",
    content: JSON.stringify({
      gameType: "multiplication",
      tables: [2, 3, 4, 5],
      planets: ["Mars", "Venus", "Jupiter", "Saturn"],
      spaceships: 4
    }),
    instructions: "Solve multiplication problems to fuel your spaceship and explore planets!",
    learningObjectives: "Learn multiplication tables 2-5, develop math fluency",
    estimatedTime: 20,
    pointsReward: 40,
    badgeReward: "Space Math Explorer",
    isActive: true
  },
  {
    title: "Reading Comprehension Quest",
    description: "Go on adventures while improving reading skills",
    grade: "Grade 3",
    ageGroup: "8-9",
    gameType: "story",
    difficulty: "intermediate",
    subject: "Language",
    content: JSON.stringify({
      gameType: "reading-comprehension",
      stories: ["The Magic Forest", "Ocean Adventure", "Mountain Climb"],
      questions: ["main idea", "details", "sequence", "inference"]
    }),
    instructions: "Read the story and answer questions to continue your quest!",
    learningObjectives: "Improve reading comprehension, critical thinking",
    estimatedTime: 25,
    pointsReward: 45,
    badgeReward: "Reading Champion",
    isActive: true
  },
  {
    title: "Keyboard Typing Race",
    description: "Race cars by typing words correctly and quickly",
    grade: "Grade 3",
    ageGroup: "8-9",
    gameType: "interactive",
    difficulty: "intermediate",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "typing-race",
      words: ["cat", "dog", "run", "jump", "play", "school", "friend", "happy"],
      cars: ["red", "blue", "green", "yellow"],
      tracks: 3
    }),
    instructions: "Type the words correctly to make your car go faster!",
    learningObjectives: "Develop typing skills, keyboard familiarity",
    estimatedTime: 15,
    pointsReward: 30,
    badgeReward: "Typing Racer",
    isActive: true
  },
  {
    title: "Science Lab Explorer",
    description: "Conduct virtual science experiments safely",
    grade: "Grade 3",
    ageGroup: "8-9",
    gameType: "simulation",
    difficulty: "intermediate",
    subject: "Science",
    content: JSON.stringify({
      gameType: "science-experiments",
      experiments: ["mixing colors", "plant growth", "magnets", "weather"],
      tools: ["microscope", "beaker", "magnet", "thermometer"]
    }),
    instructions: "Follow the steps to complete science experiments!",
    learningObjectives: "Learn scientific method, observation skills",
    estimatedTime: 30,
    pointsReward: 50,
    badgeReward: "Young Scientist",
    isActive: true
  },

  // ===== GRADE 4 (Ages 9-10) - Elementary =====
  {
    title: "Fraction Pizza Party",
    description: "Learn fractions by sharing pizzas at a fun party",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "interactive",
    difficulty: "intermediate",
    subject: "Math",
    content: JSON.stringify({
      gameType: "fractions",
      fractions: ["1/2", "1/3", "1/4", "2/3", "3/4"],
      pizzas: ["cheese", "pepperoni", "veggie", "hawaiian"],
      friends: 8
    }),
    instructions: "Cut pizzas into equal parts and share them fairly!",
    learningObjectives: "Understand fractions, equal parts, sharing",
    estimatedTime: 22,
    pointsReward: 40,
    badgeReward: "Fraction Chef",
    isActive: true
  },
  {
    title: "Grammar Detective Agency",
    description: "Solve grammar mysteries by finding parts of speech",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "quiz",
    difficulty: "intermediate",
    subject: "Language",
    content: JSON.stringify({
      gameType: "grammar",
      parts: ["noun", "verb", "adjective", "adverb"],
      sentences: 20,
      mysteries: ["The Missing Verb", "Adjective Adventure", "Noun Hunt"]
    }),
    instructions: "Read sentences and identify the parts of speech to solve mysteries!",
    learningObjectives: "Identify parts of speech, improve grammar skills",
    estimatedTime: 25,
    pointsReward: 45,
    badgeReward: "Grammar Detective",
    isActive: true
  },
  {
    title: "Digital Art Studio",
    description: "Create digital artwork using drawing and painting tools",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "creative",
    difficulty: "intermediate",
    subject: "Art",
    content: JSON.stringify({
      gameType: "digital-art",
      tools: ["brush", "pencil", "eraser", "fill", "shapes"],
      colors: "full-palette",
      canvases: ["landscape", "portrait", "abstract", "nature"]
    }),
    instructions: "Use digital tools to create beautiful artwork!",
    learningObjectives: "Learn digital art tools, express creativity",
    estimatedTime: 30,
    pointsReward: 50,
    badgeReward: "Digital Artist",
    isActive: true
  },
  {
    title: "World Geography Explorer",
    description: "Explore countries and learn about different cultures",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "quiz",
    difficulty: "intermediate",
    subject: "Social Studies",
    content: JSON.stringify({
      gameType: "geography",
      continents: ["Africa", "Asia", "Europe", "North America", "South America"],
      countries: ["Rwanda", "Kenya", "Nigeria", "Egypt", "Morocco"],
      landmarks: ["pyramids", "mountains", "rivers", "lakes"]
    }),
    instructions: "Travel the world and learn about different countries and cultures!",
    learningObjectives: "Learn world geography, cultural awareness",
    estimatedTime: 28,
    pointsReward: 45,
    badgeReward: "World Explorer",
    isActive: true
  },
  {
    title: "Volcano Adventure Lab",
    description: "Experiment with virtual volcanoes and keep the island villagers safe",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "simulation",
    difficulty: "intermediate",
    subject: "Science",
    content: JSON.stringify({
      gameType: "volcano-science",
      volcanoTypes: ["shield", "composite", "cinder cone"],
      safetyTools: ["evacuation map", "temperature sensor", "drone camera"],
      decisions: ["raise alert", "build shelter", "cool lava"]
    }),
    instructions: "Predict eruptions, place sensors, and make smart safety choices!",
    learningObjectives: "Understand volcano types, cause-and-effect, disaster readiness",
    estimatedTime: 26,
    pointsReward: 48,
    badgeReward: "Volcano Guardian",
    isActive: true
  },
  {
    title: "Comic Strip Creator",
    description: "Design hilarious comic strips starring clever heroes from Kigali",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "creative",
    difficulty: "intermediate",
    subject: "Language",
    content: JSON.stringify({
      gameType: "story-comics",
      panels: 6,
      characters: ["inventor", "soccer star", "scientist", "explorer"],
      settings: ["Nyamirambo", "Volcano Park", "Akagera"],
      powerUps: ["add sound effect", "add speech bubble", "add swoosh"]
    }),
    instructions: "Drag characters, write dialogue, and animate each panel for laughs!",
    learningObjectives: "Story sequencing, dialogue writing, visual storytelling",
    estimatedTime: 24,
    pointsReward: 52,
    badgeReward: "Comic Genius",
    isActive: true
  },
  {
    title: "Eco Rangers Mission",
    description: "Team up with friends to rescue endangered animals across Rwanda",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "interactive",
    difficulty: "intermediate",
    subject: "Social Studies",
    content: JSON.stringify({
      gameType: "eco-missions",
      habitats: ["Nyungwe forest", "Lake Kivu", "Akagera Savannah"],
      missions: ["clean rivers", "protect gorillas", "plant trees"],
      rewards: ["eco-badges", "team trophies", "secret postcards"]
    }),
    instructions: "Choose missions, solve problems, and earn eco-badges together!",
    learningObjectives: "Environmental stewardship, teamwork, decision making",
    estimatedTime: 30,
    pointsReward: 55,
    badgeReward: "Eco Ranger",
    isActive: true
  },
  {
    title: "Imigongo Puzzle Studio",
    description: "Arrange traditional Imigongo patterns to unlock secret color stories",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "puzzle",
    difficulty: "intermediate",
    subject: "Art",
    content: JSON.stringify({
      gameType: "pattern-puzzle",
      puzzles: ["spiral", "chevron", "zigzag"],
      tools: ["rotate", "flip", "mirror"],
      bonuses: ["speed streak", "perfect pattern", "color harmony"]
    }),
    instructions: "Drag tiles to rebuild Imigongo designs before the drum beats stop!",
    learningObjectives: "Cultural appreciation, spatial reasoning, pattern fluency",
    estimatedTime: 20,
    pointsReward: 50,
    badgeReward: "Pattern Maestro",
    isActive: true
  },

  // ===== GRADE 5 (Ages 10-11) - Upper Elementary =====
  {
    title: "Decimal Number Line Adventure",
    description: "Navigate number lines with decimals to reach treasure",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "puzzle",
    difficulty: "intermediate",
    subject: "Math",
    content: JSON.stringify({
      gameType: "decimals",
      range: [0.1, 10.0],
      operations: ["addition", "subtraction", "comparison"],
      treasures: ["gold coins", "gems", "artifacts"]
    }),
    instructions: "Use decimal numbers to navigate and find hidden treasures!",
    learningObjectives: "Understand decimals, place value, decimal operations",
    estimatedTime: 25,
    pointsReward: 50,
    badgeReward: "Decimal Navigator",
    isActive: true
  },
  {
    title: "Creative Writing Workshop",
    description: "Write stories and poems with interactive writing tools",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "creative",
    difficulty: "intermediate",
    subject: "Language",
    content: JSON.stringify({
      gameType: "creative-writing",
      genres: ["adventure", "mystery", "fantasy", "realistic"],
      prompts: 15,
      tools: ["word-bank", "rhyme-helper", "story-planner"]
    }),
    instructions: "Create amazing stories and poems using writing tools and prompts!",
    learningObjectives: "Develop creative writing, storytelling skills",
    estimatedTime: 35,
    pointsReward: 60,
    badgeReward: "Story Creator",
    isActive: true
  },
  {
    title: "Code Builder Challenge",
    description: "Learn basic programming by building simple games",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "simulation",
    difficulty: "advanced",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "basic-coding",
      concepts: ["sequence", "loops", "conditions", "variables"],
      projects: ["moving character", "simple game", "animation"],
      blocks: ["move", "repeat", "if-then", "wait"]
    }),
    instructions: "Drag code blocks to create programs and build simple games!",
    learningObjectives: "Learn programming basics, logical thinking",
    estimatedTime: 40,
    pointsReward: 70,
    badgeReward: "Code Builder",
    isActive: true
  },
  {
    title: "Ecosystem Food Web",
    description: "Build food webs and learn about animal relationships",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "simulation",
    difficulty: "intermediate",
    subject: "Science",
    content: JSON.stringify({
      gameType: "ecosystem",
      animals: ["lion", "zebra", "grass", "rabbit", "hawk", "mouse"],
      relationships: ["predator", "prey", "producer", "consumer"],
      habitats: ["savanna", "forest", "ocean", "desert"]
    }),
    instructions: "Connect animals to show who eats whom in different ecosystems!",
    learningObjectives: "Understand food chains, ecosystem relationships",
    estimatedTime: 30,
    pointsReward: 55,
    badgeReward: "Ecosystem Expert",
    isActive: true
  },
  {
    title: "STEM Drone Challenge",
    description: "Program delivery drones to help communities reach remote clinics",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "simulation",
    difficulty: "advanced",
    subject: "Science",
    content: JSON.stringify({
      gameType: "drone-programming",
      missions: ["deliver medicine", "map flooding", "measure rainfall"],
      codingBlocks: ["turn", "tilt", "scan", "drop"],
      hazards: ["strong wind", "hippo crossing", "power lines"]
    }),
    instructions: "Design smart flight plans and adapt when surprises happen!",
    learningObjectives: "Applied coding, critical thinking, STEM careers awareness",
    estimatedTime: 32,
    pointsReward: 68,
    badgeReward: "STEM Pilot",
    isActive: true
  },
  {
    title: "Kigali Innovation Fair",
    description: "Build futuristic inventions and pitch them to friendly judges",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "creative",
    difficulty: "intermediate",
    subject: "Art",
    content: JSON.stringify({
      gameType: "innovation-builder",
      prototypes: ["smart water filter", "solar backpack", "robot helper"],
      miniGames: ["brainstorm", "sketch", "prototype", "presentation"],
      judges: ["engineer", "artist", "community leader"]
    }),
    instructions: "Complete mini challenges to wow the judges and unlock fireworks!",
    learningObjectives: "Design thinking, presentation skills, creativity",
    estimatedTime: 36,
    pointsReward: 62,
    badgeReward: "Innovation Star",
    isActive: true
  },
  {
    title: "Mystery Math Escape Room",
    description: "Solve multi-step math puzzles to unlock each escape chamber",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "puzzle",
    difficulty: "advanced",
    subject: "Math",
    content: JSON.stringify({
      gameType: "math-escape",
      chambers: ["fraction vault", "decimal lab", "geometry maze"],
      tools: ["laser protractor", "fraction flashlight", "code wheel"],
      boss: "Professor Confusion"
    }),
    instructions: "Break codes, balance equations, and beat Professor Confusion!",
    learningObjectives: "Problem solving, algebra readiness, math fluency",
    estimatedTime: 34,
    pointsReward: 70,
    badgeReward: "Escape Artist",
    isActive: true
  },
  {
    title: "Lake Kivu Puzzle Quest",
    description: "Balance boats, fish, and fuel in tricky lake-side brain teasers",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "puzzle",
    difficulty: "advanced",
    subject: "Math",
    content: JSON.stringify({
      gameType: "resource-puzzle",
      levels: ["boat balance", "market math", "eco rescue"],
      constraints: ["limited fuel", "storm timer", "tricky traders"],
      helpers: ["captain", "scientist", "merchant"]
    }),
    instructions: "Solve each challenge by planning ahead and keeping the lake healthy!",
    learningObjectives: "Multi-step reasoning, fractions in context, decision making",
    estimatedTime: 28,
    pointsReward: 66,
    badgeReward: "Lake Hero",
    isActive: true
  },

  // ===== GRADE 6 (Ages 11-12) - Upper Elementary/Middle School =====
  {
    title: "Algebra Adventure Island",
    description: "Solve algebraic equations to unlock island mysteries",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "quiz",
    difficulty: "advanced",
    subject: "Math",
    content: JSON.stringify({
      gameType: "algebra-basics",
      variables: ["x", "y", "n"],
      operations: ["+", "-", "×", "÷"],
      equations: ["x + 5 = 12", "2n = 14", "y - 3 = 8"],
      islands: ["Mystery Island", "Treasure Cove", "Secret Beach"]
    }),
    instructions: "Solve equations with variables to explore mysterious islands!",
    learningObjectives: "Introduction to algebra, solving simple equations",
    estimatedTime: 35,
    pointsReward: 65,
    badgeReward: "Algebra Explorer",
    isActive: true
  },
  {
    title: "Research Project Manager",
    description: "Learn to research topics and create presentations",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "simulation",
    difficulty: "advanced",
    subject: "Language",
    content: JSON.stringify({
      gameType: "research-skills",
      topics: ["Ancient Egypt", "Space Exploration", "Ocean Life", "Renewable Energy"],
      sources: ["books", "websites", "videos", "interviews"],
      presentation: ["slides", "poster", "report", "video"]
    }),
    instructions: "Choose a topic, research information, and create a presentation!",
    learningObjectives: "Develop research skills, information literacy",
    estimatedTime: 45,
    pointsReward: 75,
    badgeReward: "Research Master",
    isActive: true
  },
  {
    title: "Web Design Studio",
    description: "Create your first website with HTML and CSS basics",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "creative",
    difficulty: "advanced",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "web-design",
      elements: ["heading", "paragraph", "image", "link", "list"],
      styles: ["color", "font", "size", "background"],
      templates: ["personal page", "school project", "hobby site"]
    }),
    instructions: "Use HTML and CSS to build your own website!",
    learningObjectives: "Learn web development basics, HTML/CSS introduction",
    estimatedTime: 50,
    pointsReward: 80,
    badgeReward: "Web Designer",
    isActive: true
  },
  {
    title: "Historical Timeline Builder",
    description: "Create interactive timelines of historical events",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "interactive",
    difficulty: "advanced",
    subject: "Social Studies",
    content: JSON.stringify({
      gameType: "timeline",
      periods: ["Ancient Times", "Medieval", "Renaissance", "Modern"],
      events: ["inventions", "discoveries", "wars", "cultural changes"],
      regions: ["Africa", "Europe", "Asia", "Americas"]
    }),
    instructions: "Place historical events in correct order to build timelines!",
    learningObjectives: "Understand chronology, historical connections",
    estimatedTime: 40,
    pointsReward: 70,
    badgeReward: "History Builder",
    isActive: true
  },
  {
    title: "Robotics Logic Lab",
    description: "Program quirky robots to complete missions at the Kigali Tech Expo",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "simulation",
    difficulty: "advanced",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "robotics",
      robots: ["helper bot", "guard bot", "music bot"],
      logicBlocks: ["if", "repeat", "detect", "celebrate"],
      missions: ["sort recycling", "guard artifacts", "dance show"]
    }),
    instructions: "Arrange logic blocks, test your bot, and fix silly bugs!",
    learningObjectives: "Algorithmic thinking, debugging, STEM exploration",
    estimatedTime: 38,
    pointsReward: 78,
    badgeReward: "Robot Maestro",
    isActive: true
  },
  {
    title: "Space Colony Planner",
    description: "Design a sustainable moon colony for future Rwandan astronauts",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "interactive",
    difficulty: "advanced",
    subject: "Science",
    content: JSON.stringify({
      gameType: "space-planner",
      resources: ["solar power", "oxygen garden", "water recycler"],
      challenges: ["meteor storm", "dust blackout", "team conflict"],
      crew: ["botanist", "pilot", "doctor", "engineer"]
    }),
    instructions: "Balance resources, solve crises, and keep your crew smiling!",
    learningObjectives: "Systems thinking, resource management, collaboration",
    estimatedTime: 40,
    pointsReward: 82,
    badgeReward: "Space Architect",
    isActive: true
  },
  {
    title: "African History Time Travelers",
    description: "Hop through iconic African eras to collect legendary artifacts",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "story",
    difficulty: "advanced",
    subject: "Social Studies",
    content: JSON.stringify({
      gameType: "history-adventure",
      eras: ["Kingdom of Rwanda", "Mali Empire", "Great Zimbabwe"],
      artifacts: ["drum of unity", "scholar's scroll", "trading coin"],
      dilemmas: ["choose ambassador", "solve trade dispute", "decode drum pattern"]
    }),
    instructions: "Make smart choices, learn legendary facts, and return home a hero!",
    learningObjectives: "African history appreciation, critical thinking, empathy",
    estimatedTime: 37,
    pointsReward: 76,
    badgeReward: "Time Traveler",
    isActive: true
  },
  {
    title: "Logic Circuit Challenge",
    description: "Wire logic gates to power a smart city in Kigali",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "puzzle",
    difficulty: "advanced",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "logic-puzzle",
      gates: ["AND", "OR", "NOT", "XOR"],
      missions: ["street lights", "water pumps", "security drones"],
      challenges: ["limited wires", "energy cap", "unexpected surge"]
    }),
    instructions: "Snap gates together, test the circuit, and keep the smart city shining!",
    learningObjectives: "Logic reasoning, computer science foundations, troubleshooting",
    estimatedTime: 33,
    pointsReward: 74,
    badgeReward: "Circuit Commander",
    isActive: true
  },

  // ===== ADDITIONAL GAMES FOR MIXED AGES =====
  {
    title: "Music Rhythm Studio",
    description: "Create beats and learn about rhythm and music",
    grade: "Grade 3",
    ageGroup: "8-9",
    gameType: "creative",
    difficulty: "intermediate",
    subject: "Art",
    content: JSON.stringify({
      gameType: "music-creation",
      instruments: ["drums", "piano", "guitar", "flute"],
      rhythms: ["4/4", "3/4", "2/4"],
      songs: ["simple melodies", "rhythm patterns", "sound effects"]
    }),
    instructions: "Create music by combining different instruments and rhythms!",
    learningObjectives: "Learn about rhythm, music creation, audio patterns",
    estimatedTime: 25,
    pointsReward: 45,
    badgeReward: "Music Maker",
    isActive: true
  },
  {
    title: "Environmental Heroes",
    description: "Learn about protecting the environment through action games",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "simulation",
    difficulty: "intermediate",
    subject: "Science",
    content: JSON.stringify({
      gameType: "environmental",
      actions: ["recycling", "planting trees", "saving water", "clean energy"],
      problems: ["pollution", "deforestation", "waste", "climate change"],
      solutions: ["reduce", "reuse", "recycle", "renewable energy"]
    }),
    instructions: "Help save the environment by making good choices!",
    learningObjectives: "Learn environmental responsibility, sustainability",
    estimatedTime: 30,
    pointsReward: 55,
    badgeReward: "Eco Hero",
    isActive: true
  },
  {
    title: "Money Math Market",
    description: "Practice money skills by shopping and making change",
    grade: "Grade 2",
    ageGroup: "7-8",
    gameType: "simulation",
    difficulty: "intermediate",
    subject: "Math",
    content: JSON.stringify({
      gameType: "money-math",
      coins: ["penny", "nickel", "dime", "quarter"],
      bills: ["1", "5", "10", "20"],
      items: ["apple", "book", "toy", "snack"],
      prices: [0.25, 1.50, 5.00, 12.75]
    }),
    instructions: "Buy items and count money to make correct change!",
    learningObjectives: "Learn money values, addition, subtraction with money",
    estimatedTime: 20,
    pointsReward: 35,
    badgeReward: "Money Master",
    isActive: true
  },
  {
    title: "Body Systems Explorer",
    description: "Learn about human body systems through interactive exploration",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "interactive",
    difficulty: "intermediate",
    subject: "Science",
    content: JSON.stringify({
      gameType: "human-body",
      systems: ["circulatory", "respiratory", "digestive", "nervous"],
      organs: ["heart", "lungs", "stomach", "brain"],
      functions: ["pumping blood", "breathing", "digesting food", "thinking"]
    }),
    instructions: "Explore the human body and learn how different systems work!",
    learningObjectives: "Understand human body systems, organ functions",
    estimatedTime: 35,
    pointsReward: 60,
    badgeReward: "Body Expert",
    isActive: true
  },

  // ===== ADDITIONAL PUZZLE GAMES FOR ALL GRADES =====
  
  // Grade 1 Puzzles
  {
    title: "Jigsaw Picture Puzzles",
    description: "Solve jigsaw puzzles by fitting colorful pieces together",
    grade: "Grade 1",
    ageGroup: "6-7",
    gameType: "puzzle",
    difficulty: "beginner",
    subject: "Art",
    content: JSON.stringify({
      gameType: "jigsaw-puzzle",
      pieces: [4, 6, 9, 12],
      images: ["animals", "shapes", "colors", "toys"],
      difficulty: "easy"
    }),
    instructions: "Drag and drop pieces to complete the picture puzzle!",
    learningObjectives: "Develop spatial awareness, pattern recognition, fine motor skills",
    estimatedTime: 15,
    pointsReward: 25,
    badgeReward: "Puzzle Solver",
    isActive: true
  },
  {
    title: "Sequence Memory Challenge",
    description: "Memorize and repeat color and sound sequences",
    grade: "Grade 1",
    ageGroup: "6-7",
    gameType: "puzzle",
    difficulty: "beginner",
    subject: "Math",
    content: JSON.stringify({
      gameType: "memory-sequence",
      elements: ["colors", "shapes", "sounds", "numbers"],
      sequenceLength: [3, 5, 7],
      difficulty: "easy"
    }),
    instructions: "Watch the sequence and repeat it in the correct order!",
    learningObjectives: "Improve memory, attention span, sequential thinking",
    estimatedTime: 12,
    pointsReward: 20,
    badgeReward: "Memory Master",
    isActive: true
  },

  // Grade 2 Puzzles
  {
    title: "Word Search Adventure",
    description: "Find hidden words in a grid of letters",
    grade: "Grade 2",
    ageGroup: "7-8",
    gameType: "puzzle",
    difficulty: "beginner",
    subject: "Language",
    content: JSON.stringify({
      gameType: "word-search",
      words: ["animal", "color", "shape", "friend"],
      grid: "8x8",
      themes: ["animals", "colors", "school", "family"]
    }),
    instructions: "Find and circle all the hidden words!",
    learningObjectives: "Improve vocabulary, spelling, visual scanning skills",
    estimatedTime: 18,
    pointsReward: 30,
    badgeReward: "Word Hunter",
    isActive: true
  },
  {
    title: "Tangram Challenge",
    description: "Create pictures using geometric shapes",
    grade: "Grade 2",
    ageGroup: "7-8",
    gameType: "puzzle",
    difficulty: "intermediate",
    subject: "Math",
    content: JSON.stringify({
      gameType: "tangram",
      shapes: ["triangle", "square", "parallelogram"],
      pictures: ["house", "cat", "tree", "boat"],
      pieces: [7]
    }),
    instructions: "Use all 7 pieces to recreate the picture!",
    learningObjectives: "Understand shapes, spatial reasoning, problem-solving",
    estimatedTime: 20,
    pointsReward: 35,
    badgeReward: "Shape Artist",
    isActive: true
  },

  // Grade 3 Puzzles
  {
    title: "Sudoku Junior",
    description: "Fill in the missing numbers in a fun 4x4 grid",
    grade: "Grade 3",
    ageGroup: "8-9",
    gameType: "puzzle",
    difficulty: "intermediate",
    subject: "Math",
    content: JSON.stringify({
      gameType: "sudoku-junior",
      grid: "4x4",
      numbers: [1, 2, 3, 4],
      difficulty: ["easy", "medium"]
    }),
    instructions: "Fill each row and column with numbers 1-4 without repeating!",
    learningObjectives: "Develop logical thinking, number sense, problem-solving",
    estimatedTime: 22,
    pointsReward: 40,
    badgeReward: "Sudoku Star",
    isActive: true
  },
  {
    title: "Crossword Puzzles",
    description: "Solve simple crossword puzzles with age-appropriate words",
    grade: "Grade 3",
    ageGroup: "8-9",
    gameType: "puzzle",
    difficulty: "intermediate",
    subject: "Language",
    content: JSON.stringify({
      gameType: "crossword",
      grid: "10x10",
      themes: ["animals", "school", "food", "sports"],
      clues: "picture-based"
    }),
    instructions: "Use the picture clues to fill in the crossword!",
    learningObjectives: "Expand vocabulary, improve spelling, critical thinking",
    estimatedTime: 25,
    pointsReward: 45,
    badgeReward: "Word Wizard",
    isActive: true
  },

  // Grade 4 Puzzles
  {
    title: "Logic Grid Puzzles",
    description: "Use clues to solve mysteries and find relationships",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "puzzle",
    difficulty: "intermediate",
    subject: "Math",
    content: JSON.stringify({
      gameType: "logic-grid",
      categories: ["people", "places", "things", "activities"],
      clues: ["color", "size", "position", "preference"],
      difficulty: "medium"
    }),
    instructions: "Use the clues to figure out who, what, where, and when!",
    learningObjectives: "Develop deductive reasoning, logical thinking, attention to detail",
    estimatedTime: 30,
    pointsReward: 50,
    badgeReward: "Logic Detective",
    isActive: true
  },
  {
    title: "Pattern Building Blocks",
    description: "Create and extend patterns using colorful blocks",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "puzzle",
    difficulty: "intermediate",
    subject: "Math",
    content: JSON.stringify({
      gameType: "pattern-blocks",
      patterns: ["color", "shape", "size", "position"],
      levels: ["simple", "medium", "complex"]
    }),
    instructions: "Follow the pattern and add the next elements!",
    learningObjectives: "Recognize patterns, extend sequences, mathematical reasoning",
    estimatedTime: 20,
    pointsReward: 40,
    badgeReward: "Pattern Master",
    isActive: true
  },

  // Grade 5 Puzzles
  {
    title: "Cryptogram Puzzles",
    description: "Decode secret messages by figuring out letter substitutions",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "puzzle",
    difficulty: "advanced",
    subject: "Language",
    content: JSON.stringify({
      gameType: "cryptogram",
      messages: ["quotes", "sayings", "famous-speech"],
      hints: ["common-letters", "short-words", "frequency"]
    }),
    instructions: "Use letter frequency and common words to decode the message!",
    learningObjectives: "Improve pattern recognition, language skills, logical deduction",
    estimatedTime: 35,
    pointsReward: 60,
    badgeReward: "Code Breaker",
    isActive: true
  },
  {
    title: "3D Shape Puzzles",
    description: "Rotate and assemble 3D shapes to build structures",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "puzzle",
    difficulty: "advanced",
    subject: "Math",
    content: JSON.stringify({
      gameType: "3d-shapes",
      shapes: ["cube", "cylinder", "sphere", "pyramid"],
      structures: ["house", "bridge", "tower", "animal"]
    }),
    instructions: "Rotate 3D shapes and fit them together to complete the structure!",
    learningObjectives: "Understand 3D geometry, spatial reasoning, problem-solving",
    estimatedTime: 30,
    pointsReward: 55,
    badgeReward: "3D Architect",
    isActive: true
  },

  // Grade 6 Puzzles
  {
    title: "Math Equation Solver",
    description: "Solve algebraic puzzles by finding missing values",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "puzzle",
    difficulty: "advanced",
    subject: "Math",
    content: JSON.stringify({
      gameType: "equation-puzzle",
      operations: ["addition", "subtraction", "multiplication", "division"],
      complexity: ["single-unknown", "multiple-unknown", "word-problems"]
    }),
    instructions: "Find the missing number to complete the equation!",
    learningObjectives: "Algebra basics, equation solving, critical thinking",
    estimatedTime: 40,
    pointsReward: 70,
    badgeReward: "Algebra Genius",
    isActive: true
  },
  {
    title: "Riddles and Brain Teasers",
    description: "Solve challenging riddles and logical brain teasers",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "puzzle",
    difficulty: "advanced",
    subject: "Language",
    content: JSON.stringify({
      gameType: "riddles",
      categories: ["logic", "word-play", "math", "science"],
      hints: ["yes-no-questions", "clues"]
    }),
    instructions: "Use logic and creativity to solve each riddle!",
    learningObjectives: "Develop critical thinking, inference skills, creativity",
    estimatedTime: 35,
    pointsReward: 65,
    badgeReward: "Riddle Master",
    isActive: true
  },

  // ===== ADDITIONAL DIGITAL LITERACY COURSES =====

  // Grade 1 Digital Literacy
  {
    title: "Keyboard Explorer",
    description: "Learn the keyboard layout and basic typing",
    grade: "Grade 1",
    ageGroup: "6-7",
    gameType: "interactive",
    difficulty: "beginner",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "typing-basics",
      keys: ["letters", "numbers", "space", "enter"],
      activities: ["find-key", "type-words", "type-sentences"]
    }),
    instructions: "Find and press the keys on the keyboard!",
    learningObjectives: "Learn keyboard layout, basic typing skills, hand-eye coordination",
    estimatedTime: 20,
    pointsReward: 30,
    badgeReward: "Keyboard Pro",
    isActive: true
  },

  // Grade 2 Digital Literacy
  {
    title: "Safe Internet Explorer",
    description: "Learn internet safety rules through interactive scenarios",
    grade: "Grade 2",
    ageGroup: "7-8",
    gameType: "story",
    difficulty: "beginner",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "internet-safety",
      scenarios: ["stranger-danger", "password-safety", "online-privacy"],
      decisions: ["safe-choices", "report-inappropriate"]
    }),
    instructions: "Help the character make safe choices online!",
    learningObjectives: "Understand internet safety, digital citizenship, online privacy",
    estimatedTime: 25,
    pointsReward: 40,
    badgeReward: "Internet Guardian",
    isActive: true
  },

  // Grade 3 Digital Literacy
  {
    title: "Block Code Builder",
    description: "Learn programming by building simple animations",
    grade: "Grade 3",
    ageGroup: "8-9",
    gameType: "simulation",
    difficulty: "intermediate",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "block-coding",
      blocks: ["move", "turn", "repeat", "color", "sound"],
      projects: ["drawing", "animation", "simple-game"]
    }),
    instructions: "Drag blocks to create code and watch your creation come to life!",
    learningObjectives: "Introduction to programming, logical thinking, creativity",
    estimatedTime: 30,
    pointsReward: 50,
    badgeReward: "Coding Beginner",
    isActive: true
  },

  // Grade 4 Digital Literacy
  {
    title: "Digital Art Creator",
    description: "Create digital artwork using drawing and painting tools",
    grade: "Grade 4",
    ageGroup: "9-10",
    gameType: "creative",
    difficulty: "intermediate",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "digital-art",
      tools: ["brush", "pencil", "eraser", "fill", "shapes"],
      colors: "full-palette",
      canvases: ["landscape", "portrait", "abstract", "nature"]
    }),
    instructions: "Use digital art tools to create beautiful artwork!",
    learningObjectives: "Learn digital art tools, express creativity, understand design",
    estimatedTime: 35,
    pointsReward: 60,
    badgeReward: "Digital Artist",
    isActive: true
  },

  // Grade 5 Digital Literacy
  {
    title: "Presentation Builder",
    description: "Create digital presentations with slides and animations",
    grade: "Grade 5",
    ageGroup: "10-11",
    gameType: "creative",
    difficulty: "advanced",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "presentation",
      elements: ["slides", "text", "images", "animation", "sound"],
      templates: ["story", "report", "showcase"]
    }),
    instructions: "Create your own multimedia presentation!",
    learningObjectives: "Learn presentation skills, multimedia design, communication",
    estimatedTime: 40,
    pointsReward: 70,
    badgeReward: "Presentation Master",
    isActive: true
  },

  // Grade 6 Digital Literacy
  {
    title: "HTML & CSS Website Builder",
    description: "Build your first website using HTML and CSS",
    grade: "Grade 6",
    ageGroup: "11-12",
    gameType: "creative",
    difficulty: "advanced",
    subject: "Digital Literacy",
    content: JSON.stringify({
      gameType: "web-design",
      html: ["headings", "paragraphs", "images", "links", "lists"],
      css: ["colors", "fonts", "layout", "backgrounds"],
      templates: ["personal", "project", "portfolio"]
    }),
    instructions: "Write HTML and CSS to build your own website!",
    learningObjectives: "Learn web development basics, HTML/CSS, design principles",
    estimatedTime: 50,
    pointsReward: 85,
    badgeReward: "Web Designer",
    isActive: true
  }
];

module.exports = sampleGamifiedContent;