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
      {
        id: 'cTlhignqW0Y',
        title: 'Seated Dumbbell Shoulder Press 2',
        embedUrl: 'https://go.screenpal.com/player/cTlhignqW0Y',
      },
      {
        id: 'cTlhidnqWTc',
        title: 'Cable Lateral Raise 2',
        embedUrl: 'https://go.screenpal.com/player/cTlhidnqWTc',
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
