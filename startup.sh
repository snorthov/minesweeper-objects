#/bin/bash
set -e

#Prepare home directory first time
vol=/home
if [ -d "$vol" -a "$(stat -c '%U' "$vol" 2>/dev/null)" = "root" ]; then
    sudo cp -a /etc/skel/. ~
    sudo chown -R orion:orion "$vol"
    chmod -R o-rwx "$vol"
    grep -q -F "source <(kubectl completion bash)" ~/.bashrc || echo "source <(kubectl completion bash)" >> ~/.bashrc
    mkdir -p ~/.orion
fi

#Enable proxy port
sed -i -e '/orion.proxy.port=/d' /opt/orion/orion.conf
echo "orion.proxy.port=3000" >> /opt/orion/orion.conf
sed -i -e '/orion.context.listenPath=false/d' /opt/orion/orion.conf
echo "orion.context.listenPath=true" >> /opt/orion/orion.conf
sed -i -e '/orion.context.path=/d' /opt/orion/orion.conf
echo "orion.context.path=/edit" >> /opt/orion/orion.conf

kubectl config set-credentials orion --token=$(cat /run/secrets/kubernetes.io/serviceaccount/token) || true
kubectl config set-cluster otc --server=https://${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT} --certificate-authority=/run/secrets/kubernetes.io/serviceaccount/ca.cat || true
kubectl config set-context orion --cluster=orion --namespace=$(cat /run/secrets/kubernetes.io/serviceaccount/namespace) --user=orion || true
kubectl config use-context orion || true

#helm init --upgrade
mkdir -p /home/orion/.orion
cat /run/secrets/kubernetes.io/serviceaccount/token > /home/orion/.orion/.pass || true

chown -R orion:orion /home/orion

# Run the application in the background
cd /home/minesweeper
node server.js 3000 &

# Run the development envionment in the background
cd /opt/orion
#node server.js --p 8081 --w /home/ &
node server.js --p 8081 --pwd /home/orion/.orion/.pass --w /home/ &

# Wait forever (keep PID 1 alive so the pod won't get killed)
tail -f /dev/null