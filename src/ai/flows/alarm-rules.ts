'use server';

/**
 * @fileOverview This file contains the Genkit flow for setting alarm rules with AI assistance.
 *
 * It allows users to intelligently determine alarm thresholds and severity levels based on heart rate patterns received from the ESP32.
 *
 * - `setAlarmWithAIRules` - A function that sets alarm rules using AI based on heart rate patterns.
 * - `AlarmSettingWithAIRulesInput` - The input type for the `setAlarmWithAIRules` function.
 * - `AlarmSettingWithAIRulesOutput` - The return type for the `setAlarmWithAIRules` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AlarmSettingWithAIRulesInputSchema = z.object({
  heartRate: z.number().describe('The current heart rate.'),
  historicalHeartRates: z.array(z.number()).describe('Historical heart rate data.'),
  alarmTime: z.string().describe('The desired alarm time (e.g., HH:MM).'),
});
export type AlarmSettingWithAIRulesInput = z.infer<typeof AlarmSettingWithAIRulesInputSchema>;

const AlarmSettingWithAIRulesOutputSchema = z.object({
  alarmThreshold: z.number().describe('The heart rate threshold for triggering the alarm.'),
  alarmSeverity: z.enum(['low', 'medium', 'high']).describe('The severity level of the alarm.'),
  alarmTime: z.string().describe('The alarm time to set on the ESP32.'),
});
export type AlarmSettingWithAIRulesOutput = z.infer<typeof AlarmSettingWithAIRulesOutputSchema>;

export async function setAlarmWithAIRules(input: AlarmSettingWithAIRulesInput): Promise<AlarmSettingWithAIRulesOutput> {
  return alarmSettingWithAIRulesFlow(input);
}

const analyzeHeartRateData = ai.defineTool({
  name: 'analyzeHeartRateData',
  description: 'Analyzes heart rate data to determine alarm threshold and severity.',
  inputSchema: z.object({
    heartRate: z.number().describe('The current heart rate.'),
    historicalHeartRates: z.array(z.number()).describe('Historical heart rate data.'),
  }),
  outputSchema: z.object({
    alarmThreshold: z.number().describe('The heart rate threshold for triggering the alarm.'),
    alarmSeverity: z.enum(['low', 'medium', 'high']).describe('The severity level of the alarm.'),
  }),
}, async (input) => {
  // Implement heart rate analysis logic here.
  // This is a placeholder, replace with actual analysis.
  const averageHeartRate = input.historicalHeartRates.reduce((a, b) => a + b, 0) / input.historicalHeartRates.length;
  const threshold = averageHeartRate * 1.1; // Example: 10% above average
  let severity: 'low' | 'medium' | 'high' = 'low';

  if (input.heartRate > threshold) {
    severity = 'medium';
  }
  if (input.heartRate > threshold * 1.2) {
    severity = 'high';
  }

  return {
    alarmThreshold: threshold,
    alarmSeverity: severity,
  };
});

const alarmSettingWithAIRulesPrompt = ai.definePrompt({
  name: 'alarmSettingWithAIRulesPrompt',
  tools: [analyzeHeartRateData],
  input: {schema: AlarmSettingWithAIRulesInputSchema},
  output: {schema: AlarmSettingWithAIRulesOutputSchema},
  prompt: `Based on the user's current heart rate ({{{heartRate}}}) and historical heart rate data ({{{historicalHeartRates}}}),
determine an appropriate alarm threshold and severity level using the analyzeHeartRateData tool.

The user wants to set the alarm for {{{alarmTime}}}.

Return the alarm threshold, severity, and the requested alarm time.
`,
});

const alarmSettingWithAIRulesFlow = ai.defineFlow(
  {
    name: 'alarmSettingWithAIRulesFlow',
    inputSchema: AlarmSettingWithAIRulesInputSchema,
    outputSchema: AlarmSettingWithAIRulesOutputSchema,
  },
  async input => {
    const analysisResult = await analyzeHeartRateData({
      heartRate: input.heartRate,
      historicalHeartRates: input.historicalHeartRates,
    });

    const {output} = await alarmSettingWithAIRulesPrompt({
      ...input,
      alarmThreshold: analysisResult.alarmThreshold,
      alarmSeverity: analysisResult.alarmSeverity,
    });
    return output!;
  }
);
