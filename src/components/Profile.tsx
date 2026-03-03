import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ProfileProps = {
  email: string;
  initialName: string;
  loading: boolean;
  onSave: (name: string) => Promise<void>;
};

export function Profile({ email, initialName, loading, onSave }: ProfileProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (name.trim().length < 2) {
      setLocalError(t('validationName'));
      return;
    }

    await onSave(name.trim());
  };

  return (
    <section className="card profile-card">
      <h2>{t('profileTitle')}</h2>
      <p className="muted">{t('profileSubtitle')}</p>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          {t('name')}
          <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
        </label>
        <label>
          {t('email')}
          <input value={email} disabled readOnly />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? t('loading') : t('saveProfile')}
        </button>
      </form>

      {localError && <p className="error">{localError}</p>}
    </section>
  );
}
