import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

type AuthFormProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  info: string | null;
};

export function AuthForm({ onLogin, onSignup, loading, error, info }: AuthFormProps) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (isLogin) {
      await onLogin(email.trim(), password);
      return;
    }

    if (name.trim().length < 2) {
      setLocalError(t('validationName'));
      return;
    }

    if (password !== confirmPassword) {
      setLocalError(t('validationPasswordMatch'));
      return;
    }

    await onSignup(name.trim(), email.trim(), password);
  };

  return (
    <section className="card auth-card">
      <h2>{t('authTitle')}</h2>
      <p className="muted">{t('authSubtitle')}</p>

      <form onSubmit={handleSubmit} className="form">
        {!isLogin && (
          <label>
            {t('name')}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </label>
        )}
        <label>
          {t('email')}
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          {t('password')}
          <input
            type="password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
          />
        </label>

        {!isLogin && (
          <label>
            {t('confirmPassword')}
            <input
              type="password"
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
        )}

        <button type="submit" disabled={loading}>
          {loading ? t('loading') : isLogin ? t('login') : t('signup')}
        </button>
      </form>

      <button className="link-button" onClick={() => setIsLogin((state) => !state)}>
        {isLogin ? t('noAccount') : t('alreadyAccount')}
      </button>

      {(localError || error) && <p className="error">{localError ?? error}</p>}
      {info && <p className="info">{info}</p>}
    </section>
  );
}
