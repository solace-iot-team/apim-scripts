
# Usage:
# cp template.source.env.sh source.env.sh
# vi source.env.sh
# <enter values>
# source source.env.sh

scriptDir=$(pwd)

export APSS_EXTERNAL_APPS_ORGANIZATION_ID="{organization-id}"

# Show values
env | grep APSS
