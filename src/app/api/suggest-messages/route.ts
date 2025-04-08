import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey:
    "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", // Ensure this is set in .env
});

export async function POST() {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-instruct", // or "gpt-3.5-turbo"
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that suggests short messages users can post publicly.",
      },
      {
        role: "user",
        content: "Suggest a public message I can post to my profile.",
      },
    ],
    stream: true,
  });
  console.log("OpenAI response:", response);
  // Stream the response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      for await (const chunk of response) {
        const content = chunk.choices?.[0]?.delta?.content || "";
        controller.enqueue(encoder.encode(content));
      }

      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

// import { openai } from "@ai-sdk/openai";
// import { streamText } from "ai";

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   console.log("suggest-messages route HIT"); // ✅ check log
//   const prompt =
//     "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//   const result = streamText({
//     model: openai("gpt-4o"),
//     prompt,
//   });
//   console.log(result);
//   return result.toDataStreamResponse();
// }

{
  /*import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: openai("gpt-4o"),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
*/
}
