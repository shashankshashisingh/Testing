# Testing: Larkfield Asset Management website

A static, responsive website for a fictional asset management company. No build step and no dependencies other than Google Fonts.

## Files

- `index.html`: page content (hero with growth chart, strategies, approach, fees, team, notes, contact)
- `styles.css`: all styling
- `script.js`: growth chart, contact form validation and Netlify Forms submission

## Run it locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Publish with GitHub Pages

1. Push this folder's contents to the root of your `Testing` repository.
2. In the repository, open Settings, then Pages.
3. Under Build and deployment, choose "Deploy from a branch", select `main` and `/ (root)`, and save.

## Contact form on Netlify

Deploy this site to Netlify with Forms detection enabled. The `contact` form submits enquiries to Netlify Forms, including the visitor's name, email address, investor type and message. A hidden honeypot field helps filter spam. The form shows confirmation only after a successful submission and preserves the entered details if submission fails.

View received enquiries in the site's Netlify Forms dashboard, including the spam folder when needed. To receive email alerts, configure a form submission notification under **Project configuration > Notifications > Emails and webhooks > Form submission notifications**. The email link on the page does not automatically configure notifications.

GitHub Pages and a basic local static server do not process Netlify Forms submissions. The form becomes available after Netlify deploys and detects the updated HTML.

## Before using it for a real company

- Replace the placeholder company name, figures, people, address and contact details.
- The chart is a hypothetical illustration using fixed 7% and 2% returns. Have a compliance professional review all performance, fee and risk wording for your jurisdiction.
- Configure form submission email notifications in Netlify if the team needs inbox alerts, and monitor received enquiries.
