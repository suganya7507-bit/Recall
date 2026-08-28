import { GameRound, MemoryItem, ReminderItem, CaregiverAlert } from '../types';

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem_1',
    title: 'Rohan',
    relationOrSubtitle: 'Grandson',
    description: 'Rohan visiting home during the holidays. He loves eating your homemade pitha and sweet tea.',
    category: 'Family',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxrwtlG1z9ZkOmDm_H63ZNdlbR0pQUXOa80xT5OudftAc1IkOvJEGRZZoUtgj6f4xZb3nhFxUJ0qxVug5n_Q1KmJQdJrGAHyLoMqb11OelcmX9beUhLSwzwgDllDzNe4w_ehGuxifn2tOiMvwOEDXBwvYXSQjzrIZIyoYr_WvJMFs3HGUI6PcWqAvUrcRRRT51q8NW2B9ruLohN3lpH1AT5icznjqNeC9PVaBSjHqBjzmTIm7Njwf6',
    audioText: 'Hi Dadi! This is Rohan. I hope you are having a wonderful morning. Do not forget to drink your afternoon ginger tea with cardamom. Love you so much!',
    voiceNoteDuration: '0:18',
    dateAdded: 'Yesterday'
  },
  {
    id: 'mem_2',
    title: 'Meera',
    relationOrSubtitle: 'Daughter',
    description: 'Meera holding her morning tea on the balcony. She calls every evening at 6:00 PM.',
    category: 'Family',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGrkBzW9xAw0LTq7MxKNK5JFTGrJCoJatrsSpZeCN9TVwkZFL_U4WC7B511_Ghljr-4_PbP2OKS4lMuUoTtkKmwEWSDv2y-7sjYzR2-p-1MsWesoeigq7ysUQJkhqffsW4Cqn4wxVGmXNFLQ_VIFixBwtFpywjeRRF0Qy5TmaxTtdvfFQ8FZDQcHi5sD7sVKOz6UBVa7gUHPKOe5iybHEu6gwk60FcpQD1V2OFOdhNne_BgApW2mhn',
    audioText: 'Namaskar Maa! Meera here. I sent fresh sweet oranges to your doorstep today. Priya will help peel them for you. I will visit you this Sunday afternoon.',
    voiceNoteDuration: '0:22',
    dateAdded: '2 days ago'
  },
  {
    id: 'mem_3',
    title: 'Diwali 2022',
    relationOrSubtitle: 'Family Gathering',
    description: 'The whole family gathered at the old ancestral house in Tezpur. Everyone was so happy to be together.',
    category: 'Family',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrgxfh6OyrG07k_gALtg4gGs4t8RapICmzCJXWIaxkWJa8-HM-LgiyhNb2dpkhYkMzd8j7KSsppvNngWjp84x5tW53zmddrRL6i2gC_YGwl6UWTkGnQkZI185cf5GZL-WvfJyYFNGRkIxaZ4h4Gv2nG4QoNEJeC12OcWsoa5EIF99mHQv6XkNZYD97SpgDmIy7TdipPyS2Icsc0MKA58695i0p8xmXr5I1qco1iWKX47D8o-F_OyJR',
    audioText: 'This was our memorable Diwali gathering in 2022. All children and grandchildren wore traditional silk clothes and shared warm sweets together under the golden evening lanterns.',
    voiceNoteDuration: '0:35',
    dateAdded: 'Nov 2022'
  },
  {
    id: 'mem_4',
    title: 'Brahmaputra Riverfront',
    relationOrSubtitle: 'Guwahati Ghats',
    description: 'Your favorite morning walking path where the morning sun warms the cool breeze from the great river.',
    category: 'Places',
    imageUrl: 'https://images.unsplash.com/photo-1626014303757-6564477577f1?auto=format&fit=crop&w=800&q=80',
    audioText: 'The peaceful view of the Brahmaputra river at sunrise. You used to enjoy sitting by the wooden bench watching the traditional ferry boats.',
    voiceNoteDuration: '0:20',
    dateAdded: '3 weeks ago'
  },
  {
    id: 'mem_5',
    title: 'Morning Cardamom Tea',
    relationOrSubtitle: 'Daily Tea Routine',
    description: 'Fresh organic Assam CTC tea brewed with fresh ginger, crushed green cardamom, and warm milk at 7:30 AM.',
    category: 'Routines',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    audioText: 'Your cherished daily ritual: a hot cup of fragrant Assam tea in your ceramic cup, enjoyed while listening to the morning bird songs.',
    voiceNoteDuration: '0:16',
    dateAdded: '1 week ago'
  }
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem_1',
    title: 'Morning Blood Pressure Tablet',
    time: '10:00 AM',
    category: 'Medication',
    icon: 'pill',
    description: 'Take 1 white tablet (Amlodipine) with warm water after breakfast.',
    completed: false,
    isMissed: true, // As specified in prompt for missed alert flow
    alertSent: true
  },
  {
    id: 'rem_2',
    title: 'Hydration: Glass of Warm Water',
    time: '11:30 AM',
    category: 'Water',
    icon: 'droplet',
    description: 'Drink 1 full tumbler of lukewarm filtered water.',
    completed: false,
    isMissed: false
  },
  {
    id: 'rem_3',
    title: 'Afternoon Lunch & Dal',
    time: '1:00 PM',
    category: 'Meal',
    icon: 'utensils',
    description: 'Steamed Joha rice, yellow moong dal, and boiled potato mash (Alu Pitika).',
    completed: false,
    isMissed: false
  },
  {
    id: 'rem_4',
    title: 'Evening Garden Walk',
    time: '5:00 PM',
    category: 'Activity',
    icon: 'footprints',
    description: 'Gentle 15-minute stroll in the front courtyard with Priya.',
    completed: false,
    isMissed: false
  }
];

export const GAME_ROUNDS: GameRound[] = [
  {
    id: 1,
    promptTitle: 'Find the Traditional Tea Cup',
    promptDescription: 'Tap on the picture of the traditional porcelain tea cup you use for your morning tea.',
    targetName: 'Traditional Tea Cup',
    instructionAudioText: 'Amina, can you find the traditional tea cup? Tap the picture of the tea cup.',
    options: [
      {
        id: 'opt_teacup',
        name: 'Traditional Tea Cup',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfi9oYqZmKgaUPHVPFM76jHmpBwN33xz2aTNTcZzt6g1-gsg4dDqCMnb1HG6UM4vVml91xp5RU9b9kemWJyRXto0wucoYzRMR5JQA1Mtz5rfpW5qXqspknv3ImNh6gaAUvF3AUxUX7jSc7DxZBOOrlRhkAHzo-EuDslspMrhaJxJwyNvVpMP0EunCe06cEVwAJ9BO8ZTdjSdrS38bQc6O8Kf8dh1HoN1uIrdbnYmHui7l8EpY8CwHv',
        altText: 'Traditional ornate porcelain tea cup on a saucer',
        isCorrect: true
      },
      {
        id: 'opt_fan',
        name: 'Woven Hand Fan',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ46mzK7jnHGPUWtK9pwTlZif564jsJxkwIx5jNjSyRZ6FNlCCdJpO5nzfLUNWLK_f3ovrK1lfSZgNKmUo8iBFs3WedfB-isAKFHCMlk69oeF0HOWQl7Cvg3A49oLZOAApeWqGZhB3XIZNSfrH7I6ngnw4ZX7MYZl1WbTJ0lMx_W9PpLk2L45uI46s4l9ok0naMgLgTMGG-n3CmYvYC0jehW_EBYwEkaS5TzgKvroKVRpt1V0st80j',
        altText: 'Traditional hand-woven cane hand fan',
        isCorrect: false
      }
    ],
    hint: 'Look for the cup with the floral saucer that holds warm tea.',
    culturalNote: 'Traditional Assam morning chai in fine porcelain.'
  },
  {
    id: 2,
    promptTitle: 'Find the Traditional Bamboo Basket',
    promptDescription: 'Tap on the picture of the woven bamboo craft basket used for gathering flowers.',
    targetName: 'Bamboo Basket',
    instructionAudioText: 'Can you spot the traditional woven bamboo basket? Tap on the basket.',
    options: [
      {
        id: 'opt_basket',
        name: 'Traditional Bamboo Basket',
        imageUrl: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=600&q=80',
        altText: 'Handmade woven bamboo basket with natural cane texture',
        isCorrect: true
      },
      {
        id: 'opt_lamp',
        name: 'Brass Lamp (Saki / Diya)',
        imageUrl: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=600&q=80',
        altText: 'Traditional polished brass prayer lamp',
        isCorrect: false
      }
    ],
    hint: 'Look for the woven cane container made of natural golden bamboo.',
    culturalNote: 'Handmade Khorahi cane craft of Assam.'
  },
  {
    id: 3,
    promptTitle: 'Find the Local Flower',
    promptDescription: 'Tap on the picture of the blooming Kopou Phool (Foxtail Orchid), the cherished flower of Northeast India.',
    targetName: 'Kopou Orchid Flower',
    instructionAudioText: 'Amina, find the beautiful blooming orchid flower. Tap on the pink and white orchid.',
    options: [
      {
        id: 'opt_orchid',
        name: 'Foxtail Orchid (Kopou Phool)',
        imageUrl: 'https://images.unsplash.com/photo-1566993269603-7e189f20d44c?auto=format&fit=crop&w=600&q=80',
        altText: 'Vibrant pink and white orchid blossom',
        isCorrect: true
      },
      {
        id: 'opt_tealeaf',
        name: 'Fresh Tea Leaves',
        imageUrl: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=600&q=80',
        altText: 'Green two leaves and a bud tea shoot',
        isCorrect: false
      }
    ],
    hint: 'Look for the soft pink and violet blossom that blooms in spring.',
    culturalNote: 'State flower of Assam, symbolic of spring Bihu celebration.'
  }
];

export const INITIAL_ALERTS: CaregiverAlert[] = [
  {
    id: 'alt_1',
    title: 'Missed Medication Reminder',
    subtitle: 'Morning Blood Pressure Tablet (10:00 AM)',
    time: '35 mins ago',
    type: 'missed_reminder',
    resolved: false
  },
  {
    id: 'alt_2',
    title: 'Memory Game Completed',
    subtitle: 'Amina scored 3/3 in Heritage Object Recall',
    time: 'Yesterday at 4:30 PM',
    type: 'game_complete',
    resolved: true
  },
  {
    id: 'alt_3',
    title: 'New Memory Photo Added',
    subtitle: 'Family photo saved by Caregiver Priya',
    time: '2 days ago',
    type: 'memory_added',
    resolved: true
  }
];
