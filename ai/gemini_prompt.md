# Gemini Prompt Design

The AI model receives recent mess attendance data and predicts upcoming crowd levels.

## Input
- Last 5–7 days of total student attendance
- Focus on peak meal trends

## Prompt Structure
You are an AI system helping a college mess optimize food preparation.

Given the number of students who ate lunch in the last 7 days:
[historical values]

Tasks:
1. Predict expected student count for tomorrow
2. Add a small safety buffer
3. Output only a single integer value

## Reasoning
- Short-term historical data captures trends
- Safety buffer prevents food shortage
- Single-value output simplifies automation
