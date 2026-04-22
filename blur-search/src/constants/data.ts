import type { LucideIcon } from "lucide-react-native";
import {
  Bell,
  Calendar,
  Camera,
  Cloud,
  Gamepad2,
  Globe,
  Heart,
  House,
  Image,
  Mail,
  Map,
  MessageSquare,
  Mic,
  Music,
  Palette,
  Settings,
  Sparkles,
  Star,
  Video,
  Wifi,
} from "lucide-react-native";

export type IconMock = {
  Icon: LucideIcon;
  gradient: [string, string];
};

export type RecentItem = {
  Icon: LucideIcon;
  gradient: [string, string];
};

export const ICON_DATA: IconMock[] = [
  { Icon: House, gradient: ["#F97316", "#FB923C"] },
  { Icon: Camera, gradient: ["#06B6D4", "#22D3EE"] },
  { Icon: MessageSquare, gradient: ["#10B981", "#34D399"] },
  { Icon: Music, gradient: ["#EC4899", "#F472B6"] },
  { Icon: Sparkles, gradient: ["#8B5CF6", "#A78BFA"] },
  { Icon: Mail, gradient: ["#0EA5E9", "#38BDF8"] },
  { Icon: Bell, gradient: ["#EF4444", "#FB7185"] },
  { Icon: Map, gradient: ["#22C55E", "#4ADE80"] },
  { Icon: Image, gradient: ["#D946EF", "#E879F9"] },
  { Icon: Wifi, gradient: ["#6366F1", "#818CF8"] },
  { Icon: Settings, gradient: ["#14B8A6", "#2DD4BF"] },
  { Icon: Cloud, gradient: ["#0284C7", "#38BDF8"] },
  { Icon: Star, gradient: ["#EAB308", "#FACC15"] },
  { Icon: Heart, gradient: ["#E11D48", "#FB7185"] },
  { Icon: Calendar, gradient: ["#7C3AED", "#A78BFA"] },
  { Icon: Gamepad2, gradient: ["#DB2777", "#F472B6"] },
  { Icon: Globe, gradient: ["#2563EB", "#60A5FA"] },
  { Icon: Palette, gradient: ["#C026D3", "#E879F9"] },
  { Icon: Video, gradient: ["#DC2626", "#F87171"] },
  { Icon: Mic, gradient: ["#0891B2", "#22D3EE"] },
];

export const ICONS_PER_ROW = 4;

export const ICON_ROWS: IconMock[][] = (() => {
  const rows: IconMock[][] = [];
  for (let i = 0; i < ICON_DATA.length; i += ICONS_PER_ROW) {
    rows.push(ICON_DATA.slice(i, i + ICONS_PER_ROW));
  }
  return rows;
})();

export const RECENT_ITEMS: RecentItem[] = [
  { Icon: House, gradient: ["#2563EB", "#60A5FA"] },
  { Icon: Music, gradient: ["#7C3AED", "#A78BFA"] },
  { Icon: Mail, gradient: ["#06B6D4", "#67E8F9"] },
  { Icon: Map, gradient: ["#10B981", "#4ADE80"] },
];
