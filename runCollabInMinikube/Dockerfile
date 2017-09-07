FROM node:6.11.2

RUN apt-get update
RUN apt-get install -y supervisor

ARG GIT_URL=https://github.com/eclipse/orion.client.git
ARG ORION_COLLAB_SERVER_URL=http://192.168.99.100:32611/

ENV SHELL /bin/bash
ENV HELM_HOME /home/orion/.helm

WORKDIR /opt/orion

RUN sed -i.bak "/^# deb .*partner/ s/^# //" /etc/apt/sources.list \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y curl git apt-transport-https apt-utils build-essential python vim bash-completion sudo libssl-dev libcurl3 \
    && printf "deb https://deb.nodesource.com/node_6.x xenial main\ndeb-src https://deb.nodesource.com/node_6.x xenial main" > /etc/apt/sources.list.d/nodesource.list \
    && curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - \
    && apt-get update \
    && apt-get -y dist-upgrade \
    && curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \
    && chmod 755 ./kubectl \
    && mv ./kubectl /usr/local/bin/kubectl \
    && curl -L https://clis.ng.bluemix.net/download/bluemix-cli/latest/linux64 | tar vxz \
    && Bluemix_CLI/install_bluemix_cli \
    && rm -rf /var/lib/apt/lists/

RUN useradd --user-group -G sudo --shell /bin/bash --comment "Orion account" --create-home --home-dir /home/orion orion \
    && echo "orion ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/orion \
    && chmod 440 /etc/sudoers.d/orion \
    && runuser -l orion -c "bx plugin install container-service -r Bluemix -f" \
    && runuser -l orion -c "bx plugin install container-registry -r Bluemix -f" \
    && runuser -l orion -c "bx plugin install dev -r Bluemix -f"

RUN cd /root && \
    git clone $GIT_URL && \
    cd /root/orion.client && \
    git fetch && \
    git checkout origin/sidney/collabInKube && \
    sed -i.bak "s/\"hubUrl\".*/\"hubUrl\":\"${ORION_COLLAB_SERVER_URL}\"/" /root/orion.client/bundles/org.eclipse.orion.client.ui/web/defaults.pref
    cd /root/orion.client/modules/orionode && \
    rm -fr ./node_modules && \
    npm install http-proxy node-pty xterm@2.9.2 && \
    npm install --no-optional && \
    ./node_modules/.bin/grunt --skipTest --fp && \
    rm -fr ./node_modules ./target && \
    npm install http-proxy node-pty xterm@2.9.2 --production && \
    npm install --production --no-optional && \
    cd .. && \
    cp -a orionode/. /opt/orion && \
    chown -R orion:orion /opt/orion && \
    cd orionode.collab.hub && \
    npm install && \
    cd .. && \
    cp -a orionode.collab.hub/. /opt/orion/collab

RUN curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get | bash

COPY startup.sh /opt/orion/startup.sh
RUN chown root:orion /opt/orion/startup.sh
RUN chmod 550 /opt/orion/startup.sh
#EXPOSE 8081
USER orion
VOLUME /home/orion
COPY supervisord.conf /home/orion
ENTRYPOINT /opt/orion/startup.sh