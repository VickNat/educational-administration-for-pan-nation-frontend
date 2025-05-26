import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function PreferencesTab() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('settings.languageAndRegion')}</h3>
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">{t('common.language')}</Label>
            <Select
              value={i18n.language}
              onValueChange={changeLanguage}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('common.language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="am">አማርኛ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.timeZone')}</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('settings.timeZone')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GMT-05:00">(GMT-05:00) Eastern Time</SelectItem>
                <SelectItem value="GMT-06:00">(GMT-06:00) Central Time</SelectItem>
                <SelectItem value="GMT-07:00">(GMT-07:00) Mountain Time</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </div>
    </div>
  );
}
