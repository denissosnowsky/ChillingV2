-include .env

.PHONY: test

build:; forge build

test:; forge test

test-l:; forge test -vvvv

coverage:; forge coverage

deployLocal:; forge script script/DeployChilling.s.sol --rpc-url http://127.0.0.1:8545

deployGanche:; forge script script/DeployChilling.s.sol --rpc-url http://127.0.0.1:7545 --private-key 0x9b21c0c40a363357976d8bd431399075c59675b137ac2fbaee0045bbda8b6fed --broadcast