/*
  Gacha content. Edit this file to change the compliments and voice notes.

  - THREE_STAR / FOUR_STAR: one string per note. Text size adjusts itself to fit.
  - VOICE_NOTES (the 5 star rewards): put the audio file in assets/audio/voice/
    and set `src` to its path. `transcript` is optional text shown while it plays.
*/
window.GACHA_DATA = {
  THREE_STAR: [
    'You make me want to bully you in a nice way.',
    'I still have a massive crush on you, just letting you know.',
    'You look really beautiful, and I want you to know I will always think this way.',
    'You’re a good listener, and I feel better after talking to you.',
    'You make me feel safe.',
    'If you were a jade, you would be stellar.',
    'I’d go P2W and get you to E6 if you were a banner.',
    'I always like your choice in accessories.',
    'You will do great things. I already know it.',
    'As much as you believe in me, I hope you believe in yourself too.',
    'I like you a lot <3',
    'You put effort into the little things. It is really endearing.',
    'I don’t personally know what Chennai is like, but I am sure you make it better.',
    'A wise woman once said, “You’d make an amazing love interest.”',
    'You can make sitting in silence something special.',
    'You have a holdable hand.',
    'When you do your makeup, it’s always so jaw-dropping to see.',
    'You have a boop-able nose.',
    'I like it when you bite me :P',
    'You have amazing music taste.',
    'You have the type of smile that would make someone forget all their worries.',
    'You have a compassionate soul.',
    'You are so whimsical and full of life.',
    'I hope you never lose the part of you that makes you, you.',
    'Never let go of the dreams you hold dear.',
    'You will be a great pilot.',
    'You give the type of hugs that make someone forget everything that’s wrong.',
    'You are fun to be around.',
    'I ship us together <3',
    'Your eyes are a window to a kinder world.',
    'Aren’t you the sweetest girl ever?',
    'You’re my favorite 5 star unit <3',
    'You brighten people’s lives.',
    'You understand the people around you. I hope they do the same for you <3',
    'I hope the world can listen and understand people as well as you do.',
    'I like your weird brain very much.',
    'You inspire the people around you to do better.',
    'If you cast a spell like Wanda and took a town under your control, I would never leave.',
    'Your taste in perfumes is amazing.',
    'You make me look forward to the next day.'
  ],

  FOUR_STAR: [
    'I often daydream about you, the places I would take you to, and how lucky I am to have someone like you in my life. You have made it better in every single way, and I can only hope to give you everything you deserve and so much more, because you deserve nothing but the best.',
    'What do you think of when you draw? Where do the ideas come from? What about the colours? It’s mesmerizing to watch you draw and come up with these amazing things. Your paintings, digital art and craft skills all reflect your hard work and passion. I hope you never stop, and I hope you can host an art exhibition of your own one day.',
    'I hope one day I can build a little garden for you and fill it with everything that would make you smile as brightly as you do. In this garden, I’d make a swing just for you, so you can daydream without ever having to wait your turn again.',
    'I often imagine a medieval world where you are a beautiful dame who can do anything she sets her mind to. If you were accused of being a witch, I’d perform magic with you. If you were to take up the sword, I’d gladly be your sparring partner. If you were a queen, I’d only hope I had the privilege of courting you. If you were an artist, I’d buy all of your pieces and make sure the world could see the beauty you bring to it.',
    'You’re the type of girl they write poetry about. They could only hope to capture the essence of who you are, but I think they would always fall short. I am no exception to this rule. I could invent new words and learn different languages, and I still wouldn’t be able to truly describe you to someone else.',
    'You have this charm about you that draws people in. You’re bright and enthusiastic about the things you love and can keep raving about them day after day. Not many people can be that openly passionate about the things that mean the most to them. I am glad that you always are, and I hope you will always be this way.',
    'The rooftop in Penacony was so beautiful to see. Thank you for showing me something like that; it was truly so special. You know, I hope I can show you something like that in the future, minus the whole overarching politics of Penacony. I am not good at politics.'
  ],

  VOICE_NOTES: [
    {
      title: 'Voice note #1',
      src: 'assets/audio/voice/note1.mp3',
      transcript: "Happy birthday! You are officially 21! You are now old as shit! No, I’m kidding, I’m just being an ass. I hope that your day is filled with nothing but happy memories, surrounded by the people you cherish! It’s a shame I couldn’t be there with you, but I’ll try to make it special for you in my own way. You are an amazing person who deserves everything this world has to offer, and I hope that the coming years will be kind to you. I know sometimes shit can be pretty tough and horrid, but I want you to know that I will always believe in you, because I know you will always find a way out of any predicament that life throws at you. Happy birthday once again, and have an amazing day, my beautiful butterfly.",
      // When each word of the transcript is spoken (seconds). Made from the audio; redo if the transcript changes.
      times: [0.39, 0.67, 1.99, 2.19, 2.47, 3.61, 4.74, 4.9, 5.1, 5.58, 6.05, 6.53, 7.01, 7.17, 7.41, 7.77, 7.97, 8.17, 8.41, 8.57, 9.86, 9.94, 10.22, 10.5, 10.74, 10.98, 11.22, 11.62, 11.86, 12.22, 12.5, 12.94, 13.7, 14.42, 14.58, 14.78, 15.14, 15.38, 16.61, 16.77, 16.93, 17.25, 17.37, 17.73, 17.93, 18.17, 18.41, 18.61, 18.85, 19.09, 19.29, 19.45, 19.65, 19.81, 20.21, 20.37, 20.53, 20.69, 20.85, 21.59, 22.34, 22.42, 22.58, 22.78, 23.3, 23.83, 24.35, 25.03, 25.51, 25.83, 26.11, 26.31, 26.51, 27.37, 27.45, 27.61, 27.93, 28.13, 28.33, 28.69, 29.13, 29.37, 29.53, 29.81, 30.46, 31.11, 31.19, 31.43, 31.91, 32.19, 32.35, 32.51, 32.79, 33.11, 33.35, 34.63, 34.71, 34.83, 35.03, 35.19, 35.35, 35.59, 35.79, 35.95, 36.23, 36.63, 36.99, 37.23, 37.63, 37.99, 38.23, 38.59, 38.79, 39.07, 39.43, 39.79, 39.95, 40.23, 40.39, 40.55, 40.79, 41.43, 41.59, 41.83, 42.23, 42.39, 43.94, 44.18, 44.7, 45.1, 45.54, 45.86, 46.1, 46.34, 47.02, 47.38, 47.62, 48.3]
    },
    {
      title: 'Voice note #2',
      src: 'assets/audio/voice/note2.mp3',
      transcript: "You know, I am recording these after writing all of the other little notes. You would think I would have run out of things to say about you, but for some reason, I haven’t. If it were anyone else, by the fifth note, I would have given up.\n\nYou are different. You are unique. You are simply you, and that’s what makes you special, you know? You are the only Tanvi I want the pleasure of knowing. You are the only Tanvi whose hands I want the privilege of holding. You are the only Tanvi whom I want to cherish and confide in, and you are the only Tanvi I will ever open my heart to.\n\nI don’t have to worry about the things that bother me, because I know I can talk to you about it. There isn’t a constant thought of doing things right, most of the time. Don’t get me wrong, I want to always get things right with you, because you deserve only the best. When things don’t go to plan, I know you’ll be there to laugh at my misery and cheer me up anyways.\n\nThank you for being a part of my life.\n\nAnd thank you for being you.",
      // When each word of the transcript is spoken (seconds). Made from the audio; redo if the transcript changes.
      times: [0.26, 0.34, 0.58, 0.78, 0.98, 1.58, 1.94, 2.26, 2.78, 2.98, 3.14, 3.34, 3.78, 4.14, 5.35, 5.43, 5.67, 5.91, 6.11, 6.27, 6.47, 6.71, 6.91, 7.07, 7.35, 7.55, 7.83, 8.11, 9.32, 9.52, 9.72, 10.04, 10.98, 11.14, 12.93, 13.05, 13.27, 13.49, 14.09, 14.73, 14.97, 15.17, 15.57, 15.97, 16.13, 16.29, 16.49, 16.77, 18.63, 18.79, 19.19, 20.74, 20.78, 21.02, 23.72, 23.84, 24.08, 24.64, 25.86, 26.06, 26.58, 26.94, 27.34, 27.62, 28.26, 28.46, 29.96, 30.12, 30.32, 30.56, 31.06, 31.56, 31.76, 31.96, 32.2, 32.68, 32.88, 34.34, 34.46, 34.66, 34.9, 35.36, 35.82, 36.22, 36.74, 37.02, 37.22, 37.38, 37.94, 38.1, 39.4, 39.52, 39.72, 39.96, 40.69, 41.41, 41.61, 41.81, 41.93, 42.13, 42.65, 42.85, 43.45, 45.22, 45.34, 45.46, 45.62, 45.82, 46.26, 46.7, 46.86, 47.14, 47.62, 48.14, 48.42, 48.78, 50.57, 50.61, 50.85, 50.97, 51.13, 51.49, 51.65, 51.85, 52.13, 52.37, 52.81, 53.09, 53.37, 53.57, 53.85, 54.01, 54.21, 54.45, 54.57, 54.77, 55.05, 56.04, 56.2, 56.6, 56.8, 57.52, 57.88, 58.16, 58.6, 59.0, 59.36, 59.6, 59.72, 59.92, 61.09, 61.37, 61.53, 61.73, 62.21, 62.45, 62.61, 62.85, 63.33, 63.65, 64.01, 64.37, 64.61, 65.09, 65.49, 65.73, 66.37, 66.61, 66.85, 69.13, 69.37, 69.73, 70.05, 70.25, 70.49, 70.97, 71.21, 71.57, 71.97, 72.33, 72.69, 73.09, 73.53, 73.73, 73.93, 74.45, 74.65, 74.97, 75.21, 75.41, 77.83, 78.07, 78.27, 78.67, 78.95, 79.19, 79.43, 79.63, 79.91, 81.03, 81.19, 81.55, 81.79, 82.15, 82.45]
    },
    {
      title: 'Voice note #3',
      src: 'assets/audio/voice/note3.mp3',
      transcript: "I like the little things you do.\n\nWhen you send me photos of your regular days, it makes me feel like you never really left, you know?\n\nAnd when you texted me about the random thought you had while daydreaming, it made me feel close to you.\n\nThe photo of the bunny apples you cut made me feel happy.\n\nThe video of you making chai for everyone made me smile.\n\nAnd when, on Diwali, you sent me a four-minute-long video of you looking like you just walked out of a painting, and all of the decorations that you did, my heart had already melted.\n\nChecking up on me when I’m sick, or just sending me random reels and reassuring my stupid, overthinking brain, it makes me feel noticed and heard.\n\nI’ll be pretty honest with you: seeing a notification from you makes my day better. It can be the smallest thing or a much bigger thing.\n\nI think that’s what makes you really special, you know? You notice these small things about people, and you’re there for them. The people around you are lucky to have someone as kind and, quite honestly, mesmerizing as you.\n\nI hope your life can be filled with as much beauty and joy as you give to the people around you.\n\nKeep being curious, keep doing new things, silly things; it doesn’t matter.\n\nBut hey, never let someone put you down. Don’t let someone tell you that you can’t do something, because I know you can when you put your mind to it.\n\nOh, and if someone does ever put you down? You can be sure that I will be taking swift care of said person.",
      // When each word of the transcript is spoken (seconds). Made from the audio; redo if the transcript changes.
      times: [0.13, 0.29, 0.57, 0.81, 1.17, 1.49, 1.69, 2.44, 2.6, 2.76, 3.04, 3.24, 3.84, 4.04, 4.36, 5.04, 5.93, 6.25, 6.85, 7.17, 7.53, 7.81, 8.21, 8.61, 8.97, 9.45, 9.65, 11.05, 11.09, 11.13, 11.25, 11.73, 11.93, 12.13, 12.29, 12.77, 13.09, 13.29, 13.49, 13.77, 14.5, 15.24, 15.44, 15.64, 15.88, 16.2, 16.32, 17.51, 17.59, 18.23, 18.39, 18.59, 18.99, 19.51, 19.71, 20.07, 20.43, 20.71, 21.03, 21.7, 22.36, 22.88, 23.08, 23.4, 23.92, 24.4, 24.72, 25.48, 25.76, 26.0, 28.13, 28.21, 28.41, 28.57, 29.21, 29.41, 29.85, 30.05, 30.73, 31.41, 32.36, 32.48, 32.72, 33.04, 33.24, 33.44, 33.72, 34.12, 34.28, 34.44, 34.6, 35.32, 36.04, 36.24, 36.32, 36.44, 37.44, 37.64, 37.92, 38.44, 38.88, 39.32, 39.56, 40.08, 41.09, 41.45, 41.65, 41.85, 42.01, 42.21, 42.49, 42.85, 43.05, 43.25, 43.65, 43.89, 44.41, 45.41, 45.53, 46.25, 46.41, 46.93, 47.65, 49.03, 49.19, 49.55, 49.83, 50.31, 50.99, 51.27, 52.97, 53.09, 53.29, 53.57, 53.97, 54.17, 54.89, 55.13, 55.33, 56.17, 56.41, 56.69, 56.97, 57.21, 57.49, 58.85, 58.97, 59.17, 59.37, 59.57, 60.33, 61.09, 61.33, 61.53, 61.77, 62.17, 63.75, 63.87, 64.11, 64.47, 64.79, 65.19, 65.43, 65.79, 66.43, 66.63, 67.65, 67.81, 68.45, 68.77, 69.25, 69.61, 69.97, 70.29, 70.49, 70.77, 71.01, 71.13, 71.87, 72.61, 72.89, 73.25, 73.49, 73.73, 74.13, 74.33, 74.61, 75.09, 75.37, 75.73, 76.25, 76.57, 77.49, 78.45, 78.61, 80.49, 80.57, 80.77, 80.97, 81.21, 81.41, 81.61, 82.01, 82.21, 82.45, 82.73, 83.21, 83.45, 83.95, 84.45, 84.65, 84.81, 84.97, 85.17, 85.49, 85.85, 87.94, 88.18, 88.54, 89.83, 90.19, 90.63, 90.95, 91.35, 91.95, 92.35, 92.55, 92.99, 94.44, 94.6, 96.01, 96.25, 96.49, 96.89, 97.05, 97.21, 98.98, 99.22, 99.46, 99.86, 100.14, 100.5, 100.7, 100.86, 101.14, 101.38, 101.74, 101.98, 102.18, 102.46, 102.66, 103.08, 103.5, 103.62, 103.82, 104.02, 104.3, 104.46, 105.06, 105.26, 105.54, 105.78, 106.34, 106.66, 107.1, 107.34, 107.58, 108.55, 108.63, 108.87, 109.15, 109.55, 109.79, 109.99, 110.31, 110.59, 111.11, 111.71, 112.19, 112.43, 112.79]
    }
  ],

  // What you get when you lose the 50/50.
  TOMATO_TEXT: 'Sucks to suck!'
};
