FROM    node:alpine

# Bundle app source
COPY    . /marqdown

# Change working directory to app source
WORKDIR /markdown

# Expose port
EXPOSE  9001

# Docker command
CMD     ["node", "/marqdown/server.js", "start", "9001"];
