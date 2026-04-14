import { useState, useEffect, type ElementType } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  Users,
  Settings,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Search,
  MoreVertical,
  LogOut,
  ArrowLeft,
  UserPlus,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2,
  BellRing,
  Lock,
  Building2
} from "lucide-react"
import AdminFacilitiesPanel from "@/pages/AdminFacilitiesPanel"

// --- Types ---
interface User {
  id: string | number
  displayName: string
  email: string
  avatarUrl?: string
  roles: string[]
  adminProtected?: boolean
  createdAt?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

interface Notification {
  id: number
  message: string
  type: string
  createdAt: string
  read: boolean
}

type NotificationCategory = "user-management" | "faculty-notifications"

// --- Components ---

interface NavItemProps {
  icon: ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}

function NavItem({ icon: Icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300 ${
        active 
          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? "animate-pulse" : ""}`} />
      <span className="text-sm font-bold tracking-tight uppercase">{label}</span>
      {badge && (
        <span className="ml-auto text-[10px] font-black bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/20">
          {badge}
        </span>
      )}
      {active && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-r-full" />}
    </button>
  )
}


function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, { credentials: "include" })
      if (res.ok) {
        const data = await res.json() as User[];
        setUsers(data);
      }
    } catch (err: unknown) {
      console.error("Fetch users failed:", err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const toggleRole = async (userId: number | string, currentRoles: string[]) => {
    const newRoles = currentRoles.includes("ADMIN") ? ["USER"] : ["USER", "ADMIN"]
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoles),
        credentials: "include"
      })
      if (res.ok) fetchUsers()
    } catch (err: unknown) {
      console.error("Update role failed:", err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Identity Governance</h2>
          <p className="text-white/60 font-medium max-w-md">Manage user access levels, audit identities, and assign administrative privileges across the campus network.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
             <input 
               type="text" 
               placeholder="Search identities..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white focus:ring-1 focus:ring-indigo-500 outline-none w-80 placeholder:text-white/40 transition-all focus:bg-white/10"
             />
           </div>
           <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-500/20">
             Provision User
           </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[40px] border border-white/10 bg-[#0a0a0a]/50 shadow-2xl backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Principal</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Privileges</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Created At</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/50 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-10 py-12 text-center text-white/10 font-black uppercase tracking-widest">Syncing Identity Data...</td>
                </tr>
              ))
            ) : filteredUsers.map(u => (
              <tr key={u.id} className="group hover:bg-white/[0.03] transition-colors">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {u.avatarUrl ? <img src={u.avatarUrl} className="h-full w-full object-cover" /> : <Users className="h-6 w-6 text-indigo-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-lg text-white tracking-tight uppercase leading-none">{u.displayName}</p>
                        {u.adminProtected && (
                          <span title="Protected Account" className="text-amber-500">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 mt-1.5 font-medium">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex flex-wrap gap-2">
                    {u.roles.map(r => (
                      <span key={r} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        r === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-10 py-8 text-sm font-bold text-white/60 uppercase tracking-tighter">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Historical'}
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => toggleRole(u.id, u.roles)}
                      disabled={u.adminProtected}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        u.adminProtected
                          ? 'border-white/10 text-white/20 cursor-not-allowed'
                          : u.roles.includes('ADMIN')
                            ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                            : 'border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10'
                      }`}
                    >
                      {u.roles.includes('ADMIN') ? 'Revoke Admin' : 'Grant Admin'}
                    </button>
                    <button className="p-3 rounded-xl border border-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("user-management")

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, { credentials: "include" })
      if (res.ok) {
        const data = await res.json() as Notification[];
        setNotifications(data);
      }
    } catch (err: unknown) {
      console.error("Fetch notifications failed:", err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include"
      })
      if (res.ok) fetchNotifications()
    } catch (err: unknown) {
      console.error("Mark as read failed:", err instanceof Error ? err.message : String(err))
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include"
      })
      if (res.ok) fetchNotifications()
    } catch (err: unknown) {
      console.error("Delete notification failed:", err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => { fetchNotifications() }, [])

  const userManagementNotifications = notifications.filter((notification) =>
    notification.type === "USER_REGISTRATION" || notification.type.startsWith("USER_")
  )

  const facultyNotifications = notifications.filter((notification) =>
    notification.type.startsWith("FACILITY_")
  )

  const activeNotifications =
    activeCategory === "user-management" ? userManagementNotifications : facultyNotifications

  const activeCount = activeNotifications.filter((notification) => !notification.read).length
  const userManagementUnreadCount = userManagementNotifications.filter((notification) => !notification.read).length
  const facultyUnreadCount = facultyNotifications.filter((notification) => !notification.read).length

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Security Audit Alerts</h2>
        <p className="text-white/60 font-medium max-w-sm">Real-time telemetry and identity lifecycle events requiring administrative oversight.</p>
      </div>

      <div className="space-y-4 rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/55">Notification Channels</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            {activeCount} unread in active channel
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveCategory("user-management")}
            className={`group relative overflow-hidden rounded-3xl border px-5 py-4 text-left transition-all duration-300 sm:px-6 sm:py-5 ${
              activeCategory === "user-management"
                ? "border-indigo-400/30 bg-gradient-to-br from-indigo-500/20 via-indigo-500/10 to-transparent text-indigo-100 shadow-[0_20px_50px_rgba(99,102,241,0.2)]"
                : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-400/15 blur-2xl" />
            <span className="relative flex items-start justify-between gap-4">
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-current/20 bg-current/10">
                  <UserPlus className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-[0.28em]">User Management</span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] opacity-75">Identity lifecycle events</span>
                </span>
              </span>
              <span className="rounded-full border border-current/25 bg-current/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                {userManagementUnreadCount}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("faculty-notifications")}
            className={`group relative overflow-hidden rounded-3xl border px-5 py-4 text-left transition-all duration-300 sm:px-6 sm:py-5 ${
              activeCategory === "faculty-notifications"
                ? "border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-100 shadow-[0_20px_50px_rgba(16,185,129,0.2)]"
                : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/15 blur-2xl" />
            <span className="relative flex items-start justify-between gap-4">
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-current/20 bg-current/10">
                  <Building2 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-[0.28em]">Faculty Notifications</span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] opacity-75">Facility operation events</span>
                </span>
              </span>
              <span className="rounded-full border border-current/25 bg-current/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                {facultyUnreadCount}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-4 custom-scrollbar">
        {loading ? (
          <div className="p-20 text-center text-white/10 font-black uppercase tracking-widest border border-white/5 rounded-[40px]">Syncing Telemetry...</div>
        ) : activeNotifications.length === 0 ? (
          <div className="p-20 text-center text-white/10 font-black uppercase tracking-widest border border-white/5 rounded-[40px]">No active alerts detected</div>
        ) : activeNotifications.map(n => (
          <div 
            key={n.id} 
            className={`group p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between ${
              n.read 
                ? "bg-white/[0.01] border-white/5 opacity-60" 
                : "bg-indigo-500/5 border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.05)]"
            }`}
          >
            <div className="flex items-center gap-6">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                n.read ? "bg-white/5 border-white/10" : "bg-indigo-500/10 border-indigo-500/20"
              }`}>
                {n.type === "USER_REGISTRATION" ? <UserPlus className={`h-5 w-5 ${n.read ? "text-white/40" : "text-indigo-400"}`} /> : <BellRing className="h-5 w-5 text-indigo-400" />}
              </div>
              <div>
                <p className={`font-bold tracking-tight ${n.read ? "text-white/60" : "text-white"}`}>{n.message}</p>
                <div className="flex items-center gap-3 mt-1.5">
                   <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40">
                     <Clock className="h-3 w-3" />
                     {new Date(n.createdAt).toLocaleString()}
                   </span>
                   {!n.read && <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               {!n.read && (
                 <button 
                   onClick={() => markAsRead(n.id)}
                   className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
                   title="Mark as Read"
                 >
                   <CheckCircle2 className="h-4 w-4" />
                 </button>
               )}
               <button 
                 onClick={() => deleteNotification(n.id)}
                 className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                 title="Dismiss Alert"
               >
                 <Trash2 className="h-4 w-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface PlaceholderTabProps {
  title: string;
  description: string;
  icon: ElementType;
}

function PlaceholderTab({ title, description, icon: Icon }: PlaceholderTabProps) {
  return (
    <div className="flex flex-col items-center justify-center shrink-0 h-[600px] rounded-[40px] border border-white/5 bg-white/[0.01] animate-in fade-in zoom-in duration-500">
       <div className="p-10 rounded-full bg-indigo-500/5 border border-indigo-500/10 mb-8">
          <Icon className="h-20 w-20 text-indigo-500/30" />
       </div>
       <h3 className="text-3xl font-black text-white tracking-tight uppercase mb-4">{title}</h3>
       <p className="text-white/50 text-lg max-w-sm text-center font-medium">{description}</p>
       <button className="mt-10 flex items-center gap-3 text-sm font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-all">
         <span>Initialize Integration</span>
         <ChevronRight className="h-4 w-4" />
       </button>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("users")
  const [stats, setStats] = useState({
    userCount: 0,
    bookingCount: 0,
    incidentCount: 0,
    resourceCount: 0,
    pendingApprovalCount: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stats/admin`, { credentials: "include" })
        if (res.ok) {
          const data = await res.json() as typeof stats;
          setStats(data);
        }
      } catch (err: unknown) {
        console.error("Fetch admin stats failed:", err instanceof Error ? err.message : String(err))
      }
    }
    fetchStats()
  }, [])

  if (!user || !user.roles.includes("ADMIN")) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-[#030303] text-white p-12">
        <div className="h-24 w-24 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
           <AlertCircle className="h-12 w-12 text-red-500 animate-pulse" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter uppercase text-center">Access Restricted</h1>
        <p className="max-w-md text-center text-white/50 font-medium text-lg leading-relaxed">Identity verification indicates missing administrative privileges for this secure zone.</p>
        <button onClick={() => navigate("/dashboard")} className="bg-white text-black font-black uppercase tracking-[.2em] px-12 py-5 rounded-full hover:scale-105 active:scale-95 transition-all text-xs">Return to User Dashboard</button>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh bg-[#030303] text-white font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 right-0 h-[80%] w-[50%] rounded-full bg-indigo-500/[0.03] blur-[150px]" />
         <div className="absolute bottom-0 left-0 h-[60%] w-[40%] rounded-full bg-red-500/[0.02] blur-[150px]" />
      </div>

      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-80 shrink-0 border-r border-white/[0.05] flex flex-col z-20 overflow-hidden bg-black/40 backdrop-blur-3xl">
        <div className="p-10 pb-12">
          <div className="py-2" />
          
          <div className="flex items-center gap-4 py-6 border-b border-white/[0.05]">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center border border-white/20 shadow-lg shadow-indigo-500/20">
               <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
               <p className="text-lg font-black tracking-tighter leading-none mb-1 text-white uppercase">Admin</p>
               <p className="text-[10px] font-black tracking-[.2em] text-indigo-400 uppercase">Secure Zone</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-3 overflow-y-auto custom-scrollbar">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-[.4em] px-4 mb-4">Core Governance</p>
          <NavItem icon={Users} label="User Management" active={activeTab === "users"} onClick={() => setActiveTab("users")} badge="Active" />
          <NavItem icon={Building2} label="Facilities" active={activeTab === "facilities"} onClick={() => setActiveTab("facilities")} />
          <NavItem icon={BellRing} label="Audit Alerts" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} badge={stats.pendingApprovalCount > 0 ? stats.pendingApprovalCount.toString() : undefined} />
          
          <div className="py-8" />
          
          <p className="text-[9px] font-black text-white/40 uppercase tracking-[.4em] px-4 mb-4">Telemetry</p>
          <NavItem icon={BarChart3} label="System Analytics" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
          <NavItem icon={Settings} label="Global Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        </nav>

        <div className="p-8 mt-auto border-t border-white/[0.05] bg-white/[0.02]">
           <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                 <AlertCircle className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Security Level</p>
                 <p className="text-xs font-bold text-orange-400 mt-1 uppercase">Elevated Access</p>
              </div>
           </div>
           <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-[10px] font-black tracking-widest uppercase text-red-500/60 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20">
             <LogOut className="h-5 w-5" />
             <span>Terminate Session</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 overflow-y-auto custom-scrollbar">
        {/* Top Floating Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-12 py-8 bg-black/10 backdrop-blur-md">
            <div className="flex items-center gap-3 text-white/50 text-[10px] font-black uppercase tracking-widest">
              <span>Admin</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{activeTab === 'users' ? 'Identity Governance' : activeTab === 'facilities' ? 'Facility Registry' : activeTab === 'notifications' ? 'Audit Alerts' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white group"
              >
                 <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                 <span className="text-xs font-black uppercase tracking-widest">Return to User Dashboard</span>
              </button>

              <div className="h-8 w-px bg-white/5" />

              <button 
                onClick={() => setActiveTab("notifications")}
                className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition-all relative ${
                  activeTab === "notifications" ? "bg-indigo-500 border-indigo-400" : "border-white/5 hover:bg-white/5"
                }`}
              >
                 <BellRing className={`h-5 w-5 ${activeTab === 'notifications' ? 'text-white' : 'text-white/50'}`} />
                 {stats.pendingApprovalCount > 0 && <span className="absolute top-3 right-3 h-2 w-2 bg-indigo-500 rounded-full border-2 border-[#030303]" />}
              </button>
            </div>
        </header>

        <div className="p-12 pb-24 space-y-12">

          {/* Dynamic Content */}
          <div className="relative">
            {activeTab === "users" && <UserManagement />}
            {activeTab === "facilities" && <AdminFacilitiesPanel />}
            {activeTab === "notifications" && <NotificationsCenter />}
            {activeTab === "analytics" && <PlaceholderTab title="Neural Analytics" description="Advanced telemetry and system health indicators powered by behavioral patterns." icon={BarChart3} />}
            {activeTab === "settings" && <PlaceholderTab title="System Architecture" description="Global configuration matrices and secure environment variables management." icon={Settings} />}
          </div>
        </div>
      </main>

      {/* Global CSS Overrides */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
        
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  )
}
