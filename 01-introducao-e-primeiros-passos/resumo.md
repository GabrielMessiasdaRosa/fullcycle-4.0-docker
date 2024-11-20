# Introduçao aos containers e Docker

## O que sao containers

Um container é uma unidade de software que reúne o código e suas dependências, garantindo que a aplicação funcione de maneira consistente em qualquer ambiente, graças ao isolamento que ele oferece.

## Caracteristicas dos containers

- *Imutabilidade*: Construidos a partir de imagens estaveis, garantindo consistencia nos ambientes.

- *Isolamento*: Operam em espaços separados, com recursos independentes, como sistema de arquivos e rede.

- *Leveza* Compartilham o kerner do SO do Host, reduzindo consimo de recursos em comparaçao a maquinas virtuais.

- *Inicializaçao rapida*: Sem a necessidade de um sistema operacional completo, iniciam quase que instantaneamente. 

- *Eficiencia*: Permitem alta densidade de execuçoes em um unico host;

- *Portabilidade*: Mitigam o problema de diferenças entre desenvolvimento, staging e produçao, produçao.

## Containers vs VM's

- Containers sao leves ew rapidos, compartilhando o kernel do host, enquanto vms possuem sistemas operacionais completos, maior overhead ( matar uma formiga com uma bazooka) e inicializaçao mais lenta. 

- Ambos oferecem isolamento, mas containers sao mais eficientes e permitem maior escalabilidade. 

## Docker

### Historia: 
Criada em 2013 pela dotCloud (atual Docker inc), tornou-se open source e popularizou a utilizaçao de containers. 

### Principais ferramentas:
- *Docker Engine*: Core do docker, para criar e gerenciar containers.
- *Docker CE*: Versao gratuita e comunitaria.
- *Docker Desktop*: Ambiente integrado para desenvolvimento ( NAO UTILIZAR EM AMBIENTE DE DESENVOLVIMENTO LINUX, É HERESIA!!!)

## Open Container Initiative (OCI)
- Fundada em 2015, define padroes abertos para containers e runtimes, promovendo a interoperabilidade e evitanto lock-in com fornecedores especificos.

TLDR; Containers, com muita ajuda do Docker, revolucionaram a forma de desenvolver e implantar aplicaçoes. A OCI amplia a adoçao da tecnologia tornando containers um ecossistema mais robusto, eficiente e integrado. 