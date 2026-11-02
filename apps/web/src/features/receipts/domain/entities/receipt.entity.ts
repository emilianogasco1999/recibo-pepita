export interface ReceiptProps {
  personName: string;
  dni: string;
  phone: string;
  dressName: string;
  eventDate: string;
  price: number;
  deposit: number;
  deliveryDate: string;
  returnDate: string;
  observation?: string;
  issuedAt?: string;
}

export class Receipt {
  constructor(private readonly props: ReceiptProps) {}

  get personName(): string {
    return this.props.personName.trim();
  }

  get dni(): string {
    return this.props.dni.trim();
  }

  get phone(): string {
    return this.props.phone.trim();
  }

  get dressName(): string {
    return this.props.dressName.trim();
  }

  get eventDate(): string {
    return this.props.eventDate;
  }

  get price(): number {
    return this.props.price;
  }

  get deposit(): number {
    return this.props.deposit;
  }

  get remainingBalance(): number {
    return Math.max(0, this.props.price - this.props.deposit);
  }

  get deliveryDate(): string {
    return this.props.deliveryDate;
  }

  get returnDate(): string {
    return this.props.returnDate;
  }

  get observation(): string {
    return this.props.observation?.trim() ?? '';
  }

  get issuedAt(): string {
    return (
      this.props.issuedAt ??
      new Date().toISOString().split('T')[0]
    );
  }

  get pdfFileName(): string {
    const sanitize = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s-_]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    const person = sanitize(this.personName) || 'Cliente';
    const dress = sanitize(this.dressName) || 'Vestido';
    return `Recibo-Pepita-${person}-${dress}-${this.eventDate}`;
  }

  toJSON(): ReceiptProps {
    return {
      ...this.props,
      issuedAt: this.issuedAt,
    };
  }
}

