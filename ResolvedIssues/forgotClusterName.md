Issue

Forgot the Kops cluster name and couldn't delete the cluster.

Resolution

Listed the clusters from the Kops state store, identified the cluster name, and deleted it using Kops.

Commands
# Set the Kops state store
export KOPS_STATE_STORE=s3://<kops-state-store>

# Verify the state store
echo $KOPS_STATE_STORE

# List available clusters
kops get clusters

# Delete the cluster
kops delete cluster --name <cluster-name> --yes

# Verify deletion
kops get clusters

Example

export KOPS_STATE_STORE=s3://harish.harvis
kops get clusters
kops delete cluster --name shopflow-project.k8s.local --yes
kops get clusters

Result: The Kops cluster and its AWS-managed resources were deleted successfully.