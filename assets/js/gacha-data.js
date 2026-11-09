/*
  Gacha content. Edit this file to add the real compliments and voice notes.

  - THREE_STAR / FOUR_STAR: one string per compliment.
  - VOICE_NOTES (the 5 star rewards): put the audio file in assets/audio/voice/
    and set `src` to its path. `transcript` is optional text shown while it plays.
*/
window.GACHA_DATA = {
  THREE_STAR: Array.from({ length: 35 }, (_, i) => `Compliment #${i + 1} is still being written… check back soon!`),

  FOUR_STAR: [
    'Keep this note for a day that needs a little more light.',
    ...Array.from({ length: 14 }, (_, i) => `Special compliment #${i + 2} is still being written… check back soon!`)
  ],

  VOICE_NOTES: [
    { title: 'Voice note #1', src: null, transcript: 'This voice note hasn’t been recorded yet. Soon!' },
    { title: 'Voice note #2', src: null, transcript: 'This voice note hasn’t been recorded yet. Soon!' },
    { title: 'Voice note #3', src: null, transcript: 'This voice note hasn’t been recorded yet. Soon!' }
  ],

  // What you get when you lose the 50/50.
  TOMATO_TEXT: 'Sucks to suck!'
};
