/**
 * Algorithmic Bikram Sambat (BS) <-> Gregorian (AD) Date Engine
 * Epoch anchor: 2000-09-17 BS <-> 1944-01-01 AD
 * 91-year astronomical ephemeris dataset (2000 BS – 2090 BS)
 */

export const BS_MIN_YEAR = 2000;
export const BS_MAX_YEAR = 2090;

const BS_MONTH_DAYS: readonly (readonly [
    number, number, number, number, number, number,
    number, number, number, number, number, number,
])[] = [
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2000
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2001
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2002
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2003
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2004
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2005
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2006
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2007
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2008
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2009
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2010
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2011
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2012
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2013
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2014
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2015
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2016
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2017
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2018
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2019
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2020
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2021
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2022
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2023
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2024
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2025
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2026
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2027
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2028
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30], // 2029
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2030
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2031
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2032
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2033
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2034
    [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2035
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2036
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2037
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2038
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2039
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2040
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2041
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2042
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2043
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2044
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2045
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2046
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2047
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2048
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2049
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2050
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2051
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2052
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2053
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2054
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2055
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30], // 2056
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2057
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2058
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2059
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2060
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2061
    [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31], // 2062
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2063
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2064
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2065
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2066
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2067
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2068
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2069
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2070
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2071
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2072
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2073
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2074
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2075
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2076
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2077
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2078
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2079
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2080
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2081
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2082
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2083
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2084
    [31, 31, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2085
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2086
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2087
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2088
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2089
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2090
];

const BS_MONTHS_EN: readonly string[] = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
];

const BS_MONTHS_NP: readonly string[] = [
    'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज',
    'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत',
];

const WEEKDAYS_EN: readonly string[] = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

const WEEKDAYS_NP: readonly string[] = [
    'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार',
];

const DEVANAGARI_DIGITS: readonly string[] = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toDevanagariDigits(value: number | string): string {
    return String(value).replace(/\d/g, (digit) => DEVANAGARI_DIGITS[Number(digit)] ?? digit);
}

export interface BsDateResult {
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly monthNameEn: string;
    readonly monthNameNp: string;
    readonly weekdayEn: string;
    readonly weekdayNp: string;
    readonly formattedEn: string;
    readonly formattedNp: string;
    readonly iso: string;
}

export interface AdDateResult {
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly weekdayEn: string;
    readonly formatted: string;
    readonly iso: string;
}

function getKathmanduYmd(now: Date): {
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly weekday: number;
} {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kathmandu',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(now);

    const year = Number(parts.find((p) => p.type === 'year')?.value ?? now.getFullYear());
    const month = Number(parts.find((p) => p.type === 'month')?.value ?? now.getMonth() + 1);
    const day = Number(parts.find((p) => p.type === 'day')?.value ?? now.getDate());
    const utcDate = new Date(Date.UTC(year, month - 1, day));

    return { year, month, day, weekday: utcDate.getUTCDay() };
}

export function getTodayBs(now: Date = new Date()): BsDateResult {
    const { year: adY, month: adM, day: adD, weekday } = getKathmanduYmd(now);

    const anchorUtcMs = Date.UTC(1944, 0, 1);
    const targetUtcMs = Date.UTC(adY, adM - 1, adD);
    let remainingDays = Math.floor((targetUtcMs - anchorUtcMs) / 86_400_000);

    let bsYear = 2000;
    let bsMonth = 9;
    let bsDay = 17;

    while (remainingDays > 0 && bsYear <= BS_MAX_YEAR) {
        const yearRow = BS_MONTH_DAYS[bsYear - BS_MIN_YEAR];
        if (!yearRow) {
            break;
        }
        const daysInMonth = yearRow[bsMonth - 1] ?? 30;
        const daysLeftInMonth = daysInMonth - bsDay;

        if (remainingDays <= daysLeftInMonth) {
            bsDay += remainingDays;
            remainingDays = 0;
        } else {
            remainingDays -= daysLeftInMonth + 1;
            bsDay = 1;
            bsMonth += 1;
            if (bsMonth > 12) {
                bsMonth = 1;
                bsYear += 1;
            }
        }
    }

    const monthNameEn = BS_MONTHS_EN[bsMonth - 1] ?? 'Baisakh';
    const monthNameNp = BS_MONTHS_NP[bsMonth - 1] ?? 'बैशाख';
    const weekdayEn = WEEKDAYS_EN[weekday] ?? 'Saturday';
    const weekdayNp = WEEKDAYS_NP[weekday] ?? 'शनिबार';

    const paddedM = String(bsMonth).padStart(2, '0');
    const paddedD = String(bsDay).padStart(2, '0');

    return {
        year: bsYear,
        month: bsMonth,
        day: bsDay,
        monthNameEn,
        monthNameNp,
        weekdayEn,
        weekdayNp,
        formattedEn: `${bsYear} ${monthNameEn} ${paddedD} BS`,
        formattedNp: `${toDevanagariDigits(bsYear)} ${monthNameNp} ${toDevanagariDigits(bsDay)} · ${weekdayNp}`,
        iso: `${bsYear}-${paddedM}-${paddedD}`,
    };
}

export function getTodayAd(now: Date = new Date()): AdDateResult {
    const { year, month, day, weekday } = getKathmanduYmd(now);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    const monthShort = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'UTC',
        month: 'short',
    }).format(utcDate);

    const weekdayEn = WEEKDAYS_EN[weekday] ?? 'Saturday';
    const paddedM = String(month).padStart(2, '0');
    const paddedD = String(day).padStart(2, '0');

    return {
        year,
        month,
        day,
        weekdayEn,
        formatted: `${paddedD} ${monthShort} ${year} · ${weekdayEn}`,
        iso: `${year}-${paddedM}-${paddedD}`,
    };
}

export function getKathmanduTime(now: Date = new Date()): {
    readonly en: string;
    readonly np: string;
} {
    const en = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kathmandu',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(now);

    return {
        en,
        np: toDevanagariDigits(en),
    };
}
