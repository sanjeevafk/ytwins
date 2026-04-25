class SpacedRepetitionService
  MIN_EASE = 1.3

  def self.calculate(quality, ease, interval, reps)
    quality = quality.to_i
    ease = ease.to_f
    interval = interval.to_i
    reps = reps.to_i

    if quality >= 3
      if reps == 0
        new_interval = 1
      elsif reps == 1
        new_interval = 6
      else
        new_interval = (interval * ease).round
      end
      
      new_reps = reps + 1
      new_ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    else
      new_reps = 0
      new_interval = 1
      new_ease = ease - 0.2
    end

    new_ease = [MIN_EASE, new_ease].max

    {
      ease_factor: new_ease,
      interval_days: new_interval,
      repetitions: new_reps,
      next_review_at: (Time.now + (new_interval * 86400))
    }
  end
end
