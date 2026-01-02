
export interface ComplaintInput {
    text: string;
    category: 'Defect' | 'Billing' | 'Delivery' | 'Service' | 'Other' | string;
    channel: 'Voice' | 'Chat' | 'Email' | 'Social' | string;
    customerTier: 'VIP' | 'Premium' | 'Standard' | string;
    orderValue: number;
    isRepeat: boolean;
}

export interface ScoreBreakdown {
    baseScore: number;
    categoryScore: number;
    keywordScore: number;
    repeatScore: number;
    tierScore: number;
    valueScore: number;
    channelScore: number;
}

export interface ScoringResult {
    totalScore: number;
    severity: 1 | 2 | 3 | 4 | 5;
    priority: 'P1' | 'P2' | 'P3' | 'P4';
    risk: 'High' | 'Medium' | 'Low';
    reasons: string[];
    breakdown: ScoreBreakdown;
}

const CATEGORY_WEIGHTS: Record<string, number> = {
    'Defect': 30,
    'Billing': 25,
    'Delivery': 20,
    'Service': 15,
    'Other': 10
};

const KEYWORDS = [
    { word: 'unsafe', score: 40 },
    { word: 'legal', score: 45 },
    { word: 'sue', score: 40 },
    { word: 'fraud', score: 35 },
    { word: 'scam', score: 35 },
    { word: 'chargeback', score: 30 },
    { word: 'refund', score: 15 },
    { word: 'broken', score: 20 },
    { word: 'shattered', score: 20 },
    { word: 'missing', score: 15 },
    { word: 'late', score: 10 },
    { word: 'rude', score: 10 },
    { word: 'cancel', score: 10 },
    { word: 'immediately', score: 5 },
];

export function scoreComplaint(input: ComplaintInput): ScoringResult {
    let reasons: string[] = [];
    let breakdown: ScoreBreakdown = {
        baseScore: 0,
        categoryScore: 0,
        keywordScore: 0,
        repeatScore: 0,
        tierScore: 0,
        valueScore: 0,
        channelScore: 0
    };

    // 1. Category Score
    const catScore = CATEGORY_WEIGHTS[input.category] || 10;
    breakdown.categoryScore = catScore;
    if (catScore >= 25) reasons.push(`Category: ${input.category}`);

    // 2. Keyword Score
    const lowerText = input.text.toLowerCase();
    let kScore = 0;
    const foundKeywords = new Set<string>();

    KEYWORDS.forEach(k => {
        if (lowerText.includes(k.word)) {
            if (!foundKeywords.has(k.word)) {
                kScore += k.score;
                foundKeywords.add(k.word);
                reasons.push(`Keyword: "${k.word}"`);
            }
        }
    });
    // Cap keyword score to prevent overflow from spamming
    breakdown.keywordScore = Math.min(kScore, 60);

    // 3. Repeat Issue
    if (input.isRepeat) {
        breakdown.repeatScore = 25;
        reasons.push('Repeat Issue');
    }

    // 4. Customer Tier
    if (input.customerTier === 'VIP') {
        breakdown.tierScore = 15;
        reasons.push('VIP Customer');
    } else if (input.customerTier === 'Premium') {
        breakdown.tierScore = 5;
    }

    // 5. Order Value
    if (input.orderValue > 1000) {
        breakdown.valueScore = 30;
        reasons.push('Order Value > $1000');
    } else if (input.orderValue > 500) {
        breakdown.valueScore = 20;
    } else if (input.orderValue > 100) {
        breakdown.valueScore = 10;
    }

    // 6. Channel
    if (input.channel === 'Voice') {
        breakdown.channelScore = 5;
    }

    // Total Calculation
    const totalScore = Math.min(100,
        breakdown.baseScore +
        breakdown.categoryScore +
        breakdown.keywordScore +
        breakdown.repeatScore +
        breakdown.tierScore +
        breakdown.valueScore +
        breakdown.channelScore
    );

    // Deriving Attributes
    let severity: 1 | 2 | 3 | 4 | 5 = 1;
    if (totalScore >= 90) severity = 5;
    else if (totalScore >= 70) severity = 4;
    else if (totalScore >= 50) severity = 3;
    else if (totalScore >= 30) severity = 2;

    let priority: 'P1' | 'P2' | 'P3' | 'P4' = 'P4';
    if (severity === 5) priority = 'P1';
    else if (severity === 4) priority = 'P2';
    else if (severity === 3) priority = 'P3';

    let risk: 'High' | 'Medium' | 'Low' = 'Low';
    if (severity >= 4) risk = 'High';
    else if (severity === 3) risk = 'Medium';

    return {
        totalScore,
        severity,
        priority,
        risk,
        reasons,
        breakdown
    };
}
