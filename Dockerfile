FROM ghost:latest


RUN rm "$GHOST_SOURCE/config.js"
ADD config.js "$GHOST_SOURCE/config.js"
RUN chown -R user "$GHOST_SOURCE/config.js"
COPY docker_entrypoint.sh /entrypoint.sh
