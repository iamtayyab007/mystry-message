import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Toaster as Sonner } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceUsername = useDebounceValue(username, 500);
  const router = useRouter();

  //zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const checkUsername = async () => {
      if (debounceUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debounceUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [debounceUsername]);

  return <div>page</div>;
}
function zodResolver(
  signUpSchema: z.ZodObject<
    { username: z.ZodString; email: z.ZodString; password: z.ZodString },
    "strip",
    z.ZodTypeAny,
    { username: string; email: string; password: string },
    { username: string; email: string; password: string }
  >
):
  | import("react-hook-form").Resolver<
      import("react-hook-form").FieldValues,
      any,
      import("react-hook-form").FieldValues
    >
  | undefined {
  throw new Error("Function not implemented.");
}
