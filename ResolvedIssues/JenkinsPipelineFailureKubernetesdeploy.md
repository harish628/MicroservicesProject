Issue

Jenkins pipeline failed while creating the Ingress namespace.

Error:

Error from server (Forbidden): unknown (post namespaces)

Initially it looked like an RBAC issue, but the actual problem was that the Jenkins pipeline was not loading a valid kubeconfig, so kubectl had no current context.

Root Cause

The pipeline debug stage showed:

whoami
jenkins

HOME=/var/lib/jenkins

KUBECONFIG=

kubectl config current-context
error: current-context is not set

This indicated that the Jenkins job wasn't using a configured Kubernetes context.

However, logging into the server as the jenkins user showed:

sudo su - jenkins

kubectl config current-context
shopflow-project.k8s.local

kubectl auth whoami

Output:

Username: kubecfg-root
Groups: system:masters

This confirmed:

Kubernetes RBAC was correct.
The jenkins user had cluster-admin access.
The issue was the Jenkins service/job environment, not Kubernetes permissions.
Debug Commands Used
Check Jenkins pipeline environment
stage('Debug Kubeconfig') {
    steps {
        sh '''
        whoami
        echo "HOME=$HOME"
        echo "KUBECONFIG=$KUBECONFIG"
        kubectl config current-context
        '''
    }
}
Verify RBAC
kubectl auth whoami

kubectl auth can-i create namespaces

Expected:

Username: kubecfg-root
Groups: system:masters

yes
Verify as Jenkins user
sudo su - jenkins

kubectl config current-context

kubectl auth whoami

kubectl auth can-i create namespaces

Expected:

shopflow-project.k8s.local

Username: kubecfg-root

yes
Resolution

Verified that the jenkins user had the correct kubeconfig and cluster-admin privileges. The failure was due to the Jenkins pipeline environment not loading the kubeconfig correctly. Ensured Jenkins runs with the correct kubeconfig/context before executing kubectl commands.

Key Takeaway

Always verify the Kubernetes context inside the Jenkins pipeline before troubleshooting RBAC.

Useful commands:

kubectl config current-context

kubectl auth whoami

kubectl auth can-i create namespaces

These quickly determine whether the issue is:

Missing kubeconfig/context
Incorrect Kubernetes user
RBAC permissions
Or a Jenkins environment configuration problem.