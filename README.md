# Testing: Larkfield Asset Management website

A static, responsive website for a fictional asset management company. No build step and no dependencies other than Google Fonts.

## Files

- `index.html`: page content (hero with growth chart, strategies, approach, fees, team, notes, contact)
- `styles.css`: all styling
- `script.js`: growth chart and contact form validation

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

## Before using it for a real company

- Replace the placeholder company name, figures, people, address and contact details.
- The chart is a hypothetical illustration using fixed 7% and 2% returns. Have a compliance professional review all performance, fee and risk wording for your jurisdiction.
- The contact form checks input in the browser but does not send anything. Connect it to a form service or backend.
