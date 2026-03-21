# Adding New Languages to the i18n System

To add a new language (e.g., French - `fr`):

1. **Create Translation File**:
   - Create a new file `locales/fr.json`.
   - Copy the structure from `locales/en.json`.
   - Translate all values into French.

2. **Register the Language**:
   - Open `script.js`.
   - Add `'fr'` to the `this.languages` array in the `I18nManager` constructor:
     ```javascript
     this.languages = ['en', 'vi', 'th', 'ja', 'zh', 'fr'];
     ```

3. **Update the UI**:
   - Open `index.html`.
   - Add a new button to the `.lang-switcher` div:
     ```html
     <button class="lang-btn" data-lang="fr">FR</button>
     ```
   - (Optional) Add a new `hreflang` tag to the `<head>` for SEO:
     ```html
     <link rel="alternate" hreflang="fr" href="https://www.roseandcoitsolutions.com/fr" />
     ```

4. **Verify**:
   - Refresh the page and test the new language button.
   - The system will automatically handle loading and persistence.
