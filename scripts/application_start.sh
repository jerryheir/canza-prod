#!/bin/bash

#give permission for everything in the canza-app directory
sudo chmod -R 777 /home/ec2-canza-user/canza-app
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-canza-user

# Download and install
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
# Fix permissions
sudo chmod +x /usr/local/bin/docker-compose

#navigate into our working directory where we have all our github files
cd /home/ec2-canza-user/canza-app

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#up containers
docker-compose up -d

#start our node app in the background
docker-compose up --build > app.out.log 2> app.err.log < /dev/null & 