import type { Metadata } from 'next';
import { RegisterForm } from '@/components/forms/RegisterForm';

export const metadata: Metadata = { title: 'Inscription — WeeklyFit' };

export default function RegisterPage() {
  return (
    <>
      <h2 className="text-base font-semibold text-gray-700 mb-4">Créer un compte</h2>
      <RegisterForm />
    </>
  );
}
