import { useI18n } from '../i18n/i18n';
import { Button } from './kit';

/** Language toggle used by both apps — one template, one control. */
export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
      title="Switch language"
    >
      {lang === 'en' ? '中文' : 'EN'}
    </Button>
  );
}
