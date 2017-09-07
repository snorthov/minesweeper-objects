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

kubectl config set-credentials orion --token=$(cat /run/secrets/kubernetes.io/serviceaccount/token) || true
kubectl config set-cluster otc --server=https://${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT} --certificate-authority=/run/secrets/kubernetes.io/serviceaccount/ca.cat || true
kubectl config set-context orion --cluster=orion --namespace=$(cat /run/secrets/kubernetes.io/serviceaccount/namespace) --user=orion || true
kubectl config use-context orion || true

helm init --upgrade
mkdir -p /home/orion/.orion
cat /run/secrets/kubernetes.io/serviceaccount/token > /home/orion/.orion/.pass || true

chown -R orion:orion /home/orion
supervisord -c /home/orion/supervisord.conf 