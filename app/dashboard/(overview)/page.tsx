import CardWrapper, { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { cairo } from '@/app/ui/fonts';

import { fetchCardData, fetchLatestInvoices, fetchRevenue } from '@/app/lib/data';
import { Revenue } from '../../lib/definitions';
import { Invoice } from '@prisma/client';


import { Suspense } from 'react';
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
    // let revenue: Revenue[] = [];
    let latestInvoices: Invoice[] = [];
    // let totalPaidInvoices = 12586.32;
    // let totalPendingInvoices = 10;
    // let numberOfInvoices = 25;
    // let numberOfCustomers = 5;
    let { totalPaidInvoices, totalPendingInvoices, numberOfInvoices, numberOfCustomers
    } = await fetchCardData();//{ totalPaidInvoices: 1234.56, totalPendingInvoices: 10, numberOfInvoices: 25, numberOfCustomers: 5 };
    try {
        // Process and return the data

        // {
        //     totalPaidInvoices, totalPendingInvoices, numberOfInvoices, numberOfCustomers
        // } = await fetchCardData()

    } catch (error) {
        console.error('Error fetching revenue:', error);
        // Handle the error gracefully (e.g., display an error message to the user)
        // return null;
    }
    return (
        <main>
            <h1 className={`${cairo.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
                {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
                <Card title="Pending" value={totalPendingInvoices} type="pending" />
                <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
                <Card
                    title="Total Customers"
                    value={numberOfCustomers}
                    type="customers"
                /> */}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                {/* <RevenueChart revenue={revenue} /> */}
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}