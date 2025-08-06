import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, Languages } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError(t('login.invalidPassword'));
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dashboard-primary/10 to-dashboard-secondary/10 relative">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-6 right-6">
        <Button
          onClick={toggleLanguage}
          variant="outline"
          size="lg"
          className="bg-white/80 backdrop-blur-sm border-dashboard-primary/20 hover:bg-white hover:border-dashboard-primary shadow-lg"
        >
          <Languages className="w-5 h-5 mr-2" />
          <span className="font-medium">
            {language === 'en' ? t('language.arabic') : t('language.english')}
          </span>
        </Button>
      </div>

      <div className="w-full max-w-lg px-6">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pt-8 pb-6">
            {/* Larger Logo */}
            <div className="mx-auto mb-6">
              {language === 'ar' ? (
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F6cb987f4f6054cf88b5f469a13f2a67e%2F9ce73522cb8c4a6bae702c071e0fcfce?format=webp&width=800"
                  alt="Azhar Store Logo Arabic"
                  className="h-32 w-auto mx-auto"
                />
              ) : (
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F6cb987f4f6054cf88b5f469a13f2a67e%2Fd71ec3ff267e450e915617d640199433?format=webp&width=800"
                  alt="Azhar Store Logo English"
                  className="h-32 w-auto mx-auto"
                />
              )}
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900">{t('login.title')}</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                {t('dashboard.welcome')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('login.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-dashboard-primary hover:bg-dashboard-primary-light transition-colors"
              >
                {t('login.signIn')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
