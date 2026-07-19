import {
  LayoutDashboard,
  FileCode,
  GitBranch,
  History,
  FileText,
  Bookmark,
  Settings,
  User,
  RefreshCw,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "editor",
    label: "AI Editor",
    icon: FileCode,
  },
  {
    id: "repo",
    label: "Repository Analyzer",
    icon: GitBranch,
  },
  {
    id: "converter",
    label: "Code Converter",
    icon: RefreshCw,
  },
  {
    id: "history",
    label: "History",
    icon: History,
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
  },
  {
    id: "snippets",
    label: "Saved Snippets",
    icon: Bookmark,
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
];

export const LANGS = [
  { name: "Python", value: 45, color: "#a855f7" },
  { name: "JavaScript", value: 25, color: "#f59e0b" },
  { name: "C++", value: 15, color: "#3b82f6" },
  { name: "Java", value: 10, color: "#ef4444" },
  { name: "Others", value: 5, color: "#6b7280" },
];

export const RECENT_ANALYSES = [
  { file: "two_sum.py", desc: "Bug detection, Optimization", time: "5 minutes ago", icon: "py" },
  { file: "binary_search.js", desc: "Complexity Analysis", time: "1 hour ago", icon: "js" },
  { file: "app.py", desc: "AI Explanation", time: "3 hours ago", icon: "py" },
  { file: "sort.cpp", desc: "Unit Test Generation", time: "Yesterday", icon: "cpp" },
];

export const REPOS = [
  { name: "facebook/react", lang: "JavaScript", langColor: "#f59e0b", score: 98, time: "Analyzed 2 hours ago" },
  { name: "tensorflow/tensorflow", lang: "Python", langColor: "#a855f7", score: 94, time: "Analyzed yesterday" },
  { name: "vercel/next.js", lang: "TypeScript", langColor: "#3b82f6", score: 92, time: "Analyzed 2 days ago" },
];

export const HISTORY_ROWS = [
  { file: "two_sum.py", lang: "Python", type: "Bug Detection", date: "May 20, 2024 10:30 AM" },
  { file: "binary_search.js", lang: "JavaScript", type: "Complexity Analysis", date: "May 20, 2024 09:15 AM" },
  { file: "app.py", lang: "Python", type: "AI Explanation", date: "May 19, 2024 04:45 PM" },
  { file: "sort.cpp", lang: "C++", type: "Optimization", date: "May 19, 2024 11:20 AM" },
  { file: "login.java", lang: "Java", type: "Unit Test Generation", date: "May 18, 2024 02:30 PM" },
];

export const REPORTS = [
  { title: "Code Quality Report", date: "Generated on May 20, 2024" },
  { title: "Security Analysis Report", date: "Generated on May 19, 2024" },
  { title: "Performance Report", date: "Generated on May 18, 2024" },
  { title: "Repository Analysis Report", date: "Generated on May 17, 2024" },
];

export const CODE_LINES = [
  { n: 1, code: [["kw", "def"], ["fn", " two_sum"], ["p", "(nums, target):"]] },
  { n: 2, code: [["idt", "    seen"], ["p", " = "], ["p", "()"]] },
  { n: 3, code: [["kw", "    for"], ["v", " i, num "], ["kw", "in"], ["fn", " enumerate"], ["p", "(nums):"]] },
  { n: 4, code: [["idt", "        diff"], ["p", " = target - num"]] },
  { n: 5, code: [["kw", "        if"], ["v", " diff "], ["kw", "in"], ["v", " seen:"]], flagged: true },
  { n: 6, code: [["kw", "            return"], ["v", " [seen[diff], i]"]] },
  { n: 7, code: [["idt", "        seen[num]"], ["p", " = i"]] },
  { n: 8, code: [] },
  { n: 9, code: [["kw", "    return"], ["v", " []"]] },
];

export const TOKEN_COLOR = {
  kw: "text-purple-400",
  fn: "text-blue-300",
  p: "text-gray-300",
  idt: "text-gray-300",
  v: "text-gray-300",
};
