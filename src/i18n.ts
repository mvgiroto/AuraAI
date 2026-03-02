import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: 'AuraAI Relationship Coach',
      subtitle:
        'A private AI space to improve communication, empathy and emotional connection in your relationship.',
      switchLanguage: 'Language',
      authTitle: 'Welcome back',
      authSubtitle: 'Sign in or create your account to save your relationship insights.',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      confirmPassword: 'Confirm password',
      login: 'Login',
      signup: 'Create account',
      logout: 'Logout',
      loading: 'Loading...',
      analyzing: 'Analyzing...',
      alreadyAccount: 'Already have an account? Login',
      noAccount: "Don't have an account yet? Sign up",
      dashboardGreeting: 'Hi, {{name}} 👋',
      dashboardIntro:
        'Describe your current challenge. AuraAI returns practical suggestions focused on healthy dialogue.',
      messageLabel: 'Relationship context',
      messagePlaceholder:
        'Example: We get distant after work and conversations often turn into arguments...',
      analyze: 'Generate suggestion',
      noHistory: 'No insights yet. Send your first message to begin.',
      insights: 'Your latest insights',
      authError: 'Could not authenticate. Please review your credentials.',
      saveError: 'Could not save your insight right now.',
      profileError: 'Could not load your profile.',
      profileSaveError: 'Account was created but profile could not be saved.',
      successSignup: 'Account created! Check your inbox to confirm your email.',
      suggestionTitle: 'Suggested action',
      validationName: 'Name must have at least 2 characters.',
      validationPasswordMatch: 'Passwords do not match.',
      validationMessage: 'Please write at least 12 characters to analyze.',
      hintPrivacy: 'Your data is private and protected with Supabase Row Level Security.',
      usingFallbackAi: 'Using local AI fallback (configure Edge Function for advanced analysis).',
      insightDate: 'Created at',
    },
  },
  pt: {
    translation: {
      appTitle: 'AuraAI Coach de Relacionamento',
      subtitle:
        'Um espaço privado com IA para melhorar comunicação, empatia e conexão emocional no relacionamento.',
      switchLanguage: 'Idioma',
      authTitle: 'Bem-vindo(a)',
      authSubtitle: 'Entre ou crie sua conta para salvar seus insights de relacionamento.',
      email: 'E-mail',
      password: 'Senha',
      name: 'Nome',
      confirmPassword: 'Confirmar senha',
      login: 'Entrar',
      signup: 'Criar conta',
      logout: 'Sair',
      loading: 'Carregando...',
      analyzing: 'Analisando...',
      alreadyAccount: 'Já tem uma conta? Entrar',
      noAccount: 'Ainda não tem conta? Cadastre-se',
      dashboardGreeting: 'Olá, {{name}} 👋',
      dashboardIntro:
        'Descreva seu desafio atual. A AuraAI retorna sugestões práticas focadas em diálogo saudável.',
      messageLabel: 'Contexto do relacionamento',
      messagePlaceholder:
        'Exemplo: Estamos distantes após o trabalho e as conversas viram discussão com frequência...',
      analyze: 'Gerar sugestão',
      noHistory: 'Nenhum insight ainda. Envie sua primeira mensagem para começar.',
      insights: 'Seus últimos insights',
      authError: 'Não foi possível autenticar. Revise suas credenciais.',
      saveError: 'Não foi possível salvar seu insight agora.',
      profileError: 'Não foi possível carregar seu perfil.',
      profileSaveError: 'Conta criada, mas não foi possível salvar o perfil.',
      successSignup: 'Conta criada! Verifique seu e-mail para confirmar o cadastro.',
      suggestionTitle: 'Ação sugerida',
      validationName: 'O nome deve ter pelo menos 2 caracteres.',
      validationPasswordMatch: 'As senhas não coincidem.',
      validationMessage: 'Escreva pelo menos 12 caracteres para analisar.',
      hintPrivacy: 'Seus dados são privados e protegidos com Row Level Security no Supabase.',
      usingFallbackAi: 'Usando IA local de fallback (configure Edge Function para análise avançada).',
      insightDate: 'Criado em',
    },
  },
};

const browserLanguage = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'pt';
const defaultLanguage = browserLanguage.startsWith('en') ? 'en' : 'pt';

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('auraai-lang') ?? defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
