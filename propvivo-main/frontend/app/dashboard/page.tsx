'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../../context/SessionContext";

const GenericModule = ({ title, endpoint, data, setter, fields, token, fetchGenericModule, apiUrl }: any) => {
    const initialForm = fields.reduce((acc: any, field: any) => {
        acc[field.key] = field.defaultValue !== undefined ? field.defaultValue : (field.type === 'number' ? 0 : '');
        return acc;
    }, {});
    
    const [form, setForm] = useState(initialForm);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/${endpoint}`, { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                fetchGenericModule(endpoint, setter);
                setShowForm(false);
                setForm(initialForm);
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 capitalize">{title} Records</h2>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-brand-blue text-white rounded-lg font-medium shadow-md shadow-brand-blue/20 hover:bg-brand-indigo transition-all">
                    {showForm ? 'Cancel' : 'Add Record'}
                </button>
            </div>
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-inner">
                    {fields.map((field: any) => !field.hideInForm && (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    required
                                    value={form[field.key]}
                                    onChange={e => setForm({...form, [field.key]: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-muted focus:border-brand-muted bg-white"
                                >
                                    <option value="">Select...</option>
                                    {field.options?.map((opt: string) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    type={field.type}
                                    required
                                    value={form[field.key]} 
                                    onChange={e => setForm({...form, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-muted focus:border-brand-muted"
                                />
                            )}
                        </div>
                    ))}
                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-brand-blue text-white rounded-lg font-medium shadow-md hover:bg-brand-indigo disabled:opacity-50 transition-colors">
                            {loading ? 'Saving...' : 'Save Record'}
                        </button>
                    </div>
                </form>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            {fields.map((f: any) => <th key={f.key} className="py-3 px-4 font-semibold text-sm text-gray-500">{f.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr><td colSpan={fields.length} className="py-8 text-center text-gray-500">No records found.</td></tr>
                        ) : (
                            data.map((item: any, i: number) => (
                                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                    {fields.map((f: any) => (
                                        <td key={f.key} className="py-3 px-4 text-gray-800">
                                            {f.type === 'date' && item[f.key]
                                                ? new Date(item[f.key]).toLocaleDateString() 
                                                : typeof item[f.key] === 'object' ? JSON.stringify(item[f.key]) : String(item[f.key] ?? '')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const parseUTCDate = (dateString: string) => {
    if (!dateString) return new Date();
    return new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
};

const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
    const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

export default function Dashboard() {
  const router = useRouter();
  const { user, logout, token } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Dashboard State
  const [clockStatus, setClockStatus] = useState<string>("Not Clocked In");
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceId, setAttendanceId] = useState<string | null>(null);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [completedTodayMs, setCompletedTodayMs] = useState(0);
  const [lastMonthMs, setLastMonthMs] = useState(0);
  const [totalLiveMs, setTotalLiveMs] = useState(0);

  // Leave State
  const [leaves, setLeaves] = useState<any[]>([]);
  const [leaveLoading, setLeaveLoading] = useState(false);

  // Payroll State
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [payrollLoading, setPayrollLoading] = useState(false);

  // New Modules State (75% Mark)
  const [reimbursements, setReimbursements] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [recruitment, setRecruitment] = useState<any[]>([]);
  const [training, setTraining] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [moduleLoading, setModuleLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const handleClockIn = async () => {
    setAttendanceLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/attendance/clock-in`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchAttendance();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleClockOut = async () => {
    setAttendanceLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/attendance/clock-out`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attendanceId })
      });
      if (res.ok) {
        await fetchAttendance();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const fetchLeaves = async () => {
    setLeaveLoading(true);
    try {
        const res = await fetch(`${apiUrl}/api/leave`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
            const data = await res.json();
            setLeaves(data);
        }
    } catch (e) { console.error(e); } finally { setLeaveLoading(false); }
  };

  const fetchPayrolls = async () => {
    setPayrollLoading(true);
    try {
        const res = await fetch(`${apiUrl}/api/payroll`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
            const data = await res.json();
            setPayrolls(data);
        }
    } catch (e) { console.error(e); } finally { setPayrollLoading(false); }
  };

  const fetchGenericModule = async (endpoint: string, setter: any) => {
      setModuleLoading(true);
      try {
          const res = await fetch(`${apiUrl}/api/${endpoint}`, { headers: { 'Authorization': `Bearer ${token}` } });
          if (res.ok) {
              const data = await res.json();
              setter(data);
          }
      } catch (e) { console.error(e); } finally { setModuleLoading(false); }
  };

  const fetchAttendance = async () => {
      try {
          const res = await fetch(`${apiUrl}/api/attendance/my-attendance`, { headers: { 'Authorization': `Bearer ${token}` } });
          if (res.ok) {
              const data = await res.json();
              
              const now = new Date();
              let completedToday = 0;
              let lmMs = 0;
              const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
              const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
              
              data.forEach((a: any) => {
                  const cin = parseUTCDate(a.clockInTime);
                  if (a.clockOutTime) {
                      const cout = parseUTCDate(a.clockOutTime);
                      const dur = cout.getTime() - cin.getTime();
                      if (cin >= startOfToday) completedToday += dur;
                      else if (cin >= startOfLastMonth && cin <= endOfLastMonth) lmMs += dur;
                  }
              });
              setCompletedTodayMs(completedToday);
              setLastMonthMs(lmMs);

              const active = data.find((a: any) => !a.clockOutTime);
              if (active) {
                  setClockStatus("Clocked In");
                  setAttendanceId(active.id);
                  setClockInTime(active.clockInTime);
                  setTotalLiveMs(completedToday + (Date.now() - parseUTCDate(active.clockInTime).getTime()));
              } else {
                  setClockStatus("Not Clocked In");
                  setAttendanceId(null);
                  setClockInTime(null);
                  setTotalLiveMs(completedToday);
              }
          }
      } catch (e) { console.error(e); }
  };

  useEffect(() => {
      let interval: NodeJS.Timeout;
      if (clockStatus === "Clocked In" && clockInTime) {
          interval = setInterval(() => {
              setTotalLiveMs(completedTodayMs + (Date.now() - parseUTCDate(clockInTime).getTime()));
          }, 1000);
      } else {
          setTotalLiveMs(completedTodayMs);
      }
      return () => clearInterval(interval);
  }, [clockStatus, clockInTime, completedTodayMs]);

  useEffect(() => {
      if (token) fetchAttendance();
  }, [token]);

  useEffect(() => {
      if (activeTab === 'leave') fetchLeaves();
      if (activeTab === 'payroll') fetchPayrolls();
      if (activeTab === 'reimbursement') fetchGenericModule('reimbursement', setReimbursements);
      if (activeTab === 'performance') fetchGenericModule('performancereview', setPerformance);
      if (activeTab === 'announcements') fetchGenericModule('announcement', setAnnouncements);
      if (activeTab === 'team') fetchGenericModule('team', setTeam);
      if (activeTab === 'recruitment') fetchGenericModule('jobposting', setRecruitment);
      if (activeTab === 'training') fetchGenericModule('trainingsession', setTraining);
      if (activeTab === 'contributions') fetchGenericModule('contribution', setContributions);
  }, [activeTab]);

  const handleCreateGenericRecord = async (endpoint: string, payload: any, setter: any) => {
      try {
          const res = await fetch(`${apiUrl}/api/${endpoint}`, { 
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (res.ok) {
              fetchGenericModule(endpoint, setter);
              alert('Record created successfully!');
          }
      } catch (e) { console.error(e); }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-deep text-white flex flex-col shadow-2xl z-10 hidden md:flex overflow-y-auto">
        <div className="p-6 border-b border-brand-indigo flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-lightblue flex items-center justify-center font-bold text-white shadow-lg">
            H
          </div>
          <span className="font-bold text-xl tracking-tight">HRMS Pro</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 text-sm">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'dashboard' ? 'bg-brand-indigo/50 text-white' : 'text-brand-lightmuted hover:bg-brand-indigo/30'}`}>
            📊 Dashboard
          </button>
          
          <div className="pt-4 pb-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">Employee Services</div>
          <button onClick={() => setActiveTab('leave')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'leave' ? 'bg-brand-indigo/50 text-white' : 'text-brand-lightmuted hover:bg-brand-indigo/30'}`}>
            🌴 Leave Mgt
          </button>
          <button onClick={() => setActiveTab('reimbursement')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'reimbursement' ? 'bg-brand-indigo/50 text-white' : 'text-brand-lightmuted hover:bg-brand-indigo/30'}`}>
            🧾 Reimbursements
          </button>
          <button onClick={() => setActiveTab('announcements')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'announcements' ? 'bg-brand-indigo/50 text-white' : 'text-brand-lightmuted hover:bg-brand-indigo/30'}`}>
            📢 Announcements
          </button>
          <button onClick={() => setActiveTab('training')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'training' ? 'bg-brand-indigo/50 text-white' : 'text-brand-lightmuted hover:bg-brand-indigo/30'}`}>
            📚 Training
          </button>
          <button onClick={() => setActiveTab('contributions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'contributions' ? 'bg-brand-indigo/50 text-white' : 'text-brand-lightmuted hover:bg-brand-indigo/30'}`}>
            🎁 Contributions
          </button>

          {/* Admin / Manager Only Links */}
          {/* HR & Admin Only Links */}
          {(user?.role === 'Admin' || user?.role === 'HR') && (
            <>
              <div className="pt-6 pb-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">HR Controls</div>
              <button onClick={() => setActiveTab('team')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'team' ? 'bg-brand-indigo/50 text-white' : 'text-brand-lightmuted hover:bg-brand-indigo/30'}`}>
                👥 Team Management
              </button>
              <button onClick={() => setActiveTab('recruitment')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'recruitment' ? 'bg-brand-indigo/50 text-white' : 'text-brand-lightmuted hover:bg-brand-indigo/30'}`}>
                🎯 Recruitment
              </button>
            </>
          )}

          {/* Admin Only Links */}
          {user?.role === 'Admin' && (
            <>
              <div className="pt-6 pb-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">Admin Controls</div>
              <button onClick={() => setActiveTab('payroll')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'payroll' ? 'bg-brand-indigo/50 text-white' : 'text-brand-lightmuted hover:bg-brand-indigo/30'}`}>
                💰 Payroll
              </button>
              <button onClick={() => setActiveTab('performance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'performance' ? 'bg-brand-indigo/50 text-white' : 'text-brand-lightmuted hover:bg-brand-indigo/30'}`}>
                ⭐ Performance
              </button>
            </>
          )}

          <div className="pt-6 pb-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">Coming Soon</div>
          {['Recognition', 'Analytics', 'HR Copilot'].map((mod, idx) => (
              <button key={idx} onClick={() => alert(`${mod} module UI is pending full implementation.`)} className="w-full flex items-center gap-3 px-4 py-3 text-brand-lightmuted hover:bg-brand-indigo/30 rounded-xl transition-colors font-medium opacity-50">
                  ⚙️ {mod}
              </button>
          ))}
        </nav>
        <div className="p-4 border-t border-brand-indigo">
          <button onClick={async () => { await logout(); router.push('/login'); }} className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-900/30 rounded-xl transition-colors font-medium">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50">
        {/* Header */}
        <header className="bg-white px-8 py-5 flex justify-between items-center shadow-sm sticky top-0 z-20">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your {activeTab} information.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-bold text-gray-800">{user?.name || 'User'}</p>
                    <p className="text-xs text-brand-blue font-semibold">{user?.role || 'Employee'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-lightblue to-brand-blue p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-brand-indigo">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>
        </header>

        <div className="p-8">
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Attendance Widget */}
                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 col-span-1 lg:col-span-2 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                        <h2 className="text-xl font-bold text-gray-800 relative z-10 flex items-center gap-2">⏱️ Time & Attendance</h2>
                        <div className="mt-8 flex flex-col sm:flex-row items-center gap-8 relative z-10">
                            <div className="flex-1 w-full">
                                <div className="text-sm font-medium text-gray-500 mb-2">Today's Progress</div>
                                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-lightblue mb-2">{clockStatus === "Clocked In" || totalLiveMs > 0 ? formatTime(totalLiveMs) : clockStatus}</div>
                                
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 overflow-hidden">
                                    <div className="bg-gradient-to-r from-brand-blue to-brand-lightblue h-2.5 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${Math.min((totalLiveMs / (8 * 3600000)) * 100, 100)}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>0h</span>
                                    <span>8h Target</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleClockIn} disabled={clockStatus === "Clocked In" || attendanceLoading} className="px-6 py-3 bg-brand-blue text-white rounded-xl font-medium shadow-lg shadow-brand-blue/20 hover:bg-brand-indigo hover:shadow-brand-blue/40 focus:ring-4 focus:ring-brand-lightmuted transition-all disabled:opacity-50 transform hover:-translate-y-0.5 whitespace-nowrap">Clock In</button>
                                <button onClick={handleClockOut} disabled={clockStatus !== "Clocked In" || attendanceLoading} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-500/40 focus:ring-4 focus:ring-orange-100 transition-all disabled:opacity-50 transform hover:-translate-y-0.5 whitespace-nowrap">Clock Out</button>
                            </div>
                        </div>
                    </div>
                    {/* Quick Stats */}
                    <div className="bg-gradient-to-br from-teal-900 to-gray-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <h2 className="text-lg font-medium text-white mb-6">Your Month at a Glance</h2>
                        <div className="space-y-6">
                            <div><div className="text-brand-lightmuted text-sm mb-1">Today's Hours</div><div className="text-4xl font-light">{Math.floor(totalLiveMs / 3600000)}<span className="text-xl text-brand-lightblue">h</span> {Math.floor((totalLiveMs % 3600000) / 60000).toString().padStart(2, '0')}<span className="text-xl text-brand-lightblue">m</span></div></div>
                            <div><div className="text-brand-lightmuted text-sm mb-1">Last Month's Hours</div><div className="text-2xl font-light">{Math.floor(lastMonthMs / 3600000)}<span className="text-sm text-brand-lightblue">h</span> {Math.floor((lastMonthMs % 3600000) / 60000).toString().padStart(2, '0')}<span className="text-sm text-brand-lightblue">m</span></div></div>
                            <div><div className="text-brand-lightmuted text-sm mb-1">Leave Balance</div><div className="text-2xl font-light">12 Days</div></div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'leave' && <GenericModule title="Leave Requests" endpoint="leave" data={leaves} setter={setLeaves} fields={[{key: 'leaveType', label: 'Type', type: 'select', options: ['Vacation', 'Sick', 'Personal', 'Maternity', 'Paternity']}, {key: 'startDate', label: 'Start Date', type: 'date'}, {key: 'endDate', label: 'End Date', type: 'date'}, {key: 'reason', label: 'Reason', type: 'text'}, {key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Accepted', 'Rejected'], hideInForm: true}]} token={token} fetchGenericModule={fetchGenericModule} apiUrl={apiUrl} />}
            {activeTab === 'payroll' && (
                <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Payslips & Payroll</h2>
                    {payrollLoading ? <p>Loading...</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {payrolls.length === 0 ? (
                                <p className="text-gray-500 col-span-2">No payroll records found.</p>
                            ) : (
                                payrolls.map((p, i) => (
                                    <div key={i} className="border border-gray-200 rounded-2xl p-6 hover:border-brand-muted transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{p.payPeriod}</h3>
                                                <p className="text-sm text-gray-500">Paid on {new Date(p.paymentDate).toLocaleDateString()}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">{p.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-2xl font-light text-brand-blue">
                                            ${p.netPay.toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'reimbursement' && <GenericModule title="Reimbursement" endpoint="reimbursement" data={reimbursements} setter={setReimbursements} fields={[{key: 'amount', label: 'Amount', type: 'number'}, {key: 'description', label: 'Description', type: 'text'}, {key: 'receiptUrl', label: 'Receipt URL', type: 'text'}, {key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'], hideInForm: true}]} token={token} fetchGenericModule={fetchGenericModule} apiUrl={apiUrl} />}
            {activeTab === 'performance' && <GenericModule title="Performance Reviews" endpoint="performancereview" data={performance} setter={setPerformance} fields={[{key: 'employeeId', label: 'Employee ID', type: 'text', defaultValue: user?.id}, {key: 'reviewerId', label: 'Reviewer ID', type: 'text'}, {key: 'score', label: 'Score (1-10)', type: 'number'}, {key: 'comments', label: 'Comments', type: 'text'}, {key: 'reviewDate', label: 'Review Date', type: 'date'}]} token={token} fetchGenericModule={fetchGenericModule} apiUrl={apiUrl} />}
            {activeTab === 'announcements' && <GenericModule title="Announcements" endpoint="announcement" data={announcements} setter={setAnnouncements} fields={[{key: 'title', label: 'Title', type: 'text'}, {key: 'message', label: 'Message', type: 'text'}, {key: 'targetAudience', label: 'Target Audience', type: 'select', options: ['All', 'Engineering', 'Sales', 'HR']}, {key: 'datePosted', label: 'Date Posted', type: 'date'}]} token={token} fetchGenericModule={fetchGenericModule} apiUrl={apiUrl} />}
            {activeTab === 'team' && <GenericModule title="Team Management" endpoint="team" data={team} setter={setTeam} fields={[{key: 'name', label: 'Team Name', type: 'text'}, {key: 'managerId', label: 'Manager ID', type: 'text', defaultValue: user?.id}, {key: 'department', label: 'Department', type: 'select', options: ['Engineering', 'Sales', 'HR', 'Marketing']}]} token={token} fetchGenericModule={fetchGenericModule} apiUrl={apiUrl} />}
            {activeTab === 'recruitment' && <GenericModule title="Job Postings" endpoint="jobposting" data={recruitment} setter={setRecruitment} fields={[{key: 'jobTitle', label: 'Job Title', type: 'text'}, {key: 'department', label: 'Department', type: 'select', options: ['Engineering', 'Sales', 'HR', 'Marketing']}, {key: 'description', label: 'Description', type: 'text'}, {key: 'location', label: 'Location', type: 'text'}, {key: 'status', label: 'Status', type: 'select', options: ['Open', 'Closed', 'Draft']}, {key: 'datePosted', label: 'Date Posted', type: 'date'}]} token={token} fetchGenericModule={fetchGenericModule} apiUrl={apiUrl} />}
            {activeTab === 'training' && <GenericModule title="Training Sessions" endpoint="trainingsession" data={training} setter={setTraining} fields={[{key: 'title', label: 'Title', type: 'text'}, {key: 'description', label: 'Description', type: 'text'}, {key: 'instructor', label: 'Instructor', type: 'text'}, {key: 'capacity', label: 'Capacity', type: 'number'}, {key: 'scheduledDate', label: 'Scheduled Date', type: 'date'}]} token={token} fetchGenericModule={fetchGenericModule} apiUrl={apiUrl} />}
            {activeTab === 'contributions' && <GenericModule title="Contributions" endpoint="contribution" data={contributions} setter={setContributions} fields={[{key: 'userId', label: 'User ID', type: 'text', defaultValue: user?.id}, {key: 'contributionType', label: 'Type', type: 'select', options: ['401k', 'Health Insurance', 'HSA']}, {key: 'employeeAmount', label: 'Employee Amount', type: 'number'}, {key: 'employerAmount', label: 'Employer Match', type: 'number'}, {key: 'month', label: 'Month', type: 'text'}]} token={token} fetchGenericModule={fetchGenericModule} apiUrl={apiUrl} />}
        </div>
      </main>
    </div>
  );
}
