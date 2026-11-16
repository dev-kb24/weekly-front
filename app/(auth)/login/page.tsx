import type { Metadata } from 'next';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata: Metadata = { title: 'Connexion — WeeklyFit' };

export default function LoginPage() {
  return (
    <>
      <h2 className="text-base font-semibold text-gray-700 mb-4">Connexion</h2>
      <LoginForm />
    </>
  );
}
