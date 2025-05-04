import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ collection: 'Invoices', versionKey: false, timestamps: true })
export class Invoice {
  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  date: Date;

  @Prop({
    type: [
      {
        sku: { type: String, required: true, unique: true },
        qt: { type: Number, required: true },
        _id: false, // Prevents Mongoose from generating _id for subdocuments
      },
    ],
  })
  items: { sku: string; qt: number }[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
