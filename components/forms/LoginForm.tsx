'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFormState } from '@/hooks/useFormState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FormState {
  email: string;
  password: string;
}

const INITIAL_STATE: FormState = { email: '', password: '' };

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const { form, setField } = useFormState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const err = await login(form);
    setIsLoading(false);
    if (err) {
      setError(err);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Adresse e-mail"
        type="email"
        value={form.email}
        onChange={setField('email')}
        autoComplete="email"
        required
      />
      <Input
        label="Mot de passe"
        type="password"
        value={form.password}
        onChange={setField('password')}
        autoComplete="current-password"
        required
      />
      {error && <p className="text-sm text-[--color-error]">{error}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Connexion…' : 'Se connecter'}
      </Button>
      <p className="text-center text-sm text-[--color-text-muted]">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-semibold text-[--color-accent] hover:text-[--color-accent-hover] transition-colors">
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
}
