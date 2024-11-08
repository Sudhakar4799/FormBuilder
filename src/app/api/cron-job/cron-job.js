// pages/api/cron-job.js
import cron from 'node-cron';
import { NextRequest, NextResponse } from 'next/server';

let task;

export async function GET(request) {
    try {
        if (!task) {
            task = cron.schedule('* * * * *', () => {
                console.log('Cron job executed every minute');
            });
            console.log('Cron job scheduled');
        } else {
            console.log('Cron job already running');
        }

        return NextResponse.json({ status: 200, message: 'Found Search results' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400, data: [], message: error });
    }
}
