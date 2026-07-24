Issue

Jenkins pipeline failed even though the kubeconfig context was correct.

Error:

Unable to connect to the server:
dial tcp: lookup api-shopflow-project-k8s--8r7svp-8ceb17cf4c5c009f.elb.ap-south-1.amazonaws.com: no such host
Root Cause
The kOps cluster/API Load Balancer was recreated, resulting in a new Kubernetes API ELB hostname.
Jenkins was still using an old kubeconfig pointing to the deleted API ELB.
Root user's kubeconfig had the updated API endpoint, but Jenkins' kubeconfig was outdated.
Verification Commands

Check current kubeconfig:

kubectl config view --minify

Check cluster exists:

kops get cluster

Switch to Jenkins user:

sudo su - jenkins

Check Jenkins kubeconfig:

cat /var/lib/jenkins/.kube/config | grep server
kubectl config view --minify
Resolution

Copy the updated kubeconfig to the Jenkins user:

sudo mkdir -p /var/lib/jenkins/.kube
sudo cp /root/.kube/config /var/lib/jenkins/.kube/config
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube

Verify connectivity as Jenkins:

sudo su - jenkins
export KUBECONFIG=/var/lib/jenkins/.kube/config

kubectl get nodes
kubectl auth whoami
Key Learning

Whenever a kOps cluster or Kubernetes API ELB is recreated, always update the Jenkins kubeconfig with the latest one. Otherwise, Jenkins will continue using the old API endpoint and fail with no such host DNS errors.