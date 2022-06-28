#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ec2-user/credit-app

#navigate into our working directory where we have all our github files
cd /home/ec2-user/credit-app

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
#npm i -g pm2

# npm install  && npm run build && npm run start:prod

npm install

npm install pm2 -g

npm run build

pm2 start dist/main.js


# pm2 start npm --name "sweetcollective" -- start

pm2 startup

pm2 save

pm2 restart all



#pm2 start dist/main.js




#start our node app in the background
#node app.js > app.out.log 2> app.err.log < /dev/null & 