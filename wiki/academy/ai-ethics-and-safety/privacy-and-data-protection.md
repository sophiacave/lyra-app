# Privacy and Data Protection

**Course:** AI Ethics & Safety
**Order:** 3
**Type:** lesson
**Access:** Free

---
[← Course Home](/academy/ai-ethics-and-safety/)
  Lesson 3 of 10


  # Privacy and Data Protection.

  Every prompt you send is data. Know where it goes, who sees it, and what's safe to share.


  ### After this lesson you'll know


    - What happens to the data you send to AI models

    - The 5 things you should NEVER paste into an AI prompt

    - How to use AI safely with sensitive information

    - Business vs personal account privacy differences




  The Reality
  ## Your prompts aren't private by default.

  When you type something into an AI chat, you're sending data to a server. Depending on the provider, your plan, and the settings — that data might be stored, reviewed by staff, or used to train future models.
  Most major AI providers (including Anthropic, OpenAI, and Google) have different policies for free vs paid accounts, and for consumer vs business plans. The differences matter enormously:




        Free / Consumer Plans

          - May use your data for training

          - Conversations may be reviewed

          - Less control over data retention

          - Fewer compliance guarantees




        Business / API Plans

          - Typically no training on your data

          - Stricter access controls

          - Data retention policies you can configure

          - Compliance certifications (SOC 2, etc.)





  **Rule of thumb:** If you're using a free or consumer plan, treat every prompt as if it could be seen by someone else.


  The Red Lines
  ## 5 things to NEVER paste into an AI prompt.





        1. Passwords & API keys — Never. Not even "just to check something." Use a password manager.


        2. Other people's personal data — Names + emails, health records, financial info. If it could identify a person, don't share it.


        3. Confidential business information — Trade secrets, unreleased financials, legal strategy, M&A details.


        4. Private communications — Other people's emails, DMs, or messages without their consent.


        5. Regulated data — HIPAA health info, FERPA student records, PCI credit card numbers, data covered by NDA.





  Safe Practices
  ## How to use AI safely with sensitive work.

  You don't have to avoid AI for sensitive topics. You just need to be smart about it:




        1
        **Anonymize before you paste.** Replace real names with "Client A," real numbers with approximations, real companies with "[Company]."


        2
        **Describe, don't paste.** Instead of pasting a contract, describe the key terms. "I have a SaaS contract with a 12-month term and auto-renewal. How should I negotiate the exit clause?"


        3
        **Use business-tier plans.** If your work involves sensitive data regularly, use plans that guarantee no training on your data.


        4
        **Check your company's AI policy.** Many organizations now have rules about what can and can't go into AI tools. Know yours.


        5
        **Ask hypothetical questions.** Instead of sharing the real situation, make it hypothetical: "If a company had this situation, what would you recommend?"





  Regulations
  ## GDPR, CCPA, and what they mean for your AI use.

  You don't need to be a lawyer to understand the key data protection laws that affect AI use. Here's what matters for everyday users and professionals.




        GDPR (Europe)

          - Applies if you process data of EU residents — regardless of where you are

          - Right to erasure: people can demand their data be deleted

          - Right to explanation: people can ask how automated decisions were made

          - Data minimization: only collect what you actually need

          - Fines up to 4% of annual global revenue




        CCPA (California)

          - Applies to businesses handling data of California residents

          - Right to know: consumers can ask what data is collected about them

          - Right to delete: consumers can request data deletion

          - Right to opt out of data sales

          - Fines up to $7,500 per intentional violation






  **Why this matters for AI:** When you paste someone's personal data into an AI tool, you may be transferring it to a third party (the AI provider). Under GDPR, that transfer likely requires the data subject's consent. Under CCPA, it could qualify as a "sale" of personal information if the provider uses it for training.


  Minimization
  ## Data minimization: share only what the task requires.

  Data minimization is one of the most practical privacy principles for AI users. The idea is simple: give AI only the information it needs to complete the task — nothing more.



      Over-sharing: "Help me write a response to John Smith (john.smith@company.com, Account #49281, overdue balance $3,200) who complained about our service on March 15th."
      Minimized: "Help me write a professional response to a customer who has an overdue balance and recently complained about our service. The tone should be empathetic but firm about the balance."



  The minimized version gives AI everything it needs to write a great response — without exposing any personal information. The name, email, account number, and specific balance are irrelevant to the task of drafting the response.


  Consent
  ## Understanding consent in the age of AI.

  Consent is foundational to data privacy, but AI complicates it in new ways. When someone gives you their email address, they consented to you having it — not to you pasting it into an AI model that might store it indefinitely or use it for training.




        1

          Original Purpose
          Data collected for one purpose (e.g., order fulfillment) shouldn't be repurposed for another (e.g., AI analysis) without additional consent. Using customer data to train internal AI models may violate the original consent.



        2

          Third-Party Transfer
          Pasting data into an AI tool transfers it to a third party. Most privacy policies don't cover this. If your company's privacy policy says "we don't share your data with third parties" and employees are pasting data into AI — that's a breach.



        3

          Informed Consent
          True consent requires understanding. "We may use AI to process your data" in a terms of service nobody reads isn't meaningful consent. Best practice: be specific about how AI is used and give people a genuine choice.






  Try It
  ## Anonymize sensitive data before sending it to AI.

  Use this prompt to get AI's help analyzing sensitive work without exposing private information. Notice how you describe the situation instead of pasting raw data.


Prompt — Privacy-Safe Data Analysis

```
I need to analyze [type of data, e.g. "customer support tickets"] but I can't share the raw data because it contains personal information.

Here's what I can tell you:
- The dataset has [number] records from [time period]
- Common themes I'm seeing: [list 3-5 patterns in general terms]
- The business question I need answered: [your question]

Based on this description, give me:
1. An analysis framework I can apply to the data myself
2. The specific metrics I should track
3. Questions I should ask the data to find actionable insights

Do NOT ask me to paste the raw data. Help me analyze it without exposing it.
```


  Key Concepts
  ## Review the 5 things to never share with AI.

  [Interactive: FlashDeck]


  Review
  ## Match the data type to the reason it should not be shared.


  Knowledge Check
  ## Check your understanding.


### Quiz

**Q1: What is the key difference between free/consumer AI plans and business/API plans?**
    A. Business plans are always faster
  ✓ B. Free plans may use your data for training; business plans typically do not
    C. Business plans have better AI models
    D. Free plans have stricter privacy controls
  *Free and consumer plans may store, review, or use your prompts for training. Business and API plans typically offer stronger guarantees: no training on your data, stricter access controls, and compliance certifications.*

**Q2: You need AI to help analyze a sensitive contract. What is the safest approach?**
    A. Paste the full contract into a free AI chat
  ✓ B. Describe the key terms without pasting the actual document
    C. Use a different AI tool for sensitive work
    D. Ask AI to anonymize the contract for you first
  *Describing rather than pasting is a core safe practice. Instead of sharing the actual contract, explain the situation in general terms. This keeps you productive without exposing confidential content.*

**Q3: Which of these would be safe to include in an AI prompt without anonymizing?**
    A. A customer's full name and email
  ✓ B. The general category of a problem you are solving
    C. Specific employee performance data
    D. An unreleased product roadmap
  *Describing the general category of a problem — without any identifying details — is safe. Names, emails, employee data, and proprietary information should all be anonymized or excluded.*

**Q4: What is the "rule of thumb" for free or consumer AI plans?**
    A. They are safe for all professional use
  ✓ B. Treat every prompt as if it could be seen by someone else
    C. Only avoid sharing financial data
    D. Always opt out of training data usage in settings
  *The lesson's rule of thumb: if you are using a free or consumer plan, treat every prompt as if it could be seen by someone else. This mindset naturally keeps you cautious about what you share.*


  [Next: Misinformation and Hallucinations →](/academy/ai-ethics-and-safety/misinformation-and-hallucinations)
