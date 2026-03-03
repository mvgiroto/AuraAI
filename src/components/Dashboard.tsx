import { FormEvent, useMemo, useState } from 'react';

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

type VisualTab =
  | 'General'
  | 'Input'
  | 'Action Buttons'
  | 'Messages'
  | 'Human Form'
  | 'Leads Form'
  | 'Custom Brand';

const TABS: VisualTab[] = [
  'General',
  'Input',
  'Action Buttons',
  'Messages',
  'Human Form',
  'Leads Form',
  'Custom Brand',
];

const QUICK_MESSAGES = [
  { from: 'bot', text: 'How can we help you today?', time: '22/02/2024, 5:10 PM' },
  { from: 'user', text: 'How can I help you today?', time: '28/2/2024, 6:00 PM' },
  { from: 'bot', text: 'Description about analytics.', time: '2/8/2024, 6:01 PM' },
  { from: 'user', text: 'Is there anything else I can help you with?', time: '2/8/2024, 6:20 PM' },
  { from: 'bot', text: 'Description about social media.', time: '2/8/2024, 6:30 PM' },
] as const;

const THEME_COLORS = ['#3b82f6', '#ea580c', '#14b8a6', '#8b5cf6', '#0f172a'] as const;

export function Dashboard({ name, onLogout, onAnalyze, insights, loading, error, info }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<VisualTab>('General');
  const [message, setMessage] = useState('');

  const [displayName, setDisplayName] = useState('Gali Bot');
  const [avatarLabel, setAvatarLabel] = useState('Choose File');
  const [chatbotOpened, setChatbotOpened] = useState(false);
  const [themeMode, setThemeMode] = useState<'Light Mode' | 'Dark Mode'>('Light Mode');
  const [brandColor, setBrandColor] = useState<string>(THEME_COLORS[0]);

  const [inputPlaceholder, setInputPlaceholder] = useState('Ask me anything...');
  const [inputEnabled, setInputEnabled] = useState(true);

  const [showHumanHelp, setShowHumanHelp] = useState(true);
  const [showFinishConversation, setShowFinishConversation] = useState(true);

  const [botBubbleColor, setBotBubbleColor] = useState('#ececec');
  const [userBubbleColor, setUserBubbleColor] = useState(brandColor);

  const [humanFormTitle, setHumanFormTitle] = useState('Need a human specialist?');
  const [humanFormDescription, setHumanFormDescription] = useState('Leave your contact and our team will assist you.');

  const [leadCaptureEnabled, setLeadCaptureEnabled] = useState(true);
  const [leadLabel, setLeadLabel] = useState('Capture lead after conversation');

  const [brandFooter, setBrandFooter] = useState('Powered by Gali Chat');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim().length < 12) return;
    await onAnalyze(message.trim());
    setMessage('');
  };

  const previewMessages = useMemo(
    () =>
      QUICK_MESSAGES.map((item) => ({
        ...item,
        bubbleColor: item.from === 'user' ? userBubbleColor : botBubbleColor,
      })),
    [botBubbleColor, userBubbleColor],
  );

  const renderTabContent = () => {
    if (activeTab === 'General') {
      return (
        <>
          <div className="field-block">
            <strong>Chatbot Display Name</strong>
            <p className="muted">This name is seen by those who interact with your chat (e.g. customers)</p>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </div>

          <div className="field-block">
            <strong>Chatbot Profile Avatar</strong>
            <p className="muted">Personalize your Chatbot with a custom profile picture (formats: .jpg, .png)</p>
            <input value={avatarLabel} onChange={(event) => setAvatarLabel(event.target.value)} />
            <button className="small-outline" type="button">Upload Photo</button>
          </div>

          <div className="field-block">
            <strong>Chatbot Opened</strong>
            <p className="muted">When you turn on this feature, the chatbot will open directly on your website.</p>
            <button
              type="button"
              className={`toggle-pill ${chatbotOpened ? 'toggle-pill-on' : ''}`}
              onClick={() => setChatbotOpened((state) => !state)}
              aria-label="Toggle chatbot opened"
            />
          </div>
        </>
      );
    }

    if (activeTab === 'Input') {
      return (
        <>
          <div className="field-block">
            <strong>Input Placeholder</strong>
            <p className="muted">Customize the placeholder text in the chat input field.</p>
            <input value={inputPlaceholder} onChange={(event) => setInputPlaceholder(event.target.value)} />
          </div>
          <div className="field-block inline-toggle-row">
            <strong>Enable input field</strong>
            <button
              type="button"
              className={`toggle-pill ${inputEnabled ? 'toggle-pill-on' : ''}`}
              onClick={() => setInputEnabled((state) => !state)}
              aria-label="Toggle input enabled"
            />
          </div>
        </>
      );
    }

    if (activeTab === 'Action Buttons') {
      return (
        <>
          <div className="field-block inline-toggle-row">
            <strong>Show Human Help button</strong>
            <button
              type="button"
              className={`toggle-pill ${showHumanHelp ? 'toggle-pill-on' : ''}`}
              onClick={() => setShowHumanHelp((state) => !state)}
              aria-label="Toggle human help button"
            />
          </div>
          <div className="field-block inline-toggle-row">
            <strong>Show Finish Conversation button</strong>
            <button
              type="button"
              className={`toggle-pill ${showFinishConversation ? 'toggle-pill-on' : ''}`}
              onClick={() => setShowFinishConversation((state) => !state)}
              aria-label="Toggle finish conversation button"
            />
          </div>
        </>
      );
    }

    if (activeTab === 'Messages') {
      return (
        <>
          <div className="field-block">
            <strong>Chatbot Colors</strong>
            <p className="muted">Choose the message background color.</p>
            <select value={themeMode} onChange={(event) => setThemeMode(event.target.value as 'Light Mode' | 'Dark Mode')}>
              <option>Light Mode</option>
              <option>Dark Mode</option>
            </select>
          </div>
          <div className="field-block">
            <p className="muted">Brand color and user message color.</p>
            <div className="color-block" style={{ background: brandColor }}>{brandColor}</div>
            <div className="color-palette">
              {THEME_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`swatch ${brandColor === color ? 'swatch-active' : ''}`}
                  style={{ background: color }}
                  onClick={() => {
                    setBrandColor(color);
                    setUserBubbleColor(color);
                  }}
                  aria-label={`Set color ${color}`}
                />
              ))}
            </div>
          </div>
          <div className="field-block">
            <strong>Bot bubble color</strong>
            <input value={botBubbleColor} onChange={(event) => setBotBubbleColor(event.target.value)} />
          </div>
        </>
      );
    }

    if (activeTab === 'Human Form') {
      return (
        <>
          <div className="field-block">
            <strong>Human form title</strong>
            <input value={humanFormTitle} onChange={(event) => setHumanFormTitle(event.target.value)} />
          </div>
          <div className="field-block">
            <strong>Human form description</strong>
            <textarea value={humanFormDescription} onChange={(event) => setHumanFormDescription(event.target.value)} />
          </div>
        </>
      );
    }

    if (activeTab === 'Leads Form') {
      return (
        <>
          <div className="field-block inline-toggle-row">
            <strong>{leadLabel}</strong>
            <button
              type="button"
              className={`toggle-pill ${leadCaptureEnabled ? 'toggle-pill-on' : ''}`}
              onClick={() => setLeadCaptureEnabled((state) => !state)}
              aria-label="Toggle lead capture"
            />
          </div>
          <div className="field-block">
            <strong>Recent insights (lead context)</strong>
            <p className="muted">The last three analyzed messages are shown below.</p>
            <ul className="mini-list">
              {insights.slice(0, 3).map((item) => (
                <li key={item.id}>{item.message}</li>
              ))}
              {insights.length === 0 && <li>No insights generated yet.</li>}
            </ul>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="field-block">
          <strong>Custom brand footer</strong>
          <input value={brandFooter} onChange={(event) => setBrandFooter(event.target.value)} />
        </div>
      </>
    );
  };

  return (
    <section className={`visual-look-shell ${themeMode === 'Dark Mode' ? 'shell-dark' : ''}`}>
      <div className="visual-look-panel">
        <h2>Visual Look</h2>
        <p className="muted">Customize the appearance and design of your Chatbot.</p>

        <div className="tabs-row">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-item ${activeTab === tab ? 'tab-item-active' : ''}`}
              type="button"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="visual-grid">
          <div className="settings-column">
            {renderTabContent()}

            <form className="hidden-analyze" onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type at least 12 chars to generate AI insight"
                minLength={12}
              />
              <button type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Generate insight'}</button>
              <button type="button" onClick={() => void onLogout()} className="small-outline">Logout ({name})</button>
            </form>

            {(error || info) && <p className={error ? 'error' : 'info'}>{error ?? info}</p>}
          </div>

          <aside className="chat-preview">
            <div className="preview-header">
              <div className="avatar">G</div>
              <span>{displayName || 'Gali Bot'}</span>
              <span className="chevron">⌄</span>
            </div>
            <div className="preview-body">
              {previewMessages.map((item) => (
                <div key={`${item.text}-${item.time}`} className={`bubble-wrap ${item.from === 'user' ? 'user' : 'bot'}`}>
                  <div className="bubble" style={{ background: item.bubbleColor }}>{item.text}</div>
                  <small>{item.time}</small>
                </div>
              ))}

              {(showHumanHelp || showFinishConversation) && (
                <div className="bottom-actions">
                  {showHumanHelp && <button type="button">Human Help</button>}
                  {showFinishConversation && <button type="button">Finish Conversation</button>}
                </div>
              )}

              <div className="human-form-preview">
                <strong>{humanFormTitle}</strong>
                <p>{humanFormDescription}</p>
              </div>

              <div className="chat-input-row">
                <input value={inputPlaceholder} readOnly disabled={!inputEnabled} />
                <div className="send-btn" style={{ background: brandColor }}>↑</div>
              </div>
            </div>
            <div className="preview-footer">{brandFooter}</div>
            {!leadCaptureEnabled && <div className="lead-off-note">Lead capture disabled</div>}
            {chatbotOpened && <div className="opened-pill">Opens by default</div>}
          </aside>
        </div>
      </div>
    </section>
  );
}
