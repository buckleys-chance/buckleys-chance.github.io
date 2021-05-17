
library(data.table)

D = fread('/home/luke/Documents/Buckley\'s Chance/buckleys.pub/src/posts/lockdown/data-HALY.csv')

D$isVirus = (D$effect == "COVID-19")

D$HALY = -1*D$HALY

D = D[,.(sum = sum(HALY)),
      by = c("strategy", "v1trans", "v2trans", "vUptake", "relax", "R0", "isVirus")]

D = D[,.(virus = sum(HALY)),
      by = c("strategy", "v1trans", "v2trans", "vUptake", "relax", "R0", "isVirus")]

Dvirus = D[isVirus == T]
Dother = D[isVirus == F]

Dvirus$virus = Dvirus$sum
Dother$other = Dother$sum

Dvirus$isVirus = NULL
Dother$isVirus = NULL
Dvirus$sum = NULL
Dother$sum = NULL

D = merge(Dvirus, Dother)

write.csv(D, file = '/home/luke/Documents/Buckley\'s Chance/buckleys.pub/src/posts/lockdown/data-optimisation.csv', na = '', row.names = F)

D = expand.grid(
  sum = as.numeric(100*(1:70)),
  frac = 0.01*(0:100)
)

D$x = as.numeric(D$sum) * D$frac
D$y = D$sum * (1-D$frac)
D$frac = NULL

write.csv(D, file = '/home/luke/Documents/Buckley\'s Chance/buckleys.pub/src/posts/lockdown/data-isoharms.csv', na = '', row.names = F)
