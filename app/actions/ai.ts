"use server";
import Query from "@/models/querry";
import db from "@/utilis/db"

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing. Please add it to your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Export the async function properly
export async function runAi(text:string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(text);
  return result.response.text();
}
export async function saveQuery
(
  template:object,
   email:string,
   query:string,
    content:string
  ) 
{
  try {
    await db();
    const newQuery = new Query({
      template,
      email,
      query,
      content,
    });
    await newQuery.save();
    return{
      ok: true,
    }
  } catch (error) {
    return{
      ok: false,
    }
  }
}

export async function getQueries(email: string, page: number, pageSize: number) {
  try {
    await db();
    const skip = (page - 1) * pageSize;

    const totalQueries = await Query.countDocuments({ email });

    // ✅ Use .lean() to return plain JS objects
    const queries = await Query.find({ email })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Convert ObjectId and Date fields into JSON-safe values
    return JSON.parse(
      JSON.stringify({
        queries,
        totalPages: Math.ceil(totalQueries / pageSize),
      })
    );
  } catch (error) {
    console.error("Error in getQueries:", error);
    return {
      queries: [],
      totalPages: 0,
    };
  }
}


export async function usageCount(email: string) {
  await db();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const result = await Query.aggregate([
    {
      $match: {
        email: email,
        $expr: {
          $and: [
            { $eq: [{ $year: "$createdAt" }, currentYear] },
            { $eq: [{ $month: "$createdAt" }, currentMonth] },
          ],
        },
      },
    },
    {
      $project: {
        wordCount: {
          $size: {
            $split: [{ $trim: { input: "$content" } }, " "],
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        totalWordCount: { $sum: "$wordCount" },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalWordCount : 0;
}
