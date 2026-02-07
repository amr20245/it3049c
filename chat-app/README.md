# Chat App

This directory contains the interactive chat application for IT3049C. It implements a messaging app that uses the IT3049C chat server to fetch messages and allows sending messages. The app uses HTML, CSS with Bootstrap, and JavaScript with DOM manipulation and fetch API.

## Features

- Responsive layout with Bootstrap.
- Scrollable chat area.
- Fetches and displays messages from the server.
- Sends messages to the server with sender name and text.
- Updates messages automatically every 10 seconds.

## Self-Assessment

- Structural requirements: Created header, chat area, and footer using Bootstrap components.
- Page loads messages from the server: Yes, implemented asynchronous fetchMessages to load from `https://it3049c-chat.fly.dev/messages`.
- Page sends messages to the server: Yes, implemented sendMessage to POST to `/messages`.
- Webpage hosted on GitHub Pages: This chat app is accessible via GitHub Pages at path `/chat-app/`.
- Proper usage of git and GitHub: Committed files individually with descriptive commit messages.
