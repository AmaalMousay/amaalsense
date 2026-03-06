import { describe, it, expect, vi } from 'vitest';
import {
  startPredictionScheduler,
  stopPredictionScheduler,
  getPredictionSchedulerStatus,
} from './scheduledPredictions';

describe('Scheduled Predictions Service', () => {
  it('starts in stopped state', () => {
    const status = getPredictionSchedulerStatus();
    expect(status.running).toBe(false);
    expect(status.monitoredCountries).toBe(15);
    expect(status.alertThreshold).toBe(70);
  });

  it('starts and stops the scheduler', () => {
    startPredictionScheduler(120);
    let status = getPredictionSchedulerStatus();
    expect(status.running).toBe(true);
    expect(status.intervalMinutes).toBe(120);

    stopPredictionScheduler();
    status = getPredictionSchedulerStatus();
    expect(status.running).toBe(false);
  });

  it('does not start twice', () => {
    startPredictionScheduler(120);
    startPredictionScheduler(120); // Should not throw
    const status = getPredictionSchedulerStatus();
    expect(status.running).toBe(true);

    stopPredictionScheduler();
  });

  it('does not error when stopping while not running', () => {
    stopPredictionScheduler(); // Should not throw
    const status = getPredictionSchedulerStatus();
    expect(status.running).toBe(false);
  });

  it('returns null for lastRunResults initially', () => {
    const status = getPredictionSchedulerStatus();
    expect(status.lastRunTimestamp).toBeNull();
    expect(status.lastRunResults).toBeNull();
  });
});
