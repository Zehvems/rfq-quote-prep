# RFQ Intake & Quote Prep Lab — Blueprint

## 1. Cel projektu

Zbudować mock-client MVP, które symuluje realny proces obsługi technicznego zapytania ofertowego:

**RFQ / email / PDF → zapis surowego zapytania → ekstrakcja danych → walidacja → sprawdzenie kompletności → human review → decyzja → n8n / external action.**

To jest **Integration Lab #2**, nie SaaS i nie pełny system ofertowy.

---

## 2. Główny problem

Firma dostaje techniczne zapytanie od klienta. Ktoś ręcznie:

- czyta mail / PDF,
- wyciąga parametry,
- sprawdza czego brakuje,
- porządkuje dane,
- przekazuje je dalej do Excela / CRM / kalkulacji.

Projekt automatyzuje i porządkuje **RFQ → Quote Prep**, ale **nie wylicza ceny i nie generuje pełnej oferty**.

---

## 3. Core flow

```text
Incoming RFQ
email text / PDF
        ↓
store raw inquiry
        ↓
extract text
        ↓
structured extraction
        ↓
Zod validation
        ↓
completeness engine
        ↓
 ┌────────────────┐
 │                │
READY          NEEDS_INFO
 │                │
 ▼                ▼
human review   missing fields
 │                │
APPROVE        REQUEST INFO
 │                │
 └───────┬────────┘
         ↓
        n8n
         ↓
quote-prep task / email draft / webhook
```

---

## 4. State machine

```text
RECEIVED
   ↓
EXTRACTED
   ↓
READY_FOR_REVIEW
or
NEEDS_INFO
   ↓
APPROVED
or
INFO_REQUESTED
or
REJECTED

FAILED
```

---

## 5. Dane

### Inquiry

Minimalny model na pierwszy slice:

```prisma
model Inquiry {
  id        String   @id @default(cuid())
  company   String?
  source    String   @default("MANUAL")
  rawText   String
  status    String   @default("RECEIVED")
  createdAt DateTime @default(now())
}
```

Znaczenie:

- `id` — identyfikator zapytania,
- `company` — firma / klient, opcjonalne,
- `source` — skąd przyszło zapytanie, na start `MANUAL`,
- `rawText` — surowa treść RFQ,
- `status` — aktualny stan workflow,
- `createdAt` — data utworzenia.

### Attachment — później

- inquiryId
- filename
- type
- extractedText

### Requirement — później

- key
- value
- source
- opcjonalnie confidence / status

### ReviewDecision — później

- inquiryId
- action
- note
- createdAt

### AuditEvent — później

Minimalny log ważnych zmian stanu.

---

## 6. Required vertical slices

### Block 1 — Inbound vertical slice

```text
POST /api/inquiries
→ DB
→ list page
```

**STOP CONDITION:** jedno zapytanie można przesłać i zobaczyć w systemie.

Zakres:

- prosty formularz / textarea,
- zapis `Inquiry` do Neon,
- lista zapisanych inquiries,
- bez extraction,
- bez AI,
- bez PDF,
- bez n8n.

---

### Block 2 — Attachment + Extraction

```text
PDF / text
→ extraction
→ structured object
→ Zod validation
```

**STOP CONDITION:** dwa różne sample RFQ dają poprawnie znormalizowane dane.

Nie budować uniwersalnego parsera.

---

### Block 3 — Completeness Engine

Jedna przykładowa konfiguracja wymaganych pól, np.:

- product / service type,
- quantity,
- dimensions / spec,
- deadline,
- delivery / location.

Output:

```text
COMPLETE
```

albo:

```text
MISSING:
- delivery location
- deadline
```

**STOP CONDITION:** complete i incomplete inquiry idą dwiema różnymi ścieżkami.

---

### Block 4 — Human Review

Minimalny ekran review:

- original raw text,
- extracted values,
- missing fields,
- editable values.

Akcje:

- **Approve**
- **Request missing info**
- **Reject**

---

### Block 5 — n8n / External Action

Po `APPROVED`:

```text
webhook → n8n → mock Quote Prep Task
```

Po `INFO_REQUESTED`:

```text
webhook → n8n → draft maila z brakującymi danymi
```

Nie integrujemy prawdziwego CRM.

---

### Block 6 — Reliability Slice

#### Idempotency

Dwukrotnie wysłany ten sam inquiry nie powinien stworzyć dwóch identycznych case'ów.

#### Failure path

Przykład:

```text
external webhook fail
→ FAILED_EXTERNAL_ACTION
→ manual retry
```

#### Audit

Minimum:

- received
- extracted
- reviewed
- external action

---

## 7. Definition of Done

Projekt jest DONE, gdy można pokazać 3 scenariusze.

### Scenario A — Clean inquiry

```text
RFQ
→ extract
→ complete
→ review
→ approve
→ quote-prep task
```

### Scenario B — Incomplete inquiry

```text
RFQ
→ missing fields
→ review
→ request info
→ n8n generates follow-up
```

### Scenario C — Technical failure

```text
approved
→ external action fails
→ failure visible
→ retry
→ success
```

Dodatkowo:

- README,
- prosty diagram flow,
- dwa przykładowe RFQ,
- krótki demo recording / screenshot,
- STOP.

---

## 8. Czego NIE budujemy

W tym projekcie nie ma:

- auth,
- multi-tenancy,
- pełnego CRM,
- pricing engine,
- realnego liczenia cen,
- SAP / ERP integration,
- wielu branż,
- OCR wszystkiego,
- billingów,
- role management,
- fancy UI,
- kompletnej profesjonalnej oferty PDF.

To byłby scope creep.

---

## 9. Hard cap

- target: **14–18 h**
- **20 h = hard stop + review**

Każdy blok powinien kończyć się działającym vertical slice’em albo konkretnym technicznym dowodem postępu.

---

## 10. Zasady implementacji

- vertical slice > wielka architektura,
- TypeScript business logic ma być czytelna i osobna od UI,
- AI może generować boilerplate, ale logika ma być zrozumiana,
- po każdym bloku zostaw jedno konkretne `NEXT`,
- jeśli coś nie jest potrzebne do obecnego stop condition — trafia do backlogu,
- nie rozbudowujemy projektu tylko dlatego, że „można”.

---

## 11. Current status

### Setup

- Next.js działa,
- Prisma 7 + Neon skonfigurowane,
- `schema.prisma` istnieje,
- model `Inquiry` przygotowany,
- podstawowy layout działa.

### Current task

**Block 1 — Inbound vertical slice**

Cel:

```text
POST /api/inquiries
→ zapis do DB
→ list page
```

### Current stop condition

> Jedno ręcznie wpisane RFQ da się zapisać do Neon i zobaczyć na stronie.

### NEXT

1. migracja `Inquiry`,
2. Prisma client,
3. `POST /api/inquiries`,
4. prosty formularz,
5. lista inquiries,
6. test jednego pełnego przebiegu,
7. STOP.
