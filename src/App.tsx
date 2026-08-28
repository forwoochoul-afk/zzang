import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Registration {
  id: string;
  name: string;
  phone: string;
  created_at: string;
}

function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    setLoadingList(true);
    const { data, error } = await supabase
      .from('event_registrations')
      .select('id, name, phone, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      setMessage({ type: 'error', text: '신청 목록을 불러오지 못했습니다.' });
    } else {
      setRegistrations(data ?? []);
    }
    setLoadingList(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setMessage({ type: 'error', text: '이름과 전화번호를 모두 입력해주세요.' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    const { error } = await supabase
      .from('event_registrations')
      .insert({ name: name.trim(), phone: phone.trim() });
    setSubmitting(false);
    if (error) {
      setMessage({ type: 'error', text: '신청 중 오류가 발생했습니다. 다시 시도해주세요.' });
      return;
    }
    setMessage({ type: 'success', text: '신청이 완료되었습니다!' });
    setName('');
    setPhone('');
    fetchRegistrations();
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">이벤트 신청서</h1>
          <p className="text-sm text-gray-500 mt-1">아래 정보를 입력하고 신청해주세요.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full border border-gray-400 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-0 placeholder:text-gray-300"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-2">
              전화번호
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full border border-gray-400 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-0 placeholder:text-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white font-semibold py-3 rounded-none hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '신청 중...' : '신청하기'}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`mt-6 px-4 py-3 rounded-none text-sm font-medium ${
              message.type === 'success'
                ? 'border-2 border-black bg-gray-100 text-black'
                : 'border-2 border-black bg-black text-white'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Registration list */}
        <div className="mt-10 border-t-2 border-black pt-6">
          <h2 className="text-sm font-bold mb-4">신청 현황 ({registrations.length}명)</h2>
          {loadingList ? (
            <p className="text-sm text-gray-400">불러오는 중...</p>
          ) : registrations.length === 0 ? (
            <p className="text-sm text-gray-400">아직 신청자가 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {registrations.map((reg) => (
                <li
                  key={reg.id}
                  className="flex justify-between items-center border border-gray-300 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{reg.name}</span>
                  <span className="text-gray-500">{reg.phone}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
