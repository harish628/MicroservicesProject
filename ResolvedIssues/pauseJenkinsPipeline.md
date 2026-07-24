Issue

Needed to pause the Jenkins pipeline for a fixed duration before executing the next step (e.g., waiting for a service or LoadBalancer to become ready).

Resolution

Used the Jenkins built-in sleep step (recommended) or the Linux sleep command inside an sh block.

Commands

Recommended (Jenkins):

sleep time: 30, unit: 'SECONDS'

Inside sh:

sh '''
sleep 30
'''

Example:

sh 'kubectl apply -f deployment.yaml'
sleep time: 30, unit: 'SECONDS'
sh 'kubectl get pods'

Takeaway: Prefer the Jenkins sleep step for pipeline waits; use sleep inside sh only when the delay is part of a shell script.