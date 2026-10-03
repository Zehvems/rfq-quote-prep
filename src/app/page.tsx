import NewInqForm from "./newInqForm";
  
export default async function HomePage() {
  const response = await fetch(
    new URL("/api/inquiries", process.env.APP_URL ?? "http://localhost:3000"),
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Nie udało się pobrać zapytań: ${response.status}`);
  }

  const inquiries: { id: string; company: string | null; rawText: string }[] =
    await response.json();

  return (
    <main>
      <h1>RFQ Quote Prep</h1>
      <ul>
        {inquiries.map((inquiry) => (
          <li key={inquiry.id}>
            {inquiry.company ?? "Nieznana firma"}: {inquiry.rawText}
          </li>
        ))}
      </ul>
      <NewInqForm />
    </main>
  );
}