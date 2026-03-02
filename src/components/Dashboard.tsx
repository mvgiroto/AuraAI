import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type Insight = {
  id: string;
  created_at: string;
  message: string;
  suggestion: string;
};

type DashboardProps = {
  name: string;
  onLogout: () => Promise<void>;
  onAnalyze: (message: string) => Promise<void>;
  insights: Insight[];
  loading: boolean;
  error: string | null;
  info: string | null;
};

export function Dashboard({
  name,
  onLogout,
  onAnalyze,
  insights,
  loading,
  error,
  info,
}: DashboardProps) {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (message.trim().length < 12) {
      setLocalError(t('validationMessage'));
      return;
    }

    await onAnalyze(message.trim());
    setMessage('');
  };

  return (
    <section className="card">
      <div className="header-row">
        <div>
          <h2>{t('dashboardGreeting', { name })}</h2>
          <p className="muted">{t('dashboardIntro')}</p>
        </div>
        <button onClick={() => void onLogout()}>{t('logout')}</button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          {t('messageLabel')}
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={t('messagePlaceholder')}
            minLength={12}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? t('analyzing') : t('analyze')}
        </button>
      </form>

      {(localError || error) && <p className="error">{localError ?? error}</p>}
      {info && <p className="info">{info}</p>}

      <div className="insights-list">
        <h3>{t('insights')}</h3>

        {insights.length === 0 && <p className="muted">{t('noHistory')}</p>}

        {insights.map((item) => (
          <article key={item.id} className="insight-item">
            <small>
              {t('insightDate')}: {new Date(item.created_at).toLocaleString(i18n.language)}
            </small>
            <p>{item.message}</p>
            <strong>{t('suggestionTitle')}:</strong>
            <p>{item.suggestion}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
