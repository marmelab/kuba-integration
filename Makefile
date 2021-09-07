pem = ~/.ssh/kuba-key.pem
user = ubuntu
host = ec2-3-15-224-102.us-east-2.compute.amazonaws.com

install:
	yarn install
	yarn build

run:
	yarn start

ssh:
	ssh -i ${pem} ${user}@${host}
  	
deploy:
	rsync --delete -r -e "ssh -i ${pem}" --filter=':- .gitignore' \
	./ ${user}@${host}:~/kuba
	ssh -i ${pem} ${user}@${host} \
	'cd kuba &&\
	make install &&\
	make run'