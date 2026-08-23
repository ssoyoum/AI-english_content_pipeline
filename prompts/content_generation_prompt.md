# English Learning Content Generation

Create a complete English learning content package from the user's topic.

## Content requirements

- Write an English learning article of approximately 800–1,000 English characters or a similar short reading passage.
- Use clear, natural English suitable for an intermediate English learner.
- Divide the article into 3–5 meaningful sections.
- Create 8–12 useful vocabulary or expression items.
- Create sentence-level interpretation items from important sentences in the article.
- For each interpretation item, provide a natural Korean translation, a concise learning note, and the exact English terms that deserve emphasis.
- Create one `review_rules` item for every sentence interpretation. Each rule must include the sentence index, one or more core concepts, Korean keywords that indicate understanding, Korean wrong-pattern examples, and a concise Korean feedback message.
- Create exactly 3 conversation questions related to the topic.
- Include a natural sample answer and one concise coaching point for each question.
- Create an audio script containing only the clean English reading text. Do not include headings, markdown, translations, or explanations in the audio script.
- Estimate reading and conversation practice time.

## Important output rules

- Return only the JSON object matching the supplied schema.
- Keep the article, sentence interpretations, vocabulary, questions, and audio script consistent with one another.
- Keep `review_rules` aligned one-to-one with `sentence_interpretations`; use sentence indexes starting at 1.
- Do not invent citations or claim that a source was consulted.
- Use Korean for meanings, translations, and learning notes; use English for the article and example sentences.
