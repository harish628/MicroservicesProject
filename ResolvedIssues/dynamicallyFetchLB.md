Issue

Needed to dynamically fetch the Kubernetes Ingress AWS LoadBalancer DNS during the Jenkins pipeline and use it to update ALLOWED_ORIGINS in configmap.yaml before deploying.

Solution
Retrieved the Ingress LoadBalancer hostname using kubectl with jsonpath.
Stored it in a Jenkins environment variable (env.INGRESS_LB) inside a script block (no environment {} declaration required).
Updated the ALLOWED_ORIGINS value in configmap.yaml using sed.
Verified the change with grep.
Commands / Jenkins Snippets

Get LoadBalancer DNS

env.INGRESS_LB = sh(
    script: "kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'",
    returnStdout: true
).trim()

Update ConfigMap

sh """
sed -i "s|^  ALLOWED_ORIGINS:.*|  ALLOWED_ORIGINS: http://${env.INGRESS_LB}|" kubernetes/base/config/configmap.yaml
"""

Verify

grep ALLOWED_ORIGINS kubernetes/base/config/configmap.yaml
Key Takeaway
Use env.VARIABLE = ... for values generated during pipeline execution.
environment {} is not required for dynamically generated values like the Ingress LoadBalancer hostname.