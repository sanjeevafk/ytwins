export type ReviewData = {
    videoId: string;
    ease: number;
    intervalDays: number;
    repetitions: number;
    dueAt: number;
    lastReviewedAt?: number;
};

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;
const DAY_MS = 24 * 60 * 60 * 1000;

export const getInitialReviewData = (videoId: string): ReviewData => ({
    videoId,
    ease: DEFAULT_EASE,
    intervalDays: 0,
    repetitions: 0,
    dueAt: Date.now(),
});

export const scheduleNextReview = (data: ReviewData, rating: number): ReviewData => {
    const clampedRating = Math.min(5, Math.max(1, rating));
    let ease = data.ease + (0.1 - (5 - clampedRating) * (0.08 + (5 - clampedRating) * 0.02));
    ease = Math.max(MIN_EASE, ease);

    let repetitions = data.repetitions;
    let intervalDays = data.intervalDays;

    if (clampedRating < 3) {
        repetitions = 0;
        intervalDays = 1;
    } else {
        repetitions += 1;
        if (repetitions === 1) {
            intervalDays = 1;
        } else if (repetitions === 2) {
            intervalDays = 6;
        } else {
            intervalDays = Math.round(intervalDays * ease);
        }
    }

    return {
        ...data,
        ease,
        repetitions,
        intervalDays,
        dueAt: Date.now() + intervalDays * DAY_MS,
        lastReviewedAt: Date.now(),
    };
};
