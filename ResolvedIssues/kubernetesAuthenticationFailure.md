Issue

Jenkins pipeline failed during Kubernetes authentication:

kubectl auth whoami

Unable to connect to the server:
lookup api-shopflow-project-k8s--8r7svp-4815e28c8234b6d5.elb.ap-south-1.amazonaws.com:
no such host

Although:

kubectl config current-context

returned:

shopflow-project.k8s.local
Root Cause
The Kops cluster was recreated.
The Kubernetes API Load Balancer (NLB) got a new DNS hostname.
Jenkins kubeconfig still pointed to the old API ELB, which no longer existed.
DNS resolution failed, causing kubectl commands in the pipeline to fail.
Resolution
1. Verified current API Load Balancer
aws elbv2 describe-load-balancers

Confirmed the API ELB DNS had changed.

2. Removed old kubeconfig
rm -rf ~/.kube
rm -rf /var/lib/jenkins/.kube
3. Exported a fresh kubeconfig from Kops
export KOPS_STATE_STORE=s3://<kops-state-store>

kops export kubecfg \
  --name shopflow-project.k8s.local \
  --admin
4. Verified cluster access
kubectl get nodes
kubectl auth whoami
5. Copied kubeconfig to Jenkins
mkdir -p /var/lib/jenkins/.kube

cp ~/.kube/config /var/lib/jenkins/.kube/config

chown -R jenkins:jenkins /var/lib/jenkins/.kube

chmod 600 /var/lib/jenkins/.kube/config
6. Tested as Jenkins user
sudo su - jenkins

export KUBECONFIG=/var/lib/jenkins/.kube/config

kubectl get nodes
kubectl auth whoami
7. Restarted Jenkins
sudo systemctl restart jenkins
Commands Used
# Check API Load Balancer
aws elbv2 describe-load-balancers

# Remove old kubeconfigs
rm -rf ~/.kube
rm -rf /var/lib/jenkins/.kube

# Export fresh kubeconfig
export KOPS_STATE_STORE=s3://<kops-state-store>
kops export kubecfg --name shopflow-project.k8s.local --admin

# Verify access
kubectl get nodes
kubectl auth whoami

# Copy kubeconfig for Jenkins
mkdir -p /var/lib/jenkins/.kube
cp ~/.kube/config /var/lib/jenkins/.kube/config
chown -R jenkins:jenkins /var/lib/jenkins/.kube
chmod 600 /var/lib/jenkins/.kube/config

# Test as Jenkins
sudo su - jenkins
export KUBECONFIG=/var/lib/jenkins/.kube/config
kubectl get nodes
kubectl auth whoami

# Restart Jenkins
sudo systemctl restart jenkins

Lesson Learned: Whenever a Kops cluster or its API Load Balancer is recreated, regenerate and redistribute the kubeconfig. A stale API ELB hostname in the kubeconfig causes lookup ... no such host errors in kubectl and Jenkins pipelines.