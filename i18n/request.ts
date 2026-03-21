import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale === "km" ? "km" : "en";

  try {
    const messages = (await import(`../messages/${validLocale}.json`)).default;

    return {
      locale: validLocale,
      messages
    };
  } catch (error) {
    console.error("❌ Failed to load messages:", error);

    return {
      locale: "en",
      messages: (await import(`../messages/en.json`)).default
    };
  }
});