import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols');

    if (!symbols) {
        return NextResponse.json({ error: 'Symbols required' }, { status: 400 });
    }

    const API_KEY = process.env.ALPACA_API_KEY;
    const SECRET_KEY = process.env.ALPACA_SECRET_KEY;
    const ENDPOINT = process.env.ALPACA_API_ENDPOINT || 'https://paper-api.alpaca.markets/v2';

    if (!API_KEY || !SECRET_KEY) {
        return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    try {
        const response = await fetch(`${ENDPOINT}/stocks/snapshots?symbols=${symbols}`, {
            headers: {
                'APCA-API-KEY-ID': API_KEY,
                'APCA-API-SECRET-KEY': SECRET_KEY,
                'accept': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Alpaca API Error:', response.status, errorText);
            return NextResponse.json({ error: `Alpaca API error: ${response.status}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
