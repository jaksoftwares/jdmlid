'use client';

import { Suspense } from 'react';
import PaymentPage from './payment';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Payment Page...</div>}>
      <PaymentPage />
    </Suspense>
  );
}
