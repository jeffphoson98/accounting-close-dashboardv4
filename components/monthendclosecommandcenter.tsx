"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Filter,
  Search,
  User,
  CalendarDays,
  ListTodo,
  CircleAlert,
  Plus,
  Trash2,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";

const rawTasks = [
  ["Bank Reconciliation - 115", "Caoilinn", "Jefferson"],
  ["Bank Reconciliation - 318", "Caoilinn", "Jefferson"],
  ["Bank Reconciliation - 413", "Caoilinn", "Jefferson"],
  ["Bank Reconciliation - 511", "Caoilinn", "Jefferson"],
  ["Bank Reconciliation - 813", "Caoilinn", "Jefferson"],
  ["Bank Reconciliation - 909", "Caoilinn", "Jefferson"],
  ["Lucernex Lease Entry", "Caoilinn", "Jefferson"],
  ["Interco Company Reconciliation", "Caoilinn", "Jefferson"],
  ["Visa Reconciliation", "Caoilinn", "Jefferson"],
  ["Visa Posting - JD", "Caoilinn", "Jefferson"],
  ["AUC Reclass (If any)", "Fahim", "Jefferson"],
  ["QST Adjustment", "Fahim", "Jefferson"],
  ["FAM - JD", "Fahim", "Jefferson"],
  ["Inventory Transfers/Adjustments and Reconcniliations", "Fahim", "Jefferson"],
  ["ECOM Logistics Reconciliation", "Fahim", "Jefferson"],
  ["JD UK Interco Reconiliation", "Fahim", "Jefferson"],
  ["Recharges", "Fahim", "Jefferson"],
  ["Float Reconciliation", "Fahim", "Jefferson"],
  ["Send Float transactions sheet to managers", "Fahim", "Jefferson"],
  ["Reclass WPG & Roncy P&L items (If any)", "Fahim", "Jefferson"],
  ["Prepaid Expenses", "Fahim", "Jefferson"],
  ["Gatineau / Orchard Park re allo", "Fahim", "Jefferson"],
  ["JD US Wages Accrual (Workday)/(Hibbett)", "Jefferson", ""],
  ["Accounting Accrual FY26", "Jefferson", ""],
  ["Review Fixed asset allocation - NSO and Existing", "Fahim", "Jefferson"],
  ["Payroll Report Sent to Mariana", "Tsedo", "Jefferson"],
  ["Ensure Prepaid items are on an AMORT schedule", "Lawrence", "Jefferson"],
  ["AP Posting", "Lawrence", "Jefferson"],
  ["Product Vendor Reconciliation", "Lawrence", "Jefferson"],
  ["Unpaid Staff Order reconciliation", "Preet", "Jefferson"],
  ["FAM - LS", "Preet", "Jefferson"],
  ["Card Merchant Reconiliation", "Preet", "Jefferson"],
  ["Chargeback UK for Implementation Fee 5k", "Preet", "Jefferson"],
  ["Cash Reconciliation", "Preet", "Jefferson"],
  ["Inventory Movement JD/LS", "Preet", "Jefferson"],
  ["Palace Royalty accrual", "Preet", "Jefferson"],
  ["Payroll Posting", "Preet", "Jefferson"],
  ["AP Posting", "Preet", "Jefferson"],
  ["Fedex Posting", "Preet", "Jefferson"],
  ["Reclass Capex AP to 2025 Payables - Capital Expenditure", "Tsedo", "Jefferson"],
  ["Corpay Fees Accrual", "Tsedo", "Jefferson"],
  ["Confirm Dec 2025 marketing invoices were sent cc Jeff", "Tsedo", "Jefferson"],
  ["Tipalti Fees Accrual", "Tsedo", "Jefferson"],
  ["AP Posting", "Tsedo", "Jefferson"],
  ["Overhead", "Tsedo", "Jefferson"],
  ["Realized Gain/Loss Reclass", "Tsedo", "Jefferson"],
  ["COGS Posting", "Tsedo", "Jefferson"],
  ["TI Expiry", "Tsedo", "Jefferson"],
  ["Merchant Deposits Postings", "Tsedo", "Jefferson"],
  ["Reverse Service charge (if any)", "Tsedo", "Jefferson"],
  ["Sales Reconciliation", "Tsedo", "Jefferson"],
  ["Realized Gain/Loss Reclass", "Caoilinn", "Jefferson"],
  ["Reclass Non Sellable Accrued Purchases", "Fahim", "Jefferson"],
  ["Cap Freight Posting JD", "Jefferson", ""],
  ["FX Translation of INTERCO balances", "Jefferson", ""],
  ["Cap Freight Posting LS", "Jefferson", ""],
  ["Reclass ECOM boxes and Transfer Boxes", "Tsedo", "Jefferson"],
  ["$2 Wage Chargeback to WH", "Tsedo", "Jefferson"],
  ["Send fixed asset breakdown to Property", "Lawrence", "Jefferson"],
  ["3.8 Lease Liabilities", "Caoilinn", "Jefferson"],
  ["Impairment Posting", "Caoilinn", "Jefferson"],
  ["TM1/FCC - LS", "Fahim", "Jefferson"],
  ["Send CAPEX report to UK", "Fahim", "Jefferson"],
  ["Tax Filing and Posting", "Fahim", "Jefferson"],
  ["CBSA Audit", "Fahim", "Jefferson"],
  ["Oracle Data Forms", "Jefferson", ""],
  ["Genesis Holdings / JD Holdings Reconciliation", "Jefferson", ""],
  ["Quality of Earnings Submissions", "Jefferson", ""],
  ["FCC Reopened for final tax adjustments", "Jefferson", ""],
  ["Related Party Subimssion", "Jefferson", ""],
  ["CBSA Audit", "Jefferson", ""],
  ["CBSA Audit", "Lawrence", "Jefferson"],
  ["TM1/FCC - JD", "Preet", "Jefferson"],
  ["Working Capital Analysis", "Preet", "Jefferson"],
  ["Loans and Borrowing Schedule Submission", "Preet", "Jefferson"],
  ["Review Financial Statements", "John De La Torre", ""],
] as const;

function inferSection(taskName: string) {
  const name = taskName.toLowerCase();
  if (name.includes("bank") || name.includes("visa") || name.includes("float") || name.includes("cash") || name.includes("merchant deposit")) return "Cash";
  if (name.includes("lease")) return "Leases";
  if (name.includes("interco") || name.includes("related party") || name.includes("holdings") || name.includes("chargeback") || name.includes("recharges") || name.includes("fx translation")) return "Intercompany";
  if (name.includes("payroll") || name.includes("wages")) return "Payroll";
  if (name.includes("inventory") || name.includes("cogs") || name.includes("vendor") || name.includes("fedex") || name.includes("freight") || name.includes("non sellable") || name.includes("ecom")) return "Inventory";
  if (name.includes("prepaid") || name.includes("amort")) return "Prepaids";
  if (name.includes("fam") || name.includes("capex") || name.includes("fixed asset") || name.includes("impairment") || name.includes("auc")) return "Fixed Assets";
  if (name.includes("tax") || name.includes("qst") || name.includes("cbsa")) return "Tax";
  if (name.includes("tm1") || name.includes("fcc") || name.includes("quality of earnings") || name.includes("working capital") || name.includes("oracle data forms") || name.includes("loans and borrowing")) return "Reporting";
  if (name.includes("accrual") || name.includes("gain/loss") || name.includes("royalty") || name.includes("service charge") || name.includes("tipalti") || name.includes("corpay") || name.includes("overhead") || name.includes("ti expiry") || name.includes("accounting accrual")) return "Accruals";
  if (name.includes("ap posting")) return "AP";
  if (name.includes("sales reconciliation")) return "Revenue";
  return "General";
}

function inferPriority(taskName: string) {
  const name = taskName.toLowerCase();
  if (
    name.includes("bank reconciliation") ||
    name.includes("sales reconciliation") ||
    name.includes("cash reconciliation") ||
    name.includes("inventory") ||
    name.includes("payroll") ||
    name.includes("tm1") ||
    name.includes("fcc") ||
    name.includes("tax") ||
    name.includes("working capital")
  ) return 1;
  if (name.includes("accrual") || name.includes("interco") || name.includes("cbsa") || name.includes("oracle") || name.includes("fedex") || name.includes("vendor")) return 2;
  return 3;
}

type Task = {
  id: number;
  priority: number;
  type: string;
  task: string;
  user: string;
  approver: string;
  approved: boolean;
  approvedBy: string;
  notes: string;
  done: boolean;
  status: string;
  section: string;
};

const initialTasks: Task[] = rawTasks.map(([task, user, approver], index) => ({
  id: index + 1,
  priority: inferPriority(task),
  type: "Monthly",
  task,
  user,
  approver,
  approved: false,
  approvedBy: "",
  notes: "",
  done: false,
  status: "Not started",
  section: inferSection(task),
}));

const statusOptions = ["Not started", "In progress", "Blocked", "Complete"];
const startingMonth = "Mar 2026";
const STORAGE_KEY = "accounting-close-dashboard-v1";

function cloneTasks(taskList: Task[]) {
  return taskList.map((task) => ({ ...task }));
}

function getNextMonthLabel(currentMonth: string) {
  const [monthName, yearString] = currentMonth.split(" ");
  const monthIndex = new Date(`${monthName} 1, ${yearString}`).getMonth();
  const year = Number(yearString);
  const nextDate = new Date(year, monthIndex + 1, 1);
  return nextDate.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function resetTasksForNewMonth(sourceTasks: Task[]) {
  return sourceTasks.map((task) => ({
    ...task,
    done: false,
    status: "Not started",
    notes: "",
    approved: false,
    approvedBy: "",
  }));
}

function createMonthArchive(monthLabel: string, sourceTasks: Task[]) {
  const total = sourceTasks.length;
  const completed = sourceTasks.filter((task) => task.done).length;
  const blocked = sourceTasks.filter((task) => task.status === "Blocked").length;
  const inProgress = sourceTasks.filter((task) => task.status === "In progress").length;

  return {
    month: monthLabel,
    completed,
    total,
    progress: total ? Math.round((completed / total) * 100) : 0,
    blocked,
    inProgress,
    tasks: sourceTasks.map((task) => ({ ...task })),
  };
}

const statusColor: Record<string, string> = {
  "Not started": "bg-slate-100 text-slate-700 border-slate-200",
  "In progress": "bg-amber-100 text-amber-800 border-amber-200",
  Blocked: "bg-rose-100 text-rose-800 border-rose-200",
  Complete: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const priorityColor: Record<number, string> = {
  1: "bg-rose-500",
  2: "bg-amber-500",
  3: "bg-emerald-500",
};

const ownerColor: Record<string, string> = {
  Caoilinn: "text-blue-600 font-medium",
  Fahim: "text-purple-600 font-medium",
  Jefferson: "text-emerald-600 font-medium",
  Tsedo: "text-amber-600 font-medium",
  Lawrence: "text-indigo-600 font-medium",
  Preet: "text-rose-600 font-medium",
  Cindy: "text-pink-600 font-medium",
  "John De La Torre": "text-cyan-600 font-medium",
};

const CLOSE_TASK_NAME = "Review Financial Statements";
const CLOSE_TASK_OWNER = "John De La Torre";

function isCloseTask(task: Task) {
  return task.task === CLOSE_TASK_NAME && task.user === CLOSE_TASK_OWNER;
}

function StatCard({
  title,
  value,
  icon,
  subtext,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtext: string;
}) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{subtext}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MonthEndCloseCommandCenter() {
  const getInitialStoredState = () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const storedState = getInitialStoredState();

  const [tasks, setTasks] = useState<Task>(null as never) as unknown as [Task[], React.Dispatch<React.SetStateAction<Task[]>>];
  const [selectedMonth, setSelectedMonth] = useState(storedState?.selectedMonth || startingMonth);
  const [monthHistory, setMonthHistory] = useState<any[]>(storedState?.monthHistory || []);
  const [monthSnapshots, setMonthSnapshots] = useState<Record<string, Task[]>>(
    storedState?.monthSnapshots || { [startingMonth]: cloneTasks(initialTasks) }
  );
  const [search, setSearch] = useState("");
  const [employee, setEmployee] = useState("All");
  const [section, setSection] = useState("All");
  const [status, setStatus] = useState("All");
  const [newTaskForm, setNewTaskForm] = useState({
    task: "",
    user: "Caoilinn",
    approver: "Jefferson",
    notes: "",
  });
  const [taskFormError, setTaskFormError] = useState("");
  const [approvalAccessCode, setApprovalAccessCode] = useState("");
  const [approvalAccessGranted, setApprovalAccessGranted] = useState(false);
  const [approvalAccessError, setApprovalAccessError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteAccessCode, setDeleteAccessCode] = useState("");
  const [deleteAccessError, setDeleteAccessError] = useState("");
  const [sortPriorityTasks, setSortPriorityTasks] = useState(false);
  const [sortOwnerTasks, setSortOwnerTasks] = useState(false);
  const [sortPriorityReporting, setSortPriorityReporting] = useState(false);
  const [sortOwnerReporting, setSortOwnerReporting] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [bulkDeleteArmed, setBulkDeleteArmed] = useState(false);
  const [bulkDeleteCode, setBulkDeleteCode] = useState("");
  const [bulkDeleteError, setBulkDeleteError] = useState("");
  const [closeCode, setCloseCode] = useState("");
  const [closeCodeError, setCloseCodeError] = useState("");

  useEffect(() => {
    const initial = storedState?.tasks || initialTasks;
    setTasks(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !Array.isArray(tasks)) return;
    const payload = {
      tasks,
      selectedMonth,
      monthHistory,
      monthSnapshots,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [tasks, selectedMonth, monthHistory, monthSnapshots]);

  const employees = useMemo(() => {
    if (!Array.isArray(tasks)) return ["All"];
    return ["All", ...Array.from(new Set(["Cindy", ...tasks.map((t) => t.user)]))];
  }, [tasks]);

  const sections = useMemo(() => {
    if (!Array.isArray(tasks)) return ["All"];
    return ["All", ...Array.from(new Set(tasks.map((t) => t.section)))];
  }, [tasks]);

  const editableSections = useMemo(() => {
    if (!Array.isArray(tasks)) {
      return ["General", "Cash", "Leases", "Intercompany", "Payroll", "Inventory", "Prepaids", "Fixed Assets", "Tax", "Reporting", "Accruals", "AP", "Revenue"];
    }
    return Array.from(
      new Set(["General", "Cash", "Leases", "Intercompany", "Payroll", "Inventory", "Prepaids", "Fixed Assets", "Tax", "Reporting", "Accruals", "AP", "Revenue", ...tasks.map((t) => t.section)])
    );
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    let result = tasks.filter((t) => {
      const matchesSearch = [t.task, t.user, t.notes, t.section].join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesEmployee = employee === "All" || t.user === employee;
      const matchesSection = section === "All" || t.section === section;
      const matchesStatus = status === "All" || t.status === status;
      return matchesSearch && matchesEmployee && matchesSection && matchesStatus;
    });

    if (sortPriorityTasks && sortOwnerTasks) {
      result = [...result].sort((a, b) => a.priority - b.priority || a.user.localeCompare(b.user) || a.task.localeCompare(b.task));
    } else if (sortPriorityTasks) {
      result = [...result].sort((a, b) => a.priority - b.priority || a.task.localeCompare(b.task));
    } else if (sortOwnerTasks) {
      result = [...result].sort((a, b) => a.user.localeCompare(b.user) || a.task.localeCompare(b.task));
    }

    return result;
  }, [tasks, search, employee, section, status, sortPriorityTasks, sortOwnerTasks]);

  const reportingTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    let result = tasks.filter((t) => t.section === "Reporting");

    if (sortPriorityReporting && sortOwnerReporting) {
      result = [...result].sort((a, b) => a.priority - b.priority || a.user.localeCompare(b.user) || a.task.localeCompare(b.task));
    } else if (sortPriorityReporting) {
      result = [...result].sort((a, b) => a.priority - b.priority || a.task.localeCompare(b.task));
    } else if (sortOwnerReporting) {
      result = [...result].sort((a, b) => a.user.localeCompare(b.user) || a.task.localeCompare(b.task));
    }

    return result;
  }, [tasks, sortPriorityReporting, sortOwnerReporting]);

  const stats = useMemo(() => {
    if (!Array.isArray(tasks)) {
      return { total: 0, completed: 0, blocked: 0, inProgress: 0, progress: 0 };
    }
    const total = tasks.length;
    const completed = tasks.filter((t) => t.done).length;
    const blocked = tasks.filter((t) => t.status === "Blocked").length;
    const inProgress = tasks.filter((t) => t.status === "In progress").length;
    return {
      total,
      completed,
      blocked,
      inProgress,
      progress: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);

  const employeeProgress = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return employees
      .filter((e) => e !== "All")
      .map((name) => {
        const mine = tasks.filter((t) => t.user === name);
        const complete = mine.filter((t) => t.done).length;
        return {
          name,
          total: mine.length,
          complete,
          progress: mine.length ? Math.round((complete / mine.length) * 100) : 0,
        };
      })
      .sort((a, b) => b.progress - a.progress);
  }, [tasks, employees]);

  const sectionBreakdown = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return Array.from(new Set(tasks.map((t) => t.section))).map((name) => {
      const items = tasks.filter((t) => t.section === name);
      const complete = items.filter((t) => t.done).length;
      return { name, value: items.length - complete, total: items.length };
    });
  }, [tasks]);

  const statusPieData = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return statusOptions.map((s) => ({ name: s, value: tasks.filter((t) => t.status === s).length }));
  }, [tasks]);

  const pieColors = ["#e2e8f0", "#fcd34d", "#fda4af", "#86efac"];

  const availableMonths = useMemo(() => {
    return [selectedMonth, ...monthHistory.map((entry) => entry.month)].filter((month, index, arr) => arr.indexOf(month) === index);
  }, [selectedMonth, monthHistory]);

  const pendingApprovalTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return tasks.filter((task) => task.approver === "Jefferson" && task.done && !task.approved);
  }, [tasks]);

  const closeTask = useMemo(() => {
    if (!Array.isArray(tasks)) return undefined;
    return tasks.find((task) => isCloseTask(task));
  }, [tasks]);

  const isMonthClosed = !!closeTask?.done;

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        if (isCloseTask(task) && (Object.prototype.hasOwnProperty.call(updates, "done") || updates.status === "Complete")) {
          return task;
        }
        const next = { ...task, ...updates };
        if (Object.prototype.hasOwnProperty.call(updates, "done")) {
          next.status = updates.done ? "Complete" : task.status === "Complete" ? "Not started" : task.status;
          if (!updates.done) {
            next.approved = false;
            next.approvedBy = "";
          }
        }
        if (updates.status) {
          next.done = updates.status === "Complete";
          if (updates.status !== "Complete") {
            next.approved = false;
            next.approvedBy = "";
          }
        }
        if (Object.prototype.hasOwnProperty.call(updates, "task") && updates.task !== task.task) {
          next.priority = inferPriority(updates.task || task.task);
        }
        return next;
      })
    );
  };

  const updateFilteredTasks = (checked: boolean) => {
    const filteredIds = new Set(filteredTasks.map((task) => task.id));
    setTasks((prev) =>
      prev.map((task) => {
        if (!filteredIds.has(task.id)) return task;
        return {
          ...task,
          done: checked,
          status: checked ? "Complete" : "Not started",
          approved: false,
          approvedBy: "",
        };
      })
    );
  };

  const toggleTaskSelection = (id: number, checked: boolean) => {
    setSelectedTaskIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((taskId) => taskId !== id);
    });
  };

  const toggleSelectAllShown = (taskList: Task[], checked: boolean) => {
    const ids = taskList.map((task) => task.id);
    setSelectedTaskIds((prev) => {
      if (checked) return Array.from(new Set([...prev, ...ids]));
      return prev.filter((id) => !ids.includes(id));
    });
  };

  const openBulkDelete = () => {
    setBulkDeleteArmed(true);
    setBulkDeleteCode("");
    setBulkDeleteError("");
  };

  const cancelBulkDelete = () => {
    setBulkDeleteArmed(false);
    setBulkDeleteCode("");
    setBulkDeleteError("");
  };

  const confirmBulkDelete = () => {
    if (bulkDeleteCode !== "8250") {
      setBulkDeleteError("Incorrect code.");
      return;
    }
    setTasks((prev) => prev.filter((task) => !selectedTaskIds.includes(task.id)));
    setSelectedTaskIds([]);
    setBulkDeleteArmed(false);
    setBulkDeleteCode("");
    setBulkDeleteError("");
  };

  const markMonthClosed = () => {
    if (closeCode !== "6969") {
      setCloseCodeError("Incorrect code.");
      return;
    }
    setTasks((prev) =>
      prev.map((task) =>
        isCloseTask(task)
          ? { ...task, done: true, status: "Complete", approved: false, approvedBy: "", approver: "" }
          : task
      )
    );
    setCloseCode("");
    setCloseCodeError("");
  };

  const approveTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        if (task.approver !== "Jefferson" || !task.done) return task;
        return {
          ...task,
          approved: true,
          approvedBy: "Jefferson",
        };
      })
    );
  };

  const addNewTask = () => {
    const trimmedTask = newTaskForm.task.trim();
    if (!trimmedTask) {
      setTaskFormError("Enter a task name.");
      return;
    }

    const nextTask: Task = {
      id: tasks.length ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
      priority: inferPriority(trimmedTask),
      type: "Monthly",
      task: trimmedTask,
      user: newTaskForm.user,
      approver: newTaskForm.approver,
      approved: false,
      approvedBy: "",
      notes: newTaskForm.notes.trim(),
      done: false,
      status: "Not started",
      section: inferSection(trimmedTask),
    };

    setTasks((prev) => [nextTask, ...prev]);
    setNewTaskForm((prev) => ({ ...prev, task: "", notes: "" }));
    setTaskFormError("");
  };

  const requestDeleteTask = (id: number) => {
    setDeleteTargetId(id);
    setDeleteAccessCode("");
    setDeleteAccessError("");
  };

  const cancelDeleteTask = () => {
    setDeleteTargetId(null);
    setDeleteAccessCode("");
    setDeleteAccessError("");
  };

  const confirmDeleteTask = () => {
    if (deleteAccessCode !== "8250") {
      setDeleteAccessError("Incorrect code.");
      return;
    }
    setTasks((prev) => prev.filter((task) => task.id !== deleteTargetId));
    setSelectedTaskIds((prev) => prev.filter((taskId) => taskId !== deleteTargetId));
    setDeleteTargetId(null);
    setDeleteAccessCode("");
    setDeleteAccessError("");
  };

  const unlockApprovalTab = () => {
    if (approvalAccessCode === "8250") {
      setApprovalAccessGranted(true);
      setApprovalAccessError("");
      setApprovalAccessCode("");
      return;
    }
    setApprovalAccessGranted(false);
    setApprovalAccessError("Incorrect code.");
  };

  const lockApprovalTab = () => {
    setApprovalAccessGranted(false);
    setApprovalAccessCode("");
    setApprovalAccessError("");
  };

  const switchMonth = (nextMonth: string) => {
    if (nextMonth === selectedMonth) return;

    setMonthSnapshots((prev) => {
      const nextSnapshots = {
        ...prev,
        [selectedMonth]: cloneTasks(tasks),
      };
      const nextTasks = nextSnapshots[nextMonth] ? cloneTasks(nextSnapshots[nextMonth]) : cloneTasks(initialTasks);
      setTasks(nextTasks);
      return nextSnapshots;
    });

    setSelectedMonth(nextMonth);
    setSearch("");
    setEmployee("All");
    setSection("All");
    setStatus("All");
    setSelectedTaskIds([]);
    setBulkDeleteArmed(false);
    setDeleteTargetId(null);
  };

  const handleGenerateNextMonth = () => {
    const archivedMonth = createMonthArchive(selectedMonth, tasks);
    const nextMonth = getNextMonthLabel(selectedMonth);
    const freshNextMonthTasks = resetTasksForNewMonth(initialTasks);

    setMonthHistory((prev) => [archivedMonth, ...prev.filter((entry) => entry.month !== archivedMonth.month)]);
    setMonthSnapshots((prev) => ({
      ...prev,
      [selectedMonth]: cloneTasks(tasks),
      [nextMonth]: prev[nextMonth] ? cloneTasks(prev[nextMonth]) : cloneTasks(freshNextMonthTasks),
    }));
    setTasks(cloneTasks(freshNextMonthTasks));
    setSelectedMonth(nextMonth);
    setSearch("");
    setEmployee("All");
    setSection("All");
    setStatus("All");
    setSelectedTaskIds([]);
    setBulkDeleteArmed(false);
    setDeleteTargetId(null);
  };

  if (!Array.isArray(tasks)) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-[112rem] space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[2rem] bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays className="h-4 w-4" />
                Accounting Close Dashboard
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Accounting Close Dashboard</h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                Shared checklist, live progress, and month-end visibility for the accounting team.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Select value={selectedMonth} onValueChange={switchMonth}>
                <SelectTrigger className="w-[180px] rounded-2xl">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="rounded-2xl" onClick={handleGenerateNextMonth}>
                Generate next month
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Overall completion" value={`${stats.progress}%`} subtext={`${stats.completed} of ${stats.total} tasks complete`} icon={<CheckCircle2 className="h-5 w-5" />} />
          <StatCard title="In progress" value={stats.inProgress} subtext="Active items currently being worked" icon={<Clock3 className="h-5 w-5" />} />
          <StatCard title="Blocked" value={stats.blocked} subtext="Items needing attention" icon={<AlertTriangle className="h-5 w-5" />} />
          <StatCard title="Team members" value={employees.length - 1} subtext="Assigned across the checklist" icon={<User className="h-5 w-5" />} />
          <StatCard title="Close status" value={isMonthClosed ? "Closed" : "Open"} subtext={isMonthClosed ? "Month is Closed" : "Waiting for final financial statement review"} icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-5 rounded-2xl bg-white p-1 shadow-sm">
            <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-xl">Task board</TabsTrigger>
            <TabsTrigger value="employee" className="rounded-xl">Employee view</TabsTrigger>
            <TabsTrigger value="approval" className="rounded-xl">Manager approval</TabsTrigger>
            <TabsTrigger value="reporting" className="rounded-xl">Reporting FCC/IBM</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="rounded-3xl border-0 shadow-sm xl:col-span-2">
                <CardHeader>
                  <CardTitle>Progress by employee</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={employeeProgress}>
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="progress" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle>Status mix</CardTitle>
                    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                      <span className="text-sm text-slate-500">Final review</span>
                      {isMonthClosed ? (
                        <Badge className="rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Month is Closed</Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={closeCode}
                            onChange={(e) => setCloseCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="Enter code"
                            className="h-9 w-28 rounded-xl bg-white"
                          />
                          <Button className="rounded-xl" onClick={markMonthClosed}>
                            Close month
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {!isMonthClosed && closeTask ? <p className="text-sm text-slate-500">{closeTask.user} must complete {closeTask.task.toLowerCase()} to close the month.</p> : null}
                  {closeCodeError ? <p className="text-sm text-rose-600">{closeCodeError}</p> : null}
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusPieData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={4}>
                          {statusPieData.map((entry, index) => (
                            <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {statusPieData.map((item, i) => (
                      <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                          {item.name}
                        </span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Team progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {employeeProgress.map((person) => (
                    <div key={person.name} className="rounded-2xl bg-slate-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{person.name}</p>
                          <p className="text-sm text-slate-500">
                            {person.complete} of {person.total} complete
                          </p>
                        </div>
                        <Badge variant="secondary" className="rounded-xl">
                          {person.progress}%
                        </Badge>
                      </div>
                      <Progress value={person.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Open items by section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sectionBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.total} total tasks</p>
                      </div>
                      <Badge className="rounded-xl bg-slate-900 text-white hover:bg-slate-900">{item.value} open</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle>Task board</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="rounded-2xl" onClick={openBulkDelete} disabled={selectedTaskIds.length === 0}>
                        Bulk delete selected ({selectedTaskIds.length})
                      </Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => setSortOwnerTasks((prev) => !prev)}>
                        {sortOwnerTasks ? "Reset Owner sort" : "Sort by Owner"}
                      </Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => setSortPriorityTasks((prev) => !prev)}>
                        {sortPriorityTasks ? "Reset Priority sort" : "Sort by Priority"}
                      </Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => updateFilteredTasks(true)}>
                        Select all shown
                      </Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => updateFilteredTasks(false)}>
                        Uncheck all shown
                      </Button>
                      <Button variant="outline" className="rounded-2xl" disabled>
                        Approval handled in Manager tab
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 lg:grid-cols-[1.8fr_1fr_1fr_1.2fr_auto]">
                    <Input
                      value={newTaskForm.task}
                      onChange={(e) => setNewTaskForm((prev) => ({ ...prev, task: e.target.value }))}
                      placeholder="Add a new task"
                      className="rounded-2xl bg-white"
                    />
                    <Select value={newTaskForm.user} onValueChange={(value) => setNewTaskForm((prev) => ({ ...prev, user: value }))}>
                      <SelectTrigger className="rounded-2xl bg-white">
                        <SelectValue placeholder="Owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.filter((e) => e !== "All").map((e) => (
                          <SelectItem key={e} value={e}>
                            {e}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={newTaskForm.approver || "None"} onValueChange={(value) => setNewTaskForm((prev) => ({ ...prev, approver: value === "None" ? "" : value }))}>
                      <SelectTrigger className="rounded-2xl bg-white">
                        <SelectValue placeholder="Approver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jefferson">Jefferson</SelectItem>
                        <SelectItem value="None">No approver</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={newTaskForm.notes}
                      onChange={(e) => setNewTaskForm((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Optional note"
                      className="rounded-2xl bg-white"
                    />
                    <Button className="rounded-2xl" onClick={addNewTask}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add task
                    </Button>
                  </div>

                  {taskFormError ? <p className="text-sm text-rose-600">{taskFormError}</p> : null}

                  {bulkDeleteArmed ? (
                    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-3">
                      <span className="text-sm text-slate-700">Enter access code to confirm bulk delete</span>
                      <Input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={bulkDeleteCode}
                        onChange={(e) => setBulkDeleteCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="Enter code"
                        className="h-9 w-28 rounded-xl bg-white"
                      />
                      <Button size="sm" className="rounded-xl" onClick={confirmBulkDelete}>
                        Confirm bulk delete
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl" onClick={cancelBulkDelete}>
                        Cancel
                      </Button>
                      {bulkDeleteError ? <span className="text-xs text-rose-600">{bulkDeleteError}</span> : null}
                    </div>
                  ) : null}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-3 lg:grid-cols-4">
                  <div className="relative lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search task, note, owner, or section" className="rounded-2xl pl-9" />
                  </div>
                  <Select value={employee} onValueChange={setEmployee}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-3">
                    <Select value={section} onValueChange={setSection}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
                  <Table className="min-w-[1700px]">
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>
                          <Checkbox checked={filteredTasks.length > 0 && filteredTasks.every((task) => selectedTaskIds.includes(task.id))} onCheckedChange={(checked) => toggleSelectAllShown(filteredTasks, !!checked)} />
                        </TableHead>
                        <TableHead>Done</TableHead>
                        <TableHead>
                          <button type="button" className="font-medium" onClick={() => setSortPriorityTasks((prev) => !prev)}>
                            Priority
                          </button>
                        </TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>
                          <button type="button" className="font-medium" onClick={() => setSortOwnerTasks((prev) => !prev)}>
                            Owner
                          </button>
                        </TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Approver</TableHead>
                        <TableHead>Approval</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Checkbox checked={selectedTaskIds.includes(task.id)} onCheckedChange={(checked) => toggleTaskSelection(task.id, !!checked)} />
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={task.done} onCheckedChange={(checked) => updateTask(task.id, { done: !!checked })} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${priorityColor[task.priority]}`} />
                              <span>{task.priority}</span>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[620px] align-top">
                            <div className="space-y-2">
                              <div className="flex items-start gap-3">
                                <Input value={task.task} onChange={(e) => updateTask(task.id, { task: e.target.value })} className="h-9 min-w-[540px] rounded-xl" />
                                <Button size="icon" variant="ghost" className="shrink-0 rounded-xl text-slate-500 hover:text-rose-600" onClick={() => requestDeleteTask(task.id)} title="Delete task">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {task.notes ? <p className="text-xs text-slate-500">{task.notes}</p> : null}
                              {deleteTargetId === task.id ? (
                                <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-rose-50 p-2">
                                  <Input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={deleteAccessCode}
                                    onChange={(e) => setDeleteAccessCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                    placeholder="Enter code"
                                    className="h-9 w-32 rounded-xl bg-white"
                                  />
                                  <Button size="sm" className="rounded-xl" onClick={confirmDeleteTask}>
                                    Confirm delete
                                  </Button>
                                  <Button size="sm" variant="outline" className="rounded-xl" onClick={cancelDeleteTask}>
                                    Cancel
                                  </Button>
                                  {deleteAccessError ? <span className="text-xs text-rose-600">{deleteAccessError}</span> : null}
                                </div>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[220px]">
                            <Select value={task.user} onValueChange={(value) => updateTask(task.id, { user: value, approved: false, approvedBy: "" })}>
                              <SelectTrigger className="h-9 w-[190px] rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {employees.filter((e) => e !== "All").map((owner) => (
                                  <SelectItem key={owner} value={owner}>
                                    {owner}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="min-w-[190px]">
                            <Select value={task.section} onValueChange={(value) => updateTask(task.id, { section: value })}>
                              <SelectTrigger className="h-9 w-[150px] rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {editableSections.map((sectionOption) => (
                                  <SelectItem key={sectionOption} value={sectionOption}>
                                    {sectionOption}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="min-w-[190px]">
                            <Select value={task.status} onValueChange={(value) => updateTask(task.id, { status: value })}>
                              <SelectTrigger className={`h-9 w-[145px] rounded-xl border ${statusColor[task.status]}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input value={task.notes} onChange={(e) => updateTask(task.id, { notes: e.target.value })} placeholder="Add note" className="h-9 w-[260px] rounded-xl" />
                          </TableCell>
                          <TableCell className="min-w-[150px]">{task.approver || "-"}</TableCell>
                          <TableCell>
                            {task.approver === "Jefferson" ? (
                              task.approved ? (
                                <Badge className="rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Approved by Manager</Badge>
                              ) : task.done ? (
                                <Badge className="rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-100">Pending Manager approval</Badge>
                              ) : (
                                <span className="text-sm text-slate-400">Waiting for completion</span>
                              )
                            ) : (
                              <span className="text-sm text-slate-400">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employee" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Employee filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={employee} onValueChange={setEmployee}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.filter((e) => e !== "All").map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    Use this view for a clean employee-by-employee task list during month-end reviews.
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>{employee === "All" ? "Select an employee" : `${employee}'s month-end checklist`}</CardTitle>
                </CardHeader>
                <CardContent>
                  {employee === "All" ? (
                    <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-200 text-slate-500">
                      Pick an employee to view their checklist.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tasks.filter((t) => t.user === employee).map((task) => (
                        <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-4">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex gap-3">
                              <Checkbox checked={task.done} onCheckedChange={(checked) => updateTask(task.id, { done: !!checked })} className="mt-1" />
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-medium text-slate-900">{task.task}</p>
                                  <Badge className={`rounded-xl border ${statusColor[task.status]}`}>{task.status}</Badge>
                                  <Badge variant="secondary" className="rounded-xl">
                                    P{task.priority}
                                  </Badge>
                                </div>
                                <p className="mt-2 text-sm text-slate-500">
                                  Section: {task.section} {task.approver ? `• Approver: ${task.approver}` : ""}
                                </p>
                                <Textarea value={task.notes} onChange={(e) => updateTask(task.id, { notes: e.target.value })} placeholder="Add notes, blockers, or exceptions" className="mt-3 min-h-[90px] rounded-2xl" />
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {statusOptions.map((s) => (
                                <Button key={s} variant={task.status === s ? "default" : "outline"} className="rounded-2xl" onClick={() => updateTask(task.id, { status: s })}>
                                  {s}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="approval" className="space-y-6">
            {!approvalAccessGranted ? (
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Manager approval access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-w-md rounded-3xl bg-slate-50 p-5">
                    <div className="mb-3 flex items-center gap-2 text-slate-700">
                      <Lock className="h-4 w-4" />
                      Enter your 4-digit access code to open the approval queue.
                    </div>
                    <div className="flex gap-3">
                      <Input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={approvalAccessCode}
                        onChange={(e) => setApprovalAccessCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="Code"
                        className="rounded-2xl bg-white"
                      />
                      <Button className="rounded-2xl" onClick={unlockApprovalTab}>
                        Unlock
                      </Button>
                    </div>
                    {approvalAccessError ? <p className="mt-3 text-sm text-rose-600">{approvalAccessError}</p> : null}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle>Manager approval queue</CardTitle>
                      <p className="mt-2 text-sm text-slate-500">Completed items waiting for your approval. Approvals here update the main task board automatically.</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-100">{pendingApprovalTasks.length} pending</Badge>
                      <Button variant="outline" className="rounded-2xl" onClick={lockApprovalTab}>
                        Lock tab
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {pendingApprovalTasks.length === 0 ? (
                    <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-slate-200 text-slate-500">
                      No completed items are waiting for approval.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingApprovalTasks.map((task) => (
                        <div key={task.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-slate-900">{task.task}</p>
                                <Badge variant="secondary" className="rounded-xl">
                                  <span className={ownerColor[task.user] || "font-medium"}>{task.user}</span>
                                </Badge>
                                <Badge className="rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-100">Pending approval</Badge>
                              </div>
                              <p className="mt-2 text-sm text-slate-500">
                                Section: {task.section} • Priority: P{task.priority} • Status: {task.status}
                              </p>
                              {task.notes ? <p className="mt-2 text-sm text-slate-500">Notes: {task.notes}</p> : null}
                            </div>
                            <Button className="rounded-2xl" onClick={() => approveTask(task.id)}>
                              Approve item
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reporting" className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle>Reporting FCC / IBM task board</CardTitle>
                      <p className="mt-2 text-sm text-slate-500">Reporting tasks use the same workflow and controls as the main task board.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="rounded-2xl" onClick={openBulkDelete} disabled={selectedTaskIds.filter((id) => reportingTasks.some((task) => task.id === id)).length === 0}>
                        Bulk delete selected ({selectedTaskIds.filter((id) => reportingTasks.some((task) => task.id === id)).length})
                      </Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => setSortOwnerReporting((prev) => !prev)}>
                        {sortOwnerReporting ? "Reset Owner sort" : "Sort by Owner"}
                      </Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => setSortPriorityReporting((prev) => !prev)}>
                        {sortPriorityReporting ? "Reset Priority sort" : "Sort by Priority"}
                      </Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => toggleSelectAllShown(reportingTasks, true)}>
                        Select all shown
                      </Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => toggleSelectAllShown(reportingTasks, false)}>
                        Uncheck all shown
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
                  <Table className="min-w-[1700px]">
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>
                          <Checkbox checked={reportingTasks.length > 0 && reportingTasks.every((task) => selectedTaskIds.includes(task.id))} onCheckedChange={(checked) => toggleSelectAllShown(reportingTasks, !!checked)} />
                        </TableHead>
                        <TableHead>Done</TableHead>
                        <TableHead>
                          <button type="button" className="font-medium" onClick={() => setSortPriorityReporting((prev) => !prev)}>
                            Priority
                          </button>
                        </TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>
                          <button type="button" className="font-medium" onClick={() => setSortOwnerReporting((prev) => !prev)}>
                            Owner
                          </button>
                        </TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Approver</TableHead>
                        <TableHead>Approval</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportingTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Checkbox checked={selectedTaskIds.includes(task.id)} onCheckedChange={(checked) => toggleTaskSelection(task.id, !!checked)} />
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={task.done} onCheckedChange={(checked) => updateTask(task.id, { done: !!checked })} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${priorityColor[task.priority]}`} />
                              <span>{task.priority}</span>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[620px] align-top">
                            <div className="space-y-2">
                              <div className="flex items-start gap-3">
                                <Input value={task.task} onChange={(e) => updateTask(task.id, { task: e.target.value })} className="h-9 min-w-[540px] rounded-xl" />
                                <Button size="icon" variant="ghost" className="shrink-0 rounded-xl text-slate-500 hover:text-rose-600" onClick={() => requestDeleteTask(task.id)} title="Delete task">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {task.notes ? <p className="text-xs text-slate-500">{task.notes}</p> : null}
                              {deleteTargetId === task.id ? (
                                <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-rose-50 p-2">
                                  <Input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={deleteAccessCode}
                                    onChange={(e) => setDeleteAccessCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                    placeholder="Enter code"
                                    className="h-9 w-32 rounded-xl bg-white"
                                  />
                                  <Button size="sm" className="rounded-xl" onClick={confirmDeleteTask}>
                                    Confirm delete
                                  </Button>
                                  <Button size="sm" variant="outline" className="rounded-xl" onClick={cancelDeleteTask}>
                                    Cancel
                                  </Button>
                                  {deleteAccessError ? <span className="text-xs text-rose-600">{deleteAccessError}</span> : null}
                                </div>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[220px]">
                            <Select value={task.user} onValueChange={(value) => updateTask(task.id, { user: value, approved: false, approvedBy: "" })}>
                              <SelectTrigger className="h-9 w-[190px] rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {employees.filter((e) => e !== "All").map((owner) => (
                                  <SelectItem key={owner} value={owner}>
                                    {owner}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="min-w-[190px]">
                            <Select value={task.section} onValueChange={(value) => updateTask(task.id, { section: value })}>
                              <SelectTrigger className="h-9 w-[150px] rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {editableSections.map((sectionOption) => (
                                  <SelectItem key={sectionOption} value={sectionOption}>
                                    {sectionOption}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="min-w-[190px]">
                            <Select value={task.status} onValueChange={(value) => updateTask(task.id, { status: value })}>
                              <SelectTrigger className={`h-9 w-[145px] rounded-xl border ${statusColor[task.status]}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input value={task.notes} onChange={(e) => updateTask(task.id, { notes: e.target.value })} placeholder="Add note" className="h-9 w-[260px] rounded-xl" />
                          </TableCell>
                          <TableCell className="min-w-[150px]">{task.approver || "-"}</TableCell>
                          <TableCell className="min-w-[220px]">
                            {task.approved ? (
                              <Badge className="rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Approved by Manager</Badge>
                            ) : task.done ? (
                              <Badge className="rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-100">Pending Manager approval</Badge>
                            ) : (
                              <span className="text-sm text-slate-400">Waiting for completion</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Archived month history</CardTitle>
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => {
                    setMonthHistory([]);
                    setMonthSnapshots(() => ({ [selectedMonth]: cloneTasks(tasks) }));
                  }}
                  disabled={monthHistory.length === 0}
                >
                  Clear history
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {monthHistory.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                  No archived months yet. When you generate the next month, the current month will be saved here before the checklist resets.
                </div>
              ) : (
                monthHistory.map((entry) => (
                  <div key={entry.month} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{entry.month}</p>
                      <p className="text-sm text-slate-500">
                        {entry.completed} of {entry.total} complete • {entry.blocked} blocked • {entry.inProgress} in progress
                      </p>
                    </div>
                    <Badge variant="secondary" className="rounded-xl">
                      {entry.progress}%
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="flex items-start gap-3 p-5">
                <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
                  <CircleAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Priority monitoring</p>
                  <p className="mt-1 text-sm text-slate-500">Priority 1 tasks stay visible at the top so close-critical items do not get buried.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="flex items-start gap-3 p-5">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                  <ListTodo className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Recurring monthly engine</p>
                  <p className="mt-1 text-sm text-slate-500">The next version can duplicate the checklist automatically every month and preserve prior month history.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="flex items-start gap-3 p-5">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Manager review ready</p>
                  <p className="mt-1 text-sm text-slate-500">Built for leadership visibility, employee updates, and quick month-end check-ins.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}