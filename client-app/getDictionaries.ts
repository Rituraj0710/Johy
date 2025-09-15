

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  hi: () => import("./dictionaries/hi.json").then((module) => module.default),
  // Add more languages as needed
};

export async function getDictionary(lang: string) {
  const dictionary = dictionaries[lang];
  if (!dictionary) {
    throw new Error(`Language ${lang} not supported`);
  }
  return dictionary();
}
