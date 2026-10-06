import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Sparkles, Activity, Image, Mic, FileText, AlertCircle, CheckCircle, Users, TrendingUp } from 'lucide-react';

interface UsageStat {
  total: number;
  successful: number;
  failed: number;
  textRequests: number;
  imageRequests: number;
  voiceRequests: number;
  activeUsers: number;
}

interface RecentUsage {
  id: string;
  user_id: string;
  request_type: string;
  model_used: string;
  success: boolean;
  tokens_input: number;
  tokens_output: number;
  latency_ms: number;
  created_at: string;
  error_message?: string;
}

export const AdminAIUsagePage: React.FC = () => {
  const [stats, setStats] = useState<UsageStat | null>(null);
  const [recent, setRecent] = useState<RecentUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        setStats({ total: 0, successful: 0, failed: 0, textRequests: 0, imageRequests: 0, voiceRequests: 0, activeUsers: 0 });
        setLoading(false);
        return;
      }

      const { data: usageData } = await supabase
        .from('ai_usage')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (usageData) {
        const rows = usageData as any[];
        const uniqueUsers = new Set(rows.map(r => r.user_id)).size;
        setStats({
          total: rows.length,
          successful: rows.filter(r => r.success).length,
          failed: rows.filter(r => !r.success).length,
          textRequests: rows.filter(r => r.request_type === 'text').length,
          imageRequests: rows.filter(r => r.request_type === 'image').length,
          voiceRequests: rows.filter(r => r.request_type === 'voice').length,
          activeUsers: uniqueUsers,
        });
        setRecent(rows.slice(0, 20) as RecentUsage[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#173F35] to-[#2E6B57] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#C99A3D]" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#173F35]">AI Doubt Buddy — Usage</h1>
          <p className="text-sm text-stone-500">Monitor AI usage, performance, and student activity</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-stone-400">Loading AI usage data…</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Requests', value: stats?.total ?? 0, icon: Activity, color: 'text-[#173F35] bg-[#F0F5F3]' },
              { label: 'Active Students', value: stats?.activeUsers ?? 0, icon: Users, color: 'text-[#2E6B57] bg-green-50' },
              { label: 'Image Questions', value: stats?.imageRequests ?? 0, icon: Image, color: 'text-blue-700 bg-blue-50' },
              { label: 'Voice Questions', value: stats?.voiceRequests ?? 0, icon: Mic, color: 'text-purple-700 bg-purple-50' },
            ].map(stat => (
              <Card key={stat.label} variant="paper" className="p-4 border-[#EDE6D8]">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-[#173F35]">{stat.value}</p>
                <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Success Rate */}
          <Card variant="paper" className="p-6 border-[#EDE6D8]">
            <h3 className="text-base font-serif font-bold text-[#173F35] mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2E6B57]" /> Request Success Rate
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-stone-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[#2E6B57] to-[#C99A3D] h-3 rounded-full transition-all"
                  style={{ width: `${stats && stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(0) : 0}%` }}
                />
              </div>
              <span className="text-sm font-bold text-[#173F35]">
                {stats && stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex gap-6 mt-3 text-xs text-stone-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" />{stats?.successful ?? 0} Successful</span>
              <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-red-500" />{stats?.failed ?? 0} Failed</span>
            </div>
          </Card>

          {/* Recent Requests Table */}
          <Card variant="paper" className="border-[#EDE6D8] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#EDE6D8]">
              <h3 className="text-base font-serif font-bold text-[#173F35]">Recent AI Requests</h3>
            </div>
            <div className="overflow-x-auto">
              {recent.length === 0 ? (
                <p className="text-center py-12 text-stone-400 text-sm">No AI usage records yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-[#F7F3EA] border-b border-[#EDE6D8]">
                    <tr>
                      {['Type', 'Model', 'Tokens In', 'Tokens Out', 'Latency', 'Status', 'Time'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#173F35]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE0]">
                    {recent.map(row => (
                      <tr key={row.id} className="hover:bg-[#FAFAF8]">
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                            row.request_type === 'image' ? 'bg-blue-50 text-blue-700' :
                            row.request_type === 'voice' ? 'bg-purple-50 text-purple-700' :
                            'bg-stone-100 text-stone-600'
                          }`}>
                            {row.request_type === 'image' && <Image className="w-3 h-3" />}
                            {row.request_type === 'voice' && <Mic className="w-3 h-3" />}
                            {row.request_type === 'document' && <FileText className="w-3 h-3" />}
                            {row.request_type}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-stone-600 font-mono">{row.model_used || '—'}</td>
                        <td className="px-4 py-2.5 text-xs text-stone-600">{row.tokens_input ?? '—'}</td>
                        <td className="px-4 py-2.5 text-xs text-stone-600">{row.tokens_output ?? '—'}</td>
                        <td className="px-4 py-2.5 text-xs text-stone-600">{row.latency_ms ? `${row.latency_ms}ms` : '—'}</td>
                        <td className="px-4 py-2.5">
                          {row.success
                            ? <CheckCircle className="w-4 h-4 text-green-500" />
                            : <span title={row.error_message || 'Error'}><AlertCircle className="w-4 h-4 text-red-500" /></span>
                          }
                        </td>
                        <td className="px-4 py-2.5 text-xs text-stone-500">
                          {new Date(row.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
