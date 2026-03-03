import { useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import { AuthForm } from './components/AuthForm';
import { Dashboard, Insight } from './components/Dashboard';
import { supabase } from './lib/supabase';

const EDGE_FUNCTION_NAME = 'relationship-advice';

function generateFallbackSuggestion(message: string, language: string): string {
  const lower = message.toLowerCase();
  const isEnglish = language.startsWith('en');

  if (lower.includes('briga') || lower.includes('argue') || lower.includes('fight')) {
    return isEnglish
      ? 'Use a 20-minute pause rule during conflict and restart with active listening.'
      : 'Façam um combinado de pausa de 20 minutos durante conflitos e retomem com escuta ativa.';
  }

  if (lower.includes('ciúme') || lower.includes('jealous')) {
    return isEnglish
      ? 'Define clear boundaries and discuss which attitudes increase emotional safety.'
      : 'Definam limites claros e conversem sobre quais atitudes geram segurança emocional.';
  }

  return isEnglish
    ? 'Schedule 15 minutes daily for phone-free dialogue focused on feelings and needs.'
    : 'Reservem 15 minutos por dia para diálogo sem celular, focado em sentimentos e necessidades.';
}

type ProfileData = {
  name: string;
  email?: string;
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
    };

    void init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('auraai-lang', i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user) {
        setProfile(null);
        setInsights([]);
        return;
      }

      setError(null);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        setError(t('profileError'));
      } else {
        setProfile(profileData);
      }

      const { data: insightRows, error: insightError } = await supabase
        .from('relationship_insights')
        .select('id, created_at, message, suggestion')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (insightError) {
        setError(t('saveError'));
      }
      setInsights(insightRows ?? []);
    };

    void loadData();
  }, [session, t]);

  const userName = useMemo(() => profile?.name ?? session?.user.email ?? 'User', [profile, session]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setInfo(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(t('authError'));
    }

    setLoading(false);
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    setInfo(null);

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (signupError) {
      setError(t('authError'));
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileSaveError } = await supabase.from('profiles').upsert({ id: data.user.id, name, email });

      if (profileSaveError) {
        setError(t('profileSaveError'));
      }
    }

    setInfo(t('successSignup'));
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getSuggestion = async (message: string): Promise<{ suggestion: string; fallback: boolean }> => {
    const { data, error: functionError } = await supabase.functions.invoke(EDGE_FUNCTION_NAME, {
      body: {
        message,
        locale: i18n.language,
      },
    });

    const edgeSuggestion = data && typeof data === 'object' ? (data as { suggestion?: string; error?: string }).suggestion : undefined;

    if (!functionError && edgeSuggestion) {
      return { suggestion: String(edgeSuggestion), fallback: false };
    }

    return {
      suggestion: generateFallbackSuggestion(message, i18n.language),
      fallback: true,
    };
  };

  const handleAnalyze = async (message: string) => {
    if (!session?.user) return;

    setLoading(true);
    setError(null);
    setInfo(null);

    const { suggestion, fallback } = await getSuggestion(message);

    const { data, error: saveError } = await supabase
      .from('relationship_insights')
      .insert({
        user_id: session.user.id,
        message,
        suggestion,
      })
      .select('id, created_at, message, suggestion')
      .single();

    if (saveError) {
      setError(t('saveError'));
    } else if (data) {
      setInsights((current) => [data, ...current]);
      if (fallback) {
        setInfo(t('usingFallbackAi'));
      }
    }

    setLoading(false);
  };

  return (
    <main className="layout">
      <header className="app-topbar">
        <div className="brand-left">
          <div className="brand-icon">G</div>
          <strong>GaliChat</strong>
        </div>
        <nav>
          <span>💬 My Chatbots</span>
          <span>★ Become a partner</span>
          <span>◉ Billing</span>
          <span>◉ Account</span>
        </nav>
      </header>

      <aside className="left-sidebar">
        <button className="side-link" type="button">My Chatbots</button>
        <button className="side-link" type="button">View Chatbot</button>
        <button className="side-link" type="button">Analytics</button>
        <button className="side-link" type="button">Messages</button>
        <button className="side-link" type="button">Leads</button>
        <hr />
        <button className="side-link" type="button">Training sources</button>
        <button className="side-link side-link-active" type="button">Visual Look</button>
        <button className="side-link" type="button">Embeded on site</button>
        <button className="side-link" type="button">Add-ons</button>
        <button className="side-link" type="button">Settings</button>
        <hr />
        <button className="side-link" type="button">Integrations - soon</button>
      </aside>

      <section className="main-content">
        {!session ? (
          <div className="content-card">
            <AuthForm onLogin={handleLogin} onSignup={handleSignup} loading={loading} error={error} info={info} />
          </div>
        ) : (
          <Dashboard
            name={userName}
            onLogout={handleLogout}
            onAnalyze={handleAnalyze}
            insights={insights}
            loading={loading}
            error={error}
            info={info}
          />
        )}
      </section>
    </main>
  );
}
