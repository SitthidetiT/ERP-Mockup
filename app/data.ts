export type Role =
  | "ผู้บริหาร"
  | "Sales"
  | "วิศวกรรม"
  | "ผู้เขียนแบบ"
  | "PPC"
  | "จัดซื้อ"
  | "คลัง"
  | "ฝ่ายผลิต"
  | "QC"
  | "แพ็ค"
  | "จัดส่ง"
  | "ผู้ดูต้นทุน"
  | "HR"
  | "ผู้ดูแลระบบ";
export type ModuleId =
  | "dashboard"
  | "access"
  | "sales"
  | "jobs"
  | "engineering"
  | "ppc"
  | "purchase"
  | "inventory"
  | "production"
  | "quality"
  | "delivery"
  | "finance"
  | "hr";
export type WorkTab =
  | "overview"
  | "quote"
  | "drawing"
  | "plan"
  | "purchase"
  | "inventory"
  | "production"
  | "qc"
  | "delivery"
  | "cost"
  | "history";
export type LogEntry = {
  at: string;
  by: string;
  from: string;
  to: string;
  reason: string;
};
export type QuoteLine = {
  name: string;
  qty: number;
  price: number;
};
export type Job = {
  id: string;
  quoteId: string;
  customer: string;
  contact: string;
  email: string;
  title: string;
  description: string;
  due: string;
  priority: "ปกติ" | "สูง" | "เร่งด่วน";
  kind: "ทำเอง 100%" | "ซีเคร็ต" | "ทำเองบางส่วน / จ้างภายนอกบางส่วน";
  stage: number;
  owner: string;
  lines: QuoteLine[];
  drawingVersion: number;
  route: string[];
  materialsIssued: boolean;
  outsourced: boolean;
  outsourceSent: boolean;
  outsourceReturned: boolean;
  qcFailCount: number;
  qcPass: number;
  qcReject: number;
  qcReason: string;
  rework: boolean;
  packed: boolean;
  delivered: boolean;
  logs: LogEntry[];
};
export type Leave = {
  id: string;
  employee: string;
  type: string;
  from: string;
  to: string;
  reason: string;
  status: "รออนุมัติ" | "อนุมัติ" | "ไม่อนุมัติ";
};
export type StockItem = {
  name: string;
  unit: string;
  stock: number[];
};
export type StockMove = {
  id: string;
  item: string;
  kind: string;
  from: string;
  to: string;
  qty: number;
  at: string;
  jobId?: string;
};
export type AppData = {
  jobs: Job[];
  leaves: Leave[];
  notifications: string[];
  stockItems: StockItem[];
  stockMoves: StockMove[];
};
export const roles: Role[] = [
  "ผู้บริหาร",
  "Sales",
  "วิศวกรรม",
  "ผู้เขียนแบบ",
  "PPC",
  "จัดซื้อ",
  "คลัง",
  "ฝ่ายผลิต",
  "QC",
  "แพ็ค",
  "จัดส่ง",
  "ผู้ดูต้นทุน",
  "HR",
  "ผู้ดูแลระบบ",
];
export const modules: {
  id: ModuleId;
  label: string;
  group: string;
  roles: Role[] | null;
}[] = [
  { id: "dashboard", label: "ภาพรวม", group: "ภาพรวม", roles: null },
  {
    id: "access",
    label: "ระบบกลางและสิทธิ์",
    group: "การจัดการ",
    roles: ["ผู้ดูแลระบบ", "ผู้บริหาร"],
  },
  {
    id: "sales",
    label: "ลูกค้าและใบเสนอราคา",
    group: "งานขายและโครงการ",
    roles: ["Sales"],
  },
  {
    id: "jobs",
    label: "รับงาน / รายละเอียดงาน",
    group: "งานขายและโครงการ",
    roles: null,
  },
  {
    id: "engineering",
    label: "วิศวกรรมและแบบ",
    group: "งานขายและโครงการ",
    roles: ["วิศวกรรม", "ผู้เขียนแบบ"],
  },
  { id: "ppc", label: "PPC และแผนงาน", group: "การดำเนินงาน", roles: ["PPC"] },
  {
    id: "purchase",
    label: "จัดซื้อและจ้างภายนอก",
    group: "การดำเนินงาน",
    roles: ["จัดซื้อ"],
  },
  {
    id: "inventory",
    label: "คลังสินค้า",
    group: "การดำเนินงาน",
    roles: ["คลัง"],
  },
  {
    id: "production",
    label: "ฝ่ายผลิต",
    group: "การดำเนินงาน",
    roles: ["ฝ่ายผลิต"],
  },
  {
    id: "quality",
    label: "QC และงานเสีย",
    group: "การดำเนินงาน",
    roles: ["QC"],
  },
  {
    id: "delivery",
    label: "แพ็คและจัดส่ง",
    group: "การดำเนินงาน",
    roles: ["แพ็ค", "จัดส่ง"],
  },
  {
    id: "finance",
    label: "ต้นทุนและรายงาน",
    group: "ข้อมูลสนับสนุน",
    roles: ["ผู้ดูต้นทุน", "ผู้บริหาร"],
  },
  { id: "hr", label: "ทรัพยากรบุคคล", group: "ข้อมูลสนับสนุน", roles: ["HR"] },
];
export const stageNames = [
  "ร่างใบเสนอราคา",
  "ส่งใบเสนอราคาแล้ว",
  "ลูกค้าตอบรับ",
  "เปิดงานแล้ว",
  "วิศวกรรมอนุมัติ",
  "แบบพร้อมใช้งาน",
  "วางแผนแล้ว",
  "เบิกวัสดุแล้ว",
  "กำลังผลิต",
  "รอ/ผ่าน QC",
  "แพ็คแล้ว",
  "จัดส่งแล้ว",
];
export const stageOwners: Role[] = [
  "Sales",
  "Sales",
  "Sales",
  "วิศวกรรม",
  "ผู้เขียนแบบ",
  "PPC",
  "คลัง",
  "ฝ่ายผลิต",
  "ฝ่ายผลิต",
  "QC",
  "จัดส่ง",
  "ผู้บริหาร",
];
export const routeOptions = [
  "CNC Milling",
  "Milling",
  "CNC Lathe",
  "Lathe",
  "Assembly",
  "Welding",
];
const stamp = "24 ก.ย. 2569 09:30";
export const initialData: AppData = {
  jobs: [
    {
      id: "JOB-2609-001",
      quoteId: "QT-2609-001",
      customer: "บริษัท ตัวอย่าง อัลฟา จำกัด",
      contact: "คุณอร (ข้อมูลสมมติ)",
      email: "contact@alpha.example",
      title: "ชุดฐานยึดเครื่องจักร รุ่น A",
      description: "ชิ้นงานตัวอย่างสำหรับเส้นทางผลิตปกติ",
      due: "2026-10-12",
      priority: "สูง",
      kind: "ทำเอง 100%",
      stage: 8,
      owner: "ฝ่ายผลิต",
      lines: [
        { name: "ฐานยึดอะลูมิเนียม รุ่น A", qty: 24, price: 1850 },
        { name: "แผ่นปิดประกอบ รุ่น A", qty: 24, price: 420 },
      ],
      drawingVersion: 2,
      route: ["CNC Milling", "Assembly"],
      materialsIssued: true,
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
          at: stamp,
          by: "ระบบตัวอย่าง",
          from: "วางแผนแล้ว",
          to: "กำลังผลิต",
          reason: "ข้อมูลตั้งต้นสำหรับสาธิต",
        },
      ],
    },
    {
      id: "JOB-2609-002",
      quoteId: "QT-2609-002",
      customer: "ห้างหุ้นส่วน ตัวอย่าง เบต้า",
      contact: "คุณพิม (ข้อมูลสมมติ)",
      email: "procurement@beta.example",
      title: "เพลาขับพิเศษ รุ่น B",
      description: "ชิ้นงานตัวอย่างสำหรับจ้างภายนอกบางส่วน",
      due: "2026-10-05",
      priority: "เร่งด่วน",
      kind: "ทำเองบางส่วน / จ้างภายนอกบางส่วน",
      stage: 6,
      owner: "จัดซื้อ",
      lines: [{ name: "เพลาขับสแตนเลส รุ่น B", qty: 12, price: 3950 }],
      drawingVersion: 1,
      route: ["CNC Lathe", "Welding"],
      materialsIssued: false,
      outsourced: true,
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
          at: stamp,
          by: "ระบบตัวอย่าง",
          from: "แบบพร้อมใช้งาน",
          to: "วางแผนแล้ว",
          reason: "ข้อมูลตั้งต้นสำหรับสาธิต",
        },
      ],
    },
    {
      id: "JOB-2609-003",
      quoteId: "QT-2609-003",
      customer: "บริษัท ตัวอย่าง แกมมา จำกัด",
      contact: "คุณนที (ข้อมูลสมมติ)",
      email: "orders@gamma.example",
      title: "โครงประกอบ รุ่น C",
      description: "ชิ้นงานตัวอย่างสำหรับตรวจคุณภาพและส่งกลับแก้ไข",
      due: "2026-09-29",
      priority: "สูง",
      kind: "ทำเอง 100%",
      stage: 9,
      owner: "QC",
      lines: [{ name: "โครงประกอบเหล็ก รุ่น C", qty: 8, price: 6200 }],
      drawingVersion: 3,
      route: ["Milling", "Welding", "Assembly"],
      materialsIssued: true,
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
          at: stamp,
          by: "ระบบตัวอย่าง",
          from: "กำลังผลิต",
          to: "รอ/ผ่าน QC",
          reason: "ข้อมูลตั้งต้นสำหรับสาธิต",
        },
      ],
    },
    {
      id: "JOB-2609-004",
      quoteId: "QT-2609-004",
      customer: "บริษัท ตัวอย่าง เดลต้า จำกัด",
      contact: "คุณดา (ข้อมูลสมมติ)",
      email: "sample@delta.example",
      title: "ชิ้นส่วนต้นแบบจำกัดสิทธิ์",
      description: "ตัวอย่างการจำกัดการมองเห็นงานประเภทซีเคร็ต",
      due: "2026-10-20",
      priority: "ปกติ",
      kind: "ซีเคร็ต",
      stage: 3,
      owner: "วิศวกรรม",
      lines: [{ name: "ชิ้นส่วนต้นแบบ รุ่น D", qty: 4, price: 2800 }],
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
          at: stamp,
          by: "ระบบตัวอย่าง",
          from: "ลูกค้าตอบรับ",
          to: "เปิดงานแล้ว",
          reason: "ข้อมูลตั้งต้นสำหรับตัวอย่างการจำกัดสิทธิ์",
        },
      ],
    },
  ],
  leaves: [
    {
      id: "LV-2609-001",
      employee: "พนักงานตัวอย่าง 01",
      type: "ลาพักร้อน",
      from: "2026-10-08",
      to: "2026-10-09",
      reason: "ธุระส่วนตัว (ข้อมูลสมมติ)",
      status: "รออนุมัติ",
    },
  ],
  notifications: [
    "งาน JOB-2609-003 รอตรวจคุณภาพ",
    "งาน JOB-2609-002 ใกล้กำหนดส่ง",
    "ใบลา LV-2609-001 รออนุมัติ",
  ],
  stockItems: [
    { name: "อะลูมิเนียมแผ่น AL-01", unit: "แผ่น", stock: [120, 18, 0] },
    { name: "เหล็กเพลา ST-02", unit: "เส้น", stock: [12, 64, 8] },
    { name: "น็อตประกอบ AS-03", unit: "ชุด", stock: [40, 22, 205] },
  ],
  stockMoves: [
    {
      id: "MV-2609-001",
      item: "อะลูมิเนียมแผ่น AL-01",
      kind: "รับเข้า",
      from: "ภายนอก (ตัวอย่าง)",
      to: "Store 1",
      qty: 30,
      at: stamp,
    },
  ],
};
export const money = (value: number) =>
  new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
export const dateTH = (value: string) =>
  new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
export const statusOf = (job: Job) =>
  job.rework
    ? "ส่งกลับแก้ไข"
    : job.stage === 9 && job.qcPass > 0
      ? "QC ผ่าน"
      : stageNames[job.stage];
export const revenue = (job: Job) =>
  job.lines.reduce((sum, line) => sum + line.qty * line.price, 0);
export const costParts = (job: Job) => {
  const materialSamples: Record<string, number> = {
    "JOB-2609-001": 18000,
    "JOB-2609-002": 9800,
    "JOB-2609-003": 16000,
    "JOB-2609-004": 0,
  };
  const laborSamples: Record<string, number> = {
    "JOB-2609-001": 11200,
    "JOB-2609-002": 5400,
    "JOB-2609-003": 6400,
    "JOB-2609-004": 0,
  };
  return {
    material: job.materialsIssued ? (materialSamples[job.id] ?? 4500) : 0,
    outsource: job.outsourceSent ? 12500 : 0,
    labor: job.stage >= 8 ? (laborSamples[job.id] ?? 3200) : 0,
    scrap: job.qcFailCount ? 2400 : 0,
    rework: job.qcFailCount && !job.rework ? 1800 : 0,
  };
};
