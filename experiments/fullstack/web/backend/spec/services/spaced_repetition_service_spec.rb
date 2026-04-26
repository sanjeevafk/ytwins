require 'spec_helper'

RSpec.describe SpacedRepetitionService do
  describe '.calculate' do
    let(:initial_ease) { 2.5 }
    let(:initial_interval) { 0 }
    let(:initial_reps) { 0 }

    context 'when quality is perfect (5)' do
      it 'increases ease and sets interval to 1 on first rep' do
        result = SpacedRepetitionService.calculate(5, initial_ease, initial_interval, initial_reps)
        expect(result[:ease_factor]).to be > initial_ease
        expect(result[:interval_days]).to eq(1)
        expect(result[:repetitions]).to eq(1)
      end

      it 'sets interval to 6 on second rep' do
        result = SpacedRepetitionService.calculate(5, 2.6, 1, 1)
        expect(result[:interval_days]).to eq(6)
        expect(result[:repetitions]).to eq(2)
      end

      it 'calculates exponential interval on subsequent reps' do
        result = SpacedRepetitionService.calculate(5, 2.6, 6, 2)
        expect(result[:interval_days]).to eq((6 * 2.6).round)
        expect(result[:repetitions]).to eq(3)
      end
    end

    context 'when quality is poor (0-2)' do
      it 'resets repetitions and sets interval to 1' do
        result = SpacedRepetitionService.calculate(2, initial_ease, 6, 2)
        expect(result[:repetitions]).to eq(0)
        expect(result[:interval_days]).to eq(1)
        expect(result[:ease_factor]).to eq(initial_ease - 0.2)
      end
    end

    it 'enforces a minimum ease factor' do
      result = SpacedRepetitionService.calculate(0, 1.3, 1, 0)
      expect(result[:ease_factor]).to eq(1.3)
    end
  end
end
