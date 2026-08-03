Here is a concise `README.md` tailored specifically to the ES Module version of your tracking script.

---

# Plug-and-Play Analytics Tracker

A lightweight, zero-backend analytics tracker built as an ES module. It automatically captures page metadata, user resolution, and custom attributes directly out of the box.

## Quick Start

### 1. File Setup

Ensure your project contains the tracker file (`tracker.js`) alongside your html page.

```text
your-project/
├── index.html
└── tracker.js

```

### 2. Basic Usage

Import `initTracker` into your website using a `<script type="module">` tag.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Website</title>

  <!-- Import and run the tracker -->
  <script type="module">
    import { initTracker } from './tracker.js';

    // Start tracking with optional custom parameters
    initTracker({ appName: 'My Web App' });
  </script>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>

```

---

## Accessing the Tracked Data

You can retrieve and inspect the generated analytics payload programmatically in two ways:

### Method A: From the Return Value

`initTracker()` returns the complete payload immediately upon execution:

```javascript
import { initTracker } from './tracker.js';

const payload = initTracker({ env: 'development' });

console.log('Current URL:', payload.url);
console.log('Screen Resolution:', payload.screenResolution);

```

### Method B: Using `getPayload()`

If you need to access the collected metrics later in your code execution:

```javascript
import { initTracker, getPayload } from './tracker.js';

initTracker();

// Later in your application...
button.addEventListener('click', () => {
  const data = getPayload();
  console.log('Recorded at timestamp:', data.timestamp);
});

```

---

## 🛠️ Local Development & Testing

Browsers require an HTTP server to run ES Modules (`import`/`export`).

1. **Start a local dev server** (e.g., using Node's `serve` or VS Code Live Server):
```bash
npx serve .

```


2. Open `http://localhost:3000` in your browser.
3. Open **DevTools (F12) → Console** to inspect the tracked output.

---

## Payload Structure

The generated payload automatically contains:

| Property | Type | Description |
| --- | --- | --- |
| `url` | `string` | Full URL of the current page |
| `referrer` | `string` | Referring URL (`'Direct'` if none) |
| `screenResolution` | `string` | User screen width × height |
| `timestamp` | `string` | ISO 8601 timestamp of page view |
| `...custom` | `any` | Any custom key-value pairs passed into `initTracker()` |
