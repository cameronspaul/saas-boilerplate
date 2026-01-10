/**
 * Resend Email Service
 * 
 * Convex actions for sending emails using Resend.
 * All email templates are imported from emailTemplates.ts
 */

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import {
    getEmailContent,
    type EmailType,
    type WelcomeEmailParams,
    type PurchaseEmailParams,
    type CreditBundleEmailParams,
} from "./emailTemplates";

// Initialize Resend with API key from environment
function getResendClient(): Resend {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error("RESEND_API_KEY environment variable is not set");
    }
    return new Resend(apiKey);
}

// Get the from email address
function getFromEmail(): string {
    // Use your verified domain email, or Resend's default for testing
    return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

/**
 * Send a welcome email to a new user
 */
export const sendWelcomeEmail = internalAction({
    args: {
        to: v.string(),
        userName: v.string(),
    },
    handler: async (ctx, args) => {
        const resend = getResendClient();
        const fromEmail = getFromEmail();

        const params: WelcomeEmailParams = {
            userName: args.userName,
            email: args.to,
        };

        const { subject, html } = getEmailContent("welcome", params);

        try {
            const { data, error } = await resend.emails.send({
                from: fromEmail,
                to: args.to,
                subject,
                html,
            });

            if (error) {
                console.error("Error sending welcome email:", error);
                throw new Error(`Failed to send email: ${error.message}`);
            }

            console.log("Welcome email sent successfully:", data?.id);
            return { success: true, emailId: data?.id };
        } catch (error) {
            console.error("Exception sending welcome email:", error);
            throw error;
        }
    },
});

/**
 * Send a purchase confirmation email
 */
export const sendPurchaseEmail = internalAction({
    args: {
        to: v.string(),
        userName: v.string(),
        emailType: v.string(), // EmailType
        productName: v.string(),
        productDescription: v.optional(v.string()),
        amount: v.string(),
        currency: v.string(),
        orderId: v.optional(v.string()),
        // Credit bundle specific fields
        credits: v.optional(v.number()),
        bundleName: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const resend = getResendClient();
        const fromEmail = getFromEmail();

        // Build params - include credits info for credit bundle emails
        const params: PurchaseEmailParams | CreditBundleEmailParams = {
            userName: args.userName,
            email: args.to,
            productName: args.productName,
            productDescription: args.productDescription,
            amount: args.amount,
            currency: args.currency,
            orderId: args.orderId,
            purchaseDate: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            // Credit bundle specific fields
            credits: args.credits,
            bundleName: args.bundleName,
        };

        const emailType = args.emailType as EmailType;
        const { subject, html } = getEmailContent(emailType, params);

        try {
            const { data, error } = await resend.emails.send({
                from: fromEmail,
                to: args.to,
                subject,
                html,
            });

            if (error) {
                console.error(`Error sending ${emailType} email:`, error);
                throw new Error(`Failed to send email: ${error.message}`);
            }

            console.log(`${emailType} email sent successfully:`, data?.id);
            return { success: true, emailId: data?.id };
        } catch (error) {
            console.error(`Exception sending ${emailType} email:`, error);
            throw error;
        }
    },
});

/**
 * Send a generic email with custom content
 */
export const sendGenericEmail = internalAction({
    args: {
        to: v.string(),
        subject: v.string(),
        html: v.string(),
    },
    handler: async (ctx, args) => {
        const resend = getResendClient();
        const fromEmail = getFromEmail();

        try {
            const { data, error } = await resend.emails.send({
                from: fromEmail,
                to: args.to,
                subject: args.subject,
                html: args.html,
            });

            if (error) {
                console.error("Error sending generic email:", error);
                throw new Error(`Failed to send email: ${error.message}`);
            }

            console.log("Generic email sent successfully:", data?.id);
            return { success: true, emailId: data?.id };
        } catch (error) {
            console.error("Exception sending generic email:", error);
            throw error;
        }
    },
});
