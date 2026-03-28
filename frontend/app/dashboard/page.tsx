'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { taskApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

type Status = 'To Do' | 'In Progress' | 'Done';
type Priority = 'low' | 'medium' | 'high';

interface Task {
  _id: string; title: string; description: string; status: Status; priority: Priority;
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | Status>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'To Do', priority: 'medium' });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await taskApi.getAll();
      setTasks(res.data.data.tasks);
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to fetch workspace tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth/login'); return; }
    if (user) fetchTasks();
  }, [user, authLoading, router, fetchTasks]);

  const handleLogout = () => { logout(); router.push('/'); };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskApi.update(editingTask._id, form);
      } else {
        await taskApi.create(form);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      setForm({ title: '', description: '', status: 'To Do', priority: 'medium' });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to save task.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskApi.delete(id);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to delete task.');
    }
  };

  const openNewTask = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', status: 'To Do', priority: 'medium' });
    setIsModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description, status: task.status, priority: task.priority });
    setIsModalOpen(true);
  };

  const getStatusColor = (status: Status) => {
    if (status === 'To Do') return '#ef4444'; // red
    if (status === 'In Progress') return '#eab308'; // yellow
    return '#3b82f6'; // blue
  };

  const getStatusBadge = (status: Status) => {
    if (status === 'Done') return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#166534] text-green-100">Done</span>;
    if (status === 'In Progress') return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#5b21b6] text-purple-100">In Progress</span>;
    return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#374151] text-gray-300">To Do</span>;
  };

  const getPriorityBadge = (priority: Priority) => {
    if (priority === 'high') return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border border-red-900 bg-red-950/30 text-red-500">high</span>;
    if (priority === 'medium') return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border border-yellow-900 bg-yellow-950/30 text-yellow-500">medium</span>;
    return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border border-blue-900 bg-blue-950/30 text-blue-500">low</span>;
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-white"><LoadingSpinner size="lg" /></div>;
  }

  const filtered = activeTab === 'All' ? tasks : tasks.filter(t => t.status === activeTab);
  const doneCount = tasks.filter(t => t.status === 'Done').length;

  return (
    <div className="min-h-screen text-white pt-6 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" /></svg>
          </div>

        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/ai-tools" className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <span className="text-purple-500">✦</span> AI Chat <span className="text-gray-500 ml-1">Assistant</span>
          </Link>
          <button onClick={handleLogout} className="antigravity-btn px-4 py-2 text-sm font-medium">Sign out</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Workspace Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Workspace</h1>
          <p className="text-gray-500 italic text-sm">{doneCount} of {tasks.length} tasks completed.</p>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Tabs Row */}
        <div className="flex flex-wrap flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            {(['All', 'To Do', 'In Progress', 'Done'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab
                    ? 'border border-gray-500 bg-white/5 text-white'
                    : 'border border-[#27272a] bg-[#121216] text-gray-400 hover:bg-[#1a1a24]'
                  }`}
              >
                {tab} <span className="text-gray-500 ml-1">({tab === 'All' ? tasks.length : tasks.filter(t => t.status === tab).length})</span>
              </button>
            ))}
          </div>
          <button onClick={openNewTask} className="px-4 py-2 rounded-xl text-sm font-medium border border-[#27272a] bg-[#1a1a24] text-white hover:bg-[#27272a] transition-colors">
            + New task
          </button>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm py-10 w-full col-span-2 text-center">No tasks found in this view.</p>
          ) : filtered.map(task => (
            <div key={task._id} className="bg-[#121216] border border-[#27272a] rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 rounded-r-md" style={{ background: getStatusColor(task.status) }} />

              <div className="ml-3">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-100">{task.title}</h3>
                  <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditTask(task)} className="w-8 h-8 rounded-lg border border-[#27272a] bg-[#1a1a24] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="w-8 h-8 rounded-lg border border-[#27272a] bg-[#1a1a24] flex items-center justify-center text-red-500 hover:border-red-500/50 hover:bg-red-950/20 transition-colors">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mb-6 pb-2 border-b border-[#27272a]/50 border-dashed">{task.description || 'No description provided.'}</p>

                <div className="flex items-center gap-2">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSaveTask} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title</label>
                <input required autoFocus type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="antigravity-input w-full py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="antigravity-input w-full py-2.5 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="antigravity-input w-full py-2.5 text-sm appearance-none cursor-pointer">
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="antigravity-input w-full py-2.5 text-sm appearance-none cursor-pointer">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="antigravity-btn flex-1 py-2.5 text-sm">Cancel</button>
                <button type="submit" className="antigravity-btn antigravity-btn-primary flex-1 py-2.5 text-sm">{editingTask ? 'Save Changes' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
