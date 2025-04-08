"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import messages from "@/messages.json";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function page() {
  const params = useParams();
  const username = params.username as string;
  const [accordian, setAccordian] = useState<boolean>(false);

  const [isAcceptingMessage, setIsAcceptingMessage] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    mode: "onChange",
  });
  const { setValue } = form;
  useEffect(() => {
    const checkUserAcceptingMessages = async () => {
      try {
        const response = await axios.get(`/api/accept-messages/${username}`);
        if (response.status === 200) {
          setIsAcceptingMessage(response.data.isAcceptingMessage);
          toast("success", {
            description: "user is accepting messages",
          });
        }
      } catch (error: any) {
        console.error(error);
        setIsAcceptingMessage(false);

        toast("error", {
          description:
            error?.response?.data?.message || "Something went wrong.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    checkUserAcceptingMessages();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post("/api/send-message", {
        content: data.content,
        username,
      });
      if (response.status === 201) {
        toast("success", {
          description: "message sent successfully to the user",
        });
      } else {
        toast("error", {
          description: "message was not sent to the user",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast("error", {
        description: error?.response?.data?.message || "Something went wrong.",
      });
    }
  };
  const handleSuggestMessages = async () => {
    setAccordian(true);
    // console.log("daa");
    // setIsAiLoading(true);
    // setMessage("");
    // try {
    //   const response = await fetch("/api/suggest-messages", {
    //     method: "POST",
    //   });
    //   if (!response.body) {
    //     throw new Error("No response body");
    //   }
    //   const reader = response.body.getReader();
    //   const decoder = new TextDecoder();
    //   let result = "";
    //   while (true) {
    //     const { done, value } = await reader.read();
    //     if (done) break;
    //     result += decoder.decode(value, { stream: true });
    //     setMessage(result);
    //   }
    // } catch (error) {
    //   console.error("Error streaming message:", error);
    // } finally {
    //   setIsAiLoading(false);
    // }
  };
  return (
    <>
      <h1 className="text-3xl flex justify-center items-center mt-1 font-bold">
        Public Profile Link
      </h1>
      <div className="flex justify-center items-center mt-1">
        {isLoading ? (
          <p>Please wait while fetching the user's message status...</p>
        ) : isAcceptingMessage === true ? (
          <p>User is accepting messages.</p>
        ) : isAcceptingMessage === false ? (
          <p>User is not accepting messages.</p>
        ) : (
          <p>Unable to determine user message status.</p>
        )}
      </div>
      <div className="flex justify-center items-center mt-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send anonymous message to @ {username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none w-full max-w-full h-25"
                      {...field}
                      {...form.register("content")}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => {
                if (isAcceptingMessage) {
                  form.handleSubmit(onSubmit)();
                } else {
                  toast("user is not accepting message", {});
                }
              }}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex flex-col justify-start mt-3 ml-5 ">
        <Button className="w-45 mb-3" onClick={() => handleSuggestMessages()}>
          Suggest Message
        </Button>

        {accordian && (
          <>
            <p>Click on Any message below to select it</p>{" "}
            <div className="flex justify-center items-center">
              <div className="bg-black text-white w-auto max-w-72 p-3 flex justify-center items-center">
                <Accordion type="single" collapsible>
                  {messages.map((message, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{message.title}</AccordionTrigger>
                      <AccordionContent
                        onClick={() => setValue("content", message.content)}
                        className="cursor-pointer"
                      >
                        <p>{message.content}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="mt-3 mb-3 text-center">&copy; Msystry Message</footer>
    </>
  );
}
