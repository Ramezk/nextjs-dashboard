import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { prisma } from './prisma';
import { equal } from 'assert';
import { Underdog } from 'next/font/google';
import { invoices } from './placeholder-data';
import { Console, log } from 'console';

export async function fetchRevenue() {
  try {
    const data = await prisma.revenue.findMany();
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 4 seconds.');
    const data = await prisma.invoice.findMany({
      orderBy: { date: 'desc' }, take: 5,
      select: {
        amount: true,
        id: true,
        customer: { select: { name: true, imageUrl: true, email: true } }
      }
    })

    if (!data)
      return [];
    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      imageUrl: invoice.customer.imageUrl,
      name: invoice.customer.name,
      email: invoice.customer.email,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 1 second.');
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    // const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM invoices`;

    const data = await Promise.all([
      prisma.invoice.aggregate({
        _count: {
          id: true
        }
      }
      ),
      prisma.customer.aggregate({
        _count: {
          id: true
        },
      }), ,
      prisma.invoice.aggregate({
        _sum: {
          amount: true
        }, where: { status: { equals: 'paid' } }
      }),
      prisma.invoice.aggregate({
        _sum: {
          amount: true
        }, where: { status: { equals: 'pending' } }
      })
    ]);

    const numberOfInvoices = Number(data[0]._count.id ?? 0);
    const numberOfCustomers = Number(data[1]._count.id ?? 0);
    const totalPaidInvoices = formatCurrency(data[2] != undefined ? data[2]._sum.amount : 0);
    const totalPendingInvoices = formatCurrency(data[3] != undefined ? data[3]._sum.amount : 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const r = (isNaN(query) ? 0 : Number(query));
  try {
    const invoices = prisma.invoice.findMany({
      take: ITEMS_PER_PAGE,
      skip: offset,
      orderBy: {
        date: 'desc'
      },
      select: {
        id: true,
        amount: true,
        date: true,
        status: true,
        customer: { select: { name: true, email: true, imageUrl: true } }
      },
      where: {
        OR: [
          { amount: { equals: r } },
          { status: { contains: query, mode: 'insensitive' }, },
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          { customer: { name: { contains: query, mode: 'insensitive' } } },
        ]
      }
    });

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  const r = (isNaN(query) ? 0 : Number(query));
  try {
    const invoices = prisma.invoice.aggregate({
      _count: {
        id: true,
      },
      where: {
        OR: [
          { amount: { equals: r } },
          { status: { contains: query, mode: 'insensitive' }, },
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          { customer: { name: { contains: query, mode: 'insensitive' } } },
        ]
      }
    });
    if (!invoices)
      return 0;

    const totalPages = Math.ceil(Number((await invoices)._count.id) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await prisma.invoice.findFirst({
      where: { id: { equals: id } },
      select: {
        id: true,
        amount: true,
        customerId: true,
        date: true,
        status: true
      }
    });
    console.log(data);
    return data
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
    // const data = await sql<CustomerField>`
    //   SELECT
    //     id,
    //     name
    //   FROM customers
    //   ORDER BY name ASC
    // `;

    // const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
