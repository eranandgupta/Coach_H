// ScreenPal video configuration
// Videos are organized by category with direct ScreenPal embed URLs

export interface ScreenPalVideo {
  id: string;
  title: string;
  embedUrl: string;
  thumbnail?: string;
}

export interface VideoCategory {
  id: string;
  name: string;
  folderName: string;
  videos: ScreenPalVideo[];
  channelUrl?: string;
  displayCount?: number;
  requiredPlans?: string[];
  parentId?: string; // marks this as a sub-category
  subCategories?: VideoCategory[]; // child categories for folder structure
}

// Video categories with ScreenPal videos
export const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: 'chest',
    name: 'Chest workout',
    folderName: 'Chest workout',
    videos: [
      {
        id: 'cTlZFhnY85E',
        title: 'Cable Chest Press',
        embedUrl: 'https://go.screenpal.com/player/cTlZFhnY85E',
      },
      {
        id: 'cTleXynqM8v',
        title: 'Declined Barbell Press',
        embedUrl: 'https://go.screenpal.com/player/cTleXynqM8v',
      },
      {
        id: 'cTleXynqM8w',
        title: 'Dumbbell Press',
        embedUrl: 'https://go.screenpal.com/player/cTleXynqM8w',
      },
      {
        id: 'cTleXynqM8x',
        title: 'Inclined Barbell Bench Press',
        embedUrl: 'https://go.screenpal.com/player/cTleXynqM8x',
      },
      {
        id: 'cTleXynqM8y',
        title: 'Declined Dumbbell Press',
        embedUrl: 'https://go.screenpal.com/player/cTleXynqM8y',
      },
      {
        id: 'cTleXynqM84',
        title: 'Pec Dec Fly',
        embedUrl: 'https://go.screenpal.com/player/cTleXynqM84',
      },
      {
        id: 'cTleXynqM8a',
        title: 'Inclined Dumbbell Press',
        embedUrl: 'https://go.screenpal.com/player/cTleXynqM8a',
      },
      {
        id: 'cTleXynqM8z',
        title: 'Bench Press',
        embedUrl: 'https://go.screenpal.com/player/cTleXynqM8z',
      },
      {
        id: 'cTleXynqM8A',
        title: 'Knee Pushups',
        embedUrl: 'https://go.screenpal.com/player/cTleXynqM8A',
      },
      {
        id: 'cTleXynqM8B',
        title: 'Push Ups',
        embedUrl: 'https://go.screenpal.com/player/cTleXynqM8B',
      },
    ],
  },
  {
    id: 'back',
    name: 'Back workout',
    folderName: 'Back workout',
    videos: [
      {
        id: 'cTlTQ6nYPxL',
        title: 'Barbell Bentover Row',
        embedUrl: 'https://go.screenpal.com/player/cTlTQ6nYPxL',
      },
      {
        id: 'cTlZbdnY8Cu',
        title: 'Straight Arm Lat Pulldown',
        embedUrl: 'https://go.screenpal.com/player/cTlZbdnY8Cu',
      },
      {
        id: 'cTleIhnqLFr',
        title: 'Deadlift',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLFr',
      },
      {
        id: 'cTleIhnqLF0',
        title: 'Barbell Shrugs',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLF0',
      },
      {
        id: 'cTleIhnqLFT',
        title: 'Close Grip Lat Pulldown',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLFT',
      },
      {
        id: 'cTleIhnqLFO',
        title: 'Seated Cable Row',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLFO',
      },
      {
        id: 'cTleIhnqLFt',
        title: 'Lat Pulldown',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLFt',
      },
      {
        id: 'cTleIhnqLF3',
        title: 'Superman',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLF3',
      },
      {
        id: 'cTleIhnqLFu',
        title: 'Sumo Deadlift',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLFu',
      },
      {
        id: 'cTleIhnqLFU',
        title: 'Dumbbell Bentover Row',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLFU',
      },
      {
        id: 'cTleIhnqLFv',
        title: 'Dumbbell Shrugs',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLFv',
      },
      {
        id: 'cTleIhnqLFw',
        title: 'One Arm Row',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLFw',
      },
      {
        id: 'cTleIhnqLFx',
        title: 'Chest Supported Row',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLFx',
      },
      {
        id: 'cTleIhnqLFy',
        title: 'Hyper Extension',
        embedUrl: 'https://go.screenpal.com/player/cTleIhnqLFy',
      },
    ],
  },
  {
    id: 'shoulders',
    name: 'Shoulders workout',
    folderName: 'Shoulders workout',
    videos: [
      {
        id: 'cTlTj4nYPUN',
        title: 'Reverse Pec Dec Fly',
        embedUrl: 'https://go.screenpal.com/player/cTlTj4nYPUN',
      },
      {
        id: 'cTlhiYnqWqM',
        title: 'Dumbbell Shoulder Press',
        embedUrl: 'https://go.screenpal.com/player/cTlhiYnqWqM',
      },
      {
        id: 'cTlhiYnqWqL',
        title: 'Face Pull',
        embedUrl: 'https://go.screenpal.com/player/cTlhiYnqWqL',
      },
      {
        id: 'cTlhiYnqWqP',
        title: 'Barbell Shoulder Press',
        embedUrl: 'https://go.screenpal.com/player/cTlhiYnqWqP',
      },
      {
        id: 'cTlhiYnqWq9',
        title: 'Dumbbell Lateral Raise',
        embedUrl: 'https://go.screenpal.com/player/cTlhiYnqWq9',
      },
      {
        id: 'cTlhiYnqWqR',
        title: 'Barbell Prone High Row',
        embedUrl: 'https://go.screenpal.com/player/cTlhiYnqWqR',
      },
      {
        id: 'cTlhiYnqWqS',
        title: 'Dumbbell Front Raise',
        embedUrl: 'https://go.screenpal.com/player/cTlhiYnqWqS',
      },
      {
        id: 'cTlhiAnqW38',
        title: 'Seated Dumbbell Shoulder Press',
        embedUrl: 'https://go.screenpal.com/player/cTlhiAnqW38',
      },
      {
        id: 'cTlhignqW0q',
        title: 'Cable Lateral Raise',
        embedUrl: 'https://go.screenpal.com/player/cTlhignqW0q',
      },
    ],
  },
  {
    id: 'biceps',
    name: 'Biceps workout',
    folderName: 'Biceps workout',
    videos: [
      {
        id: 'cTlZFjnY85M',
        title: 'Concentration Curl',
        embedUrl: 'https://go.screenpal.com/player/cTlZFjnY85M',
      },
      {
        id: 'cTlhionqWFk',
        title: 'Preacher Single Arm',
        embedUrl: 'https://go.screenpal.com/player/cTlhionqWFk',
      },
      {
        id: 'cTlhiFnqWqy',
        title: 'Hammer Curl',
        embedUrl: 'https://go.screenpal.com/player/cTlhiFnqWqy',
      },
      {
        id: 'cTlhiDnqWqe',
        title: 'Seated Cable Curl',
        embedUrl: 'https://go.screenpal.com/player/cTlhiDnqWqe',
      },
      {
        id: 'cTleIJnqLu3',
        title: 'Reverse Barbell Curl',
        embedUrl: 'https://go.screenpal.com/player/cTleIJnqLu3',
      },
      {
        id: 'cTleIJnqLuT',
        title: 'Barbell Curl',
        embedUrl: 'https://go.screenpal.com/player/cTleIJnqLuT',
      },
      {
        id: 'cTleIJnqLuO',
        title: 'Dumbbell Curl',
        embedUrl: 'https://go.screenpal.com/player/cTleIJnqLuO',
      },
      {
        id: 'cTleIJnqLut',
        title: 'Cable Curl',
        embedUrl: 'https://go.screenpal.com/player/cTleIJnqLut',
      },
      {
        id: 'cTleIJnqLuu',
        title: 'Seated Reverse Cable Curl',
        embedUrl: 'https://go.screenpal.com/player/cTleIJnqLuu',
      },
      {
        id: 'cTleIJnqLuU',
        title: 'Preacher Curl',
        embedUrl: 'https://go.screenpal.com/player/cTleIJnqLuU',
      },
      {
        id: 'cTleIJnqLuv',
        title: 'Preacher Double Arm Curl',
        embedUrl: 'https://go.screenpal.com/player/cTleIJnqLuv',
      },
      {
        id: 'cTleIJnqLuw',
        title: 'Preacher Double Arm Hammer Curl',
        embedUrl: 'https://go.screenpal.com/player/cTleIJnqLuw',
      },
      {
        id: 'cTleIJnqLux',
        title: 'Preacher Single Arm Hammer Curl',
        embedUrl: 'https://go.screenpal.com/player/cTleIJnqLux',
      },
    ],
  },
  {
    id: 'triceps',
    name: 'Triceps workout',
    folderName: 'Triceps workout',
    videos: [
      {
        id: 'cTlZbNnY8Cs',
        title: 'Close Grip Knee Push Up',
        embedUrl: 'https://go.screenpal.com/player/cTlZbNnY8Cs',
      },
      {
        id: 'cTlZbPnY8CS',
        title: 'Close Grip Push Ups',
        embedUrl: 'https://go.screenpal.com/player/cTlZbPnY8CS',
      },
      {
        id: 'cTlZb9nY85i',
        title: 'Overhead Rope Extension',
        embedUrl: 'https://go.screenpal.com/player/cTlZb9nY85i',
      },
      {
        id: 'cTlZFcnY85b',
        title: 'Single Arm Cable Extensions',
        embedUrl: 'https://go.screenpal.com/player/cTlZFcnY85b',
      },
      {
        id: 'cTlZFnnY85T',
        title: 'Single Arm Cable Tricep Pushdowns',
        embedUrl: 'https://go.screenpal.com/player/cTlZFnnY85T',
      },
      {
        id: 'cTleIZnqL3d',
        title: 'Declined Close Grip Barbell Press',
        embedUrl: 'https://go.screenpal.com/player/cTleIZnqL3d',
      },
      {
        id: 'cTleIZnqL3K',
        title: 'Cable Pushdown',
        embedUrl: 'https://go.screenpal.com/player/cTleIZnqL3K',
      },
      {
        id: 'cTleIZnqL37',
        title: 'Cable Extension',
        embedUrl: 'https://go.screenpal.com/player/cTleIZnqL37',
      },
      {
        id: 'cTleIZnqL3s',
        title: 'Close Grip Bench Press',
        embedUrl: 'https://go.screenpal.com/player/cTleIZnqL3s',
      },
      {
        id: 'cTleIZnqL3M',
        title: 'Declined Dumbbell Squeeze Press',
        embedUrl: 'https://go.screenpal.com/player/cTleIZnqL3M',
      },
    ],
  },
  {
    id: 'legs',
    name: 'Legs workout',
    folderName: 'Legs workout',
    videos: [
      {
        id: 'cTlZbsnY8CE',
        title: 'Hip Thrust',
        embedUrl: 'https://go.screenpal.com/player/cTlZbsnY8CE',
      },
      {
        id: 'cTlOfTnY9tA',
        title: 'Single Leg Extension',
        embedUrl: 'https://go.screenpal.com/player/cTlOfTnY9tA',
      },
      {
        id: 'cTlZFfnY85B',
        title: 'Romanian Deadlift (DB)',
        embedUrl: 'https://go.screenpal.com/player/cTlZFfnY85B',
      },
      {
        id: 'cTlhiVnqWou',
        title: 'Lunges',
        embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWou',
      },
      {
        id: 'cTlhiVnqWov',
        title: 'Machine Hip Abduction',
        embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWov',
      },
      {
        id: 'cTlhiVnqWoU',
        title: 'Leg Curl',
        embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWoU',
      },
      {
        id: 'cTlhiVnqWow',
        title: 'Machine Hip Adduction',
        embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWow',
      },
      {
        id: 'cTlhiVnqWoy',
        title: 'Front Squats',
        embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWoy',
      },
      {
        id: 'cTlhiVnqWo4',
        title: 'Leg Extension',
        embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWo4',
      },
      {
        id: 'cTlhiVnqWoa',
        title: 'Back Squats',
        embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWoa',
      },
      {
        id: 'cTlhiVnqWoz',
        title: 'Calf Raises',
        embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWoz',
      },
      {
        id: 'cTlhiVnqWoA',
        title: 'Single Leg Curl',
        embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWoA',
      },
    ],
  },
  {
    id: 'abs',
    name: 'Abs & Core',
    folderName: 'Abs workout',
    videos: [
      {
        id: 'cTleI0nqL3T',
        title: 'Reverse Crunches',
        embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3T',
      },
      {
        id: 'cTleI0nqL3O',
        title: 'Side Bend',
        embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3O',
      },
      {
        id: 'cTleI0nqL3t',
        title: 'Wood Chopper',
        embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3t',
      },
      {
        id: 'cTleI0nqL3u',
        title: 'Side Plank',
        embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3u',
      },
      {
        id: 'cTleI0nqL3U',
        title: 'Torso Rotation',
        embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3U',
      },
      {
        id: 'cTleI0nqL3v',
        title: 'Crunches',
        embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3v',
      },
      {
        id: 'cTleI0nqL3w',
        title: 'Plank',
        embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3w',
      },
    ],
  },
  {
    id: 'stretching',
    name: 'Stretching',
    folderName: 'Stretching',
    videos: [
      {
        id: 'cTlTQrnYPyk',
        title: 'Triceps Stretch',
        embedUrl: 'https://go.screenpal.com/player/cTlTQrnYPyk',
      },
      {
        id: 'cTlTQTnYP4V',
        title: 'Bow Pose',
        embedUrl: 'https://go.screenpal.com/player/cTlTQTnYP4V',
      },
      {
        id: 'cTleIOnqL0X',
        title: 'Hamstring Stretch',
        embedUrl: 'https://go.screenpal.com/player/cTleIOnqL0X',
      },
      {
        id: 'cTleIOnqL0l',
        title: 'Arm Line Stretch',
        embedUrl: 'https://go.screenpal.com/player/cTleIOnqL0l',
      },
      {
        id: 'cTleIOnqL0I',
        title: 'Lats Stretch',
        embedUrl: 'https://go.screenpal.com/player/cTleIOnqL0I',
      },
      {
        id: 'cTleIOnqL0o',
        title: 'Box Hamstring Stretch',
        embedUrl: 'https://go.screenpal.com/player/cTleIOnqL0o',
      },
      {
        id: 'cTleIOnqL0D',
        title: 'Quads Stretch',
        embedUrl: 'https://go.screenpal.com/player/cTleIOnqL0D',
      },
      {
        id: 'cTleIOnqL0b',
        title: 'Chest Stretch',
        embedUrl: 'https://go.screenpal.com/player/cTleIOnqL0b',
      },
      {
        id: 'cTleIOnqL0F',
        title: 'Traps Stretch',
        embedUrl: 'https://go.screenpal.com/player/cTleIOnqL0F',
      },
      {
        id: 'cTleIBnqLOV',
        title: 'Ball Chakrasana',
        embedUrl: 'https://go.screenpal.com/player/cTleIBnqLOV',
      },
    ],
  },
  {
    id: 'warmup',
    name: 'Warm Up',
    folderName: 'Warm Up',
    videos: [
      {
        id: 'cTlhi8nqWTS',
        title: 'Chest Fly',
        embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWTS',
      },
      {
        id: 'cTlhi8nqWTW',
        title: 'Cat Cow',
        embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWTW',
      },
      {
        id: 'cTlhi8nqWOc',
        title: 'Hip Rotation',
        embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWOc',
      },
      {
        id: 'cTlhi8nqWOV',
        title: 'Scapula Retraction Protraction',
        embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWOV',
      },
      {
        id: 'cTlhi8nqWOn',
        title: 'Wrist Rotation',
        embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWOn',
      },
      {
        id: 'cTlhi8nqWOe',
        title: 'Neck Rotation',
        embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWOe',
      },
      {
        id: 'cTlhi8nqWOf',
        title: 'Scapula Elevation Depression',
        embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWOf',
      },
      {
        id: 'cTlhjVnqWOJ',
        title: 'Toe Touches',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOJ',
      },
      {
        id: 'cTlhjVnqWOd',
        title: 'Elbow Flexion',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOd',
      },
      {
        id: 'cTlhjVnqWOK',
        title: 'Neck Flexion Extension Lateral Flexion',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOK',
      },
      {
        id: 'cTlhjVnqWO7',
        title: 'Squat',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWO7',
      },
      {
        id: 'cTlhjVnqWOs',
        title: 'Thoracic Rotation',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOs',
      },
      {
        id: 'cTlhjVnqWOM',
        title: 'Ankle Rotate',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOM',
      },
      {
        id: 'cTlhjVnqWOL',
        title: 'Leg Raises',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOL',
      },
      {
        id: 'cTlhjVnqWtn',
        title: 'Leg Swing',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWtn',
      },
      {
        id: 'cTlhjVnqWte',
        title: 'Shrugs',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWte',
      },
      {
        id: 'cTlhjVnqWtf',
        title: 'Trunk Rotation',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWtf',
      },
      {
        id: 'cTlhjVnqWth',
        title: 'Calf Raise',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWth',
      },
      {
        id: 'cTlhjVnqWt1',
        title: 'Shoulder Rotation',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWt1',
      },
      {
        id: 'cTlhjVnqWti',
        title: 'Spine Lateral Flexion',
        embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWti',
      },
    ],
  },
  {
    id: 'rehabilitation',
    name: 'Rehabilitation',
    folderName: 'Rehabilitation',
    requiredPlans: ['Rehabilitation Plan'],
    videos: [],
    subCategories: [
      {
        id: 'rehab_spine',
        name: 'Spine & Core',
        folderName: 'Spine & Core',
        parentId: 'rehabilitation',
        videos: [
          { id: 'cOfVbLnTBgf', title: 'Bird Dog', embedUrl: 'https://go.screenpal.com/player/cOfVbLnTBgf' },
          { id: 'cOfVbLnTBgh', title: 'Curl Up', embedUrl: 'https://go.screenpal.com/player/cOfVbLnTBgh' },
          { id: 'cOfVbLnTBg1', title: 'Dead Bug', embedUrl: 'https://go.screenpal.com/player/cOfVbLnTBg1' },
          { id: 'cOfVbLnTBgi', title: 'Lying Knee to Chest', embedUrl: 'https://go.screenpal.com/player/cOfVbLnTBgi' },
          { id: 'cOfVbLnTBgj', title: 'Seated Thoracic Extension', embedUrl: 'https://go.screenpal.com/player/cOfVbLnTBgj' },
        ],
      },
      {
        id: 'rehab_shoulder',
        name: 'Shoulder',
        folderName: 'Shoulder',
        parentId: 'rehabilitation',
        videos: [
          { id: 'cOfVbHnTBAC', title: 'Isometric Shoulder Abduction', embedUrl: 'https://go.screenpal.com/player/cOfVbHnTBAC' },
          { id: 'cOfVbHnTBA5', title: 'Isometric Shoulder Flexion', embedUrl: 'https://go.screenpal.com/player/cOfVbHnTBA5' },
          { id: 'cOfVbHnTBAE', title: 'Pendulum Swing', embedUrl: 'https://go.screenpal.com/player/cOfVbHnTBAE' },
          { id: 'cOfVbHnTBAG', title: 'Resistance Band External Rotation', embedUrl: 'https://go.screenpal.com/player/cOfVbHnTBAG' },
          { id: 'cOfVbHnTBAm', title: 'Resistance Band Internal Rotation', embedUrl: 'https://go.screenpal.com/player/cOfVbHnTBAm' },
          { id: 'cOfVbHnTBAH', title: 'Scapula Depression', embedUrl: 'https://go.screenpal.com/player/cOfVbHnTBAH' },
          { id: 'cOfVbHnTBAJ', title: 'Scapula Elevation', embedUrl: 'https://go.screenpal.com/player/cOfVbHnTBAJ' },
          { id: 'cOfVbHnTBAd', title: 'Scapula Protraction', embedUrl: 'https://go.screenpal.com/player/cOfVbHnTBAd' },
          { id: 'cOfVbHnTBAK', title: 'Scapula Retraction', embedUrl: 'https://go.screenpal.com/player/cOfVbHnTBAK' },
          { id: 'cOfVb4nTBav', title: 'Forearm Supination & Pronation', embedUrl: 'https://go.screenpal.com/player/cOfVb4nTBav' },
          { id: 'cOfVb4nTBaw', title: 'Isometric Grip Squeeze', embedUrl: 'https://go.screenpal.com/player/cOfVb4nTBaw' },
          { id: 'cOfVb4nTBax', title: 'Soft Ball Squeeze', embedUrl: 'https://go.screenpal.com/player/cOfVb4nTBax' },
        ],
      },
      {
        id: 'rehab_knee',
        name: 'Knee & Hip',
        folderName: 'Knee & Hip',
        parentId: 'rehabilitation',
        videos: [
          { id: 'cOfVbBnTBz2', title: 'Glute Bridge', embedUrl: 'https://go.screenpal.com/player/cOfVbBnTBz2' },
          { id: 'cOfVbBnTBzo', title: 'Heel Slides', embedUrl: 'https://go.screenpal.com/player/cOfVbBnTBzo' },
          { id: 'cOfVbBnTBzD', title: 'Quad Set', embedUrl: 'https://go.screenpal.com/player/cOfVbBnTBzD' },
          { id: 'cOfVbBnTBzb', title: 'Resistance Band Lateral Walk', embedUrl: 'https://go.screenpal.com/player/cOfVbBnTBzb' },
          { id: 'cOfVbBnTBzF', title: 'Seated Knee Extension', embedUrl: 'https://go.screenpal.com/player/cOfVbBnTBzF' },
          { id: 'cOfVbBnTBzq', title: 'Single Leg Glute Bridge', embedUrl: 'https://go.screenpal.com/player/cOfVbBnTBzq' },
          { id: 'cOfVbBnTBzY', title: 'Single Leg Stand', embedUrl: 'https://go.screenpal.com/player/cOfVbBnTBzY' },
          { id: 'cOfVbBnTBzr', title: 'Standing Hip Abduction', embedUrl: 'https://go.screenpal.com/player/cOfVbBnTBzr' },
        ],
      },
      {
        id: 'rehab_ankle',
        name: 'Ankle & Foot',
        folderName: 'Ankle & Foot',
        parentId: 'rehabilitation',
        videos: [
          { id: 'cOfVbunTB4n', title: 'Alphabet Exercise', embedUrl: 'https://go.screenpal.com/player/cOfVbunTB4n' },
          { id: 'cOfVbunTB4e', title: 'Ankle Circles', embedUrl: 'https://go.screenpal.com/player/cOfVbunTB4e' },
          { id: 'cOfVbunTB4f', title: 'Ankle Pumps', embedUrl: 'https://go.screenpal.com/player/cOfVbunTB4f' },
          { id: 'cOfVbunTB4h', title: 'Resistance Band Dorsiflexion', embedUrl: 'https://go.screenpal.com/player/cOfVbunTB4h' },
          { id: 'cOfVbunTB41', title: 'Resistance Band Eversion', embedUrl: 'https://go.screenpal.com/player/cOfVbunTB41' },
          { id: 'cOfVbunTB4i', title: 'Resistance Band Inversion', embedUrl: 'https://go.screenpal.com/player/cOfVbunTB4i' },
          { id: 'cOfVbunTB4j', title: 'Resistance Band Plantarflexion', embedUrl: 'https://go.screenpal.com/player/cOfVbunTB4j' },
          { id: 'cOfVbunTB4Q', title: 'Seated Heel Raises', embedUrl: 'https://go.screenpal.com/player/cOfVbunTB4Q' },
        ],
      },
    ],
  },
  {
    id: 'homeWorkout',
    name: 'Home Workout',
    folderName: 'Home Workout',
    requiredPlans: ['Home Workout', 'Mastery Plan'],
    videos: [],
    subCategories: [
      {
        id: 'hw_warmup',
        name: 'Warm Up',
        folderName: 'Warm Up',
        parentId: 'homeWorkout',
        videos: [
          { id: 'cTlhi8nqWTS', title: 'Chest Fly', embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWTS' },
          { id: 'cTlhi8nqWTW', title: 'Cat Cow', embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWTW' },
          { id: 'cTlhi8nqWOc', title: 'Hip Rotation', embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWOc' },
          { id: 'cTlhi8nqWOV', title: 'Scapula Retraction Protraction', embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWOV' },
          { id: 'cTlhi8nqWOn', title: 'Wrist Rotation', embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWOn' },
          { id: 'cTlhi8nqWOe', title: 'Neck Rotation', embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWOe' },
          { id: 'cTlhi8nqWOf', title: 'Scapula Elevation Depression', embedUrl: 'https://go.screenpal.com/player/cTlhi8nqWOf' },
          { id: 'cTlhjVnqWOJ', title: 'Toe Touches', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOJ' },
          { id: 'cTlhjVnqWOd', title: 'Elbow Flexion', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOd' },
          { id: 'cTlhjVnqWOK', title: 'Neck Flexion Extension Lateral Flexion', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOK' },
          { id: 'cTlhjVnqWOs', title: 'Thoracic Rotation', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOs' },
          { id: 'cTlhjVnqWOM', title: 'Ankle Rotate', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOM' },
          { id: 'cTlhjVnqWOL', title: 'Leg Raises', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWOL' },
          { id: 'cTlhjVnqWtn', title: 'Leg Swing', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWtn' },
          { id: 'cTlhjVnqWte', title: 'Shrugs', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWte' },
          { id: 'cTlhjVnqWtf', title: 'Trunk Rotation', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWtf' },
          { id: 'cTlhjVnqWth', title: 'Calf Raise', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWth' },
          { id: 'cTlhjVnqWt1', title: 'Shoulder Rotation', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWt1' },
          { id: 'cTlhjVnqWti', title: 'Spine Lateral Flexion', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWti' },
          { id: 'cTlhjVnqWO7', title: 'Squat', embedUrl: 'https://go.screenpal.com/player/cTlhjVnqWO7' },
        ],
      },
      {
        id: 'hw_cardio',
        name: 'Cardio',
        folderName: 'Cardio',
        parentId: 'homeWorkout',
        videos: [
          { id: 'cTlTj8nYPwH', title: 'Burpees', embedUrl: 'https://go.screenpal.com/player/cTlTj8nYPwH' },
          { id: 'cTlTjPnYPws', title: 'Jump Squat', embedUrl: 'https://go.screenpal.com/player/cTlTjPnYPws' },
          { id: 'cTlTj9nYPwP', title: 'Jumping Jacks', embedUrl: 'https://go.screenpal.com/player/cTlTj9nYPwP' },
          { id: 'cTlTQcnYPxh', title: 'Mountain Climb', embedUrl: 'https://go.screenpal.com/player/cTlTQcnYPxh' },
          { id: 'cOfVDjnTBqf', title: 'High Knees', embedUrl: 'https://go.screenpal.com/player/cOfVDjnTBqf' },
          { id: 'cOfVDjnTBq1', title: 'Standing Jump', embedUrl: 'https://go.screenpal.com/player/cOfVDjnTBq1' },
        ],
      },
      {
        id: 'hw_core',
        name: 'Core',
        folderName: 'Core',
        parentId: 'homeWorkout',
        videos: [
          { id: 'cOfVb1nTBvI', title: 'Lying Leg Raises', embedUrl: 'https://go.screenpal.com/player/cOfVb1nTBvI' },
          { id: 'cTleI0nqL3T', title: 'Reverse Crunches', embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3T' },
          { id: 'cTleI0nqL3O', title: 'Side Bend', embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3O' },
          { id: 'cTleI0nqL3u', title: 'Side Plank', embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3u' },
          { id: 'cTleI0nqL3v', title: 'Crunches', embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3v' },
          { id: 'cTleI0nqL3w', title: 'Plank', embedUrl: 'https://go.screenpal.com/player/cTleI0nqL3w' },
        ],
      },
      {
        id: 'hw_legs',
        name: 'Legs',
        folderName: 'Legs',
        parentId: 'homeWorkout',
        videos: [
          { id: 'cTlhiVnqWoz', title: 'Calf Raises', embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWoz' },
          { id: 'cTlhiVnqWou', title: 'Lunges', embedUrl: 'https://go.screenpal.com/player/cTlhiVnqWou' },
        ],
      },
      {
        id: 'hw_chest',
        name: 'Chest & Push Ups',
        folderName: 'Chest & Push Ups',
        parentId: 'homeWorkout',
        videos: [
          { id: 'cTleXynqM8A', title: 'Knee Pushups', embedUrl: 'https://go.screenpal.com/player/cTleXynqM8A' },
          { id: 'cTleXynqM8B', title: 'Push Ups', embedUrl: 'https://go.screenpal.com/player/cTleXynqM8B' },
          { id: 'cOfVbcnTBUX', title: 'Inclined Pushup', embedUrl: 'https://go.screenpal.com/player/cOfVbcnTBUX' },
          { id: 'cOfVbnnTBUa', title: 'Declined Pushup', embedUrl: 'https://go.screenpal.com/player/cOfVbnnTBUa' },
        ],
      },
      {
        id: 'hw_back',
        name: 'Back',
        folderName: 'Back',
        parentId: 'homeWorkout',
        videos: [
          { id: 'cTleIhnqLF3', title: 'Superman', embedUrl: 'https://go.screenpal.com/player/cTleIhnqLF3' },
        ],
      },
      {
        id: 'hw_triceps',
        name: 'Triceps',
        folderName: 'Triceps',
        parentId: 'homeWorkout',
        videos: [
          { id: 'cTlZbNnY8Cs', title: 'Close Grip Knee Push Up', embedUrl: 'https://go.screenpal.com/player/cTlZbNnY8Cs' },
          { id: 'cTlZbPnY8CS', title: 'Close Grip Push Ups', embedUrl: 'https://go.screenpal.com/player/cTlZbPnY8CS' },
        ],
      },
      {
        id: 'hw_exercises',
        name: 'Home Exercises',
        folderName: 'Home Exercises',
        parentId: 'homeWorkout',
        videos: [
          { id: 'cOfVD0nTBrJ', title: 'Chair Half Squats', embedUrl: 'https://go.screenpal.com/player/cOfVD0nTBrJ' },
          { id: 'cOfVD0nTBrd', title: 'Floor Hip Thrust', embedUrl: 'https://go.screenpal.com/player/cOfVD0nTBrd' },
          { id: 'cOfVD0nTBrK', title: 'Resistance Band Bent Over Row', embedUrl: 'https://go.screenpal.com/player/cOfVD0nTBrK' },
          { id: 'cOfVD0nTBr7', title: 'Resistance Band Biceps Curls', embedUrl: 'https://go.screenpal.com/player/cOfVD0nTBr7' },
          { id: 'cOfVD0nTBrs', title: 'Resistance Band Chest Press', embedUrl: 'https://go.screenpal.com/player/cOfVD0nTBrs' },
          { id: 'cOfVDtnTB3U', title: 'Resistance Band Close Grip Lat Pull Down', embedUrl: 'https://go.screenpal.com/player/cOfVDtnTB3U' },
          { id: 'cOfVDtnTB3v', title: 'Resistance Band Face Pull', embedUrl: 'https://go.screenpal.com/player/cOfVDtnTB3v' },
          { id: 'cOfVDtnTB3x', title: 'Resistance Band Front Raises', embedUrl: 'https://go.screenpal.com/player/cOfVDtnTB3x' },
          { id: 'cOfVDtnTB3y', title: 'Resistance Band Hip Abduction', embedUrl: 'https://go.screenpal.com/player/cOfVDtnTB3y' },
          { id: 'cOfVDtnTB34', title: 'Resistance Band Hip Adduction', embedUrl: 'https://go.screenpal.com/player/cOfVDtnTB34' },
          { id: 'cOfVDvnTB03', title: 'Resistance Band Kick Back', embedUrl: 'https://go.screenpal.com/player/cOfVDvnTB03' },
          { id: 'cOfVDvnTB00', title: 'Resistance Band Lat Pull Down', embedUrl: 'https://go.screenpal.com/player/cOfVDvnTB00' },
          { id: 'cOfVDvnTB0Z', title: 'Resistance Band Lateral Raises', embedUrl: 'https://go.screenpal.com/player/cOfVDvnTB0Z' },
          { id: 'cOfVDvnTB0T', title: 'Resistance Band Leg Curl', embedUrl: 'https://go.screenpal.com/player/cOfVDvnTB0T' },
          { id: 'cOfVDvnTB0O', title: 'Resistance Band OH Triceps Extension', embedUrl: 'https://go.screenpal.com/player/cOfVDvnTB0O' },
          { id: 'cOfVD4nTBZn', title: 'Resistance Band RDL', embedUrl: 'https://go.screenpal.com/player/cOfVD4nTBZn' },
          { id: 'cOfVD4nTBZe', title: 'Resistance Band Seated Biceps Curl', embedUrl: 'https://go.screenpal.com/player/cOfVD4nTBZe' },
          { id: 'cOfVD4nTBZf', title: 'Resistance Band Seated Rowing', embedUrl: 'https://go.screenpal.com/player/cOfVD4nTBZf' },
          { id: 'cOfVD4nTBZh', title: 'Resistance Band Shoulder Press', embedUrl: 'https://go.screenpal.com/player/cOfVD4nTBZh' },
          { id: 'cOfVD4nTBZ1', title: 'Resistance Band Squats to Press', embedUrl: 'https://go.screenpal.com/player/cOfVD4nTBZ1' },
          { id: 'cOfVDknTBTq', title: 'Resistance Band Squats', embedUrl: 'https://go.screenpal.com/player/cOfVDknTBTq' },
          { id: 'cOfVDknTBTr', title: 'Resistance Band Triceps Extension', embedUrl: 'https://go.screenpal.com/player/cOfVDknTBTr' },
          { id: 'cOfVDknTBT0', title: 'Resistance Band Woodchopper', embedUrl: 'https://go.screenpal.com/player/cOfVDknTBT0' },
          { id: 'cOfVDknTBTZ', title: 'TRX Back Rowing', embedUrl: 'https://go.screenpal.com/player/cOfVDknTBTZ' },
          { id: 'cOfVDknTBTT', title: 'TRX Biceps Curls', embedUrl: 'https://go.screenpal.com/player/cOfVDknTBTT' },
          { id: 'cOfVD5nTBOV', title: 'TRX Chest Press', embedUrl: 'https://go.screenpal.com/player/cOfVD5nTBOV' },
          { id: 'cOfVD5nTBOn', title: 'TRX Face Pull', embedUrl: 'https://go.screenpal.com/player/cOfVD5nTBOn' },
          { id: 'cOfVD5nTBOe', title: 'TRX Knee Tuck', embedUrl: 'https://go.screenpal.com/player/cOfVD5nTBOe' },
          { id: 'cOfVD5nTBOf', title: 'TRX Shoulder High Row', embedUrl: 'https://go.screenpal.com/player/cOfVD5nTBOf' },
          { id: 'cOfVD5nTBOh', title: 'TRX Supported Half Squats', embedUrl: 'https://go.screenpal.com/player/cOfVD5nTBOh' },
          { id: 'cOfVD5nTBO1', title: 'TRX Supported Lunges', embedUrl: 'https://go.screenpal.com/player/cOfVD5nTBO1' },
          { id: 'cOfVD5nTBOi', title: 'TRX Supported Squats', embedUrl: 'https://go.screenpal.com/player/cOfVD5nTBOi' },
          { id: 'cOfVD5nTBOj', title: 'TRX Triceps Extension', embedUrl: 'https://go.screenpal.com/player/cOfVD5nTBOj' },
          { id: 'cOfVD5nTBOQ', title: 'Wall Pushups', embedUrl: 'https://go.screenpal.com/player/cOfVD5nTBOQ' },
          { id: 'cOfVD5nTBO6', title: 'Wall Sit', embedUrl: 'https://go.screenpal.com/player/cOfVD5nTBO6' },
        ],
      },
    ],
  },
  {
    id: 'cardio',
    name: 'Cardio',
    folderName: 'Cardio',
    videos: [
      {
        id: 'cTlTj8nYPwH',
        title: 'Burpees',
        embedUrl: 'https://go.screenpal.com/player/cTlTj8nYPwH',
      },
      {
        id: 'cTlTjPnYPws',
        title: 'Jump Squat',
        embedUrl: 'https://go.screenpal.com/player/cTlTjPnYPws',
      },
      {
        id: 'cTlTj9nYPwP',
        title: 'Jumping Jacks',
        embedUrl: 'https://go.screenpal.com/player/cTlTj9nYPwP',
      },
      {
        id: 'cTlTjRnYPwS',
        title: 'Kettle Bell Swing',
        embedUrl: 'https://go.screenpal.com/player/cTlTjRnYPwS',
      },
      {
        id: 'cTlTQcnYPxh',
        title: 'Mountain Climb',
        embedUrl: 'https://go.screenpal.com/player/cTlTQcnYPxh',
      },
      {
        id: 'cTlTQVnYPxl',
        title: 'Step Jumps',
        embedUrl: 'https://go.screenpal.com/player/cTlTQVnYPxl',
      },
      {
        id: 'cTlTQnnYPxY',
        title: 'Step Ups',
        embedUrl: 'https://go.screenpal.com/player/cTlTQnnYPxY',
      },
    ],
  },
];

// Helper to get video URL for embedding
export function getScreenPalEmbedUrl(videoId: string): string {
  return `https://go.screenpal.com/player/${videoId}`;
}

// Helper to get video watch URL
export function getScreenPalWatchUrl(videoId: string): string {
  return `https://go.screenpal.com/watch/${videoId}`;
}

// Helper to get thumbnail (ScreenPal generates thumbnails automatically)
export function getScreenPalThumbnail(videoId: string): string {
  return `https://go.screenpal.com/thumbnails/${videoId}.jpg`;
}
