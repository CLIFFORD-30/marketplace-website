'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const DEFAULT_CONTACTS = {
  general: '0507922264',
  sales: '0550959320',
};

function toWhatsAppLink(number, label) {
  let digits = number.replace(/\s+/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (digits.startsWith('0')) digits = '233' + digits.slice(1);
  const message = encodeURIComponent(`Hi, I need help with ${label} on UENR MARKET.`);
  return `https://wa.me/${digits}?text=${message}`;
}

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.65 4.53 1.78 6.4L4 29l7.79-1.75A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.98 16.87c-.29.82-1.7 1.56-2.35 1.65-.6.09-1.36.13-2.2-.14-.5-.16-1.15-.37-1.98-.72-3.49-1.51-5.77-5.02-5.94-5.25-.17-.23-1.42-1.89-1.42-3.6 0-1.71.9-2.55 1.22-2.9.32-.35.7-.44.94-.44.23 0 .47 0 .68.01.22.01.51-.08.8.61.29.7.99 2.41 1.08 2.59.09.17.15.38.03.61-.12.23-.18.38-.35.58-.17.2-.36.45-.52.6-.17.17-.35.35-.15.69.2.34.89 1.47 1.91 2.38 1.31 1.17 2.42 1.53 2.76 1.7.34.17.54.15.74-.09.2-.23.85-.99 1.08-1.33.23-.34.46-.28.77-.17.31.11 1.97.93 2.31 1.1.34.17.57.26.65.4.09.15.09.85-.2 1.67Z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadContacts = async () => {
      const snap = await getDoc(doc(db, 'settings', 'contacts'));
      if (snap.exists()) {
        setContacts({ ...DEFAULT_CONTACTS, ...snap.data() });
      }
    };
    loadContacts();
  }, []);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50">
      {open && (
        <div className="mb-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden w-56">
          <a
            href={toWhatsAppLink(contacts.general, 'General Support')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800"
          >
            <WhatsAppIcon className="w-4 h-4 text-green-500" />
            General
          </a>
          <a
            href={toWhatsAppLink(contacts.sales, 'Sales Support')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <WhatsAppIcon className="w-4 h-4 text-green-500" />
            Sales
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg"
        aria-label="Contact us on WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </button>
    </div>
  );
}