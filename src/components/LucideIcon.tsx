import {
  Sparkles,
  Cpu,
  Activity,
  Zap,
  Eye,
  Cloud,
  Database,
  MessageCircle,
  MessageSquare,
  Award,
  GraduationCap,
  LineChart,
  Binary,
  Code,
  Layout,
  Target,
  FileCode,
  Sliders,
  Terminal,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Download,
  Send,
  X,
  Plus,
  Compass,
  CheckCircle,
  Check,
  ChevronRight,
  Monitor,
  Workflow,
  Scan,
} from "lucide-react";

const iconsMap: Record<string, any> = {
  Sparkles,
  Cpu,
  Activity,
  Zap,
  Eye,
  Cloud,
  Database,
  MessageCircle,
  MessageSquare,
  Award,
  GraduationCap,
  LineChart,
  Binary,
  Code,
  Layout,
  Target,
  FileCode,
  Sliders,
  Terminal,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Download,
  Send,
  X,
  Plus,
  Compass,
  CheckCircle,
  Check,
  ChevronRight,
  Monitor,
  Workflow,
  Scan,
  BrainCircuit: Cpu // Fail-safe mapping
};

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function LucideIcon({ name, className, size }: LucideIconProps) {
  const IconComponent = iconsMap[name] || Code; // Base fallback to Code icon
  return <IconComponent className={className} size={size} />;
}
