"use server";

import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signInAction(formData: FormData) {
    try {
        formData.append("redirectTo", "/knowledge");
        await signIn("credentials", formData);
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return "Invalid credentials. Please try again.";
    }
}
