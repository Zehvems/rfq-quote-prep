import type { RFQData } from './schema';

export type MissingRFQField = {
  path: string;
  message: string;
};

export type RFQCompletenessResult = {
  status: 'READY_FOR_REVIEW' | 'NEEDS_INFO';
  missingFields: MissingRFQField[];
};

// Demo policy: all item fields and both shared delivery fields are required.
// Completeness does not verify factual accuracy or approve an RFQ.
export function checkRFQCompleteness(data: RFQData): RFQCompletenessResult {
  const missingFields: MissingRFQField[] = [];

  const requireText = (
    value: string | null | undefined,
    path: string,
    message: string,
  ) => {
    if (!value?.trim()) missingFields.push({ path, message });
  };

  if (data.items.length === 0) {
    missingFields.push({ path: 'items', message: 'Brak pozycji produktowych lub usług.' });
  }

  data.items.forEach((item, index) => {
    const path = `items[${index}]`;
    const label = `Pozycja ${index + 1}${item.productType?.trim() ? ` (${item.productType.trim()})` : ''}`;

    requireText(item.productType, `${path}.productType`, `${label}: brak nazwy produktu lub usługi.`);

    if (item.quantity == null || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
      missingFields.push({
        path: `${path}.quantity`,
        message: `${label}: brak potwierdzonej ilości będącej dodatnią liczbą całkowitą.`,
      });
    }

    requireText(item.specification, `${path}.specification`, `${label}: brak specyfikacji.`);
  });

  requireText(data.deadline, 'deadline', 'Brak wspólnego terminu dostawy lub realizacji.');
  requireText(data.deliveryLocation, 'deliveryLocation', 'Brak wspólnego miejsca dostawy.');

  return {
    status: missingFields.length === 0 ? 'READY_FOR_REVIEW' : 'NEEDS_INFO',
    missingFields,
  };
}
