
# dockerfile

# docker build . -f nodejs-min.dockerfile -t nodejs-min
# docker run -di -p 2222:22 --name nodejs-min simple-terminal

FROM node:22

ARG password=node

RUN apt update && apt install -y openssh-server
RUN mkdir /var/run/sshd

# Set root password for SSH access (change 'node' to your desired password)
RUN echo "root:${password}" | chpasswd

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i "s/#Port 22/Port ${ssh}/" /etc/ssh/sshd_config
EXPOSE $ssh

RUN printf  "%s\n" \
"#!/bin/bash" \
"set -e" \
"whoami" \
"echo" \
"echo 'starting ssh'" \
"service ssh start" \
"echo" \
"echo" \
"/bin/bash" \
 > 'start-up.sh'
 
CMD ["bash","start-up.sh"]

