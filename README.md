# Design a front-end for an email client that makes API calls to send and receive emails


This project implements a single-page email client using JavaScript, HTML, and CSS. The client allows users to send, receive, archive, and organize emails, fulfilling all the requirements set by the CS50W specification.

## **Features**

### 1. Send Mail
Users can compose and send emails via a form. Upon submitting:
- A `POST` request is made to `/emails` with the recipients, subject, and body.
- After sending the email, the user is redirected to the "Sent" mailbox.

### 2. Mailbox View
Users can view emails in their Inbox, Sent mailbox, or Archive. Each mailbox:
- Displays a list of emails with details such as sender, subject, and timestamp.
- Differentiates between read (gray background) and unread emails (white background).

### 3. View Email
When an email is clicked, it displays detailed information, including:
- Sender, recipients, subject, timestamp, and body.
- A button to mark the email as "Read."

### 4. Archive/Unarchive Emails
- Users can archive emails from the Inbox or unarchive them from the Archive.
- This functionality is implemented via a `PUT` request to `/emails/<email_id>`.

### 5. Reply to Emails
Users can reply to an email by clicking the "Reply" button. This:
- Pre-fills the recipient field with the original sender.
- Adds a "Re:" prefix to the subject (avoiding duplicates if "Re:" already exists).
- Appends the original email content to the body with a timestamped header.

---

## **File Structure**

### `inbox.js`
This file contains all the JavaScript logic for:
- Navigating between views (Inbox, Sent, Archive, Compose).
- Fetching and displaying emails using API requests.
- Handling email actions like sending, archiving, and replying.

### `inbox.html`
This is the main HTML file, containing:
- A navigation bar for switching between views.
- Containers for the compose view, email list view, and email detail view.

### `styles.css`
Custom CSS for styling the email client interface, ensuring readability and visual differentiation between read and unread emails.

---

## **Setup and Usage**



 Run the Django development server:
   ```bash
   python manage.py runserver
   ```

 Open your web browser and navigate to:
   ```
   http://127.0.0.1:8000/
   ```

 Log in to your account and interact with the email client.

---

## **API Endpoints**

The application interacts with the following API endpoints:

1. **`POST /emails`**: Send an email.
   - Parameters: `recipients`, `subject`, `body`.

2. **`GET /emails/<mailbox>`**: Retrieve emails for a specific mailbox.
   - Example mailboxes: `inbox`, `sent`, `archive`.

3. **`GET /emails/<email_id>`**: Retrieve details of a specific email.

4. **`PUT /emails/<email_id>`**: Update email status (read or archived).

---

## **Distinctiveness and Complexity**

This project demonstrates the following distinctiveness and complexity:

1. **Single-Page Application**: The client dynamically updates views without requiring page reloads.

2. **Asynchronous Requests**: The client uses `fetch` to make asynchronous API calls, ensuring a smooth user experience.

3. **Email Actions**:
   - Sending emails involves handling form input and making a `POST` request.
   - Viewing, archiving, and replying to emails requires seamless interaction with multiple API endpoints.

4. **State Management**:
   - The application maintains state for which mailbox is active and which email is currently being viewed.

5. **UI Enhancements**:
   - Visual distinction between read and unread emails.
   - Pre-filled fields for replying to emails.

---

## **Requirements**

- Python 3
- Django
- A web browser (Chrome, Firefox, etc.)

---

## **Running the Project Locally**

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

3. Access the project in your browser at:
   ```
   http://127.0.0.1:8000/
   ```

---

## **Future Improvements**

- Add support for email attachments.
- Implement search functionality within mailboxes.
- Provide user notifications for new emails.

---

## **License**
This project is licensed under the MIT License.
