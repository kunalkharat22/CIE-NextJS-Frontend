# Complaint Intelligence Engine (CIE) - Prototype Walkthrough

## Overview
The Complaint Intelligence Engine (CIE) is a comprehensive platform designed to transform customer complaints into actionable business intelligence. It streamlines the entire lifecycle of a complaint from intake and risk scoring to near-real-time pilot dashboard coaching and strategic trend conversion into campaign draft generation for human review during pilot evaluation. This prototype demonstrates how businesses can triage issues faster and turn negative feedback into trust-building opportunities.

## Workflow at a Glance
1.  **Monitor**: Track risk levels and critical alerts on the near-real-time pilot dashboard.
2.  **Intake & Score**: Input raw complaint text to generate instant AI-driven risk assessments.
3.  **Manage**: Review, update, and filter the master list of complaints.
4.  **Coach**: Provide live agents with AI-suggested responses during active customer interactions.
5.  **Analyze**: Identify emerging patterns and trends from aggregated complaint data.
6.  **Act**: Convert negative trends into targeted recovery campaigns to rebuild trust.

---

## Step-by-Step Walkthrough

### 1. The Dashboard: Your Command Center
Start your journey at the **Dashboard**. This is the operational hub for the CIE.
*   **Hero Metrics**: At the top, you'll see key performance indicators like *Active Risk*, *Avg Resolution Time*, and *Customer Sentiment*. These give you an immediate health check of your support operations.
*   **Risk Overview**: The center stage features three primary cards: *High Risk*, *Medium Risk*, and *Low Risk*. These categorize active complaints based on severity.
*   **High Risk Alerts**: Pay special attention to the Alerts section. This dynamic feed highlights complaints that require immediate intervention—often those with legal or churn implications.
*   **Updates**: Notice how the numbers and charts reflect the current state of the "demo" store. As you add new complaints, these metrics will update in the near-real-time pilot dashboard.

### 2. Complaints Intake: Processing New Issues
Navigate to **Complaints** > **Intake**. This page simulates the arrival of a new customer issue, whether from email, chat, or voice transcription.
*   **Entering Data**: You can manually type a complaint description or use the "Load Sample" buttons to populate realistic scenarios (e.g., a "Legal Threat" or "Billing Dispute").
*   **Key Fields**: The form captures essential metadata: Customer Name, Channel (Email/Phone/Chat), and the raw Complaint Description.
*   **Scoring**: Click the **Score Complaint** button. The system analyze the text and instantly generates a clear breakdown:
    *   **Risk Level**: Classified as High, Medium, or Low.
    *   **Priority Score**: A numerical value (0-100) indicating urgency.
    *   **Reasoning**: A bulleted list explaining *why* the AI assigned this score (e.g., "Mention of legal action," "High churn words used").
*   **Saving**: Click **Save Complaint**. This action commits the data to the system's in-memory store. You will see a success notification, and this specific complaint will now influence your Dashboard metrics and appear in the Complaints List.

### 3. Complaints List: Managing the Queue
Head over to **Complaints** (the main list page).
*   **The View**: Here you see a tabular view of all processed complaints.
*   **Filtering**: Use the filters at the top to narrow down the list by **Channel** (e.g., only show Phone calls) or **Risk Level** (e.g., only show High Risk items).
*   **Columns**: The table displays ID, Customer, Channel, Risk, Sentiment, Summary (a short extract), Date, and Status.
*   **Mobile Responsiveness**: If you view this on a mobile device, the layout automatically transforms. The wide table vanishes, replaced by a stack of mobile-friendly cards that display the most critical info (Name, Status, and a short summary) without requiring horizontal scrolling.

### 4. Live Coaching: Near-Real-Time Agent Assistance
Navigate to **Live Coaching**. This section simulates an agent's workspace during an active interaction.
*   **Live vs. History**: Toggle between "Live" active sessions and "History" for past interactions.
*   **The Interface**:
    *   **Queue**: On the left, a list of active customers waiting or currently speaking.
    *   **Transcript**: In the center, a near-real-time chat or voice transcript appears. Message bubbles show the flow of conversation.
    *   **AI Coach**: On the right, the "AI Coach" provides context-aware suggestions.
*   **AI Suggestions**: As the transcript "updates" (in a real scenario), the AI Coach suggests the next best response. You can click **Apply** to use the text or **Escalate** if the issue is too complex.
*   **Outcome Log**: Below the coach, a log tracks actions taken, ensuring a complete audit trail of the assistance provided.

### 5. Trends: Identifying Clusters
Visit the **Trends** page.
*   Instead of looking at individual complaints, this view aggregates them into **Clusters**.
*   You might see a trend named "Shipping Delays - Northeast" or "Login Failure - iOS App."
*   This page connects the dots, showing you that 50 separate complaints are actually symptoms of one larger problem. This is the bridge between support and strategy.

### 6. Campaign Studio: Closing the Loop
Finally, go to **Campaign Studio** > **Create**. This is where you turn insights into action.
*   **Select a Trend**: Pick one of the trends identified in the previous step (e.g., a "Service Outage").
*   **Generate Campaign**: The system uses the trend data to pre-fill a marketing campaign.
    *   **Headline & Text**: Generated copy drafts (e.g., "We Fixed the Outage - Here's a Discount") addresses the specific pain point. You can edit this text freely.
    *   **Call to Action (CTA)**: Define where the user should go (e.g., a support page or coupon link).
*   **Ad Preview**: Watch the "Mobile 320px" preview card update instantly as you type. This ensures your recovery message looks good on customer devices.
*   **Platform Connection**: Toggle platforms like Google Ads, Meta, or Shopify. In this prototype, these are simulated toggles.
*   **Launch**: Click **Launch Campaign**. Confirm the details in the modal.

### 7. Review Active Campaigns
After publishing, you are redirected to **Campaign Studio** > **Campaigns**.
*   Here you see your newly created campaign listed as "Active" or "Published."
*   This closes the loop: A complaint came in, was scored, aggregated into a trend, and resolved via a proactive outbound campaign.

---

## What this prototype simulates
Please note this is a **frontend-only prototype** designed for demonstration purposes:
*   **Data Persistence**: Data is stored in the browser's memory (`localStorage` or React State). Refreshing the page may reset non-hardcoded data depending on the specific state configuration.
*   **Scoring Engine**: The "AI" scoring uses sophisticated rule-based logic and keyword analysis within the client, mimicking the behavior of a backend LLM.
*   **Connectivity**: Features like "Connecting to Shopify" or "Sending to Google Ads" simulate the API interactions and success states without actually connecting to external services.
