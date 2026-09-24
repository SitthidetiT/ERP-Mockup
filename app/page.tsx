"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { DashboardView } from "../components/dashboard/DashboardView";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Bell,
  Box,
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  Download,
  Factory,
  FileClock,
  FileText,
  Filter,
  FolderKanban,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  PackageCheck,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Tag,
  Truck,
  UserRound,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  AppData,
  Job,
  Leave,
  ModuleId,
  Role,
  WorkTab,
  costParts,
  dateTH,
  initialData,
  modules,
  money,
  revenue,
  roles,
  routeOptions,
  stageNames,
  stageOwners,
  statusOf,
} from "./data";
type Dialog =
  | "quote"
  | "send"
  | "response"
  | "review"
  | "plan"
  | "outsource"
  | "stock"
  | "qc"
  | "leave"
  | "settings"
  | null;
const STORAGE = "erp-company-platform-v2";
const iconMap: Record<ModuleId, React.ElementType> = {
  dashboard: LayoutDashboard,
  access: ShieldCheck,
  sales: FileText,
  jobs: FolderKanban,
  engineering: Settings2,
  ppc: CalendarDays,
  purchase: ShoppingCart,
  inventory: Boxes,
  production: Factory,
  quality: ClipboardCheck,
  delivery: Truck,
  finance: Wallet,
  hr: Users,
};
const tabs: {
  id: WorkTab;
  label: string;
}[] = [
  { id: "overview", label: "ภาพรวม" },
  { id: "quote", label: "ใบเสนอราคา" },
  { id: "drawing", label: "แบบ" },
  { id: "plan", label: "แผนงาน" },
  { id: "purchase", label: "จัดซื้อ" },
  { id: "inventory", label: "คลัง" },
  { id: "production", label: "ผลิต" },
  { id: "qc", label: "QC" },
  { id: "delivery", label: "แพ็ค/จัดส่ง" },
  { id: "cost", label: "ต้นทุน" },
  { id: "history", label: "ประวัติ" },
];
const elevated: Role[] = ["ผู้บริหาร", "ผู้ดูแลระบบ"];
const sampleUsers = [
  ["พนักงานตัวอย่าง 01", "Sales", "ฝ่ายขาย", "ใบเสนอราคา / ลูกค้า"],
  ["พนักงานตัวอย่าง 02", "วิศวกรรม", "วิศวกรรม", "รีวิวงาน / อนุมัติ"],
  ["พนักงานตัวอย่าง 03", "ผู้เขียนแบบ", "เขียนแบบ", "แบบและเวอร์ชัน"],
  ["พนักงานตัวอย่าง 04", "PPC", "วางแผน", "เส้นทางผลิต / คิวงาน"],
  ["พนักงานตัวอย่าง 05", "คลัง", "คลัง", "รับเข้า / เบิก / โอน"],
  ["พนักงานตัวอย่าง 06", "QC", "คุณภาพ", "ผลตรวจ / ส่งกลับ"],
  ["พนักงานตัวอย่าง 07", "HR", "บุคคล", "ใบลา / เวลาเข้างาน"],
];
function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber" | "red" | "purple";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
function StatusBadge({ job }: { job: Job }) {
  const tone = job.rework
    ? "red"
    : job.stage === 11
      ? "green"
      : job.stage >= 8
        ? "blue"
        : job.stage <= 2
          ? "amber"
          : "purple";
  return <Badge tone={tone}>{statusOf(job)}</Badge>;
}
function Empty({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="empty">
      <Package size={28} />
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  );
}
export default function Home() {
  const [data, setData] = useState<AppData>(initialData);
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<Role>("ผู้บริหาร");
  const [module, setModule] = useState<ModuleId>("dashboard");
  const [jobId, setJobId] = useState<string | null>(null);
  const [tab, setTab] = useState<WorkTab>("overview");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ทั้งหมด");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE);
      if (saved) setData({ ...initialData, ...JSON.parse(saved) });
    } catch {
      /* demo resets to seed */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (window.location.pathname === "/") {
      window.location.replace("/dashboard");
    }
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE, JSON.stringify(data));
  }, [data, ready]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3600);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const job = data.jobs.find((j) => j.id === jobId) || null;
  const canCost = elevated.includes(role) || role === "ผู้ดูต้นทุน";
  const isManager = elevated.includes(role);
  const permitted = (owner: Role) => isManager || role === owner;
  const visibleJobs = useMemo(
    () =>
      data.jobs.filter((j) => {
        const related =
          isManager ||
          role === "Sales" ||
          role === "ผู้ดูต้นทุน" ||
          j.owner === role ||
          (role === "วิศวกรรม" && j.stage >= 3) ||
          (role === "ผู้เขียนแบบ" && j.stage >= 4) ||
          (role === "PPC" && j.stage >= 5) ||
          (role === "จัดซื้อ" && j.outsourced) ||
          (role === "คลัง" && j.stage >= 6) ||
          (role === "ฝ่ายผลิต" && j.stage >= 7) ||
          (role === "QC" && j.stage >= 8) ||
          (role === "แพ็ค" && j.stage >= 9) ||
          (role === "จัดส่ง" && j.stage >= 10);
        return (
          related && (j.kind !== "ซีเคร็ต" || isManager || j.owner === role)
        );
      }),
    [data.jobs, role, isManager],
  );
  useEffect(() => {
    if (ready && jobId && !visibleJobs.some((j) => j.id === jobId)) {
      setJobId(null);
      setModule("dashboard");
    }
  }, [ready, role, jobId, visibleJobs]);
  const listedJobs = visibleJobs.filter(
    (j) =>
      `${j.id} ${j.quoteId} ${j.customer} ${j.title}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "ทั้งหมด" ||
        (filter === "กำลังดำเนินการ" && j.stage < 11 && !j.rework) ||
        (filter === "ส่งกลับแก้ไข" && j.rework) ||
        (filter === "เสร็จแล้ว" && j.stage === 11)),
  );
  const activeJobs = visibleJobs.filter((j) => j.stage < 11).length;
  const urgentJobs = visibleJobs.filter(
    (j) => j.priority === "เร่งด่วน" && j.stage < 11,
  ).length;
  const myTasks = visibleJobs
    .filter(
      (j) => j.owner === role || (isManager && (j.stage === 9 || j.rework)),
    )
    .slice(0, 4);
  const jobsFor = (check: (j: Job) => boolean) => listedJobs.filter(check);
  function navigate(next: ModuleId) {
    if (next === "dashboard" && window.location.pathname !== "/dashboard") {
      window.location.assign("/dashboard");
      return;
    }
    setModule(next);
    setJobId(null);
    setTab("overview");
    setMobileNav(false);
    setSearch("");
    setFilter("ทั้งหมด");
  }
  function openJob(id: string, nextTab: WorkTab = "overview") {
    setJobId(id);
    setTab(nextTab);
    setMobileNav(false);
    setDialog(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function openDialog(next: Dialog, defaults: Record<string, string> = {}) {
    setForm(defaults);
    setError("");
    setDialog(next);
  }
  function field(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }
  function updateJob(
    id: string,
    change: Partial<Job>,
    reason: string,
    fromLabel?: string,
    toLabel?: string,
  ) {
    const now = new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
    setData((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) =>
        j.id === id
          ? {
              ...j,
              ...change,
              logs: [
                {
                  at: now,
                  by:
                    role === "ผู้บริหาร"
                      ? "ผู้บริหาร (สาธิต)"
                      : `${role} (สาธิต)`,
                  from: fromLabel || statusOf(j),
                  to:
                    toLabel ||
                    (change.stage === undefined
                      ? statusOf(j)
                      : stageNames[change.stage]),
                  reason,
                },
                ...j.logs,
              ],
            }
          : j,
      ),
      notifications: [reason, ...prev.notifications].slice(0, 8),
    }));
    setToast("บันทึกสถานะจำลองแล้ว — ไม่มีการเปลี่ยนข้อมูลภายนอก");
  }
  function advance(j: Job) {
    if (j.stage === 0) return openDialog("send", { email: j.email });
    if (j.stage === 1) return openDialog("response", { response: "ตอบรับ" });
    if (j.stage === 3) return openDialog("review", { decision: "อนุมัติ" });
    if (j.stage === 5) return openDialog("plan");
    if (j.stage === 9 && j.qcPass === 0)
      return openDialog("qc", {
        pass: String(j.lines[0].qty),
        reject: "0",
        result: "ผ่าน",
      });
    if (j.stage === 6 && j.outsourced && !j.outsourceReturned)
      return openDialog("outsource");
    if (j.stage === 6)
      return openDialog("stock", {
        kind: "เบิก",
        item: data.stockItems[0].name,
        from: "Store 1",
        to: j.id,
        qty: "1",
      });
    const next = j.stage === 9 ? 10 : j.stage + 1;
    const reason =
      j.stage === 8 && j.rework
        ? "แก้ไขแล้วและส่งตรวจซ้ำ"
        : j.stage === 10
          ? "บันทึกการจัดส่งและหลักฐานตัวอย่าง"
          : `จำลองขั้นตอน: ${stageNames[next]}`;
    const change: Partial<Job> = {
      stage: next,
      owner: stageOwners[next],
      ...(next === 5 ? { drawingVersion: j.drawingVersion + 1 } : {}),
      ...(next === 7 ? { materialsIssued: true } : {}),
      ...(next === 9 ? { rework: false } : {}),
      ...(next === 10 ? { packed: true } : {}),
      ...(next === 11 ? { delivered: true } : {}),
    };
    updateJob(j.id, change, reason);
  }
  function actionLabel(j: Job) {
    if (j.stage === 0) return "ตรวจผู้รับและจำลองการส่ง";
    if (j.stage === 1) return "บันทึกผลตอบรับลูกค้า";
    if (j.stage === 2) return "เปิดเลขงาน";
    if (j.stage === 3) return "รีวิวทางวิศวกรรม";
    if (j.stage === 4) return "บันทึกแบบเวอร์ชันใหม่";
    if (j.stage === 5) return "วางแผนเส้นทางผลิต";
    if (j.stage === 6 && j.outsourced && !j.outsourceReturned)
      return "จัดการงานจ้างภายนอก";
    if (j.stage === 6) return "จำลองการเบิกวัสดุ";
    if (j.stage === 7) return "เริ่มงานผลิต";
    if (j.stage === 8) return j.rework ? "แก้ไขและส่งตรวจซ้ำ" : "ส่งตรวจ QC";
    if (j.stage === 9) return j.qcPass ? "แพ็คสินค้า" : "บันทึกผล QC";
    if (j.stage === 10) return "บันทึกการจัดส่ง";
    return "จัดส่งสำเร็จ";
  }
  function saveDialog() {
    if (dialog === "quote") {
      const selectedCustomer = data.customers.find(
        (customer) => customer.id === form.customerId,
      );
      if (
        !selectedCustomer ||
        !form.title?.trim() ||
        Number(form.qty) <= 0 ||
        Number(form.price) <= 0
      )
        return setError(
          "กรุณาเลือกลูกค้าจากทะเบียน แล้วกรอกชิ้นงาน จำนวน และราคาให้ครบถ้วน",
        );
      const n = data.jobs.length + 1;
      const id = `JOB-2609-${String(n).padStart(3, "0")}`;
      const newJob: Job = {
        id,
        quoteId: `QT-2609-${String(n).padStart(3, "0")}`,
        customerId: selectedCustomer.id,
        customer: selectedCustomer.name,
        contact: selectedCustomer.contact,
        email: selectedCustomer.email,
        address: selectedCustomer.address,
        title: form.title,
        description: form.description || "ชิ้นงานตัวอย่าง",
        due: form.due || "2026-10-30",
        priority: "ปกติ",
        kind: "ทำเอง 100%",
        stage: 0,
        owner: "Sales",
        lines: [
          {
            name: form.title,
            qty: Number(form.qty),
            price: Number(form.price),
          },
        ],
        drawingVersion: 0,
        route: [],
        materialsIssued: false,
        outsourced: false,
        outsourceSent: false,
        outsourceReturned: false,
        qcFailCount: 0,
        qcPass: 0,
        qcReject: 0,
        qcReason: "",
        rework: false,
        packed: false,
        delivered: false,
        logs: [
          {
            at: "24 ก.ย. 2569",
            by: `${role} (สาธิต)`,
            from: "—",
            to: "ร่างใบเสนอราคา",
            reason: "สร้างใบเสนอราคาจำลอง",
          },
        ],
      };
      setData((prev) => ({ ...prev, jobs: [newJob, ...prev.jobs] }));
      setToast("สร้างใบเสนอราคาจำลองแล้ว");
      setDialog(null);
      openJob(id, "quote");
      return;
    }
    if (dialog === "leave") {
      if (!form.from || !form.to || !form.reason?.trim())
        return setError("กรุณากรอกวันที่และเหตุผลการลา");
      const leave: Leave = {
        id: `LV-2609-${String(data.leaves.length + 1).padStart(3, "0")}`,
        employee: form.employee || "พนักงานตัวอย่าง 01",
        type: form.type || "ลาพักร้อน",
        from: form.from,
        to: form.to,
        reason: form.reason,
        status: "รออนุมัติ",
      };
      setData((prev) => ({
        ...prev,
        leaves: [leave, ...prev.leaves],
        notifications: [`ใบลา ${leave.id} รออนุมัติ`, ...prev.notifications],
      }));
      setToast("ยื่นใบลาจำลองแล้ว");
      setDialog(null);
      return;
    }
    if (dialog === "stock") {
      const kind = form.kind || "รับเข้า",
        itemName = form.item || data.stockItems[0].name;
      const from = form.from || "Store 1",
        to = kind === "เบิก" ? job?.id || "งานตัวอย่าง" : form.to || "Store 1";
      const qty = Number(form.qty || 0),
        item = data.stockItems.find((x) => x.name === itemName);
      const fromIndex = Number(from.replace("Store ", "")) - 1,
        toIndex = Number(to.replace("Store ", "")) - 1;
      if (
        !item ||
        !Number.isInteger(qty) ||
        qty <= 0 ||
        (kind === "โอน" && from === to) ||
        (kind !== "รับเข้า" &&
          (!Number.isInteger(fromIndex) || item.stock[fromIndex] < qty))
      )
        return setError("ตรวจจำนวนคงเหลือและ Store ต้นทาง/ปลายทางให้ถูกต้อง");
      const move = {
        id: `MV-2609-${String(data.stockMoves.length + 1).padStart(3, "0")}`,
        item: itemName,
        kind,
        from: kind === "รับเข้า" ? "ภายนอก (ตัวอย่าง)" : from,
        to,
        qty,
        at: new Intl.DateTimeFormat("th-TH", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date()),
        jobId: job?.id,
      };
      setData((prev) => ({
        ...prev,
        stockItems: prev.stockItems.map((x) =>
          x.name === itemName
            ? {
                ...x,
                stock: x.stock.map(
                  (n, i) =>
                    n +
                    (kind !== "รับเข้า" && i === fromIndex ? -qty : 0) +
                    (kind !== "เบิก" && i === toIndex ? qty : 0),
                ),
              }
            : x,
        ),
        stockMoves: [move, ...prev.stockMoves],
        notifications: [
          `${kind} ${itemName} ${qty} ${item.unit} (จำลอง)`,
          ...prev.notifications,
        ],
      }));
      if (kind === "เบิก" && job)
        updateJob(
          job.id,
          { stage: 7, owner: "ฝ่ายผลิต", materialsIssued: true },
          `คลังเบิก ${itemName} ${qty} ${item.unit} จาก ${from} ให้ ${job.id} (จำลอง)`,
        );
      else setToast(`บันทึก${kind}วัสดุจำลองแล้ว`);
      setDialog(null);
      return;
    }
    if (!job) return;
    if (dialog === "send") {
      if (!form.email?.includes("@") || !form.email.endsWith(".example"))
        return setError("ใช้อีเมลตัวอย่างโดเมน .example เท่านั้น");
      updateJob(
        job.id,
        { stage: 1, owner: "Sales", email: form.email },
        `จำลองการส่งใบเสนอราคาไปยัง ${form.email} (ไม่มีอีเมลถูกส่งจริง)`,
      );
    } else if (dialog === "response") {
      if (form.response !== "ตอบรับ") {
        updateJob(
          job.id,
          {},
          `บันทึกผลตอบรับ: ${form.response}`,
          undefined,
          form.response,
        );
      } else
        updateJob(job.id, { stage: 2 }, "Sales บันทึกว่าลูกค้าตอบรับ (จำลอง)");
    } else if (dialog === "review") {
      if (form.decision === "ส่งกลับ" && !form.reason?.trim())
        return setError("กรุณาระบุเหตุผลที่ส่งกลับ");
      if (form.decision === "ส่งกลับ")
        updateJob(
          job.id,
          {},
          `วิศวกรรมส่งกลับ: ${form.reason}`,
          undefined,
          "ส่งกลับแก้ไข",
        );
      else
        updateJob(
          job.id,
          { stage: 4, owner: "ผู้เขียนแบบ" },
          "วิศวกรรมอนุมัติแนวทางผลิต (จำลอง)",
        );
    } else if (dialog === "plan") {
      const route = routeOptions.filter((x) => form[x] === "true");
      if (!route.length) return setError("เลือกอย่างน้อยหนึ่งขั้นตอนผลิต");
      updateJob(
        job.id,
        {
          stage: 6,
          route,
          owner: form.outsource === "true" ? "จัดซื้อ" : "คลัง",
          outsourced: form.outsource === "true",
          kind:
            form.outsource === "true"
              ? "ทำเองบางส่วน / จ้างภายนอกบางส่วน"
              : job.kind,
        },
        `PPC วางแผน: ${route.join(" → ")}${form.outsource === "true" ? " / มีขั้นตอนจ้างภายนอก" : ""}`,
      );
    } else if (dialog === "outsource") {
      if (!job.outsourceSent)
        updateJob(
          job.id,
          { outsourceSent: true },
          "จัดซื้อบันทึกส่งชิ้นงานจ้างภายนอก (จำลอง)",
        );
      else
        updateJob(
          job.id,
          { outsourceReturned: true, owner: "คลัง" },
          "จัดซื้อบันทึกรับชิ้นงานจ้างภายนอกคืน (จำลอง)",
        );
    } else if (dialog === "qc") {
      const pass = Number(form.pass || 0),
        reject = Number(form.reject || 0);
      if (
        pass < 0 ||
        reject < 0 ||
        pass + reject === 0 ||
        (form.result === "ไม่ผ่าน" && (!form.reason?.trim() || reject === 0))
      )
        return setError(
          "กรุณากรอกจำนวนที่ตรวจ และระบุจำนวนเสียกับเหตุผลเมื่อไม่ผ่าน",
        );
      if (form.result === "ไม่ผ่าน")
        updateJob(
          job.id,
          {
            stage: 8,
            owner: "ฝ่ายผลิต",
            rework: true,
            qcFailCount: job.qcFailCount + 1,
            qcReject: reject,
            qcReason: form.reason,
            qcPass: 0,
          },
          `QC ไม่ผ่าน ${reject} ชิ้น: ${form.reason} ส่งกลับฝ่ายผลิต`,
          undefined,
          "ส่งกลับแก้ไข",
        );
      else
        updateJob(
          job.id,
          {
            qcPass: pass,
            qcReject: reject,
            qcReason: form.reason || "ผ่านตามเกณฑ์ตัวอย่าง",
            owner: "แพ็ค",
          },
          `QC ผ่าน ${pass} ชิ้น${reject ? ` / เสีย ${reject} ชิ้น` : ""} (ผลจำลอง)`,
          undefined,
          "QC ผ่าน",
        );
    }
    setDialog(null);
  }
  function approveLeave(id: string, approved: boolean) {
    setData((prev) => ({
      ...prev,
      leaves: prev.leaves.map((l) =>
        l.id === id ? { ...l, status: approved ? "อนุมัติ" : "ไม่อนุมัติ" } : l,
      ),
      notifications: [
        `ใบลา ${id} ${approved ? "อนุมัติ" : "ไม่อนุมัติ"} (จำลอง)`,
        ...prev.notifications,
      ],
    }));
    setToast("บันทึกผลอนุมัติจำลองแล้ว");
  }
  function resetDemo() {
    setData(initialData);
    setJobId(null);
    setModule("dashboard");
    setDialog(null);
    setToast("รีเซ็ตข้อมูลสาธิตแล้ว");
  }
  const Table = ({
    rows,
    empty = "ยังไม่มีรายการในสถานะนี้",
  }: {
    rows: Job[];
    empty?: string;
  }) =>
    rows.length ? (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>เลขงาน / ใบเสนอราคา</th>
              <th>ลูกค้าและชิ้นงาน</th>
              <th>กำหนดส่ง</th>
              <th>สถานะ</th>
              <th>ผู้รับผิดชอบ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((j) => (
              <tr key={j.id} onClick={() => openJob(j.id)}>
                <td>
                  <strong>{j.id}</strong>
                  <small>{j.quoteId}</small>
                </td>
                <td>
                  <strong>{j.title}</strong>
                  <small>{j.customer}</small>
                </td>
                <td>{dateTH(j.due)}</td>
                <td>
                  <StatusBadge job={j} />
                </td>
                <td>{j.owner}</td>
                <td>
                  <ChevronRight size={17} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <Empty title={empty} detail="ลองเปลี่ยนตัวกรองหรือเลือกงานตัวอย่างอื่น" />
    );
  const ListHeader = ({
    title,
    subtitle,
    action,
  }: {
    title: string;
    subtitle: string;
    action?: React.ReactNode;
  }) => (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
  const JobTablePanel = ({
    title,
    subtitle,
    rows,
  }: {
    title: string;
    subtitle: string;
    rows: Job[];
  }) => (
    <section className="panel">
      <ListHeader title={title} subtitle={subtitle} />
      <Table rows={rows} />
    </section>
  );
  const actionOwner: Role = job
    ? job.stage === 9 && job.qcPass
      ? "แพ็ค"
      : job.stage === 6 && job.outsourced && !job.outsourceReturned
        ? "จัดซื้อ"
        : stageOwners[job.stage]
    : "Sales";
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "show" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Boxes size={23} strokeWidth={2.2} />
          </div>
          <div>
            <strong>ERP Company</strong>
            <span>Platform</span>
          </div>
        </div>
        <div className="workspace-label">
          WORKSPACE <ChevronDown size={14} />
        </div>
        <div className="workspace-card">
          <div className="workspace-avatar">EC</div>
          <div>
            <strong>บริษัทตัวอย่าง</strong>
            <small>พื้นที่สาธิตระบบ</small>
          </div>
          <MoreHorizontal size={17} />
        </div>
        <nav>
          {[
            "ภาพรวม",
            "งานขายและโครงการ",
            "การดำเนินงาน",
            "ข้อมูลสนับสนุน",
            "การจัดการ",
          ].map((group) => (
            <div className="nav-group" key={group}>
              <div className="nav-heading">{group}</div>
              {modules
                .filter(
                  (m) =>
                    m.group === group &&
                    (isManager ||
                      m.roles === null ||
                      m.roles.includes(role) ||
                      m.id === "jobs"),
                )
                .map((m) => {
                  const Icon = iconMap[m.id];
                  return (
                    <button
                      type="button"
                      key={m.id}
                      className={`nav-item ${module === m.id && !job ? "active" : ""}`}
                      onClick={() => navigate(m.id)}
                    >
                      <Icon size={18} />
                      <span>{m.label}</span>
                      {m.id === "jobs" && (
                        <span className="nav-count">{activeJobs}</span>
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="demo-info">
            <Sparkles size={16} />
            <span>DEMO MODE</span>
          </div>
          <button className="reset-link" onClick={resetDemo}>
            รีเซ็ตข้อมูลสาธิต
          </button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="เปิดเมนู"
          >
            <Menu size={22} />
          </button>
          <div className="top-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาเลขงาน ลูกค้า หรือชิ้นงาน..."
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <span className="today">
              <strong>24 กันยายน 2569</strong>
              <small>วันพุธ</small>
            </span>
            <div className="notice-wrap">
              <button
                className="icon-button bell"
                onClick={() => setNoticeOpen(!noticeOpen)}
                aria-label="การแจ้งเตือน"
              >
                <Bell size={19} />
                <i />
              </button>
              {noticeOpen && (
                <div className="notice-popover">
                  <strong>การแจ้งเตือน</strong>
                  {data.notifications.map((n, i) => (
                    <div key={i} className="notice-item">
                      <span className="notice-dot" />
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="top-divider" />
            <div className="role-switch">
              <div className="role-avatar">{role.slice(0, 1)}</div>
              <div>
                <small>สวัสดีตอนบ่ายครับ</small>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  aria-label="สลับบทบาท"
                >
                  {roles.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>
        <main className="main-content">
          <div className="demo-banner">
            <CircleAlert size={17} />
            <span>
              <strong>ต้นแบบเพื่อหารือความต้องการ</strong> ·
              ข้อมูลทั้งหมดเป็นข้อมูลสมมติ · ทุกการส่ง อนุมัติ
              และบันทึกเป็นการจำลอง
            </span>
          </div>
          {job ? (
            <>
              <div className="breadcrumb">
                <button
                  onClick={() => {
                    setJobId(null);
                    setModule("jobs");
                  }}
                >
                  งานทั้งหมด
                </button>
                <ChevronRight size={14} />
                {job.id}
              </div>
              <div className="page-heading job-heading">
                <div>
                  <div className="eyebrow">
                    รายละเอียดงาน <span>/{job.id}</span>
                  </div>
                  <div className="breadcrumb">ERP COMPANY PLATFORM <span>/</span> ภาพรวม</div>
                  <h1>{job.title}</h1>
                  <p>
                    {job.customer} · กำหนดส่ง {dateTH(job.due)}
                  </p>
                </div>
                <div className="heading-actions">
                  <StatusBadge job={job} />
                  {job.stage < 11 && permitted(actionOwner) && (
                    <button
                      className="btn primary"
                      onClick={() => advance(job)}
                    >
                      {actionLabel(job)} <ArrowRight size={17} />
                    </button>
                  )}
                </div>
              </div>
              <div className="job-summary">
                <div>
                  <span>เลขงาน</span>
                  <strong>{job.stage < 3 ? "รอเปิดงาน" : job.id}</strong>
                </div>
                <div>
                  <span>ใบเสนอราคา</span>
                  <strong>{job.quoteId}</strong>
                </div>
                <div>
                  <span>ผู้รับผิดชอบปัจจุบัน</span>
                  <strong>{job.owner}</strong>
                </div>
                <div>
                  <span>ความสำคัญ</span>
                  <Badge tone={job.priority === "เร่งด่วน" ? "red" : "amber"}>
                    {job.priority}
                  </Badge>
                </div>
                <div>
                  <span>ประเภทงาน</span>
                  <strong>{job.kind}</strong>
                </div>
              </div>
              {job.stage < 11 && !permitted(actionOwner) && (
                <div className="inline-note">
                  <ShieldCheck size={16} />
                  ขั้นตอนถัดไปเป็นหน้าที่ของ {actionOwner} ·
                  สลับบทบาทเพื่อทดลองปุ่มทำงาน
                </div>
              )}
              {job.kind === "ซีเคร็ต" && (
                <div className="inline-note">
                  <ShieldCheck size={16} />
                  ตัวอย่างการจำกัดสิทธิ์สำหรับงานซีเคร็ต ·
                  ความหมายและผู้มีสิทธิ์จริงรอยืนยันกับบริษัท
                </div>
              )}
              <div className="progress-panel">
                <div className="progress-label">
                  <strong>เส้นทางงาน</strong>
                  <span>ขั้นตอน {Math.min(job.stage + 1, 12)} จาก 12</span>
                </div>
                <div className="progress-track">
                  {stageNames.map((s, i) => (
                    <div
                      className={`progress-step ${i <= job.stage ? "done" : ""} ${i === job.stage ? "current" : ""}`}
                      key={s}
                      title={s}
                    >
                      <span>{i < job.stage ? <Check size={12} /> : i + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="progress-footer">
                  <span>ใบเสนอราคา</span>
                  <span>วิศวกรรม / แผน</span>
                  <span>ผลิต / QC</span>
                  <span>จัดส่ง</span>
                </div>
              </div>
              <div className="tabs">
                {tabs
                  .filter((t) => t.id !== "cost" || canCost)
                  .map((t) => (
                    <button
                      key={t.id}
                      className={tab === t.id ? "active" : ""}
                      onClick={() => setTab(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
              </div>
              <JobTab
                job={job}
                tab={tab}
                role={role}
                onAction={() => advance(job)}
                onDialog={openDialog}
                onTab={setTab}
                updateJob={updateJob}
                canCost={canCost}
                actionOwner={actionOwner}
              />
            </>
          ) : (
            <>
              <div
                className={`page-heading ${module === "dashboard" ? "dashboard-heading" : ""}`}
              >
                <div>
                  <div className="eyebrow">
                    ERP COMPANY PLATFORM /{" "}
                    {modules.find((m) => m.id === module)?.label}
                  </div>
                  <h1>
                    {module === "dashboard"
                      ? "ภาพรวมการดำเนินงาน"
                      : modules.find((m) => m.id === module)?.label}
                  </h1>
                  <p>
                    {module === "dashboard"
                      ? "ติดตามทุกงาน ตั้งแต่ใบเสนอราคาจนถึงการส่งมอบ ในมุมมองเดียว"
                      : "ข้อมูลตัวอย่างสำหรับทดลองเส้นทางงานและเก็บความต้องการจากแต่ละฝ่าย"}
                  </p>
                </div>
                <div className="heading-actions">
                  {(module === "dashboard" || module === "sales") && (
                    <button
                      className="btn primary"
                      onClick={() =>
                        openDialog("quote", { qty: "1", price: "1000" })
                      }
                    >
                      <Plus size={17} /> สร้างใบเสนอราคา
                    </button>
                  )}
                </div>
              </div>
              {module === "dashboard" && (
                <>
                  <div className="stats-grid">
                    <MetricCard
                      icon={<FolderKanban size={20} />}
                      label="งานทั้งหมด"
                      value={String(visibleJobs.length).padStart(2, "0")}
                      detail="งานที่รอดำเนินการในระบบ"
                      tone="blue"
                    />
                    <MetricCard
                      icon={<Activity size={20} />}
                      label="กำลังดำเนินการ"
                      value={String(activeJobs).padStart(2, "0")}
                      detail="อยู่ในกระบวนการ"
                      tone="purple"
                    />
                    <MetricCard
                      icon={<Clock3 size={20} />}
                      label="งานเร่งด่วน"
                      value={String(urgentJobs).padStart(2, "0")}
                      detail="ต้องติดตามใกล้ชิด"
                      tone="amber"
                    />
                    <MetricCard
                      icon={<CheckCircle2 size={20} />}
                      label="ส่งมอบแล้ว"
                      value={String(
                        visibleJobs.filter((j) => j.stage === 11).length,
                      ).padStart(2, "0")}
                      detail="เสร็จสิ้นการจัดส่ง"
                      tone="green"
                    />
                  </div>
                  {isManager && (
                    <div className="scenario-grid">
                      <QuickActionCard
                        eyebrow="A · งานขาย"
                        title="เริ่มจากใบเสนอราคา"
                        detail="สร้าง → เสนอ → อนุมัติ"
                        icon={<Tag size={20} />}
                        onClick={() =>
                          openDialog("quote", { qty: "1", price: "1000" })
                        }
                      />
                      <QuickActionCard
                        eyebrow="B · ออกสั่งผลิต"
                        title="ติดตาม QC ไม่ผ่าน"
                        detail="เลือกส่งผลิตและตรวจซ้ำ"
                        icon={<Settings2 size={20} />}
                        onClick={() => openJob("JOB-2609-003", "qc")}
                      />
                      <QuickActionCard
                        eyebrow="C · จัดการขนส่ง"
                        title="ส่งงานเข้าสู่ขั้นตอน"
                        detail="ยืนยันและจัดส่งงาน"
                        icon={<Truck size={20} />}
                        onClick={() => openJob("JOB-2609-002", "purchase")}
                      />
                      <QuickActionCard
                        eyebrow="D · หลังการขาย"
                        title="ยื่นและอนุมัติใบลา"
                        detail="แสดงผลผู้ใช้งาน"
                        icon={<Box size={20} />}
                        onClick={() => navigate("hr")}
                      />
                    </div>
                  )}
                  <div className="dashboard-grid">
                    <section className="panel workflow-card">
                      <div className="panel-top">
                        <div>
                          <span className="overline">WORKFLOW OVERVIEW</span>
                          <h2>เส้นทางงานตั้งแต่ต้นจนจบ</h2>
                          <p>กดงานตัวอย่างเพื่อเดินขั้นตอนการทำงาน</p>
                        </div>
                        <div className="workflow-decor">
                          <Factory size={30} />
                        </div>
                      </div>
                      <div className="workflow-flow">
                        {[
                          { label: "ใบเสนอราคา", icon: FileText },
                          { label: "รับงาน", icon: CheckCircle2 },
                          { label: "วิศวกรรม", icon: Settings2 },
                          {
                            label: "วางแผน",
                            icon: ChartNoAxesColumnIncreasing,
                          },
                          { label: "ผลิต", icon: Factory },
                          { label: "ตรวจ QC", icon: ShieldCheck },
                          { label: "จัดส่ง", icon: Truck },
                        ].map(({ label, icon: Icon }, i) => (
                          <div key={label} className="flow-node">
                            <span className="flow-number">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="flow-icon">
                              <Icon size={18} strokeWidth={1.9} />
                            </span>
                            <strong>{label}</strong>
                            {i < 6 && <ChevronRight size={15} />}
                          </div>
                        ))}
                      </div>
                      <button
                        className="text-link"
                        onClick={() => navigate("jobs")}
                      >
                        ดูงานทั้งหมด <ArrowRight size={16} />
                      </button>
                    </section>
                    <section className="panel inbox-card">
                      <ListHeader
                        title="กล่องงานของฉัน"
                        subtitle={
                          isManager
                            ? "งานสำคัญที่ควรติดตาม"
                            : `งานที่เกี่ยวข้องกับบทบาท ${role}`
                        }
                      />
                      <div className="inbox-list">
                        {myTasks.length ? (
                          myTasks.map((j) => (
                            <button key={j.id} onClick={() => openJob(j.id)}>
                              <div className="inbox-icon">
                                <BriefcaseBusiness size={17} />
                              </div>
                              <div>
                                <strong>{j.title}</strong>
                                <small>
                                  {j.id} · {j.owner}
                                </small>
                              </div>
                              <ChevronRight size={16} />
                            </button>
                          ))
                        ) : (
                          <Empty
                            title="ยังไม่มีงานในกล่อง"
                            detail="สลับบทบาทเพื่อดูคิวงานของฝ่ายอื่น"
                          />
                        )}
                      </div>
                    </section>
                  </div>
                  <section className="panel">
                    <ListHeader
                      title="งานที่ต้องติดตาม"
                      subtitle="สถานะล่าสุดของงานตัวอย่างทั้งหมด"
                      action={
                        <button
                          className="text-link"
                          onClick={() => navigate("jobs")}
                        >
                          ดูรายการทั้งหมด <ArrowRight size={15} />
                        </button>
                      }
                    />
                    <Table rows={listedJobs} />
                  </section>
                </>
              )}
              {module !== "dashboard" && (
                <ModuleContent
                  module={module}
                  role={role}
                  data={data}
                  jobs={listedJobs}
                  allJobs={visibleJobs}
                  search={search}
                  filter={filter}
                  setFilter={setFilter}
                  openJob={openJob}
                  openDialog={openDialog}
                  updateJob={updateJob}
                  approveLeave={approveLeave}
                  canCost={canCost}
                  Table={Table}
                  JobTablePanel={JobTablePanel}
                />
              )}
            </>
          )}
        </main>
      </div>
      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
      {dialog && (
        <DialogView
          dialog={dialog}
          job={job}
          data={data}
          form={form}
          error={error}
          field={field}
          close={() => setDialog(null)}
          save={saveDialog}
        />
      )}
    </div>
  );
}
function JobTab({
  job,
  tab,
  role,
  onAction,
  onDialog,
  onTab,
  updateJob,
  canCost,
  actionOwner,
}: {
  job: Job;
  tab: WorkTab;
  role: Role;
  onAction: () => void;
  onDialog: (d: Dialog, defaults?: Record<string, string>) => void;
  onTab: (t: WorkTab) => void;
  updateJob: (
    id: string,
    change: Partial<Job>,
    reason: string,
    from?: string,
    to?: string,
  ) => void;
  canCost: boolean;
  actionOwner: Role;
}) {
  const [extraLine, setExtraLine] = useState({
    name: "",
    qty: "1",
    price: "1000",
  });
  const [routeReason, setRouteReason] = useState("");
  const parts = costParts(job);
  const costs = Object.values(parts).reduce((a, b) => a + b, 0);
  const quoteSubtotal = revenue(job);
  const quoteVat = Math.round(quoteSubtotal * 0.07);
  const quoteGrandTotal = quoteSubtotal + quoteVat;
  const quoteParts = [
    "ชุดขับเคลื่อนรุ่น DEMO-01",
    "2IK6RGN-6W",
    "ชุดเกียร์และเพลาตามแบบ",
    "Gear",
    "Speed",
    "รางเลื่อนอลูมิเนียมรุ่นตัวอย่าง",
    "KHF55-2060-4000",
    "MTSRK16-710-F25-R12-T10-Q12-S23-E10-KR0",
    "MTSGR16",
    "ชุดยึดและสกรูประกอบ",
    "LHFC16",
    "Shaft 635 x 16",
    "เซนเซอร์ตรวจจับตำแหน่ง",
    "CDJP2B16-15D",
    "PZ-V11",
    "สายสัญญาณและขั้วต่อ",
    "P-2025-ME-SCH-C00001-17",
    "AS1201F-M5-06A",
    "P-2025-ME-SCH-C00001-16",
    "P-2025-ME-SCH-C00001-18",
    "ประกอบและทดสอบการทำงาน",
    "CTS M5 x 12",
    "socket head cap screw_iso 4762 M3 x 10",
    "pan head cross recess screw ISO 7045",
    "รับประกัน 1 ปี (ข้อมูลสมมติ)",
  ];
  const canEditQuote =
    role === "Sales" || role === "ผู้บริหาร" || role === "ผู้ดูแลระบบ";
  const canDo = (owner: Role) =>
    role === owner || role === "ผู้บริหาร" || role === "ผู้ดูแลระบบ";
  const history = (
    <div className="timeline">
      {job.logs.map((log, i) => (
        <div className="timeline-item" key={i}>
          <div className="timeline-dot" />
          <div>
            <div className="timeline-top">
              <strong>{log.to}</strong>
              <span>{log.at}</span>
            </div>
            <p>{log.reason}</p>
            <small>
              {log.by} · {log.from} → {log.to}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
  const actionCard = job.stage < 11 && (
    <div className="next-action">
      <div className="next-icon">
        <Sparkles size={19} />
      </div>
      <div>
        <strong>
          ขั้นตอนถัดไป:{" "}
          {job.stage === 9 && job.qcPass
            ? "แพ็คสินค้า"
            : stageNames[Math.min(job.stage + 1, 11)]}
        </strong>
        <span>ผู้รับผิดชอบตัวอย่าง: {actionOwner} · การกดปุ่มเป็นการจำลอง</span>
      </div>
      {canDo(actionOwner) && (
        <button className="btn primary" onClick={onAction}>
          ดำเนินการ <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
  if (tab === "overview")
    return (
      <div className="detail-grid">
        <div className="detail-main">
          {actionCard}
          <section className="panel">
            <div className="section-head">
              <div>
                <h2>ข้อมูลชิ้นงาน</h2>
                <p>เชื่อมโยงข้อมูลจากใบเสนอราคาและแผนงาน</p>
              </div>
            </div>
            <div className="product-row">
              <div className="product-visual">
                <Image
                  src="/product-sample.svg"
                  alt="ภาพชิ้นงานตัวอย่างสมมติ"
                  width={124}
                  height={105}
                />
              </div>
              <div>
                <span className="overline">WORK ITEM</span>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <div className="product-meta">
                  <span>
                    จำนวน {job.lines.reduce((s, l) => s + l.qty, 0)} ชิ้น
                  </span>
                  <span>กำหนดส่ง {dateTH(job.due)}</span>
                </div>
              </div>
            </div>
            <div className="info-grid">
              <Info label="ลูกค้า" value={job.customer} />
              <Info label="ผู้ติดต่อ" value={job.contact} />
              <Info label="เลขใบเสนอราคา" value={job.quoteId} />
              <Info
                label="เส้นทางผลิต"
                value={
                  job.route.length ? job.route.join(" → ") : "รอ PPC วางแผน"
                }
              />
            </div>
          </section>
          <section className="panel">
            <div className="section-head">
              <div>
                <h2>ประวัติล่าสุด</h2>
                <p>ใครทำอะไร เมื่อใด และเพราะอะไร</p>
              </div>
              <button className="text-link" onClick={() => onTab("history")}>
                ดูทั้งหมด <ArrowRight size={15} />
              </button>
            </div>
            {history}
          </section>
        </div>
        <aside className="detail-side">
          <section className="panel">
            <h2>สถานะงาน</h2>
            <div className="side-status">
              <div className="side-status-icon">
                <Factory size={24} />
              </div>
              <strong>{statusOf(job)}</strong>
              <span>กำลังอยู่ที่: {job.owner}</span>
            </div>
            <div className="side-divider" />
            <Info label="ความสำคัญ" value={job.priority} />
            <Info label="ประเภทงาน" value={job.kind} />
            <Info label="กำหนดส่ง" value={dateTH(job.due)} />
          </section>
          <section className="panel note-panel">
            <CircleAlert size={19} />
            <strong>ประเด็นรอยืนยัน</strong>
            <p>
              เกณฑ์อนุมัติ สิทธิ์งานซีเคร็ต และกฎการคำนวณสัดส่วนงาน
              ต้องยืนยันกับฝ่ายที่เกี่ยวข้อง
            </p>
          </section>
        </aside>
      </div>
    );
  if (tab === "quote")
    return (
      <section className="quote-screen">
        <div className="quote-toolbar">
          <div>
            <span className="overline">FORM PREVIEW</span>
            <h2>ใบเสนอราคา {job.quoteId}</h2>
            <p>เอกสารตัวอย่างสำหรับตรวจสอบก่อนจำลองการส่ง</p>
          </div>
          <div className="quote-toolbar__actions">
            <Badge tone={job.stage === 0 ? "amber" : "green"}>
              {job.stage === 0 ? "ร่างเอกสาร" : "บันทึกแล้ว"}
            </Badge>
            <button className="btn secondary" onClick={() => window.print()}>
              <Download size={16} /> พิมพ์ตัวอย่าง
            </button>
            {job.stage === 0 && canEditQuote && (
              <button
                className="btn primary"
                onClick={() => onDialog("send", { email: job.email })}
              >
                <Send size={16} /> จำลองการส่ง
              </button>
            )}
            {job.stage === 1 && canEditQuote && (
              <button
                className="btn primary"
                onClick={() => onDialog("response", { response: "ตอบรับ" })}
              >
                บันทึกผลตอบรับ
              </button>
            )}
          </div>
        </div>

        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-article, .printable-article * {
              visibility: visible;
            }
            .printable-article {
              position: absolute;
              left: 0;
              top: 0;
              margin: 0 !important;
              box-shadow: none !important;
            }
            @page {
              size: A4;
              margin: 0;
            }
          }
        `}</style>
        <article className="printable-article" style={{
          width: '210mm',
          minHeight: '297mm',
          background: 'white',
          color: 'black',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '11px',
          padding: '40px',
          boxSizing: 'border-box',
          margin: '20px auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ width: '120px', textAlign: 'center', color: '#c00', fontWeight: 'bold', marginRight: '20px' }}>
              <div style={{ fontSize: '36px', margin: '0', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Boxes size={36} color="#c00" style={{ marginRight: '5px' }} />
                ERP
              </div>
              <div style={{ fontSize: '8px', letterSpacing: '1px', marginTop: '2px' }}>ERP - TECH SYSTEMS</div>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: '#c00', fontSize: '24px', fontWeight: 'bold', fontStyle: 'italic', margin: '0 0 5px 0', letterSpacing: '1px' }}>ERP - MANUFACTURING SYSTEMS CO., LTD</h1>
              <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 'bold' }}>Manufacturing : 99/9 Demo Road, Industrial District, Bangkok 10200 Thailand (Head Office)</p>
              <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 'bold' }}>Tel : 02 000 0000 E-Mail : sales@erp-company.example TAX: 0100000000000</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid black', borderBottom: '1px solid black', textAlign: 'center', padding: '5px 0', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', fontStyle: 'italic', margin: 0, letterSpacing: '1px' }}>Quotation</h2>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '11px', marginBottom: '10px' }}>
            <tbody>
              <tr>
                <td rowSpan={2} style={{ width: '30px', padding: '4px 6px', verticalAlign: 'top', fontWeight: 'bold' }}>To:</td>
                <td rowSpan={2} style={{ padding: '4px 6px', verticalAlign: 'top', borderRight: '1px solid black' }}>
                  <strong>{job.customer}</strong><br/>
                  {job.address || "ที่อยู่ลูกค้าตัวอย่าง (รอยืนยัน)"}
                </td>
                <td style={{ width: '120px', padding: '4px 6px', borderRight: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>Quotation No.</td>
                <td style={{ width: '200px', padding: '4px 6px', textAlign: 'center', borderBottom: '1px solid black', fontWeight: 'bold' }}>{job.quoteId} REV 01</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 6px', borderRight: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>Date</td>
                <td style={{ padding: '4px 6px', textAlign: 'center', borderBottom: '1px solid black' }}>24 September 2026</td>
              </tr>
              <tr>
                <td rowSpan={2} style={{ padding: '4px 6px', verticalAlign: 'top', borderTop: '1px solid black', fontWeight: 'bold' }}>Attn:</td>
                <td rowSpan={2} style={{ padding: '4px 6px', verticalAlign: 'top', borderRight: '1px solid black', borderTop: '1px solid black' }}>
                  <strong>{job.contact}</strong>
                </td>
                <td style={{ padding: '4px 6px', borderRight: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>Price Validity</td>
                <td style={{ padding: '4px 6px', textAlign: 'center', borderBottom: '1px solid black' }}>30 DAYS</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 6px', borderRight: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>Payment Terms</td>
                <td style={{ padding: '4px 6px', textAlign: 'center', borderBottom: '1px solid black' }}>30 DAYS</td>
              </tr>
              <tr>
                <td rowSpan={2} style={{ padding: '4px 6px', verticalAlign: 'top', borderTop: '1px solid black', fontWeight: 'bold' }}>C.c.:</td>
                <td rowSpan={2} style={{ padding: '4px 6px', verticalAlign: 'top', borderRight: '1px solid black', borderTop: '1px solid black' }}>—</td>
                <td style={{ padding: '4px 6px', borderRight: '1px solid black', borderBottom: '1px solid black', fontWeight: 'bold' }}>Lead Time</td>
                <td style={{ padding: '4px 6px', textAlign: 'center', borderBottom: '1px solid black' }}>{dateTH(job.due)}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 6px', borderRight: '1px solid black', fontWeight: 'bold' }}>Contact Person</td>
                <td style={{ padding: '4px 6px', textAlign: 'center' }}>ERP SALES (MOCK)</td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '11px', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '4%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '10%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Item</th>
                <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Part Name</th>
                <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Drawing Form</th>
                <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Part No.</th>
                <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Material</th>
                <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Finishing</th>
                <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Quantity</th>
                <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Unit Price</th>
                <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Discount</th>
                <th style={{ border: '1px solid black', fontWeight: 'bold', textAlign: 'center', padding: '6px 4px', fontStyle: 'italic' }}>Amount (THB)</th>
              </tr>
            </thead>
            <tbody>
              {job.lines.map((line, index) => (
                <React.Fragment key={line.name + index}>
                  <tr>
                    <td rowSpan={2} style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top', fontWeight: 'bold' }}>{index + 1}</td>
                    <td rowSpan={2} style={{ border: '1px solid black', padding: '0', width: '30%', verticalAlign: 'top' }}>
                      <div style={{ padding: '6px 4px' }}>
                        <strong>{line.name}</strong>
                        <div style={{ margin: '8px 0' }}>Size : {job.description}</div>
                        <strong>Parts :</strong>
                      </div>
                      <div style={{ lineHeight: '1.6' }}>
                        {quoteParts.map((part, i) => (
                          <div key={i} style={{ padding: '2px 6px', backgroundColor: i % 2 === 1 ? '#f5f5f5' : 'transparent' }}>{part}</div>
                        ))}
                      </div>
                    </td>
                    <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>ERP DEMO</td>
                    <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>MOCK-{String(index + 1).padStart(3, "0")}</td>
                    <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>AL</td>
                    <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>N/A</td>
                    <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}>{line.qty} Set</td>
                    <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'right', verticalAlign: 'top', fontWeight: 'bold' }}>{money(line.price)}</td>
                    <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'center', verticalAlign: 'top' }}></td>
                    <td style={{ border: '1px solid black', padding: '6px 4px', textAlign: 'right', verticalAlign: 'top', fontWeight: 'bold' }}>{money(line.price * line.qty)}</td>
                  </tr>
                  <tr>
                    <td colSpan={8} style={{ border: '1px solid black', padding: '10px', verticalAlign: 'top', position: 'relative' }}>
                      <div style={{ border: '1px solid #ccc', display: 'inline-block', padding: '4px', fontSize: '8px', color: '#666', marginBottom: '15px', maxWidth: '350px', lineHeight: '1.2' }}>
                        EXCEPT AS OTHERWISE PROVIDED BY CONTRACTOR IN DRAWING THESE DRAWINGS AND SPECIFICATIONS ARE THE PROPERTY OF ERP COMPANY CO.,LTD. AND MUST BE RETURNED UPON REQUEST. MUST NOT BE MANUFACTURED OR USED BY OTHERS WITHOUT WRITTEN PERMISSION OF ERP COMPANY CO.,LTD.
                      </div>
                      <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <Image
                          src="/product-sample.svg"
                          alt="แบบชิ้นงานตัวอย่าง"
                          width={400}
                          height={180}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}

            </tbody>
          </table>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', borderTop: 'none', fontSize: '11px', tableLayout: 'fixed', pageBreakInside: 'avoid' }}>
            <colgroup>
              <col style={{ width: '4%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '10%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td colSpan={8} style={{ border: '1px solid black', padding: '8px 10px', verticalAlign: 'top' }}>
                  <strong style={{ display: 'block', marginBottom: '8px' }}># Payment Systems</strong>
                  <div style={{ display: 'flex', marginBottom: '4px', paddingLeft: '10px' }}>
                    <div style={{ width: '150px', fontWeight: 'bold' }}>- Deposit upon order</div>
                    <div style={{ fontWeight: 'bold' }}>100%</div>
                  </div>
                  <div style={{ display: 'flex', marginBottom: '4px', paddingLeft: '10px' }}>
                    <div style={{ width: '150px', fontWeight: 'bold' }}>- Deliver</div>
                    <div style={{ fontWeight: 'bold' }}>0%</div>
                  </div>
                  <div style={{ display: 'flex', paddingLeft: '10px' }}>
                    <div style={{ width: '150px', fontWeight: 'bold' }}>- Credit 30 days</div>
                    <div style={{ fontWeight: 'bold' }}>0%</div>
                  </div>
                </td>
                <td style={{ border: '1px solid black', padding: '8px 10px', fontWeight: 'bold', fontStyle: 'italic', verticalAlign: 'bottom' }}>Total</td>
                <td style={{ border: '1px solid black', padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', verticalAlign: 'bottom' }}>{money(quoteSubtotal)}</td>
              </tr>
              <tr>
                <td colSpan={8} style={{ border: '1px solid black', padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>การจ่ายเงินโดยใช้เช็คโปรดสั่งจ่ายในนามของ บริษัท ERP แมนูแฟคเจอริง จำกัด บริษัท จะคิดดอกเบี้ย 1.5% ต่อเดือน เมื่อชำระช้าเกินกว่ากำหนด</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Please issue a crossed cheque payable to ERP Manufacturing Systems Co.,Ltd Insert at 15% per month will be charged on overdue account</div>
                </td>
                <td style={{ border: '1px solid black', padding: '8px 10px', fontWeight: 'bold', fontStyle: 'italic', verticalAlign: 'middle' }}>VAT 7%</td>
                <td style={{ border: '1px solid black', padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', verticalAlign: 'middle' }}>{money(quoteVat)}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: '1px solid black', padding: '8px 10px', fontWeight: 'bold', textAlign: 'center' }}>ตัวอักษร</td>
                <td colSpan={6} style={{ border: '1px solid black', padding: '8px 10px', textAlign: 'center', fontWeight: 'bold' }}>ยอดรวมตามเอกสารตัวอย่าง</td>
                <td style={{ border: '1px solid black', padding: '8px 10px', fontWeight: 'bold', fontStyle: 'italic' }}>Grand Total</td>
                <td style={{ border: '1px solid black', padding: '8px 10px', textAlign: 'right', fontWeight: 'bold' }}>{money(quoteGrandTotal)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', marginTop: '40px', justifyContent: 'space-between', padding: '0 40px' }}>
            <div style={{ textAlign: 'center', width: '250px' }}>
              <div style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '30px' }}>APPROVED BY</div>
              <div style={{ fontSize: '28px', fontFamily: 'cursive', color: '#333', marginBottom: '5px' }}>ERP Sales Director</div>
              <div style={{ borderBottom: '1px solid black', marginBottom: '5px' }}></div>
              <div style={{ fontWeight: 'bold', fontStyle: 'italic' }}>ERP Sales Director</div>
              <div style={{ fontStyle: 'italic', fontSize: '10px' }}>Biz. Development Director</div>
            </div>
            <div style={{ textAlign: 'center', width: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ borderBottom: '1px dotted black', marginBottom: '8px' }}></div>
              <div style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Signature &amp; Company Stamp</div>
              <div style={{ fontStyle: 'italic', fontSize: '10px', marginBottom: '15px' }}>(Please return a copy by email or fax)</div>
              <div style={{ fontSize: '9px', fontWeight: 'bold' }}>This is a computer generated quotation no signature is required.</div>
            </div>
          </div>
        </article>

        {job.stage === 0 && canEditQuote && (
          <div className="inline-form quote-line-editor">
            <input
              placeholder="ชื่อรายการเพิ่มเติม"
              value={extraLine.name}
              onChange={(e) =>
                setExtraLine({ ...extraLine, name: e.target.value })
              }
            />
            <input
              type="number"
              min="1"
              aria-label="จำนวน"
              value={extraLine.qty}
              onChange={(e) =>
                setExtraLine({ ...extraLine, qty: e.target.value })
              }
            />
            <input
              type="number"
              min="1"
              aria-label="ราคา"
              value={extraLine.price}
              onChange={(e) =>
                setExtraLine({ ...extraLine, price: e.target.value })
              }
            />
            <button
              className="btn secondary"
              onClick={() => {
                if (
                  extraLine.name &&
                  Number(extraLine.qty) > 0 &&
                  Number(extraLine.price) > 0
                ) {
                  updateJob(
                    job.id,
                    {
                      lines: [
                        ...job.lines,
                        {
                          name: extraLine.name,
                          qty: Number(extraLine.qty),
                          price: Number(extraLine.price),
                        },
                      ],
                    },
                    "เพิ่มรายการในใบเสนอราคาจำลอง",
                  );
                  setExtraLine({ name: "", qty: "1", price: "1000" });
                }
              }}
            >
              เพิ่มรายการ
            </button>
          </div>
        )}
      </section>
    );
  if (tab === "drawing")
    return (
      <section className="panel">
        <div className="section-head">
          <div>
            <h2>วิศวกรรมและไฟล์แบบ</h2>
            <p>การรีวิวและเวอร์ชันไฟล์สมมติ</p>
          </div>
          {job.stage === 3 && canDo("วิศวกรรม") && (
            <button
              className="btn primary"
              onClick={() => onDialog("review", { decision: "อนุมัติ" })}
            >
              รีวิวงาน
            </button>
          )}
        </div>
        <div className="info-grid">
          <Info
            label="ผลรีวิว"
            value={job.stage >= 4 ? "อนุมัติ (จำลอง)" : "รอวิศวกรรมรีวิว"}
          />
          <Info
            label="เวอร์ชันล่าสุด"
            value={
              job.drawingVersion
                ? `Version ${job.drawingVersion}`
                : "ยังไม่มีไฟล์"
            }
          />
        </div>
        {job.drawingVersion ? (
          <div className="document-row">
            <FileText size={22} />
            <div>
              <strong>
                drawing_{job.id.toLowerCase()}_v{job.drawingVersion}.pdf
              </strong>
              <span>ไฟล์ตัวอย่าง · ไม่มีเอกสารจริง</span>
            </div>
            <Badge tone="blue">v{job.drawingVersion}</Badge>
          </div>
        ) : (
          <Empty
            title="ยังไม่มีไฟล์แบบ"
            detail="อนุมัติทางวิศวกรรมแล้วจึงเพิ่มเวอร์ชันแบบ"
          />
        )}
        {job.stage === 4 && canDo("ผู้เขียนแบบ") && (
          <button className="btn primary" onClick={onAction}>
            บันทึกแบบเวอร์ชันใหม่
          </button>
        )}
      </section>
    );
  if (tab === "plan")
    return (
      <section className="panel">
        <div className="section-head">
          <div>
            <h2>แผนและเส้นทางผลิต</h2>
            <p>แต่ละงานเลือกเฉพาะขั้นตอนที่ต้องใช้</p>
          </div>
          {job.stage === 5 && canDo("PPC") && (
            <button className="btn primary" onClick={() => onDialog("plan")}>
              วางแผน
            </button>
          )}
        </div>
        {job.route.length ? (
          <>
            <div className="route-pills">
              {job.route.map((r, i) => (
                <div key={r}>
                  <span>{i + 1}</span>
                  {r}
                  {i < job.route.length - 1 && <ArrowRight size={16} />}
                </div>
              ))}
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th>กระบวนการ</th>
                    <th>ผู้รับผิดชอบ</th>
                    <th>เริ่มตามแผน</th>
                    <th>เสร็จตามแผน</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {job.route.map((r, i) => (
                    <tr key={r}>
                      <td>{i + 1}</td>
                      <td>{r}</td>
                      <td>ฝ่ายผลิต</td>
                      <td>1 ต.ค. 2569</td>
                      <td>4 ต.ค. 2569</td>
                      <td>
                        <Badge tone={job.stage >= 9 ? "green" : "blue"}>
                          {job.stage >= 9 ? "ผ่านขั้นตอน" : "ตามแผน"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="inline-note">
              <CircleAlert size={16} />
              เหตุผลแนะนำงานเร่ง: วันคงเหลือน้อยและยังมีขั้นตอนค้าง ·
              กฎคะแนนจริงรอยืนยันกับ PPC
            </div>
            {canDo("PPC") && (
              <div className="inline-form">
                <input
                  placeholder="เหตุผลการปรับลำดับงาน"
                  value={routeReason}
                  onChange={(e) => setRouteReason(e.target.value)}
                />
                <button
                  className="btn secondary"
                  onClick={() => {
                    if (routeReason.trim()) {
                      updateJob(
                        job.id,
                        {},
                        `PPC ปรับลำดับงาน (จำลอง): ${routeReason}`,
                      );
                      setRouteReason("");
                    }
                  }}
                >
                  จำลองการปรับลำดับ
                </button>
              </div>
            )}
          </>
        ) : (
          <Empty
            title="ยังไม่มีแผนผลิต"
            detail="รอ PPC เลือกเส้นทางผลิตสำหรับงานนี้"
          />
        )}
      </section>
    );
  if (tab === "purchase")
    return (
      <section className="panel">
        <div className="section-head">
          <div>
            <h2>จัดซื้อและจ้างภายนอก</h2>
            <p>รายการเชื่อมกับเลขงาน {job.id}</p>
          </div>
        </div>
        <div className="info-grid">
          <Info label="ประเภทงาน" value={job.kind} />
          <Info
            label="สถานะจ้างภายนอก"
            value={
              !job.outsourced
                ? "ไม่มีรายการ"
                : job.outsourceReturned
                  ? "รับกลับแล้ว"
                  : job.outsourceSent
                    ? "ส่งออกแล้ว"
                    : "รอจัดซื้อ"
            }
          />
          <Info
            label="วันส่งออกตัวอย่าง"
            value={job.outsourceSent ? "2 ต.ค. 2569" : "—"}
          />
          <Info
            label="คาดว่าจะรับกลับ"
            value={job.outsourced ? "6 ต.ค. 2569" : "—"}
          />
        </div>
        {job.outsourced ? (
          <>
            <div className="document-row">
              <ShoppingCart size={22} />
              <div>
                <strong>
                  PO-SAMPLE-{job.id.slice(-3)} · บริการแปรรูปชิ้นงาน
                </strong>
                <span>
                  ต้นทุนจ้างตัวอย่าง ฿12,500 ·
                  ลำดับอนุมัติรอยืนยันกับฝ่ายที่เกี่ยวข้อง
                </span>
              </div>
              <Badge tone={job.outsourceReturned ? "green" : "amber"}>
                {job.outsourceReturned
                  ? "รับกลับ"
                  : job.outsourceSent
                    ? "ระหว่างจ้าง"
                    : "รอส่งออก"}
              </Badge>
            </div>
            {!job.outsourceReturned && canDo("จัดซื้อ") && (
              <button
                className="btn primary"
                onClick={() => onDialog("outsource")}
              >
                {job.outsourceSent ? "บันทึกรับกลับ" : "บันทึกส่งจ้าง"}
              </button>
            )}
          </>
        ) : (
          <Empty
            title="ไม่มีงานจ้างภายนอก"
            detail="PPC สามารถเลือกจ้างบางขั้นตอนในแผนงาน"
          />
        )}
      </section>
    );
  if (tab === "inventory")
    return (
      <section className="panel">
        <div className="section-head">
          <div>
            <h2>รายการเบิกวัสดุ</h2>
            <p>จำลองการเคลื่อนไหววัสดุตามเลขงาน</p>
          </div>
        </div>
        <div className="store-grid">
          {["Store 1", "Store 2", "Store 3"].map((s, i) => (
            <div key={s}>
              <Boxes size={21} />
              <strong>{s}</strong>
              <span>
                {
                  [
                    "อะลูมิเนียมแผ่น · 120 แผ่น",
                    "เหล็กเพลา · 64 เส้น",
                    "วัสดุประกอบ · 205 ชุด",
                  ][i]
                }
              </span>
            </div>
          ))}
        </div>
        <div className="inline-note">
          <CircleAlert size={16} />
          ความหมายและกฎการเบิกของแต่ละ Store รอยืนยันกับฝ่ายคลัง
        </div>
        <div className="document-row">
          <Package size={22} />
          <div>
            <strong>เบิกวัสดุสำหรับ {job.id}</strong>
            <span>
              {job.materialsIssued
                ? "เบิกแล้ว (จำลอง) · Store 1"
                : "รอเบิก · ตามแผนงาน"}
            </span>
          </div>
          <Badge tone={job.materialsIssued ? "green" : "amber"}>
            {job.materialsIssued ? "เบิกแล้ว" : "รอเบิก"}
          </Badge>
        </div>
        {job.stage === 6 &&
          (!job.outsourced || job.outsourceReturned) &&
          canDo("คลัง") && (
            <button className="btn primary" onClick={onAction}>
              จำลองการเบิกวัสดุ
            </button>
          )}
      </section>
    );
  if (tab === "production")
    return (
      <section className="panel">
        <div className="section-head">
          <div>
            <h2>งานฝ่ายผลิต</h2>
            <p>หน้างานตามเส้นทางผลิตของชิ้นงานนี้</p>
          </div>
        </div>
        <div className="route-pills">
          {(job.route.length ? job.route : ["รอวางแผน"]).map((r, i) => (
            <div key={r}>
              <span>{i + 1}</span>
              {r}
            </div>
          ))}
        </div>
        <div className="info-grid">
          <Info
            label="สถานะ"
            value={
              job.rework
                ? "ส่งกลับแก้ไข"
                : job.stage >= 9
                  ? "ส่งตรวจ QC แล้ว"
                  : job.stage >= 8
                    ? "กำลังผลิต"
                    : "รอรับงาน"
            }
          />
          <Info label="ผู้รับผิดชอบ" value="ฝ่ายผลิต" />
        </div>
        {job.rework && (
          <div className="error-note">
            <CircleAlert size={17} />
            QC ส่งกลับ: {job.qcReason} · จำนวนเสีย {job.qcReject} ชิ้น
          </div>
        )}
        {job.stage === 7 && canDo("ฝ่ายผลิต") && (
          <button className="btn primary" onClick={onAction}>
            บันทึกเริ่มงาน
          </button>
        )}
        {job.stage === 8 && canDo("ฝ่ายผลิต") && (
          <div className="panel-actions">
            <button
              className="btn secondary"
              onClick={() =>
                updateJob(job.id, {}, "บันทึกหยุดงานชั่วคราว (จำลอง)")
              }
            >
              บันทึกหยุดงาน
            </button>
            <button className="btn primary" onClick={onAction}>
              {job.rework ? "แก้ไขและส่งตรวจซ้ำ" : "จบงานและส่งตรวจ QC"}
            </button>
          </div>
        )}
      </section>
    );
  if (tab === "qc")
    return (
      <section className="panel">
        <div className="section-head">
          <div>
            <h2>ผลตรวจคุณภาพ</h2>
            <p>บันทึกผ่าน ไม่ผ่าน และรอบตรวจซ้ำ</p>
          </div>
          {job.stage === 9 && !job.qcPass && canDo("QC") && (
            <button
              className="btn primary"
              onClick={() =>
                onDialog("qc", {
                  pass: String(job.lines[0].qty),
                  reject: "0",
                  result: "ผ่าน",
                })
              }
            >
              บันทึกผล QC
            </button>
          )}
        </div>
        <div className="info-grid">
          <Info label="จำนวนผ่านล่าสุด" value={`${job.qcPass} ชิ้น`} />
          <Info label="จำนวนเสียล่าสุด" value={`${job.qcReject} ชิ้น`} />
          <Info
            label="จำนวนครั้งที่ส่งกลับ"
            value={`${job.qcFailCount} ครั้ง`}
          />
          <Info
            label="ผลล่าสุด"
            value={
              job.rework
                ? "ไม่ผ่าน / ส่งกลับผลิต"
                : job.qcPass
                  ? "ผ่าน"
                  : "รอตรวจ"
            }
          />
        </div>
        {job.qcReason && (
          <div className={job.rework ? "error-note" : "inline-note"}>
            <CircleAlert size={16} />
            {job.qcReason}
          </div>
        )}
        <div className="document-row">
          <FileText size={22} />
          <div>
            <strong>qc_evidence_{job.id.toLowerCase()}.jpg</strong>
            <span>หลักฐานตัวอย่าง · ไม่ใช่ไฟล์จริง</span>
          </div>
          <Badge tone="neutral">ตัวอย่าง</Badge>
        </div>
        <div className="inline-note">
          ต้นทุนงานเสียและงานแก้ไขแสดงแยกกัน วิธีคิดจริงรอยืนยันกับฝ่ายต้นทุน
        </div>
      </section>
    );
  if (tab === "delivery")
    return (
      <section className="panel">
        <div className="section-head">
          <div>
            <h2>แพ็คและจัดส่ง</h2>
            <p>สถานะการส่งมอบเชื่อมกับงานและลูกค้า</p>
          </div>
        </div>
        <div className="info-grid">
          <Info
            label="สถานะแพ็ค"
            value={
              job.packed ? "แพ็คแล้ว" : job.qcPass ? "รอแพ็ค" : "รอ QC ผ่าน"
            }
          />
          <Info
            label="สถานะจัดส่ง"
            value={
              job.delivered
                ? "จัดส่งแล้ว"
                : job.packed
                  ? "รอจัดส่ง"
                  : "ยังไม่พร้อม"
            }
          />
          <Info label="ลูกค้า" value={job.customer} />
          <Info
            label="วันส่งจริง"
            value={job.delivered ? "24 ก.ย. 2569 (ตัวอย่าง)" : "—"}
          />
        </div>
        {job.packed && (
          <div className="document-row">
            <Truck size={22} />
            <div>
              <strong>delivery_proof_{job.id.toLowerCase()}.pdf</strong>
              <span>หลักฐานส่งมอบตัวอย่าง · ไม่มีเอกสารจริง</span>
            </div>
            <Badge tone={job.delivered ? "green" : "amber"}>
              {job.delivered ? "ส่งแล้ว" : "รอส่ง"}
            </Badge>
          </div>
        )}
        {job.stage === 9 && job.qcPass > 0 && canDo("แพ็ค") && (
          <button className="btn primary" onClick={onAction}>
            บันทึกแพ็คสินค้า
          </button>
        )}
        {job.stage === 10 && canDo("จัดส่ง") && (
          <button className="btn primary" onClick={onAction}>
            บันทึกการจัดส่ง
          </button>
        )}
      </section>
    );
  if (tab === "cost")
    return canCost ? (
      <section className="panel">
        <div className="section-head">
          <div>
            <h2>ต้นทุนรายงาน {job.id}</h2>
            <p>แยกต้นทุนประมาณการและต้นทุนที่เกิดในสถานะจำลอง</p>
          </div>
          <Badge tone="purple">สิทธิ์เฉพาะ</Badge>
        </div>
        <div className="cost-hero">
          <div>
            <span>รายรับตามใบเสนอราคา (ตัวอย่าง)</span>
            <strong>฿{money(revenue(job))}</strong>
          </div>
          <div>
            <span>ต้นทุนที่บันทึกในตัวอย่าง</span>
            <strong>฿{money(costs)}</strong>
          </div>
          <div>
            <span>ผลต่างตัวอย่าง</span>
            <strong>฿{money(revenue(job) - costs)}</strong>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>หมวดต้นทุน</th>
                <th>ประมาณการ</th>
                <th>บันทึกในตัวอย่าง</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["วัสดุ", parts.material],
                ["จ้างภายนอก", parts.outsource],
                ["เวลาทำงาน", parts.labor],
                ["งานเสีย", parts.scrap],
                ["งานแก้ไข", parts.rework],
              ].map(([name, value]) => (
                <tr key={String(name)}>
                  <td>{name}</td>
                  <td>รอยืนยันวิธีคิด</td>
                  <td>฿{money(Number(value))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="inline-note">
          <CircleAlert size={16} />
          ตัวเลขทั้งหมดเป็นข้อมูลสมมติ
          วิธีคำนวณต้นทุนจริงรอยืนยันกับฝ่ายที่เกี่ยวข้อง
        </div>
      </section>
    ) : (
      <div className="restricted">
        <ShieldCheck size={28} />
        <h2>จำกัดสิทธิ์เข้าถึงข้อมูลต้นทุน</h2>
        <p>สลับเป็นบทบาทผู้บริหารหรือผู้ดูต้นทุนเพื่อดูตัวอย่าง</p>
      </div>
    );
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <h2>ประวัติการเปลี่ยนแปลง</h2>
          <p>เก็บผู้ทำ เวลา สถานะเดิม สถานะใหม่ และเหตุผล</p>
        </div>
      </div>
      {history}
    </section>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function ModuleContent({
  module,
  role,
  data,
  jobs,
  allJobs,
  search,
  filter,
  setFilter,
  openJob,
  openDialog,
  updateJob,
  approveLeave,
  canCost,
  Table,
  JobTablePanel,
}: {
  module: ModuleId;
  role: Role;
  data: AppData;
  jobs: Job[];
  allJobs: Job[];
  search: string;
  filter: string;
  setFilter: (f: string) => void;
  openJob: (id: string, tab?: WorkTab) => void;
  openDialog: (d: Dialog, defaults?: Record<string, string>) => void;
  updateJob: (
    id: string,
    change: Partial<Job>,
    reason: string,
    from?: string,
    to?: string,
  ) => void;
  approveLeave: (id: string, approved: boolean) => void;
  canCost: boolean;
  Table: React.ComponentType<{
    rows: Job[];
    empty?: string;
  }>;
  JobTablePanel: React.ComponentType<{
    title: string;
    subtitle: string;
    rows: Job[];
  }>;
}) {
  const sub = (title: string, detail: string, children: React.ReactNode) => (
    <section className="panel">
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          <p>{detail}</p>
        </div>
      </div>
      {children}
    </section>
  );
  const header = (
    <div className="list-tools">
      <div>
        <Filter size={16} />
        <span>
          แสดง {jobs.length} จาก {allJobs.length} รายการ
          {search && ` · ค้นหา: ${search}`}
        </span>
      </div>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="กรองสถานะ"
      >
        <option>ทั้งหมด</option>
        <option>กำลังดำเนินการ</option>
        <option>ส่งกลับแก้ไข</option>
        <option>เสร็จแล้ว</option>
      </select>
    </div>
  );
  const warehouse = data.stockItems;
  if (module === "jobs")
    return (
      <>
        {header}
        <JobTablePanel
          title="งานทั้งหมด"
          subtitle="เปิดรายละเอียดงานเพื่อติดตามทุกขั้นตอน"
          rows={jobs}
        />
        <div className="inline-note">
          <ShieldCheck size={16} />
          งานประเภทซีเคร็ตเป็นตัวอย่างการจำกัดสิทธิ์ ·
          เกณฑ์และผู้มีสิทธิ์จริงรอยืนยันกับบริษัท
        </div>
      </>
    );
  if (module === "sales")
    return (
      <>
        {sub(
          "ทะเบียนลูกค้า",
          "ข้อมูลลูกค้าสมมติสำหรับสาธิต",
          <div className="customer-grid">
            {Array.from(
              new Map(allJobs.map((j) => [j.customer, j])).values(),
            ).map((j) => (
              <button key={j.customer} onClick={() => openJob(j.id, "quote")}>
                <div className="customer-avatar">{j.customer.charAt(0)}</div>
                <div>
                  <strong>{j.customer}</strong>
                  <span>
                    {j.contact} · {j.email}
                  </span>
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>,
        )}
        {header}
        <JobTablePanel
          title="ใบเสนอราคา"
          subtitle="ร่าง ส่งแล้ว และผลตอบรับลูกค้า (จำลอง)"
          rows={jobs}
        />
      </>
    );
  if (module === "engineering")
    return (
      <>
        {sub(
          "คิววิศวกรรมและเขียนแบบ",
          "ไฟล์แบบและผลรีวิวตัวอย่างเชื่อมกับงาน",
          <div className="mini-stats">
            <div>
              <strong>{allJobs.filter((j) => j.stage === 3).length}</strong>
              <span>รอวิศวกรรมรีวิว</span>
            </div>
            <div>
              <strong>{allJobs.filter((j) => j.stage === 4).length}</strong>
              <span>รอเขียนแบบ</span>
            </div>
            <div>
              <strong>
                {allJobs.filter((j) => j.drawingVersion > 0).length}
              </strong>
              <span>มีแบบแล้ว</span>
            </div>
          </div>,
        )}
        <JobTablePanel
          title="รายการงานและแบบ"
          subtitle="กดงานเพื่อดูเวอร์ชันและประวัติการแก้ไข"
          rows={jobs.filter((j) => j.stage >= 3)}
        />
      </>
    );
  if (module === "ppc")
    return (
      <>
        {sub(
          "คิวงานและแผนผลิต",
          "งานใกล้กำหนด งานเร่ง และเหตุผลแนะนำการติดตาม",
          <div className="schedule-grid">
            {allJobs
              .filter((j) => j.stage >= 3 && j.stage < 11)
              .map((j) => (
                <button key={j.id} onClick={() => openJob(j.id, "plan")}>
                  <div className="schedule-date">
                    <strong>{j.due.slice(-2)}</strong>
                    <span>ต.ค.</span>
                  </div>
                  <div>
                    <strong>{j.title}</strong>
                    <span>
                      {j.id} ·{" "}
                      {j.route.length ? j.route.join(" → ") : "รอวางแผน"}
                    </span>
                  </div>
                  <Badge tone={j.priority === "เร่งด่วน" ? "red" : "blue"}>
                    {j.priority}
                  </Badge>
                </button>
              ))}
          </div>,
        )}
        <div className="inline-note">
          <CircleAlert size={16} />
          เหตุผลแนะนำให้เร่ง: กำหนดส่งใกล้และยังมีขั้นตอนค้าง ·
          กฎคะแนนจริงรอยืนยันกับ PPC
        </div>
        <JobTablePanel
          title="ตารางงานผลิต"
          subtitle="เลือกงานเพื่อปรับเส้นทางและบันทึกเหตุผล"
          rows={jobs.filter((j) => j.stage >= 3 && j.stage < 11)}
        />
      </>
    );
  if (module === "purchase")
    return (
      <>
        {sub(
          "คำขอซื้อและงานจ้างภายนอก",
          "ลำดับผู้อนุมัติคำขอเป็น flow ตัวอย่าง รอยืนยันกับฝ่ายที่เกี่ยวข้อง",
          <div className="mini-stats">
            <div>
              <strong>
                {allJobs.filter((j) => j.outsourced && !j.outsourceSent).length}
              </strong>
              <span>รอส่งจ้าง</span>
            </div>
            <div>
              <strong>
                {
                  allJobs.filter((j) => j.outsourceSent && !j.outsourceReturned)
                    .length
                }
              </strong>
              <span>ระหว่างจ้าง</span>
            </div>
            <div>
              <strong>
                {allJobs.filter((j) => j.outsourceReturned).length}
              </strong>
              <span>รับกลับแล้ว</span>
            </div>
          </div>,
        )}
        <JobTablePanel
          title="รายการที่เชื่อมกับเลขงาน"
          subtitle="ดูวันส่งออก วันคาดว่าจะรับกลับ และต้นทุนตัวอย่าง"
          rows={jobs.filter((j) => j.outsourced || j.stage >= 5)}
        />
      </>
    );
  if (module === "inventory")
    return (
      <>
        <div className="module-actions">
          <button
            className="btn secondary"
            onClick={() =>
              openDialog("stock", {
                kind: "โอน",
                item: warehouse[0].name,
                from: "Store 1",
                to: "Store 2",
                qty: "1",
              })
            }
          >
            โอนระหว่าง Store
          </button>
          <button
            className="btn primary"
            onClick={() =>
              openDialog("stock", {
                kind: "รับเข้า",
                item: warehouse[0].name,
                to: "Store 1",
                qty: "1",
              })
            }
          >
            <Plus size={16} /> รับวัสดุเข้า
          </button>
        </div>
        {sub(
          "สถานที่เก็บวัสดุ",
          "Store 1, 2 และ 3 อยู่ในโมดูลคลังเดียว",
          <div className="store-grid">
            {["Store 1", "Store 2", "Store 3"].map((s, i) => (
              <div key={s}>
                <Boxes size={22} />
                <strong>{s}</strong>
                <span>
                  {warehouse.reduce((sum, w) => sum + w.stock[i], 0)}{" "}
                  หน่วยตัวอย่าง
                </span>
              </div>
            ))}
          </div>,
        )}
        {sub(
          "ทะเบียนวัสดุและยอดคงเหลือ",
          "ข้อมูลวัสดุสมมติ · กฎการเบิกแต่ละ Store รอยืนยัน",
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>วัสดุ</th>
                  <th>Store 1</th>
                  <th>Store 2</th>
                  <th>Store 3</th>
                  <th>หน่วย</th>
                </tr>
              </thead>
              <tbody>
                {warehouse.map((w) => (
                  <tr key={w.name}>
                    <td>
                      <strong>{w.name}</strong>
                    </td>
                    {w.stock.map((n, i) => (
                      <td key={i}>{n}</td>
                    ))}
                    <td>{w.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )}
        <JobTablePanel
          title="เบิกวัสดุตามเลขงาน"
          subtitle="กดงานเพื่อดูรายการเบิกและประวัติการเคลื่อนไหว"
          rows={jobs.filter((j) => j.stage >= 6)}
        />
        {sub(
          "ประวัติการเคลื่อนไหว",
          "รับเข้า เบิก และโอนระหว่าง Store (จำลอง)",
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>เลขรายการ</th>
                  <th>วัสดุ</th>
                  <th>ประเภท</th>
                  <th>จาก → ไป</th>
                  <th>จำนวน</th>
                  <th>เวลา</th>
                </tr>
              </thead>
              <tbody>
                {data.stockMoves.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.id}</strong>
                    </td>
                    <td>{m.item}</td>
                    <td>{m.kind}</td>
                    <td>
                      {m.from} → {m.to}
                    </td>
                    <td>{m.qty}</td>
                    <td>{m.at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )}
      </>
    );
  if (module === "production")
    return (
      <>
        {sub(
          "หน้างานฝ่ายผลิต",
          "เลือกกระบวนการตามเส้นทางของแต่ละชิ้นงาน",
          <div className="process-list">
            {routeOptions.map((r) => (
              <div key={r}>
                <Factory size={18} />
                <strong>{r}</strong>
                <span>
                  {
                    allJobs.filter(
                      (j) =>
                        j.route.includes(r) && j.stage >= 7 && j.stage <= 9,
                    ).length
                  }{" "}
                  งาน
                </span>
              </div>
            ))}
          </div>,
        )}
        <JobTablePanel
          title="งานรอรับ / กำลังทำ / ส่งกลับ"
          subtitle="กดงานเพื่อเริ่ม หยุด จบ และส่งตรวจ"
          rows={jobs.filter((j) => j.stage >= 7 && j.stage <= 9)}
        />
      </>
    );
  if (module === "quality")
    return (
      <>
        {sub(
          "คิวตรวจคุณภาพ",
          "ผลตรวจผ่าน ไม่ผ่าน และงานที่ส่งกลับแก้ไข",
          <div className="mini-stats">
            <div>
              <strong>
                {allJobs.filter((j) => j.stage === 9 && !j.qcPass).length}
              </strong>
              <span>รอตรวจ</span>
            </div>
            <div>
              <strong>{allJobs.filter((j) => j.rework).length}</strong>
              <span>ส่งกลับผลิต</span>
            </div>
            <div>
              <strong>{allJobs.filter((j) => j.qcPass).length}</strong>
              <span>ผ่านแล้ว</span>
            </div>
          </div>,
        )}
        <JobTablePanel
          title="รายการตรวจ QC"
          subtitle="เก็บเหตุผล จำนวนเสีย และประวัติการตรวจซ้ำ"
          rows={jobs.filter((j) => j.stage >= 8 || j.qcFailCount > 0)}
        />
      </>
    );
  if (module === "delivery")
    return (
      <>
        {sub(
          "แพ็คและจัดส่ง",
          "ติดตามสินค้าสำเร็จรูปจนถึงการส่งมอบ",
          <div className="mini-stats">
            <div>
              <strong>
                {allJobs.filter((j) => j.qcPass && !j.packed).length}
              </strong>
              <span>รอแพ็ค</span>
            </div>
            <div>
              <strong>
                {allJobs.filter((j) => j.packed && !j.delivered).length}
              </strong>
              <span>รอจัดส่ง</span>
            </div>
            <div>
              <strong>{allJobs.filter((j) => j.delivered).length}</strong>
              <span>จัดส่งแล้ว</span>
            </div>
          </div>,
        )}
        <JobTablePanel
          title="รายการส่งมอบ"
          subtitle="ดูวันส่งจริงและหลักฐานตัวอย่างในรายละเอียดงาน"
          rows={jobs.filter((j) => j.qcPass || j.stage >= 9)}
        />
      </>
    );
  if (module === "finance")
    return canCost ? (
      <>
        {sub(
          "รายงานต้นทุนตัวอย่าง",
          "คลิกรายการเพื่อดูงานต้นทางและหมวดต้นทุน",
          <div className="cost-hero">
            <div>
              <span>รายรับจากงานตัวอย่าง</span>
              <strong>
                ฿{money(allJobs.reduce((s, j) => s + revenue(j), 0))}
              </strong>
            </div>
            <div>
              <span>ต้นทุนที่บันทึกในตัวอย่าง</span>
              <strong>
                ฿
                {money(
                  allJobs.reduce(
                    (s, j) =>
                      s +
                      Object.values(costParts(j)).reduce((a, b) => a + b, 0),
                    0,
                  ),
                )}
              </strong>
            </div>
            <div>
              <span>งานที่ติดตาม</span>
              <strong>{allJobs.length} งาน</strong>
            </div>
          </div>,
        )}
        <div className="inline-note">
          <CircleAlert size={16} />
          ตัวเลขทั้งหมดเป็นข้อมูลสมมติ วิธีคำนวณจริงและสิทธิ์การเข้าถึงรอยืนยัน
        </div>
        <JobTablePanel
          title="รายงานรายเลขงาน"
          subtitle="กดงานเพื่อดูรายรับ ต้นทุนประมาณการ และต้นทุนที่บันทึก"
          rows={jobs}
        />
      </>
    ) : (
      <div className="restricted">
        <ShieldCheck size={28} />
        <h2>จำกัดสิทธิ์เข้าถึงข้อมูลต้นทุน</h2>
        <p>เลือกบทบาทผู้บริหารหรือผู้ดูต้นทุนเพื่อดูรายงานตัวอย่าง</p>
      </div>
    );
  if (module === "hr")
    return (
      <>
        <div className="module-actions">
          <button className="btn primary" onClick={() => openDialog("leave")}>
            <Plus size={16} /> ยื่นใบลา
          </button>
        </div>
        {sub(
          "ใบลาและการอนุมัติ",
          "พนักงานยื่นลา หัวหน้าอนุมัติ และแสดงผลในปฏิทิน",
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>เลขใบลา / พนักงาน</th>
                  <th>ประเภท</th>
                  <th>ช่วงวันที่</th>
                  <th>เหตุผล</th>
                  <th>สถานะ</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {data.leaves.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.id}</strong>
                      <small>{l.employee}</small>
                    </td>
                    <td>{l.type}</td>
                    <td>
                      {dateTH(l.from)} – {dateTH(l.to)}
                    </td>
                    <td>{l.reason}</td>
                    <td>
                      <Badge
                        tone={
                          l.status === "อนุมัติ"
                            ? "green"
                            : l.status === "ไม่อนุมัติ"
                              ? "red"
                              : "amber"
                        }
                      >
                        {l.status}
                      </Badge>
                    </td>
                    <td>
                      {l.status === "รออนุมัติ" &&
                      (role === "ผู้บริหาร" || role === "ผู้ดูแลระบบ") ? (
                        <div className="table-actions">
                          <button onClick={() => approveLeave(l.id, true)}>
                            อนุมัติ
                          </button>
                          <button onClick={() => approveLeave(l.id, false)}>
                            ไม่อนุมัติ
                          </button>
                        </div>
                      ) : l.status === "รออนุมัติ" ? (
                        "รอหัวหน้าอนุมัติ"
                      ) : (
                        "บันทึกแล้ว"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )}
        <div className="hr-grid">
          {sub(
            "ปฏิทินวันลาและวันหยุด",
            "รายการที่อนุมัติจะแสดงที่นี่",
            data.leaves.filter((l) => l.status === "อนุมัติ").length ? (
              <div className="calendar-list">
                {data.leaves
                  .filter((l) => l.status === "อนุมัติ")
                  .map((l) => (
                    <div key={l.id}>
                      <CalendarDays size={19} />
                      <strong>{l.employee}</strong>
                      <span>
                        {dateTH(l.from)} – {dateTH(l.to)}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <Empty
                title="ยังไม่มีวันลาที่อนุมัติ"
                detail="ทดลองอนุมัติใบลาในตารางด้านบน"
              />
            ),
          )}
          {sub(
            "เวลาเข้างานตัวอย่าง",
            "การเชื่อมต่อเครื่องลงเวลาในอนาคต รอยืนยัน",
            <div className="attendance">
              <div>
                <span>พนักงานตัวอย่าง 01</span>
                <strong>08:32 – 17:36</strong>
              </div>
              <div>
                <span>พนักงานตัวอย่าง 02</span>
                <strong>08:45 – 17:41</strong>
              </div>
              <div>
                <span>พนักงานตัวอย่าง 03</span>
                <strong>08:29 – 17:30</strong>
              </div>
            </div>,
          )}
        </div>
        {sub(
          "ทะเบียนพนักงาน",
          "ข้อมูลบุคลากรสมมติ",
          <div className="people-list">
            {sampleUsers.slice(0, 6).map((u) => (
              <div key={u[0]}>
                <div className="person-avatar">
                  <UserRound size={17} />
                </div>
                <strong>{u[0]}</strong>
                <span>{u[2]}</span>
                <Badge tone="green">ปฏิบัติงาน</Badge>
              </div>
            ))}
          </div>,
        )}
      </>
    );
  return (
    <>
      {sub(
        "ผู้ใช้และสิทธิ์ตัวอย่าง",
        "บทบาท แผนก และขอบเขตการเข้าถึง",
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ผู้ใช้ตัวอย่าง</th>
                <th>บทบาท</th>
                <th>แผนก</th>
                <th>สิทธิ์ตัวอย่าง</th>
              </tr>
            </thead>
            <tbody>
              {sampleUsers.map((u) => (
                <tr key={u[0]}>
                  <td>
                    <strong>{u[0]}</strong>
                  </td>
                  <td>{u[1]}</td>
                  <td>{u[2]}</td>
                  <td>{u[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )}
      <div className="access-grid">
        {sub(
          "งานรออนุมัติ",
          "คิวงานตัวอย่างจากทุกฝ่าย",
          <div className="stack-list">
            {allJobs
              .filter((j) => j.stage === 3 || j.stage === 9)
              .map((j) => (
                <button key={j.id} onClick={() => openJob(j.id)}>
                  <ClipboardCheck size={18} />
                  <div>
                    <strong>{j.title}</strong>
                    <small>
                      {j.id} · {j.owner}
                    </small>
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))}
            {data.leaves
              .filter((l) => l.status === "รออนุมัติ")
              .map((l) => (
                <div key={l.id} className="list-row">
                  <CalendarDays size={18} />
                  <div>
                    <strong>ใบลา {l.id}</strong>
                    <small>{l.employee}</small>
                  </div>
                </div>
              ))}
          </div>,
        )}
        {sub(
          "ตั้งค่าขั้นตอนงาน",
          "ค่าเบื้องต้นสำหรับหารือ ไม่ใช่กฎจริง",
          <div className="settings-list">
            <div>
              <span>เส้นทางงานมาตรฐาน</span>
              <Badge tone="blue">ตัวอย่าง</Badge>
            </div>
            <div>
              <span>ลำดับผู้อนุมัติคำขอซื้อ</span>
              <Badge tone="amber">รอยืนยัน</Badge>
            </div>
            <div>
              <span>สิทธิ์งานซีเคร็ต</span>
              <Badge tone="amber">รอยืนยันกับบริษัท</Badge>
            </div>
            <button
              className="btn secondary"
              onClick={() => openDialog("settings")}
            >
              ดูรายละเอียดการตั้งค่า
            </button>
          </div>,
        )}
      </div>
      {sub(
        "การแจ้งเตือนและประวัติ",
        "เหตุการณ์จำลองล่าสุด",
        <div className="stack-list">
          {data.notifications.map((n, i) => (
            <div key={i} className="list-row">
              <Bell size={16} />
              <div>
                <strong>{n}</strong>
                <small>ข้อมูลสาธิต</small>
              </div>
            </div>
          ))}
        </div>,
      )}
    </>
  );
}
function DialogView({
  dialog,
  job,
  data,
  form,
  error,
  field,
  close,
  save,
}: {
  dialog: Exclude<Dialog, null>;
  job: Job | null;
  data: AppData;
  form: Record<string, string>;
  error: string;
  field: (key: string, value: string) => void;
  close: () => void;
  save: () => void;
}) {
  const titles: Record<Exclude<Dialog, null>, string> = {
    quote: "สร้างใบเสนอราคา",
    send: "ตรวจผู้รับก่อนจำลองการส่ง",
    response: "บันทึกผลตอบรับลูกค้า",
    review: "รีวิวทางวิศวกรรม",
    plan: "วางแผนเส้นทางผลิต",
    outsource: "งานจ้างภายนอก",
    stock: "บันทึกการเคลื่อนไหววัสดุ",
    qc: "บันทึกผล QC",
    leave: "ยื่นใบลา",
    settings: "ตั้งค่าขั้นตอนงาน",
  };
  const input = (
    key: string,
    label: string,
    placeholder = "",
    type = "text",
  ) => (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={form[key] || ""}
        placeholder={placeholder}
        onChange={(e) => field(key, e.target.value)}
      />
    </label>
  );
  const select = (key: string, label: string, options: string[]) => (
    <label className="field">
      <span>{label}</span>
      <select
        value={form[key] || options[0]}
        onChange={(e) => field(key, e.target.value)}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
  const selectedCustomer = data.customers.find(
    (customer) => customer.id === form.customerId,
  );
  const customerSelect = () => (
    <label className="field">
      <span>เลือกลูกค้าจากทะเบียน (ข้อมูลสมมติ)</span>
      <select
        value={form.customerId || ""}
        onChange={(e) => field("customerId", e.target.value)}
      >
        <option value="">เลือกลูกค้า</option>
        {data.customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.id} · {customer.name}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titles[dialog]}
      >
        <div className="modal-head">
          <div>
            <span className="overline">ERP COMPANY PLATFORM / DEMO</span>
            <h2>{titles[dialog]}</h2>
          </div>
          <button className="icon-button" onClick={close} aria-label="ปิด">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {dialog === "quote" && (
            <>
              <div className="form-grid">
                {customerSelect()}
                {input("title", "ชื่อชิ้นงาน", "ชิ้นงานรุ่น D")}
                {input("qty", "จำนวน", "1", "number")}
                {input("price", "ราคาต่อหน่วย (ตัวอย่าง)", "1000", "number")}
                {input("due", "กำหนดส่ง", "", "date")}
              </div>
              {selectedCustomer ? (
                <div className="customer-lookup">
                  <div className="customer-avatar">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <strong>{selectedCustomer.name}</strong>
                    <span>
                      {selectedCustomer.contact} · {selectedCustomer.email}
                    </span>
                    <small>
                      {selectedCustomer.address} · TAX {selectedCustomer.taxId}
                    </small>
                  </div>
                  <CheckCircle2 size={18} />
                </div>
              ) : (
                <div className="dialog-hint">
                  เลือกลูกค้าหนึ่งรายเพื่อดึงชื่อผู้ติดต่อ อีเมล ที่อยู่
                  และเลขประจำตัวผู้เสียภาษี ลงในใบเสนอราคา
                </div>
              )}
              {input("description", "รายละเอียดชิ้นงาน", "รายละเอียดตัวอย่าง")}
            </>
          )}
          {dialog === "send" && (
            <>
              <div className="modal-job">
                <FileText size={20} />
                <div>
                  <strong>{job?.quoteId}</strong>
                  <span>
                    {job?.customer} · {job?.title}
                  </span>
                </div>
              </div>
              {input(
                "email",
                "ตรวจสอบอีเมลผู้รับ",
                "contact@example.com",
                "email",
              )}
              <div className="inline-note">
                <CircleAlert size={16} />
                การกดปุ่มเป็นการจำลอง ไม่มีอีเมลถูกส่งจริง และรับเฉพาะโดเมน
                .example
              </div>
            </>
          )}
          {dialog === "response" && (
            <>
              {select("response", "ผลตอบรับจากลูกค้า (พนักงาน Sales บันทึก)", [
                "ตอบรับ",
                "ปฏิเสธ",
                "ต้องแก้ไข",
              ])}
              {input("reason", "หมายเหตุ", "รายละเอียดผลตอบรับ")}
            </>
          )}
          {dialog === "review" && (
            <>
              {select("decision", "ผลการรีวิว", ["อนุมัติ", "ส่งกลับ"])}
              {form.decision === "ส่งกลับ" &&
                input("reason", "เหตุผลที่ส่งกลับ", "ระบุสิ่งที่ต้องแก้ไข")}
            </>
          )}
          {dialog === "plan" && (
            <>
              <p className="dialog-hint">
                เลือกเฉพาะขั้นตอนที่ชิ้นงานนี้ต้องผ่าน
              </p>
              <div className="check-grid">
                {routeOptions.map((r) => (
                  <label key={r}>
                    <input
                      type="checkbox"
                      checked={form[r] === "true"}
                      onChange={(e) => field(r, String(e.target.checked))}
                    />
                    {r}
                  </label>
                ))}
              </div>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={form.outsource === "true"}
                  onChange={(e) => field("outsource", String(e.target.checked))}
                />
                มีบางขั้นตอนจ้างภายนอก
              </label>
              <div className="inline-note">
                ตัวอย่าง “ทำเอง 50% จ้าง 50%”
                ต้องยืนยันวิธีคิดสัดส่วนกับฝ่ายที่เกี่ยวข้อง
              </div>
            </>
          )}
          {dialog === "outsource" && (
            <>
              <div className="modal-job">
                <ShoppingCart size={20} />
                <div>
                  <strong>{job?.id}</strong>
                  <span>บริการแปรรูปชิ้นงาน · ต้นทุนตัวอย่าง ฿12,500</span>
                </div>
              </div>
              <div className="info-grid">
                <Info label="วันส่งออกตัวอย่าง" value="2 ต.ค. 2569" />
                <Info label="วันคาดว่าจะรับกลับ" value="6 ต.ค. 2569" />
              </div>
              <div className="inline-note">
                ขั้นตอนอนุมัติผู้จ้างและวันจริงรอยืนยันกับฝ่ายจัดซื้อ
              </div>
            </>
          )}
          {dialog === "stock" && (
            <>
              {select(
                "kind",
                "ประเภทการเคลื่อนไหว",
                job ? ["เบิก"] : ["รับเข้า", "โอน"],
              )}
              {select(
                "item",
                "วัสดุ",
                data.stockItems.map((x) => x.name),
              )}
              <div className="form-grid">
                {(form.kind === "โอน" || form.kind === "เบิก") &&
                  select("from", "Store ต้นทาง", [
                    "Store 1",
                    "Store 2",
                    "Store 3",
                  ])}
                {form.kind !== "เบิก" &&
                  select("to", "Store ปลายทาง", [
                    "Store 1",
                    "Store 2",
                    "Store 3",
                  ])}
                {input("qty", "จำนวน", "1", "number")}
              </div>
              {job && (
                <div className="inline-note">
                  เบิกตามเลขงาน {job.id} ·
                  การเปลี่ยนยอดคงเหลือเป็นข้อมูลจำลองในเบราว์เซอร์นี้
                </div>
              )}
            </>
          )}
          {dialog === "qc" && (
            <>
              {select("result", "ผลตรวจ", ["ผ่าน", "ไม่ผ่าน"])}
              <div className="form-grid">
                {input("pass", "จำนวนที่ผ่าน", "0", "number")}
                {input("reject", "จำนวนที่เสีย", "0", "number")}
              </div>
              {input(
                "reason",
                "เหตุผล / หมายเหตุ",
                form.result === "ไม่ผ่าน"
                  ? "ระบุสาเหตุที่ไม่ผ่าน"
                  : "ผลตรวจตัวอย่าง",
              )}
              <div className="inline-note">
                หลักฐานแนบเป็นไฟล์สมมติ · ผลตรวจไม่เปลี่ยนข้อมูลภายนอก
              </div>
            </>
          )}
          {dialog === "leave" && (
            <>
              <div className="form-grid">
                {input("employee", "พนักงานตัวอย่าง", "พนักงานตัวอย่าง 01")}
                {select("type", "ประเภทการลา", [
                  "ลาพักร้อน",
                  "ลาป่วย",
                  "ลากิจ",
                ])}
                {input("from", "วันที่เริ่ม", "", "date")}
                {input("to", "วันที่สิ้นสุด", "", "date")}
              </div>
              {input("reason", "เหตุผล", "ธุระส่วนตัว")}
            </>
          )}
          {dialog === "settings" && (
            <>
              <div className="settings-list">
                <div>
                  <span>ขั้นตอนใบเสนอราคา → จัดส่ง</span>
                  <Badge tone="blue">ตัวอย่าง</Badge>
                </div>
                <div>
                  <span>เกณฑ์อนุมัติคำขอซื้อ</span>
                  <Badge tone="amber">รอยืนยัน</Badge>
                </div>
                <div>
                  <span>ความหมาย Store 1–3</span>
                  <Badge tone="amber">รอยืนยัน</Badge>
                </div>
                <div>
                  <span>สิทธิ์งานซีเคร็ต</span>
                  <Badge tone="amber">รอยืนยันกับบริษัท</Badge>
                </div>
              </div>
              <p className="dialog-hint">
                หน้านี้ใช้เก็บประเด็นหารือ ยังไม่มีการเปลี่ยนกฎระบบจริง
              </p>
            </>
          )}
          {error && (
            <div className="error-note">
              <CircleAlert size={16} />
              {error}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <span>ข้อมูลทั้งหมดเป็นข้อมูลสมมติ</span>
          <div>
            <button className="btn secondary" onClick={close}>
              ยกเลิก
            </button>
            {dialog !== "settings" && (
              <button className="btn primary" onClick={save}>
                {dialog === "send"
                  ? "จำลองการส่ง"
                  : dialog === "outsource"
                    ? job?.outsourceSent
                      ? "บันทึกรับกลับ"
                      : "บันทึกส่งออก"
                    : "บันทึกข้อมูลจำลอง"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
