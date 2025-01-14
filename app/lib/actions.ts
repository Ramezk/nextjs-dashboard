'use server';

import { z } from 'zod';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {

    const rawFormData = Object.fromEntries(formData.entries())
    const { customerId, amount, status } = CreateInvoice.parse(rawFormData);    // Test it out:
    console.log(rawFormData);
    console.log(typeof rawFormData.amount);
    console.log(typeof amount);
    const amountInCents = amount * 100;
    const date = new Date()
    console.log(date);
    const results = await prisma.invoice.create({ data: { amount: amountInCents, date: date, customerId: customerId, status: status } });
    console.log(results);
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}



/*** */

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    const results = await prisma.invoice.update({ where: { id: id }, data: { amount: amount, status: status, customerId: customerId } });
    console.log(results);
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}


export async function deleteInvoice(id: string) {
    const results = await prisma.invoice.delete({ where: { id: id } });
    revalidatePath('/dashboard/invoices');
}
