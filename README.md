# Project 2

Web Programming with Python and JavaScript


Talk-space is my chat app using flask and javascript. Each html page has a separate javascript file.

The index page is only seen the first time of accessing the site and users set their display name.

The channels page displays a grid of channel cards which show the name and descriptions. A channel can be joined using the buttons. Channels already joined by the user will say "let's chat" instead. This is known from variables in local storage.

Creating a page will need a name, and colour scheme. the description is optional and can be changed later. The colour scheme personalises the messages in the chat.

Once joined users are taken to the chat page where they can send messages. There is a toggle (adapted from w3schools) for sending when the enter key is pressed for those who wish to send multiple messages quickly. Users are able to delete their own messages using the "x" and will see their messages on the right while other parties will be on the left.

If the user created the chat they are given admin privilages and will be able to access the admin link on the nav when in the channel. From here the admin can view a list of users who have joined the channel. They can also update the description and delete the channel. To avoid accidental deletion they will be prompted to confirm this and the channel will be removed from the channel list in real time.

Personal touches I have added include: deleting messages and channels, alowing admins to update descriptions, colour schemes and using an external API to run a profanity check on messages and channel names to avoid rude words.