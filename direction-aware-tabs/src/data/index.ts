// mockData.ts
import {
  LucideIcon,
  Users,
  Cpu,
  BookOpen,
  MessageCircle,
  Settings,
  Share2,
  Shield,
  Film,
  Music,
  LoaderPinwheel,
  Gamepad2,
  Book,
  CheckCheck,
  UserPlus,
  Heart,
  ThumbsUp,
  Bell,
  Star,
  AlertTriangle,
  Gift,
  Activity,
  Calendar,
} from "lucide-react-native";

export type User = {
  id: number;
  profilePicture: string;
  isOnline: boolean;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadMessages: number;
};

export type Group = {
  id: number;
  Icon?: LucideIcon;
  color?: string;
  groupName: string;
  description: string;
  membersCount: number;
  followersCount: number;
  followersIncluding: string;
  avatars: string[];
  timestamp: string;
};

export type Notification = {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  timestamp: string;
};

export type Friend = {
  id: number;
  profilePicture: string;
  isOnline: boolean;
  name: string;
};

export const users: User[] = [
  {
    id: 1,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: true,
    name: "Kathryn Simmoms",
    lastMessage:
      "Late night, and passing, mention it flipped her. Best friend, who...",
    timestamp: "5 min",
    unreadMessages: 4,
  },
  {
    id: 2,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: false,
    name: "John Doe",
    lastMessage: "Hey, are you available for the meeting tomorrow?",
    timestamp: "10 min",
    unreadMessages: 2,
  },
  {
    id: 3,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: true,
    name: "Jane Smith",
    lastMessage: "Sure, I will send the report by EOD.",
    timestamp: "15 min",
    unreadMessages: 1,
  },
  {
    id: 4,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: false,
    name: "Michael Johnson",
    lastMessage: "Let's catch up sometime next week.",
    timestamp: "20 min",
    unreadMessages: 3,
  },
  {
    id: 5,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: true,
    name: "Emily Davis",
    lastMessage: "Can you review the PR?",
    timestamp: "25 min",
    unreadMessages: 0,
  },
  {
    id: 6,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: true,
    name: "Daniel Wilson",
    lastMessage: "Happy Birthday! Have a great day!",
    timestamp: "30 min",
    unreadMessages: 5,
  },
  {
    id: 7,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: false,
    name: "Sophia Martinez",
    lastMessage: "Thank you! That helps a lot.",
    timestamp: "35 min",
    unreadMessages: 0,
  },
  {
    id: 8,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: true,
    name: "James Anderson",
    lastMessage: "Can we reschedule our meeting?",
    timestamp: "40 min",
    unreadMessages: 7,
  },
  {
    id: 9,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: false,
    name: "Olivia Taylor",
    lastMessage: "I'll send the files over by noon.",
    timestamp: "45 min",
    unreadMessages: 1,
  },
  {
    id: 10,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: true,
    name: "Henry Moore",
    lastMessage: "Let's finalize the details today.",
    timestamp: "50 min",
    unreadMessages: 2,
  },
  {
    id: 11,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: false,
    name: "Mia Jackson",
    lastMessage: "Good to hear! See you soon.",
    timestamp: "55 min",
    unreadMessages: 4,
  },
  {
    id: 12,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: true,
    name: "William Martin",
    lastMessage: "I'll be out of the office next week.",
    timestamp: "1 hour",
    unreadMessages: 3,
  },
  {
    id: 13,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: false,
    name: "Isabella Thompson",
    lastMessage: "Sure thing, talk to you then.",
    timestamp: "1 hour 5 min",
    unreadMessages: 2,
  },
  {
    id: 14,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: true,
    name: "Ethan White",
    lastMessage: "Thanks for the update.",
    timestamp: "1 hour 10 min",
    unreadMessages: 0,
  },
  {
    id: 15,
    profilePicture: "https://i.pravatar.cc/300",
    isOnline: false,
    name: "Ava Harris",
    lastMessage: "Looking forward to it!",
    timestamp: "1 hour 15 min",
    unreadMessages: 6,
  },
];

export const groups: Group[] = [
  {
    id: 1,
    Icon: CheckCheck,
    color: "#FF9500",
    groupName: "React Native",
    description:
      "A group for React Native enthusiasts to discuss and share ideas. Join us to explore the latest features, share projects, and improve your skills in building cross-platform applications.",
    membersCount: 55,
    followersCount: 136,
    followersIncluding: "@nexendk",
    avatars: [
      "https://i.pravatar.cc/300?img=1",
      "https://i.pravatar.cc/300?img=2",
      "https://i.pravatar.cc/300?img=3",
      "https://i.pravatar.cc/300?img=4",
      "https://i.pravatar.cc/300?img=5",
    ],
    timestamp: "90 mins",
  },
  {
    id: 2,
    Icon: CheckCheck,
    color: "#FF9500",
    groupName: "Flutter Devs",
    description:
      "Join us to discuss everything Flutter. Whether you're a beginner or an expert, share your knowledge, get tips, and stay updated with the latest in Flutter development.",
    membersCount: 42,
    followersCount: 200,
    followersIncluding: "@flutteruser",
    avatars: [
      "https://i.pravatar.cc/300?img=6",
      "https://i.pravatar.cc/300?img=7",
      "https://i.pravatar.cc/300?img=8",
      "https://i.pravatar.cc/300?img=9",
      "https://i.pravatar.cc/300?img=10",
    ],
    timestamp: "60 mins",
  },
  {
    id: 3,
    groupName: "Kotlin Enthusiasts",
    description:
      "All about Kotlin programming language. Discuss best practices, share code snippets, and learn how Kotlin can make your development process smoother and more enjoyable.",
    membersCount: 30,
    followersCount: 120,
    followersIncluding: "@kotlinfan",
    avatars: [
      "https://i.pravatar.cc/300?img=11",
      "https://i.pravatar.cc/300?img=12",
      "https://i.pravatar.cc/300?img=13",
      "https://i.pravatar.cc/300?img=14",
      "https://i.pravatar.cc/300?img=15",
    ],
    timestamp: "120 mins",
  },
  {
    id: 4,
    groupName: "Swift Developers",
    description:
      "Connect with other Swift developers. Share your experiences, get help with coding issues, and stay up-to-date with the latest developments in the Swift programming language.",
    membersCount: 50,
    followersCount: 150,
    followersIncluding: "@swiftdev",
    avatars: [
      "https://i.pravatar.cc/300?img=16",
      "https://i.pravatar.cc/300?img=17",
      "https://i.pravatar.cc/300?img=18",
      "https://i.pravatar.cc/300?img=19",
      "https://i.pravatar.cc/300?img=20",
    ],
    timestamp: "2 hours",
  },
  {
    id: 5,
    groupName: "JavaScript Masters",
    description:
      "A place for JavaScript masters to share knowledge. Engage in deep discussions, explore advanced topics, and enhance your expertise in JavaScript development.",
    membersCount: 80,
    followersCount: 250,
    followersIncluding: "@jspro",
    avatars: [
      "https://i.pravatar.cc/300?img=21",
      "https://i.pravatar.cc/300?img=22",
      "https://i.pravatar.cc/300?img=23",
      "https://i.pravatar.cc/300?img=24",
      "https://i.pravatar.cc/300?img=25",
    ],
    timestamp: "3 hours",
  },
  {
    id: 6,
    groupName: "Python Programmers",
    description:
      "Discuss Python programming with peers. Share your projects, ask questions, and collaborate with other Python enthusiasts to improve your coding skills.",
    membersCount: 65,
    followersCount: 230,
    followersIncluding: "@pythonguru",
    avatars: [
      "https://i.pravatar.cc/300?img=26",
      "https://i.pravatar.cc/300?img=27",
      "https://i.pravatar.cc/300?img=28",
      "https://i.pravatar.cc/300?img=29",
      "https://i.pravatar.cc/300?img=30",
    ],
    timestamp: "4 hours",
  },
  {
    id: 7,
    groupName: "Go Developers",
    description:
      "Go programming language enthusiasts. Discuss the unique features of Go, share code examples, and get insights into using Go for various types of software development.",
    membersCount: 25,
    followersCount: 90,
    followersIncluding: "@gopher",
    avatars: [
      "https://i.pravatar.cc/300?img=31",
      "https://i.pravatar.cc/300?img=32",
      "https://i.pravatar.cc/300?img=33",
      "https://i.pravatar.cc/300?img=34",
      "https://i.pravatar.cc/300?img=35",
    ],
    timestamp: "5 hours",
  },
  {
    id: 8,
    Icon: Settings,
    color: "#4CD964",
    groupName: "Ruby on Rails",
    description:
      "All things Ruby on Rails. Join the conversation about Rails development, share tips and tricks, and learn from other developers' experiences with this powerful framework.",
    membersCount: 40,
    followersCount: 160,
    followersIncluding: "@railsdev",
    avatars: [
      "https://i.pravatar.cc/300?img=22",
      "https://i.pravatar.cc/300?img=23",
      "https://i.pravatar.cc/300?img=24",
      "https://i.pravatar.cc/300?img=25",
      "https://i.pravatar.cc/300?img=26",
    ],
    timestamp: "6 hours",
  },
  {
    id: 9,
    Icon: Share2,
    color: "#FF9500",
    groupName: "PHP Developers",
    description:
      "Discuss PHP development. Explore best practices, share code snippets, and get help with PHP-related challenges from other experienced developers.",
    membersCount: 60,
    followersCount: 180,
    followersIncluding: "@phpexpert",
    avatars: [
      "https://i.pravatar.cc/300?img=27",
      "https://i.pravatar.cc/300?img=28",
      "https://i.pravatar.cc/300?img=29",
      "https://i.pravatar.cc/300?img=30",
      "https://i.pravatar.cc/300?img=31",
    ],
    timestamp: "7 hours",
  },
  {
    id: 10,
    Icon: Shield,
    color: "#5856D6",
    groupName: "C# Coders",
    description:
      "Connect with C# developers. Share your projects, ask for advice, and discuss the latest trends in C# and .NET development.",
    membersCount: 70,
    followersCount: 190,
    followersIncluding: "@csharpdev",
    avatars: [
      "https://i.pravatar.cc/300?img=32",
      "https://i.pravatar.cc/300?img=33",
      "https://i.pravatar.cc/300?img=34",
      "https://i.pravatar.cc/300?img=35",
      "https://i.pravatar.cc/300?img=36",
    ],
    timestamp: "8 hours",
  },
  {
    id: 11,
    Icon: Film,
    color: "#FF2D55",
    groupName: "Movie Buffs",
    description:
      "Discuss the latest movies. Share your reviews, recommend films, and engage in conversations about the movie industry.",
    membersCount: 45,
    followersCount: 140,
    followersIncluding: "@movielover",
    avatars: [
      "https://i.pravatar.cc/300?img=37",
      "https://i.pravatar.cc/300?img=38",
      "https://i.pravatar.cc/300?img=39",
      "https://i.pravatar.cc/300?img=40",
      "https://i.pravatar.cc/300?img=41",
    ],
    timestamp: "9 hours",
  },
  {
    id: 12,
    Icon: Star,
    color: "#FFCC00",
    groupName: "TV Series Fans",
    description: "Talk about your favorite TV series.",
    membersCount: 90,
    followersCount: 280,
    followersIncluding: "@tvfanatic",
    avatars: [
      "https://i.pravatar.cc/300?img=34",
      "https://i.pravatar.cc/300?img=35",
      "https://i.pravatar.cc/300?img=36",
    ],
    timestamp: "10 hours",
  },
  {
    id: 13,
    Icon: Music,
    color: "#007AFF",
    groupName: "Music Lovers",
    description: "Share and discuss music.",
    membersCount: 35,
    followersCount: 110,
    followersIncluding: "@musicguru",
    avatars: [
      "https://i.pravatar.cc/300?img=37",
      "https://i.pravatar.cc/300?img=38",
      "https://i.pravatar.cc/300?img=39",
    ],
    timestamp: "11 hours",
  },
  {
    id: 14,
    Icon: LoaderPinwheel,
    color: "#4CD964",
    groupName: "Football Fans",
    description: "Talk about football matches.",
    membersCount: 20,
    followersCount: 85,
    followersIncluding: "@footballfan",
    avatars: [
      "https://i.pravatar.cc/300?img=40",
      "https://i.pravatar.cc/300?img=41",
      "https://i.pravatar.cc/300?img=42",
    ],
    timestamp: "12 hours",
  },
  {
    id: 15,
    Icon: Gamepad2,
    color: "#FF9500",
    groupName: "Gaming Enthusiasts",
    description: "Discuss the latest games.",
    membersCount: 50,
    followersCount: 190,
    followersIncluding: "@gamer",
    avatars: [
      "https://i.pravatar.cc/300?img=43",
      "https://i.pravatar.cc/300?img=44",
      "https://i.pravatar.cc/300?img=45",
    ],
    timestamp: "13 hours",
  },
  {
    id: 16,
    Icon: Book,
    color: "#5856D6",
    groupName: "Book Club",
    description: "Join our book discussions.",
    membersCount: 70,
    followersCount: 210,
    followersIncluding: "@booklover",
    avatars: [
      "https://i.pravatar.cc/300?img=46",
      "https://i.pravatar.cc/300?img=47",
      "https://i.pravatar.cc/300?img=48",
    ],
    timestamp: "14 hours",
  },
  {
    id: 17,
    Icon: Users,
    color: "#007AFF",
    groupName: "Travel Enthusiasts",
    description: "Share your travel experiences.",
    membersCount: 40,
    followersCount: 150,
    followersIncluding: "@travelguru",
    avatars: [
      "https://i.pravatar.cc/300?img=49",
      "https://i.pravatar.cc/300?img=50",
      "https://i.pravatar.cc/300?img=51",
    ],
    timestamp: "15 hours",
  },
  {
    id: 18,
    Icon: Cpu,
    color: "#FF2D55",
    groupName: "Tech Geeks",
    description: "Discuss the latest in technology.",
    membersCount: 90,
    followersCount: 300,
    followersIncluding: "@techsavvy",
    avatars: [
      "https://i.pravatar.cc/300?img=52",
      "https://i.pravatar.cc/300?img=53",
      "https://i.pravatar.cc/300?img=54",
    ],
    timestamp: "16 hours",
  },
  {
    id: 19,
    Icon: BookOpen,
    color: "#5856D6",
    groupName: "History Buffs",
    description: "Talk about historical events.",
    membersCount: 55,
    followersCount: 180,
    followersIncluding: "@historyfan",
    avatars: [
      "https://i.pravatar.cc/300?img=55",
      "https://i.pravatar.cc/300?img=56",
      "https://i.pravatar.cc/300?img=57",
    ],
    timestamp: "17 hours",
  },
  {
    id: 20,
    Icon: MessageCircle,
    color: "#FFCC00",
    groupName: "Art Lovers",
    description: "Share and discuss art.",
    membersCount: 75,
    followersCount: 230,
    followersIncluding: "@artfan",
    avatars: [
      "https://i.pravatar.cc/300?img=58",
      "https://i.pravatar.cc/300?img=59",
      "https://i.pravatar.cc/300?img=60",
    ],
    timestamp: "18 hours",
  },
];

export const friends: Friend[] = [
  {
    id: 1,
    profilePicture: "https://i.pravatar.cc/300?img=10",
    isOnline: true,
    name: "Kathryn Simmoms",
  },
  {
    id: 2,
    profilePicture: "https://i.pravatar.cc/300?img=2",
    isOnline: false,
    name: "John Doe",
  },
  {
    id: 3,
    profilePicture: "https://i.pravatar.cc/300?img=3",
    isOnline: true,
    name: "Jane Smith",
  },
  {
    id: 4,
    profilePicture: "https://i.pravatar.cc/300?img=4",
    isOnline: true,
    name: "Michael Johnson",
  },
  {
    id: 5,
    profilePicture: "https://i.pravatar.cc/300?img=5",
    isOnline: false,
    name: "Emily Davis",
  },
  {
    id: 6,
    profilePicture: "https://i.pravatar.cc/300?img=6",
    isOnline: true,
    name: "Daniel Wilson",
  },
  {
    id: 7,
    profilePicture: "https://i.pravatar.cc/300?img=7",
    isOnline: false,
    name: "Sophia Martinez",
  },
  {
    id: 8,
    profilePicture: "https://i.pravatar.cc/300?img=8",
    isOnline: true,
    name: "James Anderson",
  },
  {
    id: 9,
    profilePicture: "https://i.pravatar.cc/300?img=9",
    isOnline: false,
    name: "Olivia Taylor",
  },
  {
    id: 10,
    profilePicture: "https://i.pravatar.cc/300?img=10",
    isOnline: true,
    name: "Henry Moore",
  },
];

export const notifications: Notification[] = [
  {
    id: 1,
    icon: MessageCircle,
    title: "New Message",
    description: "You have received a new message from John Doe.",
    timestamp: "5 min ago",
  },
  {
    id: 2,
    icon: UserPlus,
    title: "Friend Request",
    description: "Jane Smith sent you a friend request.",
    timestamp: "10 min ago",
  },
  {
    id: 3,
    icon: Heart,
    title: "New Like",
    description: "Your photo received a new like from Emily Davis.",
    timestamp: "15 min ago",
  },
  {
    id: 4,
    icon: ThumbsUp,
    title: "New Comment",
    description: "Michael Johnson commented on your post.",
    timestamp: "20 min ago",
  },
  {
    id: 5,
    icon: Bell,
    title: "Reminder",
    description: "You have a meeting scheduled with Sarah.",
    timestamp: "30 min ago",
  },
  {
    id: 6,
    icon: Star,
    title: "Achievement Unlocked",
    description: "Congratulations! You've reached a new milestone.",
    timestamp: "45 min ago",
  },
  {
    id: 7,
    icon: AlertTriangle,
    title: "Security Alert",
    description: "There was a login attempt from a new device.",
    timestamp: "1 hour ago",
  },
  {
    id: 8,
    icon: Gift,
    title: "Gift Received",
    description: "You have received a gift from Mike.",
    timestamp: "2 hours ago",
  },
  {
    id: 9,
    icon: Activity,
    title: "Activity Report",
    description: "Your weekly activity report is now available.",
    timestamp: "3 hours ago",
  },
  {
    id: 10,
    icon: Calendar,
    title: "Event Invitation",
    description: "You've been invited to the event 'Tech Conference 2024'.",
    timestamp: "4 hours ago",
  },
];
