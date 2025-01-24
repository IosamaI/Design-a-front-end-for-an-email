document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-view').addEventListener('submit', send_email);
  load_mailbox('inbox');
});

function compose_email() {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-email-view').style.display = 'none';
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function view_email(email_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-email-view').style.display = 'block';


  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      document.querySelector('#view-email-view').innerHTML = `
        <ul class="list-group">
          <li class="list-group-item"><strong>From:</strong> ${email.sender}</li>
          <li class="list-group-item"><strong>To:</strong> ${email.recipients}</li>
          <li class="list-group-item"><strong>Subject:</strong> ${email.subject}</li>
          <li class="list-group-item"><strong>Timestamp:</strong> ${email.timestamp}</li>
          <li class="list-group-item"><strong>Message:</strong> ${email.body}</li>
        </ul>`;


      if (!email.read) {
        fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({ read: true })
        });
      }

      const btn_arch = document.createElement('button');
      btn_arch.className = email.archived ? 'btn btn-success' : 'btn btn-danger';
      btn_arch.textContent = email.archived ? 'Unarchive' : 'Archive';
      btn_arch.addEventListener('click', () => {
        fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({ archived: !email.archived })
        })
          .then(() => load_mailbox('inbox'));
      });
      document.querySelector('#view-email-view').append(btn_arch);

      const btn_del = document.createElement('button');
      btn_del.className = 'btn btn-danger';
      btn_del.textContent = 'Delete';
      btn_del.addEventListener('click', () => {
        fetch(`/emails/${email_id}`, {
          method: 'DELETE',
        })
          .then(() => load_mailbox('inbox'))
          .catch(error => console.error('Error deleting email:', error));
      });
      document.querySelector('#view-email-view').append(btn_del);

      const btn_reply = document.createElement('button');
      btn_reply.className = 'btn btn-primary';
      btn_reply.textContent = 'Reply';
      btn_reply.addEventListener('click', () => {
        compose_email();
        document.querySelector('#compose-recipients').value = email.sender;
        document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
        document.querySelector('#compose-body').value = `\n\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
      });
      document.querySelector('#view-email-view').append(btn_reply);

      const btn_fwd = document.createElement('button');
      btn_fwd.className = 'btn btn-secondary';
      btn_fwd.textContent = 'Forward';
      btn_fwd.addEventListener('click', () => {
        compose_email();
        document.querySelector('#compose-recipients').value = email.recipients;
        document.querySelector('#compose-subject').value = `Fwd: ${email.subject}`;
        document.querySelector('#compose-body').value = `\n\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
      });
      document.querySelector('#view-email-view').append(btn_fwd);

      const btn_mark_read = document.createElement('button');
      btn_mark_read.className = 'btn btn-info';
      btn_mark_read.textContent = email.read ? 'Mark as Unread' : 'Mark as Read';
      btn_mark_read.addEventListener('click', () => {
        fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({ read: !email.read })
        })
          .then(() => load_mailbox('inbox'));
      });
      document.querySelector('#view-email-view').append(btn_mark_read);
    })
    .catch(error => {
      document.querySelector('#view-email-view').innerHTML = '<p>Error loading email. Please try again later.</p>';
      console.error('Error:', error);
    });
}

function load_mailbox(mailbox) {
  const emailsView = document.querySelector('#emails-view');
  emailsView.innerHTML = '<p>Loading...</p>';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-email-view').style.display = 'none';
  emailsView.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emailsView.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
      if (emails.length === 0) {
        emailsView.innerHTML += '<p>No emails to show.</p>';
      } else {
        emails.forEach(email => {
          const div = document.createElement('div');
          div.className = 'email-item list-group-item';
          div.innerHTML = `
            <div><strong>Sender:</strong> ${email.sender}</div>
            <div><strong>Subject:</strong> ${email.subject}</div>
            <div><strong>Timestamp:</strong> ${email.timestamp}</div>`;
          div.addEventListener('click', () => view_email(email.id));
          div.style.backgroundColor = email.read ? '#f5f5f5' : 'white';
          emailsView.appendChild(div);
          emailsView.appendChild(document.createElement('hr'));
        });
      }
    })
    .catch(error => {
      emailsView.innerHTML = '<p>Error loading mailbox. Please try again later.</p>';
      console.error('Error:', error);
    });
}

function send_email(event) {
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value.trim();
  const subject = document.querySelector('#compose-subject').value.trim();
  const body = document.querySelector('#compose-body').value.trim();

  if (!recipients || !subject || !body) {
    alert('Please fill in all fields');
    return;
  }

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients,
      subject,
      body
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(result => {
      console.log(result);
      load_mailbox('sent');
    })
    .catch(error => console.error('Error sending email:', error));
}
