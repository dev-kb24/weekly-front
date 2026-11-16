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
  firstName: string;
  lastName: string;
  password: string;
}

const INITIAL_STATE: FormState = { email: '', firstName: '', lastName: '', password: '' };

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const { form, setField } = useFormState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const err = await register(form);
    setIsLoading(false);
    if (err) {
      setError(err);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          label="Prénom"
          value={form.firstName}
          onChange={setField('firstName')}
          autoComplete="given-name"
          required
        />
        <Input
          label="Nom"
          value={form.lastName}
          onChange={setField('lastName')}
          autoComplete="family-name"
          required
        />
      </div>
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
        autoComplete="new-password"
        minLength={8}
        required
      />
      {error && <p className="text-sm text-[--color-error]">{error}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Création du compte…' : 'Créer mon compte'}
      </Button>
      <p className="text-center text-sm text-[--color-text-muted]">
        Déjà inscrit ?{' '}
        <Link href="/login" className="font-semibold text-[--color-accent] hover:text-[--color-accent-hover] transition-colors">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
