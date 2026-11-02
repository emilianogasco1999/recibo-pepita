import { create } from 'zustand';
import { ReceiptProps } from '../../domain/entities/receipt.entity';

interface ReceiptStoreState {
  currentReceipt: ReceiptProps | null;
  setReceipt: (receipt: ReceiptProps) => void;
  clearReceipt: () => void;
}

export const useReceiptStore = create<ReceiptStoreState>((set) => ({
  currentReceipt: null,
  setReceipt: (receipt) =>
    set({
      currentReceipt: {
        ...receipt,
        issuedAt: new Date().toISOString().split('T')[0],
      },
    }),
  clearReceipt: () => set({ currentReceipt: null }),
}));

