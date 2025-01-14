import bcrypt from 'bcrypt';
// import { db } from '@vercel/postgres';
import { PrismaClient } from '@prisma/client'

import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const prisma = new PrismaClient()

// export async function GET() {
//   let messges = '';
//   try {
//     await prisma.$transaction(
//       async (tx) => {
//         const insertedsers = users.map(async (user) => {
//           const hashedPassword = await bcrypt.hash(user.password, 10);
//           tx.user.create({
//             data: {
//               email: user.email,
//               id: user.id,
//               name: user.name,
//               password: hashedPassword
//             }
//           })
//         });
//         if (insertedsers.length == 0)
//           throw new Error(`${insertedsers} doesn't have enough to objects ${insertedsers.length} expected ${users.length}`)
//         messges += `insertedUsers  ${insertedsers.length} expected ${users.length} `;
//         const insertedInvoices = invoices.map(async (invoice) => {
//           tx.invoice.create({
//             data: {
//               amount: invoice.amount,
//               customerId: invoice.customer_id,
//               status: invoice.status,
//               date: invoice.date
//             }
//           })
//         });
//         messges += `insertedInvoices   ${insertedInvoices.length} expected ${invoices.length} `;
//         const insertedCustomers = customers.map(async (customer) => {
//           tx.customer.create({
//             data: {
//               id: customer.id,
//               name: customer.name,
//               email: customer.email,
//               imageUrl: customer.image_url
//             }
//           })
//         });
//         messges += `insertedCustomers   ${insertedCustomers.length} expected ${customers.length} `;
//         const insertedRevenue = revenue.map(async (rev) => {
//           tx.revenue.create({
//             data: {
//               month: rev.month,
//               revenue: rev.revenue
//             }
//           })
//         });
//         messges += `insertedRevenue   ${insertedRevenue.length} expected ${revenue.length} `;

//       },
//       {
//         maxWait: 5000, // default: 2000
//         timeout: 10000, // default: 5000
//         // isolationLevel: 'Serializable', // optional, default defined by database configuration
//       });

//     return Response.json({ message: 'Database seeded successfully', messges })
//   } catch (err) {
//     return Response.json({ err }, { status: 500 });
//   }
//   //   
// }


export async function GET() {
  // let messges = '';
  // try {
  //   await prisma.$transaction(
  //     async (tx) => {
  //       const insertedUsers = await Promise.all(
  //         users.map(async (u) => {
  //           // const hashedPassword = await bcrypt.hash(user.password, 10);
  //           return tx.user.create({
  //             data: {
  //               email: u.email,
  //               id: u.id,
  //               name: u.name,
  //               password: u.password,
  //             },
  //           });
  //         })
  //       );
  //       if (insertedUsers.length === 0)
  //         throw new Error(`No users inserted: expected ${users.length}`);
  //       messges += `InsertedUsers: ${insertedUsers.length}, expected: ${users.length}\n`;
  //       const insertedCustomers = await Promise.all(
  //         customers.map(async (customer) => {
  //           return tx.customer.create({
  //             data: {
  //               id: customer.id,
  //               name: customer.name,
  //               email: customer.email,
  //               imageUrl: customer.image_url,
  //             },
  //           });
  //         })
  //       );
  //       messges += `InsertedCustomers: ${insertedCustomers.length}, expected: ${customers.length}\n`;

  //       const insertedInvoices = await Promise.all(
  //         invoices.map(async (i) => {
  //           return tx.invoice.create({
  //             data: {
  //               amount: i.amount,
  //               customerId: i.customer_id,
  //               status: i.status,
  //               date: new Date(i.date),
  //             },
  //           });
  //         })
  //       );
  //       messges += `InsertedInvoices: ${insertedInvoices.length}, expected: ${invoices.length}\n`;


  //       const insertedRevenue = await Promise.all(
  //         revenue.map(async (rev) => {
  //           return tx.revenue.create({
  //             data: {
  //               month: rev.month,
  //               revenue: rev.revenue,
  //             },
  //           });
  //         })
  //       );
  //       messges += `InsertedRevenue: ${insertedRevenue.length}, expected: ${revenue.length}\n`;
  //     },
  //     {
  //       maxWait: 5000, // default: 2000
  //       timeout: 10000, // default: 5000
  //       isolationLevel: 'Serializable', // optional, default defined by database configuration
  //     }
  //   );

  //   return Response.json({ message: 'Database seeded successfully', messges });
  // } catch (err) {
  //   return Response.json({ errors: err.message }, { status: 500 });
  // }
}