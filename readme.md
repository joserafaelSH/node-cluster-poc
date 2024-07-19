## Processando dados com NODE

1. Simulando uma tabela de logs, inicialmente populamos o banco com 1000000 linhas

2. Subdividimos a tarefa de leitura em N clusters dentro do NODE

3. Fazemos uma analise :

   - Verificamos se os dados sao validos "nao negativos"
   - Uso de disco > 85: fila de notificacao de uso de disco
   - Temperatura > 80: fila de notificacao de temperatura alta
   - Uso de ram > 80: fila de notificacao de uso de ram alto
   - Uso de cpu > 70 e ram > 70 : fila de notificacao de uso de cpu e ram alto

4. Enviamos os dados para uma fila responsavel por transferir esses dados para outra aplicacao

5. Caso algo quebre no precosse de analise, enviamos os dados para uma fila morta(resilience), onde ao final do processo pode ser utilizado para identificar problemas.

Dividir a tarefa em clusters diminui bastante o tempo de processamento, porem o tempo de alocal e finalizar cada cluster tambem deve ser
considerado quando comparado comuma aplicacao simples
