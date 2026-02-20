---
title: "How to build a Gravatar Icon with Next.js"
description: "Learn how to implement and integrate Gravatar icons into your Next.js application. This tutorial shows you how to create a reusable Gravatar component for displaying user profile images."
pubDate: November 25 2022
tags: ["nextjs", "gravatar", "react", "avatar", "api", "md5", "tutorial"]
author: "Matthew Bub"
---

Preview: https://with-nextjs-and-gravatar.vercel.app/

## Building the app

### Initialize a Nextjs app

```sh
npx create-next-app@latest --use-npm my-gravatar-app
```

Next, install the Node.js library for Gravatar.

```sh
npm install gravatar
```

### Setup an API Endpoint

Create a JavaScript file to handle the network request and send the data back to the client. `/pages/api/gravatar.js`

```js
const gravatar = require("gravatar");

/**
 * @param {Object} req - Express request object
 * @param {Object} req.body - Express request body
 * @param {string} req.body.email - User email
 * @returns {string} - Gravatar URL
 */
export default function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const avatar = gravatar.url(
        email,
        { s: "100", r: "x", d: "retro" },
        true
      );
      res.status(200).json({ avatar });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
```

### Create the React Components

In a new file, create a React component called Gravatar. This component won't do anything fancy, just render the avatar if a source is provided. `./components/Gravatar.jsx`

```jsx
export default function Gravatar({ email = "", avatar = "", size = 80 }) {
  return (
    <div>
      {avatar && (
        <img
          className="gravatar"
          src={avatar}
          alt={email}
          width={size}
          height={size}
        />
      )}
    </div>
  );
}
```

(Optional) Create a Loading component to account for loading behavior. You could add a better loading icon that what has been present here, we're just foucsed on simplicity. `./components/Loading.jsx`

```jsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

Now modify the `pages/index.js` to serve both of these components.

```jsx
import { useEffect, useState } from "react";
import Gravatar from "../components/Gravatar";
import Loading from "../components/Loading";

export default function Home() {
  const [email, setEmail] = useState("your@email.here");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateAvatar();
  }, []);

  const updateAvatar = async () => {
    setLoading(true);
    setAvatar("");

    const response = await fetch("/api/gravatar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const { avatar } = await response.json();

    setLoading(false);
    setAvatar(avatar);
  };

  return (
    <div className="container">
      <main>
        {loading && <Loading />}
        {avatar && <Gravatar email={email} avatar={avatar} size={100} />}
      </main>
    </div>
  );
}
```

## Launch the app

Back into the application's terminal, run the development script listed in the package.json. Open the browser to localhost:3000 and you should see the completed app.

```sh
npm run dev
```

## Bonus: Dynamically update the Gravatar Icon

So far we've covered how to set the Gravatar Icon on when the app loads. Let's go a step further an make create a form that will accept a user's email address as an input, and then update the Gravatar icon when the user submits the form. `./components/GravatarChanger.jsx`

```jsx
export default function GravatarChanger({
  email = "",
  disabled = false,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit}>
      <label>Gravatar Tester</label>
      <span>Try your email address to see your Gravatar</span>
      <input
        type="email"
        value={email}
        onChange={onChange}
        placeholder="Enter your email address"
      />
      <button type="submit" disabled={disabled}>
        Change Gravatar
      </button>
    </form>
  );
}
```

Then, modify the home page to accommodate this new component.

```diff
import { useEffect, useState } from 'react';
import Gravatar from '../components/Gravatar';
import Loading from '../components/Loading';
import GravatarChanger from '../components/GravatarChanger';

export default function Home() {
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateAvatar();
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateAvatar();
  };

  const updateAvatar = async () => {
    setLoading(true);
    setAvatar('');

    const response = await fetch('/api/gravatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    const { avatar } = await response.json();

    setLoading(false);
    setAvatar(avatar);
  };

  return (
    <div className='container'>
      <main>
        {loading && <Loading />}
        {avatar && <Gravatar email={email} avatar={avatar} size={100} />}
        <GravatarChanger
          disabled={loading}
          email={email}
          onChange={handleEmailChange}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
```

At this point you have a Gravatar component that can be changed based on user input!
