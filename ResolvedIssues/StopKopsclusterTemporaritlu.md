Issue: Wanted to temporarily stop the Kops cluster to avoid EC2 charges without deleting it.

Resolution: Stopped the master and worker EC2 instances instead of deleting the cluster.

Commands:

# Get instance IDs
aws ec2 describe-instances --filters "Name=tag:KubernetesCluster,Values=shopflow-project.k8s.local"

# Stop instances
aws ec2 stop-instances --instance-ids <master-instance-id> <worker-instance-id>

# Start instances (when needed)
aws ec2 start-instances --instance-ids <master-instance-id> <worker-instance-id>