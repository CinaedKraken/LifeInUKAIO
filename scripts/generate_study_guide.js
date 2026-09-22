const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../src/data/mock_tests.json');
const outputPath = path.join(__dirname, '../src/data/study_guide.json');

const chapters = [
  {
    chapterId: 1,
    title: { en: "The values and principles of the UK", zh: "英國的價值觀和原則" },
    keywords: ["value", "principle", "fundamental", "right", "freedom", "citizen", "resident"],
    points: []
  },
  {
    chapterId: 2,
    title: { en: "What is the UK", zh: "什麼是英國" },
    keywords: ["england", "scotland", "wales", "northern ireland", "geography", "population", "island"],
    points: []
  },
  {
    chapterId: 3,
    title: { en: "A long and illustrious history", zh: "悠久而輝煌的歷史" },
    keywords: ["history", "war", "king", "queen", "roman", "viking", "empire", "century", "battle", "tudor", "stuart", "middle age", "norman", "victoria", "world war", "rebellion", "revolution"],
    points: []
  },
  {
    chapterId: 4,
    title: { en: "A modern, thriving society", zh: "現代繁榮的社會" },
    keywords: ["society", "sport", "art", "culture", "religion", "festival", "music", "film", "literature", "poet", "author", "cinema", "custom", "tradition", "leisure", "landmark", "population"],
    points: []
  },
  {
    chapterId: 5,
    title: { en: "The UK Government, the law and your role", zh: "英國政府、法律和你的角色" },
    keywords: ["government", "law", "parliament", "police", "vote", "tax", "court", "minister", "election", "democracy", "monarchy", "justice", "driving", "community"],
    points: []
  }
];

function getChapterId(text) {
  const lowerText = text.toLowerCase();
  let bestChapter = 3; // Default to History if no strong match
  let maxMatches = 0;

  for (const chapter of chapters) {
    let matches = 0;
    for (const keyword of chapter.keywords) {
      if (lowerText.includes(keyword)) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestChapter = chapter.chapterId;
    }
  }
  return bestChapter;
}

function run() {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  let pointIdCounter = 1;

  for (const set of data) {
    for (const question of set.questions) {
      if (!question.explanation || !question.explanation.en) continue;
      
      const chapterId = getChapterId(question.explanation.en);
      const chapter = chapters.find(c => c.chapterId === chapterId);
      
      const point = {
        id: `point-${pointIdCounter++}`,
        questionId: question.id,
        text: question.explanation
      };
      
      chapter.points.push(point);
    }
  }

  const outputData = chapters.map(({ keywords, ...rest }) => rest);
  
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
  console.log(`Successfully generated study guide with ${pointIdCounter - 1} learning points across 5 chapters.`);
}

run();
