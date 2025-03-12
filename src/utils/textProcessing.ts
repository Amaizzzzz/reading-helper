import { TranslationEntry, HighlightWord } from '../types/translation';

const mockTranslations: { [key: string]: TranslationEntry } = {
  'journey': {
    word: 'journey',
    context: '在学习语言的上下文中表示一个持续的过程',
    suggestions: {
      vocabulary: [
        '相关词: trip (短途旅行), voyage (航行), expedition (探险)',
        '词形变化: journeyed (过去式), journeying (现在分词)',
        '近义词: travel, venture, quest, odyssey'
      ],
      grammar: [
        '可用作名词: embark on a journey',
        '也可用作动词: to journey through life',
        '常见搭配: life journey, spiritual journey, learning journey'
      ],
      usage: [
        '描述人生经历: Life is a journey, not a destination',
        '学习过程: The journey of learning never ends',
        '个人成长: My journey of self-discovery'
      ],
      memory: [
        '记忆技巧: jour (法语"天") + ney，每天的旅程',
        '联想: 人生就像一次旅程，充满未知和冒险',
        '场景记忆: 想象自己正在进行一次难忘的旅程'
      ]
    },
    examples: [
      'Learning a language is a journey that requires patience and dedication.',
      'Every journey begins with a single step.',
      'The journey of self-improvement never truly ends.'
    ],
    difficulty: 2
  },
  'cognitive': {
    word: 'cognitive',
    context: '在教育和心理学上下文中描述思维和学习过程',
    suggestions: {
      vocabulary: [
        '词根: cogn- (知道，认识)',
        '相关词: cognition, recognize, cognizant',
        '反义词: instinctive, emotional'
      ],
      grammar: [
        '形容词用法: cognitive skills',
        '名词形式: cognition',
        '副词形式: cognitively'
      ],
      usage: [
        '心理学术语: cognitive development',
        '教育领域: cognitive learning strategies',
        '神经科学: cognitive neuroscience'
      ],
      memory: [
        '词根记忆: cogn- (知道) + -itive (形容词后缀)',
        '联想记忆: "认知"就像大脑中的计算机处理信息',
        '场景应用: 在学习新知识时运用认知策略'
      ]
    },
    examples: [
      'Cognitive development is crucial in early childhood.',
      'Students need to develop strong cognitive skills.',
      'The cognitive approach to learning emphasizes mental processes.'
    ],
    difficulty: 4
  }
};

export const findHighlightWords = (text: string): HighlightWord[] => {
  const words = text.split(/\s+/);
  const highlights: HighlightWord[] = [];
  let currentIndex = 0;

  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
    if (mockTranslations[cleanWord]) {
      const startIndex = text.indexOf(word, currentIndex);
      highlights.push({
        word: word,
        startIndex: startIndex,
        endIndex: startIndex + word.length,
        translation: mockTranslations[cleanWord]
      });
      currentIndex = startIndex + word.length;
    }
  });

  return highlights;
};

export const getContextAwareTranslation = (
  word: string,
  context: string,
  position: number
): TranslationEntry => {
  const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
  return mockTranslations[cleanWord] || {
    word: word,
    basic: '暂无翻译',
    intermediate: '暂无详细解释',
    advanced: '暂无高级解释',
    examples: ['暂无例句'],
    difficulty: 1,
    context: '暂无上下文解释'
  };
}; 