/**
 * Mess-Ease: AI-Based Demand Prediction
 * ------------------------------------
 * This script reads historical mess attendance data from Google Sheets,
 * sends a structured prompt to Gemini AI,
 * and writes the predicted student count back to the Prediction_Output sheet.
 *
 * Tech Used:
 * - Google Apps Script (Automation)
 * - Google Sheets (Data Layer)
 * - Gemini API (AI Prediction)
 */

const GEMINI_MODEL = "models/gemini-1.5-flash";

function runMessDemandPrediction() {

  // 1️⃣ Access Daily Mess Data
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName("Daily_Mess_Data");
  const outputSheet = ss.getSheetByName("Prediction_Output");

  const lastRow = dataSheet.getLastRow();
  if (lastRow < 2) {
    throw new Error("Not enough data for prediction.");
  }

  // Fetch last 7 days of total student counts
  const dataRange = dataSheet
    .getRange(lastRow - 6, 5, 7, 1) // Column 5 = Total_Students
    .getValues()
    .flat();

  // 2️⃣ Construct AI Prompt
  const prompt = `
You are an AI system helping a college mess optimize food preparation.

Given the number of students who ate lunch in the last 7 days:
${dataRange.join(", ")}

Tasks:
1. Predict expected student count for tomorrow.
2. Add a small safety buffer to avoid food shortage.
3. Output ONLY a single integer value.

Do not explain. Do not add text.
`;

  // 3️⃣ Call Gemini API
  const url = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const json = JSON.parse(response.getContentText());

  // 4️⃣ Parse AI Output
  const predictionText =
    json.candidates[0].content.parts[0].text.trim();

  const predictedCount = parseInt(predictionText, 10);

  if (isNaN(predictedCount)) {
    throw new Error("AI returned invalid prediction.");
  }

  // 5️⃣ Write Prediction to Sheet
  outputSheet.getRange("B2").setValue(predictedCount);
  outputSheet.getRange("B3").setValue(new Date());

}
