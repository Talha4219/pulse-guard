'use server';

/**
 * @fileOverview This file contains the Genkit flow for setting alarm rules.
 *
 * This is now a simple pass-through and does not use AI.
 *
 * - `setAlarmWithAIRules` - A function that sets alarm rules.
 * - `AlarmSettingWithAIRulesInput` - The input type for the `setAlarmWithAIRules` function.
 * - `AlarmSettingWithAIRulesOutput` - The return type for the `setAlarmWithAIRules` function.
 */

import { z } from 'genkit';

const AlarmSettingWithAIRulesInputSchema = z.object({
  alarmTime: z.string().describe('The desired alarm time (e.g., HH:MM).'),
});
export type AlarmSettingWithAIRulesInput = z.infer<typeof AlarmSettingWithAIRulesInputSchema>;

const AlarmSettingWithAIRulesOutputSchema = z.object({
  alarmTime: z.string().describe('The alarm time to set on the ESP32.'),
});
export type AlarmSettingWithAIRulesOutput = z.infer<typeof AlarmSettingWithAIRulesOutputSchema>;

export async function setAlarmWithAIRules(input: AlarmSettingWithAIRulesInput): Promise<AlarmSettingWithAIRulesOutput> {
  // This is a pass-through function now.
  return {
    alarmTime: input.alarmTime,
  };
}
