import { Bug, Lightbulb, ClipboardList } from "lucide-react";

interface BadgeProps {
  category: "bug" | "feature" | "task";
}

const config = {
  bug: {
    label: "Bug",
    icon: Bug,
    color: "bg-red-100 text-red-700",
  },
  feature: {
    label: "Feature",
    icon: Lightbulb,
    color: "bg-blue-100 text-blue-700",
  },
  task: {
    label: "Task",
    icon: ClipboardList,
    color: "bg-yellow-100 text-yellow-700",
  },
};

export default function CategoryBadge({ category }: BadgeProps) {
  const { label, icon: Icon, color } = config[category];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${color}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
