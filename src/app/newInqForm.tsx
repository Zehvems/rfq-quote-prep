'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewInqForm() {
  const router = useRouter();
  const [company, setCompany] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, rawText }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? 'Nie udało się zapisać zapytania.');
      }

      setCompany(null);
      setRawText('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się zapisać zapytania.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="company">Firma:</label>
        <input
          id="company"
          type="text"
          value={company ?? ''}
          onChange={(e) => setCompany(e.target.value || null)}
        />
      </div>
      <div>
        <label htmlFor="rawText">Tekst zapytania:</label>
        <textarea
          id="rawText"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Zapisywanie...' : 'Dodaj zapytanie'}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
